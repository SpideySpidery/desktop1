var neonColors = ['#FF00FF', '#00FFFF', '#FFFF00', '#FFA500', '#FF00FF', '#00FF00'];

var Partallan = (function(window){
  
  var W = window.innerWidth-16,
      H = window.innerHeight-9,
      text = "YOUR TEXT",
      stage = new PIXI.Container(),
      renderer = PIXI.autoDetectRenderer(W, H, {view:document.getElementById("canvas"), backgroundColor : 00000000, antialias : true, résolution: 2}),
      
      //Play with this parameter for the number of particle 
      //lower make more particle.
      skipCount = renderer instanceof PIXI.WebGLRenderer ? 2 : 7,
      particlesLength = 0,
      mouseX= -100,
      mouseY = -100,
      PI_2 = Math.PI*2,
      particles = [],
      
      //Play with this parameter for the particle speed
      viscosity   = 0.001,
      minDistSq = 3000;


  var explode = false;
      
  var _private = {
    randomise: function(min,max){
      return Math.floor(Math.random()*(max-min+1)+min);
    },
    setrequest: function(){
      window.requestAnimFrame = (function(){
        return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
      })();
    },
  };
  
  var Partallan = {
    init: function(textInput){
      text = textInput;
      _private.setrequest();
      this.writeText();
    },
    writeText: function(){
      var textSample = new PIXI.Text(text, { font: '100px Calibri, sans-serif', fill: 'black', align: 'left' });
      textSample.position.x = (W/2) - (textSample.width/2);
      textSample.position.y = (H/2) - (textSample.height/2);

      // Now, we need to save the positions of black pixels and then use it to move particule
      var imageData = textSample.context.getImageData(0, 0, textSample.width,textSample.width);
      var data = imageData.data;


      // We'll now iterate over the data array going through rows and columns
      // Instead of reading each pixel, we can skip over some to increase the performance
      for (var i = 0; i < imageData.height; i += skipCount) {
        for (var j = 0; j < imageData.width; j += skipCount) {
          var color = data[(j * imageData.width * 4) + (i * 4) - 1];
          // Now if the color is black, we'll do our stuff
          if(color === 255) {
            particles[particles.length] = this.createParticle();
            particles[particles.length - 1].setPos(i+((W/2) - (textSample.width/2)), j+((H/2) - textSample.height-40));
          }
        }
      }

      particlesLength = particles.length;

      // ctx.shadowBlur = 6;
      // ctx.shadowColor = '#CCC';
      renderer.view.onmousemove = function(evt){
        mouseX = evt.clientX;
        mouseY = evt.clientY;
      };
    },
    
    createParticle: function(){
      var particle = {};
      function getRandomNeonColor() {
        return neonColors[Math.floor(Math.random() * neonColors.length)];
      }
      particle.random = Math.random();
      particle.valX = 0;
      particle.valY = 0;
      particle.vitesse = _private.randomise(3,10)/1000;
      particle.degree = Math.random() * 2;
      particle.rayon = Math.random() * 2;
      particle.direct = Math.random() < 0.5 ? (particle.vitesse=particle.vitesse*(-1)) : true;
      particle.r = _private.randomise(1,3);
      particle.opacity = Math.random();
      particle.mass = 0.05 + Math.random() * 0.9;
      particle.x = 10;
      particle.y = 10;
      particle.fx = 0;
      particle.fy = 0;
      particle.vx = 0;
      particle.vy = 0;
      particle.ox = 0;
      particle.oy = 0;
      particle.dx = 0;
      particle.dy = 0;
      particle.dSq = 0;
      particle.f = 0;
      particle.a = 0;
      particle.pointTexture = new PIXI.Texture.fromImage("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QzI5N0RBNUIyNzI1MTFFNUEyM0NGMUQzQTNGN0U3MDciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QzI5N0RBNUMyNzI1MTFFNUEyM0NGMUQzQTNGN0U3MDciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDMjk3REE1OTI3MjUxMUU1QTIzQ0YxRDNBM0Y3RTcwNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDMjk3REE1QTI3MjUxMUU1QTIzQ0YxRDNBM0Y3RTcwNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpC1KzoAAAA/SURBVHjaYszNzZVjYGCYA8SWQHwciFNYgMRcIHZhgABXIF7IBCQsGFCBFUjwBJrgMZBgMhDvAeKvUDoBIMAAKs0KaIFOO1cAAAAASUVORK5CYII=");
      particle.pixiCircle = new PIXI.Sprite(particle.pointTexture, {x:0, y:0, width:5, height:5});
      particle.pixiCircle.scale.x = particle.random;
      particle.pixiCircle.scale.y = particle.random;
      particle.pixiCircle.alpha = particle.random > .99 ? 1 : Math.random();
      particle.pixiCircle.tint = parseInt(getRandomNeonColor().replace(/^#/, ''), 16);
      stage.addChild(particle.pixiCircle);
      // create a filter

      

      // Finally a function to set particle's function and save original pos
      particle.setPos = function(x, y) {
        this.ox = x;
        this.oy = y;
        this.x = _private.randomise(-100,W+100);
        this.y = _private.randomise(-100,H+100);
      };

      //Function to (re)move particule
      particle.move = function(){
        this.dx = mouseX - this.ox;
        this.dy = mouseY - this.oy;
        this.dSqr = this.dx*this.dx + this.dy*this.dy;

        //if particule is in the repulsion area 
        if( this.dSqr < minDistSq ) {
            this.dx = mouseX - this.x;
            this.dy = mouseY - this.y;
            this.dSqr = this.dx*this.dx + this.dy*this.dy;
            
            // Force is proportional to distance
            this.f = this.dSqr / minDistSq;
            this.f = this.f < 0 ? 0 : this.f > 1 ? 1 : this.f;
            
            // Find angle for velocity
            this.a = Math.atan2(this.dy,this.dx);
            
            //attraction ou repulsion
            this.f = -this.f;
            
            // Sum forces
            this.fx += Math.cos(this.a) * this.f;
            this.fy += Math.sin(this.a) * this.f;
        }
        
        this.fx += (this.ox - this.x) * viscosity * this.mass;
        this.fy += (this.oy - this.y) * viscosity * this.mass;
        
        // Euler integration step
        this.vx += this.fx / this.mass;
        this.vy += this.fy / this.mass;
        
        this.x += this.vx;
        this.y += this.vy;
        
        // Dampen velocity
        this.vx *= 0.95;
        this.vy *= 0.95;
        
        // Clear forces
        this.fx = this.fy = 0;    
        // Compute squared distance

        //make particule move (turn) by itself
        this.valX = this.x+(this.rayon * Math.cos(Math.PI*this.degree));
        this.valY = this.y+(this.rayon * Math.sin(Math.PI*this.degree));
        //increment to the next degree
        this.degree+=this.vitesse;
        this.pixiCircle.position.x = this.valX;
        this.pixiCircle.position.y = this.valY;


      };
      return particle;
    },
    step: function(){
      for (var i = 0; i < particlesLength; i++) {
        particles[i].move();
      }
      renderer.render(stage);
      window.requestAnimFrame(Partallan.step);
    },
    start: function(){
      window.requestAnimFrame(Partallan.step);
    },
    setExplode : function(val){
      explode = val;
      if(val){
        minDistSq = 120000;
        mouseX = (W/2);
        mouseY = (H/2);
      }else{
        setTimeout(function(){
          minDistSq = 3000;
          mouseX = 0;
          mouseY = 0;
        }, 1500);
      }
    }
  };
  return Partallan;
})(window);


Partallan.init("SpideySpidery");
Partallan.start()
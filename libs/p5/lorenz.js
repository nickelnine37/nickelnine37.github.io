/**
 * 
 * The p5.EasyCam library - Easy 3D CameraControl for p5.js and WEBGL.
 *
 *   Copyright 2018 by Thomas Diewald (https://www.thomasdiewald.com)
 *
 *   Source: https://github.com/diwi/p5.EasyCam
 *
 *   MIT License: https://opensource.org/licenses/MIT
 * 
 * 
 * explanatory notes:
 * 
 * p5.EasyCam is a derivative of the original PeasyCam Library by Jonathan Feinberg 
 * and combines new useful features with the great look and feel of its parent.
 * 
 * 
 */
 

let easycam;
let particles = [];
let numMax = 700;
let t = 0;
let h = 0.009;
let currentParticle = 0;

// settings and presets
let parDef = {
Attractor: 'Lorenz',
p: 10.0,
r: 28.0,
b: 8.0/3.0,
ResetParticles: initSketch,
Preset: function() {  this.p = 10.0; this.r = 28.0; this.b = 8.0/3.0; },
};

let p = 10.0;
let r = 28.0;
let b = 8.0 / 3.0;

let x = 1.1;
let y = 1.1;
let z = -0.01;

let points = new Array();

function setup() { 
 
    pixelDensity(1);
    
    /*
    // create gui (dat.gui)
    let gui = new dat.GUI();
    gui.add(parDef, 'Attractor');
    gui.add(parDef, 'p'   , -10, 10  ).listen();
    gui.add(parDef, 'r'   , 0, 28  ).listen();
    gui.add(parDef, 'b'   , -3, 3  ).listen();
    gui.add(parDef, 'ResetParticles'  );
    gui.add(parDef, 'Preset'  );
    gui.close();
     */
  
  let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setAttributes('antialias', true);
  
  console.log(Dw.EasyCam.INFO);
  
  easycam = new Dw.EasyCam(this._renderer, {distance : 60});
    

    for(let i = 0; i< 3000; i++){
        let dt = 0.03;
        let dx = speed*(p * (-x + y) ) * dt;
        let dy = speed*( -x * (z+20) + r * x - y ) * dt;
        let dz = speed*( x * y - b * (z+20) ) * dt;
        x = x + dx;
        y = y + dy;
        z = z + dz;
        
        points.push(new p5.Vector(x, y, z));
    }
    
    // place initial samples
    //initSketch();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    easycam.setViewport([0, 0, windowWidth, windowHeight]);
    
    // place initial samples
    initSketch();
}

function initSketch(){
    let m = 40;
    for (let i=0; i<numMax; i++) {
        particles[i] = new Particle(random(-m, m), random(-m, m), random(-m, m)+20, t, h);
    }
}

function draw(){
    
  // projection
  perspective(60 * PI/180, width/height, 1, 5000);
  
  // BG
  background(0);
    rotateX(1.2);
    rotateZ(-0.5);
    translate(0,-4,-6);
    let hu = 0;
    beginShape(POINTS);
    for (let v of points) {
        stroke(128, 200, 255);
        strokeWeight(0.2);
        vertex(v.x, v.y, v.z);
        
        hu += 1;
        if (hu > 255) {
            hu = 0;
        }
    }
    endShape();
   
    /*
  //updating and displaying the particles
    for (let i=particles.length-1; i>=0; i-=1) {
        let p = particles[i];
        p.update();
        p.display();
        let box = 60;
        if ( p.x > box ||  p.y > box || p.z > box || p.x < -box ||  p.y < -box || p.z < -box ) {
            particles.splice(i,1);
            currentParticle--;
            particles.push(new Particle(random(-20,20),random(-20,20), random(-20,20)+20, t,h) );
        }
    }*/
  
  // gizmo
  //strokeWeight(0.1);
  //stroke(255, 32,  0); line(0,0,0,2,0,0);
  //stroke( 32,255, 32); line(0,0,0,0,2,0);
  //stroke(  0, 32,255); line(0,0,0,0,0,2);

}

let speed = 0.3;
function componentFX(t, x, y, z){
    return speed * ( parDef.p * (-x + y) );//Change this function
}

function componentFY(t, x, y, z){
    return speed * (  -x * z + parDef.r * x - y );//Change this function
}

function componentFZ(t, x, y, z){
    return speed * ( x * y - parDef.b * z );//Change this function
}

//Particle definition and motion
class Particle{
    
	constructor(_x, _y, _z, _t, _h){
    this.x = _x;
    this.y = _y;
    this.z = _z;
    this.time = _t;
    this.radius = random(0.2,0.2);
    this.h = _h;
    this.op = random(190,200);
    this.r = random(20,204);
    this.g = random(180,192);
    this.b = random(190,255);
	}
    
    update() {
        this.k1 = componentFX(this.time, this.x, this.y, this.z);
        this.j1 = componentFY(this.time, this.x, this.y, this.z);
        this.i1 = componentFZ(this.time, this.x, this.y, this.z);
        this.k2 = componentFX(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1, this.z + 1/2 * this.h * this.i1);
        this.j2 = componentFY(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1, this.z + 1/2 * this.h * this.i1);
        this.i2 = componentFZ(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k1, this.y + 1/2 * this.h * this.j1, this.z + 1/2 * this.h * this.i1);
        this.k3 = componentFX(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2, this.z + 1/2 * this.h * this.i2);
        this.j3 = componentFY(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2, this.z + 1/2 * this.h * this.i2);
        this.i3 = componentFZ(this.time + 1/2 * this.h, this.x + 1/2 * this.h * this.k2, this.y + 1/2 * this.h * this.j2, this.z + 1/2 * this.h * this.i2);
        this.k4 = componentFX(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3, this.z + this.h * this.i3);
        this.j4 = componentFY(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3, this.z + this.h * this.i3);
        this.i4 = componentFZ(this.time + this.h, this.x + this.h * this.k3, this.y + this.h * this.j3, this.z + this.h * this.i3);
        this.x = this.x + this.h/6 *(this.k1 + 2 * this.k2 + 2 * this.k3 + this.k4);
        this.y = this.y + this.h/6 *(this.j1 + 2 * this.j2 + 2 * this.j3 + this.j4);
        this.z = this.z + this.h/6 *(this.i1 + 2 * this.i2 + 2 * this.i3 + this.i4);
        this.time += this.h;
    }
    
    display() {
        push();
        translate(this.x, this.y, this.z-20);
        ambientMaterial(this.r, this.b, this.g);
        noStroke();
        sphere(this.radius, 6, 6);
        pop();
    }
    
}

let particles = [];
let foodmap;
let recording = false;
let count = 8000;
let timestamp;
let L = 10
let SENSOR_DIST = 10;
let SENSOR_ROT = 15;
let SENSOR_ROT_MULTIPLIER = 1.5;

function setup() {
  createCanvas(600, 600);
  foodmap = new Foodmap(width, height);

  timestamp = year() + nf(month(), 2) + nf(day(), 2) + "-" + 
              nf(hour(), 2) + nf(minute(), 2) + nf(second(), 2);

  for (let i = 0; i < count; i++) {
    let p = new Particle(particles);
    let newPos = createVector(random(width), random(height));
    p.setMass(100.0);
    p.setLoc(newPos);
    particles.push(p);
  }
}

function draw() {
  foodmap.update().draw();

  foodmap.map.loadPixels();
  for (let particle of particles) {
    particle.update();
    foodmap.map.set(int(particle.loc.x), int(particle.loc.y), 255);
  }
  foodmap.map.updatePixels();

  // record();
}

function flood() {
  fill(0, 0.01);
  noStroke();
  rectMode(CORNER); // Equivalent to LEFT
  rect(0, 0, width, height);
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    recording = !recording;
  }
}

function record() {
  if (recording) {
    saveCanvas(`output_${timestamp}_slime_mold_${nf(frameCount, 4)}.png`);
  }

  // Stop after 900 frames (adjust as needed)
  if (frameCount === 900) {
    noLoop();
    console.log("Simulation completed. Stopping.");
  }
}

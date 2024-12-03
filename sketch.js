let particles = [];
let foodmap;
let recording = false;
let count = 8000;
let timestamp;
let L = 10
let SENSOR_DIST = 10;
let SENSOR_ROT = 15;
let SENSOR_ROT_MULTIPLIER = 1.5;
let base_layer;
let base_image
let t=0;
let food_store_count = 100;
let food_stores = [];

function setup() {
  createCanvas(600, 600);
  create_food_stores();
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

function create_food_stores() {
  for (let i = 0; i < food_store_count; i++) {
    let food_store = { x: random(width), y: random(height), r: random(1, 10) };
    food_stores.push(food_store);
  }
}

function add_food_to_map() {
  for (let food_store of food_stores) {
    base_layer.fill(255);
    base_layer.noStroke();
    base_layer.ellipse(food_store.x, food_store.y, food_store.r);
  }

  base_layer.updatePixels(); // Update the pixels after drawing
  console.log("Food stores added to base image."); // Debug
}

function draw() {
  foodmap.update().draw();

  foodmap.map.loadPixels();
  for (let particle of particles) {
    particle.update();
    foodmap.map.set(int(particle.loc.x), int(particle.loc.y), 255);
  }
  foodmap.map.updatePixels();

  if(t%10==0){
    foodmap.add_food();
  }
  t++;
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

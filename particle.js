class Particle {
  constructor(family) {
    this.loc = createVector(random(width), random(height));
    this.prevLoc = createVector(random(width), random(height));
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.rot = radians(random(360));
    this.mass = 1.0; // Avoid division by zero
    this.sensorRot = SENSOR_ROT;
    this.rotMult = SENSOR_ROT_MULTIPLIER;
    this.sensorDist = SENSOR_DIST;
    this.margin = 10;
    this.family = family;
    this.sensors = [
      new Sensor(this.loc, this.sensorDist, this.rot),
      new Sensor(this.loc, this.sensorDist, this.rot + radians(this.sensorRot)),
      new Sensor(this.loc, this.sensorDist, this.rot - radians(this.sensorRot)),
    ];
  }

  update() {
    if (frameCount > 1) this.prevLoc = this.loc.copy();
    this.acceleration.normalize();
    this.velocity.add(this.acceleration);
    this.velocity.normalize();
    this.loc.add(this.velocity);
    this.acceleration.mult(0);
    this.correctLoc();
    this.calcRot();
    this.sensors[0].update(this.loc, this.rot);
    this.sensors[1].update(this.loc, this.rot + radians(this.sensorRot));
    this.sensors[2].update(this.loc, this.rot - radians(this.sensorRot));
    this.forage(this.sensors[0], this.sensors[1], this.sensors[2]);
    return this;
  }

  forage(a, b, c) {
    let valA = red(a.val); // Middle
    let valB = red(b.val); // Right
    let valC = red(c.val); // Left
    let force = p5.Vector.sub(this.loc, this.prevLoc);
    if (valA > valB && valA > valC) {
      // No change
    } else if (valB > valA && valB > valC) {
      // Go Right
      force.rotate(radians(this.sensorRot * this.rotMult));
    } else if (valC > valA && valC > valB) {
      // Go Left
      force.rotate(radians(-this.sensorRot * this.rotMult));
    }
    this.applyForce(force);
    return this;
  }

  calcRot() {
    let current = p5.Vector.sub(this.loc, this.prevLoc);
    this.rot = current.heading();
    return this;
  }

  setLoc(loc) {
    this.loc = loc;
    return this;
  }

  setAcceleration(acceleration) {
    this.acceleration = acceleration;
    return this;
  }

  setVelocity(velocity) {
    this.velocity = velocity;
    return this;
  }

  setMass(mass) {
    this.mass = mass;
    return this;
  }

  applyForce(force) {
    let f = force.copy();
    f.div(this.mass);
    this.acceleration.add(f);
    return this;
  }

  correctLoc() {
    if (this.loc.x > width - this.margin || this.loc.x < this.margin || 
        this.loc.y > height - this.margin || this.loc.y < this.margin) {
      this.loc.set(random(width), random(height));
    }
    return this;
  }

  draw() {
    this.sensors.forEach(sensor => sensor.draw());

    push();
      translate(this.loc.x, this.loc.y);
      rotate(this.rot);
      stroke(255, 255, 255, 2);
      line(0, 0, L, 0);
    pop();

    stroke(255);
    point(this.loc.x, this.loc.y);
    return this;
  }
}

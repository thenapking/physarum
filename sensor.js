class Sensor {
  constructor(loc, dist, rot) {
    this.loc = loc; // PVector equivalent in p5.js
    this.dist = dist;
    this.rot = rot;
    this.val = color(0); // Initialize color
    this.updateVal();
  }

  update(loc, rot) {
    this.loc = loc;
    this.rot = rot;
    this.correctPos();
    this.correctLoc();
    this.updateVal();
    return this;
  }

  updateVal() {
    const x = int(this.loc.x);
    const y = int(this.loc.y);
    this.val = foodmap.map.get(x, y);
    return this;
  }

  correctPos() {
    this.loc = createVector(
      this.loc.x + this.dist * cos(this.rot),
      this.loc.y + this.dist * sin(this.rot)
    );
    return this;
  }

  setLoc(loc) {
    this.loc = loc;
    return this;
  }

  correctLoc() {
    if (this.loc.x > width) {
      this.loc.x = 0;
    }
    if (this.loc.x < 0) {
      this.loc.x = width;
    }
    if (this.loc.y > height) {
      this.loc.y = 0;
    }
    if (this.loc.y < 0) {
      this.loc.y = height;
    }
    return this;
  }

  setVal(val) {
    this.val = val;
    return this;
  }

  draw() {
    stroke(0,0,0,10);
    fill(this.val);
    rectMode(CENTER);
    rect(this.loc.x, this.loc.y, L, L);
    return this;
  }
}

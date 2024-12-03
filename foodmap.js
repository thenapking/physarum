class Foodmap {
  constructor(w, h) {
    this.map = loadImage("tricorn.jpg");
    this.blur = 0.002; // .02 is good
    this.decay = 0.1; // .1 is good
    const v = 1.00 / 9.0;
    this.kernel = [
      [v, v, v],
      [v, v, v],
      [v, v, v],
    ];
  }

  update() {
    this.map.loadPixels();

    // Diffuse
    for (let y = 1; y < this.map.height - 1; y++) {
      for (let x = 1; x < this.map.width - 1; x++) {
        let sum = 0; // Kernel sum for this pixel
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            // Calculate the adjacent pixel for this kernel point
            const pos = 4 * ((y + ky) * this.map.width + (x + kx));
            // Grayscale value (red channel is used as they are identical)
            const val = this.map.pixels[pos];
            // Multiply adjacent pixels based on the kernel values
            sum += this.kernel[ky + 1][kx + 1] * val;
          }
        }

        // Set the gray value based on the sum from the kernel
        const currentPos = 4 * (y * this.map.width + x);
        const blended = lerp(sum, this.map.pixels[currentPos], this.blur);
        this.map.set(x, y, blended);
      }
    }


    // Decay
    for (let y = 0; y < this.map.height; y++) {
      for (let x = 0; x < this.map.width; x++) {
        const pos = 4 * (y * this.map.width + x);
        const decayed = lerp(this.map.pixels[pos], 0, this.decay);
        this.map.set(x, y, decayed);
      }
    }

    this.map.updatePixels();

    return this;
  }

  add_food(){
    this.map.loadPixels();
    for (let food_store of food_stores) {
      let x = int(food_store.x);
      let y = int(food_store.y);
      let r = int(food_store.r);
      for (let ky = -r; ky <= r; ky++) {
        for (let kx = -r; kx <= r; kx++) {
          if (x + kx < 0 || x + kx >= this.map.width || y + ky < 0 || y + ky >= this.map.height) {
            continue;
          }
          // const pos = 4 * ((y + ky) * this.map.width + (x + kx));
          this.map.set(x + kx, y + ky, 255);
        }
      }
    }
    this.map.updatePixels();
  }

  draw() {
    image(this.map, 0, 0, width, height);
    return this;
  }
}

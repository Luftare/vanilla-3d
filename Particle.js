class Particle {
  constructor(pos, time) {
    this.position = pos.clone();
    this.time = time;
  }

  update(dt) {
    this.time -= dt;
  }

  draw(cam) {}
}

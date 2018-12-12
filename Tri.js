class Tri {
  constructor(a, b, c, tone = [1, 1, 1]) {
    this.alpha = 1;
    this.nodes = [a, b, c];
    this.tone = [...tone];
    this.updateColor();
  }

  setAlpha(a) {
    this.alpha = a;
  }

  updateColor() {
    const [a, b, c] = this.nodes;
    const normal = b
      .clone()
      .substract(a)
      .cross(c.clone().substract(a))
      .normalize();
    const dot = Math.abs(normal.dot(world.light));
    const contrast = 0.6;
    const R = Math.min(
      255,
      Math.floor(Math.pow(this.tone[0], contrast) * 255 * dot)
    );
    const G = Math.min(
      255,
      Math.floor(Math.pow(this.tone[1], contrast) * 255 * dot)
    );
    const B = Math.min(
      255,
      Math.floor(Math.pow(this.tone[2], contrast) * 255 * dot)
    );
    this.color = `rgb(${R},${G},${B})`;
  }

  center() {
    return new V3(
      this.nodes.reduce((acc, n) => acc + n.x, 0) / 3,
      this.nodes.reduce((acc, n) => acc + n.y, 0) / 3,
      this.nodes.reduce((acc, n) => acc + n.z, 0) / 3
    );
  }

  translate(vec) {
    this.nodes.forEach(n => n.add(vec));
  }

  projected(cam) {
    return this.rotatedAboutCamera(cam).map(n => {
      const dX = n.x - cam.position.x;
      const dY = n.y - cam.position.y;
      const dZ = n.z - cam.position.z;
      return {
        x: cam.width / 2 - (dY * cam.VD) / dX,
        y: cam.height / 2 - (dZ * cam.VD) / dX,
        z: dX,
        color: this.color,
      };
    });
  }

  rotatedAboutCamera(cam) {
    return this.nodes.map(n =>
      n
        .clone()
        .substract(cam.position)
        .rotateZ(cam.phi)
        .rotateY(cam.theta - Math.PI / 2)
        .add(cam.position)
    );
  }

  drawProjected(cam) {
    const nodes = this.projected(cam);
    if (nodes.find(n => n.z < 0)) return;
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    nodes.forEach((n, i) => {
      if (i === 0) {
        ctx.moveTo(n.x, n.y);
      } else {
        ctx.lineTo(n.x, n.y);
      }
      if (i === 2) {
        ctx.closePath();
        ctx.fillStyle = n.color;
        ctx.fill();
      }
    });
    ctx.globalAlpha = 1;
  }
}

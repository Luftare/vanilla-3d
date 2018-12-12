class Camera {
  constructor({
    VD = 700,
    position = new V3(),
    theta = Math.PI / 2,
    phi = 0,
    thetaClamp = 0.9,
    width = 300,
    height = 100,
  }) {
    this.VD = VD;
    this.position = position.clone();
    this.width = width;
    this.height = height;
    this.theta = theta;
    this.phi = phi;
    this.thetaClamp = thetaClamp;
    this.zoom = 1;
  }

  render() {
    canvas.width = canvas.width;
    ctx.save();
    ctx.setTransform(
      this.zoom,
      0,
      0,
      this.zoom,
      (-(this.zoom - 1) * canvas.width) / 2,
      (-(this.zoom - 1) * canvas.height) / 2
    );

    tris
      .sort(
        (a, b) =>
          b.center().sqDistance(this.position) -
          a.center().sqDistance(this.position)
      )
      .forEach(t => {
        t.drawProjected(this);
      });
    ctx.restore();
    this.drawHUD();
  }

  drawHUD() {
    const cX = canvas.width / 2;
    const cY = canvas.height / 2;
    const l = this.zoom !== 1 ? canvas.width : 20;
    ctx.beginPath();
    ctx.moveTo(cX - l, cY);
    ctx.lineTo(cX + l, cY);
    ctx.moveTo(cX, cY + l);
    ctx.lineTo(cX, cY - l);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
    if (this.zoom > 1) {
      ctx.beginPath();
      ctx.arc(cX, cY, canvas.width / 2, 0, Math.PI * 2);
      ctx.lineWidth = canvas.width / 2;
      ctx.stroke();
    }
  }
}

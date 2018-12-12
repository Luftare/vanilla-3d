class Model {
  constructor(tone = [3, 3, 8]) {
    this.alpha = 1;
    this.nodes = [];
    this.tris = [];
    this.tone = tone;
    this.resetNodes();
  }

  createTris(n) {
    for (var i = 0; i < n; i++) {
      const tri = new Tri(new V3(), new V3(), new V3(), this.tone);
      this.tris.push(tri);
    }
  }

  updateTris() {
    this.nodes.forEach((n, i) => {
      if (i % 3 === 0) {
        this.tris[i / 3].alpha = this.alpha;
        this.tris[i / 3].nodes[0].fromVector(this.nodes[i]);
        this.tris[i / 3].nodes[1].fromVector(this.nodes[i + 1]);
        this.tris[i / 3].nodes[2].fromVector(this.nodes[i + 2]);
        this.tris[i / 3].updateColor();
      }
    });
  }

  resetNodes() {
    this.nodes = [];
  }

  createNodes() {
    return [];
  }

  scale(s) {
    this.nodes.forEach(n => n.scale(s));
  }

  rotateZ(a) {
    this.nodes.forEach(n => n.rotateZ(a));
  }

  translate(v) {
    this.nodes.forEach(n => n.add(v));
  }
}

class BulletModel extends Model {
  constructor() {
    super();
    this.tone = [10, 0, 5];
    this.createTris(this.nodes.length / 3);
  }

  createNodes() {
    const r = 0.5;
    return [
      new V3(
        Math.cos((Math.PI * 2 * 1) / 3) * r,
        Math.sin((Math.PI * 2 * 1) / 3) * r,
        0
      ),
      new V3(
        Math.cos((Math.PI * 2 * 2) / 3) * r,
        Math.sin((Math.PI * 2 * 2) / 3) * r,
        0
      ),
      new V3(0, 0, 1),

      new V3(
        Math.cos((Math.PI * 2 * 2) / 3) * r,
        Math.sin((Math.PI * 2 * 2) / 3) * r,
        0
      ),
      new V3(
        Math.cos((Math.PI * 2 * 3) / 3) * r,
        Math.sin((Math.PI * 2 * 3) / 3) * r,
        0
      ),
      new V3(0, 0, 1),

      new V3(
        Math.cos((Math.PI * 2 * 3) / 3) * r,
        Math.sin((Math.PI * 2 * 3) / 3) * r,
        0
      ),
      new V3(
        Math.cos((Math.PI * 2 * 1) / 3) * r,
        Math.sin((Math.PI * 2 * 1) / 3) * r,
        0
      ),
      new V3(0, 0, 1),
    ];
  }
}

class PlayerModel extends Model {
  constructor() {
    super();
    this.createTris(this.nodes.length / 3);
  }

  async fade() {
    let c = 10;
    while (c--) {
      this.alpha = c / 5;
      await timeout(100);
    }
  }

  async appear() {
    let c = 10;
    while (c--) {
      this.alpha = (5 - c) / 5;
      await timeout(100);
    }
  }

  setTheta(t) {
    this.nodes[this.nodes.length - 1] = new V3(0.4, 0, 0)
      .rotateY(t + Math.PI / 2)
      .addZ(0.7);
  }

  createNodes() {
    const r = 0.2;
    return [
      new V3(
        Math.cos((Math.PI * 2 * 1) / 3) * r,
        Math.sin((Math.PI * 2 * 1) / 3) * r,
        0
      ),
      new V3(
        Math.cos((Math.PI * 2 * 2) / 3) * r,
        Math.sin((Math.PI * 2 * 2) / 3) * r,
        0
      ),
      new V3(0, 0, 1),

      new V3(
        Math.cos((Math.PI * 2 * 2) / 3) * r,
        Math.sin((Math.PI * 2 * 2) / 3) * r,
        0
      ),
      new V3(
        Math.cos((Math.PI * 2 * 3) / 3) * r,
        Math.sin((Math.PI * 2 * 3) / 3) * r,
        0
      ),
      new V3(0, 0, 1),

      new V3(
        Math.cos((Math.PI * 2 * 3) / 3) * r,
        Math.sin((Math.PI * 2 * 3) / 3) * r,
        0
      ),
      new V3(
        Math.cos((Math.PI * 2 * 1) / 3) * r,
        Math.sin((Math.PI * 2 * 1) / 3) * r,
        0
      ),
      new V3(0, 0, 1),

      //gun
      new V3(0, 0, 0.7),
      new V3(0, 0, 0.6),
      new V3(0.4, 0, 0.6),
    ];
  }
}

class World {
  constructor() {
    this.idCounter = 1;
    this.state = {
      players: [],
      bullets: [],
      trees: [],
    };
    this.boundaries = new V3(1680, 1680, 5000);
    this.light = new V3(0.2, 0.2, 1).normalize().scale(0.7);
    this.gravity = new V3(0, 0, -700);
  }

  generateId() {
    return this.idCounter++;
  }

  update(dt) {
    this.state.players.forEach(p => p.update(dt));
    this.state.bullets.forEach(b => b.update(dt));
    this.state.bullets = this.state.bullets.filter(b => !b._remove);
  }

  setup() {
    this.createTrees();
    this.createFloor(this.boundaries.x, this.boundaries.y, 60);
    this.state.players.push(
      new AIPlayer(new V3(100, 100, 200), this.generateId())
    );
  }

  getFloorZ(x, y) {
    return (
      Math.cos(x * 0.01) * Math.cos(y * 0.015) * 70 +
      Math.sin(Math.PI / 3 + y * 0.0007 * x * 0.006) * 150 +
      Math.sin(Math.PI / 3 + y * 0.01) * 30 +
      0.2 * x
    );
  }

  createTrees() {
    for (var i = 0; i < 10; i++) {
      const x = Math.random() * world.boundaries.x;
      const y = Math.random() * world.boundaries.y;
      const tree = new Tree(x, y);
      this.state.trees.push(tree);
      tris.push(...tree.tris);
    }
  }

  createFloor(sizeX, sizeY, size) {
    const cx = Math.floor(sizeX / size);
    const cy = Math.floor(sizeY / size);

    const res = [];
    const tone = [0.4, 1, 0.2];
    for (var i = 0; i < cx; i++) {
      for (var j = 0; j < cy; j++) {
        tris.push(
          new Tri(
            new V3(i * size, j * size, this.getFloorZ(i * size, j * size)),
            new V3(
              i * size,
              j * size + size,
              this.getFloorZ(i * size, j * size + size)
            ),
            new V3(
              i * size + size,
              j * size + size,
              this.getFloorZ(i * size + size, j * size + size)
            ),
            tone
          )
        );
        tris.push(
          new Tri(
            new V3(i * size, j * size, this.getFloorZ(i * size, j * size)),
            new V3(
              i * size + size,
              j * size,
              this.getFloorZ(i * size + size, j * size)
            ),
            new V3(
              i * size + size,
              j * size + size,
              this.getFloorZ(i * size + size, j * size + size)
            ),
            tone
          )
        );
      }
    }
  }
}

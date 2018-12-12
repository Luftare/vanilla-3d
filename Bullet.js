class Bullet {
  constructor(pos, dir, parentId) {
    this.parentId = parentId;
    this.speed = 4000;
    this.r = 5;
    this.scale = this.r * 2;
    this.position = pos.clone();
    this.velocity = dir
      .clone()
      .normalize()
      .scale(this.speed);
    this.model = new BulletModel();
    tris.push(...this.model.tris);
  }

  update(dt) {
    this.velocity.scaledAdd(dt, world.gravity);
    this.position.scaledAdd(dt, this.velocity);
    this.handleCollisions(dt);
    this.updateModel(dt);
  }

  updateModel(dt) {
    this.model.resetNodes();
    this.model.scale(this.scale);
    this.model.translate(this.position);
    this.model.updateTris();
  }

  handleCollisions(dt) {
    if (this.position.z <= world.getFloorZ(this.position.x, this.position.y))
      this.destroy();

    const p1 = this.position;
    const p2 = p1.clone().scaledAdd(dt, this.velocity);
    //trees
    world.state.trees.forEach(t => {
      const r =
        (this.r + t.r) *
        Math.max(0, 1 + (t.position.z - this.position.z) / t.height);
      if (segmentIntersectsRadius(p1, p2, t.position, r)) {
        if (this.position.z < t.position.z + t.height) {
          this.destroy();
        }
      }
    });
    if (this._remove) return;
    //units
    world.state.players.forEach(p => {
      const r =
        (this.r + p.r) *
        Math.max(0, 1 + (p.position.z - this.position.z) / p.height);
      if (
        this.parentId !== p.id &&
        segmentIntersectsRadius(p1, p2, p.position, r)
      ) {
        if (
          this.position.z < p.position.z + p.height &&
          this.position.z > p.position.z
        ) {
          this.destroy();
          p.damageHandler(1);
        }
      }
    });
  }

  destroy() {
    this.model.tris.forEach(t => {
      t._remove = true;
    });
    this._remove = true;
  }
}

class Tree {
  constructor(x, y) {
    const getFloorZ = world.getFloorZ;
    const z = getFloorZ(x, y);
    const tone = [1, 0.8, 0];
    const h = 20 * Math.sin(Math.PI / 3);
    const dz = 1;
    this.height = 200;
    this.r = h;
    this.position = new V3(x, y, z);
    this.tris = [
      new Tri(
        new V3(x - h, y - h, getFloorZ(x - h, y - h) + dz),
        new V3(x - h, y + h, getFloorZ(x - h, y + h) + dz),
        new V3(x, y, getFloorZ(x, y) + this.height + dz),
        tone
      ),
      new Tri(
        new V3(x + h, y, getFloorZ(x + h, y) + dz),
        new V3(x - h, y - h, getFloorZ(x - h, y - h) + dz),
        new V3(x, y, getFloorZ(x, y) + this.height + dz),
        tone
      ),
      new Tri(
        new V3(x + h, y, getFloorZ(x + h, y) + dz),
        new V3(x - h, y + h, getFloorZ(x - h, y + h) + dz),
        new V3(x, y, getFloorZ(x, y) + this.height + dz),
        tone
      ),
    ];
  }
}

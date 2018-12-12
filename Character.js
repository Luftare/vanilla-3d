class Character {
  constructor(pos) {
    this.jumped = false;
    this.speed = 200;
    this.position = pos.clone();
    this.velocity = new V3(0, 0, 0);
    this.theta = Math.PI / 2;
    this.phi = 0;
    this.r = 20;
    this.height = 150;
    this.color = [5, 0, 0];
    this.model = new PlayerModel();
    tris.push(...this.model.tris);
  }

  update() {}

  jump(dt) {
    this.position.z += 3;
    this.velocity.z = 500;
  }

  move(dt) {
    this.position.scaledAdd(dt, this.velocity);
  }

  updateModel(dt) {
    this.model.resetNodes();
    this.model.setTheta(-this.theta);
    this.model.rotateZ(-this.phi);
    this.model.scale(this.height);
    this.model.translate(this.position.clone().addX(0));
    this.model.updateTris();
  }
}

class Gun {
  constructor() {
    this.loaded = true;
    this.zooming = false;
  }

  shoot(pos, dir, parentId) {
    world.state.bullets.push(new Bullet(pos, dir, parentId));
  }
}

class Player extends Character {
  constructor(pos, id) {
    super(pos);
    this.dying = false;
    this.hp = 3;
    this.alpha = 1;
    this.cameraHeightFactor = 0.7;
    this.id = id;
    this.gun = new Gun();
    this.stats = this.createStats();
  }

  createStats() {
    return {
      hp: 3,
    };
  }

  damageHandler(dmg) {
    this.stats.hp--;
    if (this.stats.hp <= 0) {
      this.die();
    }
  }

  respawn() {
    this.dying = false;
    this.stats = this.createStats();
    const x = Math.random() * world.boundaries.x;
    const y = Math.random() * world.boundaries.y;
    this.position.set(x, y, world.getFloorZ(x, y) + 100);
    this.lookAt(
      world.boundaries
        .clone()
        .scale(0.5)
        .setZ(0)
    );
    this.theta = Math.PI / 2 - 0.3;
  }

  async die() {
    if (this.dying) return;
    this.dying = true;
    await this.model.fade();
    this.respawn();
    this.model.appear();
  }

  lookAt(v) {
    const to = new V3();
    to.set(v).substract(this.position);
    this.phi = -to.angleZ;
  }

  shoot() {
    this.gun.shoot(
      this.position.clone().addZ(this.height * this.cameraHeightFactor),
      new V3().fromAngles(-this.theta, -this.phi, -1),
      this.id
    );
  }

  applyPhysics(dt) {
    this.velocity.scaledAdd(dt, world.gravity);
  }

  handleCollisions(dt) {
    this.handleFloorCollision(dt);
    this.handleWorldBoundaries(dt);
    this.handconstreeCollision(dt);
  }

  handconstreeCollision(dt) {
    world.state.trees.forEach(t => {
      if (
        t.position.withinDistanceXY(this.position, t.r + this.r) &&
        this.position.z < t.position.z + t.height
      ) {
        const pushVec = this.position
          .clone()
          .setZ(0)
          .substract(t.position)
          .setZ(0)
          .setLength(t.r + this.r);
        this.position
          .setX(t.position.x)
          .setY(t.position.y)
          .add(pushVec);
      }
    });
  }

  handleFloorCollision(dt) {
    if (this.position.z < world.getFloorZ(this.position.x, this.position.y)) {
      this.jumped = false;
      this.velocity.z = 0;
      this.position.z = world.getFloorZ(this.position.x, this.position.y);
    }
    this.position.clampByVector(world.boundaries);
    this.position.clampByZero();
  }

  handleWorldBoundaries(dt) {
    this.position.clampByVector(world.boundaries);
  }
}

class AIPlayer extends Player {
  constructor(pos, id) {
    super(pos, id);
    this.stateDt = 20;
    this.states = [];
    this.tweenSpeed = 7;
  }

  handleNewState(state) {
    //update state buffer
    this.states.push(state);
    if (this.states.length > 5) this.states.shift();
    //movement
    const positionDelta = this.position.distance(state.position);
    const speed = Math.min(
      this.speed * 1.3,
      (1000 * positionDelta) / this.stateDt
    );
    this.velocity
      .set(state.position)
      .substract(this.position)
      .setLength(speed);
    //jumping
    if (state.jumped) this.jump();
    //shooting
    if (state.shots) this.executeShots(state.shots);
  }

  async executeShots(n) {
    const count = Math.floor(n);
    while (count--) {
      if (this.stats.hp > 0) this.shoot();
      await timeout(this.stateDt / n);
    }
  }

  tweenValues(dt) {
    const state = this.states[this.states.length - 1];
    if (!state) return;
    this.phi += (state.phi - this.phi) * this.tweenSpeed * dt;
    this.theta += (state.theta - this.theta) * this.tweenSpeed * dt;
  }

  update(dt) {
    super.update(dt);
    if (this.stats.hp > 0) {
      this.tweenValues(dt);
      this.applyPhysics(dt);
      this.move(dt);
      this.handleCollisions(dt);
    }
    this.updateModel(dt);
  }
}

class LocalPlayer extends Player {
  constructor(pos, id) {
    super(pos, id);
    this.setupInput();
    this.camera = new Camera({
      VD: 700,
      width: canvas.width,
      height: canvas.height,
      position: this.position,
    });
    this.eventBuffer = this.createEventBuffer();
    this.respawn();
  }

  emitState() {
    const state = this.getState();
    this.eventBuffer = this.createEventBuffer();
  }

  getState() {
    return {
      position: this.position.clone(),
      jumped: this.eventBuffer.jumped,
      phi: this.phi,
      theta: this.theta,
      shots: this.eventBuffer.shots,
    };
  }

  createEventBuffer() {
    return {
      shots: 0,
      jumped: false,
    };
  }

  updateModel() {
    return;
  }

  setupInput() {
    this.input = new Input(canvas);
    this.input.mousemoveHandlers.push(e => {
      this.phi += e.movementX * 0.003;
      this.theta -= e.movementY * 0.003;
      this.theta = clamp(
        this.theta,
        Math.PI / 2 + this.camera.thetaClamp,
        Math.PI / 2 - this.camera.thetaClamp
      );
    });

    this.input.touchmoveHandlers.push(e => {
      this.phi += this.input.touchmove.x * 0.0003;
      this.theta -= this.input.touchmove.y * 0.0003;
      this.theta = clamp(
        this.theta,
        Math.PI / 2 + this.camera.thetaClamp,
        Math.PI / 2 - this.camera.thetaClamp
      );
    });
  }

  update(dt) {
    this.handleInput(this.input, dt);
    this.applyPhysics(dt);
    this.move(dt);
    this.handleCollisions(dt);
    this.updateModel(dt);
    this.updateCamera(dt);
  }

  updateCamera(dt) {
    this.camera.position
      .set(this.position)
      .addZ(this.height * this.cameraHeightFactor);
    this.camera.theta = this.theta;
    this.camera.phi = this.phi;
  }

  handleInput(input, dt) {
    const moveVec = new V3();
    const camera = this.camera;
    if (input.keys.w)
      moveVec.add(new V3().fromAngles(-Math.PI / 2, -this.phi, -1));
    if (input.keys.s)
      moveVec.add(new V3().fromAngles(-Math.PI / 2, -this.phi, 1));
    if (input.keys.a)
      moveVec.add(
        new V3().fromAngles(-Math.PI / 2, -this.phi - Math.PI / 2, 1)
      );
    if (input.keys.d)
      moveVec.add(
        new V3().fromAngles(-Math.PI / 2, -this.phi + Math.PI / 2, 1)
      );

    if (input.keys[' '] && !this.jumped) {
      this.jump();
      this.jumped = true;
      this.eventBuffer.jumped = true;
    }

    if (input.mouse[1] && this.gun.loaded) {
      this.gun.loaded = false;
      this.shoot();
      this.eventBuffer.shots++;
    }

    this.gun.loaded = !input.mouse[1];
    this.camera.zoom = input.mouse[3] ? 3 : 1;

    moveVec.scale(this.speed);
    this.velocity.x = moveVec.x;
    this.velocity.y = moveVec.y;
  }
}

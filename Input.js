class Input {
  constructor(canvas) {
    this.keys = [];
    this.mouse = [];
    this.mousemoveHandlers = [];
    this.touchmoveHandlers = [];
    this.touches = [];
    this.touchmove = {
      x: 0,
      y: 0,
      lastX: 0,
      lastY: 0,
    };

    document.addEventListener('keydown', e => {
      this.keys[e.key] = true;
    });

    document.addEventListener('keyup', e => {
      this.keys[e.key] = false;
    });

    canvas.addEventListener('mousedown', e => {
      e.target.requestPointerLock();
      e.preventDefault();
      this.mouse[e.which] = true;
    });

    canvas.addEventListener('mouseup', e => {
      this.mouse[e.which] = false;
    });

    canvas.addEventListener('mouseleave', e => {
      this.mouse = [];
    });

    canvas.addEventListener('mousemove', e => {
      this.mousemoveHandlers.forEach(h => h(e));
    });

    canvas.addEventListener('touchstart', e => {
      e.preventDefault();
      this.touchmove.lastX = e.changedTouches[0].pageX;
      this.touchmove.lastY = e.changedTouches[0].pageY;
      for (const i = 0; i < e.changedTouches.length; i++) {
        this.touches[e.changedTouches[i].identifier] = e.changedTouches[i];
      }
    });

    canvas.addEventListener('touchmove', e => {
      e.preventDefault();
      const x = e.changedTouches[0].pageX;
      const y = e.changedTouches[0].pageY;

      for (const i = 0; i < e.changedTouches.length; i++) {
        this.touches[e.changedTouches[i].identifier] = e.changedTouches[i];
      }
      this.touchmove.x = x - this.touchmove.lastX;
      this.touchmove.y = y - this.touchmove.lastY;
      this.touchmoveHandlers.forEach(h => h(e));
    });

    canvas.addEventListener('touchend', e => {
      for (const i = 0; i < e.changedTouches.length; i++) {
        this.touches[e.changedTouches[i].identifier] = null;
      }
      this.touches = this.touches.filter(t => !!t);
    });
  }
}

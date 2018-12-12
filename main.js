const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

let world;
let tris;

function boot() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;

  window.onresize = e => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
  };

  tris = [];
  world = new World();

  world.setup();

  var dt = 30 / 1000;

  const localPlayer = new LocalPlayer(
    new V3(100, 100, world.getFloorZ(100, 100)),
    world.generateId()
  );

  world.state.players.push(localPlayer);

  setInterval(() => {
    world.update(dt);
    tris = tris.filter(t => !t._remove);
    localPlayer.camera.render();
  }, dt * 1000);
}

function sqDist2D(p1, p2) {
  return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
}

function hydrateState(state) {
  state.position = new V3(state.position.x, state.position.y, state.position.z);
  return state;
}

function segmentIntersectsRadius(p1, p2, p, r) {
  const dist =
    Math.abs(
      (p2.y - p1.y) * p.x - (p2.x - p1.x) * p.y + p2.x * p1.y - p2.y * p1.x
    ) / Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2);
  const inRange = sqDist2D(p1, p) < sqDist2D(p1, p2);
  return inRange && dist < r;
}

function clamp(v, a, b) {
  const max = Math.max(a, b);
  const min = Math.min(a, b);
  return Math.max(Math.min(v, max), min);
}

function log(...msgs) {
  document.getElementById('log').innerHTML = msgs.join(', ');
}

function timeout(t) {
  return new Promise(res => {
    setTimeout(res, t);
  });
}

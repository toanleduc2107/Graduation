/* Bật hiệu ứng chỉ khi JS chạy được (tránh trang trắng nếu lỗi) */
document.documentElement.classList.add("js-anim");

/* ---------- Hiệu ứng hiện dần khi cuộn ---------- */
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document.querySelectorAll(".reveal").forEach((n, i) => {
    n.style.transitionDelay = `${Math.min(i * 120, 600)}ms`;
    io.observe(n);
  });
} else {
  document
    .querySelectorAll(".reveal")
    .forEach((n) => n.classList.add("is-visible"));
}

/* ---------- Confetti ---------- */
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
const COLORS = ["#16305c", "#3a6ea5", "#8fb7de", "#c9a24a", "#ffffff"];
let pieces = [];
let W,
  H,
  running = false;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

function spawn(count) {
  for (let i = 0; i < count; i++) {
    pieces.push({
      x: Math.random() * W,
      y: -20 - Math.random() * H * 0.4,
      w: 6 + Math.random() * 6,
      h: 8 + Math.random() * 8,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.2,
      vy: 1.6 + Math.random() * 2.2,
      vx: (Math.random() - 0.5) * 1.4,
      sway: Math.random() * Math.PI * 2,
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, W, H);
  pieces.forEach((p) => {
    p.sway += 0.02;
    p.x += p.vx + Math.sin(p.sway) * 0.6;
    p.y += p.vy;
    p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
  pieces = pieces.filter((p) => p.y < H + 30);
  if (pieces.length > 0) requestAnimationFrame(draw);
  else running = false;
}

function burst(count) {
  if (reduceMotion) return;
  spawn(count);
  if (!running) {
    running = true;
    requestAnimationFrame(draw);
  }
}

window.addEventListener("load", () => {
  burst(140);
  setTimeout(() => burst(60), 400);
});

document
  .querySelector(".invite__name")
  ?.addEventListener("click", () => burst(120));

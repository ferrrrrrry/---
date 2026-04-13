(function () {
  const canvas = document.getElementById("hero-canvas"),
    ctx = canvas.getContext("2d");
  const logo = new Image();
  logo.src = "https://cdn.shopify.com/assets/images/logos/shopify-bag.png"; // можно заменить на свой
  let W, H;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  // 🎨 цвет (#7e3bed)
  const COLOR = "126,59,237";

  // 🌊 волны
  let waves = [
    { x: W * 0.3, y: H * 0.4, radius: 0, speed: 1.2 },
    { x: W * 0.7, y: H * 0.6, radius: 0, speed: 0.9 },
  ];

  let t = 0;

  function draw() {
    t++;
    ctx.clearRect(0, 0, W, H);

    // 🌊 волны
    waves.forEach((w) => {
      w.radius += w.speed;

      if (w.radius > 260) {
        w.x = Math.random() * W;
        w.y = Math.random() * H;
        w.radius = 0;
      }

      ctx.beginPath();
      ctx.arc(w.x, w.y, w.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${COLOR},${0.12 * (1 - w.radius / 260)})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // 🔲 сетка
    ctx.strokeStyle = `rgba(${COLOR},0.05)`;
    ctx.lineWidth = 1;

    let sz = 65,
      ox = (t * 0.28) % sz,
      oy = (t * 0.14) % sz;

    for (let x = ox; x < W; x += sz) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }

    for (let y = oy; y < H; y += sz) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }
    // 🛍️ логотип Shopify
    if (logo.complete) {
      const size = 80; // размер логотипа
      const x = W / 2 - size / 2;
      const y = (W > 640 ? H / 3.5 : H / 11) - size / 2 + Math.sin(t * 0.03) * 10; // лёгкое плавание

      ctx.save();
      ctx.globalAlpha = 0.85; // прозрачность
      ctx.drawImage(logo, x, y, size, size);
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }

  draw();
})();
//
const cur = document.getElementById("cur"),
  ring = document.getElementById("ring");
let mx = 0,
  my = 0,
  rx = 0,
  ry = 0;
document.addEventListener("mousemove", (e) => {
  mx = e.clientX;
  my = e.clientY;
  cur.style.left = mx + "px";
  cur.style.top = my + "px";
});
(function a() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + "px";
  ring.style.top = ry + "px";
  requestAnimationFrame(a);
})();
document.querySelectorAll("a,button").forEach((el) => {
  el.addEventListener("mouseenter", () => {
    cur.style.width = "14px";
    cur.style.height = "14px";
    ring.style.width = "54px";
    ring.style.height = "54px";
    ring.style.borderColor = "rgba(198,255,52,.75)";
  });
  el.addEventListener("mouseleave", () => {
    cur.style.width = "8px";
    cur.style.height = "8px";
    ring.style.width = "38px";
    ring.style.height = "38px";
    ring.style.borderColor = "rgba(198,255,52,.45)";
  });
});

window.addEventListener("scroll", () =>
  document.getElementById("nav").classList.toggle("scrolled", scrollY > 40),
);
function toggleMenu() {
  document.getElementById("ham").classList.toggle("open");
  document.getElementById("mob-menu").classList.toggle("open");
}

const obs = new IntersectionObserver(
  (es) => {
    es.forEach((e) => {
      if (e.isIntersecting) e.target.classList.add("visible");
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));

const sObs = new IntersectionObserver(
  (e) => {
    if (e[0].isIntersecting) {
      document.querySelectorAll("[data-target]").forEach((el) => {
        const t = +el.dataset.target;
        let s = null;
        function st(ts) {
          if (!s) s = ts;
          const p = Math.min((ts - s) / 1400, 1);
          el.textContent = Math.floor(p * t) + (p === 1 ? "+" : "");
          if (p < 1) requestAnimationFrame(st);
        }
        requestAnimationFrame(st);
      });
      sObs.disconnect();
    }
  },
  { threshold: 0.2 },
);
const ab =
  document.querySelector(".about-stats") || document.querySelector(".about");
if (ab) sObs.observe(ab);

// ── TYPEWRITER ──────────────────────────────────────────────────────────────
function typewriter(el, txt, onDone) {
  el.textContent = "";
  const cur = document.createElement("span");
  cur.className = "tw-cursor";
  cur.textContent = "|";
  el.appendChild(cur);
  let i = 0;
  const iv = setInterval(() => {
    if (i < txt.length) {
      cur.insertAdjacentText("beforebegin", txt[i++]);
    } else {
      clearInterval(iv);
      setTimeout(() => {
        cur.style.animation = "none";
        cur.style.opacity = "0";
        setTimeout(() => cur.remove(), 300);
        if (onDone) onDone();
      }, 700);
    }
  }, 50);
}

// Hero subtitle + fine — цепочкой
const heroSub = document.querySelector(".hero-sub");
const heroFine = document.querySelector(".hero-fine");
const subTxt = heroSub ? heroSub.textContent.trim() : "";
const fineTxt = heroFine ? heroFine.textContent.trim() : "";
if (heroSub) heroSub.textContent = "\u00A0";
if (heroFine) heroFine.textContent = "\u00A0";
setTimeout(() => {
  if (heroSub)
    typewriter(heroSub, subTxt, () => {
      if (heroFine) setTimeout(() => typewriter(heroFine, fineTxt), 150);
    });
}, 1150);

// Section tags — при появлении в viewport
const twObs = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting && !e.target.dataset.twDone) {
        e.target.dataset.twDone = "1";
        const txt = e.target.dataset.twOrig;
        setTimeout(() => typewriter(e.target, txt), 350);
        twObs.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".section-tag").forEach((el) => {
  el.dataset.twOrig = el.textContent.trim();
  el.textContent = "";
  twObs.observe(el);
});

// ── SHOPS MOBILE SLIDER ──────────────────────────────────────────────────────
(function initShopSlider() {
  const grid = document.querySelector(".shops-grid");
  const dotsEl = document.getElementById("shops-dots");
  if (!grid || !dotsEl) return;

  let scrollHandler = null;

  function setup() {
    dotsEl.innerHTML = "";
    if (window.innerWidth > 640) return;

    const cards = Array.from(grid.querySelectorAll(".shop-card"));
    cards.forEach((_, i) => {
      const d = document.createElement("div");
      d.className = "shops-dot" + (i === 0 ? " active" : "");
      d.addEventListener("click", () => {
        cards[i].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      });
      dotsEl.appendChild(d);
    });

    if (scrollHandler) grid.removeEventListener("scroll", scrollHandler);
    scrollHandler = () => {
      const center = grid.scrollLeft + grid.offsetWidth / 2;
      let idx = 0,
        minD = Infinity;
      cards.forEach((c, i) => {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - center);
        if (d < minD) {
          minD = d;
          idx = i;
        }
      });
      dotsEl
        .querySelectorAll(".shops-dot")
        .forEach((d, i) => d.classList.toggle("active", i === idx));
    };
    grid.addEventListener("scroll", scrollHandler, { passive: true });
  }

  setup();
  window.addEventListener("resize", setup);
})();

function toggleFaq(btn) {
  const item = btn.closest(".faq-item"),
    open = item.classList.contains("open");
  document
    .querySelectorAll(".faq-item.open")
    .forEach((i) => i.classList.remove("open"));
  if (!open) item.classList.add("open");
}

function submitForm() {
  const n = document.getElementById("f-name").value.trim(),
    p = document.getElementById("f-phone").value.trim(),
    t = document.getElementById("f-tg").value.trim(),
    f = document.getElementById("f-format").value;
  if (!n || !p || !t || !f) {
    alert("Пожалуйста, заполни все поля");
    return;
  }
  document.getElementById("form-success").style.display = "block";
  ["f-name", "f-phone", "f-tg"].forEach(
    (id) => (document.getElementById(id).value = ""),
  );
  document.getElementById("f-format").value = "";
}
document.getElementById("f-phone").addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "");
  if (v.startsWith("7") || v.startsWith("8")) v = v.slice(1);
  let r = "";
  if (v.length > 0) r = "+7 (" + v.slice(0, 3);
  if (v.length >= 4) r += ") " + v.slice(3, 6);
  if (v.length >= 7) r += "-" + v.slice(6, 8);
  if (v.length >= 9) r += "-" + v.slice(8, 10);
  this.value = r;
});

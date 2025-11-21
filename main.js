// ================ ПАРАЛЛАКС ЗДАНИЯ (3D) ==================
const building = document.getElementById("building3d");

if (building) {
  const maxRotate = 10; // градусов

  const handleMove = (e) => {
    const rect = building.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;

    const rotateY = -dx * maxRotate;
    const rotateX = dy * maxRotate;

    building.style.transform =
      "perspective(1200px) rotateX(" +
      rotateX +
      "deg) rotateY(" +
      rotateY +
      "deg)";
  };

  window.addEventListener("mousemove", handleMove);
}

// ================ TILT-КАРТОЧКИ ==================
const tiltElems = document.querySelectorAll(".tilt");
tiltElems.forEach((el) => {
  el.addEventListener("mousemove", (e) => {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotateX = (y / rect.height) * -10;
    const rotateY = (x / rect.width) * 10;
    el.style.transform =
      "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
  });
  el.addEventListener("mouseleave", () => {
    el.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
});

// ================ ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ СКРОЛЛЕ ==================
const sections = document.querySelectorAll(".section");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);
sections.forEach((sec) => observer.observe(sec));

// ================ PARTICLES.JS ==================
particlesJS("particles-js", {
  particles: {
    number: { value: 80, density: { enable: true, value_area: 900 } },
    color: { value: "#00f3ff" },
    shape: { type: "circle" },
    opacity: { value: 0.5, random: true },
    size: { value: 3, random: true },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#00f3ff",
      opacity: 0.25,
      width: 1,
    },
    move: { enable: true, speed: 2, out_mode: "out" },
  },
  interactivity: {
    detect_on: "canvas",
    events: {
      onhover: { enable: true, mode: "repulse" },
      onclick: { enable: false, mode: "push" },
      resize: true,
    },
    modes: {
      repulse: { distance: 100, duration: 0.4 },
    },
  },
  retina_detect: true,
});

// ================ ОТПРАВКА ФОРМЫ В TELEGRAM ==================
// ВСТАВЬ СВОИ ДАННЫЕ:
const TG_BOT_TOKEN = "8552340428:AAHWcLOqBloAM0TkFwXikdbNTj7PE6lWn1I";
const TG_CHAT_ID = "5093389044";

const form = document.getElementById("join-form");
const statusBox = document.getElementById("form-status");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (
      TG_BOT_TOKEN === "8552340428:AAHWcLOqBloAM0TkFwXikdbNTj7PE6lWn1I" ||
      TG_CHAT_ID === "5093389044"
    ) {
      statusBox.textContent =
        "Ошибка конфигурации: владелец сайта ещё не настроил Telegram-бота.";
      statusBox.className = "form-status err";
      return;
    }

    const name = document.getElementById("name").value.trim();
    const contact = document.getElementById("contact").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !contact || !role) {
      statusBox.textContent = "Заполни все поля.";
      statusBox.className = "form-status err";
      return;
    }

    statusBox.textContent = "Отправка данных...";
    statusBox.className = "form-status";

    const message =
      "🔥 *Новая заявка в медиа-команду* 🔥\n\n" +
      "👤 *Имя:* " +
      name +
      "\n" +
      "📱 *Контакт:* `" +
      contact +
      "`\n" +
      "🎯 *Направление:* " +
      role +
      "\n\n_Отправлено с лендинга Ковчег Медиа_";

    const url = "https://api.telegram.org/bot" + TG_BOT_TOKEN + "/sendMessage";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TG_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      if (res.ok) {
        statusBox.textContent =
          "Готово: заявка отправлена координатору. Ожидай связи!";
        statusBox.className = "form-status ok";
        form.reset();
      } else {
        throw new Error("Telegram error");
      }
    } catch (err) {
      console.error(err);
      statusBox.textContent =
        "Сбой сети: не удалось отправить. Попробуй позже или свяжись с координатором лично.";
      statusBox.className = "form-status err";
    }
  });
}

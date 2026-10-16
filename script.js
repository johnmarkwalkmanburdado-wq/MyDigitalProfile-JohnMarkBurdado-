var btn  = document.getElementById("menuBtn");
var menu = document.getElementById("menu");

function setMenu(open) {
  document.body.classList.toggle("menu-open", open);
  btn.setAttribute("aria-expanded", open ? "true" : "false");
}

btn.addEventListener("click", function () {
  setMenu(!document.body.classList.contains("menu-open"));
});

menu.querySelectorAll("a").forEach(function (link) {
  link.addEventListener("click", function () { setMenu(false); });
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") { setMenu(false); }
});

var sections = document.querySelectorAll(".section");
var menuLinks = menu.querySelectorAll("a");
sections.forEach(function (sec) {
  sec.querySelectorAll(".reveal").forEach(function (el, i) {
    el.style.setProperty("--d", Math.min(i, 8) * 0.1 + "s");
  });
});

if ("IntersectionObserver" in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      } else {
        entry.target.classList.remove("in-view");
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(function (sec) { io.observe(sec); });
} else {
  sections.forEach(function (sec) { sec.classList.add("in-view"); });
}

var allSections = document.querySelectorAll("main > section");
var spy = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      menuLinks.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
      });
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
allSections.forEach(function (sec) { spy.observe(sec); });

var RECEIVER_EMAIL = "jmbtech1.0@gmail.com";

var form      = document.getElementById("contactForm");
var sendBtn   = document.getElementById("sendBtn");
var statusBox = document.getElementById("formStatus");

function showStatus(text, type) {
  statusBox.textContent = text;
  statusBox.className = "form-status " + type;
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  var name    = form.name.value.trim();
  var email   = form.email.value.trim();
  var message = form.message.value.trim();

  if (!name || !email || !message) {
    showStatus("Please fill in your name, email, and message.", "error");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showStatus("Please enter a valid email address.", "error");
    return;
  }

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";
  showStatus("", "");

  fetch("https://formsubmit.co/ajax/" + RECEIVER_EMAIL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      name: name,
      email: email,
      message: message,
      _honey: form._honey.value,
      _subject: "New message from " + name + " (JMB tech portfolio)",
      _replyto: email,
      _template: "table",
      _captcha: "false"
    })
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.success === "true" || data.success === true) {
        form.reset();
        showStatus("Thank you, " + name + "! Your message was sent.", "success");
      } else {
        throw new Error(data.message || "Send failed");
      }
    })
    .catch(function () {
      showStatus("Sorry, the message could not be sent. Please check your internet and try again.", "error");
    })
    .finally(function () {
      sendBtn.disabled = false;
      sendBtn.textContent = "Send Message";
    });
});

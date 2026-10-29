/* ==========================================================================
   CopyCenter — Centro de Cópias | script.js
   Front-end only: menu mobile e validação do formulário.
   ========================================================================== */

(function () {
  "use strict";

  /* ---------- Menu mobile ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = mainNav.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });

    // Fecha o menu ao clicar numa ligação
    mainNav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Fecha o menu com Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mainNav.classList.contains("open")) {
        mainNav.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.focus();
      }
    });
  }

  /* ---------- Formulário de orçamento (validação client-side) ---------- */
  var form = document.getElementById("quote-form");
  var success = document.getElementById("form-success");

  if (form) {
    var messages = {
      nome: "Indique o seu nome.",
      telefone: "Indique um telefone de contacto.",
      email: "Indique um email válido.",
      tipo: "Escolha o tipo de trabalho.",
      quantidade: "Indique a quantidade.",
      formato: "Indique o formato ou tamanho."
    };

    function setError(field, msg) {
      var wrap = field.closest(".form-field");
      var errorEl = wrap ? wrap.querySelector(".field-error") : null;
      if (wrap) wrap.classList.toggle("invalid", Boolean(msg));
      if (errorEl) errorEl.textContent = msg || "";
      field.setAttribute("aria-invalid", msg ? "true" : "false");
    }

    function validateField(field) {
      var value = field.value.trim();
      var msg = "";

      if (field.name !== "data" && !value) {
        msg = messages[field.name] || "Este campo é obrigatório.";
      } else if (field.name === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        msg = messages.email;
      } else if (field.name === "telefone" && value && !/^[+\d][\d\s().-]{5,}$/.test(value)) {
        msg = "Indique um número de telefone válido.";
      }

      setError(field, msg);
      return !msg;
    }

    // Marca a data mínima como hoje (campo "data pretendida")
    var dateField = form.querySelector("#f-data");
    if (dateField) {
      dateField.min = new Date().toISOString().split("T")[0];
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var fields = form.querySelectorAll("input[required], select[required]");
      var firstInvalid = null;

      fields.forEach(function (field) {
        var ok = validateField(field);
        if (!ok && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // PLACEHOLDER: sem backend — nada é enviado.
      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    // Revalida ao corrigir
    form.addEventListener("input", function (e) {
      var wrap = e.target.closest(".form-field");
      if (wrap && wrap.classList.contains("invalid")) validateField(e.target);
    });
  }
})();

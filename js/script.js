(() => {
  "use strict";

  // Accessible mobile navigation.
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNavigation = document.querySelector("#primary-navigation");

  if (menuToggle && primaryNavigation) {
    const closeMenu = () => {
      primaryNavigation.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      const label = menuToggle.querySelector(".sr-only");
      if (label) label.textContent = "Open navigation menu";
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = primaryNavigation.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      const label = menuToggle.querySelector(".sr-only");
      if (label) label.textContent = isOpen ? "Close navigation menu" : "Open navigation menu";
    });

    primaryNavigation.addEventListener("click", (event) => {
      if (event.target instanceof HTMLAnchorElement) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 48.01rem)").matches) closeMenu();
    });
  }

  // Keep footer years current on every page.
  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  // Client-side validation and mailto handoff for the static contact form.
  const contactForm = document.querySelector("[data-contact-form]");
  const formStatus = document.querySelector("[data-form-status]");

  if (contactForm instanceof HTMLFormElement) {
    const fields = {
      email: contactForm.querySelector("#email"),
      subject: contactForm.querySelector("#subject"),
      message: contactForm.querySelector("#message")
    };

    const setError = (fieldName, message) => {
      const field = fields[fieldName];
      const error = document.querySelector(`#${fieldName}-error`);
      if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
      if (error) error.textContent = message;
    };

    const validate = () => {
      let isValid = true;
      const emailValue = fields.email?.value.trim() ?? "";
      const subjectValue = fields.subject?.value.trim() ?? "";
      const messageValue = fields.message?.value.trim() ?? "";
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(emailValue)) {
        setError("email", "Enter a valid email address.");
        isValid = false;
      } else {
        setError("email", "");
      }

      if (subjectValue.length < 3) {
        setError("subject", "Enter a subject with at least 3 characters.");
        isValid = false;
      } else {
        setError("subject", "");
      }

      if (messageValue.length < 10) {
        setError("message", "Enter a message with at least 10 characters.");
        isValid = false;
      } else {
        setError("message", "");
      }

      return isValid;
    };

    Object.entries(fields).forEach(([fieldName, field]) => {
      if (!field) return;
      field.addEventListener("input", () => setError(fieldName, ""));
    });

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!validate()) {
        if (formStatus) formStatus.textContent = "Please correct the highlighted fields.";
        const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
        if (firstInvalid instanceof HTMLElement) firstInvalid.focus();
        return;
      }

      const sender = fields.email.value.trim();
      const subject = fields.subject.value.trim();
      const message = fields.message.value.trim();
      const body = `${message}\n\nReply to: ${sender}`;
      const mailto = `mailto:jtnguyen09@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

      if (formStatus) {
        formStatus.textContent = "Opening your email application. Review the message there before sending.";
      }
      window.location.href = mailto;
    });
  }
})();

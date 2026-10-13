document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav-links');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  document.querySelectorAll('[data-copy-number]').forEach(function (button) {
    button.addEventListener('click', async function () {
      var number = button.getAttribute('data-copy-number');
      try {
        await navigator.clipboard.writeText(number);
        button.textContent = 'Copied!';
      } catch (error) {
        window.prompt('Copy the Mobile Money number:', number);
      }
    });
  });

  var form = document.getElementById('volunteerForm');
  if (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var status = document.getElementById('formStatus');
      var submit = form.querySelector('button[type="submit"]');
      var payload = {
        fullName: form.elements.fullName.value.trim(),
        email: form.elements.email.value.trim(),
        skills: form.elements.skills.value.trim()
      };
      status.classList.remove('error');
      status.style.display = 'block';
      status.textContent = 'Sending your application securely…';
      submit.disabled = true;
      try {
        var response = await fetch('https://future-light-backend.onrender.com/api/volunteer', {
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify(payload)
        });
        var result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || 'Your application could not be submitted.');
        status.textContent = result.message || 'Thank you. Your volunteer application has been received.';
        form.reset();
      } catch (error) {
        status.classList.add('error');
        status.textContent = error.message || 'We could not connect to the server. Please try again later.';
      } finally {
        submit.disabled = false;
      }
    });
  }
});
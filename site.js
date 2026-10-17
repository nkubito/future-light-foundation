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

/* Ask Future Light AI: injected on every page that loads site.js. */
(function () {
  var API_URL = 'https://future-light-backend.onrender.com/api/ask';
  var maxMessageLength = 600;

  function createChat() {
    if (document.getElementById('fla-chat-launcher')) return;

    var launcher = document.createElement('button');
    launcher.id = 'fla-chat-launcher';
    launcher.className = 'fla-chat-launcher';
    launcher.type = 'button';
    launcher.setAttribute('aria-expanded', 'false');
    launcher.setAttribute('aria-controls', 'fla-chat-panel');
    launcher.innerHTML = '<span class="fla-chat-symbol" aria-hidden="true">✦</span><span>Ask Future Light AI</span>';

    var panel = document.createElement('section');
    panel.id = 'fla-chat-panel';
    panel.className = 'fla-chat-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Ask Future Light AI');
    panel.setAttribute('aria-modal', 'false');
    panel.hidden = true;
    panel.innerHTML = `
      <div class="fla-chat-header">
        <div class="fla-chat-avatar" aria-hidden="true">FL</div>
        <div><strong>Ask Future Light AI</strong><small>Information about our mission</small></div>
        <button class="fla-chat-close" type="button" aria-label="Close chat">×</button>
      </div>
      <div class="fla-chat-messages" id="fla-chat-messages" aria-live="polite">
        <div class="fla-chat-message assistant">Hello! I can help you learn about Future Light Foundation, our team and ways to get involved. What would you like to know?</div>
      </div>
      <div class="fla-chat-suggestions" aria-label="Suggested questions">
        <button type="button">What is our mission?</button>
        <button type="button">How can I volunteer?</button>
        <button type="button">How can I contact you?</button>
      </div>
      <form class="fla-chat-form" id="fla-chat-form">
        <input class="fla-chat-input" id="fla-chat-input" name="message" maxlength="600" autocomplete="off" placeholder="Ask a question…" aria-label="Your question" required>
        <button class="fla-chat-send" type="submit">Send</button>
      </form>
      <p class="fla-chat-disclaimer">AI-generated answers may be imperfect. Please do not share sensitive personal information. For important matters, contact the foundation directly.</p>
    `;

    document.body.append(launcher, panel);
    var closeButton = panel.querySelector('.fla-chat-close');
    var form = panel.querySelector('#fla-chat-form');
    var input = panel.querySelector('#fla-chat-input');
    var messages = panel.querySelector('#fla-chat-messages');
    var sendButton = panel.querySelector('.fla-chat-send');
    var suggestions = panel.querySelector('.fla-chat-suggestions');

    function setOpen(open) {
      panel.hidden = !open;
      launcher.setAttribute('aria-expanded', String(open));
      if (open) input.focus();
    }
    function addMessage(text, role) {
      var bubble = document.createElement('div');
      bubble.className = 'fla-chat-message ' + role;
      bubble.textContent = text;
      messages.appendChild(bubble);
      messages.scrollTop = messages.scrollHeight;
      return bubble;
    }
    launcher.addEventListener('click', function () { setOpen(panel.hidden); });
    closeButton.addEventListener('click', function () { setOpen(false); launcher.focus(); });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) { setOpen(false); launcher.focus(); }
    });
    suggestions.addEventListener('click', function (event) {
      var button = event.target.closest('button');
      if (button) { input.value = button.textContent; form.requestSubmit(); }
    });
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      var question = input.value.trim();
      if (!question || question.length > maxMessageLength || sendButton.disabled) return;
      addMessage(question, 'user');
      input.value = '';
      sendButton.disabled = true;
      input.disabled = true;
      suggestions.hidden = true;
      var pending = addMessage('Thinking…', 'assistant');
      try {
        var response = await fetch(API_URL, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({message: question})
        });
        var result = await response.json().catch(function () { return {}; });
        if (!response.ok) throw new Error(result.message || 'The assistant is temporarily unavailable.');
        pending.textContent = result.answer || 'I could not prepare an answer just now. Please contact the foundation directly.';
      } catch (error) {
        pending.textContent = error.message || 'I could not connect right now. Please try again later or contact foundationfuturelight@gmail.com.';
      } finally {
        sendButton.disabled = false;
        input.disabled = false;
        input.focus();
        messages.scrollTop = messages.scrollHeight;
      }
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createChat);
  else createChat();
})();

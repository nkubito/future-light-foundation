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
  var maxMessageLength = 600;

  /* Free, rule-based answers: no external AI API or paid API key required. */
  function findAnswer(question) {
    var q = question.toLowerCase()
      .normalize('NFD').replace(/[\\u0300-\\u036f]/g, '')
      .replace(/[^a-z0-9\\s@.+-]/g, ' ')
      .replace(/\\s+/g, ' ').trim();

    var has = function (words) { return words.some(function (word) { return q.includes(word); }); };

    if (has(['hello', 'hi ', 'hey', 'good morning', 'good afternoon', 'good evening', 'muraho'])) {
      return 'Hello and welcome to Future Light Foundation! I can answer questions about our mission, team, volunteering, contact details and ways to support our work.';
    }
    if (has(['mission', 'purpose', 'goal', 'why was the foundation', 'what do you do', 'what does the foundation do'])) {
      return 'Future Light Foundation aims to support vulnerable children, including children facing poverty and orphanhood, and to help create better opportunities for their future. We are continuing to establish our organization and programs.';
    }
    if (has(['who are you', 'about the foundation', 'what is future light', 'tell me about', 'about future light', 'foundation about'])) {
      return 'Future Light Foundation is a developing community-focused initiative with a mission to support vulnerable children and help improve their opportunities. Our organization is still being established, so not every program or service is currently active.';
    }
    if (has(['volunteer', 'volunteering', 'join the team', 'join your community', 'help you', 'work with you'])) {
      return 'You can express your interest through the Volunteer page on this website. Fill in your full name, email address and skills, then submit the form. The foundation can review your application and follow up. Please note that our operations are still being established.';
    }
    if (has(['contact', 'email', 'phone number', 'telephone', 'call you', 'reach you', 'address'])) {
      return 'You can contact Future Light Foundation by email at foundationfuturelight@gmail.com or by phone at 0790161576. You can also visit our Instagram page: @futurelight_foundation.';
    }
    if (has(['donat', 'give money', 'send money', 'mobile money', 'momo', 'payment', 'pay'])) {
      return 'Thank you for wanting to support Future Light Foundation. Our registration and operations are still being established, so online donation and payment processing are not yet confirmed as available. Please contact foundationfuturelight@gmail.com before sending any money.';
    }
    if (has(['team', 'founder', 'ceo', 'director', 'emmanuel', 'samuel', 'boss', 'yves', 'bertrand', 'who leads'])) {
      return 'Our current team listing is: Tuyishime Emmanuel — Founder & Visionary Director; HAKIZIMANA Samuel — Partnerships & External Relations Officer; MACUNDA Boss — Communications & Public Relations Officer; Jean Bertrand Rukundo Rutwaza — Community Engagement & Programs Officer; and Gikundiro Yves — Projects & Operations Coordinator. See the About page for team details.';
    }
    if (has(['instagram', 'social media', 'facebook', 'follow you', 'photos', 'gallery', 'events', 'news', 'updates'])) {
      return 'You can follow @futurelight_foundation on Instagram for foundation updates, activities and community news. You can also check the Gallery and News/Events sections of this website when available.';
    }
    if (has(['where are you', 'location', 'based in', 'which country', 'rwanda', 'kigali'])) {
      return 'Future Light Foundation is a Rwanda-focused initiative. For a specific office address or meeting location, please contact foundationfuturelight@gmail.com to confirm the latest details.';
    }
    if (has(['register', 'registration', 'legal', 'officially registered', 'certificate'])) {
      return 'Future Light Foundation is still in the process of establishing its registration and operations. We cannot currently confirm that registration is complete.';
    }
    if (has(['program', 'project', 'activity', 'activities', 'children', 'orphans', 'poor'])) {
      return 'Our mission focuses on supporting vulnerable children, including children affected by poverty and orphanhood. Specific programs and activities are still being developed, so please contact foundationfuturelight@gmail.com for the latest confirmed information.';
    }
    if (has(['thank', 'thanks', 'thank you'])) {
      return 'You are welcome! Thank you for your interest in Future Light Foundation.';
    }
    if (has(['help', 'what can i ask', 'what do you know', 'questions'])) {
      return 'You can ask me about our mission, the foundation, our team, volunteering, contact details, Instagram, programs, registration status or donations.';
    }
    return 'I can answer questions about Future Light Foundation when I recognize a supported topic. Try asking about our mission, team, volunteering, contact details, Instagram or donation status. For other questions, email foundationfuturelight@gmail.com.';
  }

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
        /* Local matching is immediate and free; it does not call the backend or OpenAI. */
        pending.textContent = findAnswer(question);
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

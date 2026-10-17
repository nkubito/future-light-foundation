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

  /* Free, topic-based answer engine. It never calls a paid AI API. */
  function findAnswer(question) {
    var q = question.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s@.+-]/g, ' ')
      .replace(/\s+/g, ' ').trim();

    var has = function (words) { return words.some(function (word) { return q.includes(word); }); };
    var answer = function (text, extra) { return Object.assign({ text: text }, extra || {}); };
    var yesNo = function () { return /^(yes|yes please|yeah|yep|sure|okay|ok|please|contact|contact them|no|no thanks|no thank you|not now|maybe|later)$/i.test(q); };

    if (yesNo()) return answer('Would you like to contact Future Light Foundation? Choose Yes or No below.', { contactChoice: true });

    if (/^(hello|hi|hey|good morning|good afternoon|good evening|muraho|amakuru)$/.test(q)) {
      return answer('Hello and welcome to Future Light Foundation! I’m here to help you learn about our mission, people, volunteering and how to contact us. What would you like to know?');
    }
    if (has(['who is the founder', 'who is founder', 'founder name', 'founders name', 'who founded', 'who started', 'ceo', 'visionary director', 'emmanuel', 'tuyishime'])) {
      return answer('Our founder is Tuyishime Emmanuel, the Founder & Visionary Director of Future Light Foundation. He is committed to building a more supportive future for vulnerable children and young people.', { person: 'founder' });
    }
    if (has(['samuel', 'hakizimana'])) {
      return answer('HAKIZIMANA Samuel serves as our Partnerships & External Relations Officer. He focuses on building relationships with organizations, potential donors and partners.', { person: 'samuel' });
    }
    if (has(['macunda', 'boss']) || (has(['communication', 'public relations']) && has(['officer', 'team', 'who']))) {
      return answer('MACUNDA Boss is our Communications & Public Relations Officer. He supports public awareness and shares the foundation’s mission, activities and stories with the wider community.', { person: 'boss' });
    }
    if (has(['jean bertrand', 'rutwaza', 'community engagement'])) {
      return answer('Jean Bertrand Rukundo Rutwaza serves as our Community Engagement & Programs Officer. He helps connect with communities, listen to local needs and coordinate activities.', { person: 'jean' });
    }
    if (has(['gikundiro', 'yves', 'operations coordinator', 'projects coordinator'])) {
      return answer('Gikundiro Yves is our Projects & Operations Coordinator. He helps organize activities, coordinate tasks and follow up on project plans.', { person: 'yves' });
    }
    if (has(['manzi', 'prince', 'general advisor', 'general adviser'])) {
      return answer('MANZI Prince serves as our General Advisor. He provides innovative ideas, guides project planning and implementation, and advises the team on strategies to achieve the foundation’s mission and long-term goals.', { person: 'manzi' });
    }
    if (has(['team', 'team members', 'staff', 'people behind', 'who works', 'who are the members', 'list the members', 'all members', 'leadership'])) {
      return answer('Meet the people behind Future Light Foundation:', { team: true });
    }
    if (has(['volunteer', 'volunteering', 'volunteer with', 'join the team', 'join your community', 'help the foundation', 'work with you', 'become a volunteer', 'how can i help'])) {
      return answer('We’d be happy to hear from people who want to contribute their time and skills. Visit our Volunteer page, complete the form with your name, email and skills, and submit it. The team can review your interest and follow up. Our operations are still being established, so opportunities may depend on current capacity.', { link: { href: './volunteer.html', label: 'Visit the Volunteer page' } });
    }
    if (has(['mission', 'purpose', 'goal', 'why was the foundation', 'what do you do', 'what does the foundation do', 'why do you exist'])) {
      return answer('Our mission is to support vulnerable children and young people, including those affected by poverty, loss or difficult circumstances. We aim to connect them with care, learning opportunities and community support so they can build a brighter future. We are still developing our organization and programs.');
    }
    if (has(['about the foundation', 'what is future light', 'tell me about', 'about future light', 'who are you', 'your story', 'foundation about'])) {
      return answer('Future Light Foundation is a Rwanda-focused, community-minded initiative built on the belief that every child deserves dignity, care and a real opportunity to grow. We aim to support vulnerable children and young people through care, education and community connection. Our organization and programs are still being established.', { link: { href: './about.html', label: 'Read more about us' } });
    }
    if (has(['contact', 'email', 'phone number', 'telephone', 'call you', 'reach you', 'address', 'how to reach'])) {
      return answer('You can contact Future Light Foundation at foundationfuturelight@gmail.com or call 0790161576. We are based in Kigali, Rwanda. You can also follow @futurelight_foundation on Instagram.', { link: { href: './contact.html', label: 'Open contact page' } });
    }
    if (has(['donat', 'give money', 'send money', 'mobile money', 'momo', 'payment', 'pay', 'financial support', 'support financially'])) {
      return answer('Thank you for wanting to support our work. Our registration and operations are still being established, and online donation/payment processing is not confirmed as ready. Please contact foundationfuturelight@gmail.com before sending money so you can confirm the current arrangements.', { link: { href: './donate.html', label: 'View donation information' } });
    }
    if (has(['instagram', 'social media', 'facebook', 'follow you', 'photos', 'gallery', 'events', 'news', 'updates'])) {
      return answer('You can follow @futurelight_foundation on Instagram for updates. You can also explore the Gallery and News/Events sections of our website as information becomes available.', { link: { href: 'https://www.instagram.com/futurelight_foundation/', label: 'Visit our Instagram' } });
    }
    if (has(['where are you', 'location', 'based in', 'which country', 'rwanda', 'kigali', 'office'])) {
      return answer('Future Light Foundation is focused on Rwanda and is based in Kigali. Please email foundationfuturelight@gmail.com to confirm specific office or meeting details.');
    }
    if (has(['register', 'registration', 'legal', 'officially registered', 'certificate', 'registered'])) {
      return answer('Future Light Foundation is still establishing its registration and operations. We cannot currently confirm that the registration process is complete.');
    }
    if (has(['program', 'project', 'activity', 'activities', 'children', 'orphans', 'poor', 'education', 'school'])) {
      return answer('Our focus is on supporting vulnerable children and young people through care, learning opportunities and community connection. Specific programs are still being developed, so contact foundationfuturelight@gmail.com for the latest confirmed information.', { link: { href: './programs.html', label: 'Explore our work' } });
    }
    if (has(['thank', 'thanks', 'thank you'])) {
      return answer('You’re welcome! Thank you for taking an interest in Future Light Foundation. Every thoughtful question helps people understand our mission.');
    }
    if (has(['help', 'what can i ask', 'what do you know', 'questions', 'topics'])) {
      return answer('You can ask me about our mission, founder, any team member, volunteering, programs, contact details, Instagram, registration or donations. For example: “Who is the founder?” or “How can I volunteer?”');
    }
    return answer('Thank you for your question! I’m here to help with Future Light Foundation, so please ask me something related to our mission, founder, team, volunteering, programs, donations or activities. Would you like to contact our team for more information?', { contactChoice: true, suggestions: true });
  }

  function renderAnswer(target, data) {
    target.textContent = data.text;
    if (data.person || data.team) {
      var people = [
        { key: 'founder', name: 'Tuyishime Emmanuel', role: 'Founder & Visionary Director', image: './tuyishime.jpeg' },
        { key: 'samuel', name: 'HAKIZIMANA Samuel', role: 'Partnerships & External Relations Officer', image: './samuel.jpeg' },
        { key: 'boss', name: 'MACUNDA Boss', role: 'Communications & Public Relations Officer', image: './boss.jpeg' },
        { key: 'jean', name: 'Jean Bertrand Rukundo Rutwaza', role: 'Community Engagement & Programs Officer', image: './jean%20bertrand.jpeg' },
        { key: 'yves', name: 'Gikundiro Yves', role: 'Projects & Operations Coordinator', image: './gikundiro.jpeg' },
        { key: 'manzi', name: 'MANZI Prince', role: 'General Advisor', image: './manzi.jpeg' }
      ];
      var list = data.team ? people : people.filter(function (person) { return person.key === data.person; });
      var cards = document.createElement('div');
      cards.className = 'fla-team-results';
      list.forEach(function (person) {
        var card = document.createElement('div');
        card.className = 'fla-person-result';
        var img = document.createElement('img');
        img.src = person.image;
        img.alt = person.name;
        img.loading = 'lazy';
        var details = document.createElement('div');
        var name = document.createElement('strong');
        name.textContent = person.name;
        var role = document.createElement('small');
        role.textContent = person.role;
        details.append(name, role);
        card.append(img, details);
        cards.appendChild(card);
      });
      target.appendChild(cards);
      var aboutLink = document.createElement('a');
      aboutLink.href = './about.html';
      aboutLink.className = 'fla-answer-link';
      aboutLink.textContent = 'Meet the full team';
      target.appendChild(aboutLink);
    }
    if (data.contactChoice) {
      var choices = document.createElement('div');
      choices.className = 'fla-choice-row';
      [['Yes', 'contact-yes'], ['No', 'contact-no']].forEach(function (choice) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'fla-choice-button';
        button.setAttribute('data-fla-choice', choice[1]);
        button.textContent = choice[0];
        choices.appendChild(button);
      });
      target.appendChild(choices);
    }
    if (data.suggestions) {
      var suggested = document.createElement('div');
      suggested.className = 'fla-followup-questions';
      var intro = document.createElement('strong');
      intro.textContent = 'You could ask:';
      suggested.appendChild(intro);
      ['What is your mission?', 'Who is the founder?', 'Who are your team members?', 'How can I volunteer?', 'How can I support your work?'].forEach(function (question) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'fla-followup-question';
        button.setAttribute('data-fla-question', question);
        button.textContent = question;
        suggested.appendChild(button);
      });
      target.appendChild(suggested);
    }
    if (data.link) {
      var link = document.createElement('a');
      link.href = data.link.href;
      link.className = 'fla-answer-link';
      link.textContent = data.link.label;
      if (/^https?:\/\//.test(data.link.href)) {
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
      }
      target.appendChild(link);
    }
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
        <div><strong>Ask Future Light AI</strong><small>Friendly help about our foundation</small></div>
        <button class="fla-chat-close" type="button" aria-label="Close chat">×</button>
      </div>
      <div class="fla-chat-messages" id="fla-chat-messages" aria-live="polite">
        <div class="fla-chat-message assistant">Hello! 👋 Welcome to Future Light Foundation. Ask me about our mission, founder, team, volunteering or how to contact us.</div>
      </div>
      <div class="fla-chat-suggestions" aria-label="Suggested questions">
        <button type="button">What is our mission?</button>
        <button type="button">How can I volunteer?</button>
        <button type="button">Who is the founder?</button>
        <button type="button">Meet the team</button>
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
    messages.addEventListener('click', function (event) {
      var choice = event.target.closest('[data-fla-choice]');
      var questionButton = event.target.closest('[data-fla-question]');
      if (choice) {
        if (choice.getAttribute('data-fla-choice') === 'contact-yes') {
          addMessage('Yes, please show me the contact details.', 'user');
          var contact = addMessage('', 'assistant');
          renderAnswer(contact, { text: 'Of course. You can reach Future Light Foundation at foundationfuturelight@gmail.com or call 0790161576. You can also follow @futurelight_foundation on Instagram.', link: { href: './contact.html', label: 'Open contact page' } });
        } else {
          addMessage('No, thank you.', 'user');
          addMessage('No problem! I’m happy to help with another Future Light Foundation question. You can ask about our mission, founder, team, volunteering or programs.', 'assistant');
        }
        choice.closest('.fla-choice-row').querySelectorAll('button').forEach(function (button) { button.disabled = true; });
        messages.scrollTop = messages.scrollHeight;
      } else if (questionButton) {
        input.value = questionButton.getAttribute('data-fla-question');
        form.requestSubmit();
      }
    });
    input.addEventListener('input', function () {
      if (input.value.trim()) suggestions.hidden = true;
      else if (!messages.querySelector('.fla-chat-message.user')) suggestions.hidden = false;
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
      var pending = addMessage('One moment…', 'assistant');
      try {
        /* Local matching is immediate and free; it does not call the backend or OpenAI. */
        renderAnswer(pending, findAnswer(question));
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

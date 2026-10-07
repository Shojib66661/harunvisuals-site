(function () {
  var form = document.getElementById('sample-form');
  if (!form) return;
  var status = document.getElementById('form-status');
  var live = /(^|\.)harunvisuals\.com$/.test(location.hostname);
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.elements.name.value.trim();
    var email = form.elements.email.value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email)) {
      status.textContent = 'Please add your name and a valid email so I can reply.';
      return;
    }
    if (!live) {
      status.className = 'form-ok';
      status.textContent = 'Preview: this form sends to harun@harunvisuals.com once the site is live on harunvisuals.com.';
      return;
    }
    var btn = form.querySelector('button');
    btn.disabled = true; btn.textContent = 'Sending…';
    var data = {
      name: name, email: email,
      link: form.elements.link.value, need: form.elements.need.value, message: form.elements.message.value,
      _subject: 'New request from harunvisuals.com: ' + form.elements.need.value,
      _template: 'table'
    };
    fetch('https://formsubmit.co/ajax/harun@harunvisuals.com', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(data)
    }).then(function (r) { if (!r.ok) throw new Error(); return r.json(); })
      .then(function () {
        form.reset();
        status.className = 'form-ok';
        status.textContent = 'Got it, thank you! I’ll reply to ' + email + ' within one US business day.';
      })
      .catch(function () {
        status.className = 'form-note';
        status.textContent = 'That didn’t send. Please email harun@harunvisuals.com directly.';
      })
      .finally(function () { btn.disabled = false; btn.textContent = 'Send my request'; });
  });
})();

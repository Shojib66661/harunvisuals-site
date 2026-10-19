(function () {
  // Big play button over each film; only one film plays at a time.
  // Videos use preload="none", so nothing downloads until someone presses play.
  var vids = [];
  document.querySelectorAll('.player').forEach(function (p) {
    var v = p.querySelector('video'), b = p.querySelector('.play');
    vids.push(v);
    v.controls = false; // native controls come back once the film starts
    b.addEventListener('click', function () {
      p.classList.add('playing');
      v.controls = true;
      var go = v.play();
      if (go && go.catch) go.catch(function () { p.classList.remove('playing'); });
    });
    v.addEventListener('play', function () {
      p.classList.add('playing');
      v.controls = true;
      vids.forEach(function (o) { if (o !== v && !o.paused) o.pause(); });
    });
    v.addEventListener('ended', function () {
      // back to the poster with the play button, ready to watch again
      v.controls = false;
      v.currentTime = 0;
      v.load();
      p.classList.remove('playing');
    });
  });
})();
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
      _subject: 'New nonprofit enquiry from harunvisuals.com: ' + form.elements.need.value,
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
      .finally(function () { btn.disabled = false; btn.textContent = 'Send my message'; });
  });
})();

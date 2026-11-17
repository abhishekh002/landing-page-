(function () {
  'use strict';

  var root = document.documentElement;
  var nav = document.querySelector('.navbar');

  function onScroll() {
    var max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--p', max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  var mount = document.getElementById('scan');
  if (!mount) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var tones = ['#f2c9a8', '#c9b6f2', '#e8d3b0', '#a9c7f5', '#f0b7c8'];
  var angles = ['Left', 'Center', 'Right'];

  // 3 photos x 4 faces. In photos 2 and 3 the bottom-left face is the same person
  // as the bottom-right face of the previous photo, so it is flagged, not counted.
  var html = '<div class="scan-frames" role="img" aria-label="Animated demo: three classroom photos are scanned, faces are detected, and people who appear in two overlapping photos are counted once.">';
  for (var k = 0; k < 3; k++) {
    html += '<figure class="scan-pic"><div class="scan-grid">';
    for (var j = 0; j < 4; j++) {
      var dup = k > 0 && j === 2;
      html += '<span class="face' + (dup ? ' dup' : '') + '" style="--tone:' + tones[(k * 4 + j) % tones.length] + '">' +
        '<i></i><b class="box">' + (dup ? '<em>same person</em>' : '') + '</b></span>';
    }
    html += '</div><figcaption>' + angles[k] + '</figcaption></figure>';
  }
  html += '<span class="scan-line"></span></div>' +
    '<div class="scan-hud">' +
    '<span><output id="scanPresent">10</output>students present</span>' +
    '<span class="dups"><output id="scanDup">2</output>duplicates removed</span>' +
    (reduce ? '' : '<button class="btn btn-line btn-sm" type="button" id="scanAgain">Scan again</button>') +
    '</div>';
  mount.innerHTML = html;

  if (reduce) return; // final state is already shown

  var presentEl = document.getElementById('scanPresent');
  var dupEl = document.getElementById('scanDup');
  var faces = mount.querySelectorAll('.face');
  var timers = [];

  function run() {
    timers.forEach(clearTimeout);
    timers = [];
    var present = 0;
    var dups = 0;
    presentEl.textContent = '0';
    dupEl.textContent = '0';

    faces.forEach(function (face, i) {
      var photo = Math.floor(i / 4);
      var slot = i % 4;
      // lock-on time follows the sweep line: 1.3s per photo, left column before right
      var t = photo * 1.3 + 0.3 + (slot % 2) * 0.65 + (slot >> 1) * 0.08;
      face.style.setProperty('--d', t + 's');
      timers.push(setTimeout(function () {
        if (face.classList.contains('dup')) dupEl.textContent = ++dups;
        else presentEl.textContent = ++present;
      }, t * 1000 + 250));
    });

    mount.classList.remove('run');
    void mount.offsetWidth; // restart the CSS animations
    mount.classList.add('run');
  }

  document.getElementById('scanAgain').addEventListener('click', run);
  run();
}());

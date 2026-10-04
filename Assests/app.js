const THEMES = [
  { id:'royal-gold', name:'Royal Gold' },
  { id:'rose', name:'Rose Romance' },
  { id:'emerald', name:'Emerald' },
  { id:'midnight', name:'Midnight' },
  { id:'ivory', name:'Ivory' }
];

const state = {
  theme: 'royal-gold',
  template: 'classic',
  mainPhoto: '',
  galleryPhotos: [],
  events: [
    {name:'Wedding Ceremony', date:'15 Nov 2026', time:'06:30 PM'}
  ]
};

const $ = (id) => document.getElementById(id);
const form = $('invite-form');

function escapeHtml(value='') {
  return String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function formatDate(date) {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN',{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${date}T00:00:00`));
}

function occasionCopy(occasion) {
  const map = {
    wedding:['Bride','Groom','The Wedding Of','Wedding Invitation'],
    engagement:['Person 1','Person 2','The Engagement Of','Engagement Invitation'],
    birthday:['Birthday Star','',"A Special Day",'Birthday Invitation'],
    anniversary:['Partner 1','Partner 2','Celebrating Love','Anniversary Invitation'],
    'baby-shower':['Mom-to-be','Dad-to-be','A Sweet Celebration','Baby Shower Invitation'],
    'naming-ceremony':['Baby','Family','A Beautiful Beginning','Naming Ceremony'],
    housewarming:['Host 1','Host 2','You Are Invited','Housewarming Invitation']
  };
  return map[occasion] || map.wedding;
}

function renderThemes() {
  $('theme-grid').innerHTML = THEMES.map(t => `
    <button type="button" class="theme-card ${state.theme===t.id?'selected':''}" data-theme="${t.id}">
      <div class="theme-swatch sw-${t.id}"></div>
      <div class="theme-name">${t.name}</div>
    </button>`).join('');
  document.querySelectorAll('.theme-card').forEach(btn => btn.addEventListener('click', () => {
    state.theme = btn.dataset.theme;
    renderThemes(); renderPreview();
  }));
}

function renderEvents() {
  $('events-list').innerHTML = state.events.map((e,i) => `
    <div class="event-row">
      <label>Event<input data-event="name" data-index="${i}" value="${escapeHtml(e.name)}"></label>
      <label>Date<input data-event="date" data-index="${i}" value="${escapeHtml(e.date)}"></label>
      <label>Time<input data-event="time" data-index="${i}" value="${escapeHtml(e.time)}"></label>
      <button type="button" class="btn secondary" data-remove-event="${i}" ${state.events.length===1?'disabled':''}>Remove</button>
    </div>`).join('');
  document.querySelectorAll('[data-event]').forEach(input => input.addEventListener('input', e => {
    const i = Number(input.dataset.index); state.events[i][input.dataset.event] = e.target.value; renderPreview();
  }));
  document.querySelectorAll('[data-remove-event]').forEach(btn => btn.addEventListener('click', () => {
    state.events.splice(Number(btn.dataset.removeEvent),1); renderEvents(); renderPreview();
  }));
}

$('add-event').addEventListener('click', () => {
  if (state.events.length >= 3) return;
  state.events.push({name:'Reception', date:'15 Nov 2026', time:'08:00 PM'});
  renderEvents(); renderPreview();
});

document.querySelectorAll('input[name="template"]').forEach(r => r.addEventListener('change', () => {
  state.template = r.value; renderPreview();
}));

function compressImage(file, maxSide=1200, quality=.72) {
  return new Promise((resolve,reject) => {
    if (!file) return resolve('');
    if (!file.type.startsWith('image/')) return reject(new Error('Only image files are allowed.'));
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width,img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width*scale));
        canvas.height = Math.max(1, Math.round(img.height*scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img,0,0,canvas.width,canvas.height);
        resolve(canvas.toDataURL('image/jpeg',quality));
      };
      img.onerror = () => reject(new Error('Could not read image.'));
      img.src = reader.result;
    };
    reader.onerror = () => reject(reader.error || new Error('Could not read file.'));
    reader.readAsDataURL(file);
  });
}

$('mainPhoto').addEventListener('change', async e => {
  const file = e.target.files?.[0];
  try {
    state.mainPhoto = await compressImage(file);
    $('main-photo-preview').innerHTML = state.mainPhoto ? `<img src="${state.mainPhoto}" alt="Main preview">` : 'No main photo selected';
    renderPreview();
  } catch (err) { $('status').textContent = err.message; }
});

$('galleryPhotos').addEventListener('change', async e => {
  const files = [...(e.target.files || [])].slice(0,4);
  try {
    state.galleryPhotos = [];
    for (const f of files) state.galleryPhotos.push(await compressImage(f));
    $('gallery-preview').innerHTML = state.galleryPhotos.map(src => `<img src="${src}" alt="Gallery preview">`).join('');
    renderPreview();
  } catch (err) { $('status').textContent = err.message; }
});

$('occasion').addEventListener('change', () => {
  const [p1,p2,splash,hero] = occasionCopy($('occasion').value);
  $('person1-label').textContent = p1;
  $('person2-label').textContent = p2;
  $('splashTitle').value = splash;
  $('heroTitle').value = hero;
  renderPreview();
});

form.addEventListener('input', renderPreview);
form.addEventListener('change', renderPreview);

function readForm() {
  const fd = new FormData(form);
  const person1 = fd.get('person1')?.toString().trim() || '';
  const person2 = fd.get('person2')?.toString().trim() || '';
  const names = person2 ? `${person1} & ${person2}` : person1;
  return {
    occasion: fd.get('occasion') || 'wedding',
    pageTitle: fd.get('pageTitle') || `${names} – Invitation`,
    heroTitle: fd.get('heroTitle') || 'Invitation',
    splashTitle: fd.get('splashTitle') || 'You Are Invited',
    person1,
    person2,
    names,
    date: fd.get('date') || '',
    time: fd.get('time') || '',
    dateDisplay: formatDate(fd.get('date') || ''),
    venue: fd.get('venue') || '',
    address: fd.get('address') || '',
    mapUrl: fd.get('mapUrl') || '',
    whatsapp: fd.get('whatsapp') || '',
    whatsappLabel: fd.get('whatsappLabel') || 'Send Your Wishes',
    message: fd.get('message') || '',
    footerMessage: fd.get('footerMessage') || '',
    template: state.template,
    theme: state.theme,
    mainPhoto: state.mainPhoto,
    galleryPhotos: state.galleryPhotos,
    events: state.events,
    sections: {
      countdown: $('showCountdown').checked,
      events: $('showEvents').checked,
      gallery: $('showGallery').checked,
      wishes: $('showWishes').checked
    }
  };
}

function previewHtml(data) {
  const eventCards = data.sections.events ? data.events.map(e => `<div class="card"><h3>${escapeHtml(e.name)}</h3><div class="meta">${escapeHtml(e.date)}${e.time ? ` · ${escapeHtml(e.time)}`:''}<br>${escapeHtml(data.venue)}${data.address ? `<br>${escapeHtml(data.address)}`:''}</div></div>`).join('') : '';
  const gallery = data.sections.gallery && data.galleryPhotos.length ? `<section class="section"><div class="container"><h2 class="section-title center">Moments</h2><div class="gallery-grid">${data.galleryPhotos.map(src=>`<img src="${src}" alt="Gallery">`).join('')}</div></div></section>` : '';
  const wishes = data.sections.wishes ? `<section class="section"><div class="container"><div class="wish-box"><h2 class="section-title">With love</h2><p class="section-subtitle">${escapeHtml(data.message)}</p></div></div></section>` : '';
  const countdown = data.sections.countdown ? `<section class="section"><div class="container center"><h2 class="section-title">Until we celebrate</h2><div class="count-grid"><div class="count-box"><span class="count-num">--</span><span class="count-label">Days</span></div><div class="count-box"><span class="count-num">--</span><span class="count-label">Hours</span></div><div class="count-box"><span class="count-num">--</span><span class="count-label">Minutes</span></div><div class="count-box"><span class="count-num">--</span><span class="count-label">Seconds</span></div></div></div></section>` : '';
  const photo = data.mainPhoto ? `<img class="hero-photo" src="${data.mainPhoto}" alt="${escapeHtml(data.names)}">` : `<div class="hero-photo" style="background:linear-gradient(135deg,var(--accent),rgba(255,255,255,.08));"></div>`;
  const people = data.person2 ? `<section class="section"><div class="container"><h2 class="section-title center">Our Story</h2><p class="section-subtitle center">${escapeHtml(data.message)}</p><div class="people-grid"><div class="person-card"><div class="person-name">${escapeHtml(data.person1)}</div><div class="person-role">Person 1</div></div><div class="amp">&amp;</div><div class="person-card"><div class="person-name">${escapeHtml(data.person2)}</div><div class="person-role">Person 2</div></div></div></div></section>` : '';
  return `<div class="invite ${data.template}" data-theme="${data.theme}">
    <section class="hero"><div class="hero-content"><div class="eyebrow">${escapeHtml(data.splashTitle)}</div>${photo}<h1 class="script">${escapeHtml(data.heroTitle)}</h1><p class="names">${escapeHtml(data.names)}</p><p class="hero-date">${escapeHtml(data.dateDisplay)}${data.time?` · ${escapeHtml(data.time)}`:''}</p><div class="scroll-hint">Scroll to explore ↓</div></div></section>
    ${people}
    ${data.sections.events ? `<section class="section"><div class="container"><h2 class="section-title center">The Celebration</h2><p class="section-subtitle center">${escapeHtml(data.venue)}${data.address?` · ${escapeHtml(data.address)}`:''}</p><div class="cards">${eventCards}</div>${data.mapUrl?`<div class="center"><a class="map-btn" href="${escapeHtml(data.mapUrl)}" target="_blank" rel="noopener">View on Maps</a></div>`:''}</div></section>`:''}
    ${countdown}${gallery}${wishes}
    <footer class="footer"><div>${escapeHtml(data.footerMessage)}</div>${data.sections.wishes && data.whatsapp ? `<a class="wish-btn" href="https://wa.me/${encodeURIComponent(data.whatsapp).replace(/%2B/g,'')}?text=${encodeURIComponent('Hi ' + data.names + ', congratulations! 🎉') }" target="_blank" rel="noopener">${escapeHtml(data.whatsappLabel)}</a>`:''}</footer>
  </div>`;
}

function renderPreview() {
  const data = readForm();
  $('preview-frame').innerHTML = `<div class="preview-device"><div class="mobile-screen">${previewHtml(data)}</div></div><div class="preview-note">Preview is approximate; the published invitation uses the same data.</div>`;
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  $('status').textContent = 'Creating invitation…';
  const data = readForm();
  const approxBytes = JSON.stringify(data).length;
  if (approxBytes > 4_800_000) {
    $('status').textContent = 'Photos are too large. Remove a photo or use smaller images.';
    return;
  }
  try {
    const res = await fetch('/.netlify/functions/create-invitation', {
      method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify(data)
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Could not create invitation.');
    const url = new URL(`/i/${result.slug}`, window.location.origin).toString();
    $('status').innerHTML = `✅ Ready! <a href="${url}" target="_blank" rel="noopener">Open invitation</a> · <button type="button" id="copy-link">Copy link</button>`;
    $('copy-link').addEventListener('click', async () => { await navigator.clipboard.writeText(url); $('status').textContent = '✅ Link copied.'; });
  } catch (err) {
    $('status').textContent = `${err.message} — run this project with “netlify dev” for live creation.`;
  }
});

renderThemes();
renderEvents();
renderPreview();

const app = document.getElementById('app');
const loading = document.getElementById('loading');
const errorBox = document.getElementById('error');

function getSlug() {
  const url = new URL(window.location.href);
  return url.searchParams.get('slug') || location.pathname.split('/i/')[1] || '';
}
function esc(v='') { return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function countdownHtml(date,time) {
  if (!date) return '';
  const target = `${date}T${time || '00:00'}:00`;
  return `<section class="section" id="countdown"><div class="container center"><h2 class="section-title">Until we celebrate</h2><div class="count-grid"><div class="count-box"><span class="count-num" data-d="days">00</span><span class="count-label">Days</span></div><div class="count-box"><span class="count-num" data-d="hours">00</span><span class="count-label">Hours</span></div><div class="count-box"><span class="count-num" data-d="minutes">00</span><span class="count-label">Minutes</span></div><div class="count-box"><span class="count-num" data-d="seconds">00</span><span class="count-label">Seconds</span></div></div></div></section><script>window.__COUNTDOWN__=${JSON.stringify(target)};<\/script>`;
}
function build(data) {
  document.title = data.pageTitle || `${data.names} – Invitation`;
  const heroPhoto = data.mainPhoto ? `<img class="hero-photo" src="${data.mainPhoto}" alt="${esc(data.names)}">` : '';
  const people = data.person2 ? `<section class="section"><div class="container"><h2 class="section-title center">The Couple</h2><p class="section-subtitle center">${esc(data.message || '')}</p><div class="people-grid"><div class="person-card"><div class="person-name">${esc(data.person1)}</div><div class="person-role">${data.occasion === 'wedding' ? 'Bride' : 'Person 1'}</div></div><div class="amp">&amp;</div><div class="person-card"><div class="person-name">${esc(data.person2)}</div><div class="person-role">${data.occasion === 'wedding' ? 'Groom' : 'Person 2'}</div></div></div></div></section>` : '';
  const events = data.sections?.events ? `<section class="section" id="details"><div class="container"><h2 class="section-title center">The Celebration</h2><p class="section-subtitle center">${esc(data.venue || '')}${data.address ? ` · ${esc(data.address)}`:''}</p><div class="cards">${(data.events || []).map(e=>`<div class="card"><h3>${esc(e.name)}</h3><div class="meta">${esc(e.date || '')}${e.time?` · ${esc(e.time)}`:''}<br>${esc(data.venue || '')}${data.address?`<br>${esc(data.address)}`:''}</div></div>`).join('')}</div>${data.mapUrl?`<div class="center"><a class="map-btn" href="${esc(data.mapUrl)}" target="_blank" rel="noopener">View on Maps</a></div>`:''}</div></section>` : '';
  const gallery = data.sections?.gallery && data.galleryPhotos?.length ? `<section class="section" id="gallery"><div class="container"><h2 class="section-title center">Moments</h2><div class="gallery-grid">${data.galleryPhotos.map((src,i)=>`<img src="${src}" alt="Photo ${i+1}">`).join('')}</div></div></section>` : '';
  const wishes = data.sections?.wishes ? `<section class="section" id="wishes"><div class="container"><div class="wish-box"><h2 class="section-title">With love</h2><p class="section-subtitle">${esc(data.message || '')}</p>${data.whatsapp?`<a class="wish-btn" href="https://wa.me/${encodeURIComponent(data.whatsapp).replace(/%2B/g,'')}?text=${encodeURIComponent('Hi '+data.names+', congratulations! 🎉') }" target="_blank" rel="noopener">${esc(data.whatsappLabel || 'Send Your Wishes')}</a>`:''}</div></div></section>` : '';
  return `<div id="top" class="invite ${esc(data.template || 'classic')}" data-theme="${esc(data.theme || 'royal-gold')}"><section class="hero"><div class="hero-content"><div class="eyebrow">${esc(data.splashTitle || 'You Are Invited')}</div>${heroPhoto}<h1 class="script">${esc(data.heroTitle || 'Invitation')}</h1><p class="names">${esc(data.names || '')}</p><p class="hero-date">${esc(data.dateDisplay || '')}${data.time?` · ${esc(data.time)}`:''}</p><div class="scroll-hint">Scroll to explore ↓</div></div></section>${people}${events}${data.sections?.countdown?countdownHtml(data.date,data.time):''}${gallery}${wishes}<footer class="footer">${esc(data.footerMessage || '')}</footer><nav class="nav"><a href="#top">Home</a><a href="#details">Details</a>${gallery?'<a href="#gallery">Gallery</a>':''}${wishes?'<a href="#wishes">Wishes</a>':''}</nav></div>`;
}
async function main() {
  const slug = getSlug();
  if (!slug) throw new Error('Invitation link is missing a slug.');
  const res = await fetch(`/.netlify/functions/get-invitation?slug=${encodeURIComponent(slug)}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Invitation not found.');
  app.innerHTML = build(data);
  app.classList.remove('hidden'); loading.classList.add('hidden');
  startCountdown();
}
function startCountdown() {
  const target = window.__COUNTDOWN__;
  if (!target) return;
  const targetMs = new Date(target).getTime();
  const tick = () => {
    const diff = Math.max(0,targetMs-Date.now());
    const d = Math.floor(diff/86400000);
    const h = Math.floor(diff%86400000/3600000);
    const m = Math.floor(diff%3600000/60000);
    const s = Math.floor(diff%60000/1000);
    const set=(k,v)=>{const el=document.querySelector(`[data-d="${k}"]`);if(el)el.textContent=String(v).padStart(2,'0');};
    set('days',d);set('hours',h);set('minutes',m);set('seconds',s);
  };
  tick(); setInterval(tick,1000);
}
main().catch(err=>{ loading.classList.add('hidden'); errorBox.textContent=err.message; errorBox.classList.remove('hidden'); });

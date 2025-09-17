/* unified UI from ZIP */
(function(){
/* from driver-create-trip.html */
/* === mobile UX helpers: hide bottom dock when keyboard/input is active === */
(function(){
  const dock = document.querySelector('.rn-dock');
  if(!dock) return;
  let isSmall = ()=> window.matchMedia('(max-width:640px)').matches;
  let blurTimer = null;
  document.addEventListener('focusin', (e)=>{
    const t = e.target;
    if(!t) return;
    if(isSmall() && (t.tagName==='INPUT' || t.tagName==='TEXTAREA' || t.isContentEditable)){
      dock.classList.add('hide');
    }
  });
  document.addEventListener('focusout', (e)=>{
    if(!isSmall()) return;
    clearTimeout(blurTimer);
    blurTimer = setTimeout(()=> dock.classList.remove('hide'), 220);
  });
  dock.addEventListener('click', ()=> dock.classList.remove('hide'));
})();
/* ===== helpers ===== */const $  = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);
/* chips toggle */
function chipToggle(wrapSel){
  $$(wrapSel+' .chip').forEach(c=>{
    c.addEventListener('click',()=>{ 
      c.classList.toggle('sel');
      refreshPreview();
    });
  });
}
chipToggle('#amenChips');
chipToggle('#atmChips');
/* ===== загрузка фото из localStorage (профиль водителя) ===== */
function loadCarPhotos(){
  const ph = (k, id)=> {
    const v = localStorage.getItem(k);
    const el=$(id);
    if(v){ el.src=v; el.parentElement.style.color=''; el.parentElement.style.display=''; }
    else { el.removeAttribute('src'); el.parentElement.textContent='нет фото'; }
  };
  ph('car_ext','#ph_ext'); ph('car_front','#ph_front'); ph('car_rear','#ph_rear');
  ['ext','front','rear'].forEach(t=>{
    const v = localStorage.getItem('car_'+t);
    const el = $('#pv_'+t);
    if(v){ el.src=v; el.parentElement.style.color=''; el.parentElement.style.display=''; }
    else { el.removeAttribute('src'); el.parentElement.textContent='нет фото'; }
  });
  const ava = localStorage.getItem('driver_avatar');
  if (ava) $('#pv_ava').src = ava;
}
loadCarPhotos();
/* ===== mock гео: координаты нескольких городов ===== */
const GEO = {
  "киев":[50.4501,30.5234],
  "теремки":[50.3723,30.4524],
  "одесса":[46.4825,30.7233],
  "львов":[49.8397,24.0297],
  "житомир":[50.2547,28.6587],
  "днепр":[48.4647,35.0462],
  "сумы":[50.9077,34.7981],
  "харьков":[49.9935,36.2304]
};
function toCoord(s){
  if(!s) return null;
  const k = s.trim().toLowerCase();
  for (const name in GEO){ if (k.includes(name)) return GEO[name]; }
  return null;
}
function haversine(a,b){
  const R=6371; 
  const toRad=x=>x*Math.PI/180;
  const dLat=toRad(b[0]-a[0]), dLon=toRad(b[1]-a[1]);
  const aa=Math.sin(dLat/2)**2+Math.cos(toRad(a[0]))*Math.cos(toRad(b[0]))*Math.sin(dLon/2)**2;
  return R*2*Math.atan2(Math.sqrt(aa),Math.sqrt(1-aa));
}
/* ===== вычисления ETA/км и пр. ===== */
function computeGeo(){
  const a = toCoord($('#from').value);
  const b = toCoord($('#to').value);
  if(!a || !b) {
    $('#kmText').textContent='км —';
    $('#etaText').textContent='в дороге —';
    $('#arriveText').textContent='прибытие —';
    return null;
  }
  const km = Math.round(haversine(a,b));
  $('#kmText').textContent = km+' км';
  const hours = km/75 * 1.1;
  const h = Math.floor(hours);
  const m = Math.round((hours-h)*60);
  $('#etaText').textContent = `в дороге ${h}ч ${String(m).padStart(2,'0')}м`;
  const t = $('#time').value || '08:30';
  let [sh, sm] = t.split(':').map(Number);
  const depart = new Date(); depart.setHours(sh ?? 8, sm ?? 30, 0, 0);
  const arrive = new Date(depart.getTime() + hours*60*60*1000);
  const ah = String(arrive.getHours()).padStart(2,'0');
  const am = String(arrive.getMinutes()).padStart(2,'0');
  $('#arriveText').textContent = `прибытие ${ah}:${am}`;
  $('#pv_meta').innerHTML = `<span>⏰ ${t} → ${ah}:${am}</span><span>🛣 ${km} км</span><span>🧍 ${$('#seats').value||'-'} мест</span>`;
  return { km, departTime: t, arrive: `${ah}:${am} `};
}
['from','to','time'].forEach(id=>$('#'+id).addEventListener('input',()=>{computeGeo();refreshPreview();}));
$('#date').addEventListener('change',refreshPreview);
$('#seats').addEventListener('input',refreshPreview);
/* ===== превью карточки ===== */
function refreshPreview(){
  const fromVal = ($('#from').value || '').trim()||  '—';
  const toVal   = ($('#to').value || '').trim() ||   '—';
  $('#pv_route').textContent = `${fromVal} → ${toVal}`;
  $('#pv_price').textContent = `${$('#price').value||0} ₴`;
  computeGeo();
  const pickedAmen = [...$('#amenChips .chip.sel'), ...$('#atmChips .chip.sel')]
    .map(c=>c.textContent.trim());
  $('#pv_amen').innerHTML = pickedAmen.map(t=>`<div class="chip" style="cursor:default">${t}</div>`).join('');
  const seats = Math.max(1, Math.min(3, +($('#seats').value||1)));
  const dots = [0,1,2].map(i=>`<div class="dot ${i<seats?'free':''}"></div>`).join('');
  $('#pv_seats').innerHTML = dots;
}
['price'].forEach(id=>$('#'+id).addEventListener('input',refreshPreview));
refreshPreview();
/* ===== открыть в Google Maps ===== */
$('#openMap').addEventListener('click', (e)=>{
  e.preventDefault();
  const A = encodeURIComponent($('#from').value || '');
  const B = encodeURIComponent($('#to').value   || '');
  if(!A || !B) return alert('Укажите «Откуда» и «Куда».');
  window.open(`https://www.google.com/maps/dir/?api=1&origin=${A}&destination=${B}&travelmode=driving`, '_blank');
});
/* ===== публикация — сохраняем черновик в localStorage и ведём в «Мои поездки» ===== */
$('#publishBtn').addEventListener('click',()=>{
  const from = ($('#from').value || '').trim();
  const to   = ($('#to').value   || '').trim();
  if(!from || !to){ alert('Заполните «Откуда» и «Куда».'); return; }
  const geo = computeGeo() || {};
  const trip = {
    id: 't_'+Date.now(),
    from, to,
    date: $('#date').value || null,
    time: $('#time').value || null,
    seats: Math.max(1, Math.min(3, +($('#seats').value||1))),
    price: +($('#price').value||0),
    km: geo.km ?? null,
    arrive: geo.arrive ?? null,
    pickupEnabled: $('#pickupToggle').checked, 
    amen:  [...$('#amenChips .chip.sel')].map(c=>c.dataset.key || c.textContent),
    atmos: [...$('#atmChips  .chip.sel')].map(c=>c.dataset.key || c.textContent),
    photos: {
      ext: localStorage.getItem('car_ext')   || null,
      front: localStorage.getItem('car_front') || null,
      rear: localStorage.getItem('car_rear')   || null
    },
    driver: {
      name:   localStorage.getItem('driver_name')  || 'Павел',
      avatar: localStorage.getItem('driver_avatar')|| null,
      car:    localStorage.getItem('driver_car')   || 'Toyota Camry',
      plate:  localStorage.getItem('driver_plate') || 'AA1234BB',
      rating: 4.0
    },
    status: 'published'
  };
  const key='rn_trips';
  const list = JSON.parse(localStorage.getItem(key) || '[]');
  list.unshift(trip);
  localStorage.setItem(key, JSON.stringify(list));
  location.href = 'my-trips.html';
});
/* from index.html */
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);
    const profileRaw = localStorage.getItem('ridenow_profile');
    const profile = profileRaw ? JSON.parse(profileRaw) : null;
    const roleButtons = $$('.role-btn');
    let selectedRole = 'passenger';
    function setActiveRole(role){
      selectedRole = role;
      roleButtons.forEach(b=>b.classList.toggle('is-active', b.dataset.role===role));
      localStorage.setItem('lastRole', role);
    }
    const last = localStorage.getItem('lastRole');
    if (last === 'driver' || last === 'passenger') setActiveRole(last);
    roleButtons.forEach(btn => btn.addEventListener('click', () => setActiveRole(btn.dataset.role)));
    function routeFor(role){
      if (profile && (!profile.role || profile.role === role)) {
        return role === 'driver' ? 'profile-driver.html' : 'profile-passenger.html';
      }
      const qs = role === 'driver' ? '?role=driver' : '?role=passenger';
      return 'register.html' + qs;
    }
    $('#loginBtn').addEventListener('click', () => { window.location.href = routeFor(selectedRole); });
    $('#restoreLink').addEventListener('click', e => { e.preventDefault(); window.location.href = 'restore.html'; });
    $('#createLink').addEventListener('click', e => {
      e.preventDefault();
      window.location.href = selectedRole === 'driver' ? 'register.html?role=driver' : 'register.html?role=passenger';
    });
    $$('.policyLink').forEach(l => l.addEventListener('click', e => { e.preventDefault(); window.location.href = 'policy.html'; }));
    const modal = $('#authModal');
    const authTitle = $('#authTitle');
    const authStatus = $('#authStatus');
    const authActions = $('#authActions');
    function openAuthModal(provider) {
      authTitle.textContent =` Вход через ${provider}…`;
      authStatus.textContent = 'Подождите, выполняем вход…';
      authActions.classList.add('hidden');
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      setTimeout(() => {
        authStatus.innerHTML = 'Вход подтверждён ✅';
        authActions.classList.remove('hidden');
      }, 1200);
    }
    document.querySelector('.social .sbtn:nth-child(1)').addEventListener('click', () => openAuthModal('Google'));
    document.querySelector('.social .sbtn:nth-child(2)').addEventListener('click', () => openAuthModal('Apple'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) { modal.classList.add('hidden'); modal.setAttribute('aria-hidden', 'true'); }
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        modal.classList.add('hidden'); modal.setAttribute('aria-hidden', 'true');
      }
    });
/* from passenger-active.html */
    (function setNavHeight(){
      const nav = document.getElementById('nav');
      const apply = ()=> document.documentElement.style.setProperty('--nav-h', (nav?.offsetHeight||92) + 'px');
      apply(); addEventListener('resize', apply);
    })();
    const sheet = document.getElementById('sheet');
    const sClose = document.getElementById('sClose');
    function openHistory(card){
      const from = card.dataset.from, to = card.dataset.to;
      document.getElementById('sTitle').textContent = `${from} → ${to}`;
      document.getElementById('sTime').textContent  = card.dataset.time;
      document.getElementById('sDist').textContent  = card.dataset.dist;
      document.getElementById('sDate').textContent  = card.dataset.date;
      const wrap = document.getElementById('sPhotos');
      wrap.innerHTML = '';
      (card.dataset.photos||'').split(',').slice(0,3).forEach(url=>{
        const d=document.createElement('div'); d.className='ph';
        const img=new Image(); img.src=url.trim(); img.alt='';
        d.appendChild(img); wrap.appendChild(d);
      });
      sheet.classList.add('open'); sheet.setAttribute('aria-hidden','false');
    }
    function closeHistory(){ sheet.classList.remove('open'); sheet.setAttribute('aria-hidden','true'); }
    document.querySelectorAll('.history .hist').forEach(el=>{
      el.addEventListener('click', ()=> openHistory(el));
    });
    sClose.addEventListener('click', closeHistory);
    sheet.addEventListener('click', e=>{ if(e.target===sheet) closeHistory(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeHistory(); });
/* from passenger-boarding-check.html */
  const qs = new URLSearchParams(location.search);
  const boardIso = qs.get('board');
  const boardTime = boardIso ? new Date(boardIso) : new Date(Date.now() + 60*1000);
  const remindAt  = new Date(boardTime.getTime() + 30*60*1000);
  const depEl = document.getElementById('dep');
  const leftEl = document.getElementById('left');
  const checkDlg = document.getElementById('checkDlg');
  const greetDlg = document.getElementById('greetDlg');
  const reasonDlg = document.getElementById('reasonDlg');
  depEl.textContent = boardTime.toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});
  function tick(){
    const now = new Date();
    const ms = remindAt - now;
    if (ms <= 0){ showCheck(); return; }
    const m = Math.floor(ms/60000), s = Math.floor(ms/1000)%60;
    leftEl.textContent =` ${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    requestAnimationFrame(tick);
  }
  tick();
  if ('Notification' in window){
    if (Notification.permission === 'default'){
      setTimeout(()=> Notification.requestPermission().catch(()=>{}), 1200);
    }
  }
  function pushNotice(){
    if ('Notification' in window && Notification.permission === 'granted'){
      try{
        const n = new Notification('RideNow — проверка посадки', {
          body:'Вы в поездке? Нажмите, чтобы подтвердить.',
          icon:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAI0lEQVQoU2NkYGD4z0AEYBxVSFQGEQ0wQhGqwRjGQYgA7cQAA1o0iV8Ww3qQAAAABJRU5ErkJggg=='
        });
        n.onclick = ()=>{ window.focus(); showCheck(); n.close(); };
      }catch(e){}
    }
  }
  function showCheck(){
    checkDlg.classList.add('open');
    pushNotice();
  }
  function closeDlg(id){ document.getElementById(id).classList.remove('open'); }
  document.getElementById('demoSoon').onclick = showCheck;
  document.getElementById('btnYes').onclick = ()=>{
    checkDlg.classList.remove('open');
    greetDlg.classList.add('open');
    try{ localStorage.setItem('ridenow_checkin', JSON.stringify({at:Date.now(), ok:true})); }catch(_){}
  };
  document.getElementById('btnNo').onclick = ()=>{
    checkDlg.classList.remove('open');
    reasonDlg.classList.add('open');
  };
  document.getElementById('sendReason').onclick = ()=>{
    const v = (document.querySelector('input[name="r"]:checked')||{}).value || 'unspecified';
    const d = document.getElementById('details').value.trim();
    try{ localStorage.setItem('ridenow_no_board', JSON.stringify({at:Date.now(), reason:v, note:d})) }catch(_){}
    location.href = 'trip-confirmed.html';
  };
/* from passenger-booking.html */
    (function setNavHeight(){
      const nav = document.getElementById('nav');
      const apply = ()=> document.documentElement.style.setProperty('--nav-h', (nav?.offsetHeight||92) + 'px');
      apply(); addEventListener('resize', apply);
    })();
    document.addEventListener('DOMContentLoaded', () => {
      const q = new URLSearchParams(location.search);
      const fee   = Number(q.get('fee') || 25);
      const from  = q.get('from') || 'Киев';
      const to    = q.get('to')   || 'Одесса';
      const tripId = q.get('tripId') || 'kyiv-odesa';
      const $ = id => document.getElementById(id);
      $('fee').textContent  = fee;
      $('fee2').textContent = fee;
      $('from').textContent = from;
      $('to').textContent   = to;
      $('payBtn')?.addEventListener('click', ()=>{
        location.href = `pay-passenger.html?tripId=${encodeURIComponent(tripId)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`;
      });
      $('backBtn')?.addEventListener('click', ()=>{
        history.length > 1 ? history.back() : location.href = 'trip.html';
      });
      $('toTrip')?.addEventListener('click', ()=>{
        location.href = `trip.html?paid=1&tripId=${encodeURIComponent(tripId)}`;
      });
    });
    function openSuccess(){ document.getElementById('success').classList.add('open'); }
/* from passenger-finish.html */
  /* Итог */
  const fare=550, extra=100, disc=0, baseTotal=fare+extra-disc;
  document.getElementById('fare').textContent=fare+' ₴';
  document.getElementById('extra').textContent='+'+extra+' ₴';
  document.getElementById('disc').textContent='−'+disc+' ₴';
  document.getElementById('toPay').textContent=baseTotal+' ₴';
  /* Чаевые */
  let tip=0;
  const chips=document.querySelectorAll('#tips .chip');
  const custom=document.getElementById('tipCustom');
  chips.forEach(ch=>{
    ch.onclick=()=>{
      chips.forEach(c=>c.classList.remove('active'));
      ch.classList.add('active');
      if(ch.dataset.val==='custom'){ custom.style.display='inline-block'; custom.focus(); }
      else{ custom.style.display='none'; tip=+ch.dataset.val; updTotal(); }
    };
  });
  custom.addEventListener('input',()=>{ tip=+custom.value||0; updTotal(); });
  function updTotal(){ document.getElementById('toPay').textContent=(baseTotal+tip)+' ₴'; }
  /* Рейтинг */
  let rating=0;
  [...document.querySelectorAll('.star')].forEach((s,i)=>
    s.onclick=()=>{ rating=i+1; document.querySelectorAll('.star').forEach((k,j)=>k.classList.toggle('on',j<rating)); });
  /* Фразы по удобствам: берём только то, что было в поездке */
  const amen = (()=>{ try{ return JSON.parse(localStorage.getItem('ride_amenities')) }catch(e){ return null } })()
               || ['music','climate','charging']; 
  const SUGG = {
    music: [
      'Музыка была уместной — не мешала общению.',
      'Плейлист подобран удачно и ненавязчиво.'
    ],
    climate: [
      'Климат комфортный — ни жарко, ни холодно.',
      'Температуру настраивали быстро — ехали приятно.'
    ],
    charging: [
      'Зарядка под рукой — телефон не сел.',
      'USB/розетка работали стабильно всю дорогу.'
    ],
    vape: [
      'Электронки допустимы — без дискомфорта для всех.',
      'Проветривание регулярное — воздух свежий.'
    ],
    kids: [
      'С ребёнком было спокойно — остановки по запросу.',
      'Детям удобно — мягкая езда и внимание.'
    ],
    pet: [
      'С питомцем ехали без проблем — спокойно и чисто.',
      'Животное разместилось удобно — всё ок.'
    ]
  };
  const hintList=document.getElementById('hintList');
  const lines=[];
  amen.forEach(k=>{
    if(SUGG[k]){ lines.push(...SUGG[k].slice(0,2)); } 
  });
  (lines.length?lines:['Поездка прошла спокойно и комфортно.','Водитель внимательный и аккуратный.']).forEach(t=>{
    const d=document.createElement('div');
    d.className='hint';
    d.textContent=t;
    d.onclick=()=>{
      d.classList.toggle('active');
      const ta=document.getElementById('comment');
      const val=ta.value.trim();
      if(d.classList.contains('active')) ta.value=(val?val+'\n':'')+t;
      else ta.value=ta.value.replace(t,'').replace(/\n{2,}/g,'\n').trim();
    };
    hintList.appendChild(d);
  });
  /* Отправка */
  document.getElementById('sendBtn').onclick=()=>{
    const picked=[...document.querySelectorAll('.hint.active')].map(n=>n.textContent);
    const payload={ total:baseTotal+tip, tip, rating, comment:document.getElementById('comment').value.trim(), hints:picked };
    console.log('review payload', payload);
    alert('Спасибо! Отзыв отправлен.');
    location.href='trip.html?active=1';};
/* from passenger-pay.html */
    (function(){
      if (window.RN) return;
      const get = (k)=>{ try{ return JSON.parse(localStorage.getItem(k)); }catch{ return null } };
      const set = (k,v)=> localStorage.setItem(k, JSON.stringify(v));
      window.RN = {
        keys:{
          bookingDraft:'rn:booking:draft',
          booking:'rn:booking:active',
          voucher:'rn:voucher'
        },
        get,set,
        fmtMoney:(v)=> `${v} ₴`,
        isPaid:(id)=> !!get(`rn:paid:${id}`),
        markPaid:(id)=> set(`rn:paid:${id}`, 1)
      };
      console.warn('[RN shim] rn-core.js не найден, используем встроенный shim');
    })();
    const qs = new URLSearchParams(location.search);
    const tripId = qs.get('tripId') || (RN.get(RN.keys.bookingDraft)?.id) || 'kyiv-odesa';
    const draft  = RN.get(RN.keys.bookingDraft) || { id: tripId, price: 550, from:'Киев', to:'Одесса', date:'16.09.2025' };
    const summary   = document.getElementById('summary');
    const methodsUI = document.getElementById('methods');
    const voucherCta= document.getElementById('voucherCta');
    const toActive  = document.getElementById('toActive');
    const voucher = RN.get(RN.keys.voucher) || null;
    const usingVoucher = !!(voucher && Number(voucher.amount) >= 25 && !voucher.used && (!voucher.lockedForTripId || voucher.lockedForTripId === tripId));
    function renderSummary(already){
      const feeText = usingVoucher ? '0 ₴ — покрыт бонусом' : '25 ₴';
      const extra   = usingVoucher ? ' (комиссия спишется с бонуса)' : '';
      summary.innerHTML = `
        <div style="font-weight:900">${draft.from} → ${draft.to} • ${draft.date}</div>
        <div style="margin-top:6px">Сервисный сбор: <strong>${feeText}</strong>${extra}</div>
        <div>Водителю — наличными: <strong>${RN.fmtMoney(draft.price)}</strong></div>
        ${already ? '<div style="margin-top:8px" class="pill">Эта поездка уже оплачена</div>' : ''}
      `;
    }
    if (RN.isPaid(tripId)) {
      renderSummary(true);
      toActive.style.display = 'block';
      methodsUI.style.display = 'none';
      voucherCta.style.display = 'none';
    } else {
      renderSummary(false);
      if (usingVoucher) {
        voucherCta.style.display = 'grid';
        methodsUI.style.display  = 'none';
      }
    }
    function consumeVoucherIfAny(){
      if (!usingVoucher) return;
      const v = { ...(voucher || {}) };
      v.amount = Math.max(0, Number(v.amount) - 25);
      v.used   = true;
      v.usedAt = Date.now();
      v.lastTripId = tripId;
      delete v.lockedForTripId;
      RN.set(RN.keys.voucher, v);
    }
    function completePayment(method){
      RN.markPaid(tripId);
      RN.set(RN.keys.booking, {
        id: tripId, from:draft.from, to:draft.to, date:draft.date, price:draft.price,
        seats:draft.seats||1, comment:draft.comment||'', status:'pending', createdAt: Date.now(), paid:1
      });
      location.href = 'active-passenger.html?state=pending&tripId=' + encodeURIComponent(tripId) + '&pm=' + encodeURIComponent(method);
    }
    document.getElementById('cardForm').addEventListener('submit',(e)=>{
      e.preventDefault();
      const num = document.getElementById('cc_number').value.replace(/\s+/g,'');
      const exp = document.getElementById('cc_exp').value.trim();
      const cvc = document.getElementById('cc_cvc').value.trim();
      const name= document.getElementById('cc_name').value.trim();
      if (num.length < 15 || !/^\d{2}\/\d{2}$/.test(exp) || cvc.length < 3 || name.length < 2){
        alert('Проверьте данные карты'); return;
      }
      completePayment('card');
    });
    document.getElementById('monoBtn').onclick = ()=> completePayment('mono');
    document.getElementById('gpayBtn').onclick = ()=> completePayment('gpay');
    document.getElementById('apayBtn').onclick = ()=> completePayment('applepay');
    voucherCta.onclick = ()=>{ consumeVoucherIfAny(); completePayment('voucher'); };
    toActive.onclick = ()=> location.href='active-passenger.html';
/* from passenger-search.html */
    const $ = s=>document.querySelector(s);
    (function setNavHeight(){
      const nav = $('#nav');
      const set = ()=> document.documentElement.style.setProperty('--nav-h', (nav?.offsetHeight||92) + 'px');
      set(); window.addEventListener('resize', set);
    })();
    $('#swapBtn').onclick = () => {
      const a = $('#from'), b = $('#to'); [a.value, b.value] = [b.value, a.value];
    };
    const sheetDate = $('#sheetDate'), sheetAmen = $('#sheetAmen');
    const openSheet = el => { [sheetDate,sheetAmen].forEach(x=>x.classList.remove('open')); el.classList.add('open'); el.setAttribute('aria-hidden','false'); };
    const closeSheet = el => { el.classList.remove('open'); el.setAttribute('aria-hidden','true'); };
    $('#btnDate').onclick = ()=> openSheet(sheetDate);
    $('#btnAmen').onclick = ()=> openSheet(sheetAmen);
    document.querySelectorAll('[data-close]').forEach(b=> b.addEventListener('click',()=> closeSheet(document.querySelector(b.dataset.close))));
    [sheetDate,sheetAmen].forEach(s=> s.addEventListener('click',e=>{ if(e.target===s) closeSheet(s); }));
    const calTitle=$('#calTitle'), calGrid=$('#calGrid'), dateValue=$('#dateValue');
    let cur=new Date(); cur.setHours(0,0,0,0); let picked=null;
    function renderCal(d){
      calGrid.innerHTML='';
      const y=d.getFullYear(), m=d.getMonth();
      calTitle.textContent=d.toLocaleString('ru-RU',{month:'long',year:'numeric'});
      const first=new Date(y,m,1); const start=new Date(first); start.setDate(first.getDate()-((first.getDay()+6)%7));
      for(let i=0;i<42;i++){
        const day=new Date(start); day.setDate(start.getDate()+i);
        const cell=document.createElement('div');
        cell.className='day'+(day.getMonth()!==m?' muted':''); cell.textContent=day.getDate();
        cell.onclick=()=>{ picked=new Date(day); document.querySelectorAll('.day').forEach(d=>d.classList.remove('active')); cell.classList.add('active'); };
        if(picked && day.toDateString()===picked.toDateString()) cell.classList.add('active');
        calGrid.appendChild(cell);
      }
    }
    renderCal(cur);
    document.getElementById('prevM').onclick=()=>{ cur.setMonth(cur.getMonth()-1); renderCal(cur); };
    document.getElementById('nextM').onclick=()=>{ cur.setMonth(cur.getMonth()+1); renderCal(cur); };
    document.getElementById('dateOk').onclick=()=>{
      if(picked){
        const dd=String(picked.getDate()).padStart(2,'0');
        const mm=String(picked.getMonth()+1).padStart(2,'0');
        const yy=picked.getFullYear();
        dateValue.textContent=`${dd}.${mm}.${yy}`;
      }
      closeSheet(sheetDate);
    };
    const amenSelected=new Set();
    const map={climate:'❄️ Климат',music:'🎧 Музыка',electro:'💨 Электронки',rear2:'🧍‍♀️🧍‍♀️ Только 2 сзади',
               pet:'🐾 С животным',child:'🍼 Ребёнок ок',charge:'⚡️ Зарядка',talk:'🗣 Поболтаем',
               calm:'🧊 Спокойная езда',noSmoke:'🚭 Некурящий салон'};
    document.querySelectorAll('#amenGrid .amen').forEach(a=>{
      a.addEventListener('click',()=>{
        const k=a.dataset.key;
        if(amenSelected.has(k)){amenSelected.delete(k); a.classList.remove('sel');}
        else{amenSelected.add(k); a.classList.add('sel');}
      });
    });
    function redrawChosen(){
      const wrap=$('#chosenWrap'); wrap.innerHTML='';
      if(!amenSelected.size){ $('#amenCount').textContent='нет'; return; }
      amenSelected.forEach(k=>{ const chip=document.createElement('div'); chip.className='chip'; chip.textContent=map[k]||k; wrap.appendChild(chip); });
      $('#amenCount').textContent=String(amenSelected.size);
    }
    $('#amenOk').onclick=()=>{ redrawChosen(); closeSheet(sheetAmen); };
    $('#findBtn').onclick=()=> document.querySelector('.r-card').scrollIntoView({behavior:'smooth'});
/* from passenger-trip-live.html */
    (function setNavHeight(){
      const nav = document.getElementById('nav');
      const apply = ()=> document.documentElement.style.setProperty('--nav-h', (nav?.offsetHeight||92) + 'px');
      apply(); addEventListener('resize', apply);
    })();
    (function setMapLink(){
      const origin = '50.4015,30.5593'; 
      const dest   = '46.4825,30.7233'; 
      const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=driving`;
      document.getElementById('mapOpen').href = url;
    })();
    const backdrop = document.getElementById('backdrop');
    const sheets = {
      call: document.getElementById('sheetCall'),
      chat: document.getElementById('sheetChat'),
    };
    function openSheet(which){
      Object.values(sheets).forEach(s=>{ s.classList.remove('open'); s.setAttribute('aria-hidden','true'); });
      const el = sheets[which];
      el.classList.add('open'); el.setAttribute('aria-hidden','false');
      backdrop.classList.add('show');
    }
    function closeSheet(which){
      const el = typeof which === 'string' ? sheets[which] : which;
      if (!el) return;
      el.classList.remove('open'); el.setAttribute('aria-hidden','true');
      const anyOpen = Object.values(sheets).some(s=>s.classList.contains('open'));
      if (!anyOpen) backdrop.classList.remove('show');
    }
    document.getElementById('callOpen').onclick = ()=> openSheet('call');
    document.getElementById('chatOpen').onclick = ()=> openSheet('chat');
    backdrop.addEventListener('click', ()=> { closeSheet('call'); closeSheet('chat'); });
    document.querySelectorAll('.close,[data-close]').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        const id = btn.dataset.close || btn.closest('.sheet')?.id;
        if (id) closeSheet(document.getElementById(id));
      });
    });
    window.addEventListener('keydown',(e)=>{ if(e.key==='Escape'){ closeSheet('call'); closeSheet('chat'); } });
    (function callTimer(){
      let t=0, timer;
      document.getElementById('sheetCall').addEventListener('transitionend', (e)=>{
        if(e.propertyName!=='bottom') return;
        const open = e.target.classList.contains('open');
        clearInterval(timer);
        if(open){
          timer = setInterval(()=>{
            t++; const m=String(Math.floor(t/60)).padStart(2,'0'); const s=String(t%60).padStart(2,'0');
            document.getElementById('callTimer').textContent=`${m}:${s}`;
          },1000);
        } else { t=0; document.getElementById('callTimer').textContent='00:00'; }
      });
    })();
    const bubbles = document.getElementById('bubbles');
    const input = document.getElementById('chatText');
    const sendBtn = document.getElementById('chatSend');
    function addBubble(text, who){
      if(!text) return;
      const div = document.createElement('div');
      div.className = 'bubble ' + (who==='me' ? 'me' : 'other');
      div.textContent = text;
      bubbles.appendChild(div);
      bubbles.scrollTop = bubbles.scrollHeight;
    }
    sendBtn.addEventListener('click', ()=>{
      const txt = input.value.trim();
      if(!txt) return;
      addBubble(txt, 'me');
      input.value='';
      setTimeout(()=> addBubble('Ок, принял 👍', 'other'), 600);
    });
    input.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); sendBtn.click(); }});
/* from passenger-trip-pending.html */
  (function setNavHeight(){
    const nav = document.getElementById('nav');
    const apply = ()=> document.documentElement.style.setProperty('--nav-h', (nav?.offsetHeight||92) + 'px');
    apply(); addEventListener('resize', apply);
  })();
  (function setMapLink(){
    const origin = '50.4015,30.5593'; 
    const dest   = '46.4825,30.7233'; 
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=driving`;
    document.getElementById('mapOpen').href = url;
  })();
  const qs = new URLSearchParams(location.search);
  const TRIP_ID = qs.get('tripId') || 'kyiv-odesa';
  const STORE_KEY = `rn:booking:${TRIP_ID}`;
  const DEADLINE_MS = 60 * 60 * 1000; 
  const PAID_KEY = `rn:payment:${TRIP_ID}`;       
  const VOUCHER_KEY = 'rn:svcfee:voucher';        
  let state = {};
  try{
    state = JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  }catch{ state = {}; }
  if (!state.createdAt){
    try{
      const legacy = JSON.parse(localStorage.getItem('activeBooking')||'{}');
      if (legacy?.createdAt) state.createdAt = legacy.createdAt;
    }catch{}
  }
  if (!state.createdAt){
    state.createdAt = Date.now();
    state.status = 'pending';
  }
  localStorage.setItem(STORE_KEY, JSON.stringify(state));
  const mockConfirm = Number(qs.get('confirmIn') || 0);
  if (mockConfirm > 0) setTimeout(()=> updateStatus('confirmed'), mockConfirm*1000);
  const timeLeftEl  = document.getElementById('timeLeft');
  const meterFill   = document.getElementById('meterFill');
  const noticeTitle = document.getElementById('noticeTitle');
  const noticeText  = document.getElementById('noticeText');
  const searchCta   = document.getElementById('searchCta');
  const voucherBox  = document.getElementById('voucherBox');
  function renderVoucherBanner(){
    try{
      const v = JSON.parse(localStorage.getItem(VOUCHER_KEY)||'null');
      if (v && !v.used && Number(v.amount) >= 25){
        voucherBox.style.display = 'block';
      } else {
        voucherBox.style.display = 'none';
      }
    }catch{ voucherBox.style.display = 'none'; }
  }
  renderVoucherBanner();
  function grantVoucherIfPaid(){
    try{
      if (localStorage.getItem(PAID_KEY) !== '1') return; 
      const v = JSON.parse(localStorage.getItem(VOUCHER_KEY)||'null');
      if (v && !v.used && Number(v.amount) >= 25) return; 
      const payload = { amount:25, currency:'UAH', sourceTripId: TRIP_ID, createdAt: Date.now(), used:false };
      localStorage.setItem(VOUCHER_KEY, JSON.stringify(payload));
      renderVoucherBanner();
    }catch{}
  }
  function updateStatus(newStatus){
    state.status = newStatus;
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    if (newStatus === 'confirmed'){
      location.href = `trip-live.html?tripId=${encodeURIComponent(TRIP_ID)}&status=confirmed`;
      return;
    }
    if (newStatus === 'cancelled'){
      grantVoucherIfPaid();
      noticeTitle.textContent = '❌ Отменена';
      noticeText.textContent  = 'Водитель не подтвердил в течение часа. Бронь автоматически отменена.';
      document.querySelector('.meter').style.display = 'none';
      timeLeftEl.parentElement.style.display = 'none';
    }
  }
  function tick(){
    if (state.status !== 'pending') return;
    const left = state.createdAt + DEADLINE_MS - Date.now();
    if (left <= 0){ updateStatus('cancelled'); return; }
    const m = Math.floor(left/60000);
    const s = Math.floor((left%60000)/1000);
    timeLeftEl.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    meterFill.style.width = ((1 - left/DEADLINE_MS)*100).toFixed(1)+'%';
  }
  tick(); setInterval(tick, 1000);
  document.getElementById('cancelBooking').addEventListener('click', ()=>{
    if (!confirm('Отменить бронь? Сервисный сбор не возвращается.')) return;
    grantVoucherIfPaid();
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem('activeBooking'); 
    updateStatus('cancelled');
  });
  document.getElementById('searchCta').addEventListener('click', ()=>{
    grantVoucherIfPaid();
  }, {passive:true});
  async function poll(){
    if (state.status !== 'pending') return;
    setTimeout(poll, 15000);
  }
  poll();
/* from passenger-trip.html */
    (function setNavHeight(){
      const nav = document.getElementById('nav');
      const apply = ()=> document.documentElement.style.setProperty('--nav-h', (nav?.offsetHeight||92) + 'px');
      apply(); addEventListener('resize', apply);
    })();
    const origin = '50.4015,30.5593';   
    const dest   = '46.4825,30.7233';   
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=driving`;
    document.getElementById('mapOpen').href = mapsUrl;
    const TRIP_ID    = 'kyiv-odesa';
    const VOUCHER_KEY= 'rn:svcfee:voucher';
    const PAID_KEY   = `rn:payment:${TRIP_ID}`; 
    const bookBtn    = document.getElementById('bookBtn');
    const bookPrice  = document.getElementById('bookPrice');
    function getVoucher(){
      try { return JSON.parse(localStorage.getItem(VOUCHER_KEY)||'null'); }
      catch { return null; }
    }
    function hasActiveVoucher(){
      const v = getVoucher();
      return v && !v.used && Number(v.amount) >= 25 && (!v.lockedForTripId || v.lockedForTripId===TRIP_ID);
    }
    function lockVoucher(){
      const v = getVoucher(); if(!v) return;
      v.lockedForTripId = TRIP_ID; v.lockedAt = Date.now();
      localStorage.setItem(VOUCHER_KEY, JSON.stringify(v));
    }
    (function renderCTA(){
      const paid = localStorage.getItem(PAID_KEY);
      if (paid === '1' || paid === 'voucher'){
        bookPrice.innerHTML = 'Сбор уже оплачен — переход к брони';
        bookBtn.textContent = 'Продолжить';
        bookBtn.onclick = ()=> location.href = `trip-pending.html?tripId=${encodeURIComponent(TRIP_ID)}`;
        return;
      }
      if (hasActiveVoucher()){
        bookPrice.innerHTML = 'К оплате: <strong>0 ₴</strong> — сбор покрыт бонусом';
        bookBtn.textContent = 'Забронировать без комиссии';
      } else {
        bookPrice.innerHTML = 'К оплате: <strong>сервисный сбор 25 ₴</strong>';
        bookBtn.textContent = 'Забронировать';
      }
    })();
    bookBtn?.addEventListener('click', ()=>{
      const useVoucher = hasActiveVoucher();
      if (useVoucher) {
        lockVoucher(); 
      }
      const fee = useVoucher ? 0 : 25;
      const extra = useVoucher ? '&voucher=1' : '';
      location.href = `booking-passenger.html?tripId=${encodeURIComponent(TRIP_ID)}&from=Киев&to=Одесса&fee=${fee}${extra}`;
    });
/* from passenger-wallet.html */
  const LS_BALANCE = 'rn:bonus:balance';        
  const LS_HISTORY = 'rn:bonus:history';        
  const LS_FEE_VOUCHER = 'rn:svcfee:voucher';   
  const getBalance = () => Number(localStorage.getItem(LS_BALANCE) || '0');
  const setBalance = v => localStorage.setItem(LS_BALANCE, String(Math.max(0, Math.round(v))));
  const getHistory = () => { try { return JSON.parse(localStorage.getItem(LS_HISTORY)||'[]'); } catch(_) { return []; } };
  const setHistory = arr => localStorage.setItem(LS_HISTORY, JSON.stringify(arr));
  const getVoucher = () => { try { return JSON.parse(localStorage.getItem(LS_FEE_VOUCHER)||'null'); } catch(_) { return null; } };
  const setVoucher = v => localStorage.setItem(LS_FEE_VOUCHER, JSON.stringify(v));
  const clearVoucher = () => localStorage.removeItem(LS_FEE_VOUCHER);
  function render(){
    document.getElementById('balance').textContent = getBalance() + ' ₴';
    const voucher = getVoucher();
    document.getElementById('feeBadge').style.display = (voucher && voucher.amount>=25) ? 'inline-grid' : 'none';
    const hist = getHistory().filter(x => x.type==='km');
    const trips = hist.length;
    const km = hist.reduce((s,x)=>s+(x.km||0),0);
    document.getElementById('stTrips').textContent = trips;
    document.getElementById('stKm').textContent = (km||0) + ' км';
    document.getElementById('comment').textContent = commentFor(km, trips);
    const box = document.getElementById('history');
    box.innerHTML = '';
    if (!hist.length) {
      box.innerHTML = '<div class="empty">Пока нет начислений. Поезди — и бонусы появятся 😉</div>';
    } else {
      hist.slice().reverse().forEach(x=>{
        const div = document.createElement('div');
        div.className='entry';
        div.innerHTML = `
          <div>
            <div><strong>${x.route}</strong> • ${x.km} км</div>
            <div class="sub">${x.date||''}</div>
          </div>
          <div>+${x.credit} ₴</div>
        `;
        box.appendChild(div);
      });
      if (voucher && voucher.amount>=25) {
        const info = document.createElement('div');
        info.className='entry';
        const d = new Date(voucher.createdAt||Date.now()).toLocaleDateString('ru-RU');
        info.innerHTML = `
          <div>
            <div><strong>Перенос сервисного сбора</strong></div>
            <div class="sub">${d}</div>
          </div>
          <div>25 ₴</div>
        `;
        box.prepend(info);
      }
    }
  }
  function commentFor(km, trips){
    if (km < 100) return 'Ну что, началось! 🚀';
    if (km < 500) return 'Хороший старт, так держать! 💪';
    if (km < 1000) return 'Нормально держишь темп! 😉';
    if (km < 2000) return 'Ты как летчик уже! ✈️';
    if (trips >= 20) return '20+ поездок — уважение! 🙌';
    return 'Катишь уверенно! 🛞';
  }
  (function setNavHeight(){
    const nav = document.getElementById('nav');
    const apply = ()=> document.documentElement.style.setProperty('--nav-h', (nav?.offsetHeight||92) + 'px');
    apply(); addEventListener('resize', apply);
  })();
  render();
/* from rate-passenger.html */
    const q = new URLSearchParams(location.search);
    const tripId = q.get('tripId') || 'kyiv-odesa';
    const b = RN.get(RN.keys.booking)||{};
    document.getElementById('route').textContent = `${b.from||'—'} → ${b.to||'—'} • ${b.date||''}`;
    let rating = 5;
    const stars = [...document.querySelectorAll('.star')];
    function paint(n){ stars.forEach((s,i)=> s.classList.toggle('on', i<n)); }
    stars.forEach((s,i)=> s.onclick = ()=>{ rating=i+1; paint(rating); }); paint(rating);
    document.getElementById('send').onclick = ()=>{
      const km = +(q.get('km')||b.km||0);
      const credit = Math.floor(km/10); 
      const hist = RN.get('rn:history')||[];
      hist.unshift({
        id: tripId, from:b.from, to:b.to, date:b.date, price:b.price, km,
        rating, comment: document.getElementById('comment').value.trim(),
        finishedAt: Date.now()
      });
      RN.set('rn:history', hist);
      const wallet = RN.get('rn:wallet')||{balance:0};
      wallet.balance = Math.max(0, Number(wallet.balance)||0) + credit;
      RN.set('rn:wallet', wallet);
      RN.set(RN.keys.booking, null);
      location.href = 'active.html?state=empty';
    };
/* from register.html */
/* ==== выбор роли ==== */
const roleButtons = document.querySelectorAll('.role-btn');
const driverFields = document.getElementById('driverFields');
let selectedRole = 'passenger';
roleButtons.forEach(btn=>{
  btn.addEventListener('click',()=>{
    roleButtons.forEach(b=>b.classList.remove('is-active'));
    btn.classList.add('is-active');
    selectedRole = btn.dataset.role;
    driverFields.style.display = selectedRole === 'driver' ? 'block' : 'none';
  });
});/* ==== фото профиля ==== */
const profileInput = document.getElementById('profile-photo');
const profileLabel = document.querySelector('.profile-photo-label');
const profileText = document.getElementById('profile-text');
profileLabel.addEventListener('click', ()=>{ try{ profileInput.value=''; }catch(e){} });
profileInput.addEventListener('change',e=>{
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ()=>{
    profileLabel.style.backgroundImage = `url(${reader.result})`;
    profileLabel.style.border = '3px solid var(--mint)';
    profileText.style.display = 'none';
  };
  reader.readAsDataURL(file);
});
/* ==== пол ==== */
const maleBtn = document.getElementById('male');
const femaleBtn = document.getElementById('female');
const genderInput = document.getElementById('gender');
[maleBtn,femaleBtn].forEach(b=>{
  b.addEventListener('click',()=>{
    maleBtn.classList.remove('active');
    femaleBtn.classList.remove('active');
    b.classList.add('active');
    genderInput.value = b === maleBtn ? 'male' : 'female';
  });
});
/* ==== фото авто (клик по блоку -> выбор файла -> превью) ==== */
const photoSlots = [
  { box:'#phFront',       input:'#fileFront',       key:'front' },
  { box:'#phTrunk',       input:'#fileTrunk',       key:'trunk' },
  { box:'#phFrontSeats',  input:'#fileFrontSeats',  key:'frontSeats' },
  { box:'#phRearSeats',   input:'#fileRearSeats',   key:'rearSeats' },
];
photoSlots.forEach(({box,input})=>{
  const boxEl = document.querySelector(box);
  const inpEl = document.querySelector(input);
  if (!boxEl || !inpEl) return;
  const resetValue = ()=>{ try{ inpEl.value=''; }catch(e){} };
  boxEl.addEventListener('mousedown', resetValue, {capture:true});
  boxEl.addEventListener('touchstart', resetValue, {capture:true, passive:true});
  boxEl.addEventListener('click', ()=> inpEl.click());
  inpEl.addEventListener('change', ()=>{
    const file = inpEl.files && inpEl.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ()=>{
      let img = boxEl.querySelector('img.ph-preview');
      if (!img){
        img = document.createElement('img');
        img.className = 'ph-preview';
        boxEl.innerHTML = '';
        boxEl.appendChild(img);
      }
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
});
/* ==== bottom-sheet календарь ==== */
const birthInput = document.getElementById('birthdate');
const sheet = document.getElementById('rnDateSheet');
const selDay = document.getElementById('rnDay');
const selMonth = document.getElementById('rnMonth');
const selYear = document.getElementById('rnYear');
const btnOk = document.getElementById('rnOk');
const btnCancel = document.getElementById('rnCancel');
function openSheet(){ sheet.classList.add('is-open'); sheet.setAttribute('aria-hidden','false'); }
function closeSheet(){ sheet.classList.remove('is-open'); sheet.setAttribute('aria-hidden','true'); }
function pad(n){ return n<10 ? '0'+n : ''+n; }
(function initDate(){
  const now = new Date();
  const yMax = now.getFullYear(), yMin = yMax - 85;
  for (let y = yMax; y >= yMin; y--) { const o=document.createElement('option'); o.value=y; o.textContent=y; selYear.appendChild(o); }
  for (let m=1; m<=12; m++) { const o=document.createElement('option'); o.value=m; o.textContent=pad(m); selMonth.appendChild(o); }
  function fillDays(){
    const y = Number(selYear.value || yMax); const m = Number(selMonth.value || 1);
    const days = new Date(y, m, 0).getDate();
    selDay.innerHTML='';
    for (let d=1; d<=days; d++){ const o=document.createElement('option'); o.value=d; o.textContent=pad(d); selDay.appendChild(o); }
  }
  selYear.addEventListener('change', fillDays);
  selMonth.addEventListener('change', fillDays);
  fillDays();
})();
if (birthInput){
  birthInput.addEventListener('click', openSheet);
  birthInput.addEventListener('focus', (e)=>{ e.preventDefault(); openSheet(); birthInput.blur(); });
}
btnCancel.addEventListener('click', closeSheet);
btnOk.addEventListener('click', ()=>{const y = selYear.value, m = pad(Number(selMonth.value)), d = pad(Number(selDay.value));
  birthInput.value = `${d}.${m}.${y}`;
  birthInput.dataset.iso = `${y}-${m}-${d}`;
  closeSheet();
});
sheet.addEventListener('click', (e)=>{ if (e.target===sheet) closeSheet(); });
/* ==== утилиты ==== */
function showToast(msg, ms=1500){
  let t = document.getElementById('toast');
  if (!t){
    t = document.createElement('div');
    t.id='toast';
    Object.assign(t.style,{
      position:'fixed',left:'50%',bottom:'80px',transform:'translateX(-50%)',
      padding:'10px 14px',borderRadius:'12px',zIndex:9999,
      border:'1px solid var(--stroke)',
      background:'linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.03))',
      backdropFilter:'blur(12px) saturate(140%)',boxShadow:'0 10px 30px rgba(0,0,0,.35)',
      color:'var(--ink)',fontWeight:'800'
    });
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity='1';
  setTimeout(()=>{ t.style.opacity='0'; }, ms);
}
async function fileToDataURL(file) {
  if (!file) return null;
  const reader = new FileReader();
  return await new Promise(res => { reader.onload = () => res(reader.result); reader.readAsDataURL(file); });
}
/* ==== submit ==== */
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (document.getElementById('pass').value !== document.getElementById('pass2').value) {
    showToast('Пароли не совпадают', 1600);
    return;
  }
  const profile = {
    role: (document.querySelector('.role-btn.is-active')?.dataset.role) || 'passenger',
    fullName: document.getElementById('fullName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    birthDisplay: document.getElementById('birthdate').value,
    birthISO: document.getElementById('birthdate').dataset.iso || null,
    gender: document.getElementById('gender').value || null,
    city: document.getElementById('city').value.trim(),
    createdAt: new Date().toISOString()
  };
  const profFile = document.getElementById('profile-photo').files[0];
  profile.profilePhoto = await fileToDataURL(profFile);
  if (profile.role === 'driver') {
    const files = {
      front:       document.getElementById('fileFront').files[0],
      trunk:       document.getElementById('fileTrunk').files[0],
      frontSeats:  document.getElementById('fileFrontSeats').files[0],
      rearSeats:   document.getElementById('fileRearSeats').files[0],
    };
    profile.vehicle = {
      brand: document.getElementById('carBrand').value.trim(),
      model: document.getElementById('carModel').value.trim(),
      year:  document.getElementById('carYear').value.trim(),
      color: document.getElementById('carColor').value.trim(),
      plate: document.getElementById('carPlate').value.trim(),
      photos: {
        front:       await fileToDataURL(files.front),
        trunk:       await fileToDataURL(files.trunk),
        frontSeats:  await fileToDataURL(files.frontSeats),
        rearSeats:   await fileToDataURL(files.rearSeats),
      }
    };
  }
  try {
    localStorage.setItem('ridenow_profile', JSON.stringify(profile));
  } catch (err) {
    showToast('Слишком большие фото — уменьшите размер', 1800);
    return;
  }
  showToast('Аккаунт создан');
  const target = profile.role === 'driver' ? 'profile-driver.html' : 'profile-passenger.html';
  setTimeout(() => { window.location.href = target; }, 350);
});
/* from квитанция.html */
  document.getElementById('printBtn').onclick = ()=> window.print();
  document.getElementById('sendBtn').onclick = ()=>{
    const t=document.getElementById('toast');
    t.style.display='block'; clearTimeout(t._tmr);
    t._tmr=setTimeout(()=>t.style.display='none',1600);
  };
})();

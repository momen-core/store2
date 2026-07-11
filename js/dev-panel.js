/**
 * FAYONKA - Developer Panel (Temporary)
 * Remove before selling by deleting the script tag from all HTML files.
 */
document.addEventListener('DOMContentLoaded', () => {
  const style = document.createElement('style');
  style.textContent = `
    #dev-panel-widget {
      position: fixed; bottom: 20px; left: 20px; z-index: 999999;
      background: #1e1e2f; color: #fff; border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5); width: 310px;
      direction: rtl; border: 1px solid #3b3b4f; font-family: Segoe UI, Tahoma, sans-serif;
      transition: all 0.3s ease; overflow: hidden;
    }
    #dev-panel-widget.minimized { height: 44px; }
    .dp-header { background:#282a36; padding:10px 15px; font-weight:bold;
      display:flex; justify-content:space-between; align-items:center;
      cursor:pointer; border-bottom:1px solid #44475a; }
    .dp-title { display:flex; align-items:center; gap:8px; font-size:0.88rem; }
    .dp-toggle { background:none; border:none; color:#fff; cursor:pointer; font-size:1rem; }
    .dp-body { padding:14px; font-size:0.83rem; }
    .dp-alert { background:rgba(255,85,85,0.12); border-right:3px solid #ff5555;
      padding:10px 12px; margin-bottom:12px; border-radius:6px; color:#ffb86c; line-height:1.6; }
    .dp-msgs { background:#282a36; border-radius:6px; height:130px; overflow-y:auto;
      padding:8px; margin-bottom:10px; border:1px solid #44475a; }
    .dp-msg-item { margin-bottom:8px; padding-bottom:8px; border-bottom:1px dashed #44475a; }
    .dp-msg-date { font-size:0.65rem; color:#6272a4; margin-bottom:2px; }
    .dp-form { display:flex; gap:6px; }
    .dp-input { flex:1; background:#282a36; border:1px solid #44475a; color:#fff;
      padding:6px 10px; border-radius:6px; outline:none; font-family:inherit; font-size:0.82rem; }
    .dp-input:focus { border-color:#bd93f9; }
    .dp-btn { background:#bd93f9; color:#fff; border:none; padding:6px 12px;
      border-radius:6px; cursor:pointer; font-weight:bold; font-size:0.82rem; }
    .dp-btn:hover { background:#ff79c6; }
    .dp-clear { color:#ff5555; background:none; border:none; cursor:pointer;
      font-size:0.72rem; margin-top:6px; padding:0; }
    .dp-simulator-btn {
      width: 100%; margin-top: 10px; padding: 8px; border-radius: 6px;
      border: 1px solid #6272a4; background: #44475a; color: #fff;
      font-weight: bold; cursor: pointer; text-align: center; font-size: 0.8rem;
    }
    .dp-simulator-btn:hover { background: #6272a4; }
    /* Phone Emulator Styles */
    body.phone-emulated {
      background: #333 !important;
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      min-height: 100vh !important;
      margin: 0 !important;
      padding: 20px 0 !important;
    }
    body.phone-emulated > *:not(#dev-panel-widget):not(#emulator-frame-container) {
      display: none !important;
    }
    #emulator-frame-container {
      width: 375px;
      height: 812px;
      background: var(--bg-primary, #fff);
      border: 12px solid #111;
      border-radius: 40px;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
      position: relative;
      overflow-y: auto;
      overflow-x: hidden;
      display: none;
    }
    body.phone-emulated #emulator-frame-container {
      display: block;
    }
  `;
  document.head.appendChild(style);

  // Inject responsive.js dynamically to ensure it runs
  const respScript = document.createElement('script');
  respScript.src = (window.location.pathname.includes('/admin/') ? '../js/responsive.js' : 'js/responsive.js');
  document.head.appendChild(respScript);

  const widget = document.createElement('div');
  widget.id = 'dev-panel-widget';
  widget.innerHTML = `
    <div class="dp-header" id="dp-header">
      <div class="dp-title">👨‍💻 لوحة المبرمج + محاكاة الهاتف</div>
      <button class="dp-toggle" id="dp-toggle">▲</button>
    </div>
    <div class="dp-body" id="dp-body">
      <div class="dp-alert">
        <strong>⚠️ تنبيه:</strong><br>
        هذا الموقع تحت التشفير من قبل المبرمج ومعروض لمن يهمه الأمر فقط.
      </div>
      <div class="dp-msgs" id="dp-msgs"></div>
      <form class="dp-form" id="dp-form">
        <input type="text" id="dp-input" class="dp-input" placeholder="اكتب رسالة...">
        <button type="submit" class="dp-btn">إضافة</button>
      </form>
      <button class="dp-clear" id="dp-clear-btn">🗑️ مسح كل الرسائل</button>
      <button class="dp-simulator-btn" id="dp-simulator-btn">📱 تشغيل محاكاة الهاتف (موبايل)</button>
    </div>
  `;
  document.body.appendChild(widget);

  const header = document.getElementById('dp-header');
  const toggleBtn = document.getElementById('dp-toggle');
  const form = document.getElementById('dp-form');
  const input = document.getElementById('dp-input');
  const msgList = document.getElementById('dp-msgs');
  const clearBtn = document.getElementById('dp-clear-btn');
  const simBtn = document.getElementById('dp-simulator-btn');

  let minimized = false;
  header.addEventListener('click', (e) => {
    if (e.target.id === 'dp-toggle' || e.target.classList.contains('dp-header')) {
      minimized = !minimized;
      widget.classList.toggle('minimized', minimized);
      toggleBtn.textContent = minimized ? '▼' : '▲';
    }
  });

  // Emulator Toggle Logic
  let isEmulating = localStorage.getItem('fayonka_emulator_active') === 'true';
  
  function applyEmulatorState() {
    if (isEmulating) {
      document.body.classList.add('phone-emulated');
      simBtn.textContent = '🖥️ العودة لنسخة الكمبيوتر';
      simBtn.style.background = '#ff5555';
      
      // Move all original elements into a wrapper frame if not already done
      let frame = document.getElementById('emulator-frame-container');
      if (!frame) {
        frame = document.createElement('div');
        frame.id = 'emulator-frame-container';
        // Gather all elements except widget and scripts
        const children = Array.from(document.body.children).filter(el => el.id !== 'dev-panel-widget' && el.tagName !== 'SCRIPT');
        document.body.insertBefore(frame, document.body.firstChild);
        children.forEach(ch => frame.appendChild(ch));
      }
    } else {
      document.body.classList.remove('phone-emulated');
      simBtn.textContent = '📱 تشغيل محاكاة الهاتف (موبايل)';
      simBtn.style.background = '#44475a';
      
      // Move elements back out
      const frame = document.getElementById('emulator-frame-container');
      if (frame) {
        const children = Array.from(frame.children);
        children.forEach(ch => document.body.insertBefore(ch, frame));
        frame.remove();
      }
    }
  }

  simBtn.addEventListener('click', () => {
    isEmulating = !isEmulating;
    localStorage.setItem('fayonka_emulator_active', String(isEmulating));
    applyEmulatorState();
  });

  // Apply on load
  if (isEmulating) {
    applyEmulatorState();
  }

  function renderMsgs() {
    const msgs = JSON.parse(localStorage.getItem('fayonka_dev_messages') || '[]');
    if (!msgs.length) {
      msgList.innerHTML = '<div style="color:#6272a4;text-align:center;padding:20px">لا توجد رسائل</div>';
    } else {
      msgList.innerHTML = msgs.map(m => `
        <div class="dp-msg-item">
          <div class="dp-msg-date">${new Date(m.date).toLocaleString('ar-EG')}</div>
          <div>${m.text}</div>
        </div>`).join('');
      msgList.scrollTop = msgList.scrollHeight;
    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    const msgs = JSON.parse(localStorage.getItem('fayonka_dev_messages') || '[]');
    msgs.push({ text, date: new Date().toISOString() });
    localStorage.setItem('fayonka_dev_messages', JSON.stringify(msgs));
    input.value = '';
    renderMsgs();
  });

  clearBtn.addEventListener('click', () => {
    if (confirm('هل تريد مسح كل الرسائل؟')) {
      localStorage.removeItem('fayonka_dev_messages');
      renderMsgs();
    }
  });

  renderMsgs();
});


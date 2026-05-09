// ── 1. Partidas ──────────────────────────────────────────────────────────────
const bolaoMatches = [
  { id: 'm1', group: 'Grupo C', date: 'Sáb, 13/06', time: '19h',    homeTeam: 'Brasil',    homeFlag: '🇧🇷', awayTeam: 'Marrocos',      awayFlag: '🇲🇦', venue: 'Nova York/NJ' },
  { id: 'm2', group: 'Grupo I', date: 'Ter, 16/06', time: '16h',    homeTeam: 'França',    homeFlag: '🇫🇷', awayTeam: 'Senegal',       awayFlag: '🇸🇳', venue: 'Nova York/NJ' },
  { id: 'm3', group: 'Grupo L', date: 'Qua, 17/06', time: '17h',    homeTeam: 'Inglaterra',homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayTeam: 'Croácia',       awayFlag: '🇭🇷', venue: 'Dallas'       },
  { id: 'm4', group: 'Grupo C', date: 'Sex, 19/06', time: '21h30',  homeTeam: 'Brasil',    homeFlag: '🇧🇷', awayTeam: 'Haiti',         awayFlag: '🇭🇹', venue: 'Filadélfia'   },
  { id: 'm5', group: 'Grupo E', date: 'Sáb, 20/06', time: '17h',    homeTeam: 'Alemanha',  homeFlag: '🇩🇪', awayTeam: 'C. do Marfim',  awayFlag: '🇨🇮', venue: 'Toronto'      },
  { id: 'm6', group: 'Grupo C', date: 'Qua, 24/06', time: '19h',    homeTeam: 'Escócia',   homeFlag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', awayTeam: 'Brasil',        awayFlag: '🇧🇷', venue: 'Miami'        },
];

// ── 2. Estado local ───────────────────────────────────────────────────────────
let myUid     = localStorage.getItem('bolao_uid');
let myPerfil  = JSON.parse(localStorage.getItem('bolao_perfil') || 'null');
let myPalpites = {};
let myScore   = 0;
let resultados = {};
let allJogadores = {};

// ── 3. Pontuação ──────────────────────────────────────────────────────────────
function calcPoints(pH, pA, rH, rA) {
  pH = parseInt(pH, 10); pA = parseInt(pA, 10);
  rH = parseInt(rH, 10); rA = parseInt(rA, 10);
  if (isNaN(pH) || isNaN(pA)) return 0;
  if (pH === rH && pA === rA) return 5;
  const pd = pH - pA, rd = rH - rA;
  if ((pd > 0 && rd > 0) || (pd < 0 && rd < 0) || (pd === 0 && rd === 0))
    return pd === rd ? 3 : 2;
  return 0;
}

function calcTotalScore(palpites, res) {
  return bolaoMatches.reduce((total, m) => {
    const r = res[m.id], p = palpites[m.id];
    if (!r || !p || p.home === '' || p.away === '') return total;
    return total + calcPoints(p.home, p.away, r.home, r.away);
  }, 0);
}

// ── 4. Firebase helpers ───────────────────────────────────────────────────────
function generateUID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

function fbSaveScore(score) {
  if (!myUid) return;
  db.ref(`bolao/jogadores/${myUid}/pontos`).set(score);
}

function fbSavePalpite(matchId, home, away) {
  if (!myUid) return;
  db.ref(`bolao/jogadores/${myUid}/palpites/${matchId}`).set({ home, away });
}

// ── 5. Cadastro ───────────────────────────────────────────────────────────────
window.selectEmoji = function (el) {
  document.querySelectorAll('.emoji-option').forEach(e => e.classList.remove('selected'));
  el.classList.add('selected');
};

window.submitRegistration = function () {
  const apelido = document.getElementById('regApelido').value.trim();
  const emojiEl = document.querySelector('.emoji-option.selected');
  const emoji   = emojiEl ? emojiEl.dataset.emoji : '⚽';
  const errEl   = document.getElementById('regError');

  if (apelido.length < 2) { errEl.textContent = 'Apelido deve ter pelo menos 2 caracteres.'; return; }
  if (apelido.length > 20) { errEl.textContent = 'Máximo de 20 caracteres.'; return; }
  errEl.textContent = '';

  myUid    = generateUID();
  myPerfil = { apelido, emoji };
  localStorage.setItem('bolao_uid',    myUid);
  localStorage.setItem('bolao_perfil', JSON.stringify(myPerfil));

  db.ref(`bolao/jogadores/${myUid}`).set({ apelido, emoji, pontos: 0, palpites: {} });

  document.getElementById('registerModal').classList.add('hidden');

  if (localStorage.getItem('bolaoRulesSeen') !== '1')
    document.getElementById('rulesOverlay').classList.remove('hidden');

  updateProfileBadge();
  startListeners();
};

// Permite editar apelido / emoji
window.openEditModal = function () {
  if (!myPerfil) return;
  document.getElementById('regApelido').value = myPerfil.apelido;
  // Marca o emoji atual
  document.querySelectorAll('.emoji-option').forEach(el => {
    el.classList.toggle('selected', el.dataset.emoji === myPerfil.emoji);
  });
  document.getElementById('regError').textContent = '';
  document.getElementById('registerModal').classList.remove('hidden');

  // Troca o botão para "Salvar alterações"
  const btn = document.querySelector('#registerModal .rules-modal-btn');
  btn.textContent = 'Salvar alterações ✅';
  btn.onclick = saveProfileEdit;
};

function saveProfileEdit() {
  const apelido = document.getElementById('regApelido').value.trim();
  const emojiEl = document.querySelector('.emoji-option.selected');
  const emoji   = emojiEl ? emojiEl.dataset.emoji : myPerfil.emoji;
  const errEl   = document.getElementById('regError');

  if (apelido.length < 2) { errEl.textContent = 'Mínimo de 2 caracteres.'; return; }
  if (apelido.length > 20) { errEl.textContent = 'Máximo de 20 caracteres.'; return; }

  myPerfil = { apelido, emoji };
  localStorage.setItem('bolao_perfil', JSON.stringify(myPerfil));

  db.ref(`bolao/jogadores/${myUid}/apelido`).set(apelido);
  db.ref(`bolao/jogadores/${myUid}/emoji`).set(emoji);

  document.getElementById('registerModal').classList.add('hidden');

  // Restaura botão original
  const btn = document.querySelector('#registerModal .rules-modal-btn');
  btn.textContent = 'Entrar no Bolão! 🚀';
  btn.onclick = window.submitRegistration;

  updateProfileBadge();
};

// ── 6. UI helpers ─────────────────────────────────────────────────────────────
function updateProfileBadge() {
  if (!myPerfil) return;
  const el = document.getElementById('myProfileBadge');
  if (el) el.textContent = `${myPerfil.emoji} ${myPerfil.apelido} ✏️`;
}

function renderMatches() {
  const container = document.getElementById('palpitesContainer');
  container.innerHTML = bolaoMatches.map(m => {
    const p  = myPalpites[m.id] || { home: '', away: '' };
    const r  = resultados[m.id];
    const done = !!r;

    let badge = `<span class="status-badge status-waiting">⏳ Aguardando resultado</span>`;
    if (done) {
      if (p.home !== '' && p.away !== '') {
        const pts = calcPoints(p.home, p.away, r.home, r.away);
        badge = `<span class="status-badge ${pts > 0 ? 'status-points' : 'status-zero'}">
          Gabarito: ${r.home}×${r.away} · ${pts > 0 ? '+' : ''}${pts} pts</span>`;
      } else {
        badge = `<span class="status-badge status-zero">Gabarito: ${r.home}×${r.away} · Não palpitou</span>`;
      }
    }

    return `
      <div class="bolao-card">
        <div class="bolao-meta">
          <div class="meta-left">
            <span class="bolao-group">${m.group}</span>
            <span class="bolao-date">${m.date} · ${m.time}</span>
          </div>
          ${badge}
        </div>
        <div class="bolao-teams">
          <div class="team">
            <span class="team-flag">${m.homeFlag}</span>
            <span class="team-name">${m.homeTeam}</span>
          </div>
          <div class="score-inputs">
            <input type="number" min="0" max="15" class="score-input"
              id="phome-${m.id}" value="${p.home}"
              oninput="updatePalpite('${m.id}', this.value, document.getElementById('paway-${m.id}').value)"
              ${done ? 'disabled' : ''}>
            <span class="score-sep">×</span>
            <input type="number" min="0" max="15" class="score-input"
              id="paway-${m.id}" value="${p.away}"
              oninput="updatePalpite('${m.id}', document.getElementById('phome-${m.id}').value, this.value)"
              ${done ? 'disabled' : ''}>
          </div>
          <div class="team">
            <span class="team-flag">${m.awayFlag}</span>
            <span class="team-name">${m.awayTeam}</span>
          </div>
        </div>
        <div class="bolao-venue">📍 ${m.venue}</div>
      </div>`;
  }).join('');
}

function renderRanking() {
  document.getElementById('currentScore').textContent = myScore;

  const sorted = Object.entries(allJogadores)
    .map(([uid, j]) => ({ uid, ...j }))
    .sort((a, b) => (b.pontos || 0) - (a.pontos || 0));

  if (!sorted.length) {
    document.getElementById('rankingList').innerHTML =
      `<div style="text-align:center;padding:20px;color:var(--text-muted);">Nenhum jogador ainda. Seja o primeiro! 🚀</div>`;
    return;
  }

  const medals = ['🥇', '🥈', '🥉'];
  document.getElementById('rankingList').innerHTML = sorted.map((j, i) => {
    const isMe = j.uid === myUid;
    return `
      <div class="rank-row ${isMe ? 'is-me' : ''}">
        <div class="rank-pos">${medals[i] || `${i + 1}º`}</div>
        <div class="rank-name">${j.emoji || '⚽'} ${j.apelido || 'Anônimo'}</div>
        <div class="rank-pts">${j.pontos || 0} pts</div>
      </div>`;
  }).join('');
}

// ── 7. Palpites ───────────────────────────────────────────────────────────────
window.updatePalpite = function (id, homeStr, awayStr) {
  if (resultados[id] || !myUid) return;
  myPalpites[id] = { home: homeStr, away: awayStr };
  fbSavePalpite(id, homeStr, awayStr);
  myScore = calcTotalScore(myPalpites, resultados);
  fbSaveScore(myScore);
  renderRanking();
};

// ── 8. Listeners Firebase ─────────────────────────────────────────────────────
function startListeners() {
  // Resultados oficiais (admin atualiza pelo Console do Firebase)
  db.ref('bolao/resultados').on('value', snap => {
    resultados = snap.val() || {};
    myScore = calcTotalScore(myPalpites, resultados);
    fbSaveScore(myScore);
    renderMatches();
    renderRanking();
  });

  // Ranking global em tempo real
  db.ref('bolao/jogadores').on('value', snap => {
    allJogadores = snap.val() || {};
    renderRanking();
  });

  // Meus palpites (carrega 1x e salva localmente)
  db.ref(`bolao/jogadores/${myUid}/palpites`).once('value', snap => {
    myPalpites = snap.val() || {};
    renderMatches();
    myScore = calcTotalScore(myPalpites, resultados);
    renderRanking();
  });
}

// ── 9. Reset ──────────────────────────────────────────────────────────────────
window.resetBolao = function () {
  document.getElementById('resetModalOverlay').classList.add('visible');
};

window.closeResetModal = function (e) {
  const overlay = document.getElementById('resetModalOverlay');
  if (e && e.target !== overlay) return;
  overlay.classList.remove('visible');
};

window.confirmResetBolao = function () {
  if (!myUid) return;
  myPalpites = {};
  myScore    = 0;
  db.ref(`bolao/jogadores/${myUid}/palpites`).remove();
  db.ref(`bolao/jogadores/${myUid}/pontos`).set(0);
  renderMatches();
  renderRanking();
  window.closeResetModal();
};

// ── 10. Compartilhamento ──────────────────────────────────────────────────────
window.copyRanking = function () {
  const top3 = Object.values(allJogadores)
    .sort((a, b) => (b.pontos || 0) - (a.pontos || 0))
    .slice(0, 3)
    .map((j, i) => `${['🥇','🥈','🥉'][i]} ${j.emoji} ${j.apelido}: ${j.pontos || 0}pts`)
    .join('\n');
  const text = `🏆 Bolão da Copa 26\n${myPerfil?.emoji || ''} ${myPerfil?.apelido || 'Eu'}: ${myScore} pts\n\n${top3}\n\nJogue em futplayhub.com.br`;
  if (navigator.clipboard)
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector('button[onclick="copyRanking()"]');
      if (btn) { const t = btn.textContent; btn.textContent = '✅ Copiado!'; setTimeout(() => btn.textContent = t, 2000); }
    });
};

window.shareImage = async function () {
  document.getElementById('shareScore').textContent = myScore;
  const sorted = Object.entries(allJogadores)
    .map(([uid, j]) => ({ uid, ...j }))
    .sort((a, b) => (b.pontos || 0) - (a.pontos || 0))
    .slice(0, 5);
  document.getElementById('shareRanking').innerHTML = sorted.map((j, i) => `
    <div class="sc-rank-row${j.uid === myUid ? ' is-me' : ''}">
      <span class="sc-rank-pos">${i + 1}º</span>
      <span class="sc-rank-name">${j.emoji || ''} ${j.apelido || ''}</span>
      <span class="sc-rank-pts">${j.pontos || 0} pts</span>
    </div>`).join('');

  const card = document.getElementById('shareCard');
  const btn  = document.querySelector('button[onclick="shareImage()"]');
  const old  = btn.textContent;
  try {
    btn.textContent = '⏳ Gerando...'; btn.disabled = true;
    card.style.top = '0'; card.style.left = '-9999px';
    await new Promise(r => setTimeout(r, 150));
    const canvas = await html2canvas(card, { backgroundColor: '#031a0c', scale: 2, useCORS: true, logging: false });
    card.style.top = '-9999px';
    const result = await shareOrDownload(canvas, 'meu-bolao-copa.png',
      `Tenho ${myScore} pts no Bolão da Copa 2026! Será que você me supera? futplayhub.com.br`);
    if (result === 'cancelled') { btn.textContent = old; btn.disabled = false; return; }
    btn.textContent = result === 'shared' ? '✅ Compartilhado!' : '✅ Salvo!';
  } catch (err) {
    console.error(err); btn.textContent = '❌ Erro';
  } finally {
    setTimeout(() => { btn.textContent = old; btn.disabled = false; card.style.top = '-9999px'; }, 2500);
  }
};

// ── 11. Modal de regras ───────────────────────────────────────────────────────
window.dismissRulesModal = function () {
  const el = document.getElementById('rulesOverlay');
  if (el) { el.classList.add('hidden'); localStorage.setItem('bolaoRulesSeen', '1'); }
};

// ── 12. Init ──────────────────────────────────────────────────────────────────
(function init() {
  if (!myUid) {
    document.getElementById('registerModal').classList.remove('hidden');
    document.getElementById('rulesOverlay').classList.add('hidden');
    return;
  }

  document.getElementById('registerModal').classList.add('hidden');
  if (localStorage.getItem('bolaoRulesSeen') !== '1')
    document.getElementById('rulesOverlay').classList.remove('hidden');
  else
    document.getElementById('rulesOverlay').classList.add('hidden');

  updateProfileBadge();
  startListeners();
})();

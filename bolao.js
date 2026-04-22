// ── 1. Camada de Dados e Estado ──────────────────────────────────────────
const bolaoMatches = [
  { id: "m1", group: "Grupo C", date: "Sáb, 13/06", time: "19h", homeTeam: "Brasil", homeFlag: "🇧🇷", awayTeam: "Marrocos", awayFlag: "🇲🇦", venue: "Nova York/NJ" },
  { id: "m2", group: "Grupo I", date: "Ter, 16/06", time: "16h", homeTeam: "França", homeFlag: "🇫🇷", awayTeam: "Senegal", awayFlag: "🇸🇳", venue: "Nova York/NJ" },
  { id: "m3", group: "Grupo L", date: "Qua, 17/06", time: "17h", homeTeam: "Inglaterra", homeFlag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", awayTeam: "Croácia", awayFlag: "🇭🇷", venue: "Dallas" },
  { id: "m4", group: "Grupo C", date: "Sex, 19/06", time: "21h30", homeTeam: "Brasil", homeFlag: "🇧🇷", awayTeam: "Haiti", awayFlag: "🇭🇹", venue: "Filadélfia" },
  { id: "m5", group: "Grupo E", date: "Sáb, 20/06", time: "17h", homeTeam: "Alemanha", homeFlag: "🇩🇪", awayTeam: "C. do Marfim", awayFlag: "🇨🇮", venue: "Toronto" },
  { id: "m6", group: "Grupo C", date: "Qua, 24/06", time: "19h", homeTeam: "Escócia", homeFlag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿", awayTeam: "Brasil", awayFlag: "🇧🇷", venue: "Miami" }
];

// O Gabarito Fixo: Simula os resultados que "já aconteceram" no mundo real.
const resultadosOficiais = {
  m1: { home: 2, away: 1 }, // Exemplo: Brasil 2 x 1 Marrocos
  m2: { home: 0, away: 0 }  // Exemplo: França 0 x 0 Senegal
  // Demais jogos ainda não aconteceram
};

const state = {
  palpites: JSON.parse(localStorage.getItem("bolao_palpites") || "{}"),
  history: JSON.parse(localStorage.getItem("bolao_history") || '{"best":0}'),
  bots: JSON.parse(localStorage.getItem("bolao_bots") || "null"),
  myScore: 0
};

// ── 2. Regras de Negócio ─────────────────────────────────────────────────
function calcPoints(pHome, pAway, rHome, rAway) {
  pHome = parseInt(pHome, 10);
  pAway = parseInt(pAway, 10);
  rHome = parseInt(rHome, 10);
  rAway = parseInt(rAway, 10);

  if (isNaN(pHome) || isNaN(pAway)) return 0;

  // Placar exato
  if (pHome === rHome && pAway === rAway) return 5;

  const pDiff = pHome - pAway;
  const rDiff = rHome - rAway;

  // Acertou vencedor ou empate
  if ((pDiff > 0 && rDiff > 0) || (pDiff < 0 && rDiff < 0) || (pDiff === 0 && rDiff === 0)) {
    // Acertou também o saldo de gols
    if (pDiff === rDiff) return 3;
    // Acertou só vencedor
    return 2;
  }
  return 0; // Erro total
}

function calculateTotalScore() {
  let baseScore = 0;

  bolaoMatches.forEach(m => {
    const res = resultadosOficiais[m.id];
    if (!res) return; // Só calcula para jogos que já acabaram

    const p = state.palpites[m.id];
    if (p && p.home !== "" && p.away !== "") {
      baseScore += calcPoints(p.home, p.away, res.home, res.away);
    }
  });

  // Integração com Humor do Técnico (apenas se houver algum jogo finalizado)
  const finalizadosCount = Object.keys(resultadosOficiais).length;
  if (finalizadosCount > 0) {
    const mood = parseInt(localStorage.getItem("mood") || "50", 10);
    if (mood >= 70) baseScore += 2;
    else if (mood <= 30) baseScore -= 2;
    baseScore = Math.max(0, baseScore);
  }

  state.myScore = baseScore;

  // Atualiza histórico
  if (state.myScore > state.history.best) {
    state.history.best = state.myScore;
    localStorage.setItem('bolao_history', JSON.stringify(state.history));
  }

  // Gera ou calibra bots competitivos
  if (!state.bots) {
    const botNames = ["Thiago", "Camila", "João", "Marina", "Zeca", "Felipe", "Mariana"];
    state.bots = botNames.map(name => {
      let botScore = state.myScore + Math.floor((Math.random() * 8) - 3);
      botScore = Math.max(0, botScore);
      return { name, score: botScore, isMe: false };
    });
    localStorage.setItem("bolao_bots", JSON.stringify(state.bots));
  }
}

// Handler de eventos de input
window.updatePalpite = function (id, homeStr, awayStr) {
  // Não deixa alterar se já houver resultado oficial
  if (resultadosOficiais[id]) return;

  state.palpites[id] = { home: homeStr, away: awayStr };
  localStorage.setItem("bolao_palpites", JSON.stringify(state.palpites));

  calculateTotalScore();
  renderRanking(); // Atualiza ranking silenciosamente sem refazer os inputs
};

// ── 3. Renderização ──────────────────────────────────────────────────────
function renderMatches() {
  const container = document.getElementById("palpitesContainer");

  container.innerHTML = bolaoMatches.map(m => {
    const p = state.palpites[m.id] || { home: "", away: "" };
    const res = resultadosOficiais[m.id];
    const isFinished = !!res;

    let statusBadge = `<span class="status-badge status-waiting">⏳ Aguardando resultado</span>`;

    if (isFinished) {
      if (p.home !== "" && p.away !== "") {
        const pts = calcPoints(p.home, p.away, res.home, res.away);
        statusBadge = `<span class="status-badge ${pts > 0 ? 'status-points' : 'status-zero'}">Gabarito: ${res.home}×${res.away} • ${pts > 0 ? '+' : ''}${pts} pts</span>`;
      } else {
        statusBadge = `<span class="status-badge status-zero">Gabarito: ${res.home}×${res.away} • Não palpitou (0 pts)</span>`;
      }
    }

    return `
      <div class="bolao-card">
        <div class="bolao-meta">
          <div class="meta-left">
            <span class="bolao-group">${m.group}</span>
            <span class="bolao-date">${m.date} · ${m.time}</span>
          </div>
          ${statusBadge}
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
              ${isFinished ? 'disabled' : ''}>
            <span class="score-sep">×</span>
            <input type="number" min="0" max="15" class="score-input" 
              id="paway-${m.id}" value="${p.away}" 
              oninput="updatePalpite('${m.id}', document.getElementById('phome-${m.id}').value, this.value)"
              ${isFinished ? 'disabled' : ''}>
          </div>
          
          <div class="team">
            <span class="team-flag">${m.awayFlag}</span>
            <span class="team-name">${m.awayTeam}</span>
          </div>
        </div>
        
        <div class="bolao-venue">📍 ${m.venue}</div>
      </div>
    `;
  }).join("");
}

function renderRanking() {
  document.getElementById("bestScore").textContent = state.history.best;
  document.getElementById("currentScore").textContent = state.myScore;

  const allPlayers = [...(state.bots || []), { name: "Você", score: state.myScore, isMe: true }];
  allPlayers.sort((a, b) => b.score - a.score);

  const rankingHtml = allPlayers.map((player, index) => `
    <div class="rank-row ${player.isMe ? 'is-me' : ''}">
      <div class="rank-pos">${index + 1}º</div>
      <div class="rank-name">${player.name}</div>
      <div class="rank-pts">${player.score} pts</div>
    </div>
  `).join("");

  document.getElementById("rankingList").innerHTML = rankingHtml;
}

window.resetBolao = function () {
  document.getElementById("resetModalOverlay").classList.add("visible");
};

window.closeResetModal = function (e) {
  const overlay = document.getElementById("resetModalOverlay");
  if (e && e.target !== overlay) return;
  overlay.classList.remove("visible");
};

window.confirmResetBolao = function () {
  state.palpites = {};
  state.history = { best: 0 };
  state.bots = null;
  state.myScore = 0;

  localStorage.removeItem("bolao_palpites");
  localStorage.removeItem("bolao_history");
  localStorage.removeItem("bolao_bots");

  calculateTotalScore();
  renderMatches();
  renderRanking();

  window.closeResetModal();
};

// ── Compartilhamento ─────────────────────────────────────────────────────
window.copyRanking = function () {
  const rankStr = `🏆 Bolão da Copa 26\nEstou com ${state.myScore} pontos!\nSerá que você me ganha?`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(rankStr).then(() => {
      const btn = document.querySelector('button[onclick="copyRanking()"]');
      if (btn) {
        const oldText = btn.textContent;
        btn.textContent = "✅ Copiado!";
        setTimeout(() => btn.textContent = oldText, 2000);
      }
    }).catch(e => console.error(e));
  }
};

window.shareImage = async function () {
  document.getElementById("shareScore").textContent = state.myScore;

  const allPlayers = [...(state.bots || []), { name: "Você", score: state.myScore, isMe: true }];
  allPlayers.sort((a, b) => b.score - a.score);
  const top3 = allPlayers.slice(0, 3).map((p, i) =>
    `<div style="display:flex; justify-content:space-between; margin-bottom:8px; ${p.isMe ? 'color:#4ade80;' : ''}">
      <span>${i + 1}º ${p.name}</span><span>${p.score} pts</span>
    </div>`
  ).join("");
  document.getElementById("shareRanking").innerHTML = top3;

  const card = document.getElementById("shareCard");
  const btn = document.querySelector('button[onclick="shareImage()"]');
  const oldText = btn.textContent;

  try {
    btn.textContent = "⏳ Gerando...";
    btn.disabled = true;
    card.style.top = "0";
    card.style.zIndex = "-1";

    const canvas = await html2canvas(card, { backgroundColor: "#052e16", scale: 2 });

    card.style.top = "-9999px";

    const link = document.createElement("a");
    link.download = "meu-bolao-copa.png";
    link.href = canvas.toDataURL("image/png");
    link.click();

    btn.textContent = "✅ Salvo!";
  } catch (err) {
    console.error(err);
    btn.textContent = "❌ Erro";
  } finally {
    setTimeout(() => { btn.textContent = oldText; btn.disabled = false; }, 2500);
    card.style.top = "-9999px";
  }
};

// ── Início ───────────────────────────────────────────────────────────────
calculateTotalScore();
renderMatches();
renderRanking();

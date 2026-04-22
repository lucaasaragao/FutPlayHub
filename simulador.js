// ── DATA: GRUPOS OFICIAIS (SIMULADOS) ──────────────────────────
const groupData = {
  A: { teams: [{ n: "EUA", f: "🇺🇸" }, { n: "México", f: "🇲🇽" }, { n: "Canadá", f: "🇨🇦" }, { n: "Panamá", f: "🇵🇦" }] },
  B: { teams: [{ n: "Argentina", f: "🇦🇷" }, { n: "Polônia", f: "🇵🇱" }, { n: "Arábia Saudita", f: "🇸🇦" }, { n: "Peru", f: "🇵🇪" }] },
  C: { teams: [{ n: "Brasil", f: "🇧🇷" }, { n: "Marrocos", f: "🇲🇦" }, { n: "Escócia", f: "🏴󠁧󠁢󠁳󠁣󠁴󠁿" }, { n: "Haiti", f: "🇭🇹" }] },
  D: { teams: [{ n: "França", f: "🇫🇷" }, { n: "Dinamarca", f: "🇩🇰" }, { n: "Tunísia", f: "🇹🇳" }, { n: "Austrália", f: "🇦🇺" }] },
  E: { teams: [{ n: "Espanha", f: "🇪🇸" }, { n: "Alemanha", f: "🇩🇪" }, { n: "Japão", f: "🇯🇵" }, { n: "Costa Rica", f: "🇨🇷" }] },
  F: { teams: [{ n: "Bélgica", f: "🇧🇪" }, { n: "Croácia", f: "🇭🇷" }, { n: "Nigéria", f: "🇳🇬" }, { n: "Irã", f: "🇮🇷" }] },
  G: { teams: [{ n: "Inglaterra", f: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" }, { n: "Suíça", f: "🇨🇭" }, { n: "Sérvia", f: "🇷🇸" }, { n: "Gana", f: "🇬🇭" }] },
  H: { teams: [{ n: "Portugal", f: "🇵🇹" }, { n: "Uruguai", f: "🇺🇾" }, { n: "Coreia do Sul", f: "🇰🇷" }, { n: "Camarões", f: "🇨🇲" }] }
};

// ── STATE ──────────────────────────────────────────────────
let state = {
  view: 'groups',
  picks: {},
  bracket: {
    oitavas: Array(8).fill(null).map(() => ({ home: null, away: null, winner: null })),
    quartas: Array(4).fill(null).map(() => ({ home: null, away: null, winner: null })),
    semi: Array(2).fill(null).map(() => ({ home: null, away: null, winner: null })),
    final: { home: null, away: null, winner: null },
    campeao: null,
    path: [] // Nomes dos times que estão no caminho do campeão
  }
};

// ── INIT ───────────────────────────────────────────────────
function init() {
  loadProgress();
  renderGroups();
  checkGroupsComplete();
}

// ── RENDER GROUPS ──────────────────────────────────────────
function renderGroups() {
  const grid = document.getElementById("groupsGrid");
  if (!grid) return;
  
  grid.innerHTML = "";
  Object.entries(groupData).forEach(([letter, data]) => {
    const pick = state.picks[letter] || { first: null, second: null };
    const isComplete = pick.first && pick.second;
    
    const card = document.createElement("div");
    card.className = `group-card ${isComplete ? 'complete' : ''}`;
    card.innerHTML = `
      <div class="group-title">Grupo ${letter} ${isComplete ? '✅' : ''}</div>
      ${data.teams.map(t => {
        const isFirst = pick.first && pick.first.n === t.n;
        const isSecond = pick.second && pick.second.n === t.n;
        
        return `
          <div class="team-item" onclick="autoPick('${letter}', '${t.n}')">
            <div class="team-info">
              <span>${t.f}</span>
              <span>${t.n}</span>
            </div>
            <div class="team-rank-picks">
              <button class="rank-btn ${isFirst ? 'active first' : ''}" onclick="event.stopPropagation(); pickGroup('${letter}', '${t.n}', 1)">1º</button>
              <button class="rank-btn ${isSecond ? 'active second' : ''}" onclick="event.stopPropagation(); pickGroup('${letter}', '${t.n}', 2)">2º</button>
            </div>
          </div>
        `;
      }).join('')}
    `;
    grid.appendChild(card);
  });
}

// Facilita a seleção clicando no card
function autoPick(letter, teamName) {
  const current = state.picks[letter] || { first: null, second: null };
  if (!current.first) pickGroup(letter, teamName, 1);
  else if (!current.second && current.first.n !== teamName) pickGroup(letter, teamName, 2);
}

function pickGroup(letter, teamName, rank) {
  if (!state.picks[letter]) state.picks[letter] = { first: null, second: null };
  const teamObj = groupData[letter].teams.find(t => t.n === teamName);
  const current = state.picks[letter];
  
  if (rank === 1) {
    if (current.second && current.second.n === teamName) current.second = null;
    current.first = (current.first && current.first.n === teamName) ? null : teamObj;
  } else {
    if (current.first && current.first.n === teamName) current.first = null;
    current.second = (current.second && current.second.n === teamName) ? null : teamObj;
  }
  
  saveProgress();
  renderGroups();
  checkGroupsComplete();
}

function checkGroupsComplete() {
  const letters = Object.keys(groupData);
  const completedCount = letters.filter(l => state.picks[l] && state.picks[l].first && state.picks[l].second).length;
  const pct = (completedCount / 8) * 100;

  document.getElementById("progressFill").style.width = `${pct}%`;
  document.getElementById("progressText").textContent = `${completedCount}/8 grupos definidos`;

  const footer = document.getElementById("stickyNext");
  if (completedCount === 8) {
    footer.style.display = "flex";
    document.getElementById("tabBracket").classList.remove("disabled");
  } else {
    footer.style.display = "none";
    document.getElementById("tabBracket").classList.add("disabled");
  }
}

// ── NAVIGATION ─────────────────────────────────────────────
function showView(v) {
  if (v === 'bracket' && document.getElementById("tabBracket").classList.contains("disabled")) return;
  state.view = v;
  document.getElementById("viewGroups").style.display = v === 'groups' ? 'block' : 'none';
  document.getElementById("viewBracket").style.display = v === 'bracket' ? 'block' : 'none';
  document.getElementById("stickyNext").style.display = (v === 'groups' && Object.keys(state.picks).filter(l => state.picks[l].first && state.picks[l].second).length === 8) ? 'flex' : 'none';
  document.getElementById("tabGroups").classList.toggle("active", v === 'groups');
  document.getElementById("tabBracket").classList.toggle("active", v === 'bracket');
  if (v === 'bracket') renderBracket();
}

function goToBracket() {
  generateInitialBracket();
  showView('bracket');
}

// ── BRACKET LOGIC ──────────────────────────────────────────
function generateInitialBracket() {
  const p = state.picks;
  const pairings = [
    [p.A.first, p.B.second], [p.C.first, p.D.second], [p.E.first, p.F.second], [p.G.first, p.H.second],
    [p.B.first, p.A.second], [p.D.first, p.C.second], [p.F.first, p.E.second], [p.H.first, p.G.second]
  ];
  pairings.forEach((pair, i) => {
    state.bracket.oitavas[i].home = pair[0];
    state.bracket.oitavas[i].away = pair[1];
  });
  saveProgress();
}

function renderBracket() {
  const wrapper = document.getElementById("bracketWrapper");
  if (!wrapper) return;
  wrapper.innerHTML = "";

  const col1 = createRoundCol("Oitavas", state.bracket.oitavas.slice(0, 4), 'oitavas', 0);
  const col2 = createRoundCol("Quartas", state.bracket.quartas.slice(0, 2), 'quartas', 0);
  const col3 = createCenterCol();
  const col4 = createRoundCol("Quartas", state.bracket.quartas.slice(2, 4), 'quartas', 2);
  const col5 = createRoundCol("Oitavas", state.bracket.oitavas.slice(4, 8), 'oitavas', 4);

  wrapper.append(col1, col2, col3, col4, col5);
  updatePathHighlights();
  checkChampion();
}

function createRoundCol(title, matches, phase, offset) {
  const col = document.createElement("div");
  col.className = "round-column";
  const t = document.createElement("div"); t.className = "round-title"; t.textContent = title;
  col.appendChild(t);

  matches.forEach((m, i) => {
    const matchIdx = offset + i;
    const box = document.createElement("div");
    box.className = "match-box";
    box.innerHTML = `
      <div class="match-team ${m.winner && m.winner.n === m.home?.n ? 'winner' : ''}" id="${phase}-${matchIdx}-home" onclick="advance('${phase}', ${matchIdx}, 'home')">
        <span>${m.home ? m.home.f : '❓'}</span>
        <span class="team-name">${m.home ? m.home.n : 'TBD'}</span>
      </div>
      <div class="match-team ${m.winner && m.winner.n === m.away?.n ? 'winner' : ''}" id="${phase}-${matchIdx}-away" onclick="advance('${phase}', ${matchIdx}, 'away')">
        <span>${m.away ? m.away.f : '❓'}</span>
        <span class="team-name">${m.away ? m.away.n : 'TBD'}</span>
      </div>
    `;
    col.appendChild(box);
  });
  return col;
}

function createCenterCol() {
  const col = document.createElement("div");
  col.className = "round-column";
  const s1 = state.bracket.semi[0], s2 = state.bracket.semi[1], f = state.bracket.final;

  col.innerHTML = `
    <div class="round-title">Semifinais</div>
    <div class="match-box">
      <div class="match-team ${s1.winner && s1.winner.n === s1.home?.n ? 'winner' : ''}" id="semi-0-home" onclick="advance('semi', 0, 'home')">
        <span>${s1.home ? s1.home.f : '❓'}</span><span class="team-name">${s1.home ? s1.home.n : 'TBD'}</span>
      </div>
      <div class="match-team ${s1.winner && s1.winner.n === s1.away?.n ? 'winner' : ''}" id="semi-0-away" onclick="advance('semi', 0, 'away')">
        <span>${s1.away ? s1.away.f : '❓'}</span><span class="team-name">${s1.away ? s1.away.n : 'TBD'}</span>
      </div>
    </div>
    <div class="round-title">Grande Final</div>
    <div class="match-box" style="border: 2px solid var(--primary); transform: scale(1.1); box-shadow: 0 10px 30px var(--glow-primary);">
      <div class="match-team ${f.winner && f.winner.n === f.home?.n ? 'winner' : ''}" id="final-0-home" onclick="advance('final', 0, 'home')">
        <span>${f.home ? f.home.f : '❓'}</span><span class="team-name">${f.home ? f.home.n : 'TBD'}</span>
      </div>
      <div class="match-team ${f.winner && f.winner.n === f.away?.n ? 'winner' : ''}" id="final-0-away" onclick="advance('final', 0, 'away')">
        <span>${f.away ? f.away.f : '❓'}</span><span class="team-name">${f.away ? f.away.n : 'TBD'}</span>
      </div>
    </div>
    <div class="match-box">
      <div class="match-team ${s2.winner && s2.winner.n === s2.home?.n ? 'winner' : ''}" id="semi-1-home" onclick="advance('semi', 1, 'home')">
        <span>${s2.home ? s2.home.f : '❓'}</span><span class="team-name">${s2.home ? s2.home.n : 'TBD'}</span>
      </div>
      <div class="match-team ${s2.winner && s2.winner.n === s2.away?.n ? 'winner' : ''}" id="semi-1-away" onclick="advance('semi', 1, 'away')">
        <span>${s2.away ? s2.away.f : '❓'}</span><span class="team-name">${s2.away ? s2.away.n : 'TBD'}</span>
      </div>
    </div>
  `;
  return col;
}

function advance(phase, idx, side) {
  const m = phase === 'final' ? state.bracket.final : state.bracket[phase][idx];
  const winner = side === 'home' ? m.home : m.away;
  if (!winner) return;
  m.winner = winner;

  if (phase === 'oitavas') {
    const qIdx = Math.floor(idx / 2), qSide = idx % 2 === 0 ? 'home' : 'away';
    state.bracket.quartas[qIdx][qSide] = winner;
    resetDownstream('quartas', qIdx);
  } else if (phase === 'quartas') {
    const sIdx = Math.floor(idx / 2), sSide = idx % 2 === 0 ? 'home' : 'away';
    state.bracket.semi[sIdx][sSide] = winner;
    resetDownstream('semi', sIdx);
  } else if (phase === 'semi') {
    const fSide = idx === 0 ? 'home' : 'away';
    state.bracket.final[fSide] = winner;
    resetDownstream('final', 0);
  } else if (phase === 'final') {
    state.bracket.campeao = winner;
  }

  saveProgress();
  renderBracket();
}

function resetDownstream(phase, idx) {
  if (phase === 'quartas') {
    state.bracket.quartas[idx].winner = null;
    const sIdx = Math.floor(idx / 2), sSide = idx % 2 === 0 ? 'home' : 'away';
    state.bracket.semi[sIdx][sSide] = null;
    resetDownstream('semi', sIdx);
  } else if (phase === 'semi') {
    state.bracket.semi[idx].winner = null;
    const fSide = idx === 0 ? 'home' : 'away';
    state.bracket.final[fSide] = null;
    resetDownstream('final', 0);
  } else if (phase === 'final') {
    state.bracket.final.winner = null;
    state.bracket.campeao = null;
  }
}

function updatePathHighlights() {
  const c = state.bracket.campeao;
  const teamsInPath = [];
  if (!c) return;
  
  teamsInPath.push(c.n);
  // Percorre de volta do campeão para encontrar o caminho
  if (state.bracket.final.winner) {
    const f = state.bracket.final;
    const prevSemiIdx = f.winner.n === f.home.n ? 0 : 1;
    const s = state.bracket.semi[prevSemiIdx];
    if (s.winner) {
      const prevQuartaIdx = (prevSemiIdx * 2) + (s.winner.n === s.home.n ? 0 : 1);
      const q = state.bracket.quartas[prevQuartaIdx];
      if (q.winner) {
        const prevOitavaIdx = (prevQuartaIdx * 2) + (q.winner.n === q.home.n ? 0 : 1);
        // Marcamos os IDs
        document.getElementById(`final-0-${f.winner.n === f.home.n ? 'home' : 'away'}`)?.classList.add('path-highlight');
        document.getElementById(`semi-${prevSemiIdx}-${s.winner.n === s.home.n ? 'home' : 'away'}`)?.classList.add('path-highlight');
        document.getElementById(`quartas-${prevQuartaIdx}-${q.winner.n === q.home.n ? 'home' : 'away'}`)?.classList.add('path-highlight');
        document.getElementById(`oitavas-${prevOitavaIdx}-${state.bracket.oitavas[prevOitavaIdx].winner.n === state.bracket.oitavas[prevOitavaIdx].home.n ? 'home' : 'away'}`)?.classList.add('path-highlight');
      }
    }
  }
}

function checkChampion() {
  const c = state.bracket.campeao;
  const res = document.getElementById("champResult");
  if (c) {
    res.style.display = "block";
    document.getElementById("champName").textContent = c.n.toUpperCase();
    const badge = document.getElementById("brasilBadge");
    if (c.n === "Brasil") badge.innerHTML = `<span class="quiz-streak-badge" style="background:#dcfce7; color:#166534; border-color:#86efac">HEXA CONFIRMADO! 🇧🇷</span>`;
    else {
      const lost = Object.values(state.bracket).some(r => Array.isArray(r) ? r.some(m => (m.home?.n === "Brasil" || m.away?.n === "Brasil") && m.winner?.n !== "Brasil" && m.winner !== null) : (state.bracket.final.home?.n === "Brasil" || state.bracket.final.away?.n === "Brasil") && state.bracket.final.winner?.n !== "Brasil" && state.bracket.final.winner !== null);
      badge.innerHTML = lost ? `<span class="quiz-streak-badge" style="background:#fee2e2; color:#991b1b; border-color:#fca5a5">ZICOU O BRASIL 😭</span>` : "";
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  } else res.style.display = "none";
}

// ── SHARE & PERSISTENCE ────────────────────────────────────
function saveProgress() { localStorage.setItem('copa26_bracket_state', JSON.stringify(state)); }
function loadProgress() {
  const saved = localStorage.getItem('copa26_bracket_state');
  if (saved) try { state = { ...state, ...JSON.parse(saved) }; } catch(e) {}
}
function resetSimulator() { localStorage.removeItem('copa26_bracket_state'); location.reload(); }

async function generateShareImage() {
  const c = state.bracket.campeao; if (!c) return;
  const btn = document.querySelector('button[onclick="generateShareImage()"]');
  btn.innerHTML = "⏳ Gerando..."; btn.disabled = true;
  document.getElementById("scFlag").textContent = c.f; document.getElementById("scName").textContent = c.n.toUpperCase();
  document.getElementById("scBadge").textContent = c.n === "Brasil" ? "HEXA CONFIRMADO! 🇧🇷" : "MEU CAMPEÃO DA COPA 🇧🇷";
  const card = document.getElementById("shareCard"); card.style.top = "0"; card.style.left = "0";
  try {
    const canvas = await html2canvas(card, { scale: 1 });
    const link = document.createElement("a"); link.href = canvas.toDataURL("image/png");
    link.download = `campeao-copa26.png`; link.click(); btn.innerHTML = "✅ Salvo!";
  } catch(e) { btn.innerHTML = "❌ Erro"; } finally {
    setTimeout(() => { btn.innerHTML = "📸 Baixar Resultado"; btn.disabled = false; card.style.top = "-9999px"; }, 2000);
  }
}

document.addEventListener("DOMContentLoaded", init);
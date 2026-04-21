// ── Grupo C – Copa do Mundo 2026 ──────────────────────────────────────────
const simMatches = [
  {
    id:      "mar",
    round:   "1ª Rodada",
    date:    "Sáb, 13/06",
    time:    "19h (Brasília)",
    label:   "Brasil vs Marrocos",
    flag:    "🇲🇦",
    venue:   "MetLife Stadium",
    city:    "Nova York / NJ"
  },
  {
    id:      "hat",
    round:   "2ª Rodada",
    date:    "Sex, 19/06",
    time:    "21h30 (Brasília)",
    label:   "Brasil vs Haiti",
    flag:    "🇭🇹",
    venue:   "Lincoln Financial Field",
    city:    "Filadélfia, PA"
  },
  {
    id:      "esc",
    round:   "3ª Rodada",
    date:    "Qua, 24/06",
    time:    "19h (Brasília)",
    label:   "Brasil vs Escócia",
    flag:    "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    venue:   "Hard Rock Stadium",
    city:    "Miami, FL"
  }
];

const options = ["vitoria", "empate", "derrota"];
const labels  = { vitoria: "⚽ Vitória", empate: "🤝 Empate", derrota: "💀 Derrota" };
const points  = { vitoria: 3, empate: 1, derrota: 0 };

// picks: { [matchId]: "vitoria"|"empate"|"derrota" }
// scores: { [matchId]: { bra: number, adv: number } }
let picks  = JSON.parse(localStorage.getItem("sim26_picks")  || "{}");
let scores = JSON.parse(localStorage.getItem("sim26_scores") || "{}");

// ── Fases ─────────────────────────────────────────────────────────────────
function getStage(total) {
  if (total <= 1) return { label: "Eliminado na fase de grupos", emoji: "😢" };
  if (total <= 4) return { label: "Oitavas de final",            emoji: "🙂" };
  if (total <= 6) return { label: "Quartas de final",            emoji: "🔥" };
  if (total <= 8) return { label: "Semifinal",                   emoji: "🏆" };
  return                 { label: "Campeão do Mundo! 🇧🇷",       emoji: "🌟" };
}

// ── Placar sugerido ao escolher resultado ─────────────────────────────────
const defaultScores = {
  vitoria: { bra: 2, adv: 0 },
  empate:  { bra: 1, adv: 1 },
  derrota: { bra: 0, adv: 1 }
};

// ── Render principal ──────────────────────────────────────────────────────
function renderSimulatorPage() {
  const root   = document.getElementById("simulatorRoot");
  const allDone = simMatches.every(m => Boolean(picks[m.id]));

  const rows = simMatches.map(m => {
    const pick = picks[m.id] || null;
    const sc   = scores[m.id] || { bra: "", adv: "" };

    const btnRow = options.map(o => {
      const isActive = pick === o;
      return `<button
        class="sim-pick-btn ${o}${isActive ? " active" : ""}"
        onclick="selectPick('${m.id}','${o}')"
      >${labels[o]}</button>`;
    }).join("");

    // Placar só aparece quando um resultado foi escolhido
    const scoreBlock = pick ? `
      <div class="sim-score-row" id="score-${m.id}">
        <span class="sim-score-label">🇧🇷 Placar</span>
        <div class="sim-score-inputs">
          <input id="bra-${m.id}" type="number" min="0" max="20" value="${sc.bra}"
            class="sim-score-input" placeholder="BRA"
            oninput="saveScore('${m.id}')"/>
          <span class="sim-score-sep">×</span>
          <input id="adv-${m.id}" type="number" min="0" max="20" value="${sc.adv}"
            class="sim-score-input" placeholder="ADV"
            oninput="saveScore('${m.id}')"/>
        </div>
      </div>` : "";

    return `
    <div class="sim-match-row">
      <div class="sim-match-meta">
        <span class="sim-round-badge">${m.round}</span>
        <span class="sim-match-date">${m.date} · ${m.time}</span>
      </div>
      <div class="sim-match-label">
        <span class="sim-flag">${m.flag}</span>${m.label}
      </div>
      <div class="sim-venue">📍 ${m.venue} — ${m.city}</div>
      <div class="sim-pick-row">${btnRow}</div>
      ${scoreBlock}
    </div>`;
  }).join("");

  // Resumo final
  let resultHtml = "";
  if (allDone) {
    const total = simMatches.reduce((s, m) => s + points[picks[m.id]], 0);
    const stage = getStage(total);

    const scoreSummary = simMatches.map(m => {
      const sc = scores[m.id];
      const placar = (sc && sc.bra !== "" && sc.adv !== "")
        ? ` <span class="res-score">${sc.bra}×${sc.adv}</span>`
        : "";
      const icon = picks[m.id] === "vitoria" ? "✅" : picks[m.id] === "empate" ? "🟡" : "❌";
      return `<div class="res-row">${icon} ${m.label}${placar}</div>`;
    }).join("");

    resultHtml = `
    <div class="sim-result-box" id="simResultBox">
      <span class="sim-result-emoji">${stage.emoji}</span>
      <div class="sim-result-stage">${stage.label}</div>
      <div class="sim-result-pts">Pontos na fase de grupos: ${total} / 9</div>
      <div class="sim-score-summary">${scoreSummary}</div>
      <div class="sim-actions">
        <button class="btn btn-primary" onclick="resetSim()">🔄 Reiniciar</button>
        <button class="btn btn-ghost"   onclick="copySimResult('${stage.label}',${total})">📋 Copiar</button>
      </div>
    </div>`;
  }

  root.innerHTML = rows + resultHtml;
}

// ── Ações ─────────────────────────────────────────────────────────────────
function selectPick(id, val) {
  picks[id] = val;
  // Sugere placar padrão se ainda não tiver sido preenchido
  if (!scores[id] || (scores[id].bra === "" && scores[id].adv === "")) {
    scores[id] = { ...defaultScores[val] };
  }
  persist();
  renderSimulatorPage();
}

function saveScore(id) {
  const braEl = document.getElementById(`bra-${id}`);
  const advEl = document.getElementById(`adv-${id}`);
  if (!braEl || !advEl) return;
  const bra = braEl.value;
  const adv = advEl.value;
  scores[id] = { bra, adv };
  // Corrige pick com base no placar digitado
  const b = parseInt(bra, 10);
  const a = parseInt(adv, 10);
  if (!isNaN(b) && !isNaN(a)) {
    const derived = b > a ? "vitoria" : b < a ? "derrota" : "empate";
    if (picks[id] !== derived) {
      picks[id] = derived;
      persist();
      renderSimulatorPage();
      return;
    }
  }
  persist();
}

function persist() {
  localStorage.setItem("sim26_picks",  JSON.stringify(picks));
  localStorage.setItem("sim26_scores", JSON.stringify(scores));
}

function resetSim() {
  picks  = {};
  scores = {};
  localStorage.removeItem("sim26_picks");
  localStorage.removeItem("sim26_scores");
  renderSimulatorPage();
}

function copySimResult(stage, pts) {
  const lines = simMatches.map(m => {
    const sc  = scores[m.id];
    const res = picks[m.id] === "vitoria" ? "Vitória" : picks[m.id] === "empate" ? "Empate" : "Derrota";
    const placar = (sc && sc.bra !== "" && sc.adv !== "") ? ` (${sc.bra}×${sc.adv})` : "";
    return `${m.label}: ${res}${placar}`;
  }).join("\n");
  const text = `Simulador Copa 2026 🇧🇷\n${lines}\nResultado: ${stage} – ${pts}/9 pts`;
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
}

// ── Init ──────────────────────────────────────────────────────────────────
renderSimulatorPage();
const questions = [
  { q: "Qual seleção venceu a Copa de 2002?", options: ["Brasil", "Argentina", "Alemanha"], answer: 0 },
  { q: "Quem é o maior artilheiro da história das Copas pela seleção brasileira?", options: ["Ronaldo", "Pelé", "Neymar"], answer: 0 },
  { q: "Em qual ano o Brasil venceu sua primeira Copa do Mundo?", options: ["1958", "1962", "1970"], answer: 0 },
  { q: "Qual técnico comandou o Brasil no penta de 2002?", options: ["Tite", "Felipão", "Parreira"], answer: 1 },
  { q: "Quem fez os dois gols do Brasil na final de 2002?", options: ["Rivaldo", "Ronaldinho", "Ronaldo"], answer: 2 }
];

const letters = ['A', 'B', 'C', 'D'];
let state = { index: 0, score: 0, locked: false };

function levelByScore(score) {
  if (score <= 2) return { label: "Torcedor casual", emoji: "😅" };
  if (score <= 4) return { label: "Entende bem", emoji: "🙂" };
  return { label: "Especialista!", emoji: "🏆" };
}

function renderQuizPage() {
  const root = document.getElementById("quizRoot");
  const pct = Math.round((state.index / questions.length) * 100);

  if (state.index >= questions.length) {
    const result = levelByScore(state.score);
    const best = Math.max(Number(localStorage.getItem('copa26_quizBest') || 0), state.score);
    localStorage.setItem('copa26_quizBest', String(best));

    root.innerHTML = `
      <div class="quiz-result-box">
        <span class="quiz-result-emoji">${result.emoji}</span>
        <div class="quiz-result-title">Você acertou ${state.score} de ${questions.length}!</div>
        <div class="quiz-result-level">${result.label}</div>
        ${best > state.score ? `<p style="font-size:12px;color:var(--text-muted);margin-bottom:16px">Melhor pontuação: ${best}/${questions.length}</p>` : ''}
        <div class="quiz-result-actions">
          <button class="btn btn-primary" onclick="restartQuizPage()">🔄 Jogar de novo</button>
          <button class="btn btn-ghost" onclick="copyResult(${state.score}, '${result.label}')">📋 Copiar</button>
        </div>
      </div>
    `;
    return;
  }

  const current = questions[state.index];
  root.innerHTML = `
    <div class="quiz-header-bar">
      <span class="quiz-progress-label">Pergunta ${state.index + 1} de ${questions.length}</span>
      <span class="quiz-score-badge">✅ ${state.score} correto${state.score !== 1 ? 's' : ''}</span>
    </div>
    <div class="quiz-progress-track">
      <div class="quiz-progress-fill" style="width:${pct}%"></div>
    </div>
    <div class="quiz-q-text">${current.q}</div>
    <div class="quiz-options-list">
      ${current.options.map((opt, i) => `
        <button id="opt${i}" class="quiz-opt-btn" onclick="answerQuizPage(${i})">
          <span class="opt-letter">${letters[i]}</span>
          ${opt}
        </button>
      `).join('')}
    </div>
  `;
}

function answerQuizPage(idx) {
  if (state.locked) return;
  state.locked = true;
  const q = questions[state.index];
  if (idx === q.answer) state.score++;

  q.options.forEach((_o, i) => {
    const el = document.getElementById(`opt${i}`);
    if (!el) return;
    el.disabled = true;
    if (i === q.answer) el.classList.add('correct');
    else if (i === idx) el.classList.add('wrong');
  });

  setTimeout(() => {
    state.index++;
    state.locked = false;
    renderQuizPage();
  }, 750);
}

function restartQuizPage() {
  state = { index: 0, score: 0, locked: false };
  renderQuizPage();
}

function copyResult(score, level) {
  const text = `No quiz da Copa 2026 eu fiz ${score}/5. Nível: ${level}. 🇧🇷`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).catch(() => {});
  }
}

renderQuizPage();
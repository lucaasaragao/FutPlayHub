const questions = [
  // ─── 🟢 FÁCEIS (extras) ───────────────────────────────────
  { q: "Qual seleção venceu a Copa do Mundo de 2018?", options: ["França", "Croácia", "Alemanha"], answer: 0, difficulty: "easy" },
  { q: "Quem é conhecido como 'Rei do Futebol'?", options: ["Pelé", "Maradona", "Messi"], answer: 0, difficulty: "easy" },
  { q: "Quantos jogadores um time tem em campo?", options: ["10", "11", "12"], answer: 1, difficulty: "easy" },
  { q: "Qual país sediará a Copa de 2026 junto com EUA e México?", options: ["Canadá", "Espanha", "Japão"], answer: 0, difficulty: "easy" },
  { q: "Qual seleção venceu a Copa de 2006?", options: ["França", "Itália", "Brasil"], answer: 1, difficulty: "easy" },
  { q: "Quem venceu a Copa de 1994?", options: ["Brasil", "Itália", "Alemanha"], answer: 0, difficulty: "easy" },

  // ─── 🟡 MÉDIAS (extras) ───────────────────────────────────
  { q: "Quem foi o artilheiro da Copa de 2014?", options: ["James Rodríguez", "Müller", "Neymar"], answer: 0, difficulty: "medium" },
  { q: "Qual seleção venceu a Copa de 1998?", options: ["Brasil", "França", "Holanda"], answer: 1, difficulty: "medium" },
  { q: "Quem fez o gol do título do Brasil em 1994 (pênaltis)?", options: ["Romário", "Dunga", "Bebeto"], answer: 1, difficulty: "medium" },
  { q: "Qual seleção derrotou a Alemanha na final de 2018?", options: ["Não chegou à final", "França", "Croácia"], answer: 0, difficulty: "medium" },
  { q: "Quem era o camisa 10 do Brasil em 2002?", options: ["Ronaldinho", "Rivaldo", "Kaká"], answer: 1, difficulty: "medium" },
  { q: "Qual seleção venceu a Copa de 1974?", options: ["Holanda", "Alemanha Ocidental", "Brasil"], answer: 1, difficulty: "medium" },

  // ─── 🔴 DIFÍCEIS (extras) ─────────────────────────────────
  { q: "Quem foi o artilheiro da Copa de 1994?", options: ["Romário", "Stoichkov", "Baggio"], answer: 1, difficulty: "hard" },
  { q: "Qual seleção eliminou o Brasil na Copa de 2010?", options: ["Holanda", "Espanha", "Chile"], answer: 0, difficulty: "hard" },
  { q: "Quem fez o gol do título da Alemanha em 2014?", options: ["Klose", "Götze", "Müller"], answer: 1, difficulty: "hard" },
  { q: "Qual foi o adversário do Brasil na final de 2002?", options: ["Alemanha", "França", "Argentina"], answer: 0, difficulty: "hard" },
  { q: "Quem foi o técnico do Brasil em 1994?", options: ["Felipão", "Parreira", "Zagallo"], answer: 1, difficulty: "hard" },
  { q: "Qual seleção venceu a Copa de 1966?", options: ["Alemanha", "Inglaterra", "Brasil"], answer: 1, difficulty: "hard" },

  // ─── 🧠 NERD MODE (extras) ───────────────────────────────
  { q: "Quem deu o passe para o gol de Carlos Alberto na final de 1970?", options: ["Pelé", "Tostão", "Rivelino"], answer: 0, difficulty: "nerd" },
  { q: "Qual seleção foi vice-campeã da Copa de 1958?", options: ["Suécia", "Alemanha", "França"], answer: 0, difficulty: "nerd" },
  { q: "Quem foi o artilheiro da Copa de 2010?", options: ["Forlán", "Sneijder", "Thomas Müller"], answer: 2, difficulty: "nerd" },
  { q: "Qual seleção venceu a primeira Copa do Mundo em 1930?", options: ["Argentina", "Uruguai", "Brasil"], answer: 1, difficulty: "nerd" },
  { q: "Quem foi o goleiro do Brasil na final de 2002?", options: ["Dida", "Marcos", "Rogério Ceni"], answer: 1, difficulty: "nerd" },
  { q: "Quantos gols Pelé marcou em Copas do Mundo?", options: ["10", "12", "14"], answer: 1, difficulty: "nerd" },];

const QUIZ_LENGTH = 7; // Reduzi um pouco para ficar mais intenso
const letters = ['A', 'B', 'C', 'D'];
const diffLevels = ["easy", "medium", "hard", "nerd"];

let state = {
  index: 0,
  score: 0,
  streak: 0,
  currentDifficulty: 0,
  locked: false,
  questionsSession: []
};

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function initQuiz() {
  const session = [];
  const usedIds = new Set();

  // Lógica de dificuldade dinâmica: 
  // Começa fácil e vai tentando subir a régua
  let simulatedDiff = 0;
  for (let i = 0; i < QUIZ_LENGTH; i++) {
    const levelName = diffLevels[simulatedDiff];
    const pool = shuffle(questions.filter(q => q.difficulty === levelName && !usedIds.has(q.q)));

    if (pool.length > 0) {
      const selected = pool[0];
      session.push(selected);
      usedIds.add(selected.q);
    } else {
      // Fallback se esgotar o bucket
      const fallbackPool = shuffle(questions.filter(q => !usedIds.has(q.q)));
      if (fallbackPool.length > 0) {
        const selected = fallbackPool[0];
        session.push(selected);
        usedIds.add(selected.q);
      }
    }

    // Simula uma progressão "ideal" para a montagem inicial, 
    // mas na prática vamos trocar a pergunta em tempo real se o usuário errar?
    // Não, melhor pré-selecionar uma base e trocar a PRÓXIMA se ele errar.
    simulatedDiff = Math.min(3, simulatedDiff + 1);
  }

  state = {
    index: 0,
    score: 0,
    streak: 0,
    currentDifficulty: 0,
    locked: false,
    questionsSession: session
  };
}

function levelByScore(score) {
  const pct = score / QUIZ_LENGTH;
  if (pct < 0.4) return { label: "Torcedor casual", emoji: "😅" };
  if (pct < 0.7) return { label: "Entende bem", emoji: "🙂" };
  return { label: "Especialista!", emoji: "🏆" };
}

function renderQuizPage() {
  const root = document.getElementById("quizRoot");
  const pct = Math.round((state.index / QUIZ_LENGTH) * 100);

  if (state.index >= QUIZ_LENGTH) {
    const result = levelByScore(state.score);
    const best = Math.max(Number(localStorage.getItem('copa26_quizBest') || 0), state.score);
    localStorage.setItem('copa26_quizBest', String(best));

    root.innerHTML = `
      <div class="quiz-result-box">
        <span class="quiz-result-emoji">${result.emoji}</span>
        <div class="quiz-result-title">Você acertou ${state.score} de ${QUIZ_LENGTH}!</div>
        <div class="quiz-result-level">${result.label}</div>
        ${best > state.score ? `<p style="font-size:12px;color:var(--text-muted);margin-bottom:16px">Melhor pontuação: ${best}/${QUIZ_LENGTH}</p>` : ''}
        <div class="quiz-result-actions">
          <button class="btn btn-primary" onclick="restartQuizPage()">🔄 Jogar de novo</button>
          <button class="btn btn-primary" onclick="shareQuizResult(${state.score}, '${result.label}')">
            📸 Compartilhar
          </button>
        </div>
      </div>
    `;
    return;
  }

  const current = state.questionsSession[state.index];
  root.innerHTML = `
    <div class="quiz-header-bar">
      <span class="quiz-progress-label">Pergunta ${state.index + 1} de ${QUIZ_LENGTH}</span>
      <div style="display:flex; gap:8px; align-items:center;">
        ${state.streak >= 2 ? `<span class="quiz-streak-badge">🔥 ${state.streak}</span>` : ''}
        <span class="quiz-score-badge">✅ ${state.score}</span>
      </div>
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

  const q = state.questionsSession[state.index];
  const isCorrect = (idx === q.answer);

  if (isCorrect) {
    state.score++;
    state.streak++;
    // Se acertou, a próxima tenta ser de uma dificuldade maior (se disponível na sessão)
    state.currentDifficulty = Math.min(3, state.currentDifficulty + 1);
  } else {
    state.streak = 0;
    state.currentDifficulty = Math.max(0, state.currentDifficulty - 1);

    // DINAMISMO: Se ele errou, podemos "trocar" a próxima pergunta por uma mais fácil
    if (state.index + 1 < QUIZ_LENGTH) {
      const nextLevel = diffLevels[state.currentDifficulty];
      const usedIds = new Set(state.questionsSession.map(sq => sq.q));
      const pool = shuffle(questions.filter(pq => pq.difficulty === nextLevel && !usedIds.has(pq.q)));
      if (pool.length > 0) {
        state.questionsSession[state.index + 1] = pool[0];
      }
    }
  }

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
  initQuiz();
  renderQuizPage();
}

function copyResult(score, level) {
  const text = `🏆 Quiz Copa 26\nAcertei ${score}/${QUIZ_LENGTH}\nNível: ${level}\nE você?`;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      const btn = document.querySelector('button[onclick^="copyResult"]');
      if (btn) {
        const oldText = btn.innerHTML;
        btn.innerHTML = "✅ Copiado!";
        setTimeout(() => { btn.innerHTML = oldText; }, 2000);
      }
    }).catch(() => { });
  }
}

function getSharePhrase(score) {
  if (score === QUIZ_LENGTH) return "Gabaritei 😎";
  if (score >= QUIZ_LENGTH * 0.7) return "Mandei bem 🔥";
  if (score >= QUIZ_LENGTH * 0.4) return "Quase lá 👀";
  return "Preciso estudar mais 😅";
}

function buildQuizShareCard(score, level) {
  const pct = Math.round((score / QUIZ_LENGTH) * 100);
  const color = pct >= 70 ? '#00c84b' : pct >= 40 ? '#f59e0b' : '#ef4444';

  document.getElementById('storyScore').textContent = score;
  document.getElementById('scTotal').textContent = 'DE ' + QUIZ_LENGTH;
  document.getElementById('storyLevel').textContent = level;
  document.getElementById('storyPhrase').textContent = getSharePhrase(score);

  const circle = document.getElementById('scRingCircle');
  if (circle) {
    const circumference = 282.7;
    const dash = (pct / 100) * circumference;
    circle.style.strokeDasharray = `${dash} ${circumference}`;
    circle.style.stroke = color;
  }
}

async function shareQuizResult(score, level) {
  buildQuizShareCard(score, level);
  const card = document.getElementById("shareCard");
  const btn = document.querySelector('button[onclick^="shareQuizResult"]');
  const oldText = btn.innerHTML;

  try {
    btn.innerHTML = "⏳ Gerando...";
    btn.disabled = true;
    card.style.top = "0";
    card.style.left = "-9999px";
    await new Promise(r => setTimeout(r, 100));

    const canvas = await html2canvas(card, {
      backgroundColor: null,
      scale: 1,
      useCORS: true
    });

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "quiz-copa-resultado.png";
    link.click();
    btn.innerHTML = "✅ Salvo!";
  } catch (e) {
    console.error(e);
    btn.innerHTML = "❌ Erro";
  } finally {
    setTimeout(() => {
      btn.innerHTML = oldText;
      btn.disabled = false;
    }, 2000);
    card.style.top = "-9999px";
  }
}

initQuiz();
renderQuizPage();
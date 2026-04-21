const officialPlayers = [
  {id:1,  name:"Alisson"},       {id:2,  name:"Ederson"},
  {id:3,  name:"Bento"},         {id:4,  name:"Marquinhos"},
  {id:5,  name:"Militão"},       {id:6,  name:"Gabriel Magalhães"},
  {id:7,  name:"Bremer"},        {id:34, name:"Fabrício Bruno"},
  {id:59, name:"Beraldo"},       {id:8,  name:"Danilo"},
  {id:10, name:"Vanderson"},     {id:11, name:"Guilherme Arana"},
  {id:41, name:"Alex Sandro"},   {id:12, name:"Casemiro"},
  {id:13, name:"Bruno Guimarães"},{id:16, name:"Lucas Paquetá"},
  {id:45, name:"Andreas Pereira"},{id:60, name:"João Gomes"},
  {id:19, name:"Vinicius Jr"},   {id:21, name:"Raphinha"},
  {id:18, name:"Neymar"},        {id:24, name:"Endrick"},
  {id:27, name:"Gabriel Martinelli"},{id:51, name:"Pedro"},
  {id:52, name:"Matheus Cunha"}, {id:74, name:"Richarlison"}
];

function runCoachComparisonPage() {
  const box   = document.getElementById("compareResultPage");
  const squad = JSON.parse(localStorage.getItem("squadSnapshot") || "[]");

  if (squad.length !== 26) {
    box.innerHTML = `
      <div class="cmp-empty">
        <div style="font-size:40px;margin-bottom:12px">⚠️</div>
        <strong>Complete sua convocação primeiro</strong><br>
        <span style="font-size:13px;color:var(--text-muted)">Para comparar, monte os 26 jogadores na página de Escalação.</span>
        <br><br>
        <button class="btn btn-primary" onclick="window.location.href='escalacao.html'">
          🗒️ Ir para Escalação
        </button>
      </div>
    `;
    return;
  }

  const userSet     = new Set(squad.map(p => p.id));
  const officialSet = new Set(officialPlayers.map(p => p.id));
  const hits        = squad.filter(p => officialSet.has(p.id));
  const percent     = Math.round((hits.length / 26) * 100);

  const moodEmoji = percent >= 80 ? "🏆" : percent >= 60 ? "😎" : percent >= 40 ? "🙂" : "😅";

  box.innerHTML = `
    <div class="cmp-score-box">
      <div class="cmp-score-num">${moodEmoji} ${percent}%</div>
      <div class="cmp-score-label">Similaridade com a lista oficial · ${hits.length} de 26 acertos</div>
    </div>

    <div class="cmp-legend">
      <span><div class="dot hit"></div> Acertou</span>
      <span><div class="dot miss"></div> Não está na lista</span>
    </div>

    <div class="cmp-columns">
      <div class="cmp-col">
        <div class="cmp-col-title">📋 Lista oficial</div>
        <div class="cmp-pills">
          ${officialPlayers.map(p =>
            `<span class="cmp-pill ${userSet.has(p.id) ? 'hit' : 'miss'}">${p.name}</span>`
          ).join('')}
        </div>
      </div>
      <div class="cmp-col">
        <div class="cmp-col-title">🗒️ Sua convocação</div>
        <div class="cmp-pills">
          ${squad.map(p =>
            `<span class="cmp-pill ${officialSet.has(p.id) ? 'hit' : 'miss'}">${p.name}</span>`
          ).join('')}
        </div>
      </div>
    </div>

    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-ghost" onclick="copyCmpResult(${hits.length}, ${percent})">📋 Copiar resultado</button>
      <button class="btn btn-ghost" onclick="window.location.href='escalacao.html'">✏️ Editar convocação</button>
    </div>
  `;
}

function copyCmpResult(hits, percent) {
  const text = `Minha convocação acertou ${hits}/26 da lista oficial. Similaridade: ${percent}% 🇧🇷`;
  if (navigator.clipboard) navigator.clipboard.writeText(text).catch(() => {});
}

runCoachComparisonPage();
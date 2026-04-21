const routes={
  games:"games.html",
  escalacao:"escalacao.html",
  comparacao:"comparacao.html",
  quiz:"quiz.html",
  simulador:"simulador.html",
  bolao:"bolao.html",
  desafio:"desafio.html"
};

function startNow(){
  localStorage.setItem("trailActive","1");
  window.location.href=routes.escalacao;
}

function goChooseGame(){
  localStorage.setItem("trailActive","0");
  window.location.href=routes.games;
}

function openGame(gameKey){
  localStorage.setItem("trailActive","0");
  window.location.href=routes[gameKey]||routes.escalacao;
}
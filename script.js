// Dados e lógica da aplicação
const players = [
  {id:1,name:"Alisson",pos:"GK",status:"recent",color:"#2563eb",badge:null,photo:"/jogadores/95614_alisson_becker_20250815201322.png"},
  {id:2,name:"Ederson",pos:"GK",status:"recent",color:"#2563eb",badge:null,photo:"/jogadores/136885_ederson_moraes_20250618210458.png"},
  {id:3,name:"Bento",pos:"GK",status:"recent",color:"#2563eb",badge:null,photo:"/jogadores/548364_bento_20251228003543.png"},
  {id:32,name:"Hugo Souza",pos:"GK",status:"recent",color:"#2563eb",badge:null,photo:"/jogadores/569633_hugo_souza_20260327122905.jpg"},
  {id:65,name:"Fábio",pos:"GK",status:"before",color:"#2563eb",badge:"veterano",photo:"https://s3.amazonaws.com/assets-fluminense/uploads%2F1716935830074-53311817769_e9d34776fd_c.jpg"},

  {id:4,name:"Marquinhos",pos:"ZAG",status:"recent",color:"#7c3aed",badge:null,photo:"/jogadores/187757_marquinhos_20250326082619.png"},
  {id:5,name:"Militão",pos:"ZAG",status:"recent",color:"#7c3aed",badge:null,photo:"/jogadores/484829_eder_militao_20240809095340.png"},
  {id:6,name:"Gabriel Magalhães",pos:"ZAG",status:"recent",color:"#7c3aed",badge:null,photo:"/jogadores/499852_gabriel_magalhaes_20250928235227.png"},
  {id:7,name:"Bremer",pos:"ZAG",status:"recent",color:"#7c3aed",badge:null,photo:"/jogadores/478428_bremer_20260104223359.png"},
  {id:34,name:"Fabrício Bruno",pos:"ZAG",status:"recent",color:"#7c3aed",badge:null,photo:"/jogadores/494798_fabricio_bruno_20250828015118.jpg"},
  {id:36,name:"Léo Ortiz",pos:"ZAG",status:"recent",color:"#7c3aed",badge:null,photo:"/jogadores/548794_leo_ortiz_20250617101351.png"},
  {id:37,name:"Léo Pereira",pos:"ZAG",status:"recent",color:"#7c3aed",badge:null,photo:"/jogadores/375084_leo_pereira_20250330143245.png"},
  {id:59,name:"Beraldo",pos:"ZAG",status:"recent",color:"#7c3aed",badge:null,photo:"/jogadores/beraldo.jpg"},
  {id:66,name:"Murillo",pos:"ZAG",status:"recent",color:"#7c3aed",badge:"em alta",photo:"/jogadores/murilo.jpeg"},
  {id:67,name:"Nino",pos:"ZAG",status:"before",color:"#7c3aed",badge:null,photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoy5iA8Nf8hCDG7HvZ1wd0mFdvY7teXNbnx7b0Au8xnJNJqPn9KrTFz9no9JRALzYw3LsJouCBWvj-n2VtQpYa2_aWxbUd5hJBgKe8nA&s=10"},

  {id:8,name:"Danilo",pos:"LAT",status:"recent",color:"#0f766e",badge:null,photo:"/jogadores/91587_danilo_20250620224019.png"},
  {id:9,name:"Wesley",pos:"LAT",status:"recent",color:"#0f766e",badge:null,photo:"/jogadores/742671_wesley_franca_20250905235600.png"},
  {id:10,name:"Vanderson",pos:"LAT",status:"recent",color:"#0f766e",badge:null,photo:"/jogadores/725828_vanderson_20250817133649.png"},
  {id:39,name:"Vitinho",pos:"LAT",status:"recent",color:"#0f766e",badge:null,photo:"/jogadores/547784_vitinho_20241201093508.jpg"},
  {id:40,name:"Paulo Henrique",pos:"LAT",status:"recent",color:"#0f766e",badge:null,photo:"/jogadores/446961_paulo_henrique_20250530170507.png"},
  {id:11,name:"Guilherme Arana",pos:"LAT",status:"recent",color:"#0f766e",badge:null,photo:"/jogadores/1431982_guilherme_arana_20260203104906.png"},
  {id:41,name:"Alex Sandro",pos:"LAT",status:"recent",color:"#0f766e",badge:null,photo:"/jogadores/76601_alex_sandro_20250326083053.jpg"},
  {id:42,name:"Douglas Santos",pos:"LAT",status:"recent",color:"#0f766e",badge:null,photo:"/jogadores/252432_douglas_santos_20260327120411.jpg"},
  {id:46,name:"Caio Henrique",pos:"LAT",status:"recent",color:"#0f766e",badge:null,photo:"/jogadores/500317_caio_henrique_20250817132442.png"},
  {id:38,name:"Luciano Juba",pos:"LAT",status:"recent",color:"#0f766e",badge:null,photo:"/jogadores/juba.webp"},
  {id:63,name:"Ibañez",pos:"LAT",status:"recent",color:"#0f766e",badge:null,photo:"/jogadores/ibanez.png"},
  {id:64,name:"Yan Couto",pos:"LAT",status:"recent",color:"#0f766e",badge:null,photo:"https://www.ogol.com.br/img/jogadores/new/92/87/609287_yan_couto_20250825125735.png"},
  {id:68,name:"Ayrton Lucas",pos:"LAT",status:"before",color:"#0f766e",badge:null,photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUUeL_hq-zZN1mYiO6hf_zyfLCB7CAXCr58iLWhUKiA2k8t7ycc_6O0sCbw77dNNcw5JUXsZ18eaIwzD97x8OAdVOQjmtTW65Rbhp9e4MZpQ&s=10"},
  {id:69,name:"Samuel Lino",pos:"LAT",status:"never",color:"#0f766e",badge:"polêmico",photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQLQxDaq_Gr1Ge9WHs9wR7xxQZ1sqPQa79HeA&s"},
  {id:72,name:"Kaiki Bruno",pos:"LAT",status:"before",color:"#b45309",badge:"equilibrado",photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDGR20LlrNO-ocsK0k6-eQ44a2c4HGGmUBROY_KnWnXNRdnC8atz7pKZC3Cm_yDPVE-mXdj9rRpLnQek9JIDzuMAtnVJkNO6QNWQx9qyfdPw&s=10"},


  {id:12,name:"Casemiro",pos:"MED",status:"recent",color:"#b45309",badge:null,photo:"/jogadores/95621_casemiro_20250920212010.png"},
  {id:13,name:"Bruno Guimarães",pos:"MED",status:"recent",color:"#b45309",badge:null,photo:"/jogadores/463478_bruno_guimaraes_20251021194446.png"},
  {id:16,name:"Lucas Paquetá",pos:"MED",status:"recent",color:"#b45309",badge:null,photo:"/jogadores/477793_lucas_paqueta_20251103170148.png"},
  {id:17,name:"Raphael Veiga",pos:"MED",status:"recent",color:"#b45309",badge:null,photo:"/jogadores/470615_raphael_veiga_20240426201221.png"},
  {id:45,name:"Andreas Pereira",pos:"MED",status:"recent",color:"#b45309",badge:null,photo:"/jogadores/370888_andreas_pereira_20240816193756.png"},
  {id:47,name:"Andrey Santos",pos:"MED",status:"recent",color:"#b45309",badge:null,photo:"/jogadores/653753_andrey_santos_20250922181643.png"},
  {id:48,name:"Danilo dos Santos",pos:"MED",status:"recent",color:"#b45309",badge:null,photo:"/jogadores/685910_danilo_20260327121809.jpg"},
  {id:49,name:"Fabinho",pos:"MED",status:"recent",color:"#b45309",badge:null,photo:"/jogadores/267677_fabinho_20251228011021.png"},
  {id:50,name:"Gabriel Sara",pos:"MED",status:"recent",color:"#b45309",badge:null,photo:"/jogadores/584242_gabriel_sara_20250919162737.png"},
  {id:60,name:"João Gomes",pos:"MED",status:"recent",color:"#b45309",badge:null,photo:"https://www.ogol.com.br/img/jogadores/new/59/35/685935_joao_gomes_20250816191736.png"},
  {id:62,name:"Gerson",pos:"MED",status:"recent",color:"#b45309",badge:null,photo:"https://www.ogol.com.br/img/jogadores/new/24/04/422404_gerson_20260120235013.jpg"},
  {id:70,name:"Douglas Luiz",pos:"MED",status:"recent",color:"#b45309",badge:null,photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFZBm8IQ9gYkhFgRpN4F8mz2CLjWBgu3fgKa1NFKX7joAwtDUtU9zDS1SfGDCEPafOmeItxU0li8k8ViuRUCYl3O5ok3YNWcrriBpmxHLdtw&s=10"},
  {id:71,name:"Joelinton",pos:"MED",status:"recent",color:"#b45309",badge:"força",photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQu2ykDPDUlM3_UcRfAiX6ZigqP72anbnAn3OdU-tUqajj_vUDt3oC0t56MZSMy1nESXHnN-6R8px7ck1D9UKA7L5FnfH1g_JflGYVJfIoV_w&s=10"},

  {id:19,name:"Vinicius Jr",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/547737_vinicius_junior_20250923225603.png"},
  {id:21,name:"Raphinha",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/491013_raphinha_20251203082154.png"},
  {id:22,name:"Rayan",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/620082_rayan_20260207204616.png"},
  {id:24,name:"Endrick",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/829333_endrick_20260313120646.png"},
  {id:27,name:"Gabriel Martinelli",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/619681_gabriel_martinelli_20251030125918.png"},
  {id:61,name:"Savinho",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"https://www.ogol.com.br/img/jogadores/new/01/11/790111_savinho_20250618211022.png"},
  {id:18,name:"Neymar",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/53174188191_42d4c831ae_o.jpg"},
  {id:43,name:"Luiz Henrique",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/564328_luiz_henrique_20250218163216.jpg"},
  {id:44,name:"Igor Jesus",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/646916_igor_jesus_20260227124627.png"},
  {id:51,name:"Pedro",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/481359_pedro_20250617101858.png"},
  {id:52,name:"Matheus Cunha",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/549637_matheus_cunha_20251025173306.png"},
  {id:53,name:"Evanilson",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/513007_evanilson_20251213143033.png"},
  {id:54,name:"João Pedro",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/663256_joao_pedro_20250922180953.png"},
  {id:55,name:"Gabriel Barbosa",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/75171_gabriel_barbosa_20250330021018.png"},
  {id:56,name:"Igor Thiago",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/656216_igor_thiago_20251026001039.png"},
  {id:57,name:"Vitor Roque",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/836402_vitor_roque_20250615225512.png"},
  {id:35,name:"Estêvão",pos:"ATA",status:"recent",color:"#be185d",badge:null,photo:"/jogadores/975614_estevao_20250922180758.png"},
  {id:73,name:"Antony",pos:"ATA",status:"before",color:"#be185d",badge:"polêmico",photo:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1f8EKS6a4FuxMgB1U0gpP5fHM_oV1OwLI6r-jS48_GGmdepZZBC6jEBIgZMkpFMyN36MSS62Z9MbdHsOyjyivUoSdYzYBaVdCctt-4oWHrw&s=10"},
  {id:74,name:"Richarlison",pos:"ATA",status:"recent",color:"#be185d",badge:"9 clássico",photo:"https://cdn-img.staticzz.com/img/jogadores/new/62/75/466275_richarlison_20250817104857.png"},
];

const badgeLabels={};
const badgeClasses={};
const posLabels={GK:"Goleiros",ZAG:"Zagueiros",LAT:"Laterais",MED:"Meios",ATA:"Atacantes"};
const groups={GK:{label:"Goleiros",slots:3},ZAG:{label:"Zagueiros",slots:6},LAT:{label:"Laterais",slots:4},MED:{label:"Meios-campistas",slots:6},ATA:{label:"Atacantes",slots:11}};

let squad=[];
let activeFilter="ALL";
let searchQuery="";
let celebrationDone=false;

function getInitials(n){return n.split(" ").map(x=>x[0]).slice(0,2).join("").toUpperCase();}

function normalize(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();}

function calcMood(){
  if(!squad.length)return 50;
  let score=50,neverCount=0;
  squad.forEach(p=>{
    if(p.status==="recent")score+=2.5;
    else if(p.status==="before")score+=1;
    else{score-=3.5;neverCount++;}
    if(p.badge==="controverso")score-=2;
    if(p.badge==="promessa")score+=0.5;
    if(p.badge==="artilheiro")score+=1;
  });
  if(neverCount>5)score-=(neverCount-5)*3;
  return Math.max(0,Math.min(97,score));
}

function getMoodState(s){
  if(s>=82) return {label:"Confiante", color:"#16a34a"};
  if(s>=63) return {label:"Satisfeito", color:"#84cc16"};
  if(s>=44) return {label:"Neutro", color:"#f59e0b"};
  if(s>=25) return {label:"Irritado", color:"#ef4444"};
  return {label:"Revoltado", color:"#dc2626"};
}

function drawCoach(score,celebrating){
  const el=document.getElementById("coachSvg");
  if(el && el.tagName==="IMG"){
    let imgName="normal.jpg";
    if(celebrating) imgName="feliz.jpg";
    else if(score>=82) imgName="feliz.jpg";
    else if(score>=63) imgName="pouco_feliz.jpg";
    else if(score>=44) imgName="normal.jpg";
    else if(score>=25) imgName="raiva.jpg";
    else imgName="triste.jpg";
    el.src = "img/" + imgName;
    return;
  }
  const svg=document.getElementById("coachSvg");
  const fc="#f5c18a";
  const hairC=score<40?"#1a1a1a":"#3a2a10";
  const eyeC=score<25?"#ef4444":"#1e293b";
  let md;
  if(celebrating)md="M34 60 Q45 73 56 60";
  else if(score>=65)md="M36 62 Q45 70 54 62";
  else if(score>=45)md="M38 64 L52 64";
  else if(score>=25)md="M36 67 Q45 60 54 67";
  else md="M35 70 Q45 60 55 70";
  const sweat=(!celebrating&&score<30)?`<path d="M70 35 Q74 30 71 40" stroke="#93c5fd" stroke-width="2.5" fill="none" stroke-linecap="round"/>`:"";
  const steam=(!celebrating&&score<45&&score>=25)?`<path d="M55 15 Q57 12 55 9" stroke="#94a3b8" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M59 18 Q61 14 59 10" stroke="#94a3b8" stroke-width="1.5" fill="none" stroke-linecap="round"/>`:"";
  const blush=(celebrating||score>=70)?`<circle cx="34" cy="60" r="6" fill="#fca5a5" opacity="0.5"/><circle cx="56" cy="60" r="6" fill="#fca5a5" opacity="0.5"/>`:"";
  const stars="";
  const b1=score<45&&!celebrating?"M33 48 Q38 44 42 47":"M33 49 Q38 47 42 49";
  const b2=score<45&&!celebrating?"M48 47 Q52 44 57 48":"M48 49 Q52 47 57 49";
  svg.innerHTML=`
    <circle cx="45" cy="50" r="34" fill="#e2e8f0"/>
    <ellipse cx="45" cy="55" rx="22" ry="28" fill="${fc}"/>
    <path d="M23 50 Q22 35 30 28 Q38 18 45 20 Q52 18 60 28 Q68 35 67 50" fill="${hairC}"/>
    <rect x="19" y="50" width="52" height="12" rx="3" fill="#16a34a"/>
    <text x="45" y="60" text-anchor="middle" fill="#dcfce7" font-size="7" font-weight="700" font-family="sans-serif">TÉCNICO</text>
    ${blush}
    <circle cx="38" cy="55" r="5" fill="white"/>
    <circle cx="52" cy="55" r="5" fill="white"/>
    <circle cx="39" cy="55" r="3" fill="${eyeC}"/>
    <circle cx="53" cy="55" r="3" fill="${eyeC}"/>
    <path d="${b1}" stroke="${hairC}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="${b2}" stroke="${hairC}" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="${md}" stroke="#7c3aed" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    ${sweat}${steam}${stars}
    <ellipse cx="33" cy="66" rx="6" ry="8" fill="${fc}"/>
    <ellipse cx="57" cy="66" rx="6" ry="8" fill="${fc}"/>
  `;
}

function launchConfetti(){
  const canvas=document.getElementById("confetti-canvas");
  canvas.style.display="block";
  const ctx=canvas.getContext("2d");
  canvas.width=window.innerWidth;canvas.height=window.innerHeight;
  const colors=["#16a34a","#2563eb","#facc15","#ec4899","#a855f7","#ef4444","#fff"];
  const pieces=Array.from({length:170},()=>({
    x:Math.random()*canvas.width,y:Math.random()*canvas.height-canvas.height,
    w:Math.random()*11+5,h:Math.random()*6+3,
    color:colors[Math.floor(Math.random()*colors.length)],
    rot:Math.random()*360,vx:(Math.random()-0.5)*3,vy:Math.random()*4+2,
    vr:(Math.random()-0.5)*6,alpha:1
  }));
  let frame=0;
  (function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p=>{
      ctx.save();ctx.globalAlpha=p.alpha;
      ctx.translate(p.x+p.w/2,p.y+p.h/2);ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle=p.color;ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
      p.x+=p.vx;p.y+=p.vy;p.rot+=p.vr;if(frame>80)p.alpha-=0.015;
    });
    frame++;
    if(frame<145)requestAnimationFrame(draw);
    else{ctx.clearRect(0,0,canvas.width,canvas.height);canvas.style.display="none";}
  })();
  if(navigator.vibrate)navigator.vibrate([100,50,100,50,200]);
}

function celebrate(){
  if(celebrationDone)return;
  celebrationDone=true;
  launchConfetti();
  drawCoach(calcMood(),true);
  const wrap=document.getElementById("coachSvgWrap");
  wrap.style.animation="none";wrap.offsetHeight;
  wrap.style.animation="coachBounce 0.5s ease 3";
  setTimeout(()=>{drawCoach(calcMood(),false);},2000);
  showToast("Convocação completa! Baixe seu card!");
}

function updateMood(){
  const score=calcMood();
  const state=getMoodState(score);
  document.getElementById("moodBar").style.width=score+"%";
  document.getElementById("moodBar").style.background=state.color;
  document.getElementById("moodText").textContent=state.label;
  document.getElementById("scoreDetail").textContent=Math.round(score)+" / 100";
  drawCoach(score,false);
}

function renderTabs(){
  const tabs=document.getElementById("tabsContainer");
  let html=`<div class="tab ${activeFilter==="ALL"?"active":""}" onclick="setFilter('ALL')">Todos</div>`;
  Object.keys(groups).forEach(k=>{
    html+=`<div class="tab ${activeFilter===k?"active":""}" onclick="setFilter('${k}')">${k}</div>`;
  });
  tabs.innerHTML=html;
}

function setFilter(f){
  activeFilter=f;
  if(f!=="ALL"){clearSearch();}
  renderTabs();renderPlayerList();
}

function handleSearch(val){
  searchQuery=val.trim();
  document.getElementById("searchClear").className="search-clear"+(searchQuery?" visible":"");
  if(searchQuery&&activeFilter!=="ALL"){activeFilter="ALL";renderTabs();}
  renderPlayerList();
}

function clearSearch(){
  searchQuery="";
  document.getElementById("searchInput").value="";
  document.getElementById("searchClear").className="search-clear";
  renderPlayerList();
}

function renderPlayerList(){
  const wrap=document.getElementById("playerListWrap");
  let filtered=activeFilter==="ALL"?players:players.filter(p=>p.pos===activeFilter);
  if(searchQuery){
    const q=normalize(searchQuery);
    filtered=filtered.filter(p=>normalize(p.name).includes(q));
  }
  if(!filtered.length){
    wrap.innerHTML=`<div class="no-results">Nenhum jogador encontrado</div>`;return;
  }
  wrap.innerHTML=filtered.map(p=>{
    const inSquad=squad.find(s=>s.id===p.id);
    const avatarHtml = p.photo ? `<div class="p-avatar" style="background:${p.color}18;color:${p.color}"><img src="${p.photo}" alt="${p.name}"/></div>` : `<div class="p-avatar" style="background:${p.color}18;color:${p.color}">${getInitials(p.name)}</div>`;
    return `<div class="p-card ${inSquad?"in-squad":""}" onclick="togglePlayer(${p.id})">
      ${avatarHtml}
      <div class="p-info">
        <div class="p-name">${highlight(p.name)}</div>
        <div class="p-pos">${posLabels[p.pos]}</div>
      </div>
    </div>`;
  }).join("");
}

function highlight(name){
  if(!searchQuery)return name;
  const q=normalize(searchQuery);
  const norm=normalize(name);
  const idx=norm.indexOf(q);
  if(idx<0)return name;
  return name.slice(0,idx)+'<mark style="background:#fef08a;color:#713f12;border-radius:3px;padding:0 1px">'+name.slice(idx,idx+searchQuery.length)+'</mark>'+name.slice(idx+searchQuery.length);
}

function renderSquad(){
  const container=document.getElementById("squadGroups");
  let html="",num=1;
  Object.entries(groups).forEach(([posKey,grp])=>{
    const inGroup=squad.filter(p=>p.pos===posKey);
    html+=`<div class="group-title">${grp.label}</div><div class="squad-row">`;
    for(let i=0;i<grp.slots;i++){
      const p=inGroup[i];
      if(p){
         const slotAvatar = p.photo ? `<div class="slot-avatar"><img src="${p.photo}" alt="${p.name}"/></div>` : `<div class="slot-avatar" style="background:${p.color}15;color:${p.color}">${getInitials(p.name)}</div>`;
         html+=`<div class="squad-slot filled" title="Remover ${p.name}" onclick="removePlayer(${p.id})">
           <div class="slot-num">${num}</div>
           ${slotAvatar}
           <div class="slot-info"><div class="slot-name">${p.name}</div><div class="slot-pos">${p.pos}</div></div>
         </div>`;
       }else{
         html+=`<div class="squad-slot"><div class="slot-num">${num}</div><div class="empty-slot-text">—</div></div>`;
       }
      num++;
    }
    html+="</div>";
  });
  container.innerHTML=html;

  const total=squad.length;
  const badge=document.getElementById("counterBadge");
  badge.textContent=total+" / 26";
  badge.className="counter-badge"+(total===26?" complete":"");
  const shareBtn=document.getElementById("shareBtn");
  const resultText=document.getElementById("resultText");
  shareBtn.disabled=total<26;
  if(total<26){
    resultText.textContent=`Faltam ${26-total} jogador${26-total===1?"":"es"}`;
  }else{
    const score=calcMood();
    const state=getMoodState(score);
    resultText.textContent=`${state.label}`;
  }
}

function togglePlayer(id){
  const p=players.find(x=>x.id===id);if(!p)return;
  if(squad.find(s=>s.id===id)){removePlayer(id);return;}
  if(squad.filter(s=>s.pos===p.pos).length>=groups[p.pos].slots){showToast("Vagas de "+posLabels[p.pos]+" esgotadas!");return;}
  if(squad.length>=26){showToast("Convocação já tem 26 jogadores!");return;}
  squad.push(p);
  if(squad.length===26)setTimeout(celebrate,300);
  updateAll();
}

function removePlayer(id){
  squad=squad.filter(s=>s.id!==id);
  celebrationDone=false;
  updateAll();
}

function updateAll(){updateMood();renderPlayerList();renderSquad();}

function buildShareCard(){
  const score=Math.round(calcMood());
  const state=getMoodState(score);
  document.getElementById("scMood").innerHTML=`<div class="sc-mood-pct" style="color:${state.color}">${state.label}</div>`;
  let html="";
  Object.entries(groups).forEach(([posKey,grp])=>{
    const inGroup=squad.filter(p=>p.pos===posKey);
    if(!inGroup.length)return;
    html+=`<div><div class="sc-group-title">${grp.label}</div><div class="sc-row">`;
    inGroup.forEach(p=>{
      html+=`<div class="sc-player">${p.name}</div>`;
    });
    html+="</div></div>";
  });
  document.getElementById("scGroups").innerHTML=html;
}

async function handleShare(){
  showToast("Gerando imagem…");
  buildShareCard();
  const card=document.getElementById("shareCard");
  card.style.top="0";card.style.left="-9999px";
  await new Promise(r=>setTimeout(r,120));
  try{
    const canvas=await html2canvas(card,{backgroundColor:"#052e16",scale:2,useCORS:true,logging:false});
    const link=document.createElement("a");
    link.href=canvas.toDataURL("image/png");
    link.download="minha-convocacao-copa.png";
    link.click();
    showToast("Card salvo! Compartilhe nas redes");
  }catch(e){
    console.error(e);showToast("Erro ao gerar imagem.");
  }finally{
    card.style.top="-9999px";
  }
}

function showToast(msg){
  const t=document.getElementById("toast");
  t.textContent=msg;t.classList.add("show");
  clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove("show"),3000);
}

// Inicialização
renderTabs();renderPlayerList();renderSquad();updateMood();

const telaInicial = document.getElementById("tela-inicial");
const telaJogo = document.getElementById("tela-jogo");
const player = document.getElementById("player");
const alvo = document.getElementById("alvo");
const dica = document.getElementById("dica");
const area = document.getElementById("jogo-area");
const nivelSpan = document.getElementById("nivel-valor");
const cronometroDiv = document.getElementById("cronometro");
const tempoSpan = document.getElementById("tempo");
const faseBanner = document.getElementById("fase-banner");

let px = 50, py = 50;
let ax, ay;
let passo = 10;
let areaWidth = 600;
let areaHeight = 400;
let nivel = 1;
let distanciaMinima = 20;
let tempoRestante = 0;
let cronometro;
let jogoconcluido = false; 

window.onload = () => {
  telaInicial.style.display = "flex";
};

function mostrarFaseAtual() {
  faseBanner.textContent = "Fase " + nivel;
  faseBanner.style.display = "block";
  faseBanner.style.opacity = 1;

  setTimeout(() => {
    faseBanner.style.opacity = 0;
    setTimeout(() => {
      faseBanner.style.display = "none";
    }, 500);
  }, 1500);
}

function iniciarJogo() {
  jogoconcluido = false; 

  telaInicial.style.display = "none";
  telaJogo.style.display = "flex";

  document.body.style.backgroundImage = 'url("https://www.shutterstock.com/image-vector/meadow-landscape-pixel-art-element-260nw-2432633657.jpg")';
  document.body.style.backgroundSize = "cover";

  areaWidth = 600 + (nivel - 1) * 50;
  areaHeight = 400 + (nivel - 1) * 30;
  area.style.width = areaWidth + "px";
  area.style.height = areaHeight + "px";

  distanciaMinima = 20 - Math.min(nivel * 2, 15);

  px = 50;
  py = 50;
  player.style.left = px + "px";
  player.style.top = py + "px";

  ax = Math.floor(Math.random() * (areaWidth - 30));
  ay = Math.floor(Math.random() * (areaHeight - 30));
  alvo.style.left = ax + "px";
  alvo.style.top = ay + "px";
  alvo.style.display = "none";

  nivelSpan.textContent = nivel;

  mostrarFaseAtual();

  if (nivel === 3 || nivel === 5 || nivel >= 7) {
    tempoRestante = 40 - nivel;
    if (tempoRestante < 5) tempoRestante = 5;
    tempoSpan.textContent = tempoRestante;
    cronometroDiv.style.display = "inline";
    iniciarCronometro();
  } else {
    pararCronometro();
    cronometroDiv.style.display = "none";
  }

  atualizarDica();
}

function iniciarCronometro() {
  clearInterval(cronometro);
  cronometro = setInterval(() => {
    tempoRestante--;
    tempoSpan.textContent = tempoRestante;
    if (tempoRestante <= 0) {
      clearInterval(cronometro);
      mostrartelafinal(false); 
      iniciarJogo();
    }
  }, 1000);
}

function pararCronometro() {
  clearInterval(cronometro);
}

function atualizarDica() {
  let dist = Math.hypot(ax - px, ay - py);
  if (dist < 30) {
    dica.textContent = "🔥 Quente! Você está muito perto!";
  } else if (dist < 80) {
    dica.textContent = "🌡️ Morno... chegando!";
  } else {
    dica.textContent = "❄️ Frio... está longe!";
  }
}

function moverPlayer(dx, dy) {
  px = Math.max(0, Math.min(areaWidth - 30, px + dx));
  py = Math.max(0, Math.min(areaHeight - 30, py + dy));

  player.style.left = px + "px";
  player.style.top = py + "px";

  atualizarDica();
  checarVitoria();
}

function checarVitoria() {
  if(jogoconcluido) return; 
  if (Math.abs(px - ax) < distanciaMinima && Math.abs(py - ay) < distanciaMinima) {
    jogoconcluido = true; 
    dica.textContent = "🎉 Você encontrou o alvo!";
    alvo.style.display = "block";
    pararCronometro();

    setTimeout(() => {
      if(nivel >= 5){
        mostrartelafinal(true); 
      } else{
        nivel++;
        iniciarJogo()
      }
    }, 1000);
  }
}

function mostrartelafinal(venceu){
  const tela = document.getElementById("tela-final");
  const mensagem = document.getElementById("mensagem-final");

  if(venceu){
    mensagem.textContent = "Parabéns, você venceu o jogo!";
    mensagem.style.color = "red";
  } else {
    mensagem.textContent = "Você perdeu... mas pode tentar de novo!";
    mensagem.style.color = "red";
  }
   
  tela.style.display = "flex";
  telaJogo.style.display = "none";
  pararCronometro()
}

function reiniciarJogo(){
  nivel = 1;
  iniciarJogo();
  document.getElementById("tela-final").style.display = "none";
}

document.addEventListener("keydown", (e) => {
  if (telaJogo.style.display === "flex") {
    if (e.key === "ArrowUp") moverPlayer(0, -passo);
    if (e.key === "ArrowDown") moverPlayer(0, passo);
    if (e.key === "ArrowLeft") moverPlayer(-passo, 0);
    if (e.key === "ArrowRight") moverPlayer(passo, 0);
  }
});

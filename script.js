let rodadasTotais = 0;
let rodadaAtual = 0;
let tempoTotal = 0;
let botaoAtivo = null;
let startTime = 0;
let config = { size: 80, minDelay: 500, maxDelay: 3500 }; 
let velocidadeX = 0;
let velocidadeY = 0;
let animationId = null;

let melhorTempoTotal = localStorage.getItem('melhorTempoTotal');
melhorTempoTotal = melhorTempoTotal ? parseInt(melhorTempoTotal) : Infinity;

document.getElementById("maior-tempo").textContent = 
  melhorTempoTotal === Infinity 
    ? "Melhor tempo: ainda não jogado" 
    : `Melhor tempo: ${melhorTempoTotal} ms`;


document.getElementById("btn-placar").addEventListener("click", function() {
  const placar = document.getElementById("placar");
  placar.style.display = placar.style.display === "none" ? "block" : "none";
});


function iniciarJogo() {
  const select = document.getElementById("dificuldade");
  const valor = parseInt(select.value); 

  if (valor === 3) {
    config = { size: 80, minDelay: 500, maxDelay: 3500 }; 
    iconesDoModo = ["imagens/icon.png"]; 
  } else if (valor === 5) {
    config = { size: 70, minDelay: 100, maxDelay: 1500 };
    iconesDoModo = ["imagens/icon.png", "imagens/icon2.png"]; 
  } else if (valor === 10) {
    config = { size: 69, minDelay: 50, maxDelay: 500 }; 
    iconesDoModo = ["imagens/icon.png", "imagens/icon2.png", "imagens/icon3.png", "imagens/icon4.png"]; 
  }

  rodadasTotais = valor;
  rodadaAtual = 0;
  tempoTotal = 0;

  document.getElementById("tela-inicial").style.display = "none";
  document.getElementById("tela-fim").style.display = "none";
  const container = document.getElementById("jogo-container");
  container.style.display = "block";
  container.innerHTML = "";
  container.addEventListener("click", handleClickFora);
  proximaRodada();
}

function proximaRodada() {
  if (rodadaAtual >= rodadasTotais) {
    finalizarJogo();
    return;
  }

  const container = document.getElementById("jogo-container");
  container.innerHTML = "";

  const delay = Math.floor(Math.random() * (config.maxDelay - config.minDelay)) + config.minDelay;
  setTimeout(() => {
    criarBotaoAleatorio();
  }, delay);
}

function criarBotaoAleatorio() {
  const container = document.getElementById("jogo-container");
  const botao = document.createElement("img");
  botao.id = "botao-reflexo";
  const indiceAleatorio = Math.floor(Math.random() * iconesDoModo.length);
  botao.src = iconesDoModo[indiceAleatorio];
  
  botao.alt = "Alvo";

  botao.style.width = config.size + "px";
  botao.style.height = "auto";
  botao.style.position = "absolute";
  botao.style.cursor = "pointer";
  botao.style.userSelect = "none";    
  botao.style.draggable = false;      
  botao.style.pointerEvents = "auto";

  const maxX = window.innerWidth - config.size;
  const maxY = window.innerHeight - config.size;
  let x = Math.floor(Math.random() * maxX);
  let y = Math.floor(Math.random() * maxY);

  botao.style.left = x + "px";
  botao.style.top = y + "px";

  const velocidadeBase = config.size <= 40 ? 4 : config.size <= 69 ? 3 : 2;
  velocidadeX = (Math.random() > 0.5 ? 1 : -1) * velocidadeBase;
  velocidadeY = (Math.random() > 0.5 ? 1 : -1) * velocidadeBase;

  botaoAtivo = { elemento: botao, x, y }; 
  botao.addEventListener("click", handleClickBotao);

  container.appendChild(botao);
  startTime = Date.now();

  if (animationId) cancelAnimationFrame(animationId);
  animarAlvo();
}

function animarAlvo() {
  if (!botaoAtivo) return;

  const { elemento, x, y } = botaoAtivo;
  const tamanho = config.size;

  let novoX = x + velocidadeX;
  let novoY = y + velocidadeY;

  if (novoX <= 0 || novoX >= window.innerWidth - tamanho) {
    velocidadeX = -velocidadeX;
    novoX = Math.max(0, Math.min(novoX, window.innerWidth - tamanho));
  }

  if (novoY <= 0 || novoY >= window.innerHeight - tamanho) {
    velocidadeY = -velocidadeY;
    novoY = Math.max(0, Math.min(novoY, window.innerHeight - tamanho));
  }

  elemento.style.left = novoX + "px";
  elemento.style.top = novoY + "px";

  botaoAtivo.x = novoX;
  botaoAtivo.y = novoY;

  animationId = requestAnimationFrame(animarAlvo);
}

function handleClickBotao(e) {
  e.stopPropagation();

  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  const tempoReacao = Date.now() - startTime;
  tempoTotal += tempoReacao;
  rodadaAtual++;

  if (botaoAtivo?.elemento?.parentNode) {
    botaoAtivo.elemento.parentNode.removeChild(botaoAtivo.elemento);
  }
  botaoAtivo = null;

  setTimeout(proximaRodada, 500);
}

function handleClickFora() {
  if (botaoAtivo) {
    finalizarJogo(true);
  }
}

function finalizarJogo(erro = false) {
  const container = document.getElementById("jogo-container");
  container.removeEventListener("click", handleClickFora);
  container.style.display = "none";

  const msg = document.getElementById("mensagem-fim");
  if (erro) {
    msg.textContent = "Clicou fora! Jogo encerrado.";
  } else {
    msg.textContent = `Completou ${rodadasTotais} rodadas.\nTempo total de resposta: ${tempoTotal} ms.`;

  
    if (tempoTotal < melhorTempoTotal) {
      melhorTempoTotal = tempoTotal;
      localStorage.setItem('melhorTempoTotal', tempoTotal);
    }

    document.getElementById("maior-tempo").textContent = `Melhor tempo: ${melhorTempoTotal} ms`;
  }

  document.getElementById("tela-fim").style.display = "block";
}


function cadastrarUsuario() {
  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;
  const mensagem = document.getElementById("mensagemCadastro");

  mensagem.textContent = "";
  mensagem.className = "";

  if (!nome) {
    mensagem.textContent = "O nome é obrigatório.";
    mensagem.className = "mensagem-erro";
    return false;
  }

  if (!email) {
    mensagem.textContent = "O e-mail é obrigatório.";
    mensagem.className = "mensagem-erro";
    return false;
  }

  if (senha.length < 6) {
    mensagem.textContent = "A senha deve ter pelo menos 6 caracteres.";
    mensagem.className = "mensagem-erro";
    return false;
  }

  if (senha !== confirmarSenha) {
    mensagem.textContent = "As senhas não coincidem.";
    mensagem.className = "mensagem-erro";
    return false;
  }

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

  if (usuarios[email]) {
    mensagem.textContent = "Este e-mail já está cadastrado.";
    mensagem.className = "mensagem-erro";
    return false;
  }

  usuarios[email] = {
    nome: nome,
    senha: senha
  };

  localStorage.setItem('usuarios', JSON.stringify(usuarios));

  mensagem.textContent = "Cadastro realizado com sucesso!";
  mensagem.className = "mensagem-sucesso";

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);

  return false;
}

function fazerLogin() {
  const email = document.getElementById('email').value.trim().toLowerCase();
  const senha = document.getElementById('senha').value;
  const msg = document.getElementById('mensagem');

  msg.textContent = "";
  msg.style.color = "";

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

  if (usuarios[email] && usuarios[email].senha === senha) {
    const nomeUsuario = usuarios[email].nome || email.split('@')[0];
    alert(`Bem-vindo, ${nomeUsuario}!`);
    window.location.href = 'jogo.html';
  } else {
    msg.textContent = 'Email ou senha incorretos.';
    msg.style.color = 'red';
  }

  return false;
}

function recuperarSenha() {
  const email = document.getElementById('recuperarEmail').value.trim().toLowerCase();
  const mensagemEl = document.getElementById('mensagemRecuperar');

  mensagemEl.className = '';
  mensagemEl.textContent = '';

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || {};

  if (usuarios[email]) {
    mensagemEl.innerHTML = `
      Sua senha é: <strong>${usuarios[email].senha}</strong>
    `;
    mensagemEl.className = 'mensagem-sucesso';
  } else {
    mensagemEl.textContent = 'E-mail não encontrado.';
    mensagemEl.className = 'mensagem-erro';
  }

  return false;
}

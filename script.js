const personagens = [
    { nome: 'Ryu', imagem: 'imagens/personagem1.png' },
    { nome: 'Ken', imagem: 'imagens/personagem2.png' },
    { nome: 'Gus', imagem: 'imagens/personagem3.png' },
    { nome: 'Red', imagem: 'imagens/personagem4.png' },
  ];
  
  const ataques = [
    { nome: 'Cabeçada', imagem: 'imagens/ataque1.png', dano: 9, cooldown: 3000 },
    { nome: 'Cagada Dimensional', imagem: 'imagens/ataque2.png', dano: 15, cooldown: 1750 },
    { nome: 'Linguada', imagem: 'imagens/ataque3.png', dano: 1, cooldown: 12000 },
    { nome: 'Chute', imagem: 'imagens/ataque4.png', dano: 40, cooldown: 7000 },
    { nome: 'Soco Duplo', imagem: 'imagens/ataque5.png', dano: 50, cooldown: 60000 }
  ];
  
  let modoDeJogo = '';
  let jogador1 = null;
  let jogador2 = null;
  let selecionando = 1;
  let vida1 = 100;
  let vida2 = 100;
  let rounds1 = 0;
  let rounds2 = 0;
  let numeroRound = 1;
  let defendendo1 = false;
  let defendendo2 = false;
  let cooldownsP1 = Array(5).fill(0);
  let cooldownsP2 = Array(5).fill(0);
  
  let posX1 = 100;
  let posX2 = 300;
  
  function escolherModo(modo) {
    modoDeJogo = modo;
    document.getElementById('menu').classList.add('oculto');
    document.getElementById('selecao').classList.remove('oculto');
    carregarPersonagens();
  }
  
  function carregarPersonagens() {
    const lista = document.getElementById('listaPersonagens');
    lista.innerHTML = '';
  
    personagens.forEach((p, index) => {
      const div = document.createElement('div');
      div.classList.add('personagem');
      div.innerHTML = `<img src="${p.imagem}" alt="${p.nome}"><p>${p.nome}</p>`;
      div.onclick = () => selecionarPersonagem(index, div);
      lista.appendChild(div);
    });
  }
  
  function selecionarPersonagem(index, divClicado) {
    document.querySelectorAll('.personagem').forEach(div => {
      div.classList.remove('selecionado');
    });
    divClicado.classList.add('selecionado');
  
    if (selecionando === 1) {
      jogador1 = personagens[index];
    } else {
      jogador2 = personagens[index];
    }
  }
  
  document.getElementById('confirmarSelecao').onclick = () => {
    if (!jogador1) {
      alert('Selecione um personagem!');
      return;
    }
  
    if (modoDeJogo === 'pvp' && selecionando === 1) {
      selecionando = 2;
      alert('Agora o Jogador 2 escolhe o personagem.');
      jogador2 = null;
      carregarPersonagens();
      return;
    }
  
    if (modoDeJogo === 'cpu') {
      jogador2 = personagens[Math.floor(Math.random() * personagens.length)];
    }
  
    iniciarJogo();
  };
  
  function iniciarJogo() {
    document.getElementById('selecao').classList.add('oculto');
    document.getElementById('jogo').classList.remove('oculto');
  
    document.getElementById('lutador1').src = jogador1.imagem;
    document.getElementById('lutador2').src = jogador2.imagem;
  
    document.getElementById('mensagem').innerText = `Jogador 1 escolheu ${jogador1.nome}.\nJogador 2 escolheu ${jogador2.nome}.`;
  
    iniciarControles();
    mostrarAtaquesDuranteOJogo();
    atualizarPosicoes();
  }
  
  function mostrarAtaquesDuranteOJogo() {
    const container1 = document.createElement('div');
    const container2 = document.createElement('div');
    container1.classList.add('ataques-em-jogo');
    container2.classList.add('ataques-em-jogo');
  
    ataques.forEach(ataque => {
      const atk1 = document.createElement('div');
      atk1.innerHTML = `<img src="${ataque.imagem}" class="ataque-img"><p>${ataque.nome}</p>`;
      container1.appendChild(atk1);
  
      const atk2 = document.createElement('div');
      atk2.innerHTML = `<img src="${ataque.imagem}" class="ataque-img"><p>${ataque.nome}</p>`;
      container2.appendChild(atk2);
    });
  
    document.getElementById('jogo').appendChild(container1);
    document.getElementById('jogo').appendChild(container2);
  }
  
  function iniciarControles() {
    document.getElementById('mensagem').innerText = '';
  
    document.addEventListener('keydown', (e) => {
      const agora = Date.now();
  
      // ATAQUES JOGADOR 1
      const teclasP1 = { z: 0, x: 1, c: 2, v: 3, b: 4 };
      if (e.key in teclasP1) {
        const i = teclasP1[e.key];
        if (agora > cooldownsP1[i]) {
          atacar('p1', i);
          cooldownsP1[i] = agora + ataques[i].cooldown;
        }
      }
  
      // ATAQUES JOGADOR 2
      const teclasP2 = { '1': 0, '2': 1, '3': 2, '4': 3, '5': 4 };
      if (e.key in teclasP2) {
        const i = teclasP2[e.key];
        if (agora > cooldownsP2[i]) {
          atacar('p2', i);
          cooldownsP2[i] = agora + ataques[i].cooldown;
        }
      }
  
      // MOVIMENTAÇÃO
      switch (e.key) {
        case 'a':
          posX1 -= 10;
          break;
        case 'd':
          posX1 += 10;
          break;
        case 'ArrowLeft':
          posX2 -= 10;
          break;
        case 'ArrowRight':
          posX2 += 10;
          break;
      }
  
      atualizarPosicoes();
    });
  }
  
  function atacar(jogador, ataqueIndex) {
    const { dano } = ataques[ataqueIndex];
    if (jogador === 'p1') {
      vida2 -= defendendo2 ? dano / 3 : dano;
    } else {
      vida1 -= defendendo1 ? dano / 3 : dano;
    }
    atualizarVida();
    verificarRound();
  }
  
  function atualizarVida() {
    vida1 = Math.max(vida1, 0);
    vida2 = Math.max(vida2, 0);
    document.getElementById('vida1').style.width = vida1 + '%';
    document.getElementById('vida2').style.width = vida2 + '%';
  }
  
  function verificarRound() {
    if (vida1 <= 0) {
      rounds2++;
      proximoRound();
    } else if (vida2 <= 0) {
      rounds1++;
      proximoRound();
    }
  }
  
  function proximoRound() {
    if (rounds1 >= 2 || rounds2 >= 2) {
      document.getElementById('mensagem').innerText = rounds1 > rounds2
        ? 'Jogador 1 venceu a luta!'
        : 'Jogador 2 venceu a luta!';
      return;
    }
  
    numeroRound++;
    atualizarRound();
    vida1 = 100;
    vida2 = 100;
    atualizarVida();
  }
  
  function atualizarRound() {
    document.getElementById('numeroRound').innerText = numeroRound;
  }
  
  function atualizarPosicoes() {
    document.getElementById('lutador1').style.left = posX1 + 'px';
    document.getElementById('lutador2').style.left = posX2 + 'px';
  }
  
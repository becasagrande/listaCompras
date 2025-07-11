// Seleção de elementos do DOM
const form = document.getElementById('form-item');
const inputItem = document.getElementById('input-item');
const inputQty = document.getElementById('input-qty');
const listaItens = document.getElementById('lista-itens');
const btnClear = document.getElementById('btn-clear');
const contador = document.getElementById('contador');
const contadorCliques = document.getElementById('contador-cliques');
const botaoTema = document.getElementById('botao-tema');
const corpo = document.body;

// Chave do localStorage para persistência
const STORAGE_KEY = 'listaComprasAzul';

// Array em memória para armazenar os itens
let itens = [];

/**
 * Carrega itens do localStorage.
 */
function loadItens() {
  const raw = localStorage.getItem(STORAGE_KEY);
  itens = raw ? JSON.parse(raw) : [];
}

/**
 * Salva o array 'itens' no localStorage.
 */
function saveItens() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
}

/**
 * Atualiza o contador de itens.
 */
function updateContador() {
  const total = itens.reduce((sum, item) => sum + item.qtd, 0);
  contador.textContent = `Total itens: ${total}`;
}

/**
 * Renderiza a lista no DOM.
 */
function renderList() {
  listaItens.innerHTML = '';
  itens.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${item.nome} — Qtd: ${item.qtd}`;

    const btnDel = document.createElement('button');
    btnDel.className = 'btn btn-sm btn-outline-danger ms-2';
    btnDel.textContent = '❌';

    btnDel.addEventListener('click', () => {
      itens.splice(idx, 1);
      saveItens();
      renderList();
      updateContador();
    });

    li.appendChild(btnDel);
    listaItens.appendChild(li);
  });
}

/**
 * Evento de envio do formulário.
 */
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const nome = inputItem.value.trim();
  const qtd = parseInt(inputQty.value, 10);

  if (!nome || qtd < 1) {
    alert('Informe nome e quantidade válidos.');
    return;
  }

  const exists = itens.find(i => i.nome.toLowerCase() === nome.toLowerCase());
  if (exists) {
    exists.qtd += qtd;
  } else {
    itens.push({ nome, qtd });
  }

  saveItens();
  renderList();
  updateContador();

  inputItem.value = '';
  inputQty.value = '1';
  inputItem.focus();
});

/**
 * Evento do botão "Limpar Tudo".
 */
btnClear.addEventListener('click', () => {
  if (confirm('Deseja realmente limpar toda a lista?')) {
    itens = [];
    saveItens();
    renderList();
    updateContador();
  }
});

/**
 * Evento ao carregar a página.
 */
document.addEventListener('DOMContentLoaded', () => {
  loadItens();
  renderList();
  updateContador();
  atualizarCliques();
  atualizarTema();
});

/**
 * Contador de cliques em botões.
 */
let cliquesTotais = 0;

function atualizarCliques() {
  contadorCliques.textContent = `Cliques em botões: ${cliquesTotais}`;
}

document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    cliquesTotais++;
    atualizarCliques();
  }
});

/**
 * Alternância entre modo claro e escuro.
 */
function atualizarTema() {
  const temaSalvo = localStorage.getItem('modoTema');
  if (temaSalvo === 'escuro') {
    corpo.classList.add('modo-escuro');
    botaoTema.textContent = '☀️ Modo Claro';
  } else {
    corpo.classList.remove('modo-escuro');
    botaoTema.textContent = '🌙 Modo Escuro';
  }
}

botaoTema.addEventListener('click', () => {
  corpo.classList.toggle('modo-escuro');
  const temaAtual = corpo.classList.contains('modo-escuro') ? 'escuro' : 'claro';
  localStorage.setItem('modoTema', temaAtual);
  atualizarTema();
});

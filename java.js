// Seleção de elementos do DOM
const form = document.getElementById('form-item');       // Form para adicionar itens
const inputItem = document.getElementById('input-item'); // Input do nome do item
const inputQty = document.getElementById('input-qty');   // Input da quantidade
const listaItens = document.getElementById('lista-itens'); // <ul> da lista
const btnClear = document.getElementById('btn-clear');   // Botão para limpar a lista
const contador = document.getElementById('contador');    // Elemento que mostra total de itens

// Chave do localStorage para persistência
const STORAGE_KEY = 'listaComprasAzul';

// Array em memória para armazenar os itens da lista
let itens = [];

/**
 * Carrega itens do localStorage.
 * Se não houver nada, inicializa array vazio.
 */
function loadItens() {
  const raw = localStorage.getItem(STORAGE_KEY);
  itens = raw ? JSON.parse(raw) : [];
}

/**
 * Salva o array 'itens' no localStorage em formato JSON.
 */
function saveItens() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
}

/**
 * Atualiza o contador de itens na interface (soma das quantidades).
 */
function updateContador() {
  const total = itens.reduce((sum, item) => sum + item.qtd, 0);
  contador.textContent = `Total itens: ${total}`;
}

/**
 * Renderiza a lista completa no DOM:
 * - Limpa <ul>, recria <li> para cada item
 * - Adiciona botão ❌ que remove item ao ser clicado
 */
function renderList() {
  listaItens.innerHTML = ''; // limpa a lista
  itens.forEach((item, idx) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = `${item.nome} — Qtd: ${item.qtd}`;

    const btnDel = document.createElement('button');
    btnDel.className = 'btn btn-sm btn-outline-danger';
    btnDel.textContent = '❌';
    btnDel.addEventListener('click', () => {
      itens.splice(idx, 1); // remove do array
      saveItens();
      renderList();
      updateContador();
    });

    li.appendChild(btnDel);
    listaItens.appendChild(li);
  });
}

/**
 * Evento submit do formulário:
 * - Previne envio padrão
 * - Lê valores, validação básica
 * - Evita duplicatas, incrementa qtd se existir
 * - Atualiza armazenamento, interface e contador
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
 * Evento no botão Limpar Tudo:
 * - Confirmação com o usuário
 * - Esvazia array e localStorage
 * - Atualiza a interface
 */
btnClear.addEventListener('click', () => {
  if (confirm('Deseja realmente limpar toda a lista?')) {
    itens = [];
    saveItens();
    renderList();
    updateContador();
  }
});

// Inicialização após carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
  loadItens();
  renderList();
  updateContador();
});


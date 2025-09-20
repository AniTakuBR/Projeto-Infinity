// === Inicialização do áudio ===
const audioPlayer = document.getElementById('customAudioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const dropdownToggle = document.getElementById('dropdownToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
const volumeSlider = document.getElementById('volumeSlider');

// Lista de faixas disponíveis
const tracks = Array.from(dropdownMenu.querySelectorAll('li')).map(li => ({
  src: li.getAttribute('data-src'),
  name: li.textContent
})).filter(track => track.src !== 'LINK');

// Estado do player
let isPlaying = false;
let currentTrackIndex = 0;

// Carrega a faixa inicial
function loadTrack(index) {
  if (index >= 0 && index < tracks.length) {
    audioPlayer.src = tracks[index].src;
    dropdownToggle.textContent = tracks[index].name;
    currentTrackIndex = index;
  }
}

// Alterna entre play e pause
function togglePlayPause() {
  if (isPlaying) {
    audioPlayer.pause();
    playIcon.textContent = '▶';
    playIcon.classList.add('play');
    isPlaying = false;
  } else {
    audioPlayer.play().catch(err => console.error('Erro ao reproduzir:', err));
    playIcon.textContent = '⏸';
    playIcon.classList.remove('play');
    isPlaying = true;
  }
}

// Inicializa o player com a primeira faixa
loadTrack(currentTrackIndex);

// Evento de clique no botão play/pause
playPauseBtn.addEventListener('click', togglePlayPause);

// Evento para o dropdown de faixas
dropdownToggle.addEventListener('click', () => {
  dropdownMenu.classList.toggle('open');
});

// Seleciona uma faixa no dropdown
dropdownMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI' && e.target.getAttribute('data-src') !== 'LINK') {
    const index = tracks.findIndex(track => track.src === e.target.getAttribute('data-src'));
    loadTrack(index);
    dropdownMenu.classList.remove('open');
    if (isPlaying) {
      audioPlayer.play().catch(err => console.error('Erro ao reproduzir:', err));
      playIcon.textContent = '⏸';
      playIcon.classList.remove('play');
    }
  }
});

// Controle de volume
volumeSlider.addEventListener('input', () => {
  audioPlayer.volume = volumeSlider.value / 100;
});

// Fecha o dropdown ao clicar fora
document.addEventListener('click', (e) => {
  if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
    dropdownMenu.classList.remove('open');
  }
});

// === Botão de copiar PIX ===
const copyPixBtn = document.getElementById('copyPixBtn');
const pixEmail = document.querySelector('.pix-email').textContent;

copyPixBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(pixEmail).then(() => {
    const msg = document.createElement('div');
    msg.className = 'pix-copied-msg';
    msg.textContent = 'Chave PIX copiada!';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
  });
});

// === Funções de busca ===
const searchInput = document.getElementById('search');
const clearSearchBtn = document.getElementById('clearSearch');
const noResults = document.getElementById('noResults');
const suggestionsList = document.createElement('ul');
suggestionsList.className = 'suggestions';
searchInput.parentElement.appendChild(suggestionsList);

// Lista de itens pesquisáveis
const searchItems = [
  ...Array.from(document.querySelectorAll('.game-item')).map(item => ({
    element: item,
    title: item.getAttribute('data-title')
  })),
  ...Array.from(document.querySelectorAll('.texture-item')).map(item => ({
    element: item,
    title: item.getAttribute('data-title')
  }))
];

// Função para normalizar texto
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

// Função para mostrar sugestões
function showSuggestions(query) {
  suggestionsList.innerHTML = '';
  if (query.length === 0) {
    suggestionsList.classList.remove('open');
    return;
  }

  const filteredItems = searchItems.filter(item =>
    normalizeText(item.title).includes(normalizeText(query))
  );

  if (filteredItems.length > 0) {
    filteredItems.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.title;
      li.addEventListener('click', () => {
        searchInput.value = item.title;
        suggestionsList.classList.remove('open');
        performSearch(item.title);
      });
      suggestionsList.appendChild(li);
    });
    suggestionsList.classList.add('open');
  } else {
    suggestionsList.classList.remove('open');
  }
}

// Função para realizar a busca
function performSearch(query) {
  const normalizedQuery = normalizeText(query);
  let hasResults = false;

  // Reseta visibilidade e destaques
  searchItems.forEach(item => {
    item.element.classList.remove('highlight');
    item.element.style.display = 'none';
  });
  noResults.classList.add('hidden');

  // Filtra e exibe itens correspondentes
  searchItems.forEach(item => {
    if (normalizeText(item.title).includes(normalizedQuery)) {
      item.element.style.display = 'flex';
      item.element.classList.add('highlight');
      hasResults = true;

      // Abre a seção correspondente
      const section = item.element.closest('.section');
      if (section) {
        const sectionContent = section.querySelector('.section-content');
        sectionContent.classList.add('open');
        const button = section.querySelector('.toggle-btn');
        if (button) {
          button.textContent = 'FECHAR';
        }
      }
    }
  });

  // Mostra mensagem se não houver resultados
  if (!hasResults && query.length > 0) {
    noResults.classList.remove('hidden');
  }
}

// Evento de input na busca
searchInput.addEventListener('input', () => {
  const query = searchInput.value.trim();
  showSuggestions(query);
  performSearch(query);
});

// Evento para limpar busca
clearSearchBtn.addEventListener('click', () => {
  searchInput.value = '';
  suggestionsList.classList.remove('open');
  searchItems.forEach(item => {
    item.element.style.display = 'flex';
    item.element.classList.remove('highlight');
  });
  noResults.classList.add('hidden');

  // Fecha todas as seções
  document.querySelectorAll('.section-content').forEach(content => {
    content.classList.remove('open');
    const button = content.previousElementSibling.querySelector('.toggle-btn');
    if (button) {
      button.textContent = 'ABRIR';
    }
  });
});

// Fecha sugestões ao clicar fora
document.addEventListener('click', (e) => {
  if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
    suggestionsList.classList.remove('open');
  }
});

// === Função para alternar seções ===
function toggleSection(sectionId, contentId) {
  const button = document.querySelector(`[data-target="${contentId}"]`);
  const content = document.getElementById(contentId);
  content.classList.toggle('open');
  button.textContent = content.classList.contains('open') ? 'FECHAR' : 'ABRIR';
}

// === Função para abrir modal com conteúdo da lista ===
function openModalForList(button, listId) {
  const list = document.getElementById(listId);
  if (!list) return;

  // Clona o conteúdo da lista
  const clone = list.cloneNode(true);
  clone.classList.add('open');

  // Limpa e popula o body do modal
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = '';

  // Adiciona título baseado no texto do botão
  const title = document.createElement('h2');
  title.textContent = button.textContent;
  title.style.color = 'var(--accent)';
  title.style.marginBottom = '20px';
  title.style.textAlign = 'center';
  modalBody.appendChild(title);

  // Adiciona o clone da lista
  modalBody.appendChild(clone);

  // Mostra o overlay/modal
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('open'), 10);

  // Atualiza ARIA
  button.setAttribute('aria-expanded', 'true');
}

// === Função para fechar o modal ===
function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  setTimeout(() => {
    overlay.classList.add('hidden');
    document.getElementById('modalBody').innerHTML = '';
  }, 300);

  // Reseta ARIA para todos os botões da sidebar direita
  document.querySelectorAll('.sidebar.right-sidebar .launch-btn').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
  });
}

// === Inicialização dos eventos de clique ===
document.querySelectorAll('.toggle-btn').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    toggleSection(button.closest('.section').id, targetId);
  });
});

// === Event listeners para botões da sidebar ESQUERDA (expansão local) ===
document.querySelectorAll('.sidebar:not(.right-sidebar) .launch-btn').forEach(button => {
  button.addEventListener('click', () => {
    const list = button.nextElementSibling;
    if (list && (list.classList.contains('members-list') || list.classList.contains('paginas-list'))) {
      list.classList.toggle('open');
      button.classList.toggle('active');
      button.setAttribute('aria-expanded', list.classList.contains('open'));
    }
  });
});

// === Event listeners para botões da sidebar DIREITA (modais) ===
document.querySelectorAll('.sidebar.right-sidebar .launch-btn').forEach(button => {
  button.addEventListener('click', () => {
    const list = button.nextElementSibling;
    if (list && (list.classList.contains('members-list') || list.classList.contains('paginas-list'))) {
      openModalForList(button, list.id);
    }
  });
});

// === Event listeners para botões dos cards ===
document.querySelectorAll('.game-item .launch-btn').forEach(button => {
  button.addEventListener('click', () => {
    const gameCard = button.previousElementSibling;
    if (gameCard && gameCard.tagName === 'A') {
      window.open(gameCard.href, '_blank', 'noopener,noreferrer');
    }
  });
});

// === Event listeners para fechar o modal ===
document.getElementById('closeModal').addEventListener('click', closeModal);

document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target.id === 'modalOverlay') {
    closeModal();
  }
});

// Fecha com ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !document.getElementById('modalOverlay').classList.contains('hidden')) {
    closeModal();
  }
});

// === Inicialização de seções e listas ===
document.addEventListener('DOMContentLoaded', () => {
  // Inicialização de seções principais fechadas
  document.querySelectorAll('.section-content').forEach(content => {
    content.classList.remove('open');
    const button = content.previousElementSibling.querySelector('.toggle-btn');
    if (button) {
      button.textContent = 'ABRIR';
    }
  });

  // Inicialização de listas da sidebar esquerda
  document.querySelectorAll('.sidebar:not(.right-sidebar) .members-list, .sidebar:not(.right-sidebar) .paginas-list').forEach(list => {
    list.classList.remove('open');
    const button = list.previousElementSibling;
    if (button) {
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  // Inicialização de listas da sidebar direita
  document.querySelectorAll('.sidebar.right-sidebar .members-list, .sidebar.right-sidebar .paginas-list').forEach(list => {
    list.classList.remove('open');
    const button = list.previousElementSibling;
    if (button) {
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  // === Menu Mobile Hamburger ===
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMenuBtn = document.querySelector('.close-menu-btn');

  if (hamburgerBtn && mobileMenu && closeMenuBtn) {
    hamburgerBtn.addEventListener('click', () => {
      mobileMenu.classList.add('open');
    });

    closeMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
    });

    // Fecha ao clicar fora do menu (em mobile)
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('open') && !mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }
});
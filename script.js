// === Inicialização do áudio ===
const audioPlayer = document.getElementById('customAudioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const dropdownToggle = document.getElementById('dropdownToggle');
const volumeBar = document.querySelector('.volume-bar');
const volumeFill = document.querySelector('.volume-fill');
const progressBar = document.querySelector('.progress-bar');
const progressFill = document.querySelector('.progress-fill');
const prevTrackBtn = document.getElementById('prevTrackBtn');
const nextTrackBtn = document.getElementById('nextTrackBtn');

// Lista de faixas disponíveis
const tracks = [
  { src: "https://archive.org/download/tvtunes_29392/Yu-Gi-Oh%21GX%20-%20Japanese%20Opening%201.mp3", name: "Música 001", desc: "Yu-Gi-Oh!GX Japanese." },
  { src: "https://archive.org/download/tvtunes_12935/Yu-Gi-Oh%20GX%20-%20Japanese%20-%20Opening%204%20-%20Precious%20Time%20Glory%20Days.mp3", name: "Música 002", desc: "Precious Time Glory Days." },
  { src: "https://ia601001.us.archive.org/32/items/bgm-duel-normal-05/BGM%20Duel%20Normal%2005.mp3", name: "Música 003", desc: "Trilha de duelo normal 05." },
  { src: "https://archive.org/download/03.-shuffle/01.%20voice.mp3", name: "Música 004", desc: "Voice do shuffle." },
  { src: "https://archive.org/download/03.-shuffle/02.%20Energy%20Shower.mp3", name: "Música 005", desc: "Energy Shower do shuffle." },
  { src: "https://archive.org/download/yu-yu-hakusho-collection/DISC%201/01.%20%E5%BE%AE%E7%AC%91%E3%81%BF%E3%81%AE%E7%88%86%E5%BC%BE.mp3", name: "Música 006", desc: "Bomba de Sorriso." },
  { src: "https://archive.org/download/angel-beats-oped-album/1.%20My%20Soul%2C%20Your%20Beats%21.mp3", name: "Música 007", desc: "My Soul, Your Beats!" },
  { src: "https://archive.org/download/angel-beats-oped-album/2.%20Brave%20Song.mp3", name: "Música 008", desc: "Brave Song." },
  { src: "https://archive.org/download/sincerely-album/01.%20Sincerely.mp3", name: "Música 009", desc: "Sincerely." },
];

// Estado do player
let isPlaying = false;
let currentTrackIndex = 0;

// Carrega a faixa inicial
function loadTrack(index) {
  if (index >= 0 && index < tracks.length) {
    audioPlayer.src = tracks[index].src;
    dropdownToggle.textContent = tracks[index].name;
    currentTrackIndex = index;
    audioPlayer.currentTime = 0; // Reseta o progresso
    updateProgress(); // Atualiza a barra de progresso
    if (isPlaying) {
      audioPlayer.play().catch(err => console.error('Erro ao reproduzir:', err));
    }
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

// Avança para a próxima faixa
function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  loadTrack(currentTrackIndex);
}

// Retrocede para a faixa anterior
function prevTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  loadTrack(currentTrackIndex);
}

// Atualiza a barra de progresso
function updateProgress() {
  if (audioPlayer.duration) {
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFill.style.width = `${progressPercent}%`;
  }
}

// Atualiza a barra de volume
function updateVolume() {
  const volumePercent = audioPlayer.volume * 100;
  volumeFill.style.width = `${volumePercent}%`;
}

// Inicializa o player com a primeira faixa
loadTrack(currentTrackIndex);
audioPlayer.volume = 0.5; // Volume inicial em 50%
updateVolume(); // Inicializa a barra de volume

// Evento de clique no botão play/pause
playPauseBtn.addEventListener('click', togglePlayPause);

// Eventos para os botões de retroceder e avançar
prevTrackBtn.addEventListener('click', prevTrack);
nextTrackBtn.addEventListener('click', nextTrack);

// Atualiza a barra de progresso em tempo real
audioPlayer.addEventListener('timeupdate', updateProgress);

// Controle de volume com a barra personalizada
volumeBar.addEventListener('click', (e) => {
  const rect = volumeBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const volumePercent = Math.min(Math.max(clickX / rect.width, 0), 1);
  audioPlayer.volume = volumePercent;
  updateVolume();
});

// Controle de progresso com a barra personalizada
progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const progressPercent = Math.min(Math.max(clickX / rect.width, 0), 1);
  audioPlayer.currentTime = progressPercent * audioPlayer.duration;
  updateProgress();
});

// === Abre modal com lista de músicas ===
dropdownToggle.addEventListener('click', () => {
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = '';

  // Cria header fixo com título e busca
  const header = document.createElement('div');
  header.className = 'modal-header';

  const title = document.createElement('h2');
  title.textContent = 'Lista de Músicas';
  header.appendChild(title);

  // Adiciona barra de pesquisa
  const searchWrap = document.createElement('div');
  searchWrap.className = 'modal-search-wrap';
  const searchInputModal = document.createElement('input');
  searchInputModal.type = 'text';
  searchInputModal.placeholder = 'Pesquisar músicas...';
  searchInputModal.id = 'modalSearchMusic';
  searchWrap.appendChild(searchInputModal);

  const clearBtn = document.createElement('button');
  clearBtn.textContent = '✖';
  clearBtn.title = 'Limpar busca';
  searchWrap.appendChild(clearBtn);
  header.appendChild(searchWrap);

  modalBody.appendChild(header);

  // Adiciona lista de cards
  const musicList = document.createElement('div');
  musicList.className = 'music-list';
  tracks.forEach((track, index) => {
    const card = document.createElement('div');
    card.className = 'music-card';
    card.dataset.title = track.name; // Para filtro

    const info = document.createElement('div');
    info.className = 'music-info';
    const h3 = document.createElement('h3');
    h3.textContent = track.name;
    const p = document.createElement('p');
    p.textContent = track.desc;
    info.appendChild(h3);
    info.appendChild(p);

    const btn = document.createElement('button');
    btn.className = 'play-btn';
    btn.textContent = 'Ouvir';
    btn.addEventListener('click', () => {
      loadTrack(index);
      if (!isPlaying) togglePlayPause();
      closeModal();
    });

    card.appendChild(info);
    card.appendChild(btn);
    musicList.appendChild(card);
  });

  // Adiciona a faixa "Em Breve" como desabilitada
  const emBreveCard = document.createElement('div');
  emBreveCard.className = 'music-card disabled';
  emBreveCard.dataset.title = 'Em Breve';
  const emBreveInfo = document.createElement('div');
  emBreveInfo.className = 'music-info';
  const emBreveH3 = document.createElement('h3');
  emBreveH3.textContent = 'Em Breve';
  const emBreveP = document.createElement('p');
  emBreveP.textContent = 'Mais músicas em breve.';
  emBreveInfo.appendChild(emBreveH3);
  emBreveInfo.appendChild(emBreveP);

  const emBreveBtn = document.createElement('button');
  emBreveBtn.className = 'play-btn';
  emBreveBtn.textContent = 'Ouvir';
  emBreveBtn.disabled = true;

  emBreveCard.appendChild(emBreveInfo);
  emBreveCard.appendChild(emBreveBtn);
  musicList.appendChild(emBreveCard);

  modalBody.appendChild(musicList);

  // Mostra o modal
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('open'), 10);

  // Evento para filtro na busca do modal de músicas
  searchInputModal.addEventListener('input', () => {
    const query = normalizeText(searchInputModal.value.trim());
    const items = musicList.querySelectorAll('.music-card');
    items.forEach(item => {
      const title = normalizeText(item.dataset.title);
      item.style.display = title.includes(query) ? 'flex' : 'none';
    });
  });

  // Limpar busca
  clearBtn.addEventListener('click', () => {
    searchInputModal.value = '';
    const items = musicList.querySelectorAll('.music-card');
    items.forEach(item => item.style.display = 'flex');
  });
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
  })),
  ...Array.from(document.querySelectorAll('.project-item')).map(item => ({
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

// === Função para abrir modal com conteúdo da seção central ===
function openModalForSection(button, contentId) {
  const content = document.getElementById(contentId);
  if (!content) return;

  // Clona o conteúdo da seção
  const clone = content.cloneNode(true);
  clone.classList.add('open');
  clone.style.padding = '5px'; // Organiza com padding consistente
  clone.style.display = 'flex'; // Garante flex para grids internas
  clone.style.flexDirection = 'column';
  clone.style.gap = '15px';

  // Limpa e popula o body do modal
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = '';

  // Cria header fixo com título e busca
  const header = document.createElement('div');
  header.className = 'modal-header';

  const title = document.createElement('h2');
  title.textContent = button.closest('.section-header').querySelector('h2').textContent;
  header.appendChild(title);

  // Adiciona barra de pesquisa
  const searchWrap = document.createElement('div');
  searchWrap.className = 'modal-search-wrap';
  const searchInputModal = document.createElement('input');
  searchInputModal.type = 'text';
  searchInputModal.placeholder = 'Pesquisar nesta seção...';
  searchInputModal.id = 'modalSearchSection';
  searchWrap.appendChild(searchInputModal);

  const clearBtn = document.createElement('button');
  clearBtn.textContent = '✖';
  clearBtn.title = 'Limpar busca';
  searchWrap.appendChild(clearBtn);
  header.appendChild(searchWrap);

  modalBody.appendChild(header);

  // Adiciona o clone do conteúdo
  modalBody.appendChild(clone);

  // Mostra o overlay/modal
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('open'), 10);

  // Atualiza ARIA
  button.setAttribute('aria-expanded', 'true');

  // Evento para filtro na busca do modal da seção
  searchInputModal.addEventListener('input', () => {
    const query = normalizeText(searchInputModal.value.trim());
    const items = clone.querySelectorAll('.game-item, .texture-item, .project-item');
    items.forEach(item => {
      const title = normalizeText(item.dataset.title || item.textContent);
      item.style.display = title.includes(query) ? '' : 'none';
    });
  });

  // Limpar busca
  clearBtn.addEventListener('click', () => {
    searchInputModal.value = '';
    const items = clone.querySelectorAll('.game-item, .texture-item, .project-item');
    items.forEach(item => item.style.display = '');
  });

  // Adiciona event listeners aos botões de lançamento no clone
  clone.querySelectorAll('.game-item .launch-btn').forEach(button => {
    button.addEventListener('click', () => {
      const gameCard = button.previousElementSibling;
      if (gameCard && gameCard.tagName === 'A') {
        window.open(gameCard.href, '_blank', 'noopener,noreferrer');
      }
    });
  });
}

// === Função para abrir modal com conteúdo da lista ===
function openModalForList(button, listId) {
  const list = document.getElementById(listId);
  if (!list) return;

  // Clona o conteúdo da lista
  const clone = list.cloneNode(true);
  clone.classList.add('open');
  clone.style.display = 'grid';
  clone.style.gap = '15px';
  clone.style.padding = '15px';

  // Limpa e popula o body do modal
  const modalBody = document.getElementById('modalBody');
  modalBody.innerHTML = '';

  // Cria header fixo com título e busca
  const header = document.createElement('div');
  header.className = 'modal-header';

  const title = document.createElement('h2');
  title.textContent = button.textContent;
  header.appendChild(title);

  // Adiciona barra de pesquisa
  const searchWrap = document.createElement('div');
  searchWrap.className = 'modal-search-wrap';
  const searchInputModal = document.createElement('input');
  searchInputModal.type = 'text';
  searchInputModal.placeholder = 'Pesquisar nesta seção...';
  searchInputModal.id = 'modalSearchList';
  searchWrap.appendChild(searchInputModal);

  const clearBtn = document.createElement('button');
  clearBtn.textContent = '✖';
  clearBtn.title = 'Limpar busca';
  searchWrap.appendChild(clearBtn);
  header.appendChild(searchWrap);

  modalBody.appendChild(header);

  // Adiciona o clone da lista
  modalBody.appendChild(clone);

  // Mostra o overlay/modal
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('open'), 10);

  // Atualiza ARIA
  button.setAttribute('aria-expanded', 'true');

  // Evento para filtro na busca do modal da lista
  searchInputModal.addEventListener('input', () => {
    const query = normalizeText(searchInputModal.value.trim());
    const items = clone.querySelectorAll('.member-item');
    items.forEach(item => {
      const textContent = normalizeText(item.textContent);
      item.style.display = textContent.includes(query) ? 'flex' : 'none';
    });
  });

  // Limpar busca
  clearBtn.addEventListener('click', () => {
    searchInputModal.value = '';
    const items = clone.querySelectorAll('.member-item');
    items.forEach(item => item.style.display = 'flex');
  });
}

// === Função para fechar o modal ===
function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  overlay.classList.remove('open');
  setTimeout(() => {
    overlay.classList.add('hidden');
    document.getElementById('modalBody').innerHTML = '';
  }, 300);

  // Reseta ARIA para todos os botões da sidebar direita e central
  document.querySelectorAll('.sidebar.sidebar-direita .launch-btn, .main-sections .toggle-btn').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
  });
}

// === Inicialização dos eventos de clique para seções centrais (agora abrindo modals) ===
document.querySelectorAll('.toggle-btn').forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    openModalForSection(button, targetId);
  });
});

// === Event listeners para botões da sidebar ESQUERDA (expansão local) ===
document.querySelectorAll('.sidebar:not(.sidebar-direita) .launch-btn').forEach(button => {
  button.addEventListener('click', () => {
    const list = button.nextElementSibling;
    if (list && (list.classList.contains('members-list') || list.classList.contains('paginas-list'))) {
      list.classList.toggle('open');
      button.classList.toggle('active');
      button.setAttribute('aria-expanded', list.classList.contains('open'));
    }
  });
});

// === Event listeners para botões da sidebar DIREITA (modals) ===
document.querySelectorAll('.sidebar.sidebar-direita .launch-btn').forEach(button => {
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
  // Email obfuscado (invertido)
  const obfuscatedEmail = 'moc.liamg@9209ijuuyayustat'.split('').reverse().join('');
  
  // Insere o email no elemento
  const pixEmailElement = document.getElementById('pixEmail');
  if (pixEmailElement) {
    pixEmailElement.textContent = obfuscatedEmail;
  }

  // Botão de copiar PIX (copia da variável, não do DOM)
  const copyPixBtn = document.getElementById('copyPixBtn');
  if (copyPixBtn) {
    copyPixBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(obfuscatedEmail).then(() => {
        const msg = document.createElement('div');
        msg.className = 'pix-copied-msg';
        msg.textContent = 'Chave PIX copiada!';
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
      }).catch(err => console.error('Erro ao copiar:', err));
    });
  }
});
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
  document.querySelectorAll('.sidebar:not(.sidebar-direita) .members-list, .sidebar:not(.sidebar-direita) .paginas-list').forEach(list => {
    list.classList.remove('open');
    const button = list.previousElementSibling;
    if (button) {
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  // Inicialização de listas da sidebar direita
  document.querySelectorAll('.sidebar.sidebar-direita .members-list, .sidebar.sidebar-direita .paginas-list').forEach(list => {
    list.classList.remove('open');
    const button = list.previousElementSibling;
    if (button) {
      button.classList.remove('active');
      button.setAttribute('aria-expanded', 'false');
    }
  });

  // Inicialização de listas da sidebar direita 2
  document.querySelectorAll('.sidebar.right-sidebar2 .members-list, .sidebar.right-sidebar2 .paginas-list').forEach(list => {
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

// Lógica para mover o player de música apenas em mobile
let isMobile = window.innerWidth <= 900;
let originalParent = null;

function handlePlayerPosition() {
  const audioCards = document.querySelectorAll('.audio-card');
  if (audioCards.length === 0) return;

  if (!originalParent) {
    originalParent = audioCards[0].parentNode; // Salva o parent original (sidebar esquerda)
  }

  const mainLayout = document.querySelector('.layout');

  if (isMobile) {
    // Move para o final do .layout (abaixo da sidebar direita em mobile)
    audioCards.forEach(card => {
      mainLayout.appendChild(card);
      card.style.display = 'block'; // Garante que o player esteja visível em mobile
    });
  } else {
    // Move de volta para a sidebar esquerda em desktop
    audioCards.forEach(card => {
      originalParent.appendChild(card);
      card.style.display = 'block'; // Mantém visível em desktop
    });
  }
}

document.addEventListener('DOMContentLoaded', handlePlayerPosition);

window.addEventListener('resize', () => {
  const newIsMobile = window.innerWidth <= 900;
  if (newIsMobile !== isMobile) {
    isMobile = newIsMobile;
    handlePlayerPosition();
  }
});
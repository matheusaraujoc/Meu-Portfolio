// Espera o DOM (a página) carregar completamente
document.addEventListener('DOMContentLoaded', () => {
    loadPortfolio();
});

// Referências globais para o Modal
let modal = null;
let modalContent = null;
let modalCloseBtn = null;
let modalTitle = null;
let modalGrid = null;
let body = null;

async function loadPortfolio() {
    try {
        const response = await fetch('config.json');
        if (!response.ok) {
            throw new Error(`Erro HTTP! status: ${response.status}`);
        }
        const config = await response.json();

        setupGlobalConfig(config);
        const mainContainer = document.getElementById('app-container');
        buildMainPage(config, mainContainer);
        setupModalListeners();

    } catch (error) {
        console.error("Não foi possível carregar o arquivo de configuração:", error);
        document.getElementById('app-container').innerHTML =
            '<h1 style="text-align:center; color:red;">Erro ao carregar o portfólio. Verifique o console.</h1>';
    }
}

/**
 * Configura título, favicon e nome no rodapé.
 */
function setupGlobalConfig(config) {
    document.title = config.siteTitle || "Portfólio";
    if (config.favicon) {
        let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/png';
        link.rel = 'shortcut icon';
        link.href = config.favicon;
        document.getElementsByTagName('head')[0].appendChild(link);
    }

    const footerName = document.getElementById('footer-name');
    if (footerName && config.hero && config.hero.title) {
        footerName.textContent = config.hero.title;
    }
}

/**
 * Constrói a PÁGINA INICIAL (index.html)
 */
function buildMainPage(config, container) {
    container.innerHTML = ''; // Limpa

    // 1. Seção Hero
    if (config.hero && config.hero.enabled) {
        buildHero(container, config.hero);
    }

    // 2. Seção Projetos Principais (COM LIMITE)
    if (config.projects && config.projects.enabled) {
        const featuredCount = config.projects.featuredCount || 2;
        const featuredConfig = {
            ...config.projects,
            videos: config.projects.videos.slice(0, featuredCount)
        };

        buildVideoSection(container, featuredConfig, 'projects-section', false);

        if (config.projects.videos.length > featuredCount) {
            const sectionEl = container.querySelector('.projects-section');
            addSeeMoreButton(sectionEl, config.projects, false);
        }
    }

    // 3. Seção Mídias Sociais (COM LIMITE)
    if (config.socialMedia && config.socialMedia.enabled) {
        const featuredCount = config.socialMedia.featuredCount || 3;
        const featuredConfig = {
            ...config.socialMedia,
            videos: config.socialMedia.videos.slice(0, featuredCount)
        };

        buildVideoSection(container, featuredConfig, 'social-media-section', true);

        if (config.socialMedia.videos.length > featuredCount) {
            const sectionEl = container.querySelector('.social-media-section');
            addSeeMoreButton(sectionEl, config.socialMedia, true);
        }
    }

    // 4. Seção Contato
    if (config.contact && config.contact.enabled) {
        buildContact(container, config.contact);
    }
}

/**
 * Função auxiliar para adicionar o botão "Ver Mais"
 */
function addSeeMoreButton(sectionElement, fullConfig, isVertical) {
    if (!sectionElement) return;

    const seeMoreBtn = document.createElement('a');
    seeMoreBtn.className = 'see-more-btn';
    seeMoreBtn.href = '#';
    seeMoreBtn.textContent = 'Ver Galeria Completa';

    seeMoreBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openGalleryModal(fullConfig, isVertical);
    });

    sectionElement.appendChild(seeMoreBtn);
}


/**
 * Prepara os elementos e listeners do Modal para fechar.
 */
function setupModalListeners() {
    modal = document.getElementById('gallery-modal');
    modalContent = modal.querySelector('.modal-content');
    modalCloseBtn = modal.querySelector('.modal-close-btn');
    modalTitle = modal.querySelector('#modal-title');
    modalGrid = modal.querySelector('#modal-grid');
    body = document.body;

    modalCloseBtn.addEventListener('click', closeGalleryModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeGalleryModal();
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeGalleryModal();
        }
    });
}

/**
 * ABRE o modal e constrói o conteúdo da galeria.
 */
function openGalleryModal(sectionConfig, isVertical) {
    modalGrid.innerHTML = '';
    modalTitle.textContent = sectionConfig.title || "Galeria";

    // Adiciona/Remove classes do CONTEÚDO do modal para aplicar o estilo de grid correto
    if (isVertical) {
        modalContent.classList.add('social-media-section');
        modalContent.classList.remove('projects-section');
    } else {
        modalContent.classList.add('projects-section');
        modalContent.classList.remove('social-media-section');
    }

    sectionConfig.videos.forEach(video => {
        modalGrid.appendChild(createVideoCard(video, isVertical));
    });

    modal.style.display = 'flex';
    body.classList.add('modal-open');
}

/**
 * FECHA o modal.
 */
function closeGalleryModal() {
    modal.style.display = 'none';
    body.classList.remove('modal-open');

    const iframes = modalGrid.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        const src = iframe.src;
        iframe.src = src;
    });

    modalGrid.innerHTML = '';
}


// --- Funções Construtoras (Helpers) ---

function buildHero(container, heroConfig) {
    const section = document.createElement('section');
    section.className = 'hero-section';
    section.innerHTML = `
        <h1>${heroConfig.title}</h1>
        <p>${heroConfig.subtitle}</p>
    `;
    container.appendChild(section);
}

function buildVideoSection(container, sectionConfig, sectionClass, isVertical) {
    const section = document.createElement('section');
    section.className = `portfolio-section ${sectionClass}`;

    section.innerHTML = `<h2>${sectionConfig.title}</h2>`;

    const grid = document.createElement('div');
    grid.className = 'video-grid';

    sectionConfig.videos.forEach(video => {
        grid.appendChild(createVideoCard(video, isVertical));
    });

    section.appendChild(grid);
    container.appendChild(section);
}


// ===============================================
// ===== FUNÇÕES ATUALIZADAS E NOVAS         =====
// ===============================================

/**
 * Função Mágica: Pega a configuração do vídeo e retorna a URL de embed correta,
 * para YouTube, Google Drive, Vimeo e Dailymotion.
 */
function getEmbedUrl(video) {
    const type = video.type.toLowerCase();
    const urlOrId = video.id_or_url;

    // --- Processador do YouTube ---
    if (type === 'youtube') {
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})|^([a-zA-Z0-9_-]{11})$/;
        const match = urlOrId.match(youtubeRegex);
        const videoId = match ? (match[1] || match[2]) : null;

        if (videoId) {
            return `https://www.youtube.com/embed/${videoId}`;
        }
    }

    // --- Processador do Google Drive ---
    else if (type === 'gdrive' || type === 'drive') {
        const gdriveRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
        const match = urlOrId.match(gdriveRegex);

        if (match && match[1]) {
            const fileId = match[1];
            return `https://drive.google.com/file/d/${fileId}/preview`;
        }
    }

    // --- Processador do Vimeo ---
    else if (type === 'vimeo') {
        const vimeoRegex = /(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)|^(\d+)$/;
        const match = urlOrId.match(vimeoRegex);
        const videoId = match ? (match[1] || match[2]) : null;

        if (videoId) {
            return `https://player.vimeo.com/video/${videoId}`;
        }
    }

    // --- Processador do Dailymotion (NOVO) ---
    else if (type === 'dailymotion') {
        // Pega o ID de uma URL completa (dailymotion.com/video/x12345) ou só o ID (x12345)
        const dailyRegex = /(?:https?:\/\/)?(?:www\.)?dailymotion\.com\/(?:video|embed\/video)\/([a-zA-Z0-9]+)|^([a-zA-Z0-9]+)$/;
        const match = urlOrId.match(dailyRegex);
        const videoId = match ? (match[1] || match[2]) : null;

        if (videoId) {
            return `https://www.dailymotion.com/embed/video/${videoId}`;
        }
    }

    // Se não encontrou nada
    console.warn(`Não foi possível processar o link para o vídeo: "${video.title}" (URL/ID: ${urlOrId})`);
    return null;
}


/**
 * Constrói o card do vídeo usando a nova lógica de 'getEmbedUrl'
 */
function createVideoCard(video, isVertical) {
    const card = document.createElement('div');
    card.className = 'video-card';

    const embedClass = isVertical ? 'embed-vertical' : 'embed-16-9';
    const embedUrl = getEmbedUrl(video);

    let embedHtml = '';

    if (embedUrl) {
        // Se a URL foi gerada, cria o iframe
        embedHtml = `<iframe src="${embedUrl}" 
                        title="${video.title}" frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen></iframe>`;
    } else {
        // Se a URL falhou, mostra uma mensagem de erro no card
        embedHtml = `<div style="background:#ff00001a; color:#ff8a8a; padding:20px; text-align:center;">
                        <p><strong>Erro:</strong></p>
                        <p>Não foi possível carregar este vídeo. Verifique o link/permissões no config.json.</p>
                    </div>`;
    }

    card.innerHTML = `
        <div class="video-embed ${embedClass}">
            ${embedHtml}
        </div>
        <div class="video-info">
            <h3>${video.title}</h3>
            <p>${video.description}</p>
        </div>
    `;
    return card;
}

// ===============================================
// ===== FIM DAS FUNÇÕES ATUALIZADAS         =====
// ===============================================


function buildContact(container, contactConfig) {
    const section = document.createElement('section');
    section.className = 'contact-section';

    section.innerHTML = `<h2>${contactConfig.title}</h2>`;

    const linksDiv = document.createElement('div');
    linksDiv.className = 'contact-links';

    contactConfig.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        a.innerHTML = `
            <i class="${link.icon}"></i>
            <span>${link.name}</span>
        `;
        linksDiv.appendChild(a);
    });

    section.appendChild(linksDiv);
    container.appendChild(section);
}
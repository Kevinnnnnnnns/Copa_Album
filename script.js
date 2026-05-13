// Configurações e Estado
const TOTAL_STICKERS = 670;
let stickers = {};
let currentFilter = 'all';
let searchQuery = '';

// Elementos do DOM
const grid = document.getElementById('sticker-grid');
const progressBar = document.getElementById('main-progress-bar');
const progressPercent = document.getElementById('progress-percent');
const statsTotal = document.getElementById('stats-total');
const statsRepeated = document.getElementById('stats-repeated');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.btn-filter');

// Inicialização
function init() {
    loadData();
    renderGrid();
    updateStats();
    setupEventListeners();
}

// Carregar dados do localStorage
function loadData() {
    const saved = localStorage.getItem('copa-tracker-v1');
    if (saved) {
        stickers = JSON.parse(saved);
    } else {
        // Inicializa o objeto se não houver dados
        for (let i = 1; i <= TOTAL_STICKERS; i++) {
            stickers[i] = { have: false, repeated: 0 };
        }
        saveData();
    }
}

// Salvar dados no localStorage
function saveData() {
    localStorage.setItem('copa-tracker-v1', JSON.stringify(stickers));
}

// Atualizar estatísticas e barra de progresso
function updateStats() {
    const owned = Object.values(stickers).filter(s => s.have).length;
    const repeated = Object.values(stickers).reduce((acc, s) => acc + s.repeated, 0);
    const percent = Math.round((owned / TOTAL_STICKERS) * 100);

    progressBar.style.width = `${percent}%`;
    progressPercent.innerText = `${percent}%`;
    statsTotal.innerText = `Tenho: ${owned} / ${TOTAL_STICKERS}`;
    statsRepeated.innerText = `Repetidas: ${repeated}`;
}

// Renderizar o Grid de Figurinhas
function renderGrid() {
    grid.innerHTML = '';
    
    for (let i = 1; i <= TOTAL_STICKERS; i++) {
        const s = stickers[i];
        
        // Aplicar Filtros
        if (currentFilter === 'missing' && s.have) continue;
        if (currentFilter === 'have' && !s.have) continue;
        if (currentFilter === 'repeated' && s.repeated === 0) continue;
        
        // Aplicar Busca
        if (searchQuery && !i.toString().includes(searchQuery)) continue;

        const card = document.createElement('div');
        card.className = `sticker-card ${s.have ? 'have' : ''} ${s.repeated > 0 ? 'repeated' : ''}`;
        card.innerHTML = `
            <div class="sticker-status status-have">OK</div>
            <div class="sticker-status status-repeated" style="top: 25px;">+${s.repeated}</div>
            <div class="sticker-number">${i}</div>
            <div class="sticker-actions">
                <button class="btn-action btn-have ${s.have ? 'active' : ''}" onclick="toggleHave(${i})">
                    ${s.have ? 'Remover' : 'Tenho'}
                </button>
                <button class="btn-action btn-repeated ${s.repeated > 0 ? 'active' : ''}" onclick="addRepeated(${i})">
                    Repetida
                </button>
            </div>
        `;
        grid.appendChild(card);
    }
}

// Ações
window.toggleHave = (id) => {
    stickers[id].have = !stickers[id].have;
    if (!stickers[id].have) stickers[id].repeated = 0; // Se não tem, não pode ter repetida
    saveData();
    updateStats();
    renderGrid();
};

window.addRepeated = (id) => {
    // Se não tinha a figurinha, agora tem pelo menos uma
    if (!stickers[id].have) {
        stickers[id].have = true;
    } else {
        // Se já tinha, incrementa a repetida (ou decrementa se clicar com shift?)
        // Vamos manter simples: clica aumenta, se chegar em 10 volta pra 0? 
        // Melhor: menu de contexto ou botão simples. 
        // Para este MVP: clica aumenta.
        stickers[id].repeated++;
        if (stickers[id].repeated > 5) stickers[id].repeated = 0; // Loop para facilitar remoção sem UI complexa
    }
    
    saveData();
    updateStats();
    renderGrid();
};

// Event Listeners
function setupEventListeners() {
    // Filtros
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderGrid();
        });
    });

    // Busca
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderGrid();
    });
}

// Iniciar app
init();

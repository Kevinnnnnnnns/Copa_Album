// Configurações e Estado
const TEAMS = [
    { name: 'Brasil', code: 'BRA', stickers: 20 },
    { name: 'Argentina', code: 'ARG', stickers: 20 },
    { name: 'França', code: 'FRA', stickers: 20 },
    { name: 'Alemanha', code: 'GER', stickers: 20 },
    { name: 'Portugal', code: 'POR', stickers: 20 },
    { name: 'Espanha', code: 'ESP', stickers: 20 },
    { name: 'Inglaterra', code: 'ENG', stickers: 20 },
    { name: 'Bélgica', code: 'BEL', stickers: 20 },
    { name: 'Holanda', code: 'NED', stickers: 20 },
    { name: 'Uruguai', code: 'URU', stickers: 20 },
    { name: 'Croácia', code: 'CRO', stickers: 20 },
    { name: 'Senegal', code: 'SEN', stickers: 20 }
    // Adicione mais se necessário, vamos focar nos principais para o exemplo ser robusto
];

// Nomes simulados para os principais times para dar vida ao app
const PLAYER_NAMES = {
    'BRA': ['Alisson', 'Danilo', 'Thiago Silva', 'Marquinhos', 'Casemiro', 'Neymar', 'Richarlison', 'Vinícius Jr', 'Raphinha', 'Paquetá', 'Ederson', 'Weverton', 'Dani Alves', 'Éder Militão', 'Alex Sandro', 'Fred', 'Fabinho', 'Bruno Guimarães', 'Antony', 'Gabriel Jesus'],
    'ARG': ['Emiliano Martínez', 'Otamendi', 'Romero', 'Tagliafico', 'De Paul', 'Enzo Fernández', 'Mac Allister', 'Lionel Messi', 'Julián Álvarez', 'Di María', 'Lautaro Martínez', 'Montiel', 'Lisandro Martínez', 'Paredes', 'Guido Rodríguez', 'Dybala', 'Correa', 'Armani', 'Acunã', 'Molina']
};

let stickers = {};
let currentTeam = 'all';
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
    renderTeamFilter();
    renderGrid();
    updateStats();
    setupEventListeners();
}

// Gerar filtros de times
function renderTeamFilter() {
    const controls = document.querySelector('.controls');
    const teamSelect = document.createElement('div');
    teamSelect.className = 'team-selector';
    teamSelect.innerHTML = `
        <select id="team-filter" class="btn-filter">
            <option value="all">Todas as Seleções</option>
            ${TEAMS.map(t => `<option value="${t.code}">${t.name}</option>`).join('')}
        </select>
    `;
    controls.prepend(teamSelect);

    document.getElementById('team-filter').addEventListener('change', (e) => {
        currentTeam = e.target.value;
        renderGrid();
    });
}

function loadData() {
    const saved = localStorage.getItem('copa-tracker-v2');
    if (saved) {
        stickers = JSON.parse(saved);
    } else {
        // Inicializa com estrutura por time
        TEAMS.forEach(team => {
            for (let i = 1; i <= team.stickers; i++) {
                const id = `${team.code}-${i}`;
                stickers[id] = { have: false, repeated: 0, team: team.code, num: i };
            }
        });
        saveData();
    }
}

function saveData() {
    localStorage.setItem('copa-tracker-v2', JSON.stringify(stickers));
}

function updateStats() {
    const totalPossible = Object.keys(stickers).length;
    const owned = Object.values(stickers).filter(s => s.have).length;
    const repeated = Object.values(stickers).reduce((acc, s) => acc + s.repeated, 0);
    const percent = Math.round((owned / totalPossible) * 100) || 0;

    progressBar.style.width = `${percent}%`;
    progressPercent.innerText = `${percent}%`;
    statsTotal.innerText = `Tenho: ${owned} / ${totalPossible}`;
    statsRepeated.innerText = `Repetidas: ${repeated}`;
}

function renderGrid() {
    grid.innerHTML = '';
    
    Object.keys(stickers).forEach(id => {
        const s = stickers[id];
        
        // Filtro por Time
        if (currentTeam !== 'all' && s.team !== currentTeam) return;
        
        // Filtro por Estado
        if (currentFilter === 'missing' && s.have) return;
        if (currentFilter === 'have' && !s.have) return;
        if (currentFilter === 'repeated' && s.repeated === 0) return;
        
        // Busca
        const playerName = PLAYER_NAMES[s.team]?.[s.num - 1] || `Jogador ${s.num}`;
        if (searchQuery && !playerName.toLowerCase().includes(searchQuery.toLowerCase()) && !s.num.toString().includes(searchQuery)) return;

        const avatarSeed = `${s.team}-${s.num}`;
        const card = document.createElement('div');
        card.className = `sticker-card ${s.have ? 'have' : ''} ${s.repeated > 0 ? 'repeated' : ''}`;
        card.innerHTML = `
            <div class="sticker-status status-have">OK</div>
            <div class="sticker-status status-repeated">+${s.repeated}</div>
            <div class="sticker-image">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}" alt="${playerName}">
            </div>
            <div class="sticker-info">
                <span class="sticker-team-badge">${s.team}</span>
                <div class="sticker-name">${playerName}</div>
                <div class="sticker-number">#${s.num}</div>
            </div>
            <div class="sticker-actions">
                <button class="btn-action btn-have ${s.have ? 'active' : ''}" onclick="toggleHave('${id}')">
                    ${s.have ? 'Remover' : 'Tenho'}
                </button>
                <button class="btn-action btn-repeated ${s.repeated > 0 ? 'active' : ''}" onclick="addRepeated('${id}')">
                    Repetida
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.toggleHave = (id) => {
    stickers[id].have = !stickers[id].have;
    if (!stickers[id].have) stickers[id].repeated = 0;
    saveData();
    updateStats();
    renderGrid();
};

window.addRepeated = (id) => {
    if (!stickers[id].have) {
        stickers[id].have = true;
    } else {
        stickers[id].repeated++;
        if (stickers[id].repeated > 10) stickers[id].repeated = 0;
    }
    saveData();
    updateStats();
    renderGrid();
};

function setupEventListeners() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderGrid();
        });
    });

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        renderGrid();
    });
}

init();

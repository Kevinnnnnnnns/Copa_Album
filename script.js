// Configurações e Estado - Copa 2026 (Lista Final 48 Seleções)
const TEAMS = [
    // América do Sul (CONMEBOL)
    { name: 'Argentina', code: 'ARG', stickers: 20 }, { name: 'Brasil', code: 'BRA', stickers: 20 },
    { name: 'Colômbia', code: 'COL', stickers: 20 }, { name: 'Equador', code: 'ECU', stickers: 20 },
    { name: 'Paraguai', code: 'PAR', stickers: 20 }, { name: 'Uruguai', code: 'URU', stickers: 20 },
    
    // Europa (UEFA)
    { name: 'Alemanha', code: 'GER', stickers: 20 }, { name: 'Áustria', code: 'AUT', stickers: 20 },
    { name: 'Bélgica', code: 'BEL', stickers: 20 }, { name: 'Bósnia e Herz.', code: 'BIH', stickers: 20 },
    { name: 'Croácia', code: 'CRO', stickers: 20 }, { name: 'Escócia', code: 'SCO', stickers: 20 },
    { name: 'Espanha', code: 'ESP', stickers: 20 }, { name: 'França', code: 'FRA', stickers: 20 },
    { name: 'Inglaterra', code: 'ENG', stickers: 20 }, { name: 'Noruega', code: 'NOR', stickers: 20 },
    { name: 'Holanda', code: 'NED', stickers: 20 }, { name: 'Portugal', code: 'POR', stickers: 20 },
    { name: 'Rep. Tcheca', code: 'CZE', stickers: 20 }, { name: 'Suécia', code: 'SWE', stickers: 20 },
    { name: 'Suíça', code: 'SUI', stickers: 20 }, { name: 'Turquia', code: 'TUR', stickers: 20 },
    
    // Concacaf
    { name: 'Canadá (Sede)', code: 'CAN', stickers: 20 }, { name: 'EUA (Sede)', code: 'USA', stickers: 20 },
    { name: 'México (Sede)', code: 'MEX', stickers: 20 }, { name: 'Curaçau (Estreante)', code: 'CUW', stickers: 20 },
    { name: 'Haiti', code: 'HAI', stickers: 20 }, { name: 'Panamá', code: 'PAN', stickers: 20 },
    
    // África (CAF)
    { name: 'África do Sul', code: 'RSA', stickers: 20 }, { name: 'Argélia', code: 'ALG', stickers: 20 },
    { name: 'Cabo Verde (Est.)', code: 'CPV', stickers: 20 }, { name: 'Costa do Marfim', code: 'CIV', stickers: 20 },
    { name: 'Egito', code: 'EGY', stickers: 20 }, { name: 'Gana', code: 'GHA', stickers: 20 },
    { name: 'Marrocos', code: 'MAR', stickers: 20 }, { name: 'RD Congo', code: 'COD', stickers: 20 },
    { name: 'Senegal', code: 'SEN', stickers: 20 }, { name: 'Tunísia', code: 'TUN', stickers: 20 },
    
    // Ásia (AFC)
    { name: 'Arábia Saudita', code: 'KSA', stickers: 20 }, { name: 'Austrália', code: 'AUS', stickers: 20 },
    { name: 'Catar', code: 'QAT', stickers: 20 }, { name: 'Coreia do Sul', code: 'KOR', stickers: 20 },
    { name: 'Irã', code: 'IRN', stickers: 20 }, { name: 'Iraque', code: 'IRQ', stickers: 20 },
    { name: 'Japão', code: 'JPN', stickers: 20 }, { name: 'Jordânia', code: 'JOR', stickers: 20 },
    { name: 'Uzbequistão (Est.)', code: 'UZB', stickers: 20 },
    
    // Oceania (OFC)
    { name: 'Nova Zelândia', code: 'NZL', stickers: 20 }
];

const PLAYER_NAMES = {
    'BRA': ['Alisson', 'Danilo', 'Thiago Silva', 'Marquinhos', 'Casemiro', 'Neymar', 'Richarlison', 'Vinícius Jr', 'Raphinha', 'Paquetá', 'Ederson', 'Weverton', 'Dani Alves', 'Éder Militão', 'Alex Sandro', 'Fred', 'Fabinho', 'Bruno Guimarães', 'Antony', 'Gabriel Jesus'],
    'ARG': ['Emiliano Martínez', 'Otamendi', 'Romero', 'Tagliafico', 'De Paul', 'Enzo Fernández', 'Mac Allister', 'Lionel Messi', 'Julián Álvarez', 'Di María', 'Lautaro Martínez', 'Montiel', 'Lisandro Martínez', 'Paredes', 'Guido Rodríguez', 'Dybala', 'Correa', 'Armani', 'Acunã', 'Molina']
};

let stickers = {};
let currentTeam = 'all';
let currentFilter = 'all';
let searchQuery = '';

const grid = document.getElementById('sticker-grid');
const progressBar = document.getElementById('main-progress-bar');
const progressPercent = document.getElementById('progress-percent');
const statsTotal = document.getElementById('stats-total');
const statsRepeated = document.getElementById('stats-repeated');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.btn-filter');

function init() {
    loadData();
    renderTeamFilter();
    renderGrid();
    updateStats();
    setupEventListeners();
}

function renderTeamFilter() {
    const controls = document.querySelector('.controls');
    let teamSelector = document.querySelector('.team-selector');
    if (!teamSelector) {
        teamSelector = document.createElement('div');
        teamSelector.className = 'team-selector';
        controls.prepend(teamSelector);
    }
    
    teamSelector.innerHTML = `
        <select id="team-filter" class="btn-filter">
            <option value="all">Todas as Seleções (2026)</option>
            ${TEAMS.map(t => `<option value="${t.code}">${t.name}</option>`).join('')}
        </select>
    `;

    document.getElementById('team-filter').addEventListener('change', (e) => {
        currentTeam = e.target.value;
        renderGrid();
    });
}

function loadData() {
    const saved = localStorage.getItem('copa-tracker-v5');
    if (saved) {
        stickers = JSON.parse(saved);
    } else {
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
    localStorage.setItem('copa-tracker-v5', JSON.stringify(stickers));
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
        
        if (currentTeam !== 'all' && s.team !== currentTeam) return;
        if (currentFilter === 'missing' && s.have) return;
        if (currentFilter === 'have' && !s.have) return;
        if (currentFilter === 'repeated' && s.repeated === 0) return;
        
        const playerName = PLAYER_NAMES[s.team]?.[s.num - 1] || `Jogador ${s.num}`;
        if (searchQuery && !playerName.toLowerCase().includes(searchQuery.toLowerCase()) && !s.num.toString().includes(searchQuery)) return;

        const card = document.createElement('div');
        card.className = `sticker-card ${s.have ? 'have' : ''} ${s.repeated > 0 ? 'repeated' : ''}`;
        card.innerHTML = `
            <div class="sticker-status status-have">OK</div>
            <div class="sticker-status status-repeated">+${s.repeated}</div>
            <div class="sticker-info">
                <span class="sticker-team-badge">${s.team}</span>
                <div class="sticker-name">${playerName}</div>
                <div class="sticker-number">#${s.num}</div>
            </div>
            <div class="sticker-actions">
                <button class="btn-action btn-have ${s.have ? 'active' : ''}" onclick="toggleHave('${id}')">
                    ${s.have ? 'Tenho' : 'Marcar'}
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
    if (!stickers[id].have) stickers[id].have = true;
    stickers[id].repeated++;
    if (stickers[id].repeated > 10) stickers[id].repeated = 0;
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

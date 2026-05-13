// Configurações e Estado - Copa 2026 (Elencos Oficiais)
const TEAMS = [
    { name: 'Argentina', code: 'ARG', stickers: 20 }, { name: 'Brasil', code: 'BRA', stickers: 20 },
    { name: 'Colômbia', code: 'COL', stickers: 20 }, { name: 'Equador', code: 'ECU', stickers: 20 },
    { name: 'Paraguai', code: 'PAR', stickers: 20 }, { name: 'Uruguai', code: 'URU', stickers: 20 },
    { name: 'Alemanha', code: 'GER', stickers: 20 }, { name: 'Áustria', code: 'AUT', stickers: 20 },
    { name: 'Bélgica', code: 'BEL', stickers: 20 }, { name: 'Bósnia e Herz.', code: 'BIH', stickers: 20 },
    { name: 'Croácia', code: 'CRO', stickers: 20 }, { name: 'Escócia', code: 'SCO', stickers: 20 },
    { name: 'Espanha', code: 'ESP', stickers: 20 }, { name: 'França', code: 'FRA', stickers: 20 },
    { name: 'Inglaterra', code: 'ENG', stickers: 20 }, { name: 'Noruega', code: 'NOR', stickers: 20 },
    { name: 'Holanda', code: 'NED', stickers: 20 }, { name: 'Portugal', code: 'POR', stickers: 20 },
    { name: 'Rep. Tcheca', code: 'CZE', stickers: 20 }, { name: 'Suécia', code: 'SWE', stickers: 20 },
    { name: 'Suíça', code: 'SUI', stickers: 20 }, { name: 'Turquia', code: 'TUR', stickers: 20 },
    { name: 'Canadá (Sede)', code: 'CAN', stickers: 20 }, { name: 'EUA (Sede)', code: 'USA', stickers: 20 },
    { name: 'México (Sede)', code: 'MEX', stickers: 20 }, { name: 'Curaçau', code: 'CUW', stickers: 20 },
    { name: 'Haiti', code: 'HAI', stickers: 20 }, { name: 'Panamá', code: 'PAN', stickers: 20 },
    { name: 'África do Sul', code: 'RSA', stickers: 20 }, { name: 'Argélia', code: 'ALG', stickers: 20 },
    { name: 'Cabo Verde', code: 'CPV', stickers: 20 }, { name: 'Costa do Marfim', code: 'CIV', stickers: 20 },
    { name: 'Egito', code: 'EGY', stickers: 20 }, { name: 'Gana', code: 'GHA', stickers: 20 },
    { name: 'Marrocos', code: 'MAR', stickers: 20 }, { name: 'RD Congo', code: 'COD', stickers: 20 },
    { name: 'Senegal', code: 'SEN', stickers: 20 }, { name: 'Tunísia', code: 'TUN', stickers: 20 },
    { name: 'Arábia Saudita', code: 'KSA', stickers: 20 }, { name: 'Austrália', code: 'AUS', stickers: 20 },
    { name: 'Catar', code: 'QAT', stickers: 20 }, { name: 'Coreia do Sul', code: 'KOR', stickers: 20 },
    { name: 'Irã', code: 'IRN', stickers: 20 }, { name: 'Iraque', code: 'IRQ', stickers: 20 },
    { name: 'Japão', code: 'JPN', stickers: 20 }, { name: 'Jordânia', code: 'JOR', stickers: 20 },
    { name: 'Uzbequistão', code: 'UZB', stickers: 20 }, { name: 'Nova Zelândia', code: 'NZL', stickers: 20 }
];

const PLAYER_NAMES = {
    'BRA': ['Alisson', 'Danilo', 'Marquinhos', 'Militão', 'G. Arana', 'Casemiro', 'B. Guimarães', 'Paquetá', 'Vini Jr', 'Rodrygo', 'Endrick', 'Ederson', 'Bento', 'Bremer', 'Beraldo', 'João Gomes', 'Douglas Luiz', 'Savinho', 'Raphinha', 'Gabriel Martinelli'],
    'ARG': ['E. Martínez', 'Molina', 'Romero', 'Otamendi', 'Tagliafico', 'De Paul', 'Enzo F.', 'Mac Allister', 'Lionel Messi', 'J. Álvarez', 'Di María', 'Armani', 'Montiel', 'L. Martínez', 'Paredes', 'Lo Celso', 'N. González', 'Lautaro M.', 'Garnacho', 'Dybala'],
    'FRA': ['Maignan', 'Koundé', 'Saliba', 'Upamecano', 'Theo H.', 'Tchouaméni', 'Camavinga', 'Griezmann', 'Mbappé', 'Dembélé', 'Giroud', 'Samba', 'Pavard', 'Konaté', 'Rabiot', 'Zaire-Emery', 'Fofana', 'Kolo Muani', 'Thuram', 'Barcola'],
    'ESP': ['Unai Simón', 'Carvajal', 'Le Normand', 'Laporte', 'Cucurella', 'Rodri', 'Pedri', 'Fabian Ruiz', 'Lamine Yamal', 'Nico Williams', 'Morata', 'Raya', 'Navas', 'Vivian', 'Grimaldo', 'Zubimendi', 'Olmo', 'Baena', 'Ferran Torres', 'Oyarzabal'],
    'ENG': ['Pickford', 'Walker', 'Stones', 'Guehi', 'Trippier', 'Rice', 'Mainoo', 'Bellingham', 'Saka', 'Foden', 'Harry Kane', 'Ramsdale', 'Konsa', 'Dunk', 'Joe Gomez', 'Gallagher', 'Palmer', 'Bowen', 'Eze', 'Ollie Watkins'],
    'POR': ['Diogo Costa', 'Cancelo', 'Ruben Dias', 'Pepe', 'Nuno Mendes', 'Palhinha', 'Vitinha', 'Bruno F.', 'Bernardo Silva', 'Rafael Leão', 'C. Ronaldo', 'José Sá', 'Dalot', 'Inácio', 'Antonio Silva', 'Danilo P.', 'Ruben Neves', 'João Félix', 'Gonçalo Ramos', 'Diogo Jota'],
    'GER': ['Neuer', 'Kimmich', 'Tah', 'Rüdiger', 'Mittelstädt', 'Andrich', 'Kroos', 'Gündogan', 'Musiala', 'Wirtz', 'Havertz', 'Ter Stegen', 'Raum', 'Schlotterbeck', 'Anton', 'Gross', 'Sané', 'Müller', 'Füllkrug', 'Beier'],
    'NED': ['Verbruggen', 'Dumfries', 'De Vrij', 'Van Dijk', 'Aké', 'Schouten', 'Reijnders', 'Xavi Simons', 'Frimpong', 'Gakpo', 'Depay', 'Fleken', 'Geertruida', 'De Ligt', 'Van de Ven', 'Wijnaldum', 'Veerman', 'Malen', 'Weghorst', 'Zirkzee'],
    'URU': ['Rochet', 'Nández', 'Araújo', 'Giménez', 'Olivera', 'Ugarte', 'Valverde', 'De la Cruz', 'Pellistri', 'Darwin Núñez', 'M. Araújo', 'Mele', 'Cáceres', 'Marichal', 'Viña', 'Bentancur', 'Nico de la Cruz', 'Brian Rodríguez', 'Luis Suárez', 'K. Olivera'],
    'USA': ['Turner', 'Scally', 'Richards', 'Ream', 'A. Robinson', 'McKennie', 'Adams', 'Musah', 'Weah', 'Balogun', 'Pulisic', 'Horvath', 'Carter-Vickers', 'Miles Robinson', 'Lund', 'Johnny Cardoso', 'Reyna', 'De la Torre', 'Pepi', 'Wright'],
    'MEX': ['J. González', 'J. Sánchez', 'Montes', 'Vásquez', 'Gerardo Arteaga', 'Luis Romo', 'Chávez', 'Érick Sánchez', 'Antuna', 'Santi Giménez', 'Quiñones', 'Rangel', 'Israel Reyes', 'Orozco', 'Bryan González', 'Charly Rodríguez', 'Orbelín Pineda', 'Alexis Vega', 'Memote Martinez', 'Marcelo Flores'],
    'MAR': ['Bounou', 'Hakimi', 'Aguerd', 'Saïss', 'Mazraoui', 'Amrabat', 'Ounahi', 'Ziyech', 'Brahim Díaz', 'En-Nesyri', 'Ezzalzouli', 'Munir', 'Dari', 'Chibi', 'Amallah', 'Richardson', 'Adli', 'El Kaabi', 'Rahimi', 'Akhomach'],
    'SEN': ['E. Mendy', 'Koulibaly', 'Niakhaté', 'Diallo', 'Jakobs', 'Pape Gueye', 'Lamine Camara', 'Sarr', 'Sadio Mané', 'Jackson', 'Habib Diallo', 'Dieng', 'Seck', 'Abdoulaye Niakhaté', 'Mendy', 'Gana Gueye', 'Nampalys Mendy', 'Iliman Ndiaye', 'Bamba Dieng', 'Sima'],
    'ITA': ['Donnarumma', 'Di Lorenzo', 'Bastoni', 'Calafiori', 'Dimarco', 'Jorginho', 'Barella', 'Frattesi', 'Chiesa', 'Pellegrini', 'Scamacca', 'Vicario', 'Darmian', 'Buongiorno', 'Mancini', 'Cristante', 'Fagioli', 'Zaccagni', 'Retegui', 'Raspadori'],
    'JPN': ['Suzuki', 'Sugawara', 'Itakura', 'Taniguchi', 'Ito', 'Endo', 'Morita', 'Kubo', 'Minamino', 'Doan', 'Ueda', 'Maekawa', 'Machida', 'Watanabe', 'Maeda', 'Kamada', 'Hatate', 'Nakamura', 'Ogawa', 'Mitoma'],
    'KOR': ['Jo Hyeon-woo', 'Kim Moon-hwan', 'Kim Min-jae', 'Kim Young-gwon', 'Kim Jin-su', 'Hwang In-beom', 'Lee Jae-sung', 'Lee Kang-in', 'Son Heung-min', 'Hwang Hee-chan', 'Cho Gue-sung', 'Song Bum-keun', 'Seol Young-woo', 'Jung Seung-hyun', 'Park Yong-woo', 'Hong Hyun-seok', 'Paik Seung-ho', 'Jeong Woo-yeong', 'Oh Hyeon-gyu', 'Yang Min-hyeok'],
    'COL': ['Camilo Vargas', 'Daniel Muñoz', 'Davinson Sánchez', 'Cuesta', 'Mojica', 'Richard Ríos', 'Jefferson Lerma', 'Jhon Arias', 'James Rodríguez', 'Luis Díaz', 'Jhon Córdoba', 'Ospina', 'Santiago Arias', 'Yerry Mina', 'Lucumí', 'Mateus Uribe', 'Kevin Castaño', 'Quintero', 'Borré', 'Jhon Durán'],
    'ECU': ['Domínguez', 'Preciado', 'Félix Torres', 'Pacho', 'Hincapié', 'Gruezo', 'Moisés Caicedo', 'Kendry Páez', 'Yeboah', 'Enner Valencia', 'Sarmiento', 'Ramírez', 'Arboleda', 'Layan Loor', 'Alan Franco', 'Mena', 'Alan Minda', 'Kevin Rodríguez', 'Jordy Caicedo', 'Corozo'],
    'POR': ['Diogo Costa', 'Cancelo', 'Dias', 'Pepe', 'Mendes', 'Palhinha', 'Vitinha', 'Bernardo Silva', 'Bruno F.', 'Leão', 'Cristiano Ronaldo', 'Sá', 'Dalot', 'Inácio', 'Danilo', 'Neves', 'Neto', 'Jota', 'Ramos', 'Félix'],
    'CAN': ['Crépeau', 'Johnston', 'Bombito', 'Cornelius', 'Davies', 'Eustaquio', 'Koné', 'Osorio', 'Buchanan', 'David', 'Larin', 'St. Clair', 'Miller', 'Waterman', 'Laryea', 'Choinière', 'Shaffelburg', 'Millar', 'Russell-Rowe', 'Bair'],
    'BEL': ['Casteels', 'Castagne', 'Faes', 'Vertonghen', 'Theate', 'Onana', 'Mangala', 'De Bruyne', 'Doku', 'Trossard', 'Lukaku', 'Kaminski', 'Meunier', 'Debast', 'Witsel', 'Carrasco', 'Tielemans', 'Vermeeren', 'Bakayoko', 'Openda'],
    'CRO': ['Livakovic', 'Stanisic', 'Sutalo', 'Gvardiol', 'Sosa', 'Modric', 'Brozovic', 'Kovacic', 'Pasalic', 'Kramaric', 'Budimir', 'Ivusic', 'Vida', 'Erlic', 'Juranovic', 'Majer', 'Sucic', 'Perisic', 'Petkovic', 'Pjaca']
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
            <option value="all">Todas as Seleções (Elencos 2026)</option>
            ${TEAMS.map(t => `<option value="${t.code}">${t.name}</option>`).join('')}
        </select>
    `;

    document.getElementById('team-filter').addEventListener('change', (e) => {
        currentTeam = e.target.value;
        renderGrid();
    });
}

function loadData() {
    const saved = localStorage.getItem('copa-tracker-v6');
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
    localStorage.setItem('copa-tracker-v6', JSON.stringify(stickers));
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
        
        const playerName = PLAYER_NAMES[s.team]?.[s.num - 1] || `${s.team} - Jogador ${s.num}`;
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

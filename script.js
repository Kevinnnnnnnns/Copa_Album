// CONFIGURAÇÃO DO FIREBASE (Você deve substituir pelos seus dados do console do Firebase)
const firebaseConfig = {
    apiKey: "AIzaSyAkdEi54zUDH7soaJqpsUOSRGAF4vyYZCE",
    authDomain: "albumcopa-cf003.firebaseapp.com",
    projectId: "albumcopa-cf003",
    storageBucket: "albumcopa-cf003.firebasestorage.app",
    messagingSenderId: "844864114817",
    appId: "1:844864114817:web:83166e1c1691684b4cfd80",
    measurementId: "G-DEFWTX53R"
};

// Inicializa Firebase (Caso as chaves sejam válidas)
try {
    firebase.initializeApp(firebaseConfig);
} catch (e) {
    console.warn("Firebase não configurado. Use 'SUA_API_KEY' etc no script.js");
}

const auth = firebase.auth ? firebase.auth() : null;
const db = firebase.firestore ? firebase.firestore() : null;

// Configurações e Estado
const TEAMS = [
    { name: 'África do Sul', code: 'RSA', stickers: 20 }, { name: 'Alemanha', code: 'GER', stickers: 20 },
    { name: 'Argélia', code: 'ALG', stickers: 20 }, { name: 'Argentina', code: 'ARG', stickers: 20 },
    { name: 'Austrália', code: 'AUS', stickers: 20 }, { name: 'Áustria', code: 'AUT', stickers: 20 },
    { name: 'Bélgica', code: 'BEL', stickers: 20 }, { name: 'Bósnia e Herz.', code: 'BIH', stickers: 20 },
    { name: 'Brasil', code: 'BRA', stickers: 20 }, { name: 'Cabo Verde', code: 'CPV', stickers: 20 },
    { name: 'Canadá (Sede)', code: 'CAN', stickers: 20 }, { name: 'Catar', code: 'QAT', stickers: 20 },
    { name: 'Colômbia', code: 'COL', stickers: 20 }, { name: 'Coreia do Sul', code: 'KOR', stickers: 20 },
    { name: 'Costa do Marfim', code: 'CIV', stickers: 20 }, { name: 'Croácia', code: 'CRO', stickers: 20 },
    { name: 'Curaçau', code: 'CUW', stickers: 20 }, { name: 'Egito', code: 'EGY', stickers: 20 },
    { name: 'Equador', code: 'ECU', stickers: 20 }, { name: 'Escócia', code: 'SCO', stickers: 20 },
    { name: 'Espanha', code: 'ESP', stickers: 20 }, { name: 'EUA (Sede)', code: 'USA', stickers: 20 },
    { name: 'França', code: 'FRA', stickers: 20 }, { name: 'Gana', code: 'GHA', stickers: 20 },
    { name: 'Haiti', code: 'HAI', stickers: 20 }, { name: 'Holanda', code: 'NED', stickers: 20 },
    { name: 'Inglaterra', code: 'ENG', stickers: 20 }, { name: 'Irã', code: 'IRN', stickers: 20 },
    { name: 'Iraque', code: 'IRQ', stickers: 20 }, { name: 'Japão', code: 'JPN', stickers: 20 },
    { name: 'Jordânia', code: 'JOR', stickers: 20 }, { name: 'Marrocos', code: 'MAR', stickers: 20 },
    { name: 'México (Sede)', code: 'MEX', stickers: 20 }, { name: 'Noruega', code: 'NOR', stickers: 20 },
    { name: 'Nova Zelândia', code: 'NZL', stickers: 20 }, { name: 'Panamá', code: 'PAN', stickers: 20 },
    { name: 'Paraguai', code: 'PAR', stickers: 20 }, { name: 'Portugal', code: 'POR', stickers: 20 },
    { name: 'RD Congo', code: 'COD', stickers: 20 }, { name: 'Rep. Tcheca', code: 'CZE', stickers: 20 },
    { name: 'Arábia Saudita', code: 'KSA', stickers: 20 }, { name: 'Senegal', code: 'SEN', stickers: 20 },
    { name: 'Suécia', code: 'SWE', stickers: 20 }, { name: 'Suíça', code: 'SUI', stickers: 20 },
    { name: 'Tunísia', code: 'TUN', stickers: 20 }, { name: 'Turquia', code: 'TUR', stickers: 20 },
    { name: 'Uruguai', code: 'URU', stickers: 20 }, { name: 'Uzbequistão', code: 'UZB', stickers: 20 }
].sort((a, b) => a.name.localeCompare(b.name));

const PLAYER_NAMES = {
    'BRA': ['Escudo', 'Alisson', 'Bento', 'Marquinhos', 'Militão', 'G. Magalhães', 'Danilo', 'Wesley', 'Paquetá', 'Casemiro', 'B. Guimarães', 'Luiz Henrique', 'Time', 'Vini Jr', 'Rodrygo', 'João Pedro', 'M. Cunha', 'Martinelli', 'Raphinha', 'Estêvão']
};

let stickers = {};
let currentUser = null;
let currentTeam = 'all';
let currentFilter = 'all';
let searchQuery = '';
let authMode = 'login';

// Elementos DOM
const grid = document.getElementById('sticker-grid');
const progressBar = document.getElementById('main-progress-bar');
const progressPercent = document.getElementById('progress-percent');
const statsTotal = document.getElementById('stats-total');
const statsRepeated = document.getElementById('stats-repeated');
const searchInput = document.getElementById('search-input');
const filterBtns = document.querySelectorAll('.btn-filter');

// Auth DOM
const authModal = document.getElementById('auth-modal');
const authBtn = document.getElementById('auth-btn');
const userProfile = document.getElementById('user-profile');
const userEmailSpan = document.getElementById('user-email');
const logoutBtn = document.getElementById('logout-btn');
const authForm = document.getElementById('auth-form');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const authError = document.getElementById('auth-error');
const closeModal = document.getElementById('close-modal');

function init() {
    setupAuthListeners();
    renderTeamFilter();
    setupEventListeners();
    
    // Se não houver Firebase (Auth null), carrega local
    if (!auth) loadDataLocal();
}

// --- LOGICA DE AUTH ---
function setupAuthListeners() {
    if (!auth) return;

    auth.onAuthStateChanged(user => {
        currentUser = user;
        if (user) {
            authBtn.classList.add('hidden');
            userProfile.classList.remove('hidden');
            userEmailSpan.innerText = user.email;
            loadDataFromCloud();
        } else {
            authBtn.classList.remove('hidden');
            userProfile.classList.add('hidden');
            loadDataLocal();
        }
    });

    authBtn.onclick = () => authModal.classList.remove('hidden');
    closeModal.onclick = () => authModal.classList.add('hidden');
    logoutBtn.onclick = () => auth.signOut();

    tabLogin.onclick = () => {
        authMode = 'login';
        tabLogin.classList.add('active');
        tabRegister.classList.remove('active');
    };

    tabRegister.onclick = () => {
        authMode = 'register';
        tabRegister.classList.add('active');
        tabLogin.classList.remove('active');
    };

    authForm.onsubmit = async (e) => {
        e.preventDefault();
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        authError.innerText = '';

        try {
            if (authMode === 'login') {
                await auth.signInWithEmailAndPassword(email, pass);
            } else {
                await auth.createUserWithEmailAndPassword(email, pass);
            }
            authModal.classList.add('hidden');
        } catch (err) {
            authError.innerText = err.message;
        }
    };
}

// --- LOGICA DE DADOS ---
async function loadDataFromCloud() {
    if (!db) return;
    const doc = await db.collection('users').doc(currentUser.uid).get();
    if (doc.exists) {
        stickers = doc.data().stickers;
    } else {
        generateInitialData();
        await saveToCloud();
    }
    renderGrid();
    updateStats();
}

function loadDataLocal() {
    const saved = localStorage.getItem('album-copa-v12');
    if (saved) {
        stickers = JSON.parse(saved);
    } else {
        generateInitialData();
    }
    renderGrid();
    updateStats();
}

function generateInitialData() {
    stickers = {};
    TEAMS.forEach(team => {
        for (let i = 1; i <= team.stickers; i++) {
            const id = `${team.code}-${i}`;
            stickers[id] = { have: false, repeated: 0, team: team.code, num: i };
        }
    });
}

function saveData() {
    if (currentUser && db) {
        saveToCloud();
    } else {
        localStorage.setItem('album-copa-v12', JSON.stringify(stickers));
    }
}

async function saveToCloud() {
    if (!currentUser || !db) return;
    try {
        await db.collection('users').doc(currentUser.uid).set({ stickers });
    } catch (e) {
        console.error("Erro ao salvar nuvem", e);
    }
}

// --- RENDER ---
function renderGrid() {
    grid.innerHTML = '';
    
    Object.keys(stickers)
        .sort((a, b) => {
            const [teamA, numA] = a.split('-');
            const [teamB, numB] = b.split('-');
            if (teamA !== teamB) return teamA.localeCompare(teamB);
            return parseInt(numA) - parseInt(numB);
        })
        .forEach(id => {
        const s = stickers[id];
        
        if (currentTeam !== 'all' && s.team !== currentTeam) return;
        if (currentFilter === 'missing' && s.have) return;
        if (currentFilter === 'have' && !s.have) return;
        if (currentFilter === 'repeated' && s.repeated === 0) return;
        
        let playerName = PLAYER_NAMES[s.team]?.[s.num - 1] || `${s.team} - Jogador ${s.num}`;
        if (s.num === 1) playerName = 'Escudo da Seleção';
        if (s.num === 13) playerName = 'Time Completo';

        const teamName = TEAMS.find(t => t.code === s.team)?.name || '';
        const searchTerms = searchQuery.toLowerCase();
        
        if (searchQuery && 
            !playerName.toLowerCase().includes(searchTerms) && 
            !s.num.toString().includes(searchTerms) &&
            !teamName.toLowerCase().includes(searchTerms) &&
            !s.team.toLowerCase().includes(searchTerms)
        ) return;

        const isSpecial = s.num === 1 || s.num === 13;
        const card = document.createElement('div');
        card.className = `sticker-card ${s.have ? 'have' : ''} ${s.repeated > 0 ? 'repeated' : ''} ${isSpecial ? 'special' : ''}`;
        card.innerHTML = `
            <div class="status-repeated">+${s.repeated}</div>
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
            <option value="all">Todas as Seleções</option>
            ${TEAMS.map(t => `<option value="${t.code}">${t.name}</option>`).join('')}
        </select>
    `;

    document.getElementById('team-filter').addEventListener('change', (e) => {
        currentTeam = e.target.value;
        renderGrid();
    });

    document.getElementById('generate-report-btn').addEventListener('click', generateReport);
}

function generateReport() {
    let report = "=== RELATÓRIO ÁLBUM COPA 2026 ===\n";
    report += `Data: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    
    const owned = Object.values(stickers).filter(s => s.have).length;
    const total = Object.keys(stickers).length;
    const repeated = Object.values(stickers).reduce((acc, s) => acc + s.repeated, 0);
    
    report += `Progresso: ${owned} / ${total} (${Math.round((owned/total)*100)}%)\n`;
    report += `Total de Repetidas: ${repeated}\n\n`;
    
    report += "--- MINHAS FIGURINHAS ---\n";
    
    TEAMS.forEach(team => {
        const teamStickers = Object.keys(stickers)
            .filter(id => id.startsWith(team.code))
            .map(id => ({ id, ...stickers[id] }));
        
        const myStickers = teamStickers.filter(s => s.have || s.repeated > 0);
        
        if (myStickers.length > 0) {
            report += `\n[${team.name}]\n`;
            myStickers.forEach(s => {
                let name = PLAYER_NAMES[s.team]?.[s.num - 1] || `Jogador ${s.num}`;
                if (s.num === 1) name = 'Escudo';
                if (s.num === 13) name = 'Time Completo';
                
                let status = s.have ? "Tenho" : "Só Repetida";
                if (s.repeated > 0) status += ` (+${s.repeated} repetidas)`;
                
                report += `#${s.num} ${name.padEnd(20)} | ${status}\n`;
            });
        }
    });

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_album_2026_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

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

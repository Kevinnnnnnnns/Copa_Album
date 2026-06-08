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
    { name: 'Uruguai', code: 'URU', stickers: 20 }, { name: 'Uzbequistão', code: 'UZB', stickers: 20 },
    { name: 'Coca-Cola', code: 'CC', stickers: 14 }, { name: 'FIFA (FWC)', code: 'FWC', stickers: 20, start: 0 }
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
let currentReportType = 'complete';

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

// Report DOM
const reportModal = document.getElementById('report-modal');
const closeReportModal = document.getElementById('close-report-modal');
const genPdfBtn = document.getElementById('gen-pdf-btn');
const genTxtBtn = document.getElementById('gen-txt-btn');
const reportTemplate = document.getElementById('report-template');

// Multi-Selection DOM
const multiSelectModal = document.getElementById('multi-select-modal');
const closeMultiSelect = document.getElementById('close-multi-select');
const multiSelectBtn = document.getElementById('multi-select-btn');
const multiSelectTeam = document.getElementById('multi-select-team');
const multiSelectGrid = document.getElementById('multi-select-grid');
const multiSelectCount = document.getElementById('multi-select-count');
const selectAllBtn = document.getElementById('select-all-btn');
const deselectAllBtn = document.getElementById('deselect-all-btn');
const markAsHaveBtn = document.getElementById('mark-as-have-btn');
const markAsRepeatedBtn = document.getElementById('mark-as-repeated-btn');
const closeMultiSelectBtn = document.getElementById('close-multi-select-btn');

let selectedStickers = new Set();

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
        stickers = mergeStickers(doc.data().stickers);
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
        stickers = mergeStickers(JSON.parse(saved));
    } else {
        generateInitialData();
    }
    renderGrid();
    updateStats();
}

function generateInitialData() {
    stickers = {};
    TEAMS.forEach(team => {
        const start = team.start !== undefined ? team.start : 1;
        for (let i = start; i < start + team.stickers; i++) {
            const id = `${team.code}-${i}`;
            stickers[id] = { have: false, repeated: 0, team: team.code, num: i, image: '' };
        }
    });
}

function mergeStickers(savedStickers) {
    const newStickers = {};
    TEAMS.forEach(team => {
        const start = team.start !== undefined ? team.start : 1;
        for (let i = start; i < start + team.stickers; i++) {
            const id = `${team.code}-${i}`;
            if (savedStickers[id]) {
                newStickers[id] = savedStickers[id];
            } else {
                newStickers[id] = { have: false, repeated: 0, team: team.code, num: i, image: '' };
            }
        }
    });
    return newStickers;
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
        if (s.num === 1 && s.team !== 'CC' && s.team !== 'FWC') playerName = 'Escudo da Seleção';
        if (s.num === 13 && s.team !== 'CC' && s.team !== 'FWC') playerName = 'Time Completo';
        
        if (s.team === 'CC') playerName = `Coca-Cola #${s.num}`;
        if (s.team === 'FWC') playerName = `FIFA FWC #${s.num}`;

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

    document.getElementById('generate-report-btn').addEventListener('click', openReportModal);
}

function openReportModal() {
    reportModal.classList.remove('hidden');
}

function closeReportModalFunc() {
    reportModal.classList.add('hidden');
}

async function generatePDFReport() {
    closeReportModalFunc();
    
    if (currentReportType === 'complete') {
        await generateCompletePDFReport();
    } else {
        await generateMissingPDFReport();
    }
}

async function generateCompletePDFReport() {
    const owned = Object.values(stickers).filter(s => s.have).length;
    const total = Object.keys(stickers).length;
    const repeated = Object.values(stickers).reduce((acc, s) => acc + s.repeated, 0);
    const percent = Math.round((owned / total) * 100) || 0;

    let html = `
        <div class="pdf-container">
            <div class="pdf-header">
                <div class="pdf-title">
                    <h1>Álbum Copa 2026</h1>
                    <p>Relatório de Coleção</p>
                </div>
                <div class="pdf-date">${new Date().toLocaleDateString()}</div>
            </div>

            <div class="pdf-stats">
                <div class="pdf-stat-card">
                    <span class="label">Progresso</span>
                    <span class="value">${percent}%</span>
                </div>
                <div class="pdf-stat-card">
                    <span class="label">Figurinhas</span>
                    <span class="value">${owned} / ${total}</span>
                </div>
                <div class="pdf-stat-card">
                    <span class="label">Repetidas</span>
                    <span class="value">${repeated}</span>
                </div>
            </div>
    `;

    TEAMS.forEach(team => {
        const teamStickers = Object.keys(stickers)
            .filter(id => id.startsWith(team.code))
            .map(id => ({ id, ...stickers[id] }));
        
        const myStickers = teamStickers.filter(s => s.have || s.repeated > 0);
        
        if (myStickers.length > 0) {
            html += `
                <div class="pdf-team-section">
                    <div class="pdf-team-header">
                        <span>${team.name}</span>
                        <span>${myStickers.filter(s => s.have).length} / ${team.stickers}</span>
                    </div>
                    <div class="pdf-sticker-list">
            `;

            myStickers.forEach(s => {
                let name = PLAYER_NAMES[s.team]?.[s.num - 1] || `Jogador ${s.num}`;
                if (s.num === 1 && s.team !== 'CC' && s.team !== 'FWC') name = 'Escudo';
                if (s.num === 13 && s.team !== 'CC' && s.team !== 'FWC') name = 'Time Completo';
                
                let statusText = s.have ? 'OK' : 'SÓ REP.';
                if (s.repeated > 0) statusText += ` (+${s.repeated})`;

                html += `
                    <div class="pdf-sticker-item ${s.have ? 'have' : ''} ${s.repeated > 0 ? 'repeated' : ''}">
                        <span><span class="num">#${s.num}</span> ${name}</span>
                        <span>${statusText}</span>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }
    });

    html += `
            <div class="pdf-footer">
                Gerado por Álbum Copa 2026 - Desenvolvido por Kevin
            </div>
        </div>
    `;

    reportTemplate.innerHTML = html;
    reportTemplate.style.display = 'block';

    const opt = {
        margin: 10,
        filename: `relatorio_copa2026_completo_${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(reportTemplate).save();
    } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        alert("Ocorreu um erro ao gerar o PDF. Verifique o console.");
    } finally {
        reportTemplate.style.display = 'none';
        reportTemplate.innerHTML = '';
    }
}

async function generateMissingPDFReport() {
    const missing = Object.values(stickers).filter(s => !s.have).length;
    const total = Object.keys(stickers).length;
    const owned = total - missing;
    const percent = Math.round((owned / total) * 100) || 0;

    let html = `
        <div class="pdf-container">
            <div class="pdf-header">
                <div class="pdf-title">
                    <h1>Álbum Copa 2026</h1>
                    <p>Figurinhas Faltantes</p>
                </div>
                <div class="pdf-date">${new Date().toLocaleDateString()}</div>
            </div>

            <div class="pdf-stats">
                <div class="pdf-stat-card">
                    <span class="label">Progresso</span>
                    <span class="value">${percent}%</span>
                </div>
                <div class="pdf-stat-card">
                    <span class="label">Faltando</span>
                    <span class="value">${missing}</span>
                </div>
                <div class="pdf-stat-card">
                    <span class="label">Tenho</span>
                    <span class="value">${owned}</span>
                </div>
            </div>
    `;

    TEAMS.forEach(team => {
        const teamStickers = Object.keys(stickers)
            .filter(id => id.startsWith(team.code))
            .map(id => ({ id, ...stickers[id] }));
        
        const missingStickers = teamStickers.filter(s => !s.have);
        
        if (missingStickers.length > 0) {
            html += `
                <div class="pdf-team-section">
                    <div class="pdf-team-header">
                        <span>${team.name}</span>
                        <span>Faltando ${missingStickers.length} / ${team.stickers}</span>
                    </div>
                    <div class="pdf-sticker-list">
            `;

            missingStickers.forEach(s => {
                let name = PLAYER_NAMES[s.team]?.[s.num - 1] || `Jogador ${s.num}`;
                if (s.num === 1 && s.team !== 'CC' && s.team !== 'FWC') name = 'Escudo';
                if (s.num === 13 && s.team !== 'CC' && s.team !== 'FWC') name = 'Time Completo';

                html += `
                    <div class="pdf-sticker-item">
                        <span><span class="num">#${s.num}</span> ${name}</span>
                        <span>❌</span>
                    </div>
                `;
            });

            html += `
                    </div>
                </div>
            `;
        }
    });

    html += `
            <div class="pdf-footer">
                Gerado por Álbum Copa 2026 - Desenvolvido por Kevin
            </div>
        </div>
    `;

    reportTemplate.innerHTML = html;
    reportTemplate.style.display = 'block';

    const opt = {
        margin: 10,
        filename: `relatorio_copa2026_faltantes_${new Date().getTime()}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
        await html2pdf().set(opt).from(reportTemplate).save();
    } catch (err) {
        console.error("Erro ao gerar PDF:", err);
        alert("Ocorreu um erro ao gerar o PDF. Verifique o console.");
    } finally {
        reportTemplate.style.display = 'none';
        reportTemplate.innerHTML = '';
    }
}

function generateTXTReport() {
    closeReportModalFunc();
    
    if (currentReportType === 'complete') {
        generateCompleteTXTReport();
    } else {
        generateMissingTXTReport();
    }
}

function generateCompleteTXTReport() {
    let report = "==========================================\n";
    report += "        ÁLBUM COPA DO MUNDO 2026        \n";
    report += "==========================================\n\n";
    report += `Data: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    
    const owned = Object.values(stickers).filter(s => s.have).length;
    const total = Object.keys(stickers).length;
    const repeated = Object.values(stickers).reduce((acc, s) => acc + s.repeated, 0);
    const percent = Math.round((owned/total)*100);
    
    report += `Progresso: ${owned} / ${total} [${percent}%]\n`;
    report += `Total de Repetidas: ${repeated}\n\n`;
    report += "------------------------------------------\n";
    report += "        MINHAS FIGURINHAS POR PAÍS        \n";
    report += "------------------------------------------\n";
    
    TEAMS.forEach(team => {
        const teamStickers = Object.keys(stickers)
            .filter(id => id.startsWith(team.code))
            .map(id => ({ id, ...stickers[id] }));
        
        const myStickers = teamStickers.filter(s => s.have || s.repeated > 0);
        
        if (myStickers.length > 0) {
            const teamOwned = myStickers.filter(s => s.have).length;
            report += `\n> ${team.name.toUpperCase()} (${teamOwned}/${team.stickers})\n`;
            
            myStickers.forEach(s => {
                let name = PLAYER_NAMES[s.team]?.[s.num - 1] || `Jogador ${s.num}`;
                if (s.num === 1 && s.team !== 'CC' && s.team !== 'FWC') name = 'Escudo';
                if (s.num === 13 && s.team !== 'CC' && s.team !== 'FWC') name = 'Time';
                
                let line = ` [#${s.num.toString().padStart(2, '0')}] ${name.padEnd(20)}`;
                if (s.have) line += " [X]"; else line += " [ ]";
                if (s.repeated > 0) line += ` (+${s.repeated} rep)`;
                
                report += line + "\n";
            });
        }
    });

    report += "\n\n==========================================\n";
    report += "   Gerado automaticamente pelo Álbum      \n";
    report += "==========================================\n";

    downloadTXTReport(report, 'completo');
}

function generateMissingTXTReport() {
    let report = "==========================================\n";
    report += "  FIGURINHAS FALTANTES - COPA 2026       \n";
    report += "==========================================\n\n";
    report += `Data: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}\n`;
    
    const owned = Object.values(stickers).filter(s => s.have).length;
    const total = Object.keys(stickers).length;
    const missing = total - owned;
    const percent = Math.round((owned/total)*100);
    
    report += `Progresso: ${owned} / ${total} [${percent}%]\n`;
    report += `Faltando: ${missing} figurinhas\n\n`;
    report += "------------------------------------------\n";
    report += "      FIGURINHAS QUE ESTÃO FALTANDO      \n";
    report += "------------------------------------------\n";
    
    TEAMS.forEach(team => {
        const teamStickers = Object.keys(stickers)
            .filter(id => id.startsWith(team.code))
            .map(id => ({ id, ...stickers[id] }));
        
        const missingStickers = teamStickers.filter(s => !s.have);
        
        if (missingStickers.length > 0) {
            report += `\n> ${team.name.toUpperCase()} (Faltando ${missingStickers.length}/${team.stickers})\n`;
            
            missingStickers.forEach(s => {
                let name = PLAYER_NAMES[s.team]?.[s.num - 1] || `Jogador ${s.num}`;
                if (s.num === 1 && s.team !== 'CC' && s.team !== 'FWC') name = 'Escudo';
                if (s.num === 13 && s.team !== 'CC' && s.team !== 'FWC') name = 'Time';
                
                let line = ` [#${s.num.toString().padStart(2, '0')}] ${name.padEnd(20)}`;
                line += " ❌";
                
                report += line + "\n";
            });
        }
    });

    report += "\n\n==========================================\n";
    report += "   Gerado automaticamente pelo Álbum      \n";
    report += "==========================================\n";

    downloadTXTReport(report, 'faltantes');
}

function downloadTXTReport(report, type) {
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_copa2026_${type}_${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function setupEventListeners() {
    closeReportModal.onclick = closeReportModalFunc;
    genPdfBtn.onclick = generatePDFReport;
    genTxtBtn.onclick = generateTXTReport;

    // Report Tab Listeners
    document.querySelectorAll('.report-tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.report-tab-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentReportType = btn.dataset.reportType;
        });
    });

    // Multi-Select Event Listeners
    multiSelectBtn.onclick = openMultiSelectModal;
    closeMultiSelect.onclick = closeMultiSelectModalFunc;
    closeMultiSelectBtn.onclick = closeMultiSelectModalFunc;
    selectAllBtn.onclick = selectAllStickers;
    deselectAllBtn.onclick = deselectAllStickers;
    markAsHaveBtn.onclick = applyHaveToSelected;
    markAsRepeatedBtn.onclick = applyRepeatedToSelected;
    multiSelectTeam.addEventListener('change', renderMultiSelectGrid);

    // Fechar modal clicando fora
    window.onclick = (event) => {
        if (event.target == reportModal) closeReportModalFunc();
        if (event.target == authModal) authModal.classList.add('hidden');
        if (event.target == multiSelectModal) closeMultiSelectModalFunc();
    };
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

// --- MULTI-SELECT FUNCTIONS ---
function openMultiSelectModal() {
    selectedStickers.clear();
    multiSelectTeam.value = '';
    multiSelectGrid.innerHTML = '';
    multiSelectModal.classList.remove('hidden');
    updateTeamOptions();
}

function closeMultiSelectModalFunc() {
    multiSelectModal.classList.add('hidden');
    selectedStickers.clear();
}

function updateTeamOptions() {
    multiSelectTeam.innerHTML = '<option value="">Selecione uma seleção...</option>';
    TEAMS.forEach(team => {
        const option = document.createElement('option');
        option.value = team.code;
        option.textContent = team.name;
        multiSelectTeam.appendChild(option);
    });
}

function renderMultiSelectGrid() {
    const teamCode = multiSelectTeam.value;
    if (!teamCode) {
        multiSelectGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999; padding: 2rem;">Selecione uma seleção acima</p>';
        return;
    }

    multiSelectGrid.innerHTML = '';
    const team = TEAMS.find(t => t.code === teamCode);
    if (!team) return;

    for (let num = 1; num <= team.stickers; num++) {
        const id = `${teamCode}-${num}`;
        const s = stickers[id];
        
        let playerName = PLAYER_NAMES[teamCode]?.[num - 1] || `${teamCode} - Jogador ${num}`;
        if (num === 1 && teamCode !== 'CC' && teamCode !== 'FWC') playerName = 'Escudo';
        if (num === 13 && teamCode !== 'CC' && teamCode !== 'FWC') playerName = 'Time';
        if (teamCode === 'CC') playerName = `Coca-Cola #${num}`;
        if (teamCode === 'FWC') playerName = `FIFA FWC #${num}`;

        const isSelected = selectedStickers.has(id);
        const stickerDiv = document.createElement('div');
        stickerDiv.className = `multi-select-sticker ${isSelected ? 'selected' : ''}`;
        stickerDiv.innerHTML = `
            <div class="multi-select-sticker-card">
                <div class="multi-select-sticker-team">${teamCode}</div>
                <div class="multi-select-sticker-number">#${num}</div>
                <div class="multi-select-sticker-name">${playerName}</div>
            </div>
            <div class="multi-select-sticker-checkbox">✓</div>
        `;
        stickerDiv.onclick = () => toggleStickerSelection(id);
        multiSelectGrid.appendChild(stickerDiv);
    }

    updateSelectionCount();
}

function toggleStickerSelection(id) {
    if (selectedStickers.has(id)) {
        selectedStickers.delete(id);
    } else {
        selectedStickers.add(id);
    }
    renderMultiSelectGrid();
}

function selectAllStickers() {
    const teamCode = multiSelectTeam.value;
    if (!teamCode) return;

    const team = TEAMS.find(t => t.code === teamCode);
    if (!team) return;

    for (let num = 1; num <= team.stickers; num++) {
        selectedStickers.add(`${teamCode}-${num}`);
    }
    renderMultiSelectGrid();
}

function deselectAllStickers() {
    selectedStickers.clear();
    renderMultiSelectGrid();
}

function updateSelectionCount() {
    const count = selectedStickers.size;
    multiSelectCount.textContent = `${count} figurinha${count !== 1 ? 's' : ''} selecionada${count !== 1 ? 's' : ''}`;
}

function applyHaveToSelected() {
    selectedStickers.forEach(id => {
        stickers[id].have = true;
        stickers[id].repeated = 0;
    });
    saveData();
    updateStats();
    renderGrid();
    selectedStickers.clear();
    renderMultiSelectGrid();
}

function applyRepeatedToSelected() {
    selectedStickers.forEach(id => {
        stickers[id].have = true;
        stickers[id].repeated++;
        if (stickers[id].repeated > 10) stickers[id].repeated = 0;
    });
    saveData();
    updateStats();
    renderGrid();
    selectedStickers.clear();
    renderMultiSelectGrid();
}

init();

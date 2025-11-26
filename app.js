// ===== FIREBASE CONFIG =====
const FIREBASE_CONFIG = {
    apiKey: 'AIzaSyBvl1IpLvI4z7r85TwqMqBmHKx7lTp_MnE',
    projectId: 'lidermaneu',
    authDomain: 'lidermaneu.firebaseapp.com',
    databaseURL: 'https://lidermaneu.firebaseio.com',
    storageBucket: 'lidermaneu.appspot.com',
    messagingSenderId: '651108137701',
    appId: '1:651108137701:web:0c3e0e0d0e0d0e0d0e0d0e'
};

// ===== STATE MANAGEMENT =====
const state = {
    user: null,
    incidencias: [],
    filteredIncidencias: [],
    currentPage: 'dashboard',
    currentKPI: 'facility',
    charts: {}
};

// ===== DOM ELEMENTS =====
const loginPage = document.getElementById('loginPage');
const dashboardPage = document.getElementById('dashboardPage');
const loginForm = document.getElementById('loginForm');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const notificationContainer = document.getElementById('notificationContainer');
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const imageModal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const modalClose = document.querySelector('.modal-close');
const navBtns = document.querySelectorAll('.nav-btn');
const kpiBtns = document.querySelectorAll('.kpi-btn');
const contentSections = document.querySelectorAll('.content');
const kpiContents = document.querySelectorAll('.kpi-content');

// ===== INITIALIZATION =====
async function initApp() {
    await initFirebase();
    setupEventListeners();
    checkAuth();
}

// ===== FIREBASE INIT =====
let db, auth;

async function initFirebase() {
    // Cargar Firebase SDK desde CDN
    if (!window.firebase) {
        console.error('Firebase no cargado desde CDN');
        return;
    }
    
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    auth = firebase.auth();
}

// ===== AUTHENTICATION =====
function checkAuth() {
    auth.onAuthStateChanged(user => {
        if (user) {
            state.user = user;
            showDashboard(user);
        } else {
            showLogin();
        }
    });
}

function showLogin() {
    loginPage.classList.add('active');
    dashboardPage.classList.remove('active');
}

function showDashboard(user) {
    loginPage.classList.remove('active');
    dashboardPage.classList.add('active');
    userName.textContent = user.displayName || user.email.split('@')[0];
    userEmail.textContent = user.email;
    loadIncidencias();
}

// ===== LOGIN HANDLER =====
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailInput.value;
    const password = passwordInput.value;
    loginError.textContent = '';

    try {
        await auth.signInWithEmailAndPassword(email, password);
        emailInput.value = '';
        passwordInput.value = '';
    } catch (error) {
        loginError.textContent = getErrorMessage(error.code);
        showNotification(getErrorMessage(error.code), 'error');
    }
});

function getErrorMessage(code) {
    const messages = {
        'auth/user-not-found': 'Usuario no encontrado',
        'auth/wrong-password': 'Contraseña incorrecta',
        'auth/invalid-email': 'Email inválido',
        'auth/user-disabled': 'Usuario deshabilitado',
        'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde'
    };
    return messages[code] || 'Error de autenticación';
}

logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        state.user = null;
        state.incidencias = [];
    } catch (error) {
        showNotification('Error al cerrar sesión', 'error');
    }
});

// ===== FIRESTORE DATA =====
async function loadIncidencias() {
    try {
        const snapshot = await db.collection('IncidenciasEU').get();
        state.incidencias = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAtFormatted: formatDate(doc.data().createdAt)
        }));
        
        state.filteredIncidencias = state.incidencias;
        updateIndicators();
        initializeCharts();
        renderTable();
    } catch (error) {
        console.error('Error cargando incidencias:', error);
        showNotification('Error al cargar datos', 'error');
    }
}

function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });
}

// ===== INDICATORS UPDATE =====
function updateIndicators() {
    const total = state.incidencias.length;
    const criticas = state.incidencias.filter(i => i.prioridad === 'CRITICA').length;
    const activas = state.incidencias.filter(i => i.estado === 'ABIERTO' || i.estado === 'EN_PROGRESO').length;
    const resueltas = state.incidencias.filter(i => i.estado === 'RESUELTO').length;

    document.querySelector('[data-indicator="total"]').textContent = total;
    document.querySelector('[data-indicator="criticas"]').textContent = criticas;
    document.querySelector('[data-indicator="activas"]').textContent = activas;
    document.querySelector('[data-indicator="resueltas"]').textContent = resueltas;
}

// ===== CHARTS =====
const CHART_COLORS = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe', '#43e97b', '#38f9d7'];

function initializeCharts() {
    initLineChart();
    initBarChart();
    initPieChart();
}

function initLineChart() {
    const datosAgrupadosPorFecha = {};
    
    state.incidencias.forEach(inc => {
        const fecha = inc.createdAtFormatted;
        if (!datosAgrupadosPorFecha[fecha]) {
            datosAgrupadosPorFecha[fecha] = 0;
        }
        datosAgrupadosPorFecha[fecha]++;
    });

    const fechas = Object.keys(datosAgrupadosPorFecha).sort().slice(-10);
    const datos = fechas.map(f => datosAgrupadosPorFecha[f]);

    const ctx = document.getElementById('lineChart').getContext('2d');
    
    if (state.charts.lineChart) {
        state.charts.lineChart.destroy();
    }

    state.charts.lineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: fechas,
            datasets: [{
                label: 'Incidencias',
                data: datos,
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                pointRadius: 6,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initBarChart() {
    const datosAgenteMap = {};
    
    state.incidencias.forEach(inc => {
        const agente = inc.nombreAgente || 'Sin asignar';
        if (!datosAgenteMap[agente]) {
            datosAgenteMap[agente] = 0;
        }
        datosAgenteMap[agente]++;
    });

    const agentes = Object.entries(datosAgenteMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(e => e[0]);
    
    const datos = agentes.map(a => datosAgenteMap[a]);

    const ctx = document.getElementById('barChart').getContext('2d');
    
    if (state.charts.barChart) {
        state.charts.barChart.destroy();
    }

    state.charts.barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: agentes,
            datasets: [{
                label: 'Incidencias',
                data: datos,
                backgroundColor: CHART_COLORS.slice(0, agentes.length),
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function initPieChart() {
    const datosMapPunto = {};
    
    state.incidencias.forEach(inc => {
        const punto = inc.punto || 'Sin punto';
        if (!datosMapPunto[punto]) {
            datosMapPunto[punto] = 0;
        }
        datosMapPunto[punto]++;
    });

    const puntos = Object.keys(datosMapPunto);
    const datos = puntos.map(p => datosMapPunto[p]);

    const ctx = document.getElementById('pieChart').getContext('2d');
    
    if (state.charts.pieChart) {
        state.charts.pieChart.destroy();
    }

    state.charts.pieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: puntos,
            datasets: [{
                data: datos,
                backgroundColor: CHART_COLORS.slice(0, puntos.length),
                borderColor: '#fff',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

// ===== TABLE =====
function renderTable() {
    tableBody.innerHTML = state.filteredIncidencias.map(inc => `
        <tr>
            <td>${inc.createdAtFormatted}</td>
            <td>${inc.nombreAgente || 'N/A'}</td>
            <td>${inc.punto || 'N/A'}</td>
            <td>${inc.observacion || 'N/A'}</td>
            <td>
                ${inc.evidenciaDataUrl ? `<img src="${inc.evidenciaDataUrl}" class="table-img" data-url="${inc.evidenciaDataUrl}">` : 'N/A'}
            </td>
        </tr>
    `).join('');

    // Add image click handlers
    document.querySelectorAll('.table-img').forEach(img => {
        img.addEventListener('click', () => {
            modalImage.src = img.dataset.url;
            imageModal.classList.add('active');
        });
    });
}

// ===== SEARCH =====
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    state.filteredIncidencias = state.incidencias.filter(inc => {
        return (
            (inc.nombreAgente && inc.nombreAgente.toLowerCase().includes(query)) ||
            (inc.punto && inc.punto.toLowerCase().includes(query)) ||
            (inc.observacion && inc.observacion.toLowerCase().includes(query))
        );
    });
    renderTable();
});

// ===== NAVIGATION =====
function setupEventListeners() {
    // Navigation buttons
    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const page = btn.dataset.page;
            switchPage(page);
            
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // KPI buttons
    kpiBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const kpi = btn.dataset.kpi;
            switchKPI(kpi);
            
            kpiBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Modal close
    modalClose.addEventListener('click', () => {
        imageModal.classList.remove('active');
    });

    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.remove('active');
        }
    });
}

function switchPage(pageName) {
    state.currentPage = pageName;
    
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    const targetSection = pageName === 'dashboard' 
        ? document.getElementById('dashboardContent') 
        : document.getElementById('tablaContent');
    
    if (targetSection) {
        targetSection.classList.add('active');
    }
}

function switchKPI(kpiName) {
    state.currentKPI = kpiName;
    
    kpiContents.forEach(content => {
        content.classList.remove('active');
    });
    
    const targetContent = kpiName === 'facility' 
        ? document.getElementById('kpiFacility') 
        : document.getElementById('kpiSecurity');
    
    if (targetContent) {
        targetContent.classList.add('active');
    }
}

// ===== NOTIFICATIONS =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== FIREBASE SDK LOADER =====
if (!window.firebase) {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
    document.head.appendChild(script);

    const script2 = document.createElement('script');
    script2.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
    document.head.appendChild(script2);

    const script3 = document.createElement('script');
    script3.src = 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';
    document.head.appendChild(script3);

    script3.addEventListener('load', () => {
        initApp();
    });
} else {
    initApp();
}

// --- DERS AYARLARI ---
const CONFIG = {
    pdfUrl: 'matematik_sorular.pdf',     // PDF dosyasının adı
    dataPrefix: 'matematik_data_',       // JSON dosyalarının ön eki
    chunkSize: 150                       // Konsoldaki sayı ile aynı olmalı!
};

// --- DEĞİŞKENLER ---
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.0; 
let canvas = document.getElementById('the-canvas');
let ctx = canvas.getContext('2d');

// Veri Havuzu
let loadedSolutions = {}; // İndirilen veriler burada birikir
let loadedChunks = [];    // Hangi paketlerin indiğini tutar
let currentAnswer = null;

// --- İÇİNDEKİLER ---
// Burayı kendi listene göre doldurabilirsin
const tocData = [
    { title: "İç Kapak", page: 1 },
    { title: "Künye", page: 2 },
    // ... Liste devamı ...
    { title: "Bitiş", page: 1093 }
];

// --- 1. AKILLI YÜKLEME SİSTEMİ ---
async function ensureSolutionLoaded(pNum) {
    // Sayfa 305 -> 3. Pakete denk gelir (305 / 150 = 2.03 -> tavanı 3)
    const chunkId = Math.ceil(pNum / CONFIG.chunkSize);
    
    // Eğer bu paket daha önce indirilmediyse indir
    if (!loadedChunks.includes(chunkId)) {
        try {
            const fileName = `${CONFIG.dataPrefix}${chunkId}.json`;
            console.log(`${fileName} yükleniyor...`);
            
            const response = await fetch(fileName);
            if (!response.ok) throw new Error("Dosya bulunamadı");
            
            const newData = await response.json();
            
            // Yeni verileri hafızaya ekle
            Object.assign(loadedSolutions, newData);
            loadedChunks.push(chunkId);
            console.log("Paket yüklendi.");
            
        } catch (error) {
            console.error("Veri yükleme hatası:", error);
        }
    }
}

// --- 2. PDF GÖRÜNTÜLEME ---
function renderPage(num) {
    pageRendering = true;
    
    // UI Sıfırla
    resetOpticForm();
    document.getElementById('pageInfo').innerText = `Sayfa: ${num}`;
    
    // Arka planda veriyi kontrol et (yoksa indir)
    ensureSolutionLoaded(num).then(() => {
        // Veri geldikten sonra cevabı ayarla
        if (loadedSolutions[num] && loadedSolutions[num].a) {
            currentAnswer = loadedSolutions[num].a;
        } else {
            currentAnswer = null;
        }
    });

    pdfDoc.getPage(num).then(function(page) {
        // PC ve Mobil için ölçekleme
        let currentScale = window.innerWidth < 768 ? 0.6 : scale;
        
        var viewport = page.getViewport({scale: currentScale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        page.render(renderContext).promise.then(function() {
            pageRendering = false;
            if (pageNumPending !== null) {
                renderPage(pageNumPending);
                pageNumPending = null;
            }
        });
    });
}

function queueRenderPage(num) {
    if (pageRendering) pageNumPending = num;
    else renderPage(num);
}

function changePage(offset) {
    if (pageNum + offset <= 0 || pageNum + offset > pdfDoc.numPages) return;
    pageNum += offset;
    queueRenderPage(pageNum);
}

function goToPage(num) {
    pageNum = num;
    queueRenderPage(pageNum);
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('tocPanel'));
    if(bsOffcanvas) bsOffcanvas.hide();
}

// --- 3. ARAYÜZ ---
function buildTOC() {
    const list = document.getElementById('tocList');
    if (typeof tocData !== 'undefined') {
        tocData.forEach(item => {
            const li = document.createElement('a');
            li.className = 'list-group-item list-group-item-action';
            li.innerHTML = `${item.title} <span class="page-badge">${item.page}</span>`;
            li.onclick = () => goToPage(item.page);
            list.appendChild(li);
        });
    }
}

function resetOpticForm() {
    document.querySelectorAll('.optik-btn').forEach(btn => {
        btn.className = 'btn btn-circle btn-light optik-btn';
    });
}

document.querySelectorAll('.optik-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (!currentAnswer && !loadedSolutions[pageNum]) {
            alert("Veriler yükleniyor, lütfen bekleyin...");
            return;
        }
        if (!currentAnswer) {
            alert("Bu sayfa için cevap anahtarı yok.");
            return;
        }

        const selected = this.getAttribute('data-opt');
        resetOpticForm();

        if (selected === currentAnswer) {
            this.classList.remove('btn-light');
            this.classList.add('btn-success-opt');
        } else {
            this.classList.remove('btn-light');
            this.classList.add('btn-danger-opt');
            
            const correctBtn = document.querySelector(`.optik-btn[data-opt="${currentAnswer}"]`);
            if(correctBtn) {
                correctBtn.classList.remove('btn-light');
                correctBtn.classList.add('btn-success-opt');
            }
        }
    });
});

async function showSolution() {
    const contentDiv = document.getElementById('solutionContent');
    const panel = new bootstrap.Offcanvas(document.getElementById('solutionPanel'));
    
    panel.show();
    contentDiv.innerHTML = `<div class="text-center mt-5"><div class="spinner-border text-primary"></div><p>Yükleniyor...</p></div>`;

    await ensureSolutionLoaded(pageNum);

    if (loadedSolutions[pageNum] && loadedSolutions[pageNum].c) {
        contentDiv.innerHTML = loadedSolutions[pageNum].c;
        if(window.MathJax) MathJax.typesetPromise([contentDiv]);
    } else {
        contentDiv.innerHTML = `<div class="alert alert-warning">Bu sayfa için çözüm bulunamadı.</div>`;
    }
}

// --- BAŞLAT ---
pdfjsLib.getDocument(CONFIG.pdfUrl).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    buildTOC();
    renderPage(pageNum);
});

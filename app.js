// --- DERS AYARLARI ---
const CONFIG = {
    pdfUrl: 'matematik_sorular.pdf',     // PDF dosyasının tam adı (Büyük/küçük harfe dikkat!)
    dataPrefix: 'matematik_data_',       // JSON parçalarının ön eki
    chunkSize: 150                       // JSON oluştururken kullandığın sayı (150 yapmıştık)
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
let loadedSolutions = {}; 
let loadedChunks = [];    
let currentAnswer = null;

// --- İÇİNDEKİLER ---
const tocData = [
    { title: "İç Kapak", page: 1 },
    { title: "Bitiş", page: 1093 }
    // Buraya kendi listeni ekle
];

// --- 1. AKILLI YÜKLEME SİSTEMİ (JSON) ---
async function ensureSolutionLoaded(pNum) {
    const chunkId = Math.ceil(pNum / CONFIG.chunkSize);
    
    if (!loadedChunks.includes(chunkId)) {
        try {
            // Örn: matematik_data_1.json dosyasını çağırır
            const fileName = `${CONFIG.dataPrefix}${chunkId}.json`;
            console.log(`${fileName} yükleniyor...`);
            
            const response = await fetch(fileName);
            if (!response.ok) throw new Error(`Dosya bulunamadı: ${fileName}`);
            
            const newData = await response.json();
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
    
    // Veriyi kontrol et
    ensureSolutionLoaded(num).then(() => {
        if (loadedSolutions[num] && loadedSolutions[num].a) {
            currentAnswer = loadedSolutions[num].a;
        } else {
            currentAnswer = null;
        }
    });

    // PDF Yükleme
    pdfDoc.getPage(num).then(function(page) {
        let currentScale = window.innerWidth < 768 ? 0.6 : scale;
        var viewport = page.getViewport({scale: currentScale});
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        var renderContext = {
            canvasContext: ctx,
            viewport: viewport
        };
        
        var renderTask = page.render(renderContext);
        renderTask.promise.then(function() {
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

// --- 3. ARAYÜZ FONKSİYONLARI ---
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
            alert("Veriler yükleniyor..."); return;
        }
        if (!currentAnswer) {
            alert("Cevap anahtarı yok."); return;
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
        contentDiv.innerHTML = `<div class="alert alert-warning">Çözüm bulunamadı.</div>`;
    }
}

// --- BAŞLATMA ---
// PDF adını buradan okuyup başlatıyor
pdfjsLib.getDocument(CONFIG.pdfUrl).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    buildTOC();
    renderPage(pageNum);
}).catch(function(error) {
    console.error("PDF Yüklenemedi! Dosya ismini kontrol et:", error);
    alert("PDF dosyası bulunamadı. Lütfen dosya isminin 'matematik_sorular.pdf' olduğundan emin olun.");
});

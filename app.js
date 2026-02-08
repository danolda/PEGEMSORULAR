// --- DERS YAPILANDIRMASI ---
// Yeni ders eklerken buraya eklemen yeterli
const SUBJECTS = {
    matematik: {
        title: "Matematik Soru Bankası",
        pdfUrl: "matematik_sorular.pdf",
        dataPrefix: "matematik_data_",
        chunkSize: 150
    },
    turkce: {
        title: "Türkçe Soru Bankası",
        pdfUrl: "turkce_sorular.pdf", // Yarın ekleyince burayı aktif edersin
        dataPrefix: "turkce_data_",
        chunkSize: 150
    },
    // Diğerleri...
    tarih: { pdfUrl: "tarih_sorular.pdf", dataPrefix: "tarih_data_", title: "Tarih", chunkSize: 150 },
    cografya: { pdfUrl: "cografya_sorular.pdf", dataPrefix: "cografya_data_", title: "Coğrafya", chunkSize: 150 },
    vatandaslik: { pdfUrl: "vatandaslik_sorular.pdf", dataPrefix: "vatandaslik_data_", title: "Vatandaşlık", chunkSize: 150 },
};

// --- GLOBAL DEĞİŞKENLER ---
let currentConfig = null; // Şu an seçili dersin ayarları
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.0; // Standart boyut (Zoom yok)
let canvas = document.getElementById('the-canvas');
let ctx = canvas.getContext('2d');

let loadedSolutions = {};
let loadedChunks = [];
let currentAnswer = null;

// --- İÇİNDEKİLER DATASI (Matematik için) ---
// İleride burayı da derse göre değiştirebiliriz
const tocData = [
    { title: "İç Kapak", page: 1 },
    { title: "Doğal Sayılar", page: 4 },
    { title: "Bitiş", page: 1093 }
    // Kendi tam listeni buraya koy
];

// --- 1. DERS SEÇİMİ VE BAŞLATMA ---
function loadSubject(subjectKey) {
    const config = SUBJECTS[subjectKey];
    
    // Eğer dosya henüz yoksa uyarı ver (Matematik hariç diğerleri için)
    // if (subjectKey !== 'matematik') { alert("Bu ders henüz eklenmedi. Yarın hazır olacak! 🛠️"); return; }
    
    currentConfig = config;
    
    // Ekranları değiştir
    document.getElementById('main-menu').classList.add('d-none');
    document.getElementById('solver-view').classList.remove('d-none');
    document.getElementById('bookTitle').innerText = config.title;

    // Değişkenleri sıfırla
    loadedSolutions = {};
    loadedChunks = [];
    pageNum = 1;

    // PDF'i yükle
    loadPDF(config.pdfUrl);
}

function returnToMenu() {
    document.getElementById('main-menu').classList.remove('d-none');
    document.getElementById('solver-view').classList.add('d-none');
    if(pdfDoc) {
        pdfDoc.destroy(); // Hafızayı temizle
        pdfDoc = null;
    }
}

// --- 2. PDF YÜKLEME ---
function loadPDF(url) {
    pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        buildTOC();
        renderPage(pageNum);
    }).catch(function(error) {
        console.error(error);
        alert("PDF dosyası bulunamadı: " + url);
        returnToMenu();
    });
}

// --- 3. VERİ YÜKLEME (JSON) ---
async function ensureSolutionLoaded(pNum) {
    if (!currentConfig) return;
    
    const chunkId = Math.ceil(pNum / currentConfig.chunkSize);
    if (!loadedChunks.includes(chunkId)) {
        try {
            const fileName = `${currentConfig.dataPrefix}${chunkId}.json`;
            const response = await fetch(fileName);
            if (!response.ok) throw new Error("Dosya yok");
            const newData = await response.json();
            Object.assign(loadedSolutions, newData);
            loadedChunks.push(chunkId);
        } catch (error) { console.error("Veri yüklenemedi:", error); }
    }
}

// --- 4. GÖRÜNTÜLEME (NETLİK & ZOOM AYARI) ---
function renderPage(num) {
    pageRendering = true;
    resetOpticForm();
    document.getElementById('pageInfo').innerText = `Sayfa: ${num}`;

    ensureSolutionLoaded(num).then(() => {
        currentAnswer = (loadedSolutions[num] && loadedSolutions[num].a) ? loadedSolutions[num].a : null;
    });

    pdfDoc.getPage(num).then(function(page) {
        // --- KRİTİK NETLİK AYARI ---
        // 1. Cihazın piksel yoğunluğunu al (Retina ekranlar için 2x, 3x)
        var dpr = window.devicePixelRatio || 1;
        
        // 2. Ekranda görünecek boyut (Scale 1.0 = %100 boyut)
        // Mobilde biraz küçültelim ki taşmasın
        var displayScale = window.innerWidth < 768 ? 0.6 : scale;
        
        var viewport = page.getViewport({scale: displayScale});

        // 3. Canvas'ın GERÇEK (Buffer) boyutunu yüksek çözünürlük yap
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);

        // 4. Canvas'ın CSS (Görünür) boyutunu normal ekran boyutuna sabitle
        // Bu sayede PDF devasa görünmez ama çok net olur (Sıkıştırılmış piksel)
        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        var renderContext = {
            canvasContext: ctx,
            viewport: viewport,
            transform: [dpr, 0, 0, dpr, 0, 0] // Ölçekleme matrisi
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
    if (pageRendering) pageNumPending = num; else renderPage(num);
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

// --- 5. MENÜ VE DİĞERLERİ ---
function buildTOC() {
    const list = document.getElementById('index_list');
    list.innerHTML = ""; 
    tocData.forEach(item => {
        const html = `
            <a class="d-flex flex-row text-decoration-none text-dark py-2" style="cursor:pointer" onclick="goToPage(${item.page})">
                <span class="flex-grow-1 d-flex align-items-center justify-content-start text-dark">${item.title}</span>
                <div class="flex-shrink-1 fw-bold fs-5 text-primary">${item.page}</div>
            </a>`;
        const li = document.createElement('li');
        li.className = 'list-group-item index-item';
        li.innerHTML = html;
        list.appendChild(li);
    });
}

function filterTOC(input) {
    const filter = input.value.toUpperCase();
    const ul = document.getElementById("index_list");
    const li = ul.getElementsByTagName("li");
    for (let i = 0; i < li.length; i++) {
        const text = li[i].textContent || li[i].innerText;
        li[i].style.display = text.toUpperCase().indexOf(filter) > -1 ? "" : "none";
    }
}

function resetOpticForm() {
    document.querySelectorAll('.optik-btn').forEach(btn => btn.className = 'btn btn-circle btn-light optik-btn');
}
document.querySelectorAll('.optik-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (!currentAnswer && !loadedSolutions[pageNum]) { alert("Yükleniyor..."); return; }
        if (!currentAnswer) { alert("Cevap anahtarı yok."); return; }
        const selected = this.getAttribute('data-opt');
        resetOpticForm();
        if (selected === currentAnswer) {
            this.classList.remove('btn-light'); this.classList.add('btn-success-opt');
        } else {
            this.classList.remove('btn-light'); this.classList.add('btn-danger-opt');
            const correct = document.querySelector(`.optik-btn[data-opt="${currentAnswer}"]`);
            if(correct) { correct.classList.remove('btn-light'); correct.classList.add('btn-success-opt'); }
        }
    });
});
async function showSolution() {
    const content = document.getElementById('solutionContent');
    const panel = new bootstrap.Offcanvas(document.getElementById('solutionPanel'));
    panel.show();
    content.innerHTML = `<div class="text-center mt-5"><div class="spinner-border"></div></div>`;
    await ensureSolutionLoaded(pageNum);
    if (loadedSolutions[pageNum] && loadedSolutions[pageNum].c) {
        content.innerHTML = loadedSolutions[pageNum].c;
        if(window.MathJax) MathJax.typesetPromise([content]);
    } else { content.innerHTML = `<div class="alert alert-warning">Çözüm bulunamadı.</div>`; }
}

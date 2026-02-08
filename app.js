// --- DERS AYARLARI ---
const CONFIG = {
    pdfUrl: 'matematik_sorular.pdf',
    dataPrefix: 'matematik_data_',
    chunkSize: 150
};


// --- DEĞİŞKENLER ---
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.5; // NETLİK İÇİN: Temel ölçeği artırdık (Eskiden 1.0 idi)
let canvas = document.getElementById('the-canvas');
let ctx = canvas.getContext('2d');

let loadedSolutions = {}; 
let loadedChunks = [];    
let currentAnswer = null;

// --- İÇİNDEKİLER VERİSİ (SENİN LİSTEN) ---
const tocData = [
    { title: "İç Kapak", page: 1 },
    { title: "Künye", page: 2 },
    { title: "Önsöz", page: 3 },
    { title: "Doğal Sayı - Tam Sayı - 1", page: 4 },
    { title: "Doğal Sayı - Tam Sayı - 2", page: 24 },
    { title: "Tek Sayı - Çift Sayı - Pozitif Sayı", page: 43 },
    { title: "Ardışık Sayılar", page: 62 },
    { title: "Basamak Analizi - Çözümleme", page: 81 },
    { title: "Asal Sayı - Asal Çarpanlar", page: 100 },
    { title: "Bölme - Bölünebilme", page: 119 },
    { title: "EBOB - EKOK", page: 138 },
    { title: "Rasyonel Sayılar", page: 157 },
    { title: "Ondalık Sayılar", page: 176 },
    { title: "1. Dereceden Denklemler", page: 195 },
    { title: "Eşitsizlik", page: 214 },
    { title: "Mutlak Değer", page: 233 },
    { title: "Üslü İfadeler", page: 252 },
    { title: "Köklü İfadeler", page: 271 },
    { title: "Çarpanlara Ayırma - 1", page: 290 },
    { title: "Çarpanlara Ayırma - 2", page: 309 },
    { title: "Oran - Orantı - 1", page: 328 },
    { title: "Oran - Orantı - 2", page: 347 },
    { title: "Denklem Kurma Problemleri - 1", page: 366 },
    { title: "Denklem Kurma Problemleri - 2", page: 385 },
    { title: "Kesir Problemleri", page: 404 },
    { title: "Yaş Problemleri", page: 423 },
    { title: "Yüzde - Faiz Problemleri", page: 442 },
    { title: "Kâr - Zarar Problemleri", page: 461 },
    { title: "Karışım Problemleri", page: 480 },
    { title: "İşçi - Havuz Problemleri", page: 499 },
    { title: "Hareket Problemleri", page: 518 },
    { title: "Kümeler", page: 537 },
    { title: "Fonksiyonlar", page: 556 },
    { title: "İşlem", page: 575 },
    { title: "Modüler Aritmetik", page: 594 },
    { title: "Permütasyon - Kombinasyon", page: 613 },
    { title: "Olasılık", page: 632 },
    { title: "Tablo - Grafik Yorumlama - 1", page: 651 },
    { title: "Tablo - Grafik Yorumlama - 2", page: 665 },
    { title: "Tablo - Grafik Yorumlama - 3", page: 680 },
    { title: "Sayısal Mantık - 1", page: 693 },
    { title: "Sayısal Mantık - 2", page: 710 },
    { title: "Sayısal Mantık - 3", page: 728 },
    { title: "Sayısal Mantık - 4", page: 739 },
    { title: "Doğruda Açı", page: 754 },
    { title: "Üçgende Açı", page: 771 },
    { title: "Üçgende Açı - Kenar Bağıntıları", page: 788 },
    { title: "Dik Üçgen", page: 805 },
    { title: "Özel Üçgenler", page: 822 },
    { title: "Üçgende Alan", page: 839 },
    { title: "Üçgende Açıortay - Kenarortay", page: 856 },
    { title: "Üçgende Benzerlik", page: 873 },
    { title: "Üçgende Benzerlik ve Alan", page: 890 },
    { title: "Çokgenler - Dörtgenler", page: 907 },
    { title: "Paralelkenar - Eşkenar Dörtgen", page: 924 },
    { title: "Dikdörtgen", page: 941 },
    { title: "Kare", page: 958 },
    { title: "Yamuk - Deltoid", page: 975 },
    { title: "Çemberde Açı", page: 992 },
    { title: "Çemberde Uzunluk", page: 1009 },
    { title: "Dairede Alan", page: 1026 },
    { title: "Analitik Geometri - 1", page: 1043 },
    { title: "Analitik Geometri - 2", page: 1060 },
    { title: "Katı Cisim", page: 1077 }
];

// --- 1. VERİ YÜKLEME ---
async function ensureSolutionLoaded(pNum) {
    const chunkId = Math.ceil(pNum / CONFIG.chunkSize);
    if (!loadedChunks.includes(chunkId)) {
        try {
            const fileName = `${CONFIG.dataPrefix}${chunkId}.json`;
            const response = await fetch(fileName);
            if (!response.ok) throw new Error("Dosya yok");
            const newData = await response.json();
            Object.assign(loadedSolutions, newData);
            loadedChunks.push(chunkId);
        } catch (error) { console.error(error); }
    }
}

// --- 2. PDF GÖRÜNTÜLEME (NETLİK AYARLI) ---
function renderPage(num) {
    pageRendering = true;
    resetOpticForm();
    document.getElementById('pageInfo').innerText = `Sayfa: ${num}`;
    
    ensureSolutionLoaded(num).then(() => {
        currentAnswer = (loadedSolutions[num] && loadedSolutions[num].a) ? loadedSolutions[num].a : null;
    });

    pdfDoc.getPage(num).then(function(page) {
        // NETLİK AYARI: Cihazın piksel yoğunluğunu al (Retina ekranlar için 2x, 3x)
        var dpr = window.devicePixelRatio || 1;
        
        // Mobilde biraz daha küçük, PC'de büyük ölçek
        var userScale = window.innerWidth < 768 ? 0.8 : scale;
        
        // Canvas boyutunu DPR ile çarp (Yüksek çözünürlük)
        var viewport = page.getViewport({scale: userScale * dpr});
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        // CSS ile ekrana sığdır (Pikseller sıkışır, görüntü netleşir)
        // Burada viewport.width / dpr yaparak orijinal CSS boyutuna geri dönüyoruz
        canvas.style.width = (viewport.width / dpr) + 'px';
        canvas.style.height = (viewport.height / dpr) + 'px';

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

// --- 3. YENİ İÇİNDEKİLER VE ARAMA SİSTEMİ ---
function buildTOC() {
    const list = document.getElementById('index_list');
    list.innerHTML = ""; // Temizle

    tocData.forEach(item => {
        // Kullanıcının istediği orijinal HTML yapısı
        const html = `
            <a class="d-flex flex-row text-decoration-none text-dark py-2" style="cursor:pointer" onclick="goToPage(${item.page})">
                <span class="flex-grow-1 d-flex align-items-center justify-content-start text-dark">
                    ${item.title}
                </span>
                <div class="flex-shrink-1 d-flex align-items-center justify-content-start fw-bold fs-5 text-primary">
                    ${item.page}
                </div>
            </a>
        `;
        
        const li = document.createElement('li');
        li.className = 'list-group-item index-item';
        li.innerHTML = html;
        list.appendChild(li);
    });
}

// Arama Filtreleme Fonksiyonu
function filterTOC(input) {
    const filter = input.value.toUpperCase();
    const ul = document.getElementById("index_list");
    const li = ul.getElementsByTagName("li");

    for (let i = 0; i < li.length; i++) {
        const text = li[i].textContent || li[i].innerText;
        if (text.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

// --- 4. OPTİK FORM VE ÇÖZÜMLER ---
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

// --- BAŞLATMA ---
pdfjsLib.getDocument(CONFIG.pdfUrl).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    buildTOC();
    renderPage(pageNum);
}).catch(e => { console.error(e); alert("PDF Yüklenemedi! Dosya adını kontrol edin."); });

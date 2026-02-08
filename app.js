// --- AYARLAR ---
const PDF_URL = 'sorular.pdf';
const SOLUTIONS_URL = 'cozumler.html';

// --- DEĞİŞKENLER ---
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.2; // Yakınlaştırma oranı
let canvas = document.getElementById('the-canvas');
let ctx = canvas.getContext('2d');
let solutionsMap = {}; // Sayfa No -> Çözüm İçeriği eşleşmesi
let currentAnswer = null; // O anki sayfanın doğru cevabı

// --- İÇİNDEKİLER VERİSİ (Senin verdiğin listeden alındı) ---
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

// --- 1. ÇÖZÜMLERİ YÜKLE VE PARSE ET ---
async function loadSolutions() {
    try {
        const response = await fetch(SOLUTIONS_URL);
        const text = await response.text();
        
        // HTML'i geçici bir DOM elemanına atıp parse edelim
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        const cards = doc.querySelectorAll('.result-card');

        cards.forEach(card => {
            // Sayfa numarasını bul (Örn: "Sayfa 5" yazan yerden)
            const pageText = card.querySelector('.q-image div').innerText; // "Sayfa 5"
            const pNum = parseInt(pageText.replace(/\D/g, '')); // Sadece sayıyı al -> 5
            
            // Cevabı bul (DOĞRU ŞIK: A)
            let ans = null;
            const badge = card.querySelector('.badge-answer');
            if (badge) {
                ans = badge.innerText.split(': ')[1].trim(); // "DOĞRU ŞIK: A" -> "A"
            }

            // İçeriği al
            const content = card.querySelector('.q-content').innerHTML;

            solutionsMap[pNum] = {
                html: content,
                answer: ans
            };
        });
        console.log("Çözümler Yüklendi. Toplam:", Object.keys(solutionsMap).length);
        
    } catch (error) {
        console.error("Çözümler yüklenemedi:", error);
    }
}

// --- 2. PDF GÖRÜNTÜLEME ---
function renderPage(num) {
    pageRendering = true;
    
    // Optik formu sıfırla
    resetOpticForm();
    
    // Sayfa bilgisini güncelle
    document.getElementById('pageInfo').innerText = `Sayfa: ${num}`;
    
    // Doğru cevabı güncelle
    if(solutionsMap[num]) {
        currentAnswer = solutionsMap[num].answer;
    } else {
        currentAnswer = null;
    }

    pdfDoc.getPage(num).then(function(page) {
        var viewport = page.getViewport({scale: scale});
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
    if (pageRendering) {
        pageNumPending = num;
    } else {
        renderPage(num);
    }
}

function changePage(offset) {
    if (pageNum + offset <= 0 || pageNum + offset > pdfDoc.numPages) return;
    pageNum += offset;
    queueRenderPage(pageNum);
}

function goToPage(num) {
    pageNum = num;
    queueRenderPage(pageNum);
    // Mobilde menüyü kapat
    const bsOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('tocPanel'));
    if(bsOffcanvas) bsOffcanvas.hide();
}

// --- 3. ARAYÜZ FONKSİYONLARI ---

// İçindekileri Oluştur
function buildTOC() {
    const list = document.getElementById('tocList');
    tocData.forEach(item => {
        const li = document.createElement('a');
        li.className = 'list-group-item list-group-item-action';
        li.innerHTML = `${item.title} <span class="page-badge">${item.page}</span>`;
        li.onclick = () => goToPage(item.page);
        list.appendChild(li);
    });
}

// Optik Form İşlemleri
function resetOpticForm() {
    document.querySelectorAll('.optik-btn').forEach(btn => {
        btn.className = 'btn btn-circle btn-light optik-btn'; // Reset classes
        btn.disabled = false;
    });
}

document.querySelectorAll('.optik-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        if (!currentAnswer) {
            alert("Bu sayfa için sistemde kayıtlı cevap anahtarı yok (veya konu anlatımı).");
            return;
        }

        const selected = this.getAttribute('data-opt');
        
        // Önce hepsini pasif yap
        // document.querySelectorAll('.optik-btn').forEach(b => b.disabled = true);

        if (selected === currentAnswer) {
            this.classList.remove('btn-light');
            this.classList.add('btn-success-opt'); // Doğru (Yeşil)
        } else {
            this.classList.remove('btn-light');
            this.classList.add('btn-danger-opt'); // Yanlış (Kırmızı)
            
            // Doğruyu da göster
            const correctBtn = document.querySelector(`.optik-btn[data-opt="${currentAnswer}"]`);
            if(correctBtn) {
                correctBtn.classList.remove('btn-light');
                correctBtn.classList.add('btn-success-opt');
            }
        }
    });
});

// Çözümü Göster (Sağ Panel)
function showSolution() {
    const contentDiv = document.getElementById('solutionContent');
    const panel = new bootstrap.Offcanvas(document.getElementById('solutionPanel'));
    
    if (solutionsMap[pageNum]) {
        contentDiv.innerHTML = solutionsMap[pageNum].html;
        // MathJax'i tekrar çalıştır (yeni içerik için)
        if(window.MathJax) {
            MathJax.typesetPromise([contentDiv]);
        }
    } else {
        contentDiv.innerHTML = `<div class="alert alert-warning">Bu sayfa için çözüm bulunamadı veya bu sayfa bir soru sayfası değil.</div>`;
    }
    
    panel.show();
}

// --- BAŞLATMA ---
// PDF'i yükle
pdfjsLib.getDocument(PDF_URL).promise.then(function(pdfDoc_) {
    pdfDoc = pdfDoc_;
    renderPage(pageNum);
});

// Diğerlerini yükle
loadSolutions();
buildTOC();

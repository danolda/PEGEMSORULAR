// --- DERS YAPILANDIRMASI ---
const SUBJECTS = {
    matematik: {
        title: "Matematik Soru Bankası",
        pdfUrl: "matematik_sorular.pdf",
        dataPrefix: "matematik_data_",
        chunkSize: 150
    },
    turkce: {
        title: "Türkçe Soru Bankası",
        pdfUrl: "turkce_sorular.pdf",
        dataPrefix: "turkce_data_",
        chunkSize: 150
    },
    tarih: { 
        title: "Tarih Soru Bankası",
        pdfUrl: "tarih_sorular.pdf", 
        dataPrefix: "tarih_data_", 
        chunkSize: 150 
    },
    cografya: { 
        title: "Coğrafya Soru Bankası",
        pdfUrl: "cografya_sorular.pdf", 
        dataPrefix: "cografya_data_", 
        chunkSize: 150 
    },
    vatandaslik: { 
        title: "Vatandaşlık Soru Bankası",
        pdfUrl: "vatandaslik_sorular.pdf", 
        dataPrefix: "vatandaslik_data_", 
        chunkSize: 150 
    },
};

// --- İÇİNDEKİLER VERİ HAVUZU (Tüm Dersler) ---
const ALL_TOC_DATA = {
    vatandaslik: [
        { title: "İç Kapak", page: 1 }, { title: "Künye", page: 2 }, { title: "Ön Söz", page: 3 },
        { title: "Hukukun Temel Kavramları - 1", page: 4 }, { title: "Hukukun Temel Kavramları - 2", page: 22 },
        { title: "Hukukun Temel Kavramları - 3", page: 40 }, { title: "Anayasa Tarihi ve Temel Kavramlar - 1", page: 57 },
        { title: "Anayasa Tarihi ve Temel Kavramlar - 2", page: 74 }, { title: "Anayasa Tarihi ve Temel Kavramlar - 3", page: 91 },
        { title: "1982 Anayasası ve Temel İlkeleri - 1", page: 107 }, { title: "1982 Anayasası ve Temel İlkeleri - 2", page: 124 },
        { title: "Temel Hak ve Hürriyetler", page: 140 }, { title: "Yasama - 1", page: 157 },
        { title: "Yasama - 2", page: 173 }, { title: "Yasama - 3", page: 190 },
        { title: "Yürütme - 1", page: 206 }, { title: "Yürütme - 2", page: 223 },
        { title: "Yürütme - 3", page: 240 }, { title: "Yürütme - 4", page: 257 },
        { title: "Yargı - 1", page: 274 }, { title: "Yargı - 2", page: 290 },
        { title: "İdare Hukuku - 1", page: 306 }, { title: "İdare Hukuku - 2", page: 322 },
        { title: "İdare Hukuku - 3", page: 338 }, { title: "İdare Hukuku - 4", page: 355 },
        { title: "Uluslararası Örgütler", page: 372 }, { title: "İnsan Hakları", page: 388 },
        { title: "Karma Test - 1", page: 401 }, { title: "Karma Test - 2", page: 417 },
        { title: "Karma Test - 3", page: 433 }, { title: "Karma Test - 4", page: 449 },
        { title: "Karma Test - 5", page: 465 }, { title: "Karma Test - 6", page: 481 },
        { title: "Deneme - 1", page: 497 }, { title: "Deneme - 2", page: 513 }
    ],
    cografya: [
        { title: "İç Kapak", page: 1 }, { title: "Künye", page: 2 }, { title: "Ön Söz", page: 3 },
        { title: "Türkiye’nin Matematik ve Özel Konumu - 1", page: 4 }, { title: "Türkiye’nin Matematik ve Özel Konumu - 2", page: 21 },
        { title: "Türkiye’nin Matematik ve Özel Konumu - 3", page: 40 }, { title: "Türkiye’nin Matematik ve Özel Konumu - 4", page: 56 },
        { title: "Türkiye’de Dağlar", page: 70 }, { title: "Türkiye’nin Ovaları ve Platoları", page: 87 },
        { title: "Türkiye’nin Akarsuları - 1", page: 105 }, { title: "Türkiye’nin Akarsuları - 2", page: 122 },
        { title: "Türkiye’nin Diğer Yer Şekilleri", page: 138 }, { title: "Türkiye’nin Yer Altı Su Kaynakları, Göller - 1", page: 155 },
        { title: "Türkiye’nin Yer Altı Su Kaynakları, Göller - 2", page: 172 }, { title: "Türkiye’de Erozyon, Heyelan ve Toprak - 1", page: 188 },
        { title: "Türkiye’de Erozyon, Heyelan ve Toprak - 2", page: 206 }, { title: "Türkiye’de Yer Şekilleri - Tarama 1", page: 220 },
        { title: "Türkiye’de Yer Şekilleri - Tarama 2", page: 238 }, { title: "Türkiye’de Yer Şekilleri - Tarama 3", page: 255 },
        { title: "Türkiye’de İklim Elemanları", page: 272 }, { title: "Türkiye’nin İklimi ve Bitki Örtüsü - 1", page: 287 },
        { title: "Türkiye’nin İklimi ve Bitki Örtüsü - 2", page: 304 }, { title: "Türkiye’nin İklim ve Bitki Örtüsü - Tarama 1", page: 315 },
        { title: "Türkiye’nin İklim ve Bitki Örtüsü - Tarama 2", page: 335 }, { title: "Türkiye’nin Fiziki Coğrafyası Karma - 1", page: 356 },
        { title: "Türkiye’nin Fiziki Coğrafyası Karma - 2", page: 371 }, { title: "Türkiye’de Nüfus Özellikleri", page: 385 },
        { title: "Türkiye’de Şehirler, Göçler ve Yerleşme", page: 400 }, { title: "Türkiye’de Nüfus ve Yerleşme - Tarama 1", page: 419 },
        { title: "Türkiye’de Nüfus ve Yerleşme - Tarama 2", page: 433 }, { title: "Türkiye’de Nüfus ve Yerleşme - Tarama 3", page: 452 },
        { title: "Türkiye’de Tarım", page: 474 }, { title: "Türkiye’de Tarım ve Hayvancılık", page: 491 },
        { title: "Tarım ve Hayvancılık - Tarama 1", page: 508 }, { title: "Tarım ve Hayvancılık - Tarama 2", page: 528 },
        { title: "Türkiye’de Sanayi, Ticaret ve Ormancılık", page: 546 }, { title: "Türkiye’de Madenler ve Enerji Kaynakları", page: 563 },
        { title: "Türkiye’de Turizm ve Ulaşım", page: 582 }, { title: "Ekonomik Coğrafya - Tarama 1", page: 600 },
        { title: "Ekonomik Coğrafya - Tarama 2", page: 617 }, { title: "Türkiye’nin Kıyı Bölgeleri - Tarama 1", page: 637 },
        { title: "Türkiye’nin Kıyı Bölgeleri - Tarama 2", page: 657 }, { title: "Türkiye’nin İç Bölgeleri - Tarama", page: 675 },
        { title: "Grafik ve Tablo Yorumu", page: 696 }, { title: "Genel Tarama Testi - 1", page: 705 },
        { title: "Genel Tarama Testi - 2", page: 730 }, { title: "Deneme - 1", page: 756 },
        { title: "Deneme - 2", page: 775 }, { title: "Deneme - 3", page: 794 },
        { title: "Deneme - 4", page: 813 }, { title: "Deneme - 5", page: 832 }, { title: "Deneme - 6", page: 851 }
    ],
    tarih: [
        { title: "İç Kapak", page: 1 }, { title: "Künye", page: 2 }, { title: "Ön Söz", page: 3 },
        { title: "İslamiyet Öncesi Türk Tarihi - 1", page: 4 }, { title: "İslamiyet Öncesi Türk Tarihi - 2", page: 23 },
        { title: "İslamiyet Öncesi Türk Tarihi - 3", page: 44 }, { title: "Türk - İslam Tarihi - 1", page: 65 },
        { title: "Türk - İslam Tarihi - 2", page: 83 }, { title: "Türk - İslam Tarihi - 3", page: 103 },
        { title: "Türkiye Tarihi - 1", page: 124 }, { title: "Türkiye Tarihi - 2", page: 143 },
        { title: "Türkiye Tarihi - 3", page: 162 }, { title: "Osmanlı Kuruluş Dönemi", page: 181 },
        { title: "Osmanlı Yükselme Dönemi", page: 202 }, { title: "Osmanlı Kültür ve Medeniyeti - 1", page: 223 },
        { title: "Osmanlı Kültür ve Medeniyeti - 2", page: 244 }, { title: "Osmanlı Kültür ve Medeniyeti - 3", page: 265 },
        { title: "Osmanlı Kültür ve Medeniyeti - 4", page: 285 }, { title: "Osmanlı Duraklama Dönemi", page: 305 },
        { title: "Osmanlı Gerileme Dönemi", page: 325 }, { title: "Osmanlı Yenileşme Hareketleri - 1", page: 345 },
        { title: "Osmanlı Yenileşme Hareketleri - 2", page: 365 }, { title: "Osmanlı Yenileşme Hareketleri - 3", page: 385 },
        { title: "Osmanlı Yenileşme Hareketleri - 4", page: 405 }, { title: "Osmanlı Yenileşme Hareketleri - 5", page: 425 },
        { title: "Osmanlı Yenileşme Hareketleri - 6", page: 445 }, { title: "Avrupa Tarihi", page: 465 },
        { title: "XX. Yüzyılda Osmanlı Devleti - 1", page: 482 }, { title: "XX. Yüzyılda Osmanlı Devleti - 2", page: 503 },
        { title: "I. Dünya Savaşı - 1", page: 524 }, { title: "I. Dünya Savaşı - 2", page: 545 },
        { title: "Mondros Ateşkes Anlaşması ve Cemiyetler", page: 566 }, { title: "Kurtuluş Savaşı Hazırlık - 1", page: 586 },
        { title: "Kurtuluş Savaşı Hazırlık - 2", page: 606 }, { title: "Kurtuluş Savaşı Hazırlık - 3", page: 626 },
        { title: "Kurtuluş Savaşı Hazırlık - 4", page: 646 }, { title: "I. TBMM Dönemi - 1", page: 666 },
        { title: "I. TBMM Dönemi - 2", page: 689 }, { title: "Kurtuluş Savaşı (Muharebeler) - 1", page: 712 },
        { title: "Kurtuluş Savaşı (Muharebeler) - 2", page: 732 }, { title: "Kurtuluş Savaşı (Muharebeler) - 3", page: 753 },
        { title: "Kurtuluş Savaşı (Muharebeler) - 4", page: 773 }, { title: "Atatürk İnkılapları - 1", page: 792 },
        { title: "Atatürk İnkılapları - 2", page: 812 }, { title: "Atatürk İnkılapları - 3", page: 833 },
        { title: "Atatürk İnkılapları - 4", page: 853 }, { title: "Atatürk İnkılapları - 5", page: 871 },
        { title: "Atatürk İnkılapları - 6", page: 891 }, { title: "Atatürk İlkeleri - 1", page: 912 },
        { title: "Atatürk İlkeleri - 2", page: 933 }, { title: "Atatürk İlkeleri - 3", page: 953 },
        { title: "Atatürk İlkeleri - 4", page: 971 }, { title: "Türk Dış Politikası ve II. Dünya Savaşı - 1", page: 990 },
        { title: "Türk Dış Politikası ve II. Dünya Savaşı - 2", page: 1011 }, { title: "Türk Dış Politikası ve II. Dünya Savaşı - 3", page: 1031 },
        { title: "XX. Yüzyılın Başlarında Dünya", page: 1051 }, { title: "Soğuk Savaş Dönemi", page: 1070 },
        { title: "Yumuşama Dönemi", page: 1088 }, { title: "Küreselleşen Dünya", page: 1108 },
        { title: "Karma Test - 1", page: 1126 }, { title: "Karma Test - 2", page: 1147 },
        { title: "Karma Test - 3", page: 1168 }, { title: "Karma Test - 4", page: 1189 },
        { title: "Karma Test - 5", page: 1210 }, { title: "Karma Test - 6", page: 1231 },
        { title: "Karma Test - 7", page: 1252 }, { title: "Karma Test - 8", page: 1273 }
    ],
    matematik: [
        { title: "İç Kapak", page: 1 }, { title: "Künye", page: 2 }, { title: "Önsöz", page: 3 },
        { title: "Doğal Sayı - Tam Sayı - 1", page: 4 }, { title: "Doğal Sayı - Tam Sayı - 2", page: 24 },
        { title: "Tek, Çift, Pozitif, Negatif Sayılar", page: 43 }, { title: "Ardışık Sayılar", page: 62 },
        { title: "Basamak Analizi - Çözümleme", page: 81 }, { title: "Asal Sayı - Asal Çarpan - Faktöriyel", page: 100 },
        { title: "Bölme - Bölünebilme Kuralları", page: 119 }, { title: "EBOB - EKOK", page: 138 },
        { title: "Rasyonel Sayılar", page: 157 }, { title: "Ondalık Sayılar - Sıralama", page: 176 },
        { title: "1. Dereceden Denklemler", page: 195 }, { title: "Eşitsizlik", page: 214 },
        { title: "Mutlak Değer", page: 233 }, { title: "Üslü İfadeler", page: 252 },
        { title: "Köklü İfadeler", page: 271 }, { title: "Çarpanlara Ayırma - 1", page: 290 },
        { title: "Çarpanlara Ayırma - 2", page: 309 }, { title: "Oran - Orantı - 1", page: 328 },
        { title: "Oran - Orantı - 2", page: 347 }, { title: "Denklem Kurma Problemleri - 1", page: 366 },
        { title: "Denklem Kurma Problemleri - 2", page: 385 }, { title: "Kesir Problemleri", page: 404 },
        { title: "Yaş Problemleri", page: 423 }, { title: "Yüzde - Faiz Problemleri", page: 442 },
        { title: "Kâr - Zarar Problemleri", page: 461 }, { title: "Karışım Problemleri", page: 480 },
        { title: "İşçi - Havuz Problemleri", page: 499 }, { title: "Hareket Problemleri", page: 518 },
        { title: "Kümeler", page: 537 }, { title: "Fonksiyonlar", page: 556 },
        { title: "İşlem", page: 575 }, { title: "Modüler Aritmetik", page: 594 },
        { title: "Permütasyon - Kombinasyon", page: 613 }, { title: "Olasılık", page: 632 },
        { title: "Tablo - Grafik Yorumlama - 1", page: 651 }, { title: "Tablo - Grafik Yorumlama - 2", page: 665 },
        { title: "Tablo - Grafik Yorumlama - 3", page: 680 }, { title: "Sayısal Mantık - 1", page: 693 },
        { title: "Sayısal Mantık - 2", page: 710 }, { title: "Sayısal Mantık - 3", page: 728 },
        { title: "Sayısal Mantık - 4", page: 739 }, { title: "Doğruda Açı", page: 754 },
        { title: "Üçgende Açı", page: 771 }, { title: "Üçgende Açı - Kenar Bağıntıları", page: 788 },
        { title: "Dik Üçgen", page: 805 }, { title: "Özel Üçgenler", page: 822 },
        { title: "Üçgende Alan", page: 839 }, { title: "Üçgende Açıortay - Kenarortay", page: 856 },
        { title: "Üçgende Benzerlik", page: 873 }, { title: "Üçgende Benzerlik ve Alan", page: 890 },
        { title: "Çokgenler - Dörtgenler", page: 907 }, { title: "Paralelkenar - Eşkenar Dörtgen", page: 924 },
        { title: "Dikdörtgen", page: 941 }, { title: "Kare", page: 958 },
        { title: "Yamuk - Deltoid", page: 975 }, { title: "Çemberde Açı", page: 992 },
        { title: "Çemberde Uzunluk", page: 1009 }, { title: "Dairede Alan", page: 1026 },
        { title: "Analitik Geometri - 1", page: 1043 }, { title: "Analitik Geometri - 2", page: 1060 },
        { title: "Katı Cisim", page: 1077 }
    ],
    turkce: [
        { title: "İç Kapak", page: 1 }, { title: "Künye", page: 2 }, { title: "Ön Söz", page: 3 },
        { title: "Sözcükte Anlam – 1", page: 4 }, { title: "Sözcükte Anlam – 2", page: 19 },
        { title: "Sözcükte Anlam – 3", page: 35 }, { title: "Sözcükte Anlam – 4", page: 49 },
        { title: "Sözcükte Anlam – 5", page: 63 }, { title: "Cümlede Anlam – 1", page: 73 },
        { title: "Cümlede Anlam – 2", page: 87 }, { title: "Cümlede Anlam – 3", page: 103 },
        { title: "Cümlede Anlam – 4", page: 117 }, { title: "Cümlede Anlam – 5", page: 132 },
        { title: "Anlatım Biçimleri – 1", page: 148 }, { title: "Anlatım Biçimleri – 2", page: 158 },
        { title: "Anlatım Biçimleri – 3", page: 171 }, { title: "Paragrafın İçeriği", page: 184 },
        { title: "Paragrafta Yardımcı Düşünceler", page: 195 }, { title: "Paragrafta Konu ve Düşünce", page: 204 },
        { title: "Paragrafın Yapısı – 1", page: 214 }, { title: "Paragrafın Yapısı – 2", page: 226 },
        { title: "Paragraf (Karma Test) – 1", page: 237 }, { title: "Paragraf (Karma Test) – 2", page: 248 },
        { title: "Paragraf (Karma Test) – 3", page: 261 }, { title: "Paragraf (Karma Test) – 4", page: 271 },
        { title: "Paragraf (Karma Test) – 5", page: 283 }, { title: "Parçaya Dayalı Sorular – 1", page: 294 },
        { title: "Parçaya Dayalı Sorular – 2", page: 303 }, { title: "Ses Bilgisi – 1", page: 316 },
        { title: "Ses Bilgisi – 2", page: 330 }, { title: "Yapı Bilgisi – 1", page: 344 },
        { title: "Yapı Bilgisi – 2", page: 360 }, { title: "Sözcük Bilgisi – 1", page: 374 },
        { title: "Sözcük Bilgisi – 2", page: 391 }, { title: "Sözcük Bilgisi – 3", page: 408 },
        { title: "Cümle Bilgisi – 1", page: 422 }, { title: "Cümle Bilgisi – 2", page: 437 },
        { title: "Karma Dil Bilgisi", page: 453 }, { title: "Yazım Kuralları – 1", page: 468 },
        { title: "Yazım Kuralları – 2", page: 485 }, { title: "Yazım Kuralları – 3", page: 502 },
        { title: "Noktalama İşaretleri – 1", page: 519 }, { title: "Noktalama İşaretleri – 2", page: 535 },
        { title: "Noktalama İşaretleri – 3", page: 552 }, { title: "Anlatım Bozukluğu – 1", page: 568 },
        { title: "Anlatım Bozukluğu – 2", page: 585 }, { title: "Anlatım Bozukluğu – 3", page: 601 },
        { title: "Sözel Mantık – 1", page: 618 }, { title: "Sözel Mantık – 2", page: 631 },
        { title: "Sözel Mantık – 3", page: 645 }
    ]
};

// --- GLOBAL DEĞİŞKENLER ---
let currentConfig = null; // Şu an seçili dersin ayarları
let currentTOC = [];      // Şu anki dersin içindekiler listesi
let pdfDoc = null;
let pageNum = 1;
let pageRendering = false;
let pageNumPending = null;
let scale = 1.0; 
let canvas = document.getElementById('the-canvas');
let ctx = canvas.getContext('2d');

let loadedSolutions = {};
let loadedChunks = [];
let currentAnswer = null;

// --- 1. DERS SEÇİMİ VE BAŞLATMA ---
function loadSubject(subjectKey) {
    const config = SUBJECTS[subjectKey];
    if (!config) { alert("Hata: Ders bulunamadı!"); return; }
    
    currentConfig = config;
    
    // Doğru içindekiler listesini seç
    currentTOC = ALL_TOC_DATA[subjectKey] || [];

    // BU SATIRI EKLE (Menüyü gizle, viewer moduna geç):
    document.body.classList.add('viewer-active');
    
    
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
    / BU SATIRI EKLE (Viewer modundan çık, scroll'u aç):
    document.body.classList.remove('viewer-active');
    if(pdfDoc) {
        pdfDoc.destroy(); // Hafızayı temizle
        pdfDoc = null;
    }
}

// --- 2. PDF YÜKLEME ---
function loadPDF(url) {
    pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
        pdfDoc = pdfDoc_;
        buildTOC(); // İçindekileri oluştur
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
        var dpr = window.devicePixelRatio || 1;
        var displayScale = window.innerWidth < 768 ? 0.6 : scale;
        
        var viewport = page.getViewport({scale: displayScale});

        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);

        canvas.style.width = Math.floor(viewport.width) + "px";
        canvas.style.height = Math.floor(viewport.height) + "px";

        var renderContext = {
            canvasContext: ctx,
            viewport: viewport,
            transform: [dpr, 0, 0, dpr, 0, 0]
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
    
    // currentTOC değişkenini kullanıyoruz (loadSubject içinde ayarlanıyor)
    currentTOC.forEach(item => {
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

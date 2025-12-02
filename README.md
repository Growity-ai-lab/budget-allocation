# AdAlloc AI - Ekip Dashboard

Müşteri ve kampanya yönetimi için tam özellikli, hiyerarşik dashboard uygulaması.

## 🎯 Özellikler

### 4 Seviyeli Hiyerarşi
1. **Organizasyon Görünümü** - Tüm müşterilerin genel bakışı
2. **Müşteri Görünümü** - Müşteriye özel kampanyalar
3. **Kampanya Görünümü** - Kampanyaya özel kanallar
4. **Kanal Detayı** - Kanal bazında bütçe tahsisi ve metrikler

### Müşteri Yönetimi
- ✅ Müşteri ekleme/düzenleme
- ✅ Müşteri bazında toplam metrikler (harcama, gelir, ROAS)
- ✅ Sektör ve iletişim bilgileri
- ✅ Aktif/Pasif durum yönetimi
- ✅ Renkli kategorizasyon

### Kampanya Yönetimi
- ✅ Kampanya ekleme/düzenleme
- ✅ Kampanya durumu (Aktif/Duraklatıldı/Tamamlandı)
- ✅ Başlangıç ve bitiş tarihleri
- ✅ Bütçe takibi ve kullanım oranı
- ✅ Kampanya bazında ROAS hesaplama

### Kanal Yönetimi
- ✅ Kanal ekleme/düzenleme
- ✅ Harcama ve gelir takibi
- ✅ Otomatik ROAS, CPC, CTR hesaplama
- ✅ İnteraktif bütçe ayarlama (slider ve input)
- ✅ Gerçek zamanlı gelir tahmini

### Ekip Özellikleri
- 🔍 **Arama**: Müşteri veya sektör bazında arama
- 📊 **Grafikler**: Pasta grafik (harcama dağılımı) ve bar grafik (kanal performansı)
- 📥 **Export**: JSON formatında veri dışa aktarma
- 💾 **LocalStorage**: Veriler tarayıcıda saklanır
- 🧭 **Breadcrumbs**: Kolay navigasyon
- 📱 **Responsive**: Mobil ve masaüstü uyumlu

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Development modunda çalıştır
npm run dev

# Production build
npm run build

# Build'i önizle
npm run preview
```

## 📁 Proje Yapısı

```
adalloc-ai/
├── components/
│   ├── Breadcrumbs.tsx       # Navigasyon breadcrumb'ları
│   ├── CampaignCard.tsx      # Kampanya kartı
│   ├── CampaignModal.tsx     # Kampanya ekleme/düzenleme
│   ├── ChannelModal.tsx      # Kanal ekleme/düzenleme
│   ├── Charts.tsx            # Grafik bileşenleri
│   ├── CustomerCard.tsx      # Müşteri kartı
│   ├── CustomerModal.tsx     # Müşteri ekleme/düzenleme
│   ├── MetricCard.tsx        # Metrik kartları
│   └── OptimizationModal.tsx # AI optimizasyon (eski)
├── services/
│   └── geminiService.ts      # AI servis (eski)
├── App.tsx                   # Ana uygulama
├── types.ts                  # TypeScript tipleri
├── constants.ts              # Sabit veriler ve başlangıç verileri
└── index.tsx                 # Giriş noktası
```

## 🎨 Kullanım

### 1. Müşteri Ekleme
- Ana ekranda "Yeni Müşteri" butonuna tıklayın
- Müşteri bilgilerini doldurun (ad, sektör, iletişim, bütçe)
- Renk seçin ve kaydedin

### 2. Kampanya Ekleme
- Bir müşteriye tıklayarak müşteri görünümüne geçin
- "Yeni Kampanya" butonuna tıklayın
- Kampanya detaylarını girin (ad, tarih, bütçe, durum)
- Kaydedin

### 3. Kanal Ekleme ve Bütçe Tahsisi
- Bir kampanyaya tıklayarak kampanya görünümüne geçin
- "Kanal Ekle" butonuna tıklayın
- Kanal bilgilerini girin (ad, harcama, gelir, gösterim, tıklama)
- ROAS, CPC, CTR otomatik hesaplanır
- Slider veya input ile bütçeyi ayarlayın
- Gerçek zamanlı gelir tahmini görün

### 4. Veri Yönetimi
- "Dışa Aktar" butonu ile tüm verileri JSON olarak indirin
- Veriler otomatik olarak tarayıcıda saklanır (localStorage)
- Sayfa yenilendiğinde veriler korunur

## 🛠 Teknolojiler

- **React 19** - UI framework
- **TypeScript** - Tip güvenliği
- **Vite** - Build tool
- **Recharts** - Grafikler
- **Lucide React** - İkonlar
- **Tailwind CSS** - Styling (inline)

## 📊 Örnek Veriler

Uygulama 3 örnek müşteri ile gelir:
1. **TechCorp Global** (Teknoloji) - 2 kampanya
2. **RetailMax Türkiye** (E-ticaret) - 1 kampanya
3. **HealthPlus Wellness** (Sağlık) - 1 kampanya

Her kampanyanın çeşitli kanalları vardır (Google Ads, Meta, TikTok, LinkedIn).

## 🔄 Veri Akışı

```
Organization (Tüm Müşteriler)
    ↓
Customer (Müşteri)
    ↓
Campaign (Kampanya)
    ↓
Channel (Kanal - Google, Meta, vb.)
```

## 💡 İpuçları

- Breadcrumb'lara tıklayarak hızlıca üst seviyelere dönebilirsiniz
- Müşteri kartlarına tıklayarak detaylarını görebilirsiniz
- Kampanya kartları bütçe kullanım oranını gösterir
- Kanallar arasında harcamayı dengelemek için slider'ları kullanın
- LocalStorage temizlenirse örnek veriler yeniden yüklenir

## 🚀 Geliştirme Önerileri

- [ ] Backend entegrasyonu (API)
- [ ] Kullanıcı yetkilendirmesi
- [ ] AI tabanlı bütçe optimizasyonu (mevcut altyapı hazır)
- [ ] Gerçek zamanlı işbirliği
- [ ] Detaylı raporlama
- [ ] CSV/Excel export
- [ ] Kampanya şablonları
- [ ] Otomatik bildirimler

---

**Versiyon:** 1.0.0
**Son Güncelleme:** 2025-12-02

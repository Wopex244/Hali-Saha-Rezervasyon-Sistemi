# ⚽ Halı Saha Rezervasyon Sistemi | Çoklu Saha Yönetim Platformu

> [!IMPORTANT]
> **PROTOTİP AŞAMASI:** Bu proje şu anda bir prototip aşamasındadır ve temel özellikleri sergilemek amacıyla geliştirilmiştir. Aktif olarak geliştirilmeye ve yeni özellikler eklenmeye müsaittir.

Bu proje, halı saha rezervasyon sistemi olan modern bir platformdur. Saha sahiplerinin sahalarını yönetebildiği, oyuncuların ise şehir ve konuma göre saha arayıp saatlik rezervasyon yapabildiği bir ekosistem sunar.

## 🌟 Özellikler (Temel Prototip)

### 👤 Kullanıcı (Oyuncu) Özellikleri
- **Üyelik & Giriş**: Güvenli kimlik doğrulama sistemi.
- **Saha Keşfi**: Şehir ve konuma göre filtreleme.
- **Akıllı Takvim**: Anlık müsait saatleri görme ve çakışmayan rezervasyon yapma.
- **Profil**: Geçmiş rezervasyonları ve aktif maçları takip etme.

### 🏟️ Saha Sahibi Paneli
- **Saha Yönetimi**: Çoklu saha ekleme ve bilgi düzenleme.
- **Özellik Yönetimi**: Açık/Kapalı, Işıklı, Suni Çim, Tribün gibi özellikleri belirtme.
- **Fiyatlandırma**: Hafta içi, hafta sonu ve gece tarifesi belirleme.
- **Rezervasyon Kontrolü**: Gelen talepleri onaylama veya reddetme.

### 🛠️ Admin Paneli
- **Genel Denetim**: Tüm sahaları ve kullanıcıları yönetme.
- **Saha Onayı**: Yeni eklenen sahaları sisteme dahil etmeden önce doğrulama.

## 🚀 Kullanılan Teknolojiler

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Lucide React (İkonlar).
- **Backend**: Node.js (Vercel Serverless Functions compatible), Express, Mongoose.
- **Veritabanı**: MongoDB.
- **Tasarım**: Modern futbol teması ve Shadcn UI bileşenleri.

## �️ Kurulum ve Geliştirme

1. Projeyi klonlayın ve bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
2. `.env.local` dosyasını oluşturun:
   ```env
   MONGODB_URI=mongodb://hali-saha
   JWT_SECRET=supersecretkey
   ```
3. Frontend ve Backend'i başlatın:
   - **Frontend:** `npm run dev` (8080 portu)
   - **Backend:** `npm run server` (3000 portu)

4. Admin oluşturmak için: `npm run create-admin`

## �️ Gelecek Yol Haritası (Geliştirme Planı)

- [ ] **Ödeme Entegrasyonu**: Rezervasyon sırasında kredi kartı ile ödeme.
- [ ] **Takım Kurma & Rakip Bulma**: Oyuncuların maçlara katılması için sosyal özellikler.
- [ ] **Sms/E-posta Bildirimleri**: Rezervasyon onaylandığında otomatik bilgilendirme.
- [ ] **Canlı Skor & Maç Sonuçları**: Yapılan maçların kayıt altına alınması.
- [ ] **Mobil Uygulama**: React Native veya PWA desteği ile mobil erişim.

## 🏗️ Teknik Notlar (Geliştiriciler İçin)

- Backend yapısı hem Vercel Serverless hem de lokal Express sunucusu (`server.js`) ile uyumludur.
- Veritabanı modeli genişletilebilir şekilde tasarlanmıştır. `api/models` altından şemaları inceleyebilirsiniz.

## 🤝 Katkı Sağlama

Bu proje geliştirilmeye açık bir prototiptir. Pull request göndererek veya fikirlerinizi issue açarak paylaşarak sisteme katkıda bulunabilirsiniz.

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

---
*Geliştiren: [Wopex](https://github.com/Wopex244)*

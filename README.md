# ⚽ Halı Saha Rezervasyon Sistemi | Çoklu Saha Yönetim Platformu

Bu proje, berber randevu sisteminin kapsamlı bir şekilde halı saha rezervasyon sistemine dönüştürülmesiyle oluşturulmuş modern bir platformdur. Saha sahiplerinin sahalarını yönetebildiği, oyuncuların ise şehir ve konuma göre saha arayıp saatlik rezervasyon yapabildiği bir ekosistem sunar.

## 🌟 Özellikler

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
- **Finansal Takip**: Günlük ve aylık kazanç istatistikleri.

### 🛠️ Admin Paneli
- **Genel Denetim**: Tüm sahaları ve kullanıcıları yönetme.
- **Saha Onayı**: Yeni eklenen sahaları sisteme dahil etmeden önce doğrulama.
- **Sistem İstatistikleri**: Genel doluluk ve platform geliri takibi.

## 🚀 Kullanılan Teknolojiler

- **Frontend**: React, TypeScript, TailwindCSS, Lucide React (İkonlar).
- **Backend**: Node.js (Vercel Serverless Functions), Mongoose.
- **Veritabanı**: MongoDB.
- **Tasarım**: Shadcn UI bileşenleri temel alınarak oluşturulan modern futbol teması.

## 💻 Kurulum

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/yturu/hali-saha-rezervasyon.git
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. `.env` dosyasını oluşturun ve MongoDB bağlantı adresinizi ekleyin:
   ```env
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=supersecretkey
   ```
4. Uygulamayı başlatın:
   ```bash
   npm run dev
   ```

## 📊 Veritabanı Şeması

### `User`
- `email`, `password_hash`, `role` (user, admin, field_owner), `metadata`.

### `Field`
- `owner_id`, `name`, `city`, `district`, `features`, `pricing`, `time_slots`, `status`.

### `Reservation`
- `field_id`, `user_id`, `ad`, `soyad`, `telefon`, `tarih`, `saat`, `fiyat`, `durum`.

## 🤝 Katkı Sağlama

Pull request göndererek sisteme katkıda bulunabilirsiniz. Büyük değişiklikler için önce bir konu (issue) açmanızı rica ederiz.

## 📄 Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

---
*Geliştiren: [Yunus Turu](https://github.com/yturu)*

# Medicine Tracking App

**Medicine Tracking App**, kullanıcıların günlük ilaç kullanımını kolayca takip edebileceği, planlayabileceği ve geçmiş kullanım kayıtlarını görebileceği bir uygulamadır. Uygulama, ilaçların unutulmasını önlemeye yardımcı olur ve kullanıcı dostu bir arayüz ile ilaç takibini pratik hale getirir.

## Özellikler

- **Ana Sayfa (Home):**
  - Uygulamayı açtığınızda, o gün kullanmanız gereken ilaçlar sizi karşılar.
  - Tarih seçimiyle, o güne ait alınan ilaçları ve kullanım geçmişini görüntüleyebilirsiniz.

- **İlaçlar Sayfası:**
  - Aktif olarak kullanılan tüm ilaçlar burada listelenir.
  - Her ilacın yanında bulunan çöp kutusu simgesi ile ilaçları silebilirsiniz.
  - Bir ilaca tıkladığınızda, o ilacın kullanım programı detaylarını görebilirsiniz.
  - Sayfanın üst kısmındaki "+" butonu ile yeni bir ilaç eklemek için plan oluşturma sayfasına yönlendirilirsiniz.
  - "Geçmiş İlaçlar" butonu ile daha önce kullanılıp tamamlanmış ilaçların listesine ulaşabilirsiniz.

- **Plan Ekleme Sayfası:**
  - Eklemek istediğiniz ilacın saatini, sıklığını ve kaç gün kullanılacağını girerek "Plan Oluştur" butonuna tıklayabilirsiniz.
  - Plan oluşturduktan sonra otomatik olarak İlaçlar sayfasına yönlendirilirsiniz ve eklediğiniz ilaç burada görüntülenir.

- **Profil Sayfası:**
  - Profil bölümünde de "Geçmiş İlaçlar" butonu bulunur ve bu buton sizi geçmişte kullandığınız ilaçların olduğu sayfaya götürür.

## Kurulum

Projeyi bilgisayarınıza klonlayın:
```bash
git clone https://github.com/betzxcv/medicine-tracking-app.git
cd medicine-tracking-app
```

Bağımlılıkları yükleyin:
```bash
npm install
```

Projeyi başlatın:
```bash
npm start
```

## Kullanılan Teknolojiler

- **Frontend:** React (veya kullandığınız framework)
- **State Yönetimi:** (Varsa) Redux, Context API
- **Bildirim:** (Varsa) Browser Notification API veya mobilde push notification entegrasyonu
- **Veri Saklama:** LocalStorage (veya varsa backend/veritabanı)
- **Tasarım:** Responsive ve mobil uyumlu arayüz

## Ekran Görüntüleri

> Uygulamanın temel ekranlarının görsellerini buraya ekleyebilirsiniz.

## Katkı Sağlama

Katkıda bulunmak için, projeyi fork’layıp değişikliklerinizi yeni bir branch’te yapabilir ve pull request gönderebilirsiniz.

## Lisans

Bu proje MIT lisansı ile lisanslanmıştır.

---

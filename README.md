# 🦅 طليعة الصقور — منصة التلخيص التفاعلي

## 📁 هيكل المشروع

```
talia-project/
├── public/
│   └── index.html
├── src/
│   ├── App.js               ← الـ Root الرئيسي
│   ├── index.js             ← نقطة الدخول
│   ├── firebase.js          ← اتصال Firebase
│   ├── firebaseConfig.js    ← ⚠️ ضع بياناتك هنا
│   ├── constants.js         ← الأكواد وبيانات الطلائع
│   ├── helpers.js           ← دوال مساعدة
│   ├── styles.js            ← كل الـ CSS
│   └── components/
│       ├── Header.js
│       ├── Popup.js
│       ├── LoginPage.js
│       ├── LobbyPage.js
│       ├── WritingPage.js
│       └── AdminDashboard.js
└── package.json
```

---

## 🔧 خطوات التشغيل

### 1. إنشاء مشروع Firebase
- روح [console.firebase.google.com](https://console.firebase.google.com)
- أنشئ **New Project**
- فعّل **Realtime Database** → ابدأ بـ **Test Mode**
- روح **Project Settings** → **Your Apps** → أضف **Web App**
- انسخ الـ `firebaseConfig`

### 2. ضع بيانات Firebase
افتح `src/firebaseConfig.js` وعدّل:

```js
const firebaseConfig = {
  apiKey:            "ضع الـ apiKey هنا",
  authDomain:        "...",
  databaseURL:       "...",
  projectId:         "...",
  storageBucket:     "...",
  messagingSenderId: "...",
  appId:             "...",
};
```

### 3. تثبيت وتشغيل
```bash
npm install
npm start
```

---

## 🔐 الأكواد

| الكود | الطليعة |
|-------|---------|
| `GH-1156` | طليعة الغراب |
| `NS-9101` | طليعة النسور |
| `BW-0920` | طليعة البواشق |
| `SH-1528` | طليعة الشاهين |
| `Ss_352009:)` | الأدمن |

---

## 🎮 كيف يشتغل

**المشترك:**
1. يدخل كود طليعته
2. يشوف اسم طليعته → يكتب اسمه الثلاثي
3. يدخل اللوبي ويستنى

**الأدمن:**
1. يدخل بكود `Ss_352009:)`
2. يشوف كل المشتركين
3. يختار ٥ منهم → يضغط **ابدأ الجلسة**
4. المختارين يتحولوا تلقائياً لصفحة الكتابة
5. لما يخلصوا → يضغط **إنهاء الجلسة**
6. يشوف الإجابات فلتر حسب الطليعة

---

## ✏️ لو عايز تعدّل

- **تغيير الأكواد أو الطلائع** → `src/constants.js`
- **تغيير الألوان** → `src/styles.js` (متغيرات `:root`)
- **تغيير نص الهيدر** → `src/components/Header.js`
# Tli3t_Elsqoor_Day

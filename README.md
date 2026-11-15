# 📱 TaskMaster

A modern, full-stack, cross-platform mobile Task Manager application built from scratch with **React Native**, **Expo**, and **Firebase** (Authentication & Cloud Firestore).

---

## 🌟 Features

* **🔐 Firebase Authentication:**
  * Secure user registration and login with email and password.
  * Persistent user sessions across app restarts powered by `@react-native-async-storage/async-storage`.
  * Real-time auth state observer (`onAuthStateChanged`) with automatic routing between Auth and Dashboard screens.
* **☁️ Cloud Firestore Real-Time CRUD:**
  * **Create:** Instant task addition with server timestamps.
  * **Read:** Live cloud synchronization via Firestore's `onSnapshot` listeners (no manual re-fetching needed).
  * **Update:** Seamless completion toggle with instant visual feedback.
  * **Delete:** Cloud document deletion with reactive list updates.
* **🔒 User Data Isolation:**
  * Queries scoped strictly by user identity (`where('userId', '==', user.uid)`), guaranteeing complete data privacy between accounts.
* **🧭 Multi-Screen Stack Navigation:**
  * Native stack transitions built with **Expo Router** (React Navigation).
  * Smooth push/pop animations, back-stack handling, and dynamic header titles (`<Stack.Screen options={{ title }} />`).
  * Seamless route parameter passing between screen layers.
* **🎨 Mobile-First UI/UX:**
  * Modern dark mode design system styled with `StyleSheet.create`.
  * Smooth tactile touch feedback with `<Pressable>`.
  * Keyboard management using `<KeyboardAvoidingView>` and `Keyboard.dismiss()`.
  * High-performance list virtualization with `<FlatList>` and dedicated empty state handling.

---

## 🏗️ Project Structure

```text
task-master/
├── assets/                 # App icons, splash screens, and images
├── src/
│   ├── app/
│   │   ├── _layout.tsx     # Root Stack Navigator & header styling
│   │   ├── index.tsx       # Auth Gate & Main Cloud Task Manager Dashboard
│   │   └── details.tsx     # Task Details Screen with dynamic route parameters
│   ├── components/
│   │   └── AuthScreen.tsx  # Modular Sign In / Sign Up component
│   └── services/
│       └── firebaseConfig.ts # Firebase initialization & AsyncStorage persistence
├── app.json                # Expo project configuration
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── ROADMAP.md              # 5-Phase learning roadmap & milestone tracker
```

---

## 🚀 Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18.x or v20.x+ recommended)
* [Expo Go](https://expo.dev/go) app installed on your physical device (iOS or Android)

### Installation
1. Clone the repository and navigate into the project directory:
   ```bash
   cd task-master
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Firebase:
   * Create a project in the [Firebase Console](https://console.firebase.google.com/).
   * Enable **Email/Password** under **Authentication > Sign-in method**.
   * Enable **Cloud Firestore** in test mode.
   * Add your web app credentials in `src/services/firebaseConfig.ts`:
     ```typescript
     const firebaseConfig = {
       apiKey: "YOUR_API_KEY",
       authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
       projectId: "YOUR_PROJECT_ID",
       storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
       messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
       appId: "YOUR_APP_ID"
     };
     ```

### Running the App
Start the Expo Metro bundler:
```bash
npx expo start
```
* **Android:** Open **Expo Go** on your phone and tap **"Scan QR code"**.
* **iOS:** Open the native **Camera** app and scan the QR code to open in Expo Go.

---

## 🗺️ Learning Roadmap Milestones

This project was built following a structured 5-Phase curriculum:

| Phase | Core Concepts | Milestone | Status |
| :--- | :--- | :--- | :---: |
| **Phase 1: Foundations** | `<View>`, `<Text>`, `StyleSheet`, Flexbox, `<Pressable>`, `<TextInput>`, `useState` | Interactive Greeting Card | ✅ Completed |
| **Phase 2: Local Lists** | `<FlatList>` virtualization, `KeyboardAvoidingView`, immutable updates (`.map()`, `.filter()`) | Local State Todo App | ✅ Completed |
| **Phase 3: Navigation** | Native Stack routing, `router.push`, `useLocalSearchParams`, dynamic headers | Multi-Screen Task Manager | ✅ Completed |
| **Phase 4: Authentication** | Firebase Modular SDK, email/password signup/login, `onAuthStateChanged`, session persistence | Protected Auth Flow | ✅ Completed |
| **Phase 5: Cloud Sync** | Firestore collections, documents, `addDoc`, `onSnapshot` real-time listener, user data isolation | Real-Time Cloud Task Manager | ✅ Completed |

---

## 🛠️ Tech Stack

* **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 58)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (Native Stack Navigation)
* **Backend:** [Firebase](https://firebase.google.com/) (Modular SDK v11+)
  * **Auth:** Firebase Authentication
  * **Database:** Cloud Firestore (NoSQL Real-Time Database)
  * **Storage:** `@react-native-async-storage/async-storage` for local persistence

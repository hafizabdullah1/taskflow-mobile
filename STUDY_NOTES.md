# 📚 React Native + Firebase: Complete Revision & Study Notes

A comprehensive, phase-by-phase reference guide designed for fast revision, concept consolidation, and preparing for technical interviews.

---

## 📑 Table of Contents
1. [Phase 1: Foundations & Core Primitives](#phase-1-foundations--core-primitives)
2. [Phase 2: Dynamic Lists & Local State Management](#phase-2-dynamic-lists--local-state-management)
3. [Phase 3: Multi-Screen Navigation (Expo Router)](#phase-3-multi-screen-navigation-expo-router)
4. [Phase 4: Firebase Authentication & Persistent Sessions](#phase-4-firebase-authentication--persistent-sessions)
5. [Phase 5: Cloud Firestore Real-Time CRUD & Data Isolation](#phase-5-cloud-firestore-real-time-crud--data-isolation)
6. [Top Technical Interview Q&A Cheatsheet](#top-technical-interview-qa-cheatsheet)

---

## Phase 1: Foundations & Core Primitives

### 1. Web vs. Mobile Mental Model
* **No DOM:** Mobile devices run native rendering engines (`android.view.ViewGroup`, `UIView`), not a browser DOM.
* **`<View>`:** Replaces `<div>` and `<section>`. Acts as a flex container box.
* **`<Text>`:** Replaces `<p>`, `<span>`, `<h1>`-`<h6>`. **In React Native, all strings MUST be wrapped in `<Text>`.** Raw strings inside a `<View>` will throw a runtime crash.
* **`StyleSheet.create()`:** Replaces CSS files. Styles are typed JavaScript objects using `camelCase` properties (e.g., `backgroundColor`, `fontSize`).

### 2. Flexbox in React Native (Mobile Differences)
* **Default Direction is Column:** On the web, `flexDirection` defaults to `row`. On mobile, it defaults to `column` because phones are tall (portrait orientation).
* **Unitless Numbers:** Layout sizes (`width: 100`, `padding: 16`) use density-independent pixels (dp/pt), not `px` or `rem`.
* **`flex: 1`:** Expands the container to fill all available parent space.

### 3. User Touch: `<Pressable>` vs `<Button>`
* `<Button>` is an OS-native widget with fixed styling that looks different across iOS and Android with very few customization options.
* **`<Pressable>`** is the modern standard:
  * Detects `onPress`, `onLongPress`, `onPressIn`, `onPressOut`.
  * Provides a dynamic style callback: `style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}` to give visual feedback when touched.

### 4. Controlled Inputs (`<TextInput>`)
* Unlike web HTML where `e.target.value` is extracted, React Native's `onChangeText` passes the updated text string **directly**:
  ```tsx
  <TextInput 
    value={name} 
    onChangeText={setName} 
    placeholder="Enter name"
    placeholderTextColor="#64748b"
  />
  ```
* **Useful Props:**
  * `secureTextEntry`: Masks text for passwords.
  * `keyboardType="email-address"`: Shows `@` and `.com` on keyboard.
  * `autoCapitalize="none"`: Disables automatic capitalization for emails/usernames.

> **💡 How to explain Phase 1:**  
> *"React Native translates React components into native platform widgets. Instead of HTML tags and CSS files, we use primitive components like `<View>` and `<Text>` with `StyleSheet.create`. Layout is Flexbox by default in column direction, and user touch is handled via `<Pressable>` with reactive state managed by `useState`."*

---

## Phase 2: Dynamic Lists & Local State Management

### 1. List Performance: `<FlatList>` vs `<ScrollView>`
* **`<ScrollView>`:** Loads **all** children into memory at once. It is suitable only for short screens (e.g., Settings or Forms). Rendering 500+ items will cause high memory consumption and app crashes.
* **`<FlatList>`:** Uses **virtualization/windowing**. It renders only the items visible in the viewport plus a small buffer. Off-screen items are recycled, maintaining 60fps scrolling and minimal memory usage.

### 2. The 3 Required Props of `<FlatList>`
```tsx
<FlatList
  data={tasks}                             // 1. Array of items
  keyExtractor={(item) => item.id}         // 2. Unique string ID per item
  renderItem={({ item }) => <TaskCard />}  // 3. Render function for each item
  contentContainerStyle={styles.list}      // List padding goes here (not in style)
  ListEmptyComponent={<EmptyState />}      // Renders when data array is empty
/>
```

### 3. Immutable State CRUD Operations
React uses reference equality to detect changes. **Never mutate state directly** (`tasks.push()` will not trigger a re-render).

* **Create (Spread Operator):**
  ```ts
  setTasks([newTask, ...tasks]);
  ```
* **Update (Array `.map()`):**
  ```ts
  setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  ```
* **Delete (Array `.filter()`):**
  ```ts
  setTasks(tasks.filter(t => t.id !== id));
  ```

### 4. Mobile Keyboard Management
* On mobile, software keyboards slide up and can cover inputs.
* **`<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>`** automatically shifts UI above the keyboard.
* **`Keyboard.dismiss()`** programmatically closes the on-screen keyboard after submission.

> **💡 How to explain Phase 2:**  
> *"For lists, we use `<FlatList>` for memory virtualization over `<ScrollView>`. State updates must be strictly immutable using array methods like spread for creation, `.map()` for updates, and `.filter()` for deletion. We handle soft keyboards using `<KeyboardAvoidingView>` and `Keyboard.dismiss()`."*

---

## Phase 3: Multi-Screen Navigation (Expo Router)

### 1. Mobile Navigation Model: The Screen Stack
* Unlike web browsers where pages are replaced on URL change, mobile apps use a **Stack** (like a deck of cards).
* **Push (`router.push`):** Slides a new screen on top. The previous screen remains alive in memory beneath it.
* **Pop (`router.back`):** Removes the top screen and reveals the previous screen with its scroll position and state preserved.

### 2. Expo Router File-Based Routing
* Files inside `src/app/` map directly to routes:
  * `src/app/_layout.tsx` -> Root Stack Navigator (`<Stack>`).
  * `src/app/index.tsx` -> Route `/` (Home Screen).
  * `src/app/details.tsx` -> Route `/details` (Details Screen).

### 3. Passing and Reading Parameters
* **Sending Params:**
  ```ts
  const router = useRouter();
  router.push({
    pathname: '/details',
    params: { id: task.id, title: task.title, completed: String(task.completed) }
  });
  ```
* **Reading Params:**
  ```ts
  const { id, title, completed } = useLocalSearchParams<{ id: string; title: string; completed: string }>();
  ```

### 4. Dynamic Header Customization
* Child screens can reach up and override the parent navigation header options using `<Stack.Screen />`:
  ```tsx
  <Stack.Screen options={{ title: title ? `Task: ${title}` : 'Details' }} />
  ```

> **💡 How to explain Phase 3:**  
> *"Mobile routing uses a stack hierarchy. In Expo Router, we configure the layout using `<Stack>` in `_layout.tsx`, push screens with `useRouter().push()`, read route parameters with `useLocalSearchParams()`, and dynamically modify header options from child screens using `<Stack.Screen />`."*

---

## Phase 4: Firebase Authentication & Persistent Sessions

### 1. Why the Firebase JS SDK in Expo?
* **Native SDK (`@react-native-firebase`):** Uses Java/Swift and requires native build compilation; it does not run in standard Expo Go without custom dev builds.
* **JavaScript Web SDK (`firebase`):** Pure JS running on the Hermes engine. It works out-of-the-box in Expo Go on both iOS and Android.

### 2. Session Persistence with `AsyncStorage`
* Browsers store auth tokens in `localStorage` or `IndexedDB`, which do not exist in React Native.
* To persist logins across app restarts on mobile, we pass `AsyncStorage` to `initializeAuth`:
  ```ts
  import AsyncStorage from '@react-native-async-storage/async-storage';
  import { initializeAuth, getReactNativePersistence } from 'firebase/auth';

  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  ```

### 3. Modular Auth Methods
* `createUserWithEmailAndPassword(auth, email, password)`
* `signInWithEmailAndPassword(auth, email, password)`
* `signOut(auth)`

### 4. The Auth State Observer (`onAuthStateChanged`)
* Automatically checks local storage on startup and listens for token changes:
  ```tsx
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return unsubscribe; // Unsubscribe listener on unmount to prevent memory leaks
  }, []);
  ```
* **State-Driven Guard:** Rather than navigating manually, render `<AuthScreen />` if `!user`, and render `<Dashboard />` once `user` exists.

> **💡 How to explain Phase 4:**  
> *"We use Firebase's modular Auth SDK configured with `getReactNativePersistence(AsyncStorage)` so the session survives app restarts. We listen to auth changes using `onAuthStateChanged` inside `useEffect`, cleaning up the listener on unmount. A conditional render guards the app between auth and dashboard states."*

---

## Phase 5: Cloud Firestore Real-Time CRUD & Data Isolation

### 1. NoSQL Firestore Concepts
* **Collection:** Container of documents (e.g., `tasks`).
* **Document:** Single record with unique ID (e.g., auto-generated hash).
* **Fields:** Key-value pairs inside a document (`title`, `completed`, `userId`, `createdAt`).

### 2. Live Synchronization: `onSnapshot` vs `getDocs`
* `getDocs`: Fetches data once (like a standard REST `GET` request).
* **`onSnapshot`:** Keeps an open persistent connection. When any document is added, updated, or deleted in Firestore, the callback triggers immediately:
  ```ts
  const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setTasks(data); // State updates automatically on any cloud change!
  });
  ```

### 3. Modular Firestore CRUD Methods
| Operation | Modular Method | Syntax Example |
| :--- | :--- | :--- |
| **Create** | `addDoc` | `await addDoc(collection(db, 'tasks'), { title, completed: false, userId: user.uid, createdAt: serverTimestamp() })` |
| **Read (Live)**| `onSnapshot` | `onSnapshot(query(collection(db, 'tasks'), where('userId', '==', user.uid)), callback)` |
| **Update** | `updateDoc` | `await updateDoc(doc(db, 'tasks', id), { completed: !currentStatus })` |
| **Delete** | `deleteDoc` | `await deleteDoc(doc(db, 'tasks', id))` |

### 4. User Data Isolation (Security & Privacy)
* By applying `where('userId', '==', user.uid)`, we query only documents matching the authenticated user's ID, preventing users from viewing or modifying other users' data.

> **💡 How to explain Phase 5:**  
> *"Cloud Firestore is a NoSQL document database. Using modular methods (`addDoc`, `updateDoc`, `deleteDoc`), we write data tagged with the user's `uid`. We use `onSnapshot` with a scoped `where('userId', '==', user.uid)` query to establish real-time sync, which updates local React state automatically without manual re-fetching."*

---

## 🎯 Top Technical Interview Q&A Cheatsheet

#### Q1: Why do we use `<FlatList>` instead of `<ScrollView>` for data lists in React Native?
**Answer:** `<ScrollView>` renders every child item into memory simultaneously, causing performance degradation and out-of-memory crashes on large datasets. `<FlatList>` uses virtualization to render only what is currently visible on screen (plus a small buffer), recycling memory as the user scrolls.

#### Q2: Why did we need `@react-native-async-storage/async-storage` when configuring Firebase Auth?
**Answer:** In browser web apps, Firebase Auth persists sessions via `IndexedDB` or `localStorage`. React Native does not have browser storage APIs, so we must explicitly provide `AsyncStorage` via `getReactNativePersistence` so that the user's login tokens persist across app closures and device reboots.

#### Q3: Why is `onSnapshot` used in Firestore instead of calling `getDocs()` after every action?
**Answer:** `onSnapshot` creates an active real-time WebSocket listener. Whenever any client modifies a document in the collection, Firestore pushes the update automatically. This eliminates the need to manually trigger refetch requests or imperatively update local state after creating, updating, or deleting items.

#### Q4: What is the difference between Web Flexbox and React Native Flexbox?
**Answer:** 
1. `flexDirection` defaults to `column` in React Native, while web defaults to `row`.
2. All dimensions are unitless density-independent points/pixels (no `px`, `rem`, `em`).
3. React Native does not support full CSS cascading; styles are scoped object definitions compiled by the Yoga layout engine.

#### Q5: Why is returning `unsubscribe` inside `useEffect` critical for listeners?
**Answer:** `onAuthStateChanged` and `onSnapshot` open continuous background subscriptions. If you do not return the `unsubscribe` cleanup function, every time the component unmounts or re-runs, a new listener is spawned without closing the old one, leading to memory leaks and unexpected duplicate state updates.

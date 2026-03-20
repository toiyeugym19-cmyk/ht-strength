---
name: Firebase Integration
description: Integration patterns for Firebase Auth, Firestore, and Storage
---

# Firebase Integration

## 1. Configuration (`src/lib/firebase.ts`)

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

## 2. Authentication Hook

```typescript
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return { user, loading };
}
```

## 3. Firestore Patterns

### Fetch Collection
```typescript
import { collection, getDocs, query, where } from 'firebase/firestore';

const q = query(
  collection(db, "members"),
  where("status", "==", "active")
);

const snapshot = await getDocs(q);
const members = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
```

### Real-time Listeners
```typescript
import { onSnapshot, doc } from 'firebase/firestore';

const unsub = onSnapshot(doc(db, "gym_stats", "today"), (doc) => {
    console.log("Current data: ", doc.data());
});
```

## 4. Security Rules (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /public/{docId} {
      allow read: if true;
    }
  }
}
```

## 5. Deployment (Firebase Hosting)

```bash
npm install -g firebase-tools
firebase login
firebase init
npm run build
firebase deploy
```

import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

let auth: ReturnType<typeof getAuth>;
let provider: GoogleAuthProvider;
let db: ReturnType<typeof getFirestore>;

if (typeof window !== "undefined") {
  const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  };

  const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

  auth = getAuth(app);
  provider = new GoogleAuthProvider();
  db = getFirestore(app);
} else {
  // Provide empty objects during server-side build to avoid Firebase initialization
  auth = {} as ReturnType<typeof getAuth>;
  provider = {} as GoogleAuthProvider;
  db = {} as ReturnType<typeof getFirestore>;
}

export { auth, provider, db };

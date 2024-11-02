import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBd67NZ61TA32PSG8EuzQEAgikCpC-qBSY",
  authDomain: "cutness-2e3a8.firebaseapp.com",
  projectId: "cutness-2e3a8",
  storageBucket: "cutness-2e3a8.appspot.com",
  messagingSenderId: "269144923391",
  appId: "1:269144923391:web:fde3aecf814f1bc57540ca",
  measurementId: "G-E2NK74YT8Q",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
  }
};

export { auth, provider, db, signInWithGoogle };

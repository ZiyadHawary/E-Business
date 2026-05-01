import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyANNVmIfmOh5G2W9WcuKx4C4Jb4hAuSHck",
  authDomain: "e-business-f1529.firebaseapp.com",
  projectId: "e-business-f1529",
  storageBucket: "e-business-f1529.firebasestorage.app",
  messagingSenderId: "386374109962",
  appId: "1:386374109962:web:ebf234c0e626559e9b08f3",
  measurementId: "G-6Q2FHH0SQQ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function test() {
  const snap = await getDocs(collection(db, "tutors"));
  console.log(snap.docs.length);
}
test().catch(console.error);

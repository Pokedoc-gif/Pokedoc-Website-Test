// jsfirebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  increment,
  query,
  orderBy,
  where
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// 🔑 Paste your config here
const firebaseConfig = {
  apiKey: "AIzaSyCCxkZZbcAJphfnlTwztK_9LDAf-AXKcXA",
  authDomain: "pokedoc-store.firebaseapp.com",
  projectId: "pokedoc-store",
  storageBucket: "pokedoc-store.firebasestorage.app",
  messagingSenderId: "342362381577",
  appId: "1:342362381577:web:be6877326b4e92830b07d8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ==========================
// 🔥 PRICE SYSTEM
// ==========================

async function loadPrices() {
  const docRef = doc(db, "store", "prices");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const prices = docSnap.data();

    document.getElementById("display1").innerText = prices.price1;
    document.getElementById("display2").innerText = prices.price2;
    document.getElementById("display3").innerText = prices.price3;
    document.getElementById("display4").innerText = prices.price4;
  }
}

async function updatePrices() {
  const prices = {
    price1: document.getElementById("price1").value,
    price2: document.getElementById("price2").value,
    price3: document.getElementById("price3").value,
    price4: document.getElementById("price4").value
  };

  await setDoc(doc(db, "store", "prices"), prices);
  alert("Prices Updated Globally ✅");
  loadPrices();
}

window.updatePrices = updatePrices;
window.addEventListener("load", loadPrices);

// ==========================
// 📦 ITEM REQUEST SYSTEM
// ==========================

async function sendItemRequest() {

  const name = document.getElementById("requestName").value.trim();
  const details = document.getElementById("requestDetails").value.trim();

  if (!name) {
    alert("Enter item name");
    return;
  }

  const requestsRef = collection(db, "requests");

  // 🔍 Check if item already exists (prevent duplicates)
  const q = query(requestsRef, where("name", "==", name));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    // If exists → increase vote
    const existingDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, "requests", existingDoc.id), {
      votes: increment(1)
    });
  } else {
    // If new → create document
    await addDoc(requestsRef, {
      name: name,
      details: details,
      votes: 1,
      created: new Date()
    });
  }

  document.getElementById("requestName").value = "";
  document.getElementById("requestDetails").value = "";

  loadRequests();
  alert("Request submitted 🔥");
}

window.sendItemRequest = sendItemRequest;


// ==========================
// 📊 LOAD MOST REQUESTED
// ==========================

async function loadRequests() {

  const container = document.getElementById("mostRequested");
  if (!container) return;

  container.innerHTML = "";

  const q = query(collection(db, "requests"), orderBy("votes", "desc"));
  const snapshot = await getDocs(q);

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    container.innerHTML += `
      <div class="request-card">
        <h4>${data.name}</h4>
        <p>Votes: ${data.votes}</p >
        <button onclick="voteRequest('${docSnap.id}')">Vote 🔥</button>
      </div>
    `;
  });
}

window.voteRequest = async function(id) {

  await updateDoc(doc(db, "requests", id), {
    votes: increment(1)
  });

  loadRequests();
};


// ==========================
// 🛠 ADMIN REQUEST VIEW
// ==========================

async function loadAdminRequests() {

  const container = document.getElementById("adminRequests");
  if (!container) return;

  container.innerHTML = "";

  const snapshot = await getDocs(collection(db, "requests"));

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    container.innerHTML += `
      <div class="admin-card">
        <strong>${data.name}</strong>
        <p>${data.details || "No details"}</p >
        <p>${data.votes} votes</p >
      </div>
    `;
  });
}

window.loadAdminRequests = loadAdminRequests;


// Auto load on page
window.addEventListener("load", loadRequests);

// ==========================
// 🔐 ADMIN LOGIN
// ==========================

async function adminLogin() {
  const email = prompt("Admin Email:");
  const password = prompt("Admin Password:");

  try {
    await signInWithEmailAndPassword(auth, email, password);
    document.getElementById("adminPanel").style.display = "block";
    alert("Admin Logged In ✅");
  } catch (error) {
    alert("Login Failed ❌");
  }
}

window.toggleAdmin = adminLogin;
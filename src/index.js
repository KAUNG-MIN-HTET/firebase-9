import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAcknuRmdDJJo6h5m74npxh_EMq1NLNC6s",
  authDomain: "fir-9-dojo-8d0ee.firebaseapp.com",
  projectId: "fir-9-dojo-8d0ee",
  storageBucket: "fir-9-dojo-8d0ee.appspot.com",
  messagingSenderId: "88657956378",
  appId: "1:88657956378:web:6efe7e059d26fbe0aecba3",
};

// init firebase app
initializeApp(firebaseConfig);

// init firebase services
const db = getFirestore();
const auth = getAuth();

// collection ref
const colRef = collection(db, "books");

// queries
const q = query(
  colRef,
  where("author", "==", "jhon doe"),
  orderBy("createdAt")
);

// get collection data
// getDocs(colRef).then((snapshot) => {
//   const books = [];
//   snapshot.docs.forEach((doc) => {
//     books.push({ ...doc.data(), id: doc.id });
//   });
//   console.log(books);
// });

// get real time collection data
const unsubCol = onSnapshot(q, (snapshot) => {
  let books = [];
  snapshot.docs.forEach((doc) => {
    books.push({ ...doc.data(), id: doc.id });
  });
  console.log(books);
});

// adding documents
const addBookForm = document.querySelector(".add");
addBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //   console.log(addBookForm.title.value, addBookForm.author.value)

  addDoc(colRef, {
    title: addBookForm.title.value,
    author: addBookForm.author.value,
    createdAt: serverTimestamp(),
  }).then(() => {
    addBookForm.reset();
  });
});

// deleting documents
const deleteBookForm = document.querySelector(".delete");
deleteBookForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", deleteBookForm.id.value);

  deleteDoc(docRef).then(() => {
    deleteBookForm.reset();
  });
});

// get single document
const docRef = doc(db, "books", "D0YUFWkIzPdAQmQH5kN7");

// getDoc(docRef).then(doc => {
//     console.log(doc.data(), doc.id);
// })

const unsubDoc = onSnapshot(docRef, (doc) => {
  console.log(doc.data(), doc.id);
});

const updateBookform = document.querySelector(".update");
updateBookform.addEventListener("submit", (e) => {
  e.preventDefault();

  const docRef = doc(db, "books", updateBookform.id.value);

  updateDoc(docRef, {
    title: "Updated book",
  }).then(() => {
    updateBookform.reset();
  });
});


// auth signup
const signupform = document.querySelector(".signup");
signupform.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = signupform.email.value;
    const password = signupform.password.value;
    createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
        console.log("User created : ", cred.user);
    })
    .catch((err) => {
        console.log(err);
    })
});

// logging in and out
const logoutform = document.querySelector(".logout");
logoutform.addEventListener("submit", (e) => {
    e.preventDefault();

    signOut(auth)
    .then(() => console.log("logout successfully"));
});

const signinform = document.querySelector(".signin");
signinform.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = signinform.email.value;
    const password = signinform.password.value;

    signInWithEmailAndPassword(auth, email, password)
    .then((cred) => {
        console.log("Successfully login : ", cred.user);
        signinform.reset();
    })
    .catch((err) => {
        console.log(err);
    })
});

// subscribing on auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => console.log("Auth changed : ", user));

// unsubscribe from changes (db, auth)
const unsubButton = document.querySelector(".unsub");
unsubButton.addEventListener("click", () => {
    console.log("unsubscribing")

    unsubCol()
    unsubDoc()
    unsubAuth()
})

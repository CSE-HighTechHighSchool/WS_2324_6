// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {getDatabase, ref, set, update, child, get} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
//From website
// Import the functions you need from the SDKs you need

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCe7ou1G1JOX9IageTZpCmejeaB2NyZuWw",
  authDomain: "shoresailing2023.firebaseapp.com",
  databaseURL: "https://shoresailing2023-default-rtdb.firebaseio.com",
  projectId: "shoresailing2023",
  storageBucket: "shoresailing2023.appspot.com",
  messagingSenderId: "99745152338",
  appId: "1:99745152338:web:6ced14170f65d326844e8b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//initialize firebase authentication
const auth = getAuth();

//Returns the instance of your app's FRD
const db = getDatabase(app);


// ---------------- Register New User --------------------------------//

document.getElementById('submitData').onclick = function(){
  const firstName = document.getElementById('firstName').value
  const lastName = document.getElementById('lastName').value
  const email  = document.getElementById('userEmail').value

  //Firebase requires a password of at least 6 characters
  const password = document.getElementById('userPass').value;

  if (!validation(firstName, lastName, email, password)){
    return;
  };

  //Create a new app user using email and password authentication 
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    //Create the user credential 
    const user = userCredential.user; 

    //Add the user account info to the FRD
    //set function will create a new reference or completely replace existing reference
    //Each new user will be placed under the user's node 
    set(ref(db, "users/" + user.uid + '/accountInfo'), {
      uid: user.uid,//save userID for home.js
      email: email,
      password: encryptPass(password),
      firstName: firstName,
      lastName: lastName

    })
    .then(() => {
      //Data saved successfully
      alert("User successfully created")
      document.getElementById("accountCreationContainer").classList.remove("right-panel-active");
    })
    .catch((error) => {
      //the write failed
      alert(error)
    })

  }) .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message
    alert(errorMessage);
  });
  //window.location = 'signin.html'
  
}


// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str){
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//
function validation(firstName, lastName, email, password) { 
  let fNameRegex = /^[a-zA-Z]+$/;
  let lNameRegex = /^[a-zA-Z]+$/;
  let emailRegex =  /^[a-zA-Z0-9]+(@ctemc.org|@gmail\.com)+$/;

  if (isEmptyorSpaces(firstName) || isEmptyorSpaces(lastName) || isEmptyorSpaces(email) || isEmptyorSpaces(password)){
    alert("Please fill out all required sections");
    return false;
  }
  if(!fNameRegex.test(firstName)){
    alert( "The first name should only contain letters");
    return false;
  }

  if(!lNameRegex.test(lastName))
  {
    alert( "The last name should only contain letters");
    return false;
  }

  if(!emailRegex.test(email))
  {
    alert( "Please enter a proper email");
    return false;
  }
  return true;

  




}

// --------------- Password Encryption -------------------------------------//
function encryptPass (password){
  let encrypted = CryptoJS.AES.encrypt(password, password);
  return encrypted.toString();

}


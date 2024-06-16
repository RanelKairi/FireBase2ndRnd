import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCWid0BCLjxA8Mk_JF5YSALRIHAuDkquNc",
    authDomain: "ndrndcrud.firebaseapp.com",
    projectId: "ndrndcrud",
    storageBucket: "ndrndcrud.appspot.com",
    messagingSenderId: "194773663789",
    appId: "1:194773663789:web:ad5d8a77d3c696b8e178a4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let products = collection(db, "Products");
const users = collection(db, "Users");

// UNSPLASH API KEY
const AccessKey = `6_iqsnNh_RNosdHY584RRzcFtqAxczs6NdxLm6uPl8Q`;


document.addEventListener('DOMContentLoaded', () => {
   const themeToggle = document.querySelector('#theme-toggle');
   const body = document.body;

   themeToggle.addEventListener('click', () => {
       body.classList.toggle('dark-mode');
   });

   displayProducts();
});

async function displayProducts() {
    const querySnapshot = await getDocs(products);
    const productsContainer = document.querySelector('.client-products-container');
    productsContainer.innerHTML = '';

    querySnapshot.forEach((doc) => {
        const product = doc.data();
        const productHTML = `
            <div class="product-card">
                <img src="${product.PictureURL}" alt="${product.Name}">
                <div class="product-details">
                    <p class="product-name">Name: ${product.Name}</p>
                    <p class="product-price">Price: $${product.Price}</p>
                    <p class="product-desc">Description: ${product.Description}</p>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productHTML;
    });
}

function showSignInForm() {
    const signInForm = `
        <div class="sign-in-form"><h>Sign In<h><br><br>
            Email: <input id="email2" "><br>
            Password: <input id="password2"><br>
            <button id="signin2">Sign In</button><br>   
            <a id="show-sign-up">don't have an account? click here to sign up</a>
        </div>
    `;
    document.querySelector('.client-products-container').innerHTML = signInForm;

    document.querySelector('#signin2').addEventListener('click', signin);
    document.querySelector('#show-sign-up').addEventListener('click', showSignUpForm);
}

function showSignUpForm() {
    const signUpForm = `
        <div class="sign-up-cont">
            Name: <input id="name"><br>
            Email: <input id="email"><br>
            Password: <input id="pass"><br>
            ID: <input id="SN"><br>
            Gender: <select id="gender">
                        <option value="men">Male</option>
                        <option value="women">Female</option>
                    </select><br><br>
            <button id="signup">Signup</button><br>
            <a id="show-sign-in">Already got an account? Sign in</a>
        </div>
    `;
    document.querySelector('.client-products-container').innerHTML = signUpForm;

    document.querySelector('#signup').addEventListener('click', signup);
    document.querySelector('#show-sign-in').addEventListener('click', showSignInForm);
}

async function signin() {
    let Email = document.querySelector('#email2').value;
    let Password = document.querySelector('#password2').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, Email, Password);
        console.log("Logged In Successfully");
        document.querySelector('#status').textContent = 'Status: Signed In';
        document.querySelector('#signin3').style.display = 'none';
        document.querySelector('#signout').style.display = 'block';

        document.querySelector('.sign-in-form').innerHTML = '';
    } catch (error) {
        console.error("Login failed:", error);
        alert("Email or Password is incorrect");
    }
}

async function signup(){
    let Name = document.querySelector('#name');
    let Email = document.querySelector('#email');
    let EmailAuth = Email.value;
    let Pass = document.querySelector('#pass');
    let PassAuth = Pass.value
    let Num =  document.querySelector('#SN');
    let Gender = document.querySelector(`#gender`);
    let x = 1;

    let usernum = await getDocs(users)
    usernum.forEach((doc)=> {
      console.log(`${doc.id} => ${doc.data()}`)
      console.log(users)
      x++
    console.log("x",x)
    })
    addDoc(users,{
        Name : Name.value,
        Email : Email.value,
        Password : Pass.value,
        SerialNumber: Num.value,
        User_auth_UID : "",
        CountNumber : x,
        Gender : Gender.value,
        
    });


    
    await createUserWithEmailAndPassword(
        auth, EmailAuth, PassAuth,Name.value,Num.value,x,Gender)
        .then((userCredential) => {
        const user = userCredential.user;
        const Uid = user.uid
        
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          
        }); 
   

}

async function signout() {
    try {
        await signOut(auth);
        console.log("Signed Out Successfully");
        document.querySelector('#status').textContent = 'Status: Signed Out';
        document.querySelector('#signin3').style.display = 'block';
        document.querySelector('#signout').style.display = 'none';
    } catch (error) {
        console.error("Sign Out failed:", error);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.querySelector('#status').textContent = 'Status: Signed In';
        document.querySelector('#signin3').style.display = 'none';
        document.querySelector('#signout').style.display = 'block';
        window.location.href = "/App/admin/admin.html";
    } else {
        document.querySelector('#status').textContent = 'Status: Signed Out';
        document.querySelector('#signin3').style.display = 'block';
        document.querySelector('#signout').style.display = 'none';
    }
});

document.querySelector('#signin3').addEventListener('click', showSignInForm);
document.querySelector('#signout').addEventListener('click', signout);

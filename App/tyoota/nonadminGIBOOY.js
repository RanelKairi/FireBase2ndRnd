// Import Firebase modules for functionality
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Firebase configuration setup
const firebaseConfig = {
    apiKey: "AIzaSyCWid0BCLjxA8Mk_JF5YSALRIHAuDkquNc",
    authDomain: "ndrndcrud.firebaseapp.com",
    projectId: "ndrndcrud",
    storageBucket: "ndrndcrud.appspot.com",
    messagingSenderId: "194773663789",
    appId: "1:194773663789:web:ad5d8a77d3c696b8e178a4"
};

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Collection references
let products = collection(db, "Products");
const users = collection(db, "Users");

// Access key for Unsplash API
const AccessKey = `6_iqsnNh_RNosdHY584RRzcFtqAxczs6NdxLm6uPl8Q`;

// JavaScript code to handle theme toggling
document.addEventListener('DOMContentLoaded', () => {
   const themeToggle = document.querySelector('#theme-toggle');
   const body = document.body;

   themeToggle.addEventListener('click', () => {
       body.classList.toggle('dark-mode');
   });

   displayProducts();
});

// Function to add product data
async function addProduct() {
    let Pro_name = document.querySelector('#pro_name').value;
    let Pro_price = document.querySelector('#pro_price').value;
    let Pro_desc = document.querySelector('#pro_desc').value;
    const queryURL = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(Pro_name)}&client_id=${AccessKey}`;

    try {
        const response = await fetch(queryURL, {
            method: 'GET',
            headers: { 'Accept-Version': 'v1' }
        });
        const data = await response.json();
        if (data.results.length > 0) {
            const imageUrl = data.results[0].urls.small;
            await addDoc(products, {
                Name: Pro_name,
                Price: Pro_price,
                Description: Pro_desc,
                PictureURL: imageUrl
            });
            console.log("Product added successfully");
            displayProducts();
        } else {
            console.error("No images found for:", Pro_name);
        }
    } catch (error) {
        console.error("Failed to load data or add product:", error);
    }
}

// Display products dynamically on the page
async function displayProducts() {
    const querySnapshot = await getDocs(products);
    const productsContainer = document.querySelector('.client-products-container');
    productsContainer.innerHTML = ''; // Clear existing content

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

// Show sign-in form
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

// Show sign-up form
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

// Function to handle sign in
async function signin() {
    let Email = document.querySelector('#email2').value;
    let Password = document.querySelector('#password2').value;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, Email, Password);
        console.log("Logged In Successfully");
        document.querySelector('#status').textContent = 'Status: Signed In';
        document.querySelector('#signin3').style.display = 'none';
        document.querySelector('#signout').style.display = 'block';

        // Clear the sign-in form
        document.querySelector('.sign-in-form').innerHTML = '';
    } catch (error) {
        console.error("Login failed:", error);
        alert("Email or Password is incorrect");
    }
}

// Function to handle sign up
// Function to handle sign up
// Function to handle sign up
async function signup() {
    let EmailAuth = document.querySelector('#email');
    let EmailDoc = EmailAuth.value
    let NameAuth = document.querySelector('#name');
    let NameDoc = NameAuth.value
    let PassAuth =  document.querySelector('#pass');
    let PassDoc = PassAuth.value
    let GenderDoc = document.querySelector('#gender')
    // let Email = document.querySelector('#email');
    // let Email1 = Email.value
    // let Pass = document.querySelector('#password');
    // let Pass1 = Pass.value
    // let Num = document.querySelector('#SN');
    // let Gender = document.querySelector('#gender');
    addDoc(users,{
        Email:EmailDoc,
        Name:NameDoc,
        Pass:PassDoc,
        Gender:GenderDoc.value,
        SerialNumber:"",
        User_auth_UID:"",
        CountNumber:"",
    })
// const jehri = {
//     Name:Name.value,
//     Email:Email.value,
//     Passwd:Pass.value
// }

    try {
        await createUserWithEmailAndPassword(auth, EmailAuth.value, PassAuth.value);
        userCredential = 
        
        // Redirect to admin page after successful sign up
        window.location.href = "/App/admin/admin.html";
        // signupp(jehri)
    } catch (error) {
        console.error("User registration failed:", error);
        
    }

    
    console.log("docAdded?")
}
// Function to handle adding user to Firestore
async function signupp(jehri) {
    let Name = document.querySelector('#name').value;
    let Email = document.querySelector('#email').value;
    let Pass = document.querySelector('#password').value;
    let Num = document.querySelector('#SN').value;
    let Gender = document.querySelector('#gender').value;
    let x = 1;

    try {
       await addDoc(users, {
            // Name: Name,
            // Email: Email,
            // Password: Pass,
            // SerialNumber: Num,
            // User_auth_UID: "uid_placeholder", // Placeholder since we don't have the UID
            // CountNumber: x,
            // Gender: Gender
            jehri
        });
        alert("User information added to Firestore!");
    } catch (error) {
        console.error("Failed to add user information to Firestore:", error);
        alert("Failed to add user information to Firestore");
    }
}



// Function to handle sign out
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

// Listen for auth state changes
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

// Event listeners for user interaction
document.querySelector('#signin3').addEventListener('click', showSignInForm);
document.querySelector('#signout').addEventListener('click', signout);

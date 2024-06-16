// // Import Firebase modules for functionality
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
// import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
// import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// // Firebase configuration setup
// const firebaseConfig = {
//     apiKey: "AIzaSyCWid0BCLjxA8Mk_JF5YSALRIHAuDkquNc",
//     authDomain: "ndrndcrud.firebaseapp.com",
//     projectId: "ndrndcrud",
//     storageBucket: "ndrndcrud.appspot.com",
//     messagingSenderId: "194773663789",
//     appId: "1:194773663789:web:ad5d8a77d3c696b8e178a4"
// };

// // Initialize Firebase and Firestore
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);
// const auth = getAuth(app);

// // Collection references
// let products = collection(db, "Products");

// // Access key for Unsplash API
// const AccessKey = `6_iqsnNh_RNosdHY584RRzcFtqAxczs6NdxLm6uPl8Q`;

// // JavaScript code to handle theme toggling
// document.addEventListener('DOMContentLoaded', () => {
//     const themeToggle = document.getElementById('theme-toggle');
//     const body = document.body;

//     themeToggle.addEventListener('click', () => {
//         body.classList.toggle('dark-mode');
//     });

//     displayProducts();
// });

// // Function to display products dynamically on the admin page
// async function displayProducts() {
//     const querySnapshot = await getDocs(products);
//     const productsContainer = document.querySelector('.admin-products-container');
//     productsContainer.innerHTML = ''; // Clear existing content

//     querySnapshot.forEach((doc) => {
//         const product = doc.data();
//         const productHTML = `
//             <div class="product-card" data-prod-id="${doc.id}">
//                 <img src="${product.PictureURL}" alt="${product.Name}">
//                 <div class="product-details">
//                     <p class="product-name">Name: ${product.Name}</p>
//                     <p class="product-price">Price: $${product.Price}</p>
//                     <p class="product-desc">Description: ${product.Description}</p>
//                     <button class="delete-btn">Delete</button>
//                     <button class="edit-btn">Edit</button>
//                 </div>
//             </div>
//         `;
//         productsContainer.innerHTML += productHTML;
//     });

//     document.querySelectorAll('.delete-btn').forEach((btn) => {
//         btn.addEventListener('click', (event) => {
//             const prodId = event.target.closest('.product-card').getAttribute('data-prod-id');
//             deleteProduct(prodId);
//         });
//     });

//     document.querySelectorAll('.edit-btn').forEach((btn) => {
//         btn.addEventListener('click', (event) => {
//             const prodId = event.target.closest('.product-card').getAttribute('data-prod-id');
//             editProduct(prodId);
//         });
//     });
// }

// // Function to delete a product from Firebase
// async function deleteProduct(prodId) {
//     await deleteDoc(doc(db, "Products", prodId));
//     displayProducts();
// }

// // Function to show the add product form
// function showAddProductForm() {
//     const addProductForm = `
//         <div class="add-product-form">
//             Product Name: <input id="pro_name" type="text"><br>
//             Product Price: <input id="pro_price" type="text"><br>
//             Product Description: <input id="pro_desc" type="text"><br>
//             <button id="addProductBtn">Add Product</button>
//         </div>
//     `;
//     document.querySelector('.admin-products-container').innerHTML = addProductForm;

//     document.querySelector('#addProductBtn').addEventListener('click', addProduct);
// }

// // Function to add product to Firebase when the add product form is submitted
// async function addProduct() {
//     let Pro_name = document.querySelector('#pro_name').value;
//     let Pro_price = document.querySelector('#pro_price').value;
//     let Pro_desc = document.querySelector('#pro_desc').value;
//     const queryURL = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(Pro_name)}&client_id=${AccessKey}`;

//     try {
//         const response = await fetch(queryURL, {
//             method: 'GET',
//             headers: { 'Accept-Version': 'v1' }
//         });
//         const data = await response.json();
//         if (data.results.length > 0) {
//             const imageUrl = data.results[0].urls.small;
//             await addDoc(products, {
//                 Name: Pro_name,
//                 Price: Pro_price,
//                 Description: Pro_desc,
//                 PictureURL: imageUrl
//             });
//             console.log("Product added successfully");
//             displayProducts();
//         } else {
//             console.error("No images found for:", Pro_name);
//         }
//     } catch (error) {
//         console.error("Failed to load data or add product:", error);
//     }
// }

// // Function to handle sign out
// async function signout() {
//     try {
//         await signOut(auth);
//         console.log("Signed Out Successfully");
//         window.location.href = "../nonadmin/nonAdmin.html";
//     } catch (error) {
//         console.error("Sign Out failed:", error);
//     }
// }

// // Function to show client view without navigating away
// function showClientView() {
//     displayProducts();
// }

// // Listen for auth state changes
// onAuthStateChanged(auth, (user) => {
//     if (user) {
//         document.querySelector('#status').textContent = 'Status: Signed In';
//         document.querySelector('#signin3').style.display = 'none';
//         document.querySelector('#signout').style.display = 'block';
//     } else {
//         window.location.href = "../nonadmin/nonAdmin.html";
//     }
// });

// // Event listeners for user interaction
// document.querySelector('#signout').addEventListener('click', signout);
// document.querySelector('#add-product-btn').addEventListener('click', showAddProductForm);
// document.querySelector('#client-view').addEventListener('click', showClientView);


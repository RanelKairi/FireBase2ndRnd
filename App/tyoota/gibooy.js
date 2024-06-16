// Import Firebase modules for functionality
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
let users = collection(db, "Users");

// Access key for Unsplash API
const AccessKey = `6_iqsnNh_RNosdHY584RRzcFtqAxczs6NdxLm6uPl8Q`;

let originalProductContent = ""; // Variable to store original products content

// JavaScript code to handle theme toggling
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    displayProducts();
    displayUsers();
});

// Function to display products dynamically on the admin page
async function displayProducts() {
    const querySnapshot = await getDocs(products);
    const productsContainer = document.querySelector('.admin-products-container');
    productsContainer.innerHTML = ''; // Clear existing content

    querySnapshot.forEach((doc) => {
        const product = doc.data();
        const productHTML = `
            <div class="product-card">
                <img src="${product.PictureURL}" alt="${product.Name}">
                <div class="product-details">
                    <p class="product-name" data-prod-id="${doc.id}">Name: ${product.Name}</p>
                    <p class="product-price" data-prod-id="${doc.id}">Price: $${product.Price}</p>
                    <p class="product-desc" data-prod-id="${doc.id}">Description: ${product.Description}</p>
                    <button class="delete-btn" data-prod-id="${doc.id}">Delete</button>
                    <button class="edit-btn" data-prod-id="${doc.id}">Edit</button>
                </div>
            </div>
        `;
        productsContainer.innerHTML += productHTML;
    });

    originalProductContent = productsContainer.innerHTML; // Save the initial content

    document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener("click", () => {
            const productId = btn.getAttribute("data-prod-id");
            if (confirm("Are you sure you want to delete this product?")) {
                deleteProduct(productId);
            }
        });
    });

    document.querySelectorAll('.edit-btn').forEach((btn) => {
        btn.addEventListener("click", async () => {
            const productId = btn.getAttribute("data-prod-id");
            await showEditForm(productId);
        });
    });
}

// Function to delete a product from Firebase
async function deleteProduct(productId) {
    try {
        await deleteDoc(doc(db, "Products", productId));
        console.log("Product deleted successfully");
        displayProducts();
    } catch (error) {
        console.error("Failed to delete product:", error);
    }
}

// Function to show the edit form with pre-filled product data
async function showEditForm(productId) {
    const productRef = doc(db, "Products", productId);
    const productDoc = await getDoc(productRef);

    if (productDoc.exists()) {
        const product = productDoc.data();
        const editForm = `
            <div class="edit-product-form">
                <input type="text" id="edit_pro_name" value="${product.Name}" placeholder="Product Name"><br>
                <input type="text" id="edit_pro_price" value="${product.Price}" placeholder="Product Price"><br>
                <input type="text" id="edit_pro_desc" value="${product.Description}" placeholder="Product Description"><br>
                <input type="text" id="edit_pro_picture_url" value="${product.PictureURL || ''}" placeholder="Product Picture URL"><br>
                <button id="save-changes-btn" data-prod-id="${productId}">Save Changes</button>
            </div>
        `;
        document.querySelector('.admin-products-container').innerHTML = editForm;

        document.querySelector('#save-changes-btn').addEventListener('click', saveChanges);
    } else {
        console.error("No such product!");
    }
}

// Function to save changes to the product
async function saveChanges(event) {
    const productId = event.target.getAttribute('data-prod-id');
    const updatedName = document.querySelector('#edit_pro_name').value;
    const updatedPrice = document.querySelector('#edit_pro_price').value;
    const updatedDescription = document.querySelector('#edit_pro_desc').value;
    const updatedPictureURL = document.querySelector('#edit_pro_picture_url').value;

    // Retrieve the current product data
    const productRef = doc(db, "Products", productId);
    const productDoc = await getDoc(productRef);
    const currentProduct = productDoc.data();

    // Keep the existing URL if the new URL field is empty
    const pictureURL = updatedPictureURL || currentProduct.PictureURL;

    try {
        await updateDoc(productRef, {
            Name: updatedName,
            Price: updatedPrice,
            Description: updatedDescription,
            PictureURL: pictureURL
        });
        console.log("Product updated successfully");
        window.location.href = "admin.html"; // Reload the admin page
    } catch (error) {
        console.error("Error updating product: ", error);
    }
}

// Function to handle the "Add Product" button click to show the add product form
function showAddProductForm() {
    const addProductForm = `
        <div class="add-product-form">
            Product Name: <input id="pro_name" type="text"><br>
            Product Price: <input id="pro_price" type="text"><br>
            Product Description: <input id="pro_desc" type="text"><br>
            <button id="addProductBtn">Add Product</button>
        </div>
    `;
    document.querySelector('.admin-products-container').innerHTML = addProductForm;

    document.querySelector('#addProductBtn').addEventListener('click', addProduct);
}

// Function to add product to Firebase when the "Add Product" form is submitted
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

// Function to handle sign out
async function signout() {
    try {
        await signOut(auth);
        console.log("Signed Out Successfully");
        window.location.href = "../nonadmin/nonAdmin.html";
    } catch (error) {
        console.error("Sign Out failed:", error);
    }
}

// Function to show client view without navigating away
function showClientView() {
    const userManagement = document.querySelector('.user-management');
    const adminProductsContainer = document.querySelector('.admin-products-container');
    
    userManagement.style.display = 'none'; // Hide user management
    adminProductsContainer.innerHTML = originalProductContent; // Restore products content
}

// Listen for auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        document.querySelector('#status').textContent = 'Status: Signed In';
        document.querySelector('#signin3').style.display = 'none';
        document.querySelector('#signout').style.display = 'block';
    } else {
        window.location.href = "../nonadmin/nonAdmin.html";
    }
});

// Event listeners for user interaction
document.querySelector('#signout').addEventListener('click', signout);
document.querySelector('#add-product-btn').addEventListener('click', showAddProductForm);
document.querySelector('#client-view').addEventListener('click', showClientView);
document.querySelector('#users-table').addEventListener('click', displayUsers);

// Function to display users
async function displayUsers() {
    const querySnapshot = await getDocs(users);
    const userTableBody = document.querySelector(".user-table-body");
    userTableBody.innerHTML = "";

    querySnapshot.forEach((doc) => {
        const user = doc.data();
        const row = `<tr>
                        <td>${user.Email}<br><br><button class ="email-update-btn" data-user-id="${doc.id}">Update</button></td>
                        <td>${user.Name} <br><br><button class ="name-update-btn" data-user-id="${doc.id}">Update</button></td>
                        <td><button class ="delete-btn" data-user-id="${doc.id}">Delete</button></td>
                        <td>${user.User_auth_UID}</td>
                        <td><img src="https://randomuser.me/api/portraits/med/${user.Gender}/${user.CountNumber}.jpg"></td>
                    </tr>`;
        userTableBody.innerHTML += row;
        console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const userId = btn.getAttribute("data-user-id");
            if (confirm("Are you sure you want to delete this user?")) {
                deleteUser(userId);
            }
        });
    });

    document.querySelectorAll(".email-update-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const userId = btn.getAttribute("data-user-id");
            let newEmail = prompt("Insert new Email to update");
            updateEmail(userId, newEmail);
        });
    });

    document.querySelectorAll(".name-update-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
            const userId = btn.getAttribute("data-user-id");
            let newName = prompt("Insert new Name to update");
            updateName(userId, newName);
        });
    });
}

// Function to delete a user
async function deleteUser(userId) {
    try {
        await deleteDoc(doc(db, "Users", userId));
        console.log("User deleted successfully");
        displayUsers(); // Refresh the user table
    } catch (error) {
        console.error("Failed to delete user:", error);
    }
}

// Function to update user's email
async function updateEmail(userId, newEmail) {
    const userRef = doc(db, "Users", userId);

    try {
        await updateDoc(userRef, {
            Email: newEmail
        });
        console.log("User email updated successfully");
        displayUsers(); // Refresh the user table
    } catch (error) {
        console.error("Error updating email: ", error);
    }
}

// Function to update user's name
async function updateName(userId, newName) {
    const userRef = doc(db, "Users", userId);

    try {
        await updateDoc(userRef, {
            Name: newName
        });
        console.log("User name updated successfully");
        displayUsers(); // Refresh the user table
    } catch (error) {
        console.error("Error updating name: ", error);
    }
}

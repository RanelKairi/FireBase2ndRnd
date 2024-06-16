import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged,createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
let users = collection(db, "Users");

//UNSPLASH API KEY  
const AccessKey = `6_iqsnNh_RNosdHY584RRzcFtqAxczs6NdxLm6uPl8Q`;

let storedProducts = '';
let storedUserTable = '';

document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
    });

    displayProducts();
    displayUsers();
});

async function displayProducts() {
    const querySnapshot = await getDocs(products);
    const productsContainer = document.querySelector('.admin-products-container');
    productsContainer.innerHTML = ''; 

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

async function deleteProduct(productId) {
    try {
        await deleteDoc(doc(db, "Products", productId));
        console.log("Product deleted successfully");
        displayProducts();
    } catch (error) {
        console.error("Failed to delete product:", error);
    }
}

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

async function saveChanges(event) {
    const productId = event.target.getAttribute('data-prod-id');
    const updatedName = document.querySelector('#edit_pro_name').value;
    const updatedPrice = document.querySelector('#edit_pro_price').value;
    const updatedDescription = document.querySelector('#edit_pro_desc').value;
    const updatedPictureURL = document.querySelector('#edit_pro_picture_url').value;

    const productRef = doc(db, "Products", productId);
    const productDoc = await getDoc(productRef);
    const currentProduct = productDoc.data();

    const pictureURL = updatedPictureURL || currentProduct.PictureURL;

    try {
        await updateDoc(productRef, {
            Name: updatedName,
            Price: updatedPrice,
            Description: updatedDescription,
            PictureURL: pictureURL
        });
        console.log("Product updated successfully");
        window.location.href = "admin.html"; 
    } catch (error) {
        console.error("Error updating product: ", error);
    }
}


function showAddProductForm() {
    const addProductForm = `
        <div class="add-product-form">
            Product Name: <input id="pro_name" type="text"><br>
            Product Price: <input id="pro_price" type="text"><br>
            Product Description: <input id="pro_desc" type="text"><br>
            <button id="addProductBtn">Add Product</button>
        </div>
    `;
    document.querySelector('.user-management').innerHTML= "";
    document.querySelector('.admin-products-container').innerHTML = addProductForm;

    document.querySelector('#addProductBtn').addEventListener('click', addProduct);
}


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

async function signout() {
    try {
        await signOut(auth);
        console.log("Signed Out Successfully");
        window.location.href = "../nonadmin/nonAdmin.html";
    } catch (error) {
        console.error("Sign Out failed:", error);
    }
}

function showClientView() {
    document.querySelector('.user-management').innerHTML = storedUserTable;
    displayProducts();
}

function showUsersTable() {
    const productsContainer = document.querySelector('.admin-products-container');
    storedProducts = productsContainer.innerHTML;
    const userTableHTML = `
        <div class="user-management">
            <h3>User Management</h3>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Actions</th>
                        <th>Document ID</th>
                        <th>Picture</th>
                    </tr>
                </thead>
                <tbody class="user-table-body">
                    <!-- User rows will be populated here dynamically -->
                </tbody>
            </table>
        </div>
    `;
    productsContainer.innerHTML = userTableHTML;
    displayUsers();
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        document.querySelector('#status').textContent = 'Status: Signed In';
        document.querySelector('#signin3').style.display = 'none';
        document.querySelector('#signout').style.display = 'block';
    } else {
        window.location.href = "../nonadmin/nonAdmin.html";
    }
});

document.querySelector('#signout').addEventListener('click', signout);
document.querySelector('#add-product-btn').addEventListener('click', showAddProductForm);
document.querySelector('#client-view').addEventListener('click', showClientView);
document.querySelector('#users-table').addEventListener('click', showUsersTable);

async function displayUsers() {
    const querySnapshot = await getDocs(users);
    const userTableBody = document.querySelector('.user-table-body');
    userTableBody.innerHTML = '';

    querySnapshot.forEach((doc) => {
        const user = doc.data();
        const row = `
            <tr>
                <td>${user.Email}<br><br><button class="email-update-btn" data-user-id="${doc.id}">Update</button></td>
                <td>${user.Name}<br><br><button class="name-update-btn" data-user-id="${doc.id}">Update</button></td>
                <td><button class="delete-btn" data-user-id="${doc.id}">Delete User</button></td>
                <td>${doc.id}</td>
                <td><img src="https://randomuser.me/api/portraits/med/${user.Gender}/${user.CountNumber}.jpg"></td>
            </tr>
           
        `;
        userTableBody.innerHTML += row;
    });

    document.querySelectorAll('.delete-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const userId = btn.getAttribute('data-user-id');
            if (confirm('Are you sure you want to delete this user?')) {
                deleteUser(userId);
            }
        });
    });

    document.querySelectorAll('.email-update-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const userId = btn.getAttribute('data-user-id');
            const newEmail = prompt('Insert new Email to update');
            updateEmail(userId, newEmail);
        });
    });

    document.querySelectorAll('.name-update-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
            const userId = btn.getAttribute('data-user-id');
            const newName = prompt('Insert new Name to update');
            updateName(userId, newName);
        });
    });
    const addAdmin = ` <button id = "AddAdmin">Add Admin</button>`
   
    const Adbody = document.querySelector(".addAd")
    Adbody.innerHTML=addAdmin
    const addBTN = document.querySelector('#AddAdmin')
    addBTN.addEventListener('click',()=> {
       
         
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
        </div>
        <button id = "hideAdmin">hide<hide form></button>
    `
    Adbody.innerHTML += signUpForm
    const hideBTN = document.querySelector("#hideAdmin")
    hideBTN.addEventListener('click',()=>{
        Adbody.innerHTML-= signUpForm
    })
    const addedBTN = document.querySelector("#signup")
    addedBTN.addEventListener('click',async ()=>{

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
       
    
        window.location.reload()
    })

    })
}

async function deleteUser(userId) {
    try {
        await deleteDoc(doc(db, 'Users', userId));
        console.log('User deleted successfully');
        displayUsers(); 
    } catch (error) {
        console.error('Failed to delete user:', error);
    }
}

async function updateEmail(userId, newEmail) {
    const userRef = doc(db, 'Users', userId);

    try {
        await updateDoc(userRef, {
            Email: newEmail,
        });
        console.log('User email updated successfully');
        displayUsers();
    } catch (error) {
        console.error('Error updating email: ', error);
    }
}

async function updateName(userId, newName) {
    const userRef = doc(db, 'Users', userId);

    try {
        await updateDoc(userRef, {
            Name: newName,
        });
        console.log('User name updated successfully');
        displayUsers(); 
    } catch (error) {
        console.error('Error updating name: ', error);
    }
}

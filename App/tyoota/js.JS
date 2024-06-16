// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection , addDoc,doc, getDocs,deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,onAuthStateChanged,signOut
 } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { getStorage } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

''
const firebaseConfig = {
  apiKey: "AIzaSyCWid0BCLjxA8Mk_JF5YSALRIHAuDkquNc",
  authDomain: "ndrndcrud.firebaseapp.com",
  projectId: "ndrndcrud",
  storageBucket: "ndrndcrud.appspot.com",
  messagingSenderId: "194773663789",
  appId: "1:194773663789:web:ad5d8a77d3c696b8e178a4",
  storageBucket:''
};



const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app);
let users = collection(db, "Users")
let products = collection(db, "Products")

const App_ID = `620570`
const AccessKey = `6_iqsnNh_RNosdHY584RRzcFtqAxczs6NdxLm6uPl8Q`
const SecretKey = `gDcRwQogHF-QEBrNwp-f0u6MgeIIGvImqXaFj2JD_iQ`
const urn = `urn:ietf:wg:oauth:2.0:oob`

// console.log("db",db);
// console.log("stringfy(db) => ",JSON.stringify(db))
// const user = auth.currentUser;

// Unsplash>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// const App_ID = `620570`
// const AccessKey = `6_iqsnNh_RNosdHY584RRzcFtqAxczs6NdxLm6uPl8Q`
// const SecretKey = `gDcRwQogHF-QEBrNwp-f0u6MgeIIGvImqXaFj2JD_iQ`
// const urn = `urn:ietf:wg:oauth:2.0:oob`
// let url = `https://api.unsplash.com/photos/?client_id=${AccessKey}`
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<--async function signup start-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
let serialNumberCounter = 1;  // Incremental counter for Serial Number

async function loadDataa() {
    let Pro_name = document.querySelector('#pro_name').value;
    let Pro_price = document.querySelector('#pro_price').value;
    let Pro_desc = document.querySelector('#pro_desc').value;
    let afterAdd = document.querySelector('.addnewPro');

    const queryURL = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(Pro_name)}&client_id=${AccessKey}`;

    try {
        const response = await fetch(queryURL, {
            method: 'GET',
            headers: {
                'Accept-Version': 'v1'  // Required by Unsplash API to specify the version.
            }
        });
        const data = await response.json();

        if (data.results.length > 0) {
            const imageUrl = data.results[0].urls.small;

            await addDoc(products, {
                Name: Pro_name,
                Price: Pro_price,
                Description: Pro_desc,
                SerialNumber: serialNumberCounter++,  // Use the counter to assign a serial number
                PictureURL: imageUrl  // Store the actual image URL
            });

            const list = `<div><img src="${imageUrl}" alt="${Pro_name}" /></div>`;
            afterAdd.innerHTML += list;
            displayProducts();

        } else {
            console.log("No images found for:", Pro_name);
        }
    } catch (error) {
        console.error("Failed to load data or add product:", error);
    }
}
async function displayProducts() {
    const querySnapshot = await getDocs(products);
    const productsContainer = document.querySelector('.products-container');
    productsContainer.innerHTML = '';  // Clear existing entries

    querySnapshot.forEach((doc) => {
        const product = doc.data();
        const imageUrl = product.PictureURL ? product.PictureURL : 'path-to-default-image.jpg'; // Provide a default image path here

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
        console.log("Product URL:", product.PictureURL);  // This will show what URL is being attempted to load

productsContainer.innerHTML += productHTML;

        
    });
}

// Call this function on page load or after a product is added

// let xx = 1
// async function loadDataa(body){
//   xx = xx+1
  
//   let Pro_name = document.querySelector('#pro_name')
//   let Pro_price = document.querySelector('#pro_price')
//   let Pro_desc = document.querySelector('#pro_desc')
//   let afterAdd = document.querySelector('.addnewPro')
//   const lastURL = `https://unsplash.com/search/photos?query=${Pro_name.value}&client_id=${AccessKey}`

//   // let Pro_SN = document.querySelector('#pro_SN')
//   // const response = await fetch(`https://api.unsplash.com/search/photos?query=${Pro_name.value}&client_id=${AccessKey}`)
//  try{ const response = await fetch(lastURL,{
//     method:'GET',
//     credentials: 'omit'
//   });
//   const data = await response.json()
//   // let pic = data.urls
//   // console.log("pic",pic)
//   console.log(data.results)
//   await addDoc(products,{
//     Name: Pro_name.value,
//     Price: Pro_price.value, 
//     // PictureURL: Pro_pic.value,
//     Description: Pro_desc.value,
//      SerialNumber: xx,
//     picURL:lastURL
//   }

// )
// const list = `<div>
// <img src ="${lastURL}"
// </div>`
// // const divdiva = document.querySelector(`#body`)
// afterAdd.innerHTML += list;
// }catch(error){
//   console.log(error)
// }
// }
async function signup(){

  let Name = document.querySelector('#name');
  let Email = document.querySelector('#email');
  let Pass = document.querySelector('#password');
  let Num =  document.querySelector('#SN');
  let Gender = document.querySelector(`#gender`);
  let x = 1;
  // let Email2 = document.querySelector('#email2');
  // let Pass2 = document.querySelector('#password2');

  let usernum = await getDocs(users)
  usernum.forEach((doc)=> {
    console.log(`${doc.id} => ${doc.data()}`)
    console.log(users)
    x++
  })

    await createUserWithEmailAndPassword(
      auth, Email.value, Pass.value,Name.value,Num.value,x,Gender)
      .then((userCredential,uid) => {
        
        const user = userCredential.user;
        uid = user.uid

        addDoc(users,{
          Name : Name.value,
          Email : Email.value,
          Password : Pass.value,
          SerialNumber: Num.value,
          User_auth_UID : uid,
          CountNumber : x,
          Gender : Gender.value,
          
      });
      alert("user created successfully!")
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // window.location.href="html.html"
        alert("user didn't registered")
      }); 
      
}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<--async function signup end-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

async function signin(){
  let Email2 = document.querySelector('#email2');
  let Pass2 = document.querySelector('#password2');


    await signInWithEmailAndPassword(auth, Email2.value, Pass2.value) //html2.html
    .then((userCredential) => {
      
      const user = userCredential.user;
      const user_uid = user.uid;
      console.log("Logged In Seccessfully")
      alert("Logged In Seccessfully")
      
      
      window.location.href="html3.html"
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Email / Password inccorect")
      window.location.href="html2.html"
    });

    
}

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<--async function signin end-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

async function displayUsers(picsLoading){
  // document.addEventListener('onload',()=>{
    // searchPhotos()
  // })
    // const usersRef = collection (db, "Users")
    console.log("usersRef",users)
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
                    </tr>`
      userTableBody.innerHTML += row;
       console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);

  }); 

  // resu = 

  document.querySelectorAll(".delete-btn").forEach((btn)=>{
    btn.addEventListener("click",() => {
      const userId = btn.getAttribute("data-user-id");
     deleteUser(userId);
    });
  });

  document.querySelectorAll(".email-update-btn").forEach((btn)=>{
      btn.addEventListener("click",() => {
      const userId = btn.getAttribute("data-user-id");
      let newEmail = prompt("insert new Email to update")
      updateEmail(userId,newEmail);
    });
  });
  document.querySelectorAll(".name-update-btn").forEach((btn)=>{
    btn.addEventListener("click",() => {
    const userId = btn.getAttribute("data-user-id");
    let newName = prompt("insert new Name to update")
    updateName(userId,newName);

  });
});

}
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<--async function signin end-->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

async function deleteUser(userId){
  await deleteDoc(doc(db,"Users",userId))
  .then(()=>{
    alert("user deleted successfully")
    window.location.reload()
  //  signout()
  })
  .catch((error)=>{
    alert(error.message);
    console.log(error.message)
  })
  
}
// relavent only for products doesn't change in auth part!!!!
function updateName(userId,newName){

  if(newName)
    {updateDoc(doc(db,"Users",userId),{Name:newName})
  .then(()=>{
    alert("user Updated successfully")
    window.location.reload()
  })
  .catch((error)=>{
    alert(error.message);
  })}
  // newEmail:undefined
  };

  function updateEmail(userId,newEmail){
  if(newEmail){
  updateDoc(doc(db,"Users",userId),{Email:newEmail})
  .then(()=>{
    alert("user Updated successfully")
    window.location.reload()
  })
  .catch((error)=>{
    alert(error.message);
  })
}
}

async function signout(){

  await signOut(auth).then(() => {
    // Sign-out successful.
    console.log("Sign-out successful.")
    alert("Sign-out successful.")
    window.location.reload()
  }).catch((error) => {
    // An error happened.
  });
}

 onAuthStateChanged(auth, (user) => {
  
  if (user) {
    const uid = user.uid;

   
    document.querySelector('#status').innerHTML="User status: Singed in"
    document.querySelector('#username').innerHTML=JSON.stringify(user.uid)
    document.querySelector(".signup-container").style.display = "none";
    document.querySelector(".login-container").style.display = "none";
    document.querySelector("#signin3").style.display = "none";
    displayUsers();
 
  } else {
    document.querySelector("#signin3").style.display = "block";
    console.log("onAuthStateChanged","User is signed out")
    document.querySelector(".user-table-body").innerHTML = "";
    document.querySelector('#status').innerHTML="User status: Singed OUT"
    document.querySelector("#admin-only").style.display = "none";
    document.querySelector("#signout").style.display = "none";
    document.querySelector(".signup-container").style.display = "none";
    document.querySelector(".login-container").style.display = "none";
    // searchPhotos()
  
  }

});


async function ShowSignIn(){
  document.querySelector('.login-container').style.display = "block";// same
  document.querySelector('.signup-container').style.display = "none";// same
  document.querySelector('.user-table').style.display = "none";// same

}

async function ShowSignUp(){
  document.querySelector('.login-container').style.display = "none";// same
  document.querySelector('.signup-container').style.display = "block";// same

}

document.querySelector('#signup').addEventListener('click',signup)
document.querySelector('#signin2').addEventListener('click',signin)
document.querySelector('#signout').addEventListener('click',signout)
document.querySelector('#signSquare').addEventListener('click',ShowSignUp)
document.querySelector('#signSquare2').addEventListener('click',ShowSignIn)
document.querySelector('#signin3').addEventListener('click',ShowSignIn)

async function ShowaddPro(products){
  products = collection(db, "Products")
  const addProduct = `<div class = "addnewPro">
  product name:<input id = "pro_name">
  <br><br>
  product price:<input id = "pro_price">
  <br><br>
 <!-- product picture<input id = "pro_pic"> 
  <br><br>!---->
  product decription <input id = "pro_desc">
  <br><br>
  product serial number <input id = "pro_SN">
  <br><br>
  <button id ="add_pro">add product!</button>

  <script type ="module" src = "gpHelp.js"></script>
  <!-- fixing id probs -->
</div>
<div class="products-container"></div>
`

  const body = document.querySelector('#body')
  const body_back = body.innerHTML;
  console.log("body",body,body.innerHTML)
  body.innerHTML = "";
  body.innerHTML = addProduct
  let btn1 = document.querySelector(`#add_pro`).addEventListener('click',()=>{
    let daki = document.querySelector('#pro_name')
    // addPro(products,body_back,body)
    loadDataa(products,body_back,body)
    })
  let btn = document.querySelector(`#home2`).addEventListener('click',()=>{
  body.innerHTML = body_back;
  })
}
async function loadData(products,body_back,body){
  const Urli =`https://api.unsplash.com/search/photos?query=${miko.value}&client_id=${AccessKey}`
  const response =  await fetch(`https://api.unsplash.com/photos&client_id=${AccessKey}`)
  const data = await response.json()
  console.log(data)
  const res = data.results
  addPro(data.results,products,body_back,body,res)
}
async function addPro(products,body_back,res){
  console.log("res",res)
  console.log(data.results)
  products = collection(db,"Products")
  // let body = document.querySelector('.coco1')
  const snapShot = await getDocs(products)
    let Pro_name = document.querySelector("#pro_name");
    let Pro_price = document.querySelector("#pro_price");
    // let Pro_pic = document.querySelector("#pro_pic");
    let Pro_desc = document.querySelector("#pro_desc");
    let Pro_SN = document.querySelector('#pro_SN');
    let y = 1;
  let URL;
  let zo = document.querySelector('.coco1')
  let pro_HTML = zo
    
  snapShot.forEach((doc) => {
    const product = doc.data();
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`)
    console.log(product)
    console.log(product)
    y ++
    URL=`https://api.unsplash.com/search/photos?query=${product.Name}&client_id=${AccessKey}`
    pro_HTML = `
    <div>
        <img src="${URL}" alt="">
        <p id ="${product.Name}"
        <p>${product.Price || 'No Description'}</p>
    </div>
`;
let HTMLpropro = JSON.stringify(pro_HTML)
body.innerHTML=""
// body.innerHTML= body_back;
body.innerHTML += pro_HTML
body.innerHTML += HTMLpropro

  })
  
    await addDoc(products,{
      Name: Pro_name.value,
      Price: Pro_price.value, 
      // PictureURL: Pro_pic.value,
      Description: Pro_desc.value,
      SerialNumber:y,
      picURL:`https://api.unsplash.com/search/photos?query=${Pro_name.value}&client_id=${AccessKey}`
    }
  
  )
    // console.log("picURL",picURL)
    // searchPhotos()
// body.innerHTML=""
// body.innerHTML= body_back;
// body.innerHTML += pro_HTML
}
// async function searchPhotos(){

//   function displayPhotos(photos){



// }

// }
// function searchPhotos (){

// }



// async function searchPhotos(url) {
//   console.log("fucntioncalld")
//   let products = collection(db,"Porducts")
//   console.log("products",products)
//   const snapShot = await getDocs(products)
//   console.log("snapShot",snapShot)
//   snapShot.forEach((doc) => {
//     console.log(`${doc.id} => ${doc.data()}`)
//     console.log(SerialNumber.value)
//     let miko = document.querySelector("#search-input")
//     // const input1 = document.querySelector(`search-input`).value
//     // const input = document.getElementById('search-input').value;
//     // const accessKey = `6_iqsnNh_RNosdHY584RRzcFtqAxczs6NdxLm6uPl8Q`
//     // const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(input)}&client_id=${accessKey}`;
//     url = `https://api.unsplash.com/search/photos?query=${Name.value}&client_id=${AccessKey}`;    
//   })
  

//   try {
//       const response = await fetch(url,{
//           method: 'GET',
//           credentials: 'omit' 
//       });
//       const data = await response.json();
//       displayPhotos(data.results); // Assuming the results are in the `results` array
//       console.log(data.results)
//   } catch (error) {
//       console.error('Error fetching photos:', error);
//   }
// }

// function displayPhotos(photos) {
//   const hara = `<div id = "kaka"></div>`
//   const body = document.querySelector('#body')
//   body.innerHTML += hara;
//   console.log("hara,body",hara,body)
//   // const container = document.getElementById('photo-results');
//   const container = document.querySelector(`#kaka`);
//   container.innerHTML = ''; // Clear previous results

//   photos.forEach(photo => {
//       const photoHTML = `
//           <div>
//               <img src="${photo.urls.thumb}" alt="${photo.alt_description}">
//               <p>${photo.description || 'No Description'}</p>
//           </div>
//       `;
//       container.innerHTML += photoHTML;
//   });
// }

// document.querySelector('#loglog').addEventListener('click',showsignin) // same
 // same
// document.querySelector('.signSquare').addEventListener('click',ShowSignUp)
// document.querySelector('#ap').addEventListener('click',loadApi) // same
// document.querySelector('#html').addEventListener('click',html)
// document.querySelector('#html2').addEventListener('click',html2) // same
// document.querySelector('#html3').addEventListener('click',html3) 
// document.querySelector('#api').addEventListener('click',loadData)
// document.querySelector('.login-container').style.display = "none";
// document.querySelector('.signup-container').style.display = "none";

let pic = `https://images.unsplash.com/photo-1690268798033-ae52e4e57db6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w`;





// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// const db = getFirestore(app);
// let products = collection(db,"Products")
let url = `https://api.unsplash.com/photos/?client_id=${AccessKey}`

// async function searchPhotos(products,container) {
//   products = collection(db,"Products")
//   try {
//     const response = await fetch(url,{
//         method: 'GET',
//         credentials: 'omit' 
//     });
//     const data = await response.json();
//     console.log(data.results)
//     displayPhotos(data.results); // Assuming the results are in the `results` array
// } catch (error) {
//     console.error('Error fetching photos:', error);
// }

//   const snapShot = await getDocs(products)
//   console.log(products)
//   snapShot.forEach((doc) => {
//     console.log(`${doc.id} => ${doc.data()}`)
//     // y ++
//     console.log(doc.picURL)
//     console.log(JSON.stringify(doc.data()))
//     const NName = JSON.stringify(doc.data())
//     console.log(doc.data())
//     console.log("NName",NName)

//   })
//     let miko = document.querySelector("#search-input")
//     // const input1 = document.querySelector(`search-input`).value
//     // const input = document.getElementById('search-input').value;
//     // const accessKey = `6_iqsnNh_RNosdHY584RRzcFtqAxczs6NdxLm6uPl8Q`
//     // const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(input)}&client_id=${accessKey}`;
//     // const url = `https://api.unsplash.com/search/photos?query=${miko.value}&client_id=${AccessKey}`;

//     try {
//         const response = await fetch(url,{
//             method: 'GET',
//             credentials: 'omit' 
//         });
//         const data = await response.json();
//         console.log(data.urls)
//         displayPhotos(data.urls); // Assuming the results are in the `results` array
//     } catch (error) {
//         console.error('Error fetching photos:', error);
//     }
//   };

async function displayPhotos(results,photos,container) {
    // const container = document.getElementById('photo-results');
    // container.innerHTML = `<div class = "photo-results"></div>` // Clear previous results
    container = document.querySelector(`.photo-results`);

    photos.for((photo) => {
        const photoHTMLinnerHTML = `
            <div>
                <img src="${photo.urls.thumb}" alt="${photo.alt_description}">
                <p>${photo.description || 'No Description'}</p>
            </div>
        `;
        container.innerHTML += photoHTML;
    });
}



async function adddPro(){
let p_name = document.querySelector(`#p_name`);
let p_SN = document.querySelector(`#p_SN`);
let pic_url = document.querySelector(`#pic_url`);
let price = document.querySelector(`#price`);

await addDoc(products),{
ProductName:p_name.value,
SerialNumber:p_SN.value,
picture_url:pic_url.value,
Price:price.value,    
}
console.log("products",products)
}

// document.querySelector(`#btn3`).addEventListener('click', loadData)
// document.querySelector(`#btn`).addEventListener('click', addPro)
// document.querySelector(`#html`).addEventListener('click', searchPhotos)
//
document.querySelector('#addp').addEventListener('click',ShowaddPro)

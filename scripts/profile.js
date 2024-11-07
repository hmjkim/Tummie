var currentUser;               //points to the document of the user who is logged in

function getNameFromAuth() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if a user is signed in:
        if (user) {
            currentUser = db.collection("users").doc(user.uid)
            currentUser.get()
                .then(userDoc => {
                    let userName = userDoc.data().name;
                    $("#displayname").text(userName);
                })
        } else {
            // No user is signed in.
            console.log("No user is logged in");
        }
    });
}

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    let userName = userDoc.data().name;
                    let userEmail = userDoc.data().email;
                    let userCountry = userDoc.data().country;
                    let userCity = userDoc.data().city;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userEmail != null) {
                        document.getElementById("emailInput").value = userEmail;
                    }
                    if (userCountry != null) {
                        document.getElementById("countryInput").value = userCountry;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

//Enable the form fields for profile-account
function editUserInfo() {
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    //enter code here
    //a) get user entered values
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userEmail = document.getElementById('emailInput').value;       //get the value of the field with id="nameInput"
    userCountry = document.getElementById('countryInput').value;     //get the value of the field with id="countryInput"
    userCity = document.getElementById('cityInput').value;       //get the value of the field with id="cityInput"
    //b) update user's document in Firestore
    currentUser.update({
        name: userName,
        email: userEmail,
        country: userCountry,
        city: userCity
    })
        .then(() => {
            console.log("Document successfully updated!");
        })
    //c) disable edit 
    document.getElementById('personalInfoFields').disabled = true;
}

function openContentBox(contentbox) {
   contentbox.classList.remove("tw-hidden")
}

function closeContentBox(contentbox) {
    contentbox.classList.add("tw-hidden")
}

populateUserInfo(); //run the function for profile-account

getNameFromAuth(); //run the function
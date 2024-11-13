var currentUser;               //global variable which points to the document of the user who is logged in

//Function that calls everything needed for the main page  
function pageSetup() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);

            // the following functions are always called when someone is logged in
            populateUserInfo();

        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
pageSetup();


// function to open a content box for each button on profile.html
function openContentBox(contentbox) {
    contentbox.classList.remove("tw-hidden")
}


// function to collapse a content box; attached to X button on content box
function closeContentBox(contentbox) {
    contentbox.classList.add("tw-hidden")
}


// function to auto-populate info read from database
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
                        document.getElementById("displayName").append(userName);        // Automatically display username on welcome message
                        document.getElementById("nameInput").value = userName;
                        document.getElementById("requesterNameInput").value = userName;
                    }
                    if (userEmail != null) {
                        document.getElementById("emailInput").value = userEmail;
                        document.getElementById("requesterEmailInput").value = userEmail;
                    }
                    if (countryInput != null) {
                        document.getElementById("countryInput").value = userCountry;
                    }
                    if (cityInput != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}


function editAccountInfo() {
    document.getElementById('accountInfoFields').disabled = false;
}


function saveAccountInfo() {
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
            console.log("Your personal information has been successfully updated!");
        })
    //c) functions after saving
    document.getElementById('accountInfoFields').disabled = true;
    document.getElementById('profileAccount').classList.add("tw-hidden");
    getNameFromAuth()
}

function editSupportRequest() {
    document.getElementById('supportRequestFields').disabled = false;
}

function submitSupportRequest() {
    //enter code here
    //a) get user entered values
    userName = document.getElementById('requesterNameInput').value;       //get the value of the field with id="nameInput"
    userEmail = document.getElementById('requesterEmailInput').value;       //get the value of the field with id="nameInput"
    requestDescription = document.getElementById('requestDescriptionInput').value;     //get the value of the field with id="countryInput"
    //b) update user's document in Firestore
    db.collection("support").doc().set({
        name: userName,
        email: userEmail,
        description: requestDescription
    })
        .then(() => {
            console.log("Your service request has been successfully submitted!");
            document.getElementById('profileSupport').classList.add("tw-hidden");
            document.getElementById('requestDescriptionInput').value = "";
        })
}


// need to add a function to populate user info for support content box
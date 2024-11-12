// Get the currently signed-in user
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // console.log("current user", user)
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/v8/firebase.User
        var userID = user.uid;
        
        displayFoodItemsDynamically(userID);

        document.querySelector('.save-btn').addEventListener('click', () => {
            writeFood(userID);
        });

      // ...
    } else {
        console.log("No user is signed in");
        window.location.href = 'login.html';
    }
});

// Add food items
function writeFood(userID) {

    // split path by \ and get the last one
    let foodImage = document.getElementById("imageUpload").value.split('\\').pop();
    let foodName = document.getElementById("nameInput").value;
    let foodSlug = slugify(foodName);
    let foodExpiryDate = document.getElementById("datepickerInput").value;
    let foodStorage = document.getElementById("storageSpaceInput").value;
    let foodCategory = document.getElementById("categoryInput").value;
    let foodQuantity = document.getElementById("quantityInput").value;
    let foodNotes = document.getElementById("notesInput").value;

    console.log(foodImage, foodSlug, foodName, foodExpiryDate, foodCategory, foodNotes, foodQuantity, foodStorage)
    
    // Add a new document inside users > food (sub collection)
    var foodRef = db.collection("users").doc(userID).collection("food");

    foodRef.add({
        userID: userID,
        title: foodName,
        slug: foodSlug,
        expiry_date: foodExpiryDate,
        category: foodCategory,
        storage_space: foodStorage,
        quantity: foodQuantity,
        image: foodImage,
        notes: foodNotes,
        date_created: firebase.firestore.FieldValue.serverTimestamp()
    }).then((foodRef) => {
        console.log("Document written with ID:", foodRef)
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
}

function displayFoodItemsDynamically(userID) {
    let foodItemTemplate = document.querySelector("#foodItemTemplate");
    let foodItemList = document.querySelector("#foodItemList");

    if (foodItemList && foodItemTemplate) {
        db.collection("users").doc(userID).collection("food")
        .get()
        .then((allItems) => {
            allItems.forEach((doc) => {
                // console.log(doc.id, " => ", doc.data());
                let title = doc.data().title;
                let expiry_date = doc.data().expiry_date;
                let category = doc.data().category;
                let storage_space = doc.data().storage_space;
                let quantity = doc.data().quantity;
                let image = doc.data().image;
                let notes = doc.data().notes;
                let dateCreated = doc.data().date_created;
                let daysLeft = calculateTimeLeft(expiry_date)
                // let currentTime = new Date().toLocaleString();

                // console.log(title, expiry_date, category, storage_space, quantity, image, notes, "dateCreated", dateCreated, "daysLeft", daysLeft)

                // Copy the content of template
                let foodItemCard = foodItemTemplate.content.cloneNode(true);

                // Populate card content
                foodItemCard.querySelector(".food-title").innerHTML = title;

                foodItemCard.querySelector(".food-days-left").innerHTML =  determineRemainingDaysMessage(daysLeft)
                foodItemCard.querySelector(".food-quantity").innerHTML = `Quantity: ${quantity}`;
                foodItemCard.querySelector(".food-img").src = `../images/icons/food/${image}`;

                foodItemList.appendChild(foodItemCard);


            })

        })
        
    }
}

function calculateTimeLeft(date) {
    // Define two Date objects representing the start and end datess
    const currentDate = Date.now(); // Current date and time in milliseconds
    const expiryDate = new Date(date);

    // Calculate the time difference in milliseconds
    var timeDifference =  expiryDate - currentDate;

    // Calculate the time left in days

    var timeDifferenceDays = Math.floor(timeDifference / 86400000);

    return timeDifferenceDays

}


function determineRemainingDaysMessage(daysLeft) {
    // determine remaining days message
    let message;
    switch (true) {
        case (daysLeft === 0):
            message = "Today";
            break;
        case (daysLeft === 1):
            message = "Tomorrow";
            break;
        case (daysLeft < 0):
            message = `${Math.abs(daysLeft)} days past`;
            break;
        default:
            message = `${daysLeft} days left`;
            break;
    }

    return message
}

document.addEventListener("DOMContentLoaded", () => {
    const btnAddItem = document.querySelector('.btn-add-item');
    const addOverlay = document.querySelector('.add-overlay');
    if (!btnAddItem || !addOverlay) {
        return;
    }

    // Show/Hide Add overlay when clicking on the plus icon
    btnAddItem.addEventListener("click", (event) => {
        if (addOverlay.classList.contains('is-active')) {
            addOverlay.classList.remove('is-active');
        } else {
            addOverlay.classList.add('is-active');
        }
    });

    // Close overlay when clicking outside of it
    document.addEventListener("click", (event) => {
        // overlay open, not clicking inside of overlay or add button
        if (addOverlay.classList.contains('is-active') && !addOverlay.contains(event.target) && !btnAddItem.contains(event.target)) {
            // Close overlay
            addOverlay.classList.remove('is-active');
        }
    });
});

// Preview Uploaded Image File before server submission
function previewFile(input){
    var file = $("input[type=file]").get(0).files[0];

    if(file){
        var reader = new FileReader();

        reader.onload = function(){
            $("#previewImg").attr("src", reader.result);
        }

        reader.readAsDataURL(file);
    }
}

function slugify(str) {
    str = str.replace(/^\s+|\s+$/g, ''); // trim leading/trailing white space
    str = str.toLowerCase(); // convert string to lowercase
    str = str.replace(/[^a-z0-9 -]/g, '') // remove any non-alphanumeric characters
             .replace(/\s+/g, '-') // replace spaces with hyphens
             .replace(/-+/g, '-'); // remove consecutive hyphens
    return str;
  }
// Get the currently signed-in user
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // console.log("current user", user)
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/v8/firebase.User
        var userID = user.uid;
        // writeFood(userID)
        displayFoodItemsDynamically(userID);

      // ...
    } else {
        console.log("No user is signed in");
        window.location.href = 'login.html';
    }
});

// Add food items
function writeFood(userID) {
    // Add a new document inside users > food (sub collection)
    var foodRef = db.collection("users").doc(userID).collection("food");
    // Apple
    foodRef.add({
        userID: userID,
        title: "Apple",
        expiry_date: "2024-12-05",
        category: "Fruits",
        storage_space: "Fridge",
        quantity: 2,
        image: "apple.svg",
        notes: "Organic, bought from the farmer's market",
        date_created: firebase.firestore.FieldValue.serverTimestamp()
    }).then((foodRef) => {
        console.log("Document written with ID:", foodRef)
    }).catch((error) => {
        console.error("Error adding document: ", error);
    })
    // Carrot
    foodRef.add({
        userID: userID,
        title: "Carrot",
        expiry_date: "2024-11-20",
        category: "Vegetables",
        storage_space: "Fridge",
        quantity: 5,
        image: "carrot.svg",
        notes: "Baby carrots, washed and peeled",
        date_created: firebase.firestore.FieldValue.serverTimestamp()
    }).then((foodRef) => {
        console.log("Document written with ID:", foodRef.id);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
    // Potato
    foodRef.add({
        userID: userID,
        title: "Potato",
        expiry_date: "2025-01-15",
        category: "Vegetables",
        storage_space: "Pantry",
        quantity: 10,
        image: "potato.svg",
        notes: "Russet potatoes, for mashing",
        date_created: firebase.firestore.FieldValue.serverTimestamp()
    }).then((foodRef) => {
        console.log("Document written with ID:", foodRef.id);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
    foodRef.add({
        userID: userID,
        title: "Tomato",
        expiry_date: "2024-11-14",
        category: "Vegetables",
        storage_space: "Counter",
        quantity: 3,
        image: "tomato.svg",
        notes: "Plum tomato, best for salads",
        date_created: firebase.firestore.FieldValue.serverTimestamp()
    }).then((foodRef) => {
        console.log("Document written with ID:", foodRef.id);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
    // Cheese
    foodRef.add({
        userID: userID,
        title: "Cheese",
        expiry_date: "2025-02-03",
        category: "Dairy",
        storage_space: "Fridge",
        quantity: 1,
        image: "cheese.svg",
        notes: "Cheddar block, aged 6 months",
        date_created: firebase.firestore.FieldValue.serverTimestamp()
    }).then((foodRef) => {
        console.log("Document written with ID:", foodRef.id);
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
    if (!btnAddItem) {
        return
    }

    btnAddItem.addEventListener("click", () => {
        addOverlay.classList.toggle('tw-hidden')
    })
})
// Get the currently signed-in user
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        // console.log("current user", user)
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/v8/firebase.User
        var userID = user.uid;
        // console.log(userID)

      // ...
    } else {
        console.log("No user is signed in");
        window.location.href = 'login.html';
    }
});
  
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
        notes: "Heirloom variety, best for salads",
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
        expiry_date: "2024-12-01",
        category: "Dairy",
        storage_space: "Fridge",
        quantity: 1,
        notes: "Cheddar block, aged 6 months",
        date_created: firebase.firestore.FieldValue.serverTimestamp()
    }).then((foodRef) => {
        console.log("Document written with ID:", foodRef.id);
    }).catch((error) => {
        console.error("Error adding document: ", error);
    });
    
}
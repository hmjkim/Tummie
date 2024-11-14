var currentUser;               //global variable which points to the document of the user who is logged in

//Function that calls everything needed for the main page  
function pageSetup() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global

            // the following functions are always called when someone is logged in
            populateFavoriteRecipes(currentUser);

        } else {
            // When no user is signed in, forcefully direct the user to login.html
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
pageSetup();


// Function to populate users' saved recipes
function populateFavoriteRecipes(currentUser) {
    currentUser.get()
        .then(userDoc => {

            // Get the Array of bookmarks
            var favorites = userDoc.data().favorites;
            console.log(favorites);

            let cardTemplate = document.getElementById("recipeCardTemplate"); // Retrieve the HTML element with the ID "recipeCardTemplate" and store it in the cardTemplate variable. 

            favorites.forEach(thisRecipeID => {
                db.collection("recipes").doc(thisRecipeID).get().then(doc => {
                    var title = doc.data().strMeal;       // get value of the "strMeal" key
                    var link = doc.data().strMealThumb
                    var docID = doc.id;
                    let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                    //update title and text and image
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-image').src = link;
                    newcard.querySelector('.card-button').href = "eachRecipe.html?docID=" + docID;

                    newcard.querySelector('i').id = 'save-' + docID;   // add an unique id to each favorite button so that we can distinguish which recipe to be added to be bookmarked and apply event listener accordingly 
                    newcard.querySelector('i').onclick = () => savetoFavorite(docID); // add event listen to invoke function everytime when the favorite button is hit

                    currentUser.get().then(userDoc => {
                        var favorites = userDoc.data().favorites;
                        if (favorites) {
                            if (favorites.includes(docID)) {
                                document.getElementById('save-' + docID).innerText = 'favorite';
                            }
                        }
                    })

                    //attach to gallery, Example: "recipes-go-here"
                    document.getElementById("recipes-go-here").appendChild(newcard);
                })
            })
        })
}


// Function that write saved recipes to database when user hit save button
function savetoFavorite(recipesDocID) {
    currentUser.get().then((userDoc) => {
        const favorites = userDoc.data().favorites;
        currentUser.update({
            favorites: firebase.firestore.FieldValue.arrayRemove(recipesDocID)
        })
            .then(function () {
                console.log(recipesDocID + " has been removed from your Favorite Recipes.");
                let iconID = 'save-' + recipesDocID;
                document.getElementById(iconID).innerText = 'favorite_border';

                document.getElementById("recipes-go-here").innerText = ""; // clear all cards 
                populateFavoriteRecipes(currentUser); // re-populate favorite recipes again
            });
    });
}

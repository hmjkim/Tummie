var currentUser;               //global variable which points to the document of the user who is logged in

//Function that calls everything needed for the main page  
function pageSetup() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);

            // the following functions are always called when someone is logged in
            displayCardsDynamically("recipes");  //input param is the name of the collection

        } else {
            // No user is signed in.
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
pageSetup();


async function readJSONrecipes() {
    const response = await fetch('../AllRecipes.json') // source: https://www.themealdb.com/api.php
    const data = await response.text(); //get text file, string
    const recipes = JSON.parse(data); //convert to JSON
    for (x of recipes.meals) {    //iterate thru each recipe
        db.collection("recipes").add({
            idMeal: x.idMeal,
            strMeal: x.strMeal,
            strDrinkAlternate: x.strDrinkAlternate,
            strCategory: x.strCategory,
            strArea: x.strArea,
            strInstructions: x.strInstructions,
            strMealThumb: x.strMealThumb,
            strTags: x.strTags,
            strYoutube: x.strYoutube,
            strIngredient1: x.strIngredient1,
            strIngredient2: x.strIngredient2,
            strIngredient3: x.strIngredient3,
            strIngredient4: x.strIngredient4,
            strIngredient5: x.strIngredient5,
            strIngredient6: x.strIngredient6,
            strIngredient7: x.strIngredient7,
            strIngredient8: x.strIngredient8,
            strIngredient9: x.strIngredient9,
            strIngredient10: x.strIngredient10,
            strIngredient11: x.strIngredient11,
            strIngredient12: x.strIngredient12,
            strIngredient13: x.strIngredient13,
            strIngredient14: x.strIngredient14,
            strIngredient15: x.strIngredient15,
            strIngredient16: x.strIngredient16,
            strIngredient17: x.strIngredient17,
            strIngredient18: x.strIngredient18,
            strIngredient19: x.strIngredient19,
            strIngredient20: x.strIngredient20,
            strMeasure1: x.strMeasure1,
            strMeasure2: x.strMeasure2,
            strMeasure3: x.strMeasure3,
            strMeasure4: x.strMeasure4,
            strMeasure5: x.strMeasure5,
            strMeasure6: x.strMeasure6,
            strMeasure7: x.strMeasure7,
            strMeasure8: x.strMeasure8,
            strMeasure9: x.strMeasure9,
            strMeasure10: x.strMeasure10,
            strMeasure11: x.strMeasure11,
            strMeasure12: x.strMeasure12,
            strMeasure13: x.strMeasure13,
            strMeasure14: x.strMeasure14,
            strMeasure15: x.strMeasure15,
            strMeasure16: x.strMeasure16,
            strMeasure17: x.strMeasure17,
            strMeasure18: x.strMeasure18,
            strMeasure19: x.strMeasure19,
            strMeasure20: x.strMeasure20,
            strSource: x.strSource,
            strImageSource: x.strImageSource,
            strCreativeCommonsConfirmed: x.strCreativeCommonsConfirmed,
            dateModified: x.dateModified,
        })
    }
}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(recipes) {
    let cardTemplate = document.getElementById("recipeCardTemplate"); // Retrieve the HTML element with the ID "recipeCardTemplate" and store it in the cardTemplate variable. 

    db.collection(recipes).get()   //the collection called "recipes"
        .then(allRecipes => {
            allRecipes.forEach(doc => { //iterate thru each doc
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
                    if (favorites.includes(docID)) {
                        document.getElementById('save-' + docID).innerText = 'favorite';
                    }
                })

                //attach to gallery, Example: "recipes-go-here"
                document.getElementById(recipes + "-go-here").appendChild(newcard);
            })
        })
}


// Function that write saved recipes to database when user hit save button
function savetoFavorite(recipesDocID) {
    currentUser.get().then((userDoc) => {
        const favorites = userDoc.data().favorites;
        if (favorites.includes(recipesDocID)) {
            currentUser.update({
                favorites: firebase.firestore.FieldValue.arrayRemove(recipesDocID)
            })
                .then(function () {
                    console.log(recipesDocID + "has been removed from your Favorite Recipes.");
                    let iconID = 'save-' + recipesDocID;
                    document.getElementById(iconID).innerText = 'favorite_border';
                });
        }
        else {
            currentUser.update({
                favorites: firebase.firestore.FieldValue.arrayUnion(recipesDocID)
            })
                .then(function () {
                    console.log(recipesDocID + "has been added to your Favorite Recipes.");
                    let iconID = 'save-' + recipesDocID;
                    document.getElementById(iconID).innerText = 'favorite';
                });
        }
    });
}

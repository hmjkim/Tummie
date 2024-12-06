var currentUser;               //global variable which points to the document of the user who is logged in

//Function that calls everything needed for the main page  
function pageSetup() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global

            // the following functions are always called when someone is logged in
            displayRecipeInfo();

        } else {
            // When no user is signed in, forcefully direct the user to login.html
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
pageSetup();

function displayRecipeInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    let pageNumber = params.searchParams.get("page") //get value for key "page"
    let cuisine = params.searchParams.get("cuisine") //get value for key "cuisine"

    document.querySelector('i').id = 'save-' + ID;   // add an unique id to each favorite button so that we can distinguish which recipe to be added to be bookmarked and apply event listener accordingly 
    document.querySelector('i').onclick = () => savetoFavorite(ID); // add event listen to invoke function everytime when the favorite button is hit

    // link 'Back to All Recipes' button to the page number the user was in
    document.querySelector('a').href = `/recipes.html?cuisine=${cuisine}&page=${pageNumber}`

    db.collection("recipes")
        .doc(ID)
        .get()
        .then(doc => {
            recipeImage = doc.data().strMealThumb;
            recipeName = doc.data().strMeal;
            recipeInstructions = doc.data().strInstructions

            document.getElementById("recipeName").innerHTML = recipeName;
            let imgEvent = document.querySelector(".recipe-img");
            imgEvent.src = recipeImage;
            document.getElementById("details-go-here").innerHTML = recipeInstructions;

            for (i = 1; i <= 20; i++) {
                if (doc.data()[`strMeasure${i}`] != "" && doc.data()[`strMeasure${i}`] != " " && doc.data()[`strMeasure${i}`] != null) {
                    ingredientName = doc.data()[`strIngredient${i}`]
                    ingredientMeasure = doc.data()[`strMeasure${i}`]
                    document.getElementById("ingredients").innerHTML += ingredientName + "<br/>"
                    document.getElementById("measurements").innerHTML += ingredientMeasure + "<br/>"
                }
            }

            currentUser.get().then(userDoc => {
                var favorites = userDoc.data().favorites;
                if (favorites) {
                    if (favorites.includes(ID)) {
                        document.getElementById('save-' + ID).innerText = 'favorite';
                    }
                }
            })
        });
}

// Function that write saved recipes to database when user hit save button
function savetoFavorite(recipesDocID) {
    currentUser.get().then((userDoc) => {
        const favorites = userDoc.data().favorites;
        if (favorites && favorites.includes(recipesDocID)) {
            currentUser.update({
                favorites: firebase.firestore.FieldValue.arrayRemove(recipesDocID)
            })
                .then(function () {
                    console.log(recipesDocID + " has been removed from your Favorite Recipes.");
                    let iconID = 'save-' + recipesDocID;
                    document.getElementById(iconID).innerText = 'favorite_border';
                });
        }
        else {
            currentUser.update({
                favorites: firebase.firestore.FieldValue.arrayUnion(recipesDocID)
            })
                .then(function () {
                    console.log(recipesDocID + " has been added to your Favorite Recipes.");
                    let iconID = 'save-' + recipesDocID;
                    document.getElementById(iconID).innerText = 'favorite';
                });
        }
    });
}
var currentUser;               //global variable which points to the document of the user who is logged in

//Function that calls everything needed for the main page  
function pageSetup() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global
            console.log(currentUser);

            // the following functions are always called when someone is logged in
            displayCardsDynamically("recipes", pageNumber);  //input param is the name of the collection

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
// Set initial page number for pagination
//------------------------------------------------------------------------------
var pageNumber = 1

//------------------------------------------------------------------------------
// Set the number of recipes per page for pagination
//------------------------------------------------------------------------------
const CARDS_PER_PAGE = 3;

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(recipes, pageNumber) {
    let cardTemplate = document.getElementById("recipeCardTemplate"); // Retrieve the HTML element with the ID "recipeCardTemplate" and store it in the cardTemplate variable.

    // Clear existing recipe cards before loading new cards
    document.getElementById("recipes-go-here").innerHTML = ``

    db.collection(recipes).get() // the collection called "recipes"
        .then(allRecipes => {
            const TOTAL_NUMBER_OF_PAGES = Math.ceil(allRecipes.docs.length / CARDS_PER_PAGE);

            document.getElementById("pageInfo").innerHTML = `Showing ${(pageNumber - 1) * CARDS_PER_PAGE + 1} - ${pageNumber * CARDS_PER_PAGE} of ${allRecipes.docs.length} Recipes`

            if (pageNumber == 1) {
                db.collection(recipes).limit(CARDS_PER_PAGE).get() // display (CARDS_PER_PAGE) recipe cards only
                    .then(allRecipes => {
                        allRecipes.forEach(doc => { //iterate through each doc
                            var title = doc.data().strMeal;       // get value of the "strMeal" key
                            var link = doc.data().strMealThumb;    // get link of the recipe image
                            var docID = doc.id;   // get document ID
                            let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                            //update title, text, and image
                            newcard.querySelector('.card-title').innerHTML = title;  // update title
                            newcard.querySelector('.card-image').src = link; // update image
                            newcard.querySelector('.card-button').href = "eachRecipe.html?docID=" + docID; // link the button with the document ID
                            newcard.querySelector('i').id = 'save-' + docID;   // add an unique id to each favorite button so that we can distinguish which recipe to be added to be bookmarked and apply event listener accordingly 
                            newcard.querySelector('i').onclick = () => savetoFavorite(docID); // add event listen to invoke function everytime when the favorite button is hit

                            // Check if the recipe is already saved or not
                            currentUser.get().then(userDoc => {
                                var favorites = userDoc.data().favorites;
                                if (favorites) {
                                    if (favorites.includes(docID)) {
                                        document.getElementById('save-' + docID).innerText = 'favorite';
                                    }
                                }
                            })

                            //attach to gallery, Example: "recipes-go-here"
                            document.getElementById(recipes + "-go-here").appendChild(newcard);
                        })
                    })
            } else {
                LastVisible = allRecipes.docs[(CARDS_PER_PAGE * (pageNumber - 1)) - 1] // use the last document in a batch as the start of a cursor for the next batch

                db.collection(recipes).startAfter(LastVisible).limit(CARDS_PER_PAGE).get() // display the next batch using the cursor
                    .then(allRecipes => {
                        allRecipes.forEach(doc => { //iterate thru each doc
                            var title = doc.data().strMeal;       // get value of the "strMeal" key
                            var link = doc.data().strMealThumb;    // get link of the recipe image
                            var docID = doc.id;   // get document ID
                            let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                            //update title and text and image
                            newcard.querySelector('.card-title').innerHTML = title;  // update title
                            newcard.querySelector('.card-image').src = link; // update image
                            newcard.querySelector('.card-button').href = "eachRecipe.html?docID=" + docID; // link the button with the document ID
                            newcard.querySelector('i').id = 'save-' + docID;   // add an unique id to each favorite button so that we can distinguish which recipe to be added to be bookmarked and apply event listener accordingly 
                            newcard.querySelector('i').onclick = () => savetoFavorite(docID); // add event listen to invoke function everytime when the favorite button is hit

                            // Check if the recipe is already saved or not
                            currentUser.get().then(userDoc => {
                                var favorites = userDoc.data().favorites;
                                if (favorites) {
                                    if (favorites.includes(docID)) {
                                        document.getElementById('save-' + docID).innerText = 'favorite';
                                    }
                                }
                            })

                            //attach to gallery, Example: "recipes-go-here"
                            document.getElementById(recipes + "-go-here").appendChild(newcard);
                        })
                    })
            }

            // Create pagination
            pagination(pageNumber, TOTAL_NUMBER_OF_PAGES)
        })
}


function pagination(pageNumber, TOTAL_NUMBER_OF_PAGES) {

    // Clear existing pagination buttons before loading new buttons
    document.getElementById("prevBtn").innerHTML = ``
    document.getElementById("pageBtns").innerHTML = ``
    document.getElementById("nextBtn").innerHTML = ``

    // Create pagination buttons
    // Previous page
    if (pageNumber >= 2) {
        prevBtnHtml = ``
        prevBtnHtml += `<li>
                    <a id="prevBtnLink" class="page-link rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#" aria-label="Previous">
                    <i class="material-icons tw-text-neutral">chevron_left</i>
                    </a>
                    </li>`

        prevBtnDiv = document.createElement(`div`)
        prevBtnDiv.innerHTML = prevBtnHtml

        prevBtn.appendChild(prevBtnDiv)
    }

    // First page
    firstBtnHtml = ``
    firstBtnHtml += `<li id="pageBtn1" class="pageBtn"><a id="pageBtnLink1" class="page-link pageBtnLink tw-text-neutral rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#">1</a></li>`

    firstBtnDiv = document.createElement(`div`)
    firstBtnDiv.innerHTML = firstBtnHtml

    pageBtns.appendChild(firstBtnDiv)

    // placeholder ... button
    if (pageNumber >= 3) {
        placeholderBtnHtml = ``
        placeholderBtnHtml += `<li class="tw-pointer-events-none"><a class="page-link tw-text-neutral rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#" tabindex="-1">...</a></li>`

        placeholderBtnDiv = document.createElement(`div`)
        placeholderBtnDiv.innerHTML = placeholderBtnHtml

        pageBtns.appendChild(placeholderBtnDiv)
    }

    // Middle pages
    if (pageNumber <= 2) {
        for (let i = 2; i <= 3; i++) {
            pageBtnHtml = ``
            pageBtnHtml += `<li id="pageBtn${i}" class="pageBtn"><a id="pageBtnLink${i}" class="page-link pageBtnLink tw-text-neutral rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#">${i}</a></li>`

            pageBtnDiv = document.createElement(`div`)
            pageBtnDiv.innerHTML = pageBtnHtml

            pageBtns.appendChild(pageBtnDiv)
        }
    } else if (pageNumber == 3) {
        for (let i = pageNumber; i <= pageNumber + 2; i++) {
            pageBtnHtml = ``
            pageBtnHtml += `<li id="pageBtn${i}" class="pageBtn"><a id="pageBtnLink${i}" class="page-link pageBtnLink tw-text-neutral rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#">${i}</a></li>`

            pageBtnDiv = document.createElement(`div`)
            pageBtnDiv.innerHTML = pageBtnHtml

            pageBtns.appendChild(pageBtnDiv)
        }
    } else if (pageNumber > 3 && pageNumber < TOTAL_NUMBER_OF_PAGES - 2) {
        for (let i = pageNumber - 1; i <= pageNumber + 1; i++) {
            pageBtnHtml = ``
            pageBtnHtml += `<li id="pageBtn${i}" class="pageBtn"><a id="pageBtnLink${i}" class="page-link pageBtnLink tw-text-neutral rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#">${i}</a></li>`

            pageBtnDiv = document.createElement(`div`)
            pageBtnDiv.innerHTML = pageBtnHtml

            pageBtns.appendChild(pageBtnDiv)
        }
    } else if (pageNumber >= TOTAL_NUMBER_OF_PAGES - 2) {
        for (let i = TOTAL_NUMBER_OF_PAGES - 2; i <= TOTAL_NUMBER_OF_PAGES - 1; i++) {
            pageBtnHtml = ``
            pageBtnHtml += `<li id="pageBtn${i}" class="pageBtn"><a id="pageBtnLink${i}" class="page-link pageBtnLink tw-text-neutral rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#">${i}</a></li>`

            pageBtnDiv = document.createElement(`div`)
            pageBtnDiv.innerHTML = pageBtnHtml

            pageBtns.appendChild(pageBtnDiv)
        }
    }

    // placeholder ... button
    if (pageNumber <= TOTAL_NUMBER_OF_PAGES - 3) {
        placeholderBtnHtml = ``
        placeholderBtnHtml += `<li class="pageBtn tw-pointer-events-none"><a class="page-link tw-text-neutral rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#" tabindex="-1">...</a></li>`

        placeholderBtnDiv = document.createElement(`div`)
        placeholderBtnDiv.innerHTML = placeholderBtnHtml

        pageBtns.appendChild(placeholderBtnDiv)
    }

    // Last page
    lastBtnHtml = ``
    lastBtnHtml += `<li id="pageBtn${TOTAL_NUMBER_OF_PAGES}" class="pageBtn"><a id="pageBtnLink${TOTAL_NUMBER_OF_PAGES}" class="page-link pageBtnLink tw-text-neutral rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#">${TOTAL_NUMBER_OF_PAGES}</a></li>`

    lastBtnDiv = document.createElement(`div`)
    lastBtnDiv.innerHTML = lastBtnHtml

    pageBtns.appendChild(lastBtnDiv)

    // Next page
    if (pageNumber <= TOTAL_NUMBER_OF_PAGES - 1) {
        nextBtnHtml = ``
        nextBtnHtml += `<li>
                    <a id="nextBtnLink" class="page-link rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#" aria-label="Next">
                    <i class="material-icons tw-text-neutral">chevron_right</i>
                    </a>
                    </li>`

        nextBtnDiv = document.createElement(`div`)
        nextBtnDiv.innerHTML = nextBtnHtml

        nextBtn.appendChild(nextBtnDiv)
    }

    // Highlight current page
    btnsDisplayed = document.getElementsByClassName("pageBtnLink")
    for (let i = 0; i < btnsDisplayed.length; i++) {
        if (btnsDisplayed[i].innerText == pageNumber) {
            document.getElementById(`pageBtnLink${pageNumber}`).classList.remove("tw-text-neutral")
            document.getElementById(`pageBtnLink${pageNumber}`).classList.add("tw-bg-primary", "tw-text-white")
        }
    }

    // On Click event listener for each button

    // Prev button
    if (pageNumber > 1) {
        document.getElementById("prevBtnLink").addEventListener("click", () => {
            pageNumber--
            displayCardsDynamically("recipes", pageNumber)
        })
    }

    // Page buttons
    for (let i = 0; i < btnsDisplayed.length; i++) {
        btnsDisplayed[i].addEventListener("click", () => {
            pageNumber = parseInt(btnsDisplayed[i].innerText)
            displayCardsDynamically("recipes", pageNumber)
        })
    }

    // Next button
    if (pageNumber < TOTAL_NUMBER_OF_PAGES) {
        document.getElementById("nextBtnLink").addEventListener("click", () => {
            pageNumber++
            displayCardsDynamically("recipes", pageNumber)
        })
    }
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

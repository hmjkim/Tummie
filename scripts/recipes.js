const filterOverlay = document.querySelector('.js-filter-overlay');
const filterOverlayTrigger = document.querySelector(".js-filter");
const closeBtn = document.querySelector('.js-close-btn');

var currentUser;               //global variable which points to the document of the user who is logged in

//Function that calls everything needed for the main page  
function pageSetup() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global

            // the following functions are always called when someone is logged in
            displayCardsDynamically("recipes");  //input param is the name of the collection
            toggleFilterOverlay()
            populateFilterByCuisineList()

        } else {
            // When no user is signed in, forcefully direct the user to login.html
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
// Set the number of recipes per page for pagination
//------------------------------------------------------------------------------
const CARDS_PER_PAGE = 9;

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(recipes) {
    var params = new URL(window.location.href)

    // Get page number from URL
    var pageNumber = params.searchParams.get("page")
    if (pageNumber == null) {
        pageNumber = 1
    } else {
        pageNumber = parseInt(pageNumber)
    }

    // Get cuisine from URL
    var cuisine = params.searchParams.get("cuisine")
    if (cuisine == null) {
        cuisine = 'All'
    }

    // Clear existing recipe cards before loading new cards
    document.getElementById("recipes-go-here").innerHTML = ``

    if (cuisine == 'All') {
        db.collection(recipes).get() // the collection called "recipes"
            .then(allRecipes => {
                const TOTAL_NUMBER_OF_PAGES = Math.ceil(allRecipes.docs.length / CARDS_PER_PAGE);

                // Display page info
                if (allRecipes.docs.length < 2) {
                    document.getElementById("pageInfo").innerHTML = `Showing ${allRecipes.docs.length} of ${allRecipes.docs.length} Recipes`
                } else if (pageNumber * CARDS_PER_PAGE > allRecipes.docs.length) {
                    document.getElementById("pageInfo").innerHTML = `Showing ${(pageNumber - 1) * CARDS_PER_PAGE + 1} - ${allRecipes.docs.length} of ${allRecipes.docs.length} Recipes`
                } else {
                    document.getElementById("pageInfo").innerHTML = `Showing ${(pageNumber - 1) * CARDS_PER_PAGE + 1} - ${pageNumber * CARDS_PER_PAGE} of ${allRecipes.docs.length} Recipes`
                }

                // Display recipe cards
                if (pageNumber == 1) {
                    db.collection(recipes).limit(CARDS_PER_PAGE).get() // display (CARDS_PER_PAGE) recipe cards only
                        .then(allRecipes => createCards(allRecipes, cuisine, pageNumber))
                } else {
                    LastVisible = allRecipes.docs[(CARDS_PER_PAGE * (pageNumber - 1)) - 1] // use the last document in a batch as the start of a cursor for the next batch

                    db.collection(recipes).startAfter(LastVisible).limit(CARDS_PER_PAGE).get() // display the next batch using the cursor
                        .then(allRecipes => createCards(allRecipes, cuisine, pageNumber))
                }

                // Create pagination
                pagination(cuisine, pageNumber, TOTAL_NUMBER_OF_PAGES)
            })
    } else {
        db.collection(recipes).where('strArea', '==', cuisine).get() // the collection called "recipes"
            .then(allRecipes => {
                const TOTAL_NUMBER_OF_PAGES = Math.ceil(allRecipes.docs.length / CARDS_PER_PAGE);

                // Display page info
                if (allRecipes.docs.length < 2) {
                    document.getElementById("pageInfo").innerHTML = `Showing ${allRecipes.docs.length} of ${allRecipes.docs.length} Recipes`
                } else if (pageNumber * CARDS_PER_PAGE > allRecipes.docs.length) {
                    document.getElementById("pageInfo").innerHTML = `Showing ${(pageNumber - 1) * CARDS_PER_PAGE + 1} - ${allRecipes.docs.length} of ${allRecipes.docs.length} Recipes`
                } else {
                    document.getElementById("pageInfo").innerHTML = `Showing ${(pageNumber - 1) * CARDS_PER_PAGE + 1} - ${pageNumber * CARDS_PER_PAGE} of ${allRecipes.docs.length} Recipes`
                }

                // Display recipe cards
                if (pageNumber == 1) {
                    db.collection(recipes).where('strArea', '==', cuisine).limit(CARDS_PER_PAGE).get() // display (CARDS_PER_PAGE) recipe cards only
                        .then(allRecipes => createCards(allRecipes, cuisine, pageNumber))
                } else {
                    LastVisible = allRecipes.docs[(CARDS_PER_PAGE * (pageNumber - 1)) - 1] // use the last document in a batch as the start of a cursor for the next batch

                    db.collection(recipes).where('strArea', '==', cuisine).startAfter(LastVisible).limit(CARDS_PER_PAGE).get() // display the next batch using the cursor
                        .then(allRecipes => createCards(allRecipes, cuisine, pageNumber))
                }

                // Create pagination
                pagination(cuisine, pageNumber, TOTAL_NUMBER_OF_PAGES)
            })
    }
}


function createCards(allRecipes, cuisine, pageNumber) {
    let cardTemplate = document.getElementById("recipeCardTemplate"); // Retrieve the HTML element with the ID "recipeCardTemplate" and store it in the cardTemplate variable.

    allRecipes.forEach(doc => { //iterate through each doc
        var title = doc.data().strMeal;       // get value of the "strMeal" key
        var link = doc.data().strMealThumb;    // get link of the recipe image
        var docID = doc.id;   // get document ID
        let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

        //update title, text, and image
        newcard.querySelector('.card-title').innerHTML = title;  // update title
        newcard.querySelector('.card-image').src = link; // update image
        newcard.querySelector('.card-button').href = `eachRecipe.html?cuisine=${cuisine}&page=${pageNumber}&docID=${docID}`; // link the button with the document ID and page number
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

        //attach to "recipes-go-here"
        document.getElementById("recipes-go-here").appendChild(newcard);
    })
}


function pagination(cuisine, pageNumber, TOTAL_NUMBER_OF_PAGES) {

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
    if (pageNumber >= 3 && TOTAL_NUMBER_OF_PAGES > 7) {
        placeholderBtnHtml = ``
        placeholderBtnHtml += `<li class="tw-pointer-events-none"><a class="page-link tw-text-neutral rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#" tabindex="-1">...</a></li>`

        placeholderBtnDiv = document.createElement(`div`)
        placeholderBtnDiv.innerHTML = placeholderBtnHtml

        pageBtns.appendChild(placeholderBtnDiv)
    }

    // Middle pages
    if (TOTAL_NUMBER_OF_PAGES > 7) {
        if (pageNumber <= 2) {
            for (let i = 2; i <= 3; i++) {
                createPageBtn(i)
            }
        } else if (pageNumber == 3) {
            for (let i = pageNumber; i <= pageNumber + 2; i++) {
                createPageBtn(i)
            }
        } else if (pageNumber > 3 && pageNumber < TOTAL_NUMBER_OF_PAGES - 2) {
            for (let i = pageNumber - 1; i <= pageNumber + 1; i++) {
                createPageBtn(i)
            }
        } else if (pageNumber >= TOTAL_NUMBER_OF_PAGES - 2) {
            for (let i = TOTAL_NUMBER_OF_PAGES - 2; i <= TOTAL_NUMBER_OF_PAGES - 1; i++) {
                createPageBtn(i)
            }
        }
    } else {
        for (let i = 2; i < TOTAL_NUMBER_OF_PAGES; i++) {
            createPageBtn(i)
        }
    }

    // placeholder ... button
    if (pageNumber <= TOTAL_NUMBER_OF_PAGES - 3 && TOTAL_NUMBER_OF_PAGES > 7) {
        placeholderBtnHtml = ``
        placeholderBtnHtml += `<li class="pageBtn tw-pointer-events-none"><a class="page-link tw-text-neutral rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#" tabindex="-1">...</a></li>`

        placeholderBtnDiv = document.createElement(`div`)
        placeholderBtnDiv.innerHTML = placeholderBtnHtml

        pageBtns.appendChild(placeholderBtnDiv)
    }

    // Last page
    if (TOTAL_NUMBER_OF_PAGES > 1) {
        lastBtnHtml = ``
        lastBtnHtml += `<li id="pageBtn${TOTAL_NUMBER_OF_PAGES}" class="pageBtn"><a id="pageBtnLink${TOTAL_NUMBER_OF_PAGES}" class="page-link pageBtnLink tw-text-neutral rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#">${TOTAL_NUMBER_OF_PAGES}</a></li>`

        lastBtnDiv = document.createElement(`div`)
        lastBtnDiv.innerHTML = lastBtnHtml

        pageBtns.appendChild(lastBtnDiv)
    }

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
            document.getElementById("prevBtnLink").href = `recipes.html?cuisine=${cuisine}&page=${pageNumber}`
            displayCardsDynamically("recipes")
        })
    }

    // Page buttons
    for (let i = 0; i < btnsDisplayed.length; i++) {
        btnsDisplayed[i].addEventListener("click", () => {
            pageNumber = parseInt(btnsDisplayed[i].innerText)
            btnsDisplayed[i].href = `recipes.html?cuisine=${cuisine}&page=${pageNumber}`
            displayCardsDynamically("recipes")
        })
    }

    // Next button
    if (pageNumber < TOTAL_NUMBER_OF_PAGES) {
        document.getElementById("nextBtnLink").addEventListener("click", () => {
            pageNumber++
            document.getElementById("nextBtnLink").href = `recipes.html?cuisine=${cuisine}&page=${pageNumber}`
            displayCardsDynamically("recipes")
        })
    }
}


function createPageBtn(index) {
    pageBtnHtml = ``
    pageBtnHtml += `<li id="pageBtn${index}" class="pageBtn"><a id="pageBtnLink${index}" class="page-link pageBtnLink tw-text-neutral rounded tw-border-none tw-flex tw-justify-center tw-items-center tw-w-[36px] tw-h-[36px]" href="#">${index}</a></li>`

    pageBtnDiv = document.createElement(`div`)
    pageBtnDiv.innerHTML = pageBtnHtml

    pageBtns.appendChild(pageBtnDiv)
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


function toggleFilterOverlay() {
    filterOverlayTrigger.addEventListener("click", () => {
        // Show or hide the overlay based on the new state
        filterOverlay.classList.toggle("tw-hidden");
    });

    // Close overlay when clicking the close button
    closeBtn.addEventListener('click', () => {
        filterOverlay.classList.toggle("tw-hidden");
    });
}


function populateFilterByCuisineList() {
    // Get cuisine from URL
    var params = new URL(window.location.href)
    var cuisine = params.searchParams.get("cuisine")
    if (cuisine == null) {
        cuisine = 'All'
    }

    let filterCuisineTemplate = document.getElementById("filterCuisineTemplate"); // Retrieve the HTML element with the ID "filterCuisineTemplate" and store it in the filterCuisineTemplate variable.

    // Clear existing recipe cards before loading new cards
    document.getElementById("filterCuisine-go-here").innerHTML = ``

    cuisineOptions = ['All', 'American', 'British', 'Canadian', 'Chinese', 'Croatian', 'Dutch', 'Egyptian', 'Filipino', 'French', 'Greek', 'Indian', 'Irish', 'Italian', 'Jamaican', 'Japanese', 'Kenyan', 'Malaysian', 'Mexican', 'Moroccan', 'Polish', 'Portuguese', 'Russian', 'Spanish', 'Thai', 'Tunisian', 'Turkish', 'Ukrainian', 'Vietnamese']

    cuisineOptions.forEach(cuisineName => { //iterate through each item
        let newCuisine = filterCuisineTemplate.content.cloneNode(true); // Clone the HTML template to create a new cuisine option

        newCuisine.querySelector('.form-check-label').innerHTML = cuisineName;  // update label name
        newCuisine.querySelector('.form-check-input').id = cuisineName;     // update 'id' of the radio button
        newCuisine.querySelector('.form-check-label').htmlFor = cuisineName;   // update 'for' of the label

        // update radio button to be shown selected when current option
        if (cuisineName == cuisine) {
            newCuisine.querySelector('.form-check-input').checked = true;
        }

        //attach to "filterCuisine-go-here"
        document.getElementById("filterCuisine-go-here").appendChild(newCuisine);
    })

    // Add event listener for each radio button
    cuisineFilterLists = document.querySelectorAll(".form-check-label")
    cuisineFilterLists.forEach(element => {
        element.addEventListener("click", () => {
            window.location.href = `recipes.html?cuisine=${element.innerHTML}`
        })
    });
}
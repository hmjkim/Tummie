var currentUser;               //global variable which points to the document of the user who is logged in

//Function that calls everything needed for the main page  
function pageSetup() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = db.collection("users").doc(user.uid); //global

            // the following functions are always called when someone is logged in
            populateFavoriteRecipes(currentUser, pageNumber);

        } else {
            // When no user is signed in, forcefully direct the user to login.html
            console.log("No user is signed in");
            window.location.href = "login.html";
        }
    });
}
pageSetup();


//------------------------------------------------------------------------------
// Set initial page number for pagination
//------------------------------------------------------------------------------
var pageNumber = 1

//------------------------------------------------------------------------------
// Set the number of recipes per page for pagination
//------------------------------------------------------------------------------
const CARDS_PER_PAGE = 3;

// Function to populate users' saved recipes
function populateFavoriteRecipes(currentUser, pageNumber) {
    currentUser.get()
        .then(userDoc => {

            // Get the Array of bookmarks
            var favorites = userDoc.data().favorites;
            // console.log(favorites);

            // Create an array containing recipes on the current page only
            var favoritesCurrentPage = []
            if (pageNumber * CARDS_PER_PAGE > favorites.length) {
                for (i = (pageNumber - 1) * CARDS_PER_PAGE; i < favorites.length; i++) {
                    favoritesCurrentPage.push(favorites[i])
                }
            } else {
                for (i = (pageNumber - 1) * CARDS_PER_PAGE; i < pageNumber * CARDS_PER_PAGE; i++) {
                    favoritesCurrentPage.push(favorites[i])
                }
            }

            // Calculate the total number of pages for pagination
            const TOTAL_NUMBER_OF_PAGES = Math.ceil(favorites.length / CARDS_PER_PAGE);

            // Display page info
            if (pageNumber * CARDS_PER_PAGE > favorites.length) {
                document.getElementById("pageInfo").innerHTML = `Showing ${(pageNumber - 1) * CARDS_PER_PAGE + 1} - ${favorites.length} of ${favorites.length} Recipes`
            } else {
                document.getElementById("pageInfo").innerHTML = `Showing ${(pageNumber - 1) * CARDS_PER_PAGE + 1} - ${pageNumber * CARDS_PER_PAGE} of ${favorites.length} Recipes`
            }

            let cardTemplate = document.getElementById("recipeCardTemplate"); // Retrieve the HTML element with the ID "recipeCardTemplate" and store it in the cardTemplate variable. 

            // Clear existing recipe cards before loading new cards
            document.getElementById("recipes-go-here").innerHTML = ``

            favoritesCurrentPage.forEach(thisRecipeID => {
                db.collection("recipes").doc(thisRecipeID).get().then(doc => {
                    var title = doc.data().strMeal;       // get value of the "strMeal" key
                    var link = doc.data().strMealThumb
                    var docID = doc.id;
                    let newcard = cardTemplate.content.cloneNode(true); // Clone the HTML template to create a new card (newcard) that will be filled with Firestore data.

                    //update title and text and image
                    newcard.querySelector('.card-title').innerHTML = title;
                    newcard.querySelector('.card-image').src = link;
                    newcard.querySelector('.card-button').href = "eachFavouriteRecipe.html?docID=" + docID;

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
            populateFavoriteRecipes(currentUser, pageNumber)
        })
    }

    // Page buttons
    for (let i = 0; i < btnsDisplayed.length; i++) {
        btnsDisplayed[i].addEventListener("click", () => {
            pageNumber = parseInt(btnsDisplayed[i].innerText)
            populateFavoriteRecipes(currentUser, pageNumber)
        })
    }

    // Next button
    if (pageNumber < TOTAL_NUMBER_OF_PAGES) {
        document.getElementById("nextBtnLink").addEventListener("click", () => {
            pageNumber++
            populateFavoriteRecipes(currentUser, pageNumber)
        })
    }
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

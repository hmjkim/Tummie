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
// Set initial page number for pagination
//------------------------------------------------------------------------------
var page_number = 1

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(recipes) {
    let cardTemplate = document.getElementById("recipeCardTemplate"); // Retrieve the HTML element with the ID "recipeCardTemplate" and store it in the cardTemplate variable.

    document.getElementById("recipes-go-here").innerHTML = ``
    document.getElementById("prev_btn").innerHTML = ``
    document.getElementById("page_btns").innerHTML = ``
    document.getElementById("next_btn").innerHTML = ``

    db.collection(recipes).get() // the collection called "recipes"
        .then(pagination => {
            const CARDS_PER_PAGE = 3;
            const TOTAL_NUMBER_OF_PAGES = Math.ceil(pagination.docs.length / CARDS_PER_PAGE);

            document.getElementById("page_info").innerHTML = `Page ${page_number} out of ${TOTAL_NUMBER_OF_PAGES}`

            if (page_number == 1) {
                db.collection(recipes).limit(CARDS_PER_PAGE).get() // display (CARDS_PER_PAGE) recipe cards only
                    .then(allRecipes => {
                        allRecipes.forEach(doc => { //iterate thru each doc
                            var title = doc.data().strMeal;       // get value of the "strMeal" key
                            var link = doc.data().strMealThumb;
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
                            document.getElementById(recipes + "-go-here").appendChild(newcard);
                        })
                    })
            } else {
                LastVisible = pagination.docs[(CARDS_PER_PAGE * (page_number - 1)) - 1] // use the last document in a batch as the start of a cursor for the next batch

                db.collection(recipes).startAfter(LastVisible).limit(CARDS_PER_PAGE).get() // display the next batch using the cursor
                    .then(allRecipes => {
                        allRecipes.forEach(doc => { //iterate thru each doc
                            var title = doc.data().strMeal;       // get value of the "strMeal" key
                            var link = doc.data().strMealThumb;
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
                            document.getElementById(recipes + "-go-here").appendChild(newcard);
                        })
                    })
            }

            // Pagination
            // Previous page
            if (page_number >= 2) {
                prev_button_html = ``
                prev_button_html += `<li>
                <a class="page-link rounded tw-border-none" href="#" aria-label="Previous">
                  <i class="material-icons tw-text-neutral">chevron_left</i>
                </a>
                </li>`

                prev_button = document.createElement(`div`)
                prev_button.innerHTML = prev_button_html

                prev_btn.appendChild(prev_button)
            }

            // First page
            first_button_html = ``
            first_button_html += `<li id="pageBtn1" class="page_btn"><a id="pageBtnLink1" class="page-link tw-text-neutral rounded tw-border-none" href="#">1</a></li>`

            first_button = document.createElement(`div`)
            first_button.innerHTML = first_button_html

            page_btns.appendChild(first_button)

            // placeholder ... button
            if (page_number >= 3) {
                placeholder_button_html = ``
                placeholder_button_html += `<li class="page_btn tw-pointer-events-none"><a class="page-link tw-text-neutral rounded tw-border-none" href="#" tabindex="-1">...</a></li>`

                placeholder_button = document.createElement(`div`)
                placeholder_button.innerHTML = placeholder_button_html

                page_btns.appendChild(placeholder_button)
            }

            // Middle pages
            if (page_number <= 2) {
                for (i = 2; i <= 3; i++) {
                    page_btn_html = ``
                    page_btn_html += `<li id="pageBtn${i}" class="page_btn"><a id="pageBtnLink${i}" class="page-link tw-text-neutral rounded tw-border-none" href="#">${i}</a></li>`

                    page_btn = document.createElement(`div`)
                    page_btn.innerHTML = page_btn_html

                    page_btns.appendChild(page_btn)
                }
            } else if (page_number == 3) {
                for (i = page_number; i <= page_number + 2; i++) {
                    page_btn_html = ``
                    page_btn_html += `<li id="pageBtn${i}" class="page_btn"><a id="pageBtnLink${i}" class="page-link tw-text-neutral rounded tw-border-none" href="#">${i}</a></li>`

                    page_btn = document.createElement(`div`)
                    page_btn.innerHTML = page_btn_html

                    page_btns.appendChild(page_btn)
                }
            } else if (page_number > 3 && page_number < TOTAL_NUMBER_OF_PAGES - 2) {
                for (i = page_number - 1; i <= page_number + 1; i++) {
                    page_btn_html = ``
                    page_btn_html += `<li id="pageBtn${i}" class="page_btn"><a id="pageBtnLink${i}" class="page-link tw-text-neutral rounded tw-border-none" href="#">${i}</a></li>`

                    page_btn = document.createElement(`div`)
                    page_btn.innerHTML = page_btn_html

                    page_btns.appendChild(page_btn)
                }
            } else if (page_number >= TOTAL_NUMBER_OF_PAGES - 2) {
                for (i = TOTAL_NUMBER_OF_PAGES - 2; i <= TOTAL_NUMBER_OF_PAGES - 1; i++) {
                    page_btn_html = ``
                    page_btn_html += `<li id="pageBtn${i}" class="page_btn"><a id="pageBtnLink${i}" class="page-link tw-text-neutral rounded tw-border-none" href="#">${i}</a></li>`

                    page_btn = document.createElement(`div`)
                    page_btn.innerHTML = page_btn_html

                    page_btns.appendChild(page_btn)
                }
            }

            // placeholder ... button
            if (page_number <= TOTAL_NUMBER_OF_PAGES - 3) {
                placeholder_button_html = ``
                placeholder_button_html += `<li class="page_btn tw-pointer-events-none"><a class="page-link tw-text-neutral rounded tw-border-none" href="#" tabindex="-1">...</a></li>`

                placeholder_button = document.createElement(`div`)
                placeholder_button.innerHTML = placeholder_button_html

                page_btns.appendChild(placeholder_button)
            }

            // Last page
            last_button_html = ``
            last_button_html += `<li id="pageBtn${TOTAL_NUMBER_OF_PAGES}" class="page_btn"><a id="pageBtnLink${TOTAL_NUMBER_OF_PAGES}" class="page-link tw-text-neutral rounded tw-border-none" href="#">${TOTAL_NUMBER_OF_PAGES}</a></li>`

            last_button = document.createElement(`div`)
            last_button.innerHTML = last_button_html

            page_btns.appendChild(last_button)

            // Next page
            if (page_number <= TOTAL_NUMBER_OF_PAGES - 1) {
                next_button_html = ``
                next_button_html += `<li>
                    <a class="page-link rounded tw-border-none" href="#" aria-label="Next">
                    <i class="material-icons tw-text-neutral">chevron_right</i>
                    </a>
                    </li>`

                next_button = document.createElement(`div`)
                next_button.innerHTML = next_button_html

                next_btn.appendChild(next_button)
            }

            // On Click event listener for each button
            for (i = 1; i <= TOTAL_NUMBER_OF_PAGES; i++) {
                document.querySelector(`#pageBtnLink${i}`).onclick = (event) => {
                    clickedElementId = event.target.id;
                    page_number = clickedElementId.replace("pageBtnLink", "")
                    console.log(page_number)
                    displayCardsDynamically("recipes")
                }
            }
        })
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

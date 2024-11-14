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
var page_number = 2

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(recipes) {
    let cardTemplate = document.getElementById("recipeCardTemplate"); // Retrieve the HTML element with the ID "recipeCardTemplate" and store it in the cardTemplate variable.

    db.collection(recipes).get() // the collection called "recipes"
        .then(pagination => {
            const CARDS_PER_PAGE = 3;
            const TOTAL_NUMBER_OF_PAGES = Math.ceil(pagination.docs.length / CARDS_PER_PAGE);

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

                            //attach to gallery, Example: "recipes-go-here"
                            document.getElementById(recipes + "-go-here").appendChild(newcard);
                        })
                    })
            }
            else {
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

                            //attach to gallery, Example: "recipes-go-here"
                            document.getElementById(recipes + "-go-here").appendChild(newcard);
                        })
                    })
            }
        })
}

// displayCardsDynamically("recipes");  //input param is the name of the collection

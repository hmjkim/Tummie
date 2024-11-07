function displayRecipeInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"
    console.log(ID);

    db.collection("recipes")
        .doc(ID)
        .get()
        .then(doc => {
            thisRecipe = doc.data();
            recipeImage = thisRecipe.strMealThumb;
            recipeName = doc.data().strMeal;
            recipeInstructions = doc.data().strInstructions

            // only populate title, and image
            document.getElementById("recipeName").innerHTML = recipeName;
            let imgEvent = document.querySelector(".recipe-img");
            imgEvent.src = recipeImage;
            document.getElementById("details-go-here").innerHTML = recipeInstructions;
        });
}
displayRecipeInfo();
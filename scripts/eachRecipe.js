function displayRecipeInfo() {
    let params = new URL(window.location.href); //get URL of search bar
    let ID = params.searchParams.get("docID"); //get value for key "id"

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
                if (doc.data()[`strMeasure${i}`] != "") {
                    ingredientName = doc.data()[`strIngredient${i}`]
                    ingredientMeasure = doc.data()[`strMeasure${i}`]
                    document.getElementById("ingredients").innerHTML += ingredientName + "<br/>"
                    document.getElementById("measurements").innerHTML += ingredientMeasure + "<br/>"
                }
            }
        });
}

displayRecipeInfo();
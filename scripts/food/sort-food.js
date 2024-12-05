import { calculateTimeLeft, determineRemainingDaysMessage} from "./food.js";

const foodItemTemplate = document.querySelector("#foodItemTemplate");
const foodItemList = document.querySelector("#foodItemList");

function populateFoodItemCard(foodItemCard, data, docID, daysLeft) {
    let iconPath;
    foodItemCard.querySelector(".food-title").innerHTML = data.title;
    foodItemCard.querySelector(".food-link").href = '/eachFood.html?docID=' + docID;
    foodItemCard.querySelector(".food-days-left").innerHTML = determineRemainingDaysMessage(daysLeft, data.expiry_date);
    foodItemCard.querySelector(".food-quantity").innerHTML = `Quantity: ${data.quantity}`;
    if (data.image) {
        iconPath = `../images/icons/food/${data.image}`;
    } else {
        iconPath = "../images/icons/placeholder.svg";
    }
    foodItemCard.querySelector(".food-img").src = iconPath;
    foodItemCard.querySelector(".food-img").alt = `${data.title} icon`;
    foodItemCard.querySelector(".form-check-input").dataset.id = docID;
  }  

//  Display Food items on My Kitchen page - SORT BY CATEGORY (DEFAULT)
function displayFoodItemsByCategory(items) { 
    createSortByCategoryContainer(items)
    items.forEach((doc) => {
        let docID = doc.id;
        let data = doc.data();
        let category = doc.data().category;
        let daysLeft = calculateTimeLeft(data.expiry_date);

        // Copy the content of template
        let foodItemCard = foodItemTemplate.content.cloneNode(true);
        // Populate card content
        populateFoodItemCard(foodItemCard, data, docID, daysLeft);
        switch (true) {
            case (category == "Fruits"):
                sort_Fruits.appendChild(foodItemCard);
                break;
            case (category == "Vegetables"):
                sort_Vegetables.appendChild(foodItemCard);
                break;
            case (category == "Meat"):
                sort_Meat.appendChild(foodItemCard);
                break;
            case (category == "Dairy"):
                sort_Dairy.appendChild(foodItemCard);
                break;
            case (category == "Other"):
                sort_Other.appendChild(foodItemCard);
        }   
        foodItemList.appendChild(foodItemCard);
    });
}

// Create Template for Sorting by Food Category 
function createSortByCategoryContainer(items) {
    // Clear the container
    foodItemList.innerHTML = '';

    if (items && foodItemTemplate) {
        let setCategory = new Set([])
        items.forEach((doc) => {
            let category = doc.data().category;
            setCategory.add(category)
        })

        // Make set to array
        // Array.from() static method creates a new, shallow-copied Array instance from an iterable or array-like object.
        let categoryList = Array.from(setCategory);

        // sort using comparison function (sorting by index - numerically)
        // https://www.w3schools.com/js/js_array_sort.asp
        categoryList.sort((a, b) => {
            let sortedOrder = [
                "Vegetables",
                "Fruits",
                "Meat",
                "Dairy",
                "Other"
            ]
            return sortedOrder.indexOf(a) - sortedOrder.indexOf(b)
        })

        console.log(categoryList);
        categoryList.forEach((category) => {

            let categoryContainer = document.createElement('li')
            categoryContainer.classList.add('tw-mb-5');
            categoryContainer.innerHTML = `
            <h2 class="tw-text-xl tw-text-primary tw-mb-3">${category}</h2>
            <ul id="sort_${category}" class="tw-list-none tw-m-0 tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
            </ul>
            </li>`
            foodItemList.appendChild(categoryContainer)
        })
    }
}

function determineExpiryCategory(daysLeft) {
    if (daysLeft < 0) {
        return "Expired";
    } else if (daysLeft === 0) {
        return "Expiring today";
    } else if (daysLeft === 1) {
        return "Expiring tomorrow";
    } else if (daysLeft <= 7) {
        return "Expiring in a week";
    } else {
        return "Expiring after a week";
    }
}

// Create Template for Sorting by Expiration Date
function createSortByDateContainer(items) {
    let setExpiryDate = new Set();

    // Clear the container
    foodItemList.innerHTML = '';

    // Collect expiry categories
    items.forEach((item) => {
        let data = item.data();
        let daysLeft = calculateTimeLeft(data.expiry_date);
        let expiryCategory = determineExpiryCategory(daysLeft);
        setExpiryDate.add(expiryCategory);
    });

    console.log(setExpiryDate)

    // Make set to array
    // Array.from() static method creates a new, shallow-copied Array instance from an iterable or array-like object.
    let dateList = Array.from(setExpiryDate);

    // sort using comparison function (sorting by index - numerically)
    // https://www.w3schools.com/js/js_array_sort.asp
    dateList.sort((a, b) => {
        let sortedOrder = [
            "Expired",
            "Expiring today",
            "Expiring tomorrow",
            "Expiring in a week",
            "Expiring after a week"
        ]
        return sortedOrder.indexOf(a) - sortedOrder.indexOf(b)
    })
    console.log(dateList)

    // Create containers for each expiry category
    dateList.forEach((expiryCategory) => {
        let expiryCategoryID = expiryCategory.replaceAll(" ", "");
        console.log(expiryCategoryID)
        let expiryDateContainer = document.createElement('li');
        expiryDateContainer.classList.add('tw-mb-5');
        expiryDateContainer.innerHTML = `
            <h2 class="tw-text-xl tw-text-primary tw-mb-3">${expiryCategory}</h2>
            <ul id="sort_${expiryCategoryID}" class="tw-list-none tw-m-0 tw-grid 
                lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
            </ul>
            </li>`;
            foodItemList.appendChild(expiryDateContainer);
    });
}

// Display Food items on My Kitchen page - SORT BY EXPIRY DATE
function displayFoodItemsByExpiryDate(items) {
    createSortByDateContainer(items)
    
    if (items && foodItemTemplate) {
        items.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            let docID = doc.id;
            let data = doc.data();
            let daysLeft = calculateTimeLeft(data.expiry_date);

            // Copy the content of template
            let foodItemCard = foodItemTemplate.content.cloneNode(true);

            // Populate card content
            populateFoodItemCard(foodItemCard, data, docID, daysLeft);

            switch (true) {
                case (daysLeft < 0):
                    sort_Expired.appendChild(foodItemCard);
                    break;
                case (daysLeft === 0):
                    sort_Expiringtoday.appendChild(foodItemCard);
                    break;
                case (daysLeft === 1):
                    sort_Expiringtomorrow.appendChild(foodItemCard);
                    break;
                case (daysLeft <= 7):
                    sort_Expiringinaweek.appendChild(foodItemCard);
                    break;
                default:
                    sort_Expiringafteraweek.appendChild(foodItemCard);
                    break;
            }
        })
    }
} 

// Create Template for Sorting by Food Name
function createSortByNameContainer(items) {
    let setFirstLetter = new Set();

    // Clear the container
    foodItemList.innerHTML = '';

    // Collect first letters
    items.forEach((item) => {
        let title = item.data().title;
        // let firstLetter = data.title.charAt(0).toUpperCase();
        let firstLetter = title[0].toUpperCase();
        setFirstLetter.add(firstLetter)
    });
    let alphaList = Array.from(setFirstLetter).sort();
    console.log(alphaList)
    // Create containers for each first letter
    alphaList.forEach((firstLetter) => {
        let alphabeticalContainer = document.createElement('li');
        alphabeticalContainer.classList.add('tw-mb-5');
        alphabeticalContainer.innerHTML = `
            <h2 class="tw-text-xl tw-text-primary tw-mb-3">${firstLetter}</h2>
            <ul id="sort_${firstLetter}" class="tw-list-none tw-m-0 tw-grid 
                lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
            </ul>
            </li>`;
        foodItemList.appendChild(alphabeticalContainer);
    });
}

// Display Food items on My Kitchen page - SORT BY FOOD NAME
function displayFoodItemsByName(items) {
    createSortByNameContainer(items)
    // let foodItemTemplate = document.querySelector("#foodItemTemplate");

    if (items && foodItemTemplate) {
        items.forEach((doc) => {
            let docID = doc.id;
            let data = doc.data();
            let daysLeft = calculateTimeLeft(data.expiry_date);

            let foodItemCard = foodItemTemplate.content.cloneNode(true);

            // Populate card content
            populateFoodItemCard(foodItemCard, data, docID, daysLeft);

            let firstLetter = data.title[0]
            document.querySelector(`#sort_${firstLetter}`).appendChild(foodItemCard);
        });
    }
}

export { displayFoodItemsByCategory, displayFoodItemsByExpiryDate, displayFoodItemsByName };
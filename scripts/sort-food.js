import { calculateTimeLeft, determineRemainingDaysMessage} from "./food.js";

// Display Food items on My Kitchen page - SORT BY CATEGORY (DEFAULT)
function displayFoodItemsByCategory(userID) {
    let foodItemTemplate = document.querySelector("#foodItemTemplate");

    if (foodItemList && foodItemTemplate) {
        db.collection("users").doc(userID).collection("food")
            .orderBy("expiry_date")
            .get()
            .then((allItems) => {
                allItems.forEach((doc) => {
                    // console.log(doc.id, " => ", doc.data());
                    let docID = doc.id;
                    let title = doc.data().title;
                    let slug = doc.data().slug;
                    let expiry_date = doc.data().expiry_date;
                    let category = doc.data().category;
                    let storage_space = doc.data().storage_space;
                    let quantity = doc.data().quantity;
                    let image = doc.data().image;
                    let notes = doc.data().notes;
                    let dateCreated = doc.data().date_created;
                    let daysLeft = calculateTimeLeft(expiry_date)
                    // let currentTime = new Date().toLocaleString();

                    // console.log(title, expiry_date, category, storage_space, quantity, image, notes, "dateCreated", dateCreated, "daysLeft", daysLeft)

                    // Copy the content of template
                    let foodItemCard = foodItemTemplate.content.cloneNode(true);

                    // Populate card content
                    foodItemCard.querySelector(".food-title").innerHTML = title;
                    foodItemCard.querySelector(".food-link").href = '/eachFood.html?docID=' + docID;

                    foodItemCard.querySelector(".food-days-left").innerHTML = determineRemainingDaysMessage(daysLeft, expiry_date)
                    foodItemCard.querySelector(".food-quantity").innerHTML = `Quantity: ${quantity}`;
                    foodItemCard.querySelector(".food-img").src = `../images/icons/food/${image}`;
                    foodItemCard.querySelector(".food-img").alt = `${title} icon`;

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
                })
            })
    }
}


// Create Template for Sorting by Expiration Date
function createSortByDateContainer(userID) {
    let setExpiryDate = new Set([])
    db.collection("users").doc(userID).collection("food")
        .orderBy("expiry_date")
        .get()
        .then((allItems) => {
            allItems.forEach((doc) => {
                let expiry_date = doc.data().expiry_date;
                let daysLeft = calculateTimeLeft(expiry_date)

                switch (true) {
                    case (daysLeft < 0):
                        setExpiryDate.add("Expired")
                        break;
                    case (daysLeft === 0):
                        setExpiryDate.add("Expiring today")
                        break;
                    case (daysLeft === 1):
                        setExpiryDate.add("Expiring tomorrow")
                        break;
                    case (daysLeft <= 7):
                        setExpiryDate.add("Expiring in a week")
                        break;
                    default:
                        setExpiryDate.add("Expiring after a week")
                        break;
                }
            })

            setExpiryDate.forEach((expiryDate) => {
                let expiryDateID = expiryDate.replaceAll(" ", "")
                let expiryDateContainer = document.createElement(`div`)
                expiryDateContainer.innerHTML = `
                <div class="tw-mb-5">
                <h2 class="tw-text-xl tw-text-primary tw-mb-3">${expiryDate}</h2>
                <ul id="sort_${expiryDateID}" class="tw-list-none tw-m-0 tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
                </ul>
                </div>`
                document.querySelector("#sortByExpiryDate").appendChild(expiryDateContainer)

            })
        })
}


// Display Food items on My Kitchen page - SORT BY DATES
function displayFoodItemsByExpiryDate(userID) {
    let foodItemTemplate = document.querySelector("#foodItemTemplate");
    let sort_expired = document.querySelector("#sort_expired");
    let sort_expireToday = document.querySelector("#sort_expireToday");
    let sort_expiredTomorrow = document.querySelector("#sort_expiredTomorrow");
    let sort_expiredOneWeek = document.querySelector("#sort_expiredOneWeek");
    let sort_expiredOneMonth = document.querySelector("#sort_expiredOneMonth");
    let sort_expiredAfterOneMonth = document.querySelector("#sort_expiredAfterOneMonth");

    if (foodItemList && foodItemTemplate) {
        db.collection("users").doc(userID).collection("food")
            .orderBy("expiry_date")
            .get()
            .then((allItems) => {
                allItems.forEach((doc) => {
                    // console.log(doc.id, " => ", doc.data());
                    let docID = doc.id;
                    let title = doc.data().title;
                    let slug = doc.data().slug;
                    let expiry_date = doc.data().expiry_date;
                    let category = doc.data().category;
                    let storage_space = doc.data().storage_space;
                    let quantity = doc.data().quantity;
                    let image = doc.data().image;
                    let notes = doc.data().notes;
                    let dateCreated = doc.data().date_created;
                    let daysLeft = calculateTimeLeft(expiry_date)
                    // let currentTime = new Date().toLocaleString();

                    // console.log(title, expiry_date, category, storage_space, quantity, image, notes, "dateCreated", dateCreated, "daysLeft", daysLeft)

                    // Copy the content of template
                    let foodItemCard = foodItemTemplate.content.cloneNode(true);

                    // Populate card content
                    foodItemCard.querySelector(".food-title").innerHTML = title;
                    foodItemCard.querySelector(".food-link").href = '/eachFood.html?docID=' + docID;

                    foodItemCard.querySelector(".food-days-left").innerHTML = determineRemainingDaysMessage(daysLeft)
                    foodItemCard.querySelector(".food-quantity").innerHTML = `Quantity: ${quantity}`;
                    foodItemCard.querySelector(".food-img").src = `../images/icons/food/${image}`;

                    const currentDate = Date.now(); // Current date and time in milliseconds

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
            })
    }
}


// Create Template for Sorting by Food Name
function createSortByNameContainer(userID) {
    let setFirstLetter = new Set([])
    db.collection("users").doc(userID).collection("food")
        .orderBy("title")
        .get()
        .then((allItems) => {
            allItems.forEach((doc) => {
                let title = doc.data().title;
                let firstLetter = title[0]
                setFirstLetter.add(firstLetter)
            })

            setFirstLetter.forEach((firstLetter) => {
                let alphabeticalContainer = document.createElement(`div`)
                alphabeticalContainer.innerHTML = `
                <div class="tw-mb-5">
                <h2 class="tw-text-xl tw-text-primary tw-mb-3">${firstLetter}</h2>
                <ul id="sort_${firstLetter}" class="tw-list-none tw-m-0 tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
                </ul>
                </div>`
                document.querySelector("#sortByFoodName").appendChild(alphabeticalContainer)

            })
        })
}


// Display Food items on My Kitchen page - SORT BY FOOD NAME
function displayFoodItemsByName(userID) {
    let foodItemTemplate = document.querySelector("#foodItemTemplate");
    let sort_expired = document.querySelector("#sort_expired");
    let sort_expireToday = document.querySelector("#sort_expireToday");
    let sort_expiredTomorrow = document.querySelector("#sort_expiredTomorrow");
    let sort_expiredOneWeek = document.querySelector("#sort_expiredOneWeek");
    let sort_expiredOneMonth = document.querySelector("#sort_expiredOneMonth");
    let sort_expiredAfterOneMonth = document.querySelector("#sort_expiredAfterOneMonth");

    if (foodItemList && foodItemTemplate) {
        db.collection("users").doc(userID).collection("food")
            .orderBy("expiry_date")
            .get()
            .then((allItems) => {
                allItems.forEach((doc) => {
                    // console.log(doc.id, " => ", doc.data());
                    let docID = doc.id;
                    let title = doc.data().title;
                    let slug = doc.data().slug;
                    let expiry_date = doc.data().expiry_date;
                    let category = doc.data().category;
                    let storage_space = doc.data().storage_space;
                    let quantity = doc.data().quantity;
                    let image = doc.data().image;
                    let notes = doc.data().notes;
                    let dateCreated = doc.data().date_created;
                    let daysLeft = calculateTimeLeft(expiry_date)
                    // let currentTime = new Date().toLocaleString();

                    // console.log(title, expiry_date, category, storage_space, quantity, image, notes, "dateCreated", dateCreated, "daysLeft", daysLeft)

                    // Copy the content of template
                    let foodItemCard = foodItemTemplate.content.cloneNode(true);

                    // Populate card content
                    foodItemCard.querySelector(".food-title").innerHTML = title;
                    foodItemCard.querySelector(".food-link").href = '/eachFood.html?docID=' + docID;

                    foodItemCard.querySelector(".food-days-left").innerHTML = determineRemainingDaysMessage(daysLeft, )
                    foodItemCard.querySelector(".food-quantity").innerHTML = `Quantity: ${quantity}`;
                    foodItemCard.querySelector(".food-img").src = `../images/icons/food/${image}`;

                    let firstLetter = title[0]
                    document.querySelector(`#sort_${firstLetter}`).appendChild(foodItemCard);
                })
            })
    }
}

// Create Template for Sorting by Food Category 
function createSortByCategoryContainer(userID) {
    let setCategory = new Set([])
    db.collection("users").doc(userID).collection("food")
        .get()
        .then((allItems) => {
            allItems.forEach((doc) => {
                let category = doc.data().category;
                setCategory.add(category)
            })

            setCategory.forEach((category) => {
                if (category == "Other") {
                    return;
                }
                let categoryContainer = document.createElement(`div`)
                categoryContainer.innerHTML = `
                <div class="tw-mb-5">
                <h2 class="tw-text-xl tw-text-primary tw-mb-3">${category}</h2>
                <ul id="sort_${category}" class="tw-list-none tw-m-0 tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
                </ul>
                </div>`
                document.querySelector("#sortByCategory").appendChild(categoryContainer)
            })

            // Single out "Other" in order to keep it displayed at last
            if (setCategory.has("Other")) {
                categoryContainer = document.createElement(`div`)
                categoryContainer.innerHTML = `
                <div class="tw-mb-5">
                <h2 class="tw-text-xl tw-text-primary tw-mb-3">Other</h2>
                <ul id="sort_Other" class="tw-list-none tw-m-0 tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
                </ul>
                </div>`
                document.querySelector("#sortByCategory").appendChild(categoryContainer)
            }
        })
}

export { displayFoodItemsByCategory, displayFoodItemsByExpiryDate, displayFoodItemsByName, createSortByDateContainer, createSortByNameContainer, createSortByCategoryContainer };
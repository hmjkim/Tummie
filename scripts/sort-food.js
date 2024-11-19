import { calculateTimeLeft, determineRemainingDaysMessage} from "./food.js";

function populateFoodItemCard(foodItemCard, data, docID, daysLeft) {
    foodItemCard.querySelector(".food-title").innerHTML = data.title;
    foodItemCard.querySelector(".food-link").href = '/eachFood.html?docID=' + docID;
    foodItemCard.querySelector(".food-days-left").innerHTML = determineRemainingDaysMessage(daysLeft, data.expiry_date);
    foodItemCard.querySelector(".food-quantity").innerHTML = `Quantity: ${data.quantity}`;
    foodItemCard.querySelector(".food-img").src = `../images/icons/food/${data.image}`;
    foodItemCard.querySelector(".food-img").alt = `${data.title} icon`;
    foodItemCard.querySelector(".form-check-input").dataset.id = docID;
  }  

function displayFoodItemsByCategory(items) {
let foodItemTemplate = document.querySelector("#foodItemTemplate");
let foodItemList = document.querySelector("#foodItemList");

// Clear the container
foodItemList.innerHTML = '';

if (items && foodItemTemplate) {
    let categories = {};

    // Group items by category
    items.forEach((item) => {
        let data = item.data;
        let category = data.category || "Other";
        if (!categories[category]) {
            categories[category] = [];
        }
        categories[category].push(item);
    });

    // Display items grouped by category
    for (let category in categories) {
        // Create category container
        let categoryContainer = document.createElement('div');
        categoryContainer.classList.add('tw-mb-5');

        // Category title
        let categoryTitle = document.createElement('h2');
        categoryTitle.classList.add('tw-text-xl', 'tw-text-primary', 'tw-mb-3');
        categoryTitle.textContent = category;
        categoryContainer.appendChild(categoryTitle);

        // Items list
        let itemsList = document.createElement('ul');
        itemsList.classList.add('tw-list-none', 'tw-m-0', 'tw-grid',
            'lg:tw-grid-cols-3', 'md:tw-grid-cols-2', 'tw-gap-3', 'md:tw-gap-6');

        // Append food items to the list
        categories[category].forEach((item) => {
            let docID = item.id;
            let data = item.data;
            let daysLeft = calculateTimeLeft(data.expiry_date);

            let foodItemCard = foodItemTemplate.content.cloneNode(true);

            // Populate card content
            populateFoodItemCard(foodItemCard, data, docID, daysLeft);

            itemsList.appendChild(foodItemCard);
        });

        // Append the items list to the category container
        categoryContainer.appendChild(itemsList);

        // Append the category container to the main food item list
        foodItemList.appendChild(categoryContainer);
    }
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
  
function createSortByDateContainer(items) {
return new Promise((resolve, reject) => {
    let setExpiryDate = new Set();
    let sortByExpiryDateContainer = document.querySelector("#foodItemList");

    // Clear the container
    sortByExpiryDateContainer.innerHTML = '';

    // Collect expiry categories
    items.forEach((item) => {
    let data = item.data;
    let daysLeft = calculateTimeLeft(data.expiry_date);
    let expiryCategory = determineExpiryCategory(daysLeft);
    setExpiryDate.add(expiryCategory);
    });

    // Create containers for each expiry category
    setExpiryDate.forEach((expiryCategory) => {
    let expiryCategoryID = expiryCategory.replace(/\s+/g, "");
    let expiryDateContainer = document.createElement('div');
    expiryDateContainer.classList.add('tw-mb-5');
    expiryDateContainer.innerHTML = `
        <div class="tw-mb-5">
        <h2 class="tw-text-xl tw-text-primary tw-mb-3">${expiryCategory}</h2>
        <ul id="sort_${expiryCategoryID}" class="tw-list-none tw-m-0 tw-grid 
            lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
        </ul>
        </div>`;
    sortByExpiryDateContainer.appendChild(expiryDateContainer);
    });

    resolve();
});
}
  
function displayFoodItemsByExpiryDate(items) {
    let foodItemTemplate = document.querySelector("#foodItemTemplate");
    let sort_expired = document.querySelector("#sort_expired");
    let sort_expireToday = document.querySelector("#sort_expireToday");
    let sort_expiredTomorrow = document.querySelector("#sort_expiredTomorrow");
    let sort_expiredOneWeek = document.querySelector("#sort_expiredOneWeek");
    let sort_expiredOneMonth = document.querySelector("#sort_expiredOneMonth");
    let sort_expiredAfterOneMonth = document.querySelector("#sort_expiredAfterOneMonth");

    if (items && foodItemTemplate) {
        items.forEach((item) => {
                // console.log(doc.id, " => ", doc.data());
                let data = item.data;
                let docID = item.id;
                let daysLeft = calculateTimeLeft(data.expiry_date);
                // let currentTime = new Date().toLocaleString();

                // console.log(title, expiry_date, category, storage_space, quantity, image, notes, "dateCreated", dateCreated, "daysLeft", daysLeft)

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
  
  function createSortByNameContainer(items) {
    return new Promise((resolve, reject) => {
      let setFirstLetter = new Set();
      let sortByNameContainer = document.querySelector("#foodItemList");
  
      // Clear the container
      sortByNameContainer.innerHTML = '';
  
      // Collect first letters
      items.forEach((item) => {
        let data = item.data;
        let firstLetter = data.title.charAt(0).toUpperCase();
        setFirstLetter.add(firstLetter);
      });
  
      // Create containers for each first letter
      setFirstLetter.forEach((firstLetter) => {
        let alphabeticalContainer = document.createElement('div');
        alphabeticalContainer.classList.add('tw-mb-5');
        alphabeticalContainer.innerHTML = `
          <div class="tw-mb-5">
            <h2 class="tw-text-xl tw-text-primary tw-mb-3">${firstLetter}</h2>
            <ul id="sort_${firstLetter}" class="tw-list-none tw-m-0 tw-grid 
              lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
            </ul>
          </div>`;
        sortByNameContainer.appendChild(alphabeticalContainer);
      });
  
      resolve();
    });
  }

function displayFoodItemsByName(items) {

    let foodItemTemplate = document.querySelector("#foodItemTemplate");

    if (items && foodItemTemplate) {
        // Sort items alphabetically by title
        items.sort((a, b) => a.data.title.localeCompare(b.data.title));

        items.forEach((item) => {
        let data = item.data;
        let docID = item.id;
        let daysLeft = calculateTimeLeft(data.expiry_date);

        let foodItemCard = foodItemTemplate.content.cloneNode(true);

        // Populate card content
        populateFoodItemCard(foodItemCard, data, docID, daysLeft);

        let firstLetter = data.title[0]
        document.querySelector(`#sort_${firstLetter}`).appendChild(foodItemCard);
        });
    }
}
  
  

// // Display Food items on My Kitchen page - SORT BY CATEGORY (DEFAULT)
// function displayFoodItemsByCategory(userID) {
//     let foodItemTemplate = document.querySelector("#foodItemTemplate");

//     if (foodItemList && foodItemTemplate) {
//         db.collection("users").doc(userID).collection("food")
//             .orderBy("expiry_date")
//             .get()
//             .then((allItems) => {
//                 allItems.forEach((doc) => {
//                     // console.log(doc.id, " => ", doc.data());
//                     let docID = doc.id;
//                     let title = doc.data().title;
//                     let slug = doc.data().slug;
//                     let expiry_date = doc.data().expiry_date;
//                     let category = doc.data().category;
//                     let storage_space = doc.data().storage_space;
//                     let quantity = doc.data().quantity;
//                     let image = doc.data().image;
//                     let notes = doc.data().notes;
//                     let dateCreated = doc.data().date_created;
//                     let daysLeft = calculateTimeLeft(expiry_date)
//                     // let currentTime = new Date().toLocaleString();

//                     // console.log(title, expiry_date, category, storage_space, quantity, image, notes, "dateCreated", dateCreated, "daysLeft", daysLeft)

//                     // Copy the content of template
//                     let foodItemCard = foodItemTemplate.content.cloneNode(true);

//                     // Populate card content
//                     foodItemCard.querySelector(".food-title").innerHTML = title;
//                     foodItemCard.querySelector(".food-link").href = '/eachFood.html?docID=' + docID;

//                     foodItemCard.querySelector(".food-days-left").innerHTML = determineRemainingDaysMessage(daysLeft, expiry_date)
//                     foodItemCard.querySelector(".food-quantity").innerHTML = `Quantity: ${quantity}`;
//                     foodItemCard.querySelector(".food-img").src = `../images/icons/food/${image}`;
//                     foodItemCard.querySelector(".food-img").alt = `${title} icon`;

//                     switch (true) {
//                         case (category == "Fruits"):
//                             sort_Fruits.appendChild(foodItemCard);
//                             break;
//                         case (category == "Vegetables"):
//                             sort_Vegetables.appendChild(foodItemCard);
//                             break;
//                         case (category == "Meat"):
//                             sort_Meat.appendChild(foodItemCard);
//                             break;
//                         case (category == "Dairy"):
//                             sort_Dairy.appendChild(foodItemCard);
//                             break;
//                         case (category == "Other"):
//                             sort_Other.appendChild(foodItemCard);
//                     }
//                 })
//             })
//     }
// }


// Create Template for Sorting by Expiration Date
// function createSortByDateContainer(userID) {
//     let setExpiryDate = new Set([])
//     db.collection("users").doc(userID).collection("food")
//         .orderBy("expiry_date")
//         .get()
//         .then((allItems) => {
//             allItems.forEach((doc) => {
//                 let expiry_date = doc.data().expiry_date;
//                 let daysLeft = calculateTimeLeft(expiry_date)

//                 switch (true) {
//                     case (daysLeft < 0):
//                         setExpiryDate.add("Expired")
//                         break;
//                     case (daysLeft === 0):
//                         setExpiryDate.add("Expiring today")
//                         break;
//                     case (daysLeft === 1):
//                         setExpiryDate.add("Expiring tomorrow")
//                         break;
//                     case (daysLeft <= 7):
//                         setExpiryDate.add("Expiring in a week")
//                         break;
//                     default:
//                         setExpiryDate.add("Expiring after a week")
//                         break;
//                 }
//             })

//             setExpiryDate.forEach((expiryDate) => {
//                 let expiryDateID = expiryDate.replaceAll(" ", "")
//                 let expiryDateContainer = document.createElement(`div`)
//                 expiryDateContainer.innerHTML = `
//                 <div class="tw-mb-5">
//                 <h2 class="tw-text-xl tw-text-primary tw-mb-3">${expiryDate}</h2>
//                 <ul id="sort_${expiryDateID}" class="tw-list-none tw-m-0 tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
//                 </ul>
//                 </div>`
//                 document.querySelector("#sortByExpiryDate").appendChild(expiryDateContainer)

//             })
//         })
// }


// Display Food items on My Kitchen page - SORT BY DATES
// function displayFoodItemsByExpiryDate(userID) {
//     let foodItemTemplate = document.querySelector("#foodItemTemplate");
//     let sort_expired = document.querySelector("#sort_expired");
//     let sort_expireToday = document.querySelector("#sort_expireToday");
//     let sort_expiredTomorrow = document.querySelector("#sort_expiredTomorrow");
//     let sort_expiredOneWeek = document.querySelector("#sort_expiredOneWeek");
//     let sort_expiredOneMonth = document.querySelector("#sort_expiredOneMonth");
//     let sort_expiredAfterOneMonth = document.querySelector("#sort_expiredAfterOneMonth");

//     if (foodItemList && foodItemTemplate) {
//         db.collection("users").doc(userID).collection("food")
//             .orderBy("expiry_date")
//             .get()
//             .then((allItems) => {
//                 allItems.forEach((doc) => {
//                     // console.log(doc.id, " => ", doc.data());
//                     let docID = doc.id;
//                     let title = doc.data().title;
//                     let slug = doc.data().slug;
//                     let expiry_date = doc.data().expiry_date;
//                     let category = doc.data().category;
//                     let storage_space = doc.data().storage_space;
//                     let quantity = doc.data().quantity;
//                     let image = doc.data().image;
//                     let notes = doc.data().notes;
//                     let dateCreated = doc.data().date_created;
//                     let daysLeft = calculateTimeLeft(expiry_date)
//                     // let currentTime = new Date().toLocaleString();

//                     // console.log(title, expiry_date, category, storage_space, quantity, image, notes, "dateCreated", dateCreated, "daysLeft", daysLeft)

//                     // Copy the content of template
//                     let foodItemCard = foodItemTemplate.content.cloneNode(true);

//                     // Populate card content
//                     foodItemCard.querySelector(".food-title").innerHTML = title;
//                     foodItemCard.querySelector(".food-link").href = '/eachFood.html?docID=' + docID;

//                     foodItemCard.querySelector(".food-days-left").innerHTML = determineRemainingDaysMessage(daysLeft)
//                     foodItemCard.querySelector(".food-quantity").innerHTML = `Quantity: ${quantity}`;
//                     foodItemCard.querySelector(".food-img").src = `../images/icons/food/${image}`;

//                     const currentDate = Date.now(); // Current date and time in milliseconds

//                     switch (true) {
//                         case (daysLeft < 0):
//                             sort_Expired.appendChild(foodItemCard);
//                             break;
//                         case (daysLeft === 0):
//                             sort_Expiringtoday.appendChild(foodItemCard);
//                             break;
//                         case (daysLeft === 1):
//                             sort_Expiringtomorrow.appendChild(foodItemCard);
//                             break;
//                         case (daysLeft <= 7):
//                             sort_Expiringinaweek.appendChild(foodItemCard);
//                             break;
//                         default:
//                             sort_Expiringafteraweek.appendChild(foodItemCard);
//                             break;
//                     }
//                 })
//             })
//     }
// }


// Create Template for Sorting by Food Name
// function createSortByNameContainer(userID) {
//     let setFirstLetter = new Set([])
//     db.collection("users").doc(userID).collection("food")
//         .orderBy("title")
//         .get()
//         .then((allItems) => {
//             allItems.forEach((doc) => {
//                 let title = doc.data().title;
//                 let firstLetter = title[0]
//                 setFirstLetter.add(firstLetter)
//             })

//             setFirstLetter.forEach((firstLetter) => {
//                 let alphabeticalContainer = document.createElement(`div`)
//                 alphabeticalContainer.innerHTML = `
//                 <div class="tw-mb-5">
//                 <h2 class="tw-text-xl tw-text-primary tw-mb-3">${firstLetter}</h2>
//                 <ul id="sort_${firstLetter}" class="tw-list-none tw-m-0 tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
//                 </ul>
//                 </div>`
//                 document.querySelector("#sortByFoodName").appendChild(alphabeticalContainer)

//             })
//         })
// }


// Display Food items on My Kitchen page - SORT BY FOOD NAME
// function displayFoodItemsByName(userID) {
//     let foodItemTemplate = document.querySelector("#foodItemTemplate");
//     let sort_expired = document.querySelector("#sort_expired");
//     let sort_expireToday = document.querySelector("#sort_expireToday");
//     let sort_expiredTomorrow = document.querySelector("#sort_expiredTomorrow");
//     let sort_expiredOneWeek = document.querySelector("#sort_expiredOneWeek");
//     let sort_expiredOneMonth = document.querySelector("#sort_expiredOneMonth");
//     let sort_expiredAfterOneMonth = document.querySelector("#sort_expiredAfterOneMonth");

//     if (foodItemList && foodItemTemplate) {
//         db.collection("users").doc(userID).collection("food")
//             .orderBy("expiry_date")
//             .get()
//             .then((allItems) => {
//                 allItems.forEach((doc) => {
//                     // console.log(doc.id, " => ", doc.data());
//                     let docID = doc.id;
//                     let title = doc.data().title;
//                     let slug = doc.data().slug;
//                     let expiry_date = doc.data().expiry_date;
//                     let category = doc.data().category;
//                     let storage_space = doc.data().storage_space;
//                     let quantity = doc.data().quantity;
//                     let image = doc.data().image;
//                     let notes = doc.data().notes;
//                     let dateCreated = doc.data().date_created;
//                     let daysLeft = calculateTimeLeft(expiry_date)
//                     // let currentTime = new Date().toLocaleString();

//                     // console.log(title, expiry_date, category, storage_space, quantity, image, notes, "dateCreated", dateCreated, "daysLeft", daysLeft)

//                     // Copy the content of template
//                     let foodItemCard = foodItemTemplate.content.cloneNode(true);

//                     // Populate card content
//                     foodItemCard.querySelector(".food-title").innerHTML = title;
//                     foodItemCard.querySelector(".food-link").href = '/eachFood.html?docID=' + docID;

//                     foodItemCard.querySelector(".food-days-left").innerHTML = determineRemainingDaysMessage(daysLeft, )
//                     foodItemCard.querySelector(".food-quantity").innerHTML = `Quantity: ${quantity}`;
//                     foodItemCard.querySelector(".food-img").src = `../images/icons/food/${image}`;

//                     let firstLetter = title[0]
//                     document.querySelector(`#sort_${firstLetter}`).appendChild(foodItemCard);
//                 })
//             })
//     }
// }

// Create Template for Sorting by Food Category 
// function createSortByCategoryContainer(userID) {
//     let setCategory = new Set([])
//     db.collection("users").doc(userID).collection("food")
//         .get()
//         .then((allItems) => {
//             allItems.forEach((doc) => {
//                 let category = doc.data().category;
//                 setCategory.add(category)
//             })
//             console.log(setCategory);
//             setCategory.forEach((category) => {
//                 if (category == "Other") {
//                     return;
//                 }
//                 let categoryContainer = document.createElement(`div`)
//                 categoryContainer.innerHTML = `
//                 <div class="tw-mb-5">
//                 <h2 class="tw-text-xl tw-text-primary tw-mb-3">${category}</h2>
//                 <ul id="sort_${category}" class="tw-list-none tw-m-0 tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
//                 </ul>
//                 </div>`
//                 document.querySelector("#sortByCategory").appendChild(categoryContainer)
//             })

//             // Single out "Other" in order to keep it displayed at last
//             if (setCategory.has("Other")) {
//                 categoryContainer = document.createElement(`div`)
//                 categoryContainer.innerHTML = `
//                 <div class="tw-mb-5">
//                 <h2 class="tw-text-xl tw-text-primary tw-mb-3">Other</h2>
//                 <ul id="sort_Other" class="tw-list-none tw-m-0 tw-grid lg:tw-grid-cols-3 md:tw-grid-cols-2 tw-gap-3 md:tw-gap-6">
//                 </ul>
//                 </div>`
//                 document.querySelector("#sortByCategory").appendChild(categoryContainer)
//             }
//         })
// }

export { displayFoodItemsByCategory, displayFoodItemsByExpiryDate, displayFoodItemsByName, createSortByDateContainer, createSortByNameContainer };
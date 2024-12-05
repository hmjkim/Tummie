import {
  displayFoodItemsByCategory,
  displayFoodItemsByExpiryDate,
  displayFoodItemsByName,
} from "./sort-food.js";

import { previewFile, slugify, convertToTitleCase, getURLParams, setURLParams } from "./foodHelpers.js"

// import { updateSortingMethod } from "./sort.js";

var currentUser;
// split path by \ and get the last one
const editForm = document.querySelector(".js-edit-form");
var foodImage = document.getElementById("imageUpload");
var foodName = document.getElementById("nameInput");
var foodExpiryDate = document.getElementById("datepickerInput");
var foodStorage = document.getElementById("storageSpaceInput");
var foodCategory = document.getElementById("categoryInput");
var foodQuantity = document.getElementById("quantityInput");
var foodNotes = document.getElementById("notesInput");
const emptyKitchenMessageTemplate = document.querySelector(
  "#emptyKitchenMessageTemplate"
);
const currentSpace = document.querySelector(".js-current-space");
const emptyKitchenMessage = document.querySelector("#emptyKitchenMessage");
const searchBar = document.querySelector(".js-search-bar");

const foodItemTemplate = document.querySelector("#foodItemTemplate");
const foodItemList = document.querySelector("#foodItemList");

const selectBtn = document.querySelector(".js-select-items-btn");
const selectOverlay = document.querySelector(".js-select-overlay");

const meatballOverlayTrigger = document.querySelector(".js-meatball-menu");
const meatballOverlay = document.querySelector(".js-meatball-dropdown");

const itemCounter = document.querySelector(".js-item-counter");

const sortBtn = document.querySelector(".js-sort-btn");
const sortOverlay = document.querySelector(".js-sort-overlay");
const bgOverlay = document.querySelector(".js-sort-overlay .js-bg-overlay");
const closeBtn = document.querySelector(".js-close-btn");

const btnAddItem = document.querySelector(".btn-add-item");
const addOverlay = document.querySelector(".add-overlay");

// MAIN FUNCTION FOR MY KITCHEN PAGE
// Get the currently signed-in user
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // console.log("current user", user)
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/v8/firebase.User
    var userID = user.uid;

    if (editForm) {
      // Edit form page
      populateFoodInfo();
    } else {
      // My Kitchen page
      // Get the sorting method from URL if it exists
      let urlSortingMethod = getURLParams("sort");
      if (urlSortingMethod) {
        // If there's a sort parameter in the URL, use it
        displayFoodItems(userID, urlSortingMethod);
      } else {
        // Otherwise, use the user's default sorting preference from Firestore
        db.collection("users")
          .doc(userID)
          .get()
          .then((userDoc) => {
            let defaultSortingPreference = userDoc.data().default_sorting;
            let sortingMethod;

            switch (defaultSortingPreference) {
              case "defaultSortByDate":
                sortingMethod = "Expiration Date";
                break;
              case "defaultSortByCategory":
                sortingMethod = "Category";
                break;
              case "defaultSortByName":
                sortingMethod = "Name";
                break;
              default:
                sortingMethod = "Expiration Date";
            }
            setURLParams('sort', sortingMethod);
            
            // Display food items with the default sorting method
            displayFoodItems(userID, sortingMethod);
          });
      }
    }
  } else {
    console.log("No user is signed in");
    window.location.href = "login.html";
  }

  // Helper function to display items with appropriate sorting method
  function displayFoodItems(userID, sortingMethod) {
  
    db.collection("users")
      .doc(userID)
      .collection("food")
      .get()
      .then((subCollection) => {
        if (emptyKitchenMessage && searchBar) {
          // When food subcollection has more than one entry
          if (subCollection.docs.length > 0) {
            console.log("food collection exists");
            //   document.querySelector('.js-sub-header').classList.remove('tw-hidden');

            let spaceName = getURLParams("storage");
            console.log(spaceName);
            // Execute necessary setup before displaying items
            toggleStorageDropdown();
            toggleMeatballOverlay();
            createStorageSpaceDropdown(userID);

            // Display food items and chain the rest of the actions
            displayFoodByStorageSpace(
              userID,
              spaceName,
              sortingMethod
            )
              .then(() => {
                console.log("Items sorted by:", sortingMethod);
                console.log("All food items have been displayed.");

                // Now setup the select functionality
                showSelectOverlay(userID, spaceName);
                // deleteFood(userID, spaceName);

                sortBtn.addEventListener("click", () => {
                  toggleElementsVisibility([
                    sortOverlay,
                    meatballOverlay,
                  ]);
                });
                closeBtn.addEventListener("click", () => {
                  toggleElementsVisibility([sortOverlay]);
                });

                // Set up sorting options
                setupSortingOptions(userID, spaceName, sortingMethod);
              })
              .catch((error) => {
                console.error("Failed to display food items:", error);
              });
          } else {
            console.log("food collection does not exist");
            let node = emptyKitchenMessageTemplate.content.cloneNode(true);
              emptyKitchenMessage.appendChild(node);
              searchBar.style.display = "none";
          }
        }
      });
    
  }
  
  // SAVE BUTTON
  const saveBtns = document.querySelectorAll(".save-btn");
  if (saveBtns.length > 0) {
    saveBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (editForm) {
          // Edit form page
          updateFoodItem(userID);
        } else {
          // Add form page
          writeFood(userID);
        }
      });
    });
  }

  // DELETE FUNCTION
  const deleteBtns = document.querySelectorAll(".js-delete-btn");
  if (deleteBtns.length < 0) {
    return;
  }
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("clicked");
      db.collection("users")
        .doc(userID)
        .collection("food")
        .doc(getURLParams("docID"))
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          history.back();
          // window.location.href = `mykitchen.html?storage=${spaceName}`;
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    });
  });
});

function toggleMeatballOverlay() {
  meatballOverlayTrigger.addEventListener("click", () => {
    // Show or hide the overlay based on the new state
    meatballOverlay.classList.toggle("tw-hidden");

    // Adjust the button text color accordingly
    meatballOverlayTrigger.classList.toggle("tw-text-neutral");
  });

  // Close overlay when clicking outside of it
  document.addEventListener("click", (event) => {
    // overlay open, not clicking inside of overlay or overlay trigger button
    if (
      !meatballOverlay.contains(event.target) &&
      !meatballOverlayTrigger.contains(event.target)
    ) {
      // Close overlay
      meatballOverlay.classList.add("tw-hidden");
      meatballOverlayTrigger.classList.remove("tw-text-neutral");
    }
  });
}

function toggleStorageDropdown() {
  const storageBtn = document.querySelector(".js-show-storage-list");
  const btnArrow = storageBtn.querySelector(".js-down-arrow");
  const storageDropdownContainer = document.querySelector(
    ".js-storage-dropdown"
  );

  if (!storageBtn && !btnArrow && !storageDropdownContainer) {
    return;
  }
  storageBtn.addEventListener("click", (e) => {
    storageDropdownContainer.classList.toggle("tw-hidden");
    btnArrow.classList.toggle("tw-rotate-180");
  });

  // Close overlay when clicking outside of it
  document.addEventListener("click", (event) => {
    // overlay open, not clicking inside of overlay or storage button
    if (
      !storageDropdownContainer.contains(event.target) &&
      !storageBtn.contains(event.target)
    ) {
      // Close overlay
      storageDropdownContainer.classList.add("tw-hidden");
      btnArrow.classList.remove("tw-rotate-180");
    }
  });
}

// Add food items
function writeFood(userID) {
  // Add a new document inside users > food (sub collection)
  var foodRef = db.collection("users").doc(userID).collection("food");
  let foodSlug = slugify(foodName.value);

  foodRef
    .add({
      userID: userID,
      title: foodName.value,
      slug: foodSlug,
      expiry_date: foodExpiryDate.value,
      category: foodCategory.value,
      storage_space: foodStorage.value,
      quantity: foodQuantity.value,
      image: foodImage.value.split("\\").pop(),
      notes: foodNotes.value,
      date_created: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then((foodRef) => {
      console.log("Document written with ID:", foodRef);
      window.location.href = "mykitchen.html?storage=all_spaces";
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}

function createStorageSpaceDropdown(userID) {
  let storageDropdownTemplate = document.getElementById(
    "storageDropdownTemplate"
  );
  let storageSpaceDropdown = document.getElementById("storageSpaceDropdown");
  var storageSpaceList = ["Fridge", "Freezer", "Pantry", "Other"];

  // Handle the "All Spaces" entry first
  let allFoodItems = db.collection("users").doc(userID).collection("food");
  allFoodItems.get().then((doc) => {
    let allSpacesSize = doc.size;

    // Clone the template for "All Spaces"
    let allSpacesBtn = storageDropdownTemplate.content.cloneNode(true);

    // Update the number of items for "All Spaces"
    let allSpacesNumElement = allSpacesBtn.querySelector(
      ".js-storage-space-num"
    );
    if (allSpacesNumElement) {
      allSpacesNumElement.innerHTML = `${allSpacesSize} items`;
    }

    // Update the title for "All Spaces" directly in the anchor tag
    let allSpacesLinkElement = allSpacesBtn.querySelector("a");
    if (allSpacesLinkElement) {
      allSpacesLinkElement.href = "mykitchen.html?storage=all_spaces";
      allSpacesLinkElement.querySelector(".js-storage-space-title").innerHTML =
        "All Spaces";
    }

    // Append the "All Spaces" button to the dropdown
    storageSpaceDropdown.appendChild(allSpacesBtn);

    // Add the underline only under "All Spaces"
    let underlineDiv = document.createElement("div");
    underlineDiv.classList.add(
      "tw-w-[90%]",
      "tw-h-[1px]",
      "tw-bg-neutral-light",
      "tw-mx-auto"
    );
    storageSpaceDropdown.appendChild(underlineDiv);

    // Handle individual storage spaces (Fridge, Freezer, Pantry, Other)
    storageSpaceList.forEach((space) => {
      let filteredItems = db
        .collection("users")
        .doc(userID)
        .collection("food")
        .where("storage_space", "==", space)
        .get()
        .then((doc) => {
          let spaceSize = doc.size;

          // Clone the template for each individual space
          let spaceBtn = storageDropdownTemplate.content.cloneNode(true);

          // Find and update the number of items for the storage space
          let spaceNumElement = spaceBtn.querySelector(".js-storage-space-num");
          if (spaceNumElement) {
            spaceNumElement.innerHTML = `${spaceSize} items`;
          }

          // Find and update the title for the storage space
          let spaceTitleElement = spaceBtn.querySelector(
            ".js-storage-space-title"
          );
          if (spaceTitleElement) {
            spaceTitleElement.innerHTML = space;
          }

          // Update the title directly in the anchor tag
          let spaceLinkElement = spaceBtn.querySelector("a");
          if (spaceLinkElement) {
            spaceLinkElement.href = `mykitchen.html?storage=${slugify(space)}`;
          }
          // Append to the dropdown
          storageSpaceDropdown.appendChild(spaceBtn);
        });
    });
  });
}

// Function to toggle visibility of multiple elements
function toggleElementsVisibility(elements) {
  elements.forEach((element) => element.classList.toggle("tw-hidden"));
}

function showSelectOverlay(userID, spaceName) {
  // Select items
  const searchBtn = document.querySelector(".js-search-btn");
  const doneBtn = document.querySelector(".js-done-btn");
  const meatballOverlayTrigger = document.querySelector(".js-meatball-menu");
  const selectOverlay = document.querySelector(".js-select-overlay");
  const checkboxes = document.querySelectorAll("#foodItemList .form-check");
  const foodCards = document.querySelectorAll(".food-link");

  // Get a list of items to be deleted or moved
  var selectedList = [];

  // Function to toggle checkboxes' display style
  function toggleCheckboxesDisplay(show) {
    checkboxes.forEach((checkbox) => {
      checkbox.style.display = show ? "block" : "none";
    });
  }

  // Select button event listener
  selectBtn.addEventListener("click", () => {
    toggleElementsVisibility([
      selectOverlay,
      meatballOverlay,
      searchBtn,
      meatballOverlayTrigger,
      doneBtn,
    ]);
    toggleCheckboxesDisplay(true);

    // Disable clicking on the card and add item button
    [btnAddItem, ...foodCards].forEach((link) => {
      link.style.pointerEvents = "none";
    });
  });
  
  // Done button event listener
  doneBtn.addEventListener("click", () => {
    toggleElementsVisibility([
      selectOverlay,
      meatballOverlay,
      searchBtn,
      meatballOverlayTrigger,
      doneBtn,
    ]);
    meatballOverlay.classList.add("tw-hidden"); // Explicitly hide meatballOverlay
    meatballOverlayTrigger.classList.remove("tw-text-neutral");
    toggleCheckboxesDisplay(false);
    itemCounter.innerHTML = "0 item(s) selected";

    [btnAddItem, ...foodCards].forEach((link) => {
      link.style.pointerEvents = "auto";
    });

    // reset the list
    selectedList = [];

    // Uncheck the checked boxes
    foodItemList.querySelectorAll(".form-check-input").forEach((checkbox) => {
      checkbox.checked = false;
    });
  });
  foodItemList.querySelectorAll(".form-check-input").forEach((checkbox) => {
    // console.log(checkbox);
    checkbox.addEventListener("click", () => {
      let itemID = checkbox.dataset.id;
      if (checkbox.checked) {
        if (!selectedList.includes(itemID)) {
          selectedList.push(itemID);
        }
        // console.log(selectedList.length);

        // Show number of selected items
        itemCounter.innerHTML = `${selectedList.length} item(s) selected`;
        console.log(checkbox, "checked");
      } else {
        // Get everything except for the selected item
        selectedList = selectedList.filter((id) => id !== itemID);
        console.log(checkbox, "unchecked");
      }
      console.log(selectedList);
    });

    // Close overlay when clicking outside of it
    document.addEventListener("click", (event) => {
      if (!sortOverlay) {
        return;
      }
      // overlay open, not clicking inside of overlay or overlay trigger button
      if (bgOverlay.contains(event.target)) {
        // Close overlay
        sortOverlay.classList.add("tw-hidden");
      }
    });
  });

  const deleteBtn = document.querySelector(".js-delete-btn");
  deleteBtn.addEventListener("click", () => {
    selectedList.forEach((itemID) => {
      db.collection("users")
        .doc(userID)
        .collection("food")
        .doc(itemID)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
          window.location.href = `mykitchen.html?storage=${spaceName}`;
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    });
  });

  // Open and close move items overlay
  const moveBtn = document.querySelector(".js-move-btn");
  const moveOverlay = document.querySelector(".js-move-overlay");
  const closeMoveBtn = document.querySelector(".js-close-move-btn");
  moveBtn.addEventListener("click", () => {
    toggleElementsVisibility([selectOverlay, moveOverlay, doneBtn]);
  });
  closeMoveBtn.addEventListener("click", () => {
    toggleElementsVisibility([selectOverlay, moveOverlay, doneBtn]);
  });

  // Write new storage place to database
  const moveToFridge = document.querySelector("#moveToFridge");
  const moveToFreezer = document.querySelector("#moveToFreezer");
  const moveToPantry = document.querySelector("#moveToPantry");
  const moveToOther = document.querySelector("#moveToOther");

  moveToFridge.addEventListener("click", () => {
    selectedList.forEach((itemID) => {
      db.collection("users")
        .doc(userID)
        .collection("food")
        .doc(itemID)
        .update({
          storage_space: "Fridge",
        })
        .then(() => {
          window.location.href = `mykitchen.html?storage=${spaceName}`;
        })
        .catch((error) => {
          console.error("Error moving item: ", error);
        });
    });
  });

  moveToFreezer.addEventListener("click", () => {
    selectedList.forEach((itemID) => {
      db.collection("users")
        .doc(userID)
        .collection("food")
        .doc(itemID)
        .update({
          storage_space: "Freezer",
        })
        .then(() => {
          window.location.href = `mykitchen.html?storage=${spaceName}`;
        })
        .catch((error) => {
          console.error("Error moving item: ", error);
        });
    });
  });

  moveToPantry.addEventListener("click", () => {
    selectedList.forEach((itemID) => {
      db.collection("users")
        .doc(userID)
        .collection("food")
        .doc(itemID)
        .update({
          storage_space: "Pantry",
        })
        .then(() => {
          window.location.href = `mykitchen.html?storage=${spaceName}`;
        })
        .catch((error) => {
          console.error("Error moving item: ", error);
        });
    });
  });

  moveToOther.addEventListener("click", () => {
    selectedList.forEach((itemID) => {
      db.collection("users")
        .doc(userID)
        .collection("food")
        .doc(itemID)
        .update({
          storage_space: "Other",
        })
        .then(() => {
          window.location.href = `mykitchen.html?storage=${spaceName}`;
        })
        .catch((error) => {
          console.error("Error moving item: ", error);
        });
    });
  });
}

// Display Food items on My Kitchen page
function displayFoodByStorageSpace(userID, storageSpace, sortingMethod) {
  return new Promise((resolve, reject) => {
    var currentSpaceTitle;
    // Update current space
    switch (storageSpace) {
      case "all_spaces":
        currentSpaceTitle = "All Spaces";
        break;
      case "other":
        currentSpaceTitle = "Other";
        break;
      default:
        currentSpaceTitle = `My ${convertToTitleCase(storageSpace)}`;
        break;
    }

    currentSpace.innerHTML = currentSpaceTitle;

    if (foodItemList && foodItemTemplate) {
      // Clear existing items
      foodItemList.innerHTML = "";

      let allFoodItems = db.collection("users").doc(userID).collection("food");
      let filteredItems = allFoodItems.where(
        "storage_space",
        "==",
        convertToTitleCase(storageSpace)
      );

      let ref = storageSpace == "all_spaces" ? allFoodItems : filteredItems;

      ref
        .get()
        .then((items) => {
          // Get the sorting method from url if default doesn't exist(set by sort radio buttons )
          sortingMethod = sortingMethod ? sortingMethod : getURLParams("sort");

          // Call the appropriate display function based on sorting method
          switch (sortingMethod) {
            case "Category":
              displayFoodItemsByCategory(items);
              break;
            case "Expiration Date":
              displayFoodItemsByExpiryDate(items);
              break;
            case "Name":
              displayFoodItemsByName(items);
              break;
            default:
              displayFoodItemsByCategory(items);
          }

          resolve(); // Resolve the promise after all items are processed
        })
        .catch((error) => {
          console.error("Error getting documents:", error);
          reject(error);
        });
    } else {
      reject(new Error("foodItemList or foodItemTemplate is missing"));
    }
  });
}

function setupSortingOptions(userID, storageSpace, defaultSortingMethod) {
  const sortPreview = document.querySelector(".js-sort-preview");
  const sortingOptions = document.querySelectorAll(
    '.js-sort-by input[type="radio"]'
  );

  // Pre-select the appropriate sorting radio button based on the current sorting method
  sortingOptions.forEach((option) => {
    if (option.value === defaultSortingMethod) {
      option.checked = true;
      sortPreview.innerHTML = defaultSortingMethod; // Update preview text to reflect the current sorting method
    }
  });

  sortingOptions.forEach((option) => {
    option.addEventListener("change", function () {
      if (this.checked) {
        let sortingMethod = this.value;

        setURLParams("sort", sortingMethod);
        // Clear existing items
        foodItemList.innerHTML = "";

        // Update text under sort menu
        sortPreview.innerHTML = sortingMethod;
        // Call displayFoodByStorageSpace with the selected sorting method
        displayFoodByStorageSpace(userID, storageSpace, sortingMethod)
          .then(() => {
            console.log(
              `Items sorted by ${sortingMethod} have been displayed.`
            );
            // Close the sort overlay if needed
            toggleElementsVisibility([sortOverlay]);
          })
          .catch((error) => {
            console.error("Failed to display food items:", error);
          });
      }
    });
  });
}

function calculateTimeLeft(date) {
  // Define two Date objects representing the start and end dates
  const currentDate = Date.now(); // Current date and time in milliseconds
  const expiryDate = new Date(date);

  // Calculate the time difference in milliseconds
  var timeDifference = expiryDate - currentDate;

  // Calculate the time left in days

  var timeDifferenceDays = Math.ceil(timeDifference / 86400000);

  return timeDifferenceDays;
}

function determineRemainingDaysMessage(daysLeft, date) {
  // determine remaining days message
  let message;
  switch (true) {
    case daysLeft === 0:
      message = "Today";
      break;
    case daysLeft === 1:
      message = "Tomorrow";
      break;
    case daysLeft < 0:
      message = `${Math.abs(daysLeft)} days past`;
      break;
    case daysLeft > 5 && !editForm:
      message = date;
      break;
    default:
      message = `${daysLeft} days left`;
      break;
  }

  return message;
}

document.addEventListener("DOMContentLoaded", () => {
  if (!btnAddItem || !addOverlay) {
    return;
  }

  // Show/Hide Add overlay when clicking on the plus icon
  btnAddItem.addEventListener("click", (event) => {
    if (addOverlay.classList.contains("is-active")) {
      addOverlay.classList.remove("is-active");
    } else {
      addOverlay.classList.add("is-active");
    }
  });

  // Close overlay when clicking outside of it
  document.addEventListener("click", (event) => {
    // overlay open, not clicking inside of overlay or add button
    if (
      addOverlay.classList.contains("is-active") &&
      !addOverlay.contains(event.target) &&
      !btnAddItem.contains(event.target)
    ) {
      // Close overlay
      addOverlay.classList.remove("is-active");
    }
  });
});



function populateFoodInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      console.log("populateFoodInfo");
      var foodItemRef = db
        .collection("users")
        .doc(user.uid)
        .collection("food")
        .doc(getURLParams("docID"));
      foodItemRef
        .get()
        .then((doc) => {
          if (doc.exists) {
            console.log("Document data:", doc.data());
            //get the data fields of the food item
            let title = doc.data().title;
            let expiry_date = doc.data().expiry_date;
            let category = doc.data().category;
            let storage_space = doc.data().storage_space;
            let quantity = doc.data().quantity;
            let image = doc.data().image;
            let notes = doc.data().notes;
            let dateCreated = doc.data().date_created;
            let daysLeft = calculateTimeLeft(expiry_date);

            //if the data fields are not empty, then write them in to the form.
            if (title != null) {
              document.querySelector(".js-edit-form #nameInput").value = title;
            }
            if (expiry_date != null) {
              document.querySelector(".js-edit-form #datepickerInput").value =
                expiry_date;
            }
            if (category != null) {
              document.querySelector(".js-edit-form #categoryInput").value =
                category;
            }
            if (storage_space != null) {
              document.querySelector(".js-edit-form #storageSpaceInput").value =
                storage_space;
            }
            if (quantity != null) {
              document.querySelector(".js-edit-form #quantityInput").value =
                quantity;
            }
            if (image) {
              iconPath = `../images/icons/food/${image}`;
            } else {
                iconPath = "../images/icons/placeholder.svg";
            }
            document.querySelector(".js-edit-form #previewImg").src = iconPath;
            if (notes != null) {
              document.querySelector(".js-edit-form #notesInput").value = notes;
            }
            if (daysLeft != null) {
              document.querySelector(
                ".js-edit-form .js-days-remaining"
              ).innerHTML = determineRemainingDaysMessage(
                daysLeft,
                expiry_date
              );
            }
          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.log("Error getting document:", error);
        });
    }
  });
}

function updateFoodItem(userID) {
  // Update doc with new data input inside users > food (sub collection)
  var foodRef = db
    .collection("users")
    .doc(userID)
    .collection("food")
    .doc(getURLParams("docID"));
  let foodSlug = slugify(foodName.value);

  foodRef
    .update({
      userID: userID,
      title: foodName.value,
      slug: foodSlug,
      expiry_date: foodExpiryDate.value,
      category: foodCategory.value,
      storage_space: foodStorage.value,
      quantity: foodQuantity.value,
      image: foodImage.value.split("\\").pop(),
      notes: foodNotes.value,
      date_updated: firebase.firestore.FieldValue.serverTimestamp(),
    })
    .then((foodRef) => {
      console.log("Document updated with ID:", foodRef);
      window.location.href = "mykitchen.html?storage=all_spaces";
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
}


//------------------------------------------------
// Upload Image on Add Food/ Edit Item pages
//-------------------------------------------------
const uploadImageInput = document.querySelector("#imageUpload");
if (uploadImageInput) {
  uploadImageInput.addEventListener("change", () => {
    previewFile()
  })
}
export { calculateTimeLeft, determineRemainingDaysMessage };

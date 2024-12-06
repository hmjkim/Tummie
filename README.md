# Project Title

## 1. Project Description

Tummie is a food expiry date tracker which helps reduce the food waste by reminding users of expiring foods and providing recipe suggestions in order to encourage food consumption.

## 2. Names of Contributors

- Heather Kim
- Hazel Jeong
- Hei Yeung Sze
	
## 3. Technologies and Resources Used

- HTML, CSS, JavaScript
- Bootstrap 5.0 (Frontend library)
- jQuery 3.5.1 (JavaScript library)
- Firebase 8.0 (BAAS - Backend as a Service)
- Tailwind 3.4.13 (CSS framework)
- Google fonts and icons
    - [Poppins](https://fonts.google.com/specimen/Poppins)
    - [Inter](https://fonts.google.com/specimen/Inter)

- [Flaticon](https://www.flaticon.com/)
- [Free Meal API from TheMealDB.com](https://www.themealdb.com/api.php)

## 4. Complete setup/installation/usage

No setup or installation is required for this application. A dummy account, with pre-written data, is created for testing pupose:

Username: `oliviab@test.ca`

Password: `password`

## 5. Known Bugs and Limitations

Here are some known bugs and limitations:

- The pagination on favourite.html breaks when users unsave the only item on a page. For example, if there is only one saved recipe on page 2 and the user removes it, the application remains on page 2 instead of redirecting the user back to page 1, and the pagination bar at the bottom displays incorrect information.

- The application does not prevent invalid data entry. For example, when the user fails to input an expiry date, "NaN days left" is displayed. Additionally, if the user omits the item name, the "sort by name" feature crashes. Implementing form validation and marking required fields could likely resolve these issues.


## 6. Features for Future

What we'd like to build in the future:

- Search Feature: Allows users to input keywords to search the database for relevant data, such as items and recipes.

- Personalized Recipe Recommendations: Analyzes the user's inventory to identify nearly expired items and suggests recipes based on those items, offering a more tailored user experience.

- ShareHub Feature: serves as a platform for users to share and get surplus food within their local communities.

- Bulk Data Entry, Barcode and Receipt Scanning, and Auto-Complete Suggestions: Enhances the user experience by minimizing the effort required for data entry.

## 7. Contents of Folder

Content of the project folder:

```
.
├── README.md
├── 404.html
├── firebase.json
├── firestore.indexes.json
├── firestore.rules
├── images         # Folder for images
│   ├── icons       # Folder for icons
│   │   ├── about.svg
│   │   ├── account.svg
│   │   ├── arrow-left.svg
│   │   ├── arrow.svg
│   │   ├── close.svg
│   │   ├── favorite.svg
│   │   ├── food        # Folder for food icons used in demo
│   │   │   ├── apple.svg
│   │   │   ├── carrot.svg
│   │   │   ├── cheese.svg
│   │   │   ├── egg.svg
│   │   │   ├── kiwi.svg
│   │   │   ├── lemon.svg
│   │   │   ├── meat.svg
│   │   │   ├── potato.svg
│   │   │   └── tomato.svg
│   │   ├── home.svg
│   │   ├── logout.svg
│   │   ├── mykitchen-active.svg
│   │   ├── mykitchen.svg
│   │   ├── placeholder.svg
│   │   ├── profile-active.svg
│   │   ├── profile.svg
│   │   ├── recipes-active.svg
│   │   ├── recipes.svg
│   │   ├── setting.svg
│   │   ├── sharehub-active.svg
│   │   ├── sharehub.svg
│   │   ├── support.svg
│   │   └── warning.svg
│   └── logo        # Folder for logo images
│       ├── logo-placeholder.svg
│       ├── logo-white.svg
│       └── logo.svg
├── index.html      # Page shows the user sign in and sing up options
├── login.html      # Page shows the login window
├── mykitchen       # Folder for my kitchen related pages
│   ├── addFood.html    # Page for adding food items
│   └── eachFood.html   # Page for editing food items which shows the food item information
├── mykitchen.html      # Page shows the food inventory
├── partials        # Folder for header and footer related files
│   ├── footer.html     # Page for desktop view footer
│   ├── header.html     # Page for header
│   ├── headerBeforeLogin.html      # Page for header before login
│   └── stickyMobileNav.html        # Page for mobile view footer
├── profile.html    # Page that users can udpate account info, change setting, and submit service requests, etc.
├── recipes     # Folder for recipe-related subpages
│   ├── eachFavouriteRecipe.html    # Page that populates each saved recipe's details
│   ├── eachRecipe.html     # Page that populates each recipe's details
│   └── favourite.html      # Page that displays saved recipes 
├── recipes.html        # Page that displays all recipes
├── sharehub.html       # Page that users can see food sharing information (under construction)
├── scripts         # Folder for scripts
│   ├── authentication.js       # Contains authentication-related functions
│   ├── eachFavouriteRecipe.js      # Contains functions associated with eachFavouriteRecipe.html
│   ├── eachRecipe.js       # Contains functions associated with eachRecipe.html
│   ├── favourite.js        # Contains functions associated with favourite.html
│   ├── firebaseAPI_DTC02.js        # Contains functions associated with firebase implementation
│   ├── food        # Sub-Folder for files that contain functions associated with mykitchen.html
│   │   ├── food.js
│   │   ├── foodHelpers.js
│   │   └── sortFood.js
│   ├── profile.js      # Contains functions associated with profile.html
│   ├── recipes.js      # Contains functions associated with recipes.html
│   ├── script.js       # Contains functions associated with general set-up
│   ├── sharehub.js     # Contains functions associated with sharehub.html
│   └── skeleton.js     # Contains functions associated with partials
├── styles      # Folder for CSS styling
│   └── style.css
└── tailwind.config.js      # File that configures tailwind
```

## 8. References

List of references we used:

- [Preview image before upload to the server](https://javascript.plainenglish.io/how-to-preview-image-before-upload-in-jquery-daca0849e00c)
- [Replace image automatically with newly selected image]()
- [Date Picker Plugin](https://gijgo.com/datepicker/example/bootstrap-5)
- [Slugify a string](https://dev.to/bybydev/how-to-slugify-a-string-in-javascript-4o9n)
- [Change to title case](https://dev.to/ypdev19/ways-to-title-case-strings-with-javascript-1dpe)
- [SET Query string](https://zgadzaj.com/development/javascript/how-to-change-url-query-parameter-with-javascript-only)

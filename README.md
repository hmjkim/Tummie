# Project Title

## 1. Project Description

Tummie is a food expiry date tracker which helps reduce the food waste by reminding users of expiring foods and providing recipe suggestions.

## 2. Names of Contributors

- Heather Kim
- Hazel Jeong
- Hei Yeung Sze
	
## 3. Technologies and Resources Used

List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.

- HTML, CSS, JavaScript
- Bootstrap 5.0 (Frontend library)
- jQuery 3.5.1 (JavaScript library)
- Firebase 8.0 (BAAS - Backend as a Service)
- Tailwind 3.4.13 (CSS framework)
- Google fonts and icons
    - [Poppins](https://fonts.google.com/specimen/Poppins)
    - [Inter](https://fonts.google.com/specimen/Inter)

- [Flaticon](https://www.flaticon.com/)
- Free Meal API from TheMealDB.com (https://www.themealdb.com/api.php)

## 4. Complete setup/installation/usage

No setup or installation is required for this application.

A dummy account, with pre-written data, is created for testing pupose:

Username: `oliviab@test.ca`

Password: `password`


## 5. Known Bugs and Limitations

Here are some known bugs:

- The pagination for favourite.html crashes when users unsave the only item on the page, e.g. if there is only one saved recipe on page 2 and the user unsaves it, the application remains on page 2 and does not redirect the user back to page one. The pagination bar at the bottom will display falsely. 

- The sorting feature does not work for specified kitchen spaces. The application allows users to navigate through "All space" and individual kitchen spaces (pantry, freezer, fridge, etc.) to keep the food items organized. However, if the user views the items by specific space and click on the sorting button, it re-directs them to "All space". 

## 6. Features for Future

What we'd like to build in the future:

- Search feature: allows users to input keywords to search through the database to look up relevant data, such as items and recipes.

- Personalized recipe recommendations: reads through the user's document to identify almost-expired items, and then recommends recipes based on those items to provide a more personalized user experience.

- ShareHub feature: serves as a platform to allow users to share and get surplus food in their local communities.

- Bulk data entry, barcode and receipt scanning, and auto-complete suggestions for textboxes: improves user expereince by minimizing the effort required for data entry

## 7. Contents of Folder

Content of the project folder:

```
 Top level of project folder:
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to url
└── README.md

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
    /about.svg                # Acknowledge source
    /account.svg
    /arrow-left.svg
    /arrow.svg
    /close.svg
    /favorite.svg
    /home.svg
    /home.svg
    /logout.svg
    /my-kitchen-active.svg
    /mykitchen.svg
    /placeholder.svg
    /profile-acitve.svg
    /profile.svg
    /recipes-active.svg
    /recipes.svg
    /setting.svg
    /sharehub-active.svg
    /sharehub.svg
    /support.svg
    /warning.svg
├── scripts                  # Folder for scripts
    /blah.js                 #
├── styles                   # Folder for styles
    /style.css                #



```

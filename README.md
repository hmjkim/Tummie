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

//---------------------------------------------------
// This function loads the parts of your skeleton
// (navbar, footer, and other things) into html doc.
//---------------------------------------------------
function loadSkeleton() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // https://api.jquery.com/jQuery.when/
        // Ensure header, footer, and mobile nav are loaded first before calling the callback function (returning Promise)
        var d1 = $.Deferred();
        var d2 = $.Deferred();
        var d3 = $.Deferred();

        $("#headerContent").load("../partials/header.html", () => { d1.resolve()});

        // For addFood and eachFood pages
        if( $('#stickyMobileNav').length == 0 ){
          $.when(d1).done(() => {
            updateActiveNavLink();
          });
        } else {
          
          $("#footerContent").load("../partials/footer.html", () => { d2.resolve()});
          $("#stickyMobileNav").load("../partials/stickyMobileNav.html", () => { d3.resolve()});
  
        $.when(d1, d2, d3).done(() => {
          updateActiveNavLink();
        });
      }
    }
  });
}

$(document).ready(function () {
  loadSkeleton();
});

//---------------------------------------------------
// Update sticky nav bar links to be highlighted if current page
//---------------------------------------------------
function updateActiveNavLink() {
  const navLinks = document.querySelectorAll("#stickyMobileNav a");
  const desktopNavLinks = document.querySelectorAll(
    "#headerContent .nav-item a"
  );
  const currentURL = window.location.pathname;
    [...navLinks, ...desktopNavLinks].forEach((link) => {
      let linkURL = link.getAttribute('href');
      let parentPath = currentURL.split('/')[1];

      // Create a parent and child page relationship 
      // eg. recipes.html (parent) , recipes/eachRecipe.html
      // eg. child page under recipes will have recipe link highlighted
      if (linkURL.includes(parentPath)) {
        let linkText = link.innerText;
        link.classList.add('active');
        let linkIcon = link.querySelector('img');
        if (linkIcon) {
          linkIcon.src = `../images/icons/${slugify(linkText)}-active.svg`
        }
      }
    });
  }

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, ""); // remove spaces
  return str;
}

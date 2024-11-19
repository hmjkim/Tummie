//---------------------------------------------------
// This function loads the parts of your skeleton
// (navbar, footer, and other things) into html doc.
//---------------------------------------------------
function loadSkeleton() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      $('#headerContent').load('./partials/header.html');
      $('#footerContent').load('./partials/footer.html');
      $('#stickyMobileNav').load('./partials/sticky_mobile_nav.html', () => {
        updateActiveNavLink()
      });
    } 
  });
  }

$(document).ready(function(){
    loadSkeleton(); 

});


//---------------------------------------------------
// Update sticky nav bar links to be highlighted if current page
//---------------------------------------------------
function updateActiveNavLink() {
  const navLinks = document.querySelectorAll('#stickyMobileNav a');
  const currentURL = window.location.pathname;

  navLinks.forEach((link) => {
    if (link.getAttribute('href').includes(currentURL)) {
      let linkText = link.innerText;
      link.classList.add('active');
      link.querySelector('img').src = `./images/icons/${slugify(linkText)}-active.svg`
    }
  });
}

function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
  return str;
}
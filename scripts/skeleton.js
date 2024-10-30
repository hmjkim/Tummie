//---------------------------------------------------
// This function loads the parts of your skeleton
// (navbar, footer, and other things) into html doc.
//---------------------------------------------------
function loadSkeleton() {
    $('#headerContent').load('./partials/header.html');
    $('#footerContent').load('./partials/footer.html');
    $('#stickyMobileNav').load('./partials/sticky_mobile_nav.html');
  }

$(document).ready(function(){
    loadSkeleton(); 
});
  
//------------------------------------------------
// Go back to previous page
//-------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const goBackBtn = document.getElementById("go-back");
    if (!goBackBtn) {
        return;
    }
    goBackBtn.addEventListener("click", () => {
        history.back();
      });
})

//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        console.log("logging out user");
      })
      .catch((error) => {
        // An error happened.
      });
}

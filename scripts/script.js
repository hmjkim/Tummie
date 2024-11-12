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
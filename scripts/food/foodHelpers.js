// Preview Uploaded Image File before server submission
function previewFile(input) {
  var file = $("input[type=file]").get(0).files[0];
  
  if (file) {
    var reader = new FileReader();

    reader.onload = function () {
      $("#previewImg").attr("src", reader.result);
    };

    reader.readAsDataURL(file);

    // Save file name to local storage for reference
    saveFileName(file);
  }
}

function saveFileName(file) {
  let fileName = file.name;
  localStorage.setItem('uploadedFileName', fileName);
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

function convertToTitleCase(str) {
  if (!str) {
    return "";
  }
  return str.toLowerCase().replace(/\b\w/g, (s) => s.toUpperCase());
}

function getURLParams(key) {
  const params = new URL(window.location.href).searchParams; // get the url from the search bar and its search parameters
  const value = params.get(key);

  return value;
}

function setURLParams(key, value) {
  let url = new URL(window.location.href);
  url.searchParams.set(key, value); // get the search parameter and add a new query string with key value

  // Go to url without reloading
  history.pushState(null, "", url);
}

export { previewFile, slugify, convertToTitleCase, getURLParams, setURLParams }

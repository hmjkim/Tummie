// Preview Uploaded Image File before server submission
// https://javascript.plainenglish.io/how-to-preview-image-before-upload-in-jquery-daca0849e00c
function previewFile(input) {
  var file = $("input[type=file]").get(0).files[0];
  
  if (file) {
    var reader = new FileReader();

    reader.onload = function () {
      $("#previewImg").attr("src", reader.result);
    };

    reader.readAsDataURL(file);
  }
}

function saveFileName(input) {
  var file = $("input[type=file]").get(0).files[0];
  let fileName = file.name;
  localStorage.setItem('uploadedFileName', fileName);
}

// Slugify text
// https://dev.to/bybydev/how-to-slugify-a-string-in-javascript-4o9n
function slugify(str) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
  return str;
}

// Change to title case
// https://dev.to/ypdev19/ways-to-title-case-strings-with-javascript-1dpe
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


// Set query parameters with history push
// https://zgadzaj.com/development/javascript/how-to-change-url-query-parameter-with-javascript-only
function setURLParams(key, value) {
  let url = new URL(window.location.href);
  url.searchParams.set(key, value); // get the search parameter and add a new query string with key value

  // Go to url without reloading
  history.pushState(null, "", url);
}

export { previewFile, slugify, convertToTitleCase, getURLParams, setURLParams, saveFileName }

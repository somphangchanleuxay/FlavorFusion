$(document).ready(function() {
    $("#replaceContentButton").click(function() {
      $("#sectionToReplace").html
      ("<h2>New Content</h2><p>This is the new content of the 'about' section.</p>");
    });
  });


function getApi (){

var requestUrl = 'https://www.themealdb.com/api/json/v2/9973533/filter.php?i=chicken_breast,garlic,salt';
  
fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    console.log(data)
     })
}

const options = {method: 'GET', headers: {accept: 'application/json'}};

fetch('https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=20', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err))

// The following items are for the pantry form data

var pantryFormEl = $('#pantry-form');
var pantryListEl = $('#pantry-list');
var pantryClListEl = $('input[name="pantry-input"]');


function handleFormSubmit(event) {
  event.preventDefault();

  
  console.log('Pantry Item:', pantryClListEl.val());

  var pantryItem = $('input[name="pantry-input"]').val();
  if (!pantryItem) {
    console.log('No pantry item entered!');
    return;
  }

  pantryListEl.append('<li>' + pantryItem + '</li>');

  $('input[name="pantry-input"]').val('');
}

pantryFormEl.on('submit', handleFormSubmit);

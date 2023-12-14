$(document).ready(function() {
    $("#replaceContentButton").click(function() {
      $("#sectionToReplace").html
      ("<h2>New Content</h2>;<p>This is the new content of the 'about' section.</p>");
    });
  });
  
  var pantryFormEl = $('#pantry-form');
  var pantryListEl = $('#pantry-list');
  var pantryClListEl = $('input[name="pantry-input"]');
  var mealdbIngredients;

function handleFormSubmit(event) {
  event.preventDefault();
  
  var pantryItem = $('input[name="pantry-input"]').val();
  if (!pantryItem) {
    console.log('No pantry item entered!');
    return;
  }
  
  pantryListEl.append('<li>' + pantryItem + '</li>');
  
  $('input[name="pantry-input"]').val('');
}

pantryFormEl.on('submit', handleFormSubmit);

function getmealdb (){

  var requestUrl = 'https://www.themealdb.com/api/json/v2/9973533/filter.php?i=' + mealdbIngredients;
    
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data)
       })
  }

function ingredientSearch() {
  
  const inputArray = [];
  
  // Get the input elements
  $(pantryListEl).children().each(function(){
    // Print the array to the console
    inputArray.push($(this).text().trim());
    console.log(inputArray);
  });
  
  mealdbIngredients = inputArray.toString()
  console.log(mealdbIngredients);

}

ingredientSearch();

$("#searchButton").click(function(){
  ingredientSearch ();
  getmealdb ();
});




// const options = {method: 'GET', headers: {accept: 'application/json'}};

// fetch('https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=20', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err))


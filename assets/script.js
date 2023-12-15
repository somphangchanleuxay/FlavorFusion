$(document).ready(function() {
  
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

  // var requestUrl = 'https://www.themealdb.com/api/json/v2/9973533/filter.php?i=' + mealdbIngredients;
  var requestUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + mealdbIngredients;
  
  fetch(requestUrl)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    displayResults(data.meals);
  })
  .catch(function (error) {
    console.error('Error fetching data from MealDB API:', error);
  });
}

function displayResults(meals) {
  console.log (meals);
  var resultsContainer = $('#results-container');
  resultsContainer.empty(); // Clear previous results

  meals.forEach(function (meal) {
    // Create a container for each meal
    var mealContainer = $('<div class="meal-container"></div>');

    // Set the HTML content directly for the container using template literals
    mealContainer.html(`
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h3>${meal.strMeal}</h3>
      <h4>Ingredients:</h4>
      <ul>${getIngredientsList(meal)}</ul>
      <h4>Instructions:</h4>
      <p>${meal.strInstructions}</p>
    `);

    // Append the meal container to the results container
    resultsContainer.append(mealContainer);
  });
}

function getIngredientsList(meal) {
  var ingredientsList = '';
  for (var i = 1; i <= 20; i++) {
    var ingredient = meal['strIngredient' + i];
    var measure = meal['strMeasure' + i];
    if (ingredient && measure) {
      ingredientsList += `<li>${measure} ${ingredient}</li>`;
    }
  }
  return ingredientsList;
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

$("#searchButton").click(function() {
  ingredientSearch();
  getmealdb();
});




// const options = {method: 'GET', headers: {accept: 'application/json'}};

// fetch('https://api.yelp.com/v3/businesses/search?sort_by=best_match&limit=20', options)
//   .then(response => response.json())
//   .then(response => console.log(response))
//   .catch(err => console.error(err))


$(document).ready(function() {
  
  });
  
  var pantryFormEl = $('#pantry-form');
  var pantryListEl = $('#pantry-list');
  var pantryClListEl = $('input[name="pantry-input"]');
  var mealdbIngredients;
  var resultsContainer;
  var mealContainer;

function handleFormSubmit(event) {
  event.preventDefault();
  
  var pantryItem = $('input[name="pantry-input"]').val();
  if (!pantryItem) {
    console.log('No pantry item entered!');
    return;
  }

  // Clear old pantry items before adding a new one
  pantryListEl.empty();

  // Add the new pantry item
  pantryListEl.append('<li>' + pantryItem + '</li>');

  // Clear the input field
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
      <h1 class="recipe-title">${meal.strMeal}</h1>
      <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
      <h2 class="font-resultsize">Ingredients:</h2>
      <ul class="ingredient-mod">${getIngredientsList(meal)}</ul>
      <h2 class="font-resultsize">Instructions:</h2>
      <p class="instruction-font">${meal.strInstructions}</p>
      <button class="nutrition-button" data-meal-id="${meal.idMeal}">Nutritional Values</button>
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

$(document).on('click', '.nutrition-button', function () {
  var mealId = $(this).data('meal-id');
  fetchNutritionValues(mealId);
});

function fetchNutritionValues(mealId) {
  // Edamam API endpoint for nutrition analysis
  var edamamApiUrl = 'https://api.edamam.com/api/nutrition-data';
  // Replace 'YOUR_APP_ID' and 'YOUR_APP_KEY' with your Edamam API credentials
  var appId = 'e973437d';
  var appKey = '37706078baed67cf5db82ed60d0bb905';
  // Construct the request URL with the necessary parameters
  var nutritionApiUrl =
    edamamApiUrl +
    '?app_id=' +
    appId +
    '&app_key=' +
    appKey +
    '&ingr=' +
    encodeURIComponent(mealId);

  fetch(nutritionApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      // Handle the nutrition values data from the Edamam API
      displayNutritionValues(data);
    })
    .catch(function (error) {
      console.error('Error fetching nutrition values:', error);
    });
}




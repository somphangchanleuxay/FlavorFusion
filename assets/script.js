$(document).ready(function() {
  // Declared element and global variables
  var pantryFormEl = $('#pantry-form');
  var pantryListEl = $('#pantry-list');
  var mealdbIngredients;
  // Handles user ingredient submission
  function handleFormSubmit(event) {
    event.preventDefault();
    // Stores user ingredient input in variable
    var pantryItem = $('input[name="pantry-input"]').val();
    if (!pantryItem) {
      console.log('No pantry item entered!');
      return;
    }
    // Clear old pantry items before adding a new one
  pantryListEl.empty();
    // Appends ingredient to page as a list item
    pantryListEl.append('<li>' + pantryItem + '</li>');
    $('input[name="pantry-input"]').val('');
    // Clear the input field
  $('input[name="pantry-input"]').val('');
    savePantryToLocalStorage();
  }
  pantryFormEl.on('submit', handleFormSubmit);
  // Function to push ingredient into an array and then into a string
  function ingredientSearch() {
    var inputArray = [];
    // Get the input elements
    pantryListEl.children().each(function() {
      // Print the array to the console
      inputArray.push($(this).text().trim());
    });
    mealdbIngredients = inputArray.toString();
  }
  // Function to save pantry items to local storage
  function savePantryToLocalStorage() {
    var pantryItems = [];
    // Get the current pantry items from the list
    pantryListEl.children().each(function() {
      pantryItems.push($(this).text().trim());
    });
    // Save the pantry items to local storage
    localStorage.setItem('pantryItems', JSON.stringify(pantryItems));
  }
  // Restoring pantry items from local storage on page load
function restorePantryFromLocalStorage() {
  var savedPantryItems = localStorage.getItem('pantryItems');
  if (savedPantryItems) {
    try {
      savedPantryItems = JSON.parse(savedPantryItems);
      savedPantryItems.forEach(function(item) {
        pantryListEl.append('<li>' + item + '</li>');
      });
    } catch (error) {
      console.error('Error parsing pantry items from local storage:', error);
      // Handle the error (e.g., clear local storage or take appropriate action)
    }
  }
}
// Call the restore function on page load
restorePantryFromLocalStorage();
// Pull meals from mealDB API using patnry item endpoint
  function getmealdb() {
    var requestUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s=' + mealdbIngredients;
    fetch(requestUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        displayResults(data.meals);
      })
      .catch(function(error) {
        console.error('Error fetching data from MealDB API:', error);
      });
  }
  // Event listener on search button to get ingredients and search MealDB API
  $("#searchButton").click(function() {
    ingredientSearch();
    getmealdb();
  });
  // Function to display meals from mealDB onto page
  function displayResults(meals) {
    console.log(meals);
    var resultsContainer = $('#results-container');
    resultsContainer.empty(); // Clear previous results
    meals.forEach(function(meal) {
      // Create a container for each meal
      var mealContainer = $('<div class="meal-container"></div>');
      // Pull the ingredient list and measurements from the meal object
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
// Function to fetch ingredient list based on mealId
function getIngredientList(mealId) {
  var requestUrl = 'https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + mealId;
  return fetch(requestUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      // Extract the ingredient list from the response
      var meal = data.meals[0];
      return extractIngredientList(meal);
    })
    .catch(function(error) {
      console.error('Error fetching ingredient list:', error);
      return null;
    });
}
// Function to extract ingredient list from a meal
function extractIngredientList(meal) {
  if (!meal) {
    return null;
  }
  var ingredientsList = '';
  for (var i = 1; i <= 20; i++) {
    var ingredient = meal['strIngredient' + i];
    var measure = meal['strMeasure' + i];
    if (ingredient && measure) {
      ingredientsList += `${measure} ${ingredient}, `;
    }
  }
  // Remove the trailing comma and space
  ingredientsList = ingredientsList.slice(0, -2);
  console.log('Ingredient List:', ingredientsList);
  return ingredientsList;
}
// Function to fetch ingredient list and then fetch nutrition values
function fetchIngredientList(mealId) {
  getIngredientList(mealId)
    .then(function(ingredientList) {
      if (ingredientList) {
        // Now you can use the ingredientList string to fetch nutrition values
        fetchNutritionValues(ingredientList);
      } else {
        console.error('Ingredient list is null or empty.');
      }
    })
    .catch(function(error) {
      console.error('Error fetching ingredient list:', error);
    });
}
// Function to fetch nutrition values from Edamam API
function fetchNutritionValues(ingredientList) {
  var edamamApiUrl = 'https://api.edamam.com/api/nutrition-data';
  var appId = 'f1f69d4a';
  var appKey = 'a70a24376db1c3bae8fdebe4600f349c';
  var nutritionApiUrl = `${edamamApiUrl}?app_id=${appId}&app_key=${appKey}&nutrition-type=cooking&ingr=${encodeURIComponent(ingredientList)}`;
  console.log(nutritionApiUrl);
  fetch(nutritionApiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log('Nutrition Values:', data);
      displayNutritionValues(data);
    })
    .catch(function (error) {
      console.error('Error fetching nutrition values:', error);
    });
}
    // Event listener on nutrition button to fetch ingredient list from specified meal and nutrition values from Edamam Nutrition API
    $(document).on('click', '.nutrition-button', function() {
      var mealId = $(this).data('meal-id');
      fetchIngredientList(mealId);
      fetchNutritionValues(mealId);
    });
  });
  function displayNutritionValues(data) {
    // Assuming you have a resultsContainer variable
    var nutritionContainer = $('<div class="nutrition-container"></div>');
    // Check if the data has a 'totalNutrients' property
    if (data.totalNutrients) {
      // Add the nutrition information to the container
      nutritionContainer.html(`
        <h2 class="font-resultsize">Nutrition Information</h2>
        <p>Calories: ${data.calories ? data.calories.toFixed(2) : 'N/A'} kcal</p>
        <p>Protein: ${data.totalNutrients.PROCNT ? data.totalNutrients.PROCNT.quantity.toFixed(2) + 'g' : 'N/A'}</p>
        <p>Fat: ${data.totalNutrients.FAT ? data.totalNutrients.FAT.quantity.toFixed(2) + 'g' : 'N/A'}</p>
        <p>Carbohydrates: ${data.totalNutrients.CHOCDF ? data.totalNutrients.CHOCDF.quantity.toFixed(2) + 'g' : 'N/A'}</p>
        <!-- Add more nutrient information as needed -->
      `);
    } else {
      nutritionContainer.html('<p>Nutrition information not available</p>');
    }
    // Assuming mealContainer is accessible here
    var mealContainer = $(document).find('.meal-container');
    // Check if the nutrition container already exists and remove it
    mealContainer.find('.nutrition-container').remove();
    // Append the nutrition container under the nutrient button
    mealContainer.append(nutritionContainer);
  }
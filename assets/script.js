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

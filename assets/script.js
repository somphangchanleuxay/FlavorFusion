function getApi() {
    // fetch request gets a list of all the repos for the node.js organization
    var requestUrl = 'http://www.themealdb.com/api/json/v1/1/search.php?s=Arrabiata';
  
    fetch(requestUrl)
      .then(function (response) {
        return response();
      })
      .then(function (data) {
        console.log(data)
      })

    };
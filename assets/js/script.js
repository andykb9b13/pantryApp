
// Spoonacular API key 86559794390c4f9c8a3c8bba07f2d054
// Need to include ?apiKey=86559794390c4f9c8a3c8bba07f2d054
//Accuweather API Key VXv1eVM6cMuAYleAbLgHg9jZKKIeDTER

const shoppingListUl = document.getElementById("shoppingListList");
const mealPlanUl = document.getElementById("mealPlanUl");
const pantryInput = document.getElementById("pantryInput");
const myPantryButton = document.getElementById("myPantryButton");
const recipeSearchButton = document.getElementById("recipeSearchButton");
const recipeBoxUl = document.getElementById("recipeBoxUl");
const myPantryUl = document.getElementById("myPantryUl");
const recipeInstructionsUl = document.getElementById("recipeInstructionsUl");
let searchedRecipes = [];
let pantryArr = [];
const scheduledMeal = document.getElementById("selectedMealSpot");
const dayOfWeekBtn = document.getElementById("daysSubmit");
const locationSearchButton = document.getElementById("locationSearchButton");
const displayWeatherText = document.getElementById("weatherTextDisplay");


// ****************************************************************

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
  
  // When the user clicks on <span> (x), close the modal
  span.onclick = function() {
    modal.style.display = "none";
  }
  
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  }

// *****************************************

function makeIngredientEventListeners() {
    for (let i = 0; i < searchedRecipes.length; i++) {
        console.log("recipe ", i + 1, searchedRecipes[i])
        searchedRecipes[i].addEventListener("click", function (e) {
            getRecipeIngredients(e);
            getRecipeIngredients(e)
            scheduleRecipe(e)
            // console.log(e.target)
        })

    }
}

function makeInstructonEventListeners() {
    for (let i = 0; i < searchedRecipes.length; i++) {
        searchedRecipes[i].addEventListener("click", function (e) {
            getRecipeInstructions(e);
        })

    }
}


function getRecipeInstructions(e) {
    recipeInstructionsUl.innerHTML = "";
    let chosenRecipe = e.target.id
    console.log(chosenRecipe);
    let requestUrl = "https://api.spoonacular.com/recipes/" + chosenRecipe + "/information?apiKey=86559794390c4f9c8a3c8bba07f2d054";
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log("I am recipe instructions", data.analyzedInstructions[0].steps)
            for (let i = 0; i < data.analyzedInstructions[0].steps.length; i++) {
                console.log("i am each instruction", data.analyzedInstructions[0].steps[i].step)
                let instructionStep = document.createElement("li");
                instructionStep.innerText = (i + 1) + ". " + data.analyzedInstructions[0].steps[i].step;
                recipeInstructionsUl.appendChild(instructionStep);
                recipeInstructionsUl.style.listStyle = "none";
            }
        })
}

function recipeSearch() {
    recipeInstructionsUl.innerHTML = "";
    recipeBoxUl.innerHTML = ""
    let searchInput = document.getElementById("recipeSearchInput").value;
    let requestUrl = "https://api.spoonacular.com/recipes/complexSearch?apiKey=86559794390c4f9c8a3c8bba07f2d054&query=" + searchInput + "&number=5";
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            for (let i = 0; i < data.results.length; i++) {
                let recipeListEl = document.createElement('li');
                recipeListEl.setAttribute("draggable", true);
                recipeListEl.innerText = data.results[i].title;
                recipeBoxUl.appendChild(recipeListEl);
                recipeBoxUl.style.listStyle = "none";
                recipeListEl.setAttribute("id", data.results[i].id);
                recipeListEl.setAttribute("class", "searchedRecipes")


                let recipeImg = document.createElement('img');
                recipeImg.src = data.results[i].image;
                recipeImg.style.width = "75%";
                recipeBoxUl.appendChild(recipeImg);
            }
            searchedRecipes = document.querySelectorAll(".searchedRecipes");
            console.log(searchedRecipes);
            makeIngredientEventListeners();
            makeInstructonEventListeners();
        })
}

recipeSearchButton.addEventListener("click", recipeSearch)

function getRecipeIngredients(e) {
    let chosenRecipe = e.target.id
    let mealName = document.createElement('li');
    mealName.innerText = e.target.innerText;
    // mealPlanUl.appendChild(mealName);
    let requestUrl = "https://api.spoonacular.com/recipes/" + chosenRecipe + "/information?apiKey=86559794390c4f9c8a3c8bba07f2d054";
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log("I am recipe ingredients", data)
            let ingredientArray = [];
            for (let i = 0; i < data.extendedIngredients.length; i++) {
                let ingredientName = data.extendedIngredients[i].name;
                let ingredientItem = document.createElement("li");
                ingredientItem.setAttribute("class", "shoppingListItem");

                ingredientArray.push(ingredientName);
                ingredientItem.textContent = ingredientArray[i];
                shoppingListUl.appendChild(ingredientItem);
                let foodImg = document.createElement('img');
                let foodImgName = data.extendedIngredients[i].image;
                foodImg.src = "https://spoonacular.com/cdn/ingredients_100x100/" + foodImgName;
                ingredientItem.appendChild(foodImg);
                ingredientItem.addEventListener("click", function () {
                    myPantryUl.appendChild(ingredientItem);
                    ingredientItem.setAttribute("class", "pantryItem");
                    ingredientItem.removeAttribute("class", "shoppingListItem");
                })
            }
        })
}

let pantryStorage = [];

function addPantryItem() {
    let newPantryItem = document.createElement('li');
    newPantryItem.setAttribute("class", "pantryItem");
    let newPantryItemText = pantryInput.value;
    newPantryItem.innerText = newPantryItemText;
    myPantryUl.appendChild(newPantryItem);
    pantryStorage.push(newPantryItemText);
    localStorage.setItem("pantry", JSON.stringify(pantryStorage));
}

myPantryButton.addEventListener("click", addPantryItem)
// addIngredientsButton.addEventListener("click", getRecipeIngredients);
// searchedRecipes.addEventListener("click", getRecipeIngredients)




// ******************************************************
// GENERAL LIST OF THINGS TO DO
// TODO clear the input field after entering item
// TODO get Local Storage for pantry items to display on load
// TODO Add values & units for 
// TODO create areas to increase units or delete items from pantry

/* TODO Need to get the amounts of each ingredient. In the API, the returned data has a "measures" value.
data.extendedIngredients.measures.us.amount for the number and data.extendedIngredients.measures.us.unitShort for
the value (i.e. cups, tbsp, etc.).*/

/* TODO  be able to show pictures of the ingredients when it is clicked on in the shopping list*/

/* TODO be able to grab items from one area and drag them to another area? */

/* TODO be able to click on a recipe in the recipe box and have it open up a modal that will display the ingredients
then it will allow you to either go back or select it and put it in your meal plan and shopping list*/

// TODO need to be able to access the recipe with instructions from the meal plan section


// ***************************************
// function getIngredients() {
//     let requestUrl = "https://api.spoonacular.com/recipes/716429/information?apiKey=86559794390c4f9c8a3c8bba07f2d054&includeNutrition=false"
//     fetch(requestUrl)
//         .then(function (response) {
//             return response.json();
//         })
//         .then(function (data) {
//             console.log(data)
//             let mealName = document.createElement('li');
//             mealName.innerText = data.title;
//             mealPlanUl.appendChild(mealName);
//             let ingredientArray = [];
//             for (let i = 0; i < data.extendedIngredients.length; i++) {
//                 // need to create arrays for the Pantry and the shopping list so that I can compare values in each array. After they are compared, they are then pushed to the Ul as items
//                 let ingredientName = data.extendedIngredients[i].name;
//                 ingredientArray.push(ingredientName);
//                 // appending the ingredient to the HTML
//                 let ingredientItem = document.createElement("li");
//                 ingredientItem.textContent = ingredientArray[i];
//                 shoppingListUl.appendChild(ingredientItem);

//                 // This should be changed to be on click on the ingredient item
//                 let foodImg = document.createElement('img');
//                 let foodImgName = data.extendedIngredients[i].image;
//                 foodImg.src = "https://spoonacular.com/cdn/ingredients_100x100/" + foodImgName;
//                 shoppingListUl.appendChild(foodImg);

//             }
//         })
// }

// shoppingListButton.addEventListener("click", getIngredients)

// ******************************************
// ******************************************
// TODO clear the input field after entering item
// TODO get Local Storage for pantry items to display on load
// TODO Add values & units for 
// TODO create areas to increase units or delete items from pantry
// let pantryStorage = [];

// function addPantryItem() {
//     let newPantryItem = document.createElement('li')
//     let newPantryItemText = pantryInput.value;
//     newPantryItem.innerText = newPantryItemText;
//     myPantryUl.appendChild(newPantryItem);
//     pantryStorage.push(newPantryItemText);
//     localStorage.setItem("pantry", JSON.stringify(pantryStorage));
// }

// myPantryButton.addEventListener("click", addPantryItem)


// ******************************************************
// GENERAL LIST OF THINGS TO DO
/* TODO Need to get the amounts of each ingredient. In the API, the returned data has a "measures" value.
data.extendedIngredients.measures.us.amount for the number and data.extendedIngredients.measures.us.unitShort for
the value (i.e. cups, tbsp, etc.).*/

/* TODO  be able to show pictures of the ingredients when it is clicked on in the shopping list*/

/* TODO be able to grab items from one area and drag them to another area? */

/* TODO be able to click on a recipe in the recipe box and have it open up a modal that will display the ingredients
then it will allow you to either go back or select it and put it in your meal plan and shopping list*/

// TODO need to be able to access the recipe with instructions from the meal plan section

function scheduleRecipe(e) {
    fireModal();
    var selectedRecipe = e.target;
    var recipeName = document.createElement('li');
    recipeName.innerText = selectedRecipe.innerText;
    scheduledMeal.appendChild(recipeName);


}

function fireModal() {
    modal.style.display = "block";
}

function getLocation() {
    let locationSearch = document.getElementById("locationSearch").value;
    let requestLocationURL = "http://dataservice.accuweather.com/locations/v1/cities/search?apikey=VXv1eVM6cMuAYleAbLgHg9jZKKIeDTER&q=" +locationSearch+ "&alias=NC HTTP/1.1";
    fetch(requestLocationURL)
        .then(function (response) {
            return response.json()
        })
        .then(function(data){
            console.log("Location: ", data);
            var weatherData = data;
            var weatherDataObject = weatherData[0];
            var weatherDataKey = weatherDataObject.Key;
            console.log(weatherDataKey);
            var locationKey = weatherDataKey;
            getWeather(locationKey);
        })
}

function getWeather(k) {
    var localekey = k;
    console.log("Local Key: ", localekey)
    var requestWeatherURL = "http://dataservice.accuweather.com/currentconditions/v1/"+localekey+"?apikey=VXv1eVM6cMuAYleAbLgHg9jZKKIeDTER&details=true HTTP/1.1";
    fetch(requestWeatherURL)
        .then(function (response) {
            return response.json()
        })
        .then(function(data){
            console.log("Weather: ", data);
            var weatherData1 = data[0];
            console.log(weatherData1);
            var weatherText = weatherData1.WeatherText;
            console.log(weatherText);
            displayWeatherText.textContent = weatherText;

        })
}

locationSearchButton.addEventListener("click", getLocation);


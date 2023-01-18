
// Spoonacular API key 86559794390c4f9c8a3c8bba07f2d054
// Need to include ?apiKey=86559794390c4f9c8a3c8bba07f2d054
//Accuweather API Key VXv1eVM6cMuAYleAbLgHg9jZKKIeDTER

// ******************************************************
// GENERAL LIST OF THINGS TO DO

// TODO Add values & units for 

// TODO create areas to increase units or delete items from pantry

/* TODO Need to get the amounts of each ingredient. In the API, the returned data has a "measures" value.
data.extendedIngredients.measures.us.amount for the number and data.extendedIngredients.measures.us.unitShort for
the value (i.e. cups, tbsp, etc.).*/

/* TODO  be able to show pictures of the ingredients when it is clicked on in the shopping list*/

/* TODO JOSH - be able to click on a recipe in the recipe box and have it open up a modal that will display the ingredients
then it will allow you to either go back or select it and put it in your meal plan and shopping list*/

// TODO need to be able to access the recipe with instructions from the meal plan section

const shoppingListUl = document.getElementById("shoppingListList");
const mealPlanUl = document.getElementById("mealPlanUl");
const pantryInput = document.getElementById("pantryInput");
const myPantryButton = document.getElementById("myPantryButton");
const recipeSearchButton = document.getElementById("recipeSearchButton");
const recipeSearchInput = document.getElementById("recipeSearchInput");
const recipeBoxUl = document.getElementById("recipeBoxUl");
const myPantryUl = document.getElementById("myPantryUl");
const recipeInstructionsUl = document.getElementById("recipeInstructionsUl");
const modalInstructionsUl = document.getElementById("modalDisplay");
const modalIngredientsUl = document.getElementById("modalIngredients");
const ingredientsUl = document.getElementById("ingredientsUl");
const clearPlanButton = document.getElementById("clearMealPlan");
const saveShoppingListButton = document.getElementById("saveShoppingListButton");
let searchedRecipes = [];
let pantryArr = [];
let shoppingList = [];
let ingredientList = [];
let weeklyPlan = [];
let dropZone = document.querySelectorAll(".dropZone");
const scheduledMeal = document.getElementById("selectedMealSpot");
const dayOfWeekBtn = document.getElementById("daysSubmit");
const locationSearchButton = document.getElementById("locationSearchButton");
const displayWeatherText = document.getElementById("weatherTextDisplay");
const makeListButton = document.getElementById("makeListButton");
const shoppingListLandingButton = document.getElementById("shoppingListLandingButton")
const pantryLandingButton = document.getElementById("pantryLandingButton")

shoppingListLandingButton.addEventListener("click", getShoppingList)

pantryLandingButton.addEventListener("click", checkPantry)

var dateEntry = document.getElementById("dateinput");
var fullDate = dayjs().format('MM/DD/YYYY');
dateEntry.textContent = fullDate; const weatherButtonDiv = document.getElementById("weatherButtonDiv");


function checkPantry() {
    pantryArr = JSON.parse(localStorage.getItem("pantry"));
    if (pantryArr === null) {
        pantryArr = [];
        localStorage.setItem("pantry", JSON.stringify(pantryArr))
    } else {
        setPantryDisplay()
    }
}
checkPantry();
getShoppingList();

function saveShoppingList() {
    localStorage.setItem("Shopping List", JSON.stringify(shoppingList));
}

function getShoppingList() {
    shoppingList = JSON.parse(localStorage.getItem("Shopping List")) || [];
    console.log(shoppingList);
    
    for (let item of shoppingList) {
        var shoppinglistitem = document.createElement('li');
        shoppinglistitem.addEventListener("click", sendToPantry);
        shoppinglistitem.innerText = item;
        shoppinglistitem.style.listStyle = "none";
        shoppingListUl.appendChild(shoppinglistitem);
    }
}

function sendToPantry(e) {
    console.log("This is E: ", e);
    let targetIngredient = e.target.innerText;
    console.log("This is the ingredient targeted: ", targetIngredient);
    pantryArr.push(targetIngredient);
    targetIngredientLi = document.createElement('li');
    targetIngredientLi.style.listStyle = "none";
    targetIngredientLi.innerText = targetIngredient;
    myPantryUl.appendChild(targetIngredientLi);
    shoppingListUl.removeChild(e.target);


}

saveShoppingListButton.addEventListener('click', saveShoppingList);






// ****************************************************************

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


let dayDivs = document.querySelectorAll(".dayOfWeek");
for (let day of dayDivs) {
    day.addEventListener("click", function (e) {
        getRecipeSteps(e);
        weeklyPlan.push(e.target);
    })
}

function recipeSearch() {
    recipeInstructionsUl.innerHTML = "";
    recipeBoxUl.innerHTML = "";
    let searchInput = document.getElementById("recipeSearchInput").value;
    recipeSearchInput.value = "";
    let requestUrl = "https://api.spoonacular.com/recipes/complexSearch?apiKey=86559794390c4f9c8a3c8bba07f2d054&query=" + searchInput + "&number=5";
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log(data)
            for (let i = 0; i < data.results.length; i++) {
                let recipeListEl = document.createElement('li');
                recipeListEl.setAttribute("draggable", true);
                recipeListEl.setAttribute("ondragstart", "drag(event)")
                recipeListEl.setAttribute("data", "inSearch")
                recipeListEl.innerText = data.results[i].title;
                // recipeListEl.style.color = "var(--red)";
                recipeBoxUl.appendChild(recipeListEl);
                recipeListEl.style.listStyle = "none";
                recipeListEl.style.width = "85%"
                recipeListEl.style.color = "var(--white)"
                recipeListEl.setAttribute("id", data.results[i].id);
                recipeListEl.setAttribute("class", "searchedRecipes")

                let recipeImg = document.createElement('img');
                recipeImg.src = data.results[i].image;
                recipeImg.style.width = "40%";
                recipeImg.style.marginLeft = "5%"
                recipeImg.style.boxShadow = "1px 1px 1px 1px black"
                recipeImg.style.borderRadius = "var(--border-radius)"
                recipeListEl.appendChild(recipeImg);
            }
            searchedRecipes = document.querySelectorAll(".searchedRecipes");
            console.log(searchedRecipes);
            // makeEventListeners();
        })
}

recipeSearchButton.addEventListener("click", recipeSearch);

let recipeBoxArr = [];

function getRecipeIngredients(recipe) {
    // selected recipe
    console.log("I have been chosen: ", recipe);
    let requestUrl = "https://api.spoonacular.com/recipes/" + recipe + "/information?apiKey=86559794390c4f9c8a3c8bba07f2d054";
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            recipeBoxArr.push(data);
            localStorage.setItem("recipeBox", JSON.stringify(recipeBoxArr));
            console.log("I am recipe ingredients", data);
            let ingredientArray = [];
            for (let i = 0; i < data.extendedIngredients.length; i++) {
                let ingredientName = data.extendedIngredients[i].name;
                let ingredientItem = document.createElement("li");
                ingredientItem.setAttribute("class", "shoppingListItem");
                ingredientArray.push(ingredientName);
                ingredientItem.textContent = ingredientArray[i];
                ingredientItem.style.listStyle = "none";
                ingredientItem.addEventListener("click", function () {
                    pantryArr.push(ingredientName);
                    myPantryUl.appendChild(ingredientItem);
                    ingredientItem.setAttribute("class", "pantryItem");
                    ingredientItem.removeAttribute("class", "shoppingListItem");
                    localStorage.setItem("pantry", JSON.stringify(pantryArr));
                })
                ingredientList.push(ingredientName);
                if (!pantryArr.includes(ingredientName)) {
                    shoppingList.push(ingredientName)
                    shoppingListUl.appendChild(ingredientItem);
                }
            }
        })
}

function getRecipeSteps(e) {
    recipeInstructionsUl.innerHTML = "";
    modalInstructionsUl.innerHTML = "";
    ingredientsUl.innerHTML = "";
    modalIngredientsUl.innerHTML = "";
    let chosenRecipe = e.target.id
    console.log(chosenRecipe);
    fireModal();
    let requestUrl = "https://api.spoonacular.com/recipes/" + chosenRecipe + "/information?apiKey=86559794390c4f9c8a3c8bba07f2d054";
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // console.log("I am recipe instructions", data.analyzedInstructions[0].steps)
            for (let i = 0; i < data.analyzedInstructions[0].steps.length; i++) {
                let instructionStep = document.createElement("li");
                instructionStep.style.listStyle = "none";
                instructionStep.innerText = (i + 1) + ". " + data.analyzedInstructions[0].steps[i].step;
                recipeInstructionsUl.appendChild(instructionStep);
                recipeInstructionsUl.style.listStyle = "none";
                modalInstructionsUl.appendChild(instructionStep);
            }
            for (let i = 0; i < data.extendedIngredients.length; i++) {
                let ingredient = document.createElement("li");
                ingredient.style.listStyle = "none";
                ingredient.innerText = data.extendedIngredients[i].original;
                ingredientsUl.appendChild(ingredient);
                modalIngredientsUl.appendChild(ingredient);
            }
        })
}


function setPantryDisplay() {
    for (let item of pantryArr) {
        let pantryItem = document.createElement('li');
        pantryItem.setAttribute("class", "pantryItem");
        pantryItem.setAttribute("id", item)
        pantryItem.style.listStyle = "none";
        pantryItem.innerText = item;
        pantryItem.addEventListener("click", removePantryItem)
        myPantryUl.appendChild(pantryItem);
    }
}

function addPantryItem() {
    let newPantryItem = document.createElement('li');
    newPantryItem.setAttribute("class", "pantryItem");
    newPantryItem.style.listStyle = "none";
    let newPantryItemText = pantryInput.value;
    newPantryItem.innerText = newPantryItemText;
    myPantryUl.appendChild(newPantryItem);
    pantryArr.push(newPantryItemText);
    localStorage.setItem("pantry", JSON.stringify(pantryArr));
    newPantryItem.addEventListener("click", removePantryItem)
    pantryInput.value = "";
}

myPantryButton.addEventListener("click", addPantryItem)
pantryInput.addEventListener("keyup", function (event) {
    if (event.code === "Enter") {
        event.preventDefault();
        addPantryItem()
    }
})

function removePantryItem(e) {
    console.log(e.target.id);
    console.log(e);
    let item = e.target.id;
    let index = pantryArr.indexOf(item);
    pantryArr.splice(index, 1);
    localStorage.setItem("pantry", JSON.stringify(pantryArr));
    myPantryUl.removeChild(e.target);
}




function setWeeklyPlan() {
    let mealPlan = document.querySelectorAll("[data='inWeeklyPlan']");
    console.log("mealPlan", mealPlan);
    for (let i = 0; i < mealPlan.length; i++) {
        let mealPlanId = mealPlan[i].id
        recipeBoxArr.push(mealPlanId);
        console.log("mealPlanId", mealPlanId);
        localStorage.setItem("weeklyPlan", JSON.stringify(recipeBoxArr));
        getRecipeIngredients(mealPlanId);
    }
}

function recalledRecipeSearch() {
    recipeBoxArr = JSON.parse(localStorage.getItem("weeklyPlan")) || [];
    for (let i = 0; i < recipeBoxArr.length; i++) {
        let requestUrl = "https://api.spoonacular.com/recipes/" + recipeBoxArr[i] + "/information?apiKey=86559794390c4f9c8a3c8bba07f2d054";
        fetch(requestUrl)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                console.log("recalled Recipe Data", data)
                let recipeListEl = document.createElement('li');
                recipeListEl.setAttribute("draggable", true);
                recipeListEl.setAttribute("ondragstart", "drag(event)")
                recipeListEl.setAttribute("data", "inSearch")
                recipeListEl.innerText = data.title;
                dropZone[i].appendChild(recipeListEl)
                recipeListEl.style.listStyle = "none";
                recipeListEl.style.width = "85%"
                recipeListEl.style.color = "var(--white)"
                recipeListEl.setAttribute("id", data.id);
                let recipeImg = document.createElement('img');
                recipeImg.src = data.image;
                recipeImg.style.width = "40%";
                recipeImg.style.marginLeft = "5%"
                recipeImg.style.boxShadow = "1px 1px 1px 1px black"
                recipeImg.style.borderRadius = "var(--border-radius)"
                recipeListEl.appendChild(recipeImg);
            })
    }

}

recalledRecipeSearch();

function clearRecipeList() {
    for (let i = 0; i < dropZone.length; i++) {
        dropZone[i].innerHTML = "(drop recipe here)";
    }
    recipeBoxArr = [];
    localStorage.setItem("weeklyPlan", JSON.stringify(recipeBoxArr));
}

clearPlanButton.addEventListener("click", clearRecipeList)

// I could save the id of the recipe and then research it when the page loads

makeListButton.addEventListener("click", setWeeklyPlan);
// addIngredientsButton.addEventListener("click", getRecipeIngredients);
// searchedRecipes.addEventListener("click", getRecipeIngredients)

// ************ Drag and Drop ********************
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
    let droppedRecipe = document.getElementById(data);
    console.log("this is the element from the drop", droppedRecipe)
    if (droppedRecipe.getAttribute("data") === "inSearch") {
        droppedRecipe.setAttribute("data", "inWeeklyPlan")
    }
}

// ********************************

// function scheduleRecipe(e) {
//     fireModal();
//     var selectedRecipe = e.target;
//     var recipeName = document.createElement('li');
//     recipeName.innerText = selectedRecipe.innerText;
//     scheduledMeal.appendChild(recipeName);


// }

function fireModal() {
    modal.style.display = "block";
}

function getLocation() {
    let locationSearch = document.getElementById("locationSearch").value;
    let requestLocationURL = "https://dataservice.accuweather.com/locations/v1/cities/search?apikey=VXv1eVM6cMuAYleAbLgHg9jZKKIeDTER&q=" + locationSearch + "&alias=NC HTTP/1.1";
    fetch(requestLocationURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // console.log("Location: ", data);
            var weatherData = data;
            var weatherDataObject = weatherData[0];
            var weatherDataKey = weatherDataObject.Key;
            // console.log(weatherDataKey);
            var locationKey = weatherDataKey;
            getWeather(locationKey);
            getForecast(locationKey);
        })
}


function getWeather(k) {
    var localekey = k;
    // console.log("Local Key: ", localekey)
    var requestWeatherURL = "https://dataservice.accuweather.com/currentconditions/v1/" + localekey + "?apikey=VXv1eVM6cMuAYleAbLgHg9jZKKIeDTER&details=true HTTP/1.1";
    fetch(requestWeatherURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            // console.log("Weather: ", data);
            var weatherData1 = data[0];
            // console.log(weatherData1);
            var weatherText = weatherData1.WeatherText;
            // console.log(weatherText);
            displayWeatherText.textContent = weatherText;
            displayWeatherText.style.fontSize = "2em";
            let icon = data[0].WeatherIcon;
            let iconImg = document.createElement("img");
            iconImg.setAttribute("src", "./assets/images/icons/" + icon + ".png");
            displayWeatherText.appendChild(iconImg);
        })
}

locationSearchButton.addEventListener("click", getLocation);

function getForecast(key) {
    let localeKey = key;
    let requestUrl = "https://dataservice.accuweather.com/forecasts/v1/daily/5day/" + localeKey + "?apikey=VXv1eVM6cMuAYleAbLgHg9jZKKIeDTER&details=true";
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log("this is the 5day forecast", data)
            let dayNames = document.querySelectorAll(".dayNames")
            let highLowTemp = document.querySelectorAll(".highLowTemp");
            for (let i = 0; i < 5; i++) {
                let epoch = data.DailyForecasts[i].EpochDate;
                let date = new Date(epoch * 1000);
                let month = date.getMonth();
                let day = date.getDate();
                let dayOfWeek = date.getDay()
                let dayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
                let dayDisplay = dayArr[dayOfWeek];
                dayNames[i].innerText = dayDisplay + " " + (month + 1) + "/" + day;
                let icon = data.DailyForecasts[i].Day.Icon;
                let iconImg = document.createElement("img");
                iconImg.setAttribute("src", "./assets/images/icons/" + icon + ".png");
                dayNames[i].appendChild(iconImg);
                highLowTemp[i].innerText = "Hi: " + data.DailyForecasts[i].Temperature.Maximum.Value + "°" + " Lo: " + data.DailyForecasts[i].Temperature.Minimum.Value + "°";
            }
            let todayTemp = document.createElement("span");
            todayTemp.style.color = "var(--white)"
            todayTemp.style.fontSize = "1.5em";
            todayTemp.innerText = "Hi: " + data.DailyForecasts[0].Temperature.Maximum.Value + "°" + " Lo: " + data.DailyForecasts[0].Temperature.Minimum.Value + "°";
            weatherButtonDiv.prepend(todayTemp);
        })
}





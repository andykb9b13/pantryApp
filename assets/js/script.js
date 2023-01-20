
// Spoonacular API key 86559794390c4f9c8a3c8bba07f2d054
// Need to include ?apiKey=86559794390c4f9c8a3c8bba07f2d054
//Accuweather API Key VXv1eVM6cMuAYleAbLgHg9jZKKIeDTER

// **************** Lists ********************
const shoppingListUl = document.getElementById("shoppingListList");
const mealPlanUl = document.getElementById("mealPlanUl");
const recipeBoxUl = document.getElementById("recipeBoxUl");
const myPantryUl = document.getElementById("myPantryUl");
const modalInstructionsUl = document.getElementById("modalDisplay");
const modalIngredientsUl = document.getElementById("modalIngredients");
const ingredientsUl = document.getElementById("ingredientsUl");
const pantryInput = document.getElementById("pantryInput");
const recipeSearchInput = document.getElementById("recipeSearchInput");

// ***************** Buttons *******************
const dayOfWeekBtn = document.getElementById("daysSubmit");
const myPantryButton = document.getElementById("myPantryButton");
const recipeSearchButton = document.getElementById("recipeSearchButton");
const clearPlanButton = document.getElementById("clearMealPlan");
const saveShoppingListButton = document.getElementById("saveShoppingListButton");
const makeListButton = document.getElementById("makeListButton");
const shoppingListLandingButton = document.getElementById("shoppingListLandingButton")
const pantryLandingButton = document.getElementById("pantryLandingButton");
const locationSearchButton = document.getElementById("locationSearchButton");
const clearShoppingListButton = document.getElementById("clearShoppingListButton");
const clearPantryButton = document.getElementById("clearPantryButton");

// *********************************************** 
const scheduledMeal = document.getElementById("selectedMealSpot");
const displayWeatherText = document.getElementById("weatherTextDisplay");
const weatherButtonDiv = document.getElementById("weatherButtonDiv");

// *************** Arrays ***********************
let searchedRecipes = [];
let pantryArr = [];
let recipeBoxArr = [];
let shoppingList = [];
let ingredientList = [];
// let weeklyPlan = [];
let highLowTempArr = [];
let dayNamesArr = [];

// *************** Variable DOM Elements ************
let dropZone = document.querySelectorAll(".dropZone");
let modal = document.getElementById("myModal");
let fullDate = dayjs().format('MM/DD/YYYY');
let span = document.getElementsByClassName("close")[0];
let dateEntry = document.getElementById("dateinput");
let dayDivs = document.querySelectorAll(".dayOfWeek");
let dayNames = document.querySelectorAll(".dayNames");
let highLowTemp = document.querySelectorAll(".highLowTemp");

// Display the current Date
dateEntry.textContent = fullDate;

/* Gets "pantry" from local storage and sets it to pantryArr then calls the setPantryDisplay 
to create DOM elements to populate the pantry */
function checkPantry() {
    pantryArr = JSON.parse(localStorage.getItem("pantry"));
    if (pantryArr === null) {
        pantryArr = [];
        localStorage.setItem("pantry", JSON.stringify(pantryArr));
    } else {
        setPantryDisplay()
    }
}

// Iterates over pantryArr and creates DOM elements to display in myPantryUl for each index
function setPantryDisplay() {
    for (let item of pantryArr) {
        let pantryItem = document.createElement('li');
        pantryItem.setAttribute("class", "pantryItem");
        pantryItem.setAttribute("id", item)
        pantryItem.style.listStyle = "none";
        pantryItem.innerText = item;
        pantryItem.addEventListener("click", removePantryItem);
        myPantryUl.appendChild(pantryItem);
    }
}

/* When the saveShoppingListButton is clicked this sends the data from the shoppingList array to 
 local storage as "Shopping List" */
function saveShoppingList() {
    localStorage.setItem("Shopping List", JSON.stringify(shoppingList));
}

/* When the JS file loads, this function is called. It gets "Shopping list" from local storage and
saves it to shoppingList array. The array is iterated over and DOM elements are created to populate 
shoppingListUl */
function getShoppingList() {
    shoppingList = JSON.parse(localStorage.getItem("Shopping List")) || [];
    for (let item of shoppingList) {
        var shoppinglistitem = document.createElement('li');
        shoppinglistitem.addEventListener("click", sendToPantry);
        shoppinglistitem.innerText = item;
        shoppinglistitem.style.listStyle = "none";
        shoppingListUl.appendChild(shoppinglistitem);
    }
}

/* This is called when an item in the shoppingList is clicked on. A DOM element is created 
and appended to myPantry Ul. It is then removed from the shoppingList Ul.*/
function sendToPantry(e) {
    let targetIngredient = e.target.innerText;
    pantryArr.push(targetIngredient);
    localStorage.setItem("pantry", JSON.stringify(pantryArr));
    let item = e.target.id;
    let index = shoppingList.indexOf(item);
    shoppingListUl.removeChild(e.target);
    shoppingList.splice(index, 1);
    localStorage.setItem("Shopping List", JSON.stringify(shoppingList));
    let targetIngredientLi = document.createElement('li');
    targetIngredientLi.style.listStyle = "none";
    targetIngredientLi.innerText = targetIngredient;
    myPantryUl.appendChild(targetIngredientLi);
}

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

/* Sets event an event listener that gets recipe steps
when clicked for each div */
for (let day of dayDivs) {
    day.addEventListener("click", function (e) {
        getRecipeSteps(e);
        // weeklyPlan.push(e.target);
    })
}

// Calls Spoonacular API to get recipes from user input
function recipeSearch() {
    recipeBoxUl.innerHTML = "";
    let searchInput = recipeSearchInput.value;
    console.log(searchInput);
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
                recipeListEl.style.listStyle = "none";
                recipeListEl.style.width = "85%"
                recipeListEl.style.color = "var(--white)"
                // sets the recipe ID number to the id attribute in each li created
                recipeListEl.setAttribute("id", data.results[i].id);
                recipeListEl.setAttribute("class", "searchedRecipes")
                recipeBoxUl.appendChild(recipeListEl);
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
            recipeSearchInput.value = "";
        })
}

// Calls Spoonacular for a recipe information using the recipe ID number saved in recipeListEl
function getRecipeIngredients(recipe) {
    console.log(recipe);
    let requestUrl = "https://api.spoonacular.com/recipes/" + recipe + "/information?apiKey=86559794390c4f9c8a3c8bba07f2d054";
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            let ingredientArray = [];
            for (let i = 0; i < data.extendedIngredients.length; i++) {
                let ingredientName = data.extendedIngredients[i].name;
                let ingredientItem = document.createElement("li");
                ingredientArray.push(ingredientName);
                ingredientItem.setAttribute("class", "shoppingListItem");
                ingredientItem.textContent = ingredientArray[i];
                ingredientItem.style.listStyle = "none";
                /* Adds an event Listener to each ingredientItem when clicked 
                it will send the ingredientname to the pantryArr and add it to the pantryUl*/
                ingredientItem.addEventListener("click", function () {
                    pantryArr.push(ingredientName);
                    myPantryUl.appendChild(ingredientItem);
                    ingredientItem.setAttribute("class", "pantryItem");
                    ingredientItem.removeAttribute("class", "shoppingListItem");
                    localStorage.setItem("pantry", JSON.stringify(pantryArr));
                })
                ingredientList.push(ingredientName);
                /* Checks that the item doesn't already exist in pantryArr or each item that will be pushed to 
                pantryArr using the eventListener */
                if (!pantryArr.includes(ingredientName)) {
                    shoppingList.push(ingredientName)
                    shoppingListUl.appendChild(ingredientItem);
                }
            }
        })
}

// Calls Spoonacular and gets the individual recipe steps for the recipe clicked on and display in modal.
function getRecipeSteps(e) {
    modalInstructionsUl.innerHTML = "";
    modalIngredientsUl.innerHTML = "";
    let chosenRecipe = e.target.id
    fireModal();
    let requestUrl = "https://api.spoonacular.com/recipes/" + chosenRecipe + "/information?apiKey=86559794390c4f9c8a3c8bba07f2d054";
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            console.log("data from recipe steps", data);
            let instructionImage = document.createElement("img");
            instructionImage.setAttribute("src", data.image);
            modalInstructionsUl.prepend(instructionImage);
            for (let i = 0; i < data.analyzedInstructions[0].steps.length; i++) {
                let instructionStep = document.createElement("li");
                instructionStep.style.listStyle = "none";
                instructionStep.innerText = (i + 1) + ". " + data.analyzedInstructions[0].steps[i].step;
                modalInstructionsUl.appendChild(instructionStep);
            }
            for (let i = 0; i < data.extendedIngredients.length; i++) {
                let ingredient = document.createElement("li");
                ingredient.style.listStyle = "none";
                ingredient.innerText = data.extendedIngredients[i].original;
                modalIngredientsUl.appendChild(ingredient);
            }

        })
}

// Creates the DOM elements for the pantryUL and sends an updated pantryArr to localStorage.
function addPantryItem() {
    console.log("im firing from add Pantry Item")
    let newPantryItem = document.createElement('li');
    newPantryItem.setAttribute("class", "pantryItem");
    newPantryItem.style.listStyle = "none";
    let newPantryItemText = pantryInput.value;
    newPantryItem.innerText = newPantryItemText;
    newPantryItem.addEventListener("click", removePantryItem)
    myPantryUl.appendChild(newPantryItem);
    pantryArr.push(newPantryItemText);
    localStorage.setItem("pantry", JSON.stringify(pantryArr));
    pantryInput.value = "";
}


// Removes the clicked item from the pantryArr and pantryUl and updates pantryArr in localStorage.
function removePantryItem(e) {
    let item = e.target.id;
    let index = pantryArr.indexOf(item);
    myPantryUl.removeChild(e.target);
    pantryArr.splice(index, 1);
    localStorage.setItem("pantry", JSON.stringify(pantryArr));
}

/* When the makeListButton is clicked, this sends the recipe ids in the dayOfWeek divs to recipeBoxArr
then sends it to local storage. The ingredients for each recipe are called from Spoonacular using
getRecipeIngredienst(). The weather and days in the recipe cards are saved to local storage as well. */
function setWeeklyPlan() {
    let mealPlan = document.querySelectorAll("[data='inWeeklyPlan']");
    for (let i = 0; i < mealPlan.length; i++) {
        let mealPlanId = mealPlan[i].id
        recipeBoxArr.push(mealPlanId);
        localStorage.setItem("weeklyPlan", JSON.stringify(recipeBoxArr));
        getRecipeIngredients(mealPlanId);
    }
    for (let day of dayNames) {
        dayNamesArr.push(day.innerHTML);
        console.log(day.innerHTML);
        localStorage.setItem("dayNames", JSON.stringify(dayNamesArr));
    }
    for (let temp of highLowTemp) {
        highLowTempArr.push(temp.innerHTML);
        console.log(temp.innerHTML);
        localStorage.setItem("dayTemp", JSON.stringify(highLowTempArr));
    }
}

// Gets the recipe ids stored in recipeBoxArr from local Storage and calls Spoonacular to get recipe Info
function recalledRecipeSearch() {
    recipeBoxArr = JSON.parse(localStorage.getItem("weeklyPlan")) || [];
    for (let i = 0; i < recipeBoxArr.length; i++) {
        let requestUrl = "https://api.spoonacular.com/recipes/" + recipeBoxArr[i] + "/information?apiKey=86559794390c4f9c8a3c8bba07f2d054";
        fetch(requestUrl)
            .then(function (response) {
                return response.json()
            })
            .then(function (data) {
                let recipeListEl = document.createElement('li');
                recipeListEl.setAttribute("draggable", true);
                recipeListEl.setAttribute("ondragstart", "drag(event)")
                recipeListEl.setAttribute("data", "inSearch")
                recipeListEl.innerText = data.title;
                recipeListEl.style.listStyle = "none";
                recipeListEl.style.width = "85%"
                recipeListEl.style.color = "var(--white)"
                recipeListEl.setAttribute("id", data.id);
                dropZone[i].appendChild(recipeListEl)
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

// Clears the recipeBoxArr, highLowTempArr, and dayNamesArr and sets them to localStorage and clears the dayOfWeek divs.
function clearRecipeList() {
    for (let i = 0; i < dropZone.length; i++) {
        dropZone[i].innerHTML = "(drop recipe here)";
    }
    recipeBoxArr = [];
    localStorage.setItem("weeklyPlan", JSON.stringify(recipeBoxArr));
    let dayArr = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    for (let i = 0; i < dayNames.length; i++) {
        dayNames[i].innerHTML = dayArr[i];
        highLowTemp[i].innerHTML = ""
    }
    highLowTempArr = [];
    dayNamesArr = [];
    localStorage.setItem("dayNames", JSON.stringify(dayNamesArr));
    localStorage.setItem("dayTemp", JSON.stringify(highLowTempArr));
}

// clears the pantry when clearPantryButton is clicked.
function clearPantry() {
    pantryArr = [];
    localStorage.setItem("pantry", JSON.stringify(pantryArr));
    myPantryUl.innerHTML = "";
}

function clearShoppingList() {
    shoppingList = [];
    localStorage.setItem("Shopping List", JSON.stringify(shoppingList));
    shoppingListUl.innerHTML = "";
}

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
    if (droppedRecipe.getAttribute("data") === "inSearch") {
        droppedRecipe.setAttribute("data", "inWeeklyPlan")
    }
}

// ******************* Modal ********************
function fireModal() {
    modal.style.display = "block";
}

// ******************* Location and Weather ***********
// Calls Accuweather API and gets location weather from user search input by calling getWeather() and getForecast()
function getLocation() {
    let locationSearch = document.getElementById("locationSearch").value;
    let requestLocationURL = "https://dataservice.accuweather.com/locations/v1/cities/search?apikey=VXv1eVM6cMuAYleAbLgHg9jZKKIeDTER&q=" + locationSearch + "&alias=NC HTTP/1.1";
    fetch(requestLocationURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            var weatherData = data;
            var weatherDataObject = weatherData[0];
            var weatherDataKey = weatherDataObject.Key;
            var locationKey = weatherDataKey;
            getWeather(locationKey);
            getForecast(locationKey);
        })
}

// Gets the current weather conditions for the location inputted by the user
function getWeather(k) {
    var localekey = k;
    var requestWeatherURL = "https://dataservice.accuweather.com/currentconditions/v1/" + localekey + "?apikey=VXv1eVM6cMuAYleAbLgHg9jZKKIeDTER&details=true HTTP/1.1";
    fetch(requestWeatherURL)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
            var weatherData1 = data[0];
            var weatherText = weatherData1.WeatherText;
            displayWeatherText.textContent = weatherText;
            displayWeatherText.style.fontSize = "2em";
            let icon = data[0].WeatherIcon;
            let iconImg = document.createElement("img");
            iconImg.setAttribute("src", "./assets/images/icons/" + icon + ".png");
            displayWeatherText.appendChild(iconImg);
        })
}

// Gets a 5 day forecast for the location inputted bt the user and displays it in each dayOfWeek div
function getForecast(key) {
    let localeKey = key;
    let requestUrl = "https://dataservice.accuweather.com/forecasts/v1/daily/5day/" + localeKey + "?apikey=VXv1eVM6cMuAYleAbLgHg9jZKKIeDTER&details=true";
    fetch(requestUrl)
        .then(function (response) {
            return response.json()
        })
        .then(function (data) {
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
                let icon = data.DailyForecasts[i].Day.Icon;
                let iconImg = document.createElement("img");
                iconImg.setAttribute("src", "./assets/images/icons/" + icon + ".png");
                dayNames[i].innerText = dayDisplay + " " + (month + 1) + "/" + day;
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

function getRecalledWeather() {
    dayNamesArr = JSON.parse(localStorage.getItem("dayNames")) || [];
    highLowTempArr = JSON.parse(localStorage.getItem("dayTemp")) || [];

    for (let i = 0; i < dayNamesArr.length; i++) {
        dayNames[i].innerHTML = dayNamesArr[i];
    }
    for (let i = 0; i < highLowTempArr.length; i++) {
        highLowTemp[i].innerHTML = highLowTempArr[i];
    }

}

// *************** Event Listeners ******************
locationSearchButton.addEventListener("click", getLocation);
saveShoppingListButton.addEventListener('click', saveShoppingList);
makeListButton.addEventListener("click", setWeeklyPlan);
recipeSearchButton.addEventListener("click", recipeSearch);
recipeBoxUl.addEventListener("click", getRecipeSteps);
clearPlanButton.addEventListener("click", clearRecipeList);
myPantryButton.addEventListener("click", addPantryItem);
clearPantryButton.addEventListener("click", clearPantry);
clearShoppingListButton.addEventListener("click", clearShoppingList);
pantryInput.addEventListener("keyup", function (event) {
    if (event.code === "Enter") {
        event.preventDefault();
        addPantryItem()
    }
})

// **************** Functions called on page load ************
checkPantry();
getShoppingList();
recalledRecipeSearch();
getRecalledWeather();
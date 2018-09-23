// declare and initialize search topics array
var topics = ["pizza", "pancakes", "popcorn", "salad", "apples", "icecream", "hot dogs"];

// add buttons to the page when the page loads
generateButtons();

// function for creating search buttons and adding them to the page (replacing existing buttons)
function generateButtons() {
    // empty buttons div
    $("#buttons-area").empty();
    // for each element in the topics array...
    topics.forEach(function(elementValue) {
        // make a new button; give it class="search-button" and value equal to the array element
        var newButton = $("<button>");
        newButton.addClass("search-button");
        newButton.text(elementValue);
        // give the button an attribute representing number of searches done with button whose results are on the page
        newButton.attr("times-searched", "0");
        // add the button to the page
        $("#buttons-area").append(newButton);
    });
    // create button for clearing results
    var clearButton = $("<button id='clear-all'>");
    clearButton.text("Clear Results");
    // append clear button to page
    $("#buttons-area").append("<br>");
    $("#buttons-area").append(clearButton);
}

// when the add-topic button is clicked, add new topic to the array and regenerate buttons
$("#add-topic").on("click", function(event) {
    // store input
    var userInput = $("#new-topic").val().trim();
    // stop page from reloading
    event.preventDefault();
    // function to check that the term was not already added and the input is not empty
    function isValid() {
        if (userInput === "") {
            return false;
        }
        for (var i = 0; i < topics.length; i++) {
            if (userInput === topics[i]) {
                return false;
            }
        }
        return true;
    }
    // function for non case-sensitive check that the term is not already used
    function isAlreadyAdded() {
        for (var i = 0; i < topics.length; i++) {
            if (userInput.toLowerCase() === topics[i].toLowerCase()) {
                return true;
            }
        }
        return false;
    }
    // if the user input is valid...
    if (isValid()) {
        // if the term is already added but with different capitalization...
        if (isAlreadyAdded) {
            // replace the existing term with the new capitalization version
            topics[topics.indexOf(userInput.toLowerCase())] = userInput;
        }
        // else...
        else {
            // add new topic to array
            topics.push($("#new-topic").val().trim());
        }
        // regenerate buttons
        generateButtons();
        // clear input box
        $("#new-topic").val("");
    }
});

// when a search topic button is pressed, find gifs using the text of the button pressed as a search term
$(document).on("click", ".search-button", function() {
    getGifs($(this).text(), parseInt($(this).attr("times-searched")));
    // increment the times-searched attribute for the button
    $(this).attr("times-searched", (parseInt($(this).attr("times-searched")) + 1).toString());
});

// function for getting gifs and adding them to the page
function getGifs(searchTerm, timesSearched) {
    // creating variables to store search parameters
    var apiKey = "rSoMaNfOIf9g9ue5Tq9WjlOlTrJBsHRZ";
    var limit = 10;
    var offset = limit * timesSearched;
    var rating = "pg13";
    // build URL using my api key, the search term, and a return limit of 10 and excluding R rated gifs
    var queryURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}&limit=${limit}&rating=${rating}&offset=${offset}`;
    // run search on the giphy api
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        // create a new span element to contain the results
        var newSpan = $("<span>");
        // create a variable to represent the div element that will hold said span
        var imagesDiv;
        // for each object in the data array of the object returned from the ajax call...
        response.data.forEach(function(dataValue) {
            // create a new div element to hold the image and related content
            var newDiv = $("<div class='gif-box'>");
            // create a new img element
            var img = $("<img>");
            // set the image source to the fixed-height-still gif url
            img.attr("src", dataValue.images.fixed_height_still.url);
            // give the image a "still-src" attribute equal to fixed-height-still url
            img.attr("still-src", dataValue.images.fixed_height_still.url);
            // give the image an "animated-src" attribute equal to fixed-height url
            img.attr("animated-src", dataValue.images.fixed_height.url);
            // give the image an alternate text from the title
            img.attr("alt", dataValue.title);
            // give the image a class for click event
            img.addClass("gif");
            // append the img element to the new div element
            newDiv.append(img);
            // create a new p element to display the rating
            var newP = $("<p class='rating'>");
            newP.text("Rating: " + dataValue.rating.toUpperCase());
            // append the rating to the new div element
            newDiv.append(newP);
            // append the individual image div to the span element containing all results returned from current button press
            newSpan.append(newDiv);
        });
        // create variable storing hyphenated search term to be used for element attributes
        var hyphenatedSearchTerm = searchTerm.replace(" ", "-");
        // if there are no results for the same term already on the page...
        if (offset === 0) {
            // create a div element to hold all the results for current search term
            imagesDiv = $("<div>");
            // give the div an id corresponding to the search term
            imagesDiv.attr("id", hyphenatedSearchTerm.replace(" ", "-"));
            // display search term before with results
            imagesDiv.append($("<h3>" + searchTerm + ":</h3>"));
            // add a span element to hold all images for current search term and append it to the div
            imagesDiv.append($("<span class='" + hyphenatedSearchTerm + "'>"));
            // add the div element to the page
            $("#search-results").prepend(imagesDiv);
        }
        // append the new span element to beginning of the larger span element (created 4 lines above here)
        $("." + hyphenatedSearchTerm).prepend(newSpan);
        // attach the div of all results for current term to the div holding all results for all terms
        $("#search-results").prepend($("#" + hyphenatedSearchTerm));
    });
}

// when the user clicks an image, change it's animation state
$(document).on("click", ".gif", function() {
    if ( $(this).attr("src") === $(this).attr("still-src") ) {
        $(this).attr("src", $(this).attr("animated-src"));
    }
    else {
        $(this).attr("src", $(this).attr("still-src"));
    }
});
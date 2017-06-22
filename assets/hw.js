/*
Pseudocode:
1. x establish a target div for the buttons and one for the images
2. x establish the form
3. x hard-code the starting array
4. x write the function to add an individual button from the array to the display
5. x call this function for every element in the array
6. x write the function to take the form input, add it to the array, and add it to the page
7. x write the function to make the Giphy call for every .foodbtn click and populate #results-container
8. write the function to start/stop on click?
*/

// key: f3302186cf634c96bb35b6e25a3207ac

var stringArray = ["Carrots", "Fondue", "Fried chicken", "Full English", "Gnocchi", "Green beans", "Hot fudge sundae", "Hummus", "Lobster", "Orange juice", "Peas", "Pineapple pizza", "Quarter pounder", "Ribeye", "Taco", "Zucchini"];

var spinner = `
  <div class="preloader-wrapper big active">
    <div class="spinner-layer spinner-blue">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>

    <div class="spinner-layer spinner-red">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>

    <div class="spinner-layer spinner-yellow">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>

    <div class="spinner-layer spinner-green">
      <div class="circle-clipper left">
        <div class="circle"></div>
      </div><div class="gap-patch">
        <div class="circle"></div>
      </div><div class="circle-clipper right">
        <div class="circle"></div>
      </div>
    </div>
  </div>
`;

function addButton(string) {
  var newBtn = $("<a>");
  newBtn.addClass("waves-effect waves-light btn foodbtn");
  newBtn.data("food", string.replace(" ", "%20"));
  newBtn.text(string);
  $("#button-container").append(newBtn);
}

function buildButtons() {
  for (var i = 0; i < stringArray.length; i++) {
    addButton(stringArray[i]);
  }
}

$("#add-submit").on("click", function (event) {
  event.preventDefault();
  var newFood = $("#add-field").val().trim();
  // stringArray.push(newFood); // is this needed?
  addButton(newFood);
});

function addGIF(object) {
  var newDiv = $("<div>").addClass("giphy card-panel hoverable");
  var imgDiv = $("<div>").html(spinner);
  imgDiv.addClass("center-align valign-wrapper");
  imgDiv.width(object.images.fixed_height.width);
  imgDiv.height(object.images.fixed_height.height);
  var img = $("<img>").attr("src", object.images.fixed_height.url);
  img.attr("id", object.id);
  img.data({"still": object.images.fixed_height_still.url, "moving": object.images.fixed_height.url, "movingStatus": true});
  var rating = $("<p>").text("Rating: " + object.rating);
  newDiv.append(imgDiv, rating);
  img.on("load", function(){
    imgDiv.html(img);
  });
  $("#results-container").append(newDiv);
}

function callAPI() {
  $("#results-container").empty();
  var searchFood = $(this).data("food");
  var queryURL = "http://api.giphy.com/v1/gifs/search?limit=20&rating=pg&api_key=f3302186cf634c96bb35b6e25a3207ac&q=" + searchFood;
  $.ajax({
    type: "GET",
    url: queryURL,
    rating: "pg",
    limit: 20
  })
  .done(function(response){
    for (var i = 0; i < response.data.length; i++) {
      var element = response.data[i];
      addGIF(element);
    }
  })
  .fail(function(){
    addGIF({
      rating: "uh oh...",
      images: {
        fixed_height: {
          width: 200,
          height: 200,
          url: "https://media0.giphy.com/media/mq5y2jHRCAqMo/200.gif"
        }
      }
    });
    $("#results-container").append(`
      <h2 class="red-text">Error.</h2>
      <p>Sorry&mdash;I dunno how this works, but it sure ain't like that.</p>
      <p>Maybe try again?</p>
    `);
  })
}

$(document).ready(buildButtons);

$(document).on("click", ".foodbtn", callAPI);

$(document).on("click", ".giphy", function () {
  var image = $(this).find("img");
  console.log("image data, before: " + JSON.stringify(image.data()));
  if (image.attr("src") === image.data("moving")) {
    image.attr("src", image.data("still"));
    console.log("still url set:");
    console.log(image.attr("src"));
  } else {
    image.attr("src", image.data("moving"));
    console.log("moving url set:");
    console.log(image.attr("src"));
  }
  // image.data("movingStatus", !(image.data("movingStatus")));
  // console.log("movingStatus now " + image.data("movingStatus"));
  console.log("image data, after: " + JSON.stringify(image.data()));
});
/*
Observed behavior:
1. on first click, src is reported as still URL, but image keeps moving
2. on subsequent clicks, src is reported as moving URL no matter what, though li 152 toggles true and false and lines 144 and 148 log the correct responses
3. on inspection, entire data object is getting replaced with only {movingstatus: true}
4. Experimentation confirms: setting .attr("src") clears .data
*/

// When search is "gnocchi" or "taco", sometimes clicking stops animation (though never restarts it).
// When search is "zucchini", or others, it reports the src changing correctly even though the image on the page keeps moving
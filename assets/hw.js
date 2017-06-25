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
  addButton(newFood);
});

function addGIF(object) {
  // create the whole big overall card div
  var newDiv = $("<div>").addClass("giphy card hoverable");
  // set its proportions to those of the incoming image, to avoid layout change on image load
  newDiv.width(object.images.fixed_height.width);
  newDiv.height(object.images.fixed_height.height);
  // create the div .card-image inside the .card
  var cardImage = $("<div class='card-image'>");
  // create the spinner to take the place of the future img
  var imgDiv = $("<div>").html(spinner);
  imgDiv.addClass("center-align valign-wrapper");
  // create the image
  var img = $("<img>").attr("src", object.images.fixed_height.url);
  img.attr("id", object.id);
  img.attr({
    "data-still": object.images.fixed_height_still.url,
    "data-moving": object.images.fixed_height.url,
    "data-movingStatus": true
  });
  // create the rating
  var rating = $("<span class='card-title'>").text("Rating: " + object.rating);
  // append the spinner and the rating into the inner card-image div
  cardImage.append(imgDiv, rating);
  newDiv.append(cardImage);
  // when img loads, swap the spinner for the image
  img.on("load", function(){
    imgDiv.html(img);
  });
  $("#results-container").append(newDiv);
}

function callAPI() {
  $("#results-container").empty();
  var searchFood = $(this).data("food");
  var queryURL = "https://api.giphy.com/v1/gifs/search?limit=20&rating=pg&api_key=f3302186cf634c96bb35b6e25a3207ac&q=" + searchFood;
  $.ajax({
    type: "GET",
    url: queryURL,
    rating: "pg",
    limit: 10
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
  if (image.attr("src") === image.attr("data-moving")) {
    image.removeAttr("src");
    image.attr("src", image.attr("data-still"));
  } else {
    image.removeAttr("src");
    image.attr("src", image.attr("data-moving"));
  }
});

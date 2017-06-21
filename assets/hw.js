/*
Pseudocode:
1. x establish a target div for the buttons and one for the images
2. x establish the form
3. x hard-code the starting array
4. x write the function to add an individual button from the array to the display
5. x call this function for every element in the array
6. write the function to take the form input, add it to the array, and add it to the page
7. write the function to make the Giphy call for every .foodbtn click and populate #results-container
8. write the function to start/stop on click?
*/

// key: f3302186cf634c96bb35b6e25a3207ac

var stringArray = ["Carrots", "Fondue", "Fried chicken", "Full English", "Gnocchi", "Green beans", "Hot fudge sundae", "Hummus", "Lobster", "Orange juice", "Peas", "Pineapple pizza", "Quarter pounder", "Ribeye", "Taco", "Zucchini"];

function addButton(string) {
  var newBtn = $("<a>");
  newBtn.addClass("waves-effect waves-light btn foodbtn");
  newBtn.data("food", string);
  newBtn.text(string);
  $("#button-container").append(newBtn);
}

for (var i = 0; i < stringArray.length; i++) {
  addButton(stringArray[i]);
}
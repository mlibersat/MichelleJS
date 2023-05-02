////////////////////Example 1 - Baby version of setTabOrder  - bare minimum ///////////////////

/* 
Create GGB objects:
tabOrder={}
addedList="" 
*/

var initList = "Point1, Point2, Point3"; // A list of all things on "stage" when applet initializes. One string, separated by commas. No need to add status name, instructionIcon or xIcon. Those are added in the library.
var addedList = ""; // A list of all items added since the first initialization (e.g., objects created onthe fly). One string, separated by commas.
var enders = "ggbButton1"; // A list of all items that need to be at the end of the tabOrder list. One string, separated by commas.

// Needed for going forward and back a slide
if (ggbObject.getValue("Length(tabOrder)") === 0) {
  setTabOrder(initList, addedList, enders);
}

// Add this to your code when needed.
addedList = manageAddedList("Point4", true); // to add Point4 to the tabOrder
// addedList = manageAddedList("Point4", false) // to remove Point4 from tabOrder <- Use this before deleting the GGB object, if applicable
setTabOrder(initList, addedList, enders);

//////////////////// Example 2 - Simple version of setTab Order for objects created on the fly //////////////////

/* 
Kim's Example video: https://www.loom.com/share/e7a03d001eb245bc9f202c44e0bbff3b
Kim's example starts with a geogebra file with the button bar added.
Objects in GGB are: 
  Points A, B, C, D, and E.  
  tabOrder={}
  addedList=""
Remove tabOrder and addedList from Graphics View 1 so they never show.
*/

var initList = "A,B,C,D,E"; // A list of all things you want in the tabOrder when the applet initializes. One string, separated by commas. No need to add status name, instructionIcon or xIcon. Those are added in the library.
var addedList = ""; // A list of all items added since the first initialization (e.g., objects created onthe fly). One string, separated by commas.
var enders = "ggbButton1"; // A list of all items that need to be at the end of the tabOrder list. One string, separated by commas.

// Example for creating a click counter. Used to name created points
var click = 0;

// Needed for going forward and back a slide
if (ggbObject.getValue("Length(tabOrder)") === 0) {
  setTabOrder(initList, addedList, enders);
}

// Write a function that adds objects to (or subtracts objects from) your tabOrder
function clientFunction(a) {
  switch (a.type) {
    case "mouseDown":
      {
        click++;
        ggbObject.evalCommand("Point".concat(click, "=(", a.x, ",", a.y, ")"));
        // Use manageAddedList library function by taking the newly created object and use true for added, false for subtracted
        // If you will be deleting an object and using "false" to subtract an item from tabOrder, make sure to use manageAddedList and setTabOrder before deleting the object.
        addedList = manageAddedList("Point".concat(click), true); // adds new point to AddedList
        console.log(addedList);
        setTabOrder(initList, addedList, enders);
      }
      break;
  }
}

// Optional/Recommended: If you want to be able to reset your applet to the initial number of objects on initialization, write a function that resets your lists to their initial state and sets the click count to 0
// Ex: Call this funciton on a reset button
function resetTabOrder() {
  initList = "A,B,C,D,E"; // A list of all things on "stage" when applet initializes. One string, separated by commas
  addedList = ""; // A list of all items added since the first initialization (e.g., objects created onthe fly). One string, separated by commas.
  enders = "ggbButton1"; // A list of all items that need to be at the end of the tabOrder list. One string, separated by commas.
  click = 0;
  // setTextValue is needed for setTabOrder to work
  ggbObject.setTextValue("addedList", "");
  setTabOrder(initList, addedList, enders);
}

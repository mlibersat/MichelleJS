/* 
See this code in action here: https://www.geogebra.org/m/kujwxwuw

Note: This example code and applet is based off of Kim's code form the the video walkthrough, but the button functionality differs slightly.

Kim's video walkthrough can be found here: https://www.loom.com/share/e7a03d001eb245bc9f202c44e0bbff3b 
*/

// The example below is used with the current Button Bar Global JS code that includes setTabOrder and manageAddedList.

var initList = "A,B,C,D,E"; // A list of all things you want in the tabOrder when the applet initializes. One string, separated by commas. No need to add status name, instructionIcon or xIcon. Those are added in the library.
var addedList = ""; // A list of all items added since the first initialization (e.g., objects created onthe fly). One string, separated by commas.
var enders = "ggbButton1, ggbButton2"; // A list of all items that need to be at the end of the tabOrder list. One string, separated by commas.

// Example for creating a click counter. Used to name created points
var click = 0;

// Needed for going forward and back a slide
if (ggbObject.getValue("Length(tabOrder)") === 0) {
  setTabOrder(initList, addedList, enders);
}

function defineButtonClickScripts() {
  return {
    ggbButton1: function () {
      enableButton(1, false);
      enableButton(2, true);
    },
    ggbButton2: function () {
      enableButton(1, true);
      enableButton(2, false);
      reset();
    },
  };
}

// Write a function that adds objects to (or subtracts objects from) your tabOrder
function clientFunction(a) {
  switch (a.type) {
    case "mouseDown":
      {
        if (ggbObject.getValue("ggbButton1Enabled") === 0) {
          click++;
          ggbObject.evalCommand("Point".concat(click, "=(", a.x, ",", a.y, ")"));
          ggbObject.setLayer("Point".concat(click), 5);
          ggbObject.setLabelVisible("Point".concat(click), true);
          // Use manageAddedList library function by taking the newly created object and use true for added, false for subtracted
          // If you will be deleting an object and using "false" to subtract an item from tabOrder, make sure to use manageAddedList and setTabOrder before deleting the object.
          addedList = manageAddedList("Point".concat(click), true); // adds new point to AddedList
          console.log(addedList);
          setTabOrder(initList, addedList, enders);
        }
      }
      break;
  }
}

// Optional/Recommended: If you want to be able to reset your applet to the initial number of objects on initialization, write a function that resets your lists to their initial state and sets the click count to 0
// Ex: Call this funciton on a reset button
function reset() {
  initList = "A,B,C,D,E"; // A list of all things on "stage" when applet initializes. One string, separated by commas
  addedList = ""; // A list of all items added since the first initialization (e.g., objects created onthe fly). One string, separated by commas.
  enders = "ggbButton1"; // A list of all items that need to be at the end of the tabOrder list. One string, separated by commas.
  click = 0;
  // setTextValue is needed for setTabOrder to work
  // Do this before deleting any objects using deleteObject())
  ggbObject.setTextValue("addedList", "");
  setTabOrder(initList, addedList, enders);

  // Delete points that were created on mouseDown
  allObjects = ggbObject.getObjectNames("Point");
  allObjects.forEach((el) => {
    if (el.includes("Point")) {
      ggbObject.deleteObject(el);
    }
  });
}

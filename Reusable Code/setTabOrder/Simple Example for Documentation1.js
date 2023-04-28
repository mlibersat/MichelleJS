// See this code in action in this applet:

// The example below is used with the current Button Bar Global JS code that includes setTabOrder and manageAddedList.

var initList = "Point1, Point2, Point3";
var addedList = ""; // A list of all items added since the first initialization (e.g., objects created onthe fly). One string, separated by commas.
var enders = "ggbButton1, ggbButton2"; // A list of all items that need to be at the end of the tabOrder list. One string, separated by commas.

// Needed for going forward and back a slide
if (ggbObject.getValue("Length(tabOrder)") === 0) {
  setTabOrder(initList, addedList, enders);
}

function defineButtonClickScripts() {
  return {
    ggbButton1: function () {
      enableButton(1, false);
      enableButton(2, true);
      addedList = manageAddedList("Point4", true); // to add Point4 to the tabOrder
      setTabOrder(initList, addedList, enders);
    },
    ggbButton2: function () {
      enableButton(1, true);
      enableButton(2, false);
      addedList = manageAddedList("Point4", false); // to remove Point4 from tabOrder
      setTabOrder(initList, addedList, enders);
    },
  };
}

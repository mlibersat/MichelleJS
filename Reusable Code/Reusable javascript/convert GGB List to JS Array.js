//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Option 1 below - For a "simple" GGB List containing values or strings (not points with coordinates or complex elements).  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to push GeoGebra list values to a JavaScript array
function pushGeoGebraListToJSArray(geoGebraListName, jsArray) {
  // Get the size of the GeoGebra list
  const listSize = ggbObject.getValue("Length(" + geoGebraListName + ")");

  // Push each value from the GeoGebra list to the JavaScript array
  for (let i = 1; i <= listSize; i++) {
    const value = ggbObject.getValue("(Element(" + geoGebraListName + ", " + i + "))");
    jsArray.push(value);
  }

  console.log("Values pushed to JavaScript array:", jsArray);
}

// Example usage:
const myVals = [];
const geoGebraListName = "valList";

// Call the function to push values from 'MyGeoGebraList' to 'myArray'. Use the "if" statement to only do this once on load of the applet
// if (xVals.length === 0) {
pushGeoGebraListToJSArray(geoGebraListName, myVals);
// }

///////////////////////////////////////////////////////////////////////////
// Option 2 below - uses XorYString to get the X and Y values separately //
///////////////////////////////////////////////////////////////////////////

// For a GGB List of points Function to push GeoGebra list values to a JavaScript array
// EX: geoGebraListName = "pointList"; jsArray = xVals ; xOrYString = "x"
function pushGGBPointListToJSArrays(geoGebraListName, jsArray, xOrYString) {
  // Get the size of the GeoGebra list
  const listSize = ggbObject.getValue("Length(" + geoGebraListName + ")");

  // Push each value from the GeoGebra list to the JavaScript array
  for (let i = 1; i <= listSize; i++) {
    const value = ggbObject.getValue(xOrYString + "(Element(" + geoGebraListName + ", " + i + "))");
    jsArray.push(value);
  }

  console.log("Values pushed to JavaScript array:", jsArray);
}

// Example usage:
const xVals = [];
const yVals = [];
const geoGebraPointListName = "pointList";

// Call the function to push values from 'MyGeoGebraList' to 'myArray'. Use the "if" statement to only do this once on load of the applet
// if (xVals.length === 0) {
pushGGBPointListToJSArrays(geoGebraPointListName, myArray, "x");
pushGGBPointListToJSArrays(geoGebraPointListName, myArray, "y");
// }

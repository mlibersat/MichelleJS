generateJavaScriptVariables("AAppletStatus");

function generateJavaScriptVariables(textObject) {
  var objects = textObject.getDependencies(); // Get all the dependencies of the text object
  console.log("objects", objects);
  var jsStrings = []; // An array to hold the JavaScript strings for each variable

  // Loop through each dependency and generate a JavaScript string for it
  objects.forEach(function (object) {
    var type = object.getType(); // Get the type of the object
    var name = object.getLaTeXName(); // Get the LaTeX name of the object
    var value; // The value of the object

    // Determine the value of the object based on its type
    switch (type) {
      case "point":
        value = "[" + object.x + ", " + object.y + "]";
        break;
      case "numeric":
        value = object.getValue();
        break;
      case "text":
        value = '"' + object.getLabel() + '"';
        break;
      case "boolean":
        value = object.getValue() ? "true" : "false";
        break;
      default:
        console.log("Unknown object type: " + type);
    }

    // Construct the JavaScript string for the variable
    var jsString = "var " + name + " = " + value + ";";
    jsStrings.push(jsString); // Add the JavaScript string to the array
  });

  return jsStrings.join("\n"); // Join all the JavaScript strings with newline characters
}

/* 
// To use this function, you would pass a Geogebra text object to it as an argument, like this:
var textObject = ggbApplet.getObjectByName("text1"); // Get a Geogebra text object by name
var jsStrings = generateJavaScriptVariables(textObject); // Generate the JavaScript strings for the text object and its dependencies
console.log(jsStrings); // Output the JavaScript strings to the console 
*/

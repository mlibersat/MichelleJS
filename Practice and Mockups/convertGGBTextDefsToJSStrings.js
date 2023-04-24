function convertToJavaScriptStrings(textObj) {
  console.log("1");

  // Initialize an empty array to store the ancestor text objects
  var ancestorTextObjs = [];

  // Traverse the Geogebra parent chain until we reach the top
  while (textObj.parentObject !== null) {
    console.log("2");

    // If the parent is a text object, add it to the array
    if (textObj.parentObject.type === "text") {
      ancestorTextObjs.push(textObj.parentObject);
    }
    textObj = textObj.parentObject;
  }
  console.log("3");

  // Reverse the ancestor text object array to process from top to bottom
  ancestorTextObjs.reverse();
  console.log("4");

  // Initialize a string to store the JavaScript code
  var javascriptCode = "";

  // Add each ancestor text object to the JavaScript code as a variable
  for (var i = 0; i < ancestorTextObjs.length; i++) {
    console.log("5");

    var ancestorTextObj = ancestorTextObjs[i];
    var dependencies = ancestorTextObj.getDependencies();
    var textString = "var " + ancestorTextObj.label + ' = "' + ancestorTextObj.definitionString + '";\n';

    for (var j = 0; j < dependencies.length; j++) {
      console.log("6");

      var dep = dependencies[j];
      if (dep.type === "boolean") {
        textString += "var " + dep.label + " = " + dep.value() + ";\n";
      } else {
        textString += "var " + dep.label + " = " + dep.getName() + ";\n";
      }
    }

    javascriptCode += textString;
  }
  console.log("7");

  // Add the original text object to the JavaScript code as a variable
  var dependencies = textObj.getDependencies();
  var textString = "var " + textObj.label + ' = "' + textObj.definitionString + '";\n';

  for (var j = 0; j < dependencies.length; j++) {
    console.log("8");

    var dep = dependencies[j];
    if (dep.type === "boolean") {
      textString += "var " + dep.label + " = " + dep.value() + ";\n";
    } else {
      textString += "var " + dep.label + " = " + dep.getName() + ";\n";
    }
  }
  console.log("9");

  javascriptCode += textString;

  // Return the final JavaScript code
  return javascriptCode;
}

function ggbOnInit() {
  console.log("10");

  var appletObjects = ggbApplet.getAllObjectNames();
  var myTextObj = null;
  for (var i = 0; i < appletObjects.length; i++) {
    var obj = ggbApplet.getObject(appletObjects[i]);
    if (obj.type === "text" && obj.label === "textPt") {
      myTextObj = obj;
      break;
    }
  }
  console.log("11");

  if (myTextObj === null) {
    console.log("Could not find textPt");
    return;
  }
  console.log("12");

  var javascriptCode = convertToJavaScriptStrings(myTextObj);
  console.log(javascriptCode);
  console.log("13");
}

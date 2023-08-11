// Published PVC Addition Global JS

function ggbOnInit(name, ggbObject) {
  //PVC appears in grades 2 through 6
  //this PVC covers population for addition and multiplication at the moment

  //requires PVC that has sectionWidth (default 6), sectionHeight (default 15), box# regions in order from right to left and
  //  starter points at the beginning of each region that are named StarterPoint# in order right to left

  const numRegions = ggbObject.getValue("requiredRegions");
  const regions = ["One", "Ten", "Hundred", "Thousand", "TenThousand", "HundredThousand", "Million"];

  const regionColors = ["#E60E20", "#009B44", "#0075A4", "#949494", "#F17E09", "#FFDA00", "#7ECDEB"];
  ggbObject.setCoordSystem(
    -0.05 * numRegions * ggbObject.getValue("sectionWidth"),
    1.05 * numRegions * ggbObject.getValue("sectionWidth"),
    -1,
    ggbObject.getValue("sectionHeight") + 3
  );
  updateReadText();

  const starterArray = ggbObject.getAllObjectNames("point").filter(function (value) {
    return value.includes("StarterPoint");
  });

  //finds x and y coords of the start points
  const starterX = starterArray.map(function (element) {
    return ggbObject.getXcoord(element);
  });
  const starterY = starterArray.map(function (element) {
    return ggbObject.getYcoord(element);
  });
  let carryArray = [
    "\\phantom{\\scriptsize{1}}",
    "\\phantom{\\scriptsize{1}}",
    "\\phantom{\\scriptsize{1}}",
    "\\phantom{\\scriptsize{1}}",
    "\\phantom{\\scriptsize{1}}",
    "\\phantom{\\scriptsize{1}}",
    "\\phantom{\\scriptsize{1}}",
  ];

  //breaks an integer down into place values, returns ones, tens, hundreds, etc
  function pulverize(number) {
    let numArray = number.toString().split("").map(Number).reverse();
    return numArray;
  }

  //creates max two rows of five with this configuration, but does contain spacer parameter Math.floor(j/10) in line 67
  // I DON'T LOVE THE POINT NAMING HERE!!!!!!!!!!!!!!!
  function popul8() {
    reset();
    //pull data from inputs (GGB or Platform)
    let number1 = ggbObject.getValue("number");
    let number2 = ggbObject.getValue("number2");
    let multiplier = ggbObject.getValue("multiplier");

    //break down into digits
    let num1Array = pulverize(number1);
    let num2Array = pulverize(number2);

    //for as many multiples exist
    for (let k = 0; k < multiplier; k++) {
      //for as many regions as there are place values defined
      if (num1Array.length <= numRegions && num2Array.length <= numRegions) {
        //need error messaging to allow higher than 9 in a region
        for (let i = 0, L = num1Array.length; i < L; i++) {
          //create a point in that region named by the region name (from array above) and attached to that box
          for (let j = 0, K = num1Array[i]; j < K; j++) {
            if (i == 0) {
              ggbObject.evalCommand(regions[i] + "Point" + (j + 1) + "Set" + (k + 1) + "=PointIn(box" + (i + 1) + ")");
            } else {
              ggbObject.evalCommand(
                regions[i] + "Point" + (j + 1) + "Set" + (k + 1) + "=PointIn(Union(box" + (i + 1) + ",box" + i + "))"
              );
            }
            ggbObject.setCoords(
              regions[i] + "Point" + (j + 1) + "Set" + (k + 1),
              starterX[i] + (j % 5),
              starterY[i] - Math.floor(j / 5) - Math.floor(j / 10) - 3 * k
            );
            prettyPoints(regions[i] + "Point" + (j + 1) + "Set" + (k + 1), i);
          }
        }
        //if we have a second number
        for (let i = 0, L = num2Array.length; i < L; i++) {
          //create a point in that region named by the region name (from array above) and attached to that box
          for (let j = 0, K = num2Array[i]; j < K; j++) {
            ggbObject.evalCommand(regions[i] + "PointB" + (j + 1) + "=PointIn(box" + (i + 1) + ")");
            ggbObject.setCoords(
              regions[i] + "PointB" + (j + 1),
              starterX[i] + (j % 5),
              3 - Math.floor(j / 5) - Math.floor(j / 10)
            );
            prettyPoints(regions[i] + "PointB" + (j + 1), i);
          }
        }
      }
    }
  }

  //makes the points into the desired style
  function prettyPoints(pointName, regionNumber = 0) {
    ggbObject.setPointStyle(pointName, 0);
    ggbObject.setPointSize(pointName, 8);
    ggbObject.setVisible(pointName, true);
    ggbObject.setLayer(pointName, 1);
    console.log("Points set to 1");
    ggbObject.evalCommand("SetColor(" + pointName + ',"' + regionColors[regionNumber] + '")');
  }

  //move all of the points into the fewest number of rows of 5
  function organize() {
    let totalNumArray = howManyPoints();
    reset();
    for (let i = 0, L = totalNumArray.length; i < L; i++) {
      //create a point in that region named by the region name (from array above) and attached to that box
      for (let j = 0, K = totalNumArray[i]; j < K; j++) {
        if (i == 0) {
          ggbObject.evalCommand(regions[i] + "Point" + (j + 1) + "=PointIn(box" + (i + 1) + ")");
        } else {
          ggbObject.evalCommand(regions[i] + "Point" + (j + 1) + "=PointIn(Union(box" + (i + 1) + ",box" + i + "))");
        }
        ggbObject.setCoords(
          regions[i] + "Point" + (j + 1),
          starterX[i] + (j % 5),
          starterY[i] - Math.floor(j / 5) - Math.floor(j / 10)
        );
        prettyPoints(regions[i] + "Point" + (j + 1), i);
      }
    }
    totalNumArray = howManyPoints();
    console.log(totalNumArray);
    totalNumArray.every(function (element) {
      if (element >= 10) {
        enableButton(3, true);
        return false;
      } else {
        enableButton(3, false);
        return true;
      }
    });
  }

  function howManyPoints() {
    let totalNumArray = [];
    let allPoints = ggbObject.getAllObjectNames("point");
    let count = 0;
    for (let i = 0, L = numRegions; i < L; i++) {
      allPoints.forEach((element) => {
        if (element.startsWith(regions[i] + "Point") && ggbObject.getVisible(element) == true) {
          count++;
        }
      });
      totalNumArray.push(count);
      count = 0;
    }
    return totalNumArray;
  }

  let selectedItem;

  //this function creates a draggable ten frame
  function bundle() {
    organize();
    let totalNumArray = howManyPoints();
    totalNumArray.every((element, i) => {
      //highlight one or more tens frames
      if (element >= 10 && i <= numRegions - 1) {
        let x1 = ggbObject.getXcoord(regions[i] + "Point1"); //change this to be the first point showing
        let y1 = ggbObject.getYcoord(regions[i] + "Point1"); //change this to be the first point showing
        let x2 = x1 + 4;
        let y2 = y1 - 1;
        //makes draggable tens frame and sets properties
        ggbObject.evalCommand(
          regions[i] +
            "TensFrame=Polygon((" +
            (x1 - 0.5) +
            "," +
            (y1 + 0.5) +
            "),(" +
            (x2 + 0.5) +
            "," +
            (y1 + 0.5) +
            "),(" +
            (x2 + 0.5) +
            "," +
            (y2 - 0.5) +
            "),(" +
            (x1 - 0.5) +
            "," +
            (y2 - 0.5) +
            "))"
        );
        ggbObject.setColor(regions[i] + "TensFrame", 255, 255, 255);
        ggbObject.setFilling(regions[i] + "TensFrame", 1);
        ggbObject.setFixed(regions[i] + "TensFrame", false, true);
        ggbObject.setLayer(regions[i] + "TensFrame", 2);
        console.log("frame set to", ggbObject.getLayer(regions[i] + "TensFrame"));
        ggbObject.deleteObject("tabOrder");
        ggbObject.evalCommand(
          "tabOrder={ggbButton3," + regions[i] + "TensFrame,ggbButton3,ggbButton4,ggbButton1,ggbButton2}"
        );
        //copies tens frame to make outline and sets properties
        ggbObject.evalCommand(regions[i] + "TensFrameOutline=" + regions[i] + "TensFrame");
        ggbObject.setColor(regions[i] + "TensFrameOutline", 0, 0, 0);
        ggbObject.setFilling(regions[i] + "TensFrameOutline", 0);
        ggbObject.setVisible(regions[i] + "TensFrameOutline", true);
        ggbObject.setFixed(regions[i] + "TensFrameOutline", true, false);
        ggbObject.setLayer(regions[i] + "TensFrameOutline", 3);
        console.log("outline set to", ggbObject.getLayer(regions[i] + "TensFrameOutline"));

        //makes corner so that points can be made based off of tens frame position
        ggbObject.evalCommand(regions[i] + "TenFrameCorner=Corner(" + regions[i] + "TensFrameOutline,1)");
        ggbObject.setVisible(regions[i] + "TenFrameCorner", false);

        //create points attached to that tens frame and sets properties
        for (let j = 0, K = 10; j < K; j++) {
          ggbObject.evalCommand(
            "Moving" +
              regions[i] +
              "Point" +
              (j + 1) +
              "=" +
              regions[i] +
              "TenFrameCorner+(" +
              ((j % 5) + 0.5) +
              "," +
              (-Math.floor(j / 5) - 0.5) +
              ")"
          );
          prettyPoints("Moving" + regions[i] + "Point" + (j + 1), i);
          ggbObject.setLayer("Moving" + regions[i] + "Point" + (j + 1), 4);
          console.log("points set to", ggbObject.getLayer("Moving" + regions[i] + "Point" + (j + 1)));
          ggbObject.setFixed("Moving" + regions[i] + "Point" + (j + 1), true, false);
          ggbObject.setVisible(regions[i] + "Point" + (j + 1), false);
        }
        enableButton(3, false);
        //changes number of points in each region
        let first = totalNumArray[i];
        let second = totalNumArray[i + 1];
        totalNumArray[i] = first - 10;
        totalNumArray[i + 1] = second + 1;
        //leaves the loop early
        return false;
      } else {
        //allows loop to continue
        return true;
      }
    });
  }

  //bundles or unbundles, based on the case
  function performSwap(totalNumArray) {
    console.log(selectedItem, totalNumArray);
    //figure out the type of point or tens frame that was grabbed by removing all but the region
    let selectedItemRegion = selectedItem.replace(/(Point)\d+|(TensFrame)/g, "");
    //gets the index of the region from the const array "regions"
    let regionNum = regions.indexOf(selectedItemRegion);
    console.log(selectedItem, selectedItemRegion, regionNum);
    let bundling =
      ggbObject.getXcoord(regions[regionNum] + "TenFrameCorner") <
        (numRegions - regionNum - 1) * ggbObject.getValue("sectionWidth") && selectedItem.includes("Frame");
    let unbundling =
      selectedItem.includes("Point") &&
      ggbObject.getXcoord(selectedItem) > (numRegions - regionNum) * ggbObject.getValue("sectionWidth");
    switch (true) {
      //moving tenframe (bundle)
      case bundling:
        console.log(
          numRegions,
          regionNum,
          ggbObject.getValue("sectionWidth"),
          (numRegions - regionNum) * ggbObject.getValue("sectionWidth")
        );
        //hide old tenframe
        for (let j = 0, K = 10; j < K; j++) {
          ggbObject.setVisible("Moving" + regions[regionNum] + "Point" + (j + 1), false);
        }

        ggbObject.setVisible(regions[regionNum] + "TensFrameOutline", false);
        ggbObject.setVisible(regions[regionNum] + "TensFrame", false);

        //create ten point in new region
        let midPointX = ggbObject.getValue("sectionWidth") * (numRegions - regionNum - 2 + 0.5);
        ggbObject.evalCommand(
          regions[regionNum + 1] + "Point" + (totalNumArray[regionNum + 1] + 1) + "=PointIn(box" + (regionNum + 2) + ")"
        );
        ggbObject.setCoords(regions[regionNum + 1] + "Point" + (totalNumArray[regionNum + 1] + 1), midPointX, 1);
        prettyPoints(regions[regionNum + 1] + "Point" + (totalNumArray[regionNum + 1] + 1), regionNum + 1);
        carryArray.splice(regionNum + 1, 1, "\\scriptsize{1}");
        ggbObject.evalCommand(
          "SelectObjects(" + regions[regionNum + 1] + "Point" + (totalNumArray[regionNum + 1] + 1) + ")"
        );
        console.log(totalNumArray);
        //reorganizes points after waiting half a second
        setTimeout(function () {
          organize();
          ggbObject.evalCommand(
            "SelectObjects(" + regions[regionNum + 1] + "Point" + (totalNumArray[regionNum + 1] + 1) + ")"
          );
          updateAlgorithmText(3);
          ggbObject.deleteObject("tabOrder");
          ggbObject.evalCommand(
            "tabOrder={ggbButton3,ggbButton4,ggbButton1,ggbButton2,AAppletStatus,instructionsIcon,xIcon,FirstNumber,SecondNumber}"
          );
        }, 500);

        break;
      //moving point (unbundle)
      case unbundling:
        //hides the point that was dropped in a new region
        ggbObject.setVisible(selectedItem, false);
        //creates ten new points
        for (let i = 0, L = 10; i < L; i++) {
          //if you pulled a tens point, it can only go in the ones region
          if (regionNum == 1) {
            ggbObject.evalCommand(
              regions[regionNum - 1] +
                "Point" +
                (totalNumArray[regionNum - 1] + i + 1) +
                "=PointIn(box" +
                regionNum +
                ")"
            );
          }
          //anything that's not a tens point needs to be able to unbundle again, so it needs two regions
          else if (regionNum > 1) {
            ggbObject.evalCommand(
              regions[regionNum - 1] +
                "Point" +
                (totalNumArray[regionNum - 1] + i + 1) +
                "=PointIn(Union(box" +
                regionNum +
                ",box" +
                (regionNum - 1) +
                "))"
            );
          }
          //sets the coordinates of the new points
          ggbObject.setCoords(
            regions[regionNum - 1] + "Point" + (totalNumArray[regionNum - 1] + i + 1),
            starterX[regionNum - 1] + (i % 5),
            ggbObject.getYcoord(regions[regionNum - 1] + "Point" + totalNumArray[regionNum - 1]) -
              2 -
              Math.floor(i / 5) -
              Math.floor(i / 10)
          );
          //starterY[regionNum - 1] -
          //make the points the right color, size, style
          prettyPoints(regions[regionNum - 1] + "Point" + (totalNumArray[regionNum - 1] + i + 1), regionNum - 1);
          console.log(regions[regionNum - 1] + "Point" + (totalNumArray[regionNum - 1] + i + 1));
        }
        //update the array that tracks the number of points in each region
        totalNumArray = howManyPoints();
        updateAlgorithmText(3);
        break;
    }
  }

  function reset() {
    ggbObject.setAnimating();
    ggbObject.setValue("time", 0);
    let deletablePoints = ggbObject.getAllObjectNames("point").filter(function (value) {
      return (
        !value.includes("Starter") &&
        !value.includes("corner") &&
        !value.includes("Bar") &&
        !value.includes("Export") &&
        !value.includes("Icon") &&
        !value.includes("Instructions")
      );
    });
    deletablePoints.forEach(function (element) {
      ggbObject.deleteObject(element);
    });
    let deletablePolys = ggbObject.getAllObjectNames("quadrilateral").filter(function (value) {
      return !value.includes("box") && !value.includes("Bar") && !value.includes("Box");
    });

    deletablePolys.forEach(function (element) {
      ggbObject.deleteObject(element);
    });
  }
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function updateAlgorithmText(textStep = "0") {
    //show the vinculum and plus sign
    ggbObject.setVisible("f", true);
    ggbObject.setVisible("text11", true);
    //get all pertinent numbers and turn them into arrays
    let number1 = ggbObject.getValue("number");
    let number2 = ggbObject.getValue("number2");
    let num1Array = pulverize(number1);
    let num2Array = pulverize(number2);
    let answerArray = howManyPoints();

    //if one of the arrays is shorter than the other, add empty elements to make them align correctly
    switch (true) {
      case num1Array.length > num2Array.length:
        while (num1Array.length != num2Array.length) {
          num2Array.push("");
        }
        break;
      case num1Array.length < num2Array.length:
        while (num1Array.length != num2Array.length) {
          num1Array.push("");
        }
        break;
      default:
        break;
    }

    //set up each of the strings that will be used in the matrix
    let firstNumberString = "";
    let secondNumberString = "";
    let carryString = "";
    let answerString = "";

    //change arrays into strings with appropriate columns and commas
    firstNumberString = convertArraysIntoStrings(num1Array);
    secondNumberString = convertArraysIntoStrings(num2Array);
    answerString = convertArraysIntoStrings(answerArray);
    carryString = convertArraysIntoStrings(carryArray, false);

    // //figure out where something has been carried and append that to the carry string where necessary
    // answerArray.forEach(function (element, index) {
    // 	switch (true) {
    // 		case num1Array[index] + num2Array[index] < element && num1Array[index] + num2Array[index] < 10 && index == answerArray.length - 1:
    // 			carryString = "\\scriptsize{1}" + carryString;
    // 			break;
    // 		case num1Array[index] + num2Array[index] < element && num1Array[index] + num2Array[index] < 10:
    // 			carryString = "\\scriptsize{1} &" + carryString;
    // 			break;
    // 		default:
    // 			carryString = "\\phantom{\\scriptsize{1}} &" + carryString;
    // 			break;
    // 	}
    // 	console.log(carryString);
    // });

    //set the value of the text string based on which step of the addition process you're on
    switch (textStep) {
      case 0: //reset, starting point, no text
        ggbObject.setTextValue("algorithmText", "");
        break;
      case 1: //show first two numbers only, first button press
        ggbObject.setTextValue(
          "algorithmText",
          "\\begin{array}{} " + firstNumberString + " \\\\" + secondNumberString + " \\\\	\\end{array}"
        );
        break;
      case 2: //show sum of the numbers when putting dots together in a region, second button press
        ggbObject.setTextValue(
          "algorithmText",
          "\\begin{array}{} " +
            firstNumberString +
            " \\\\" +
            secondNumberString +
            " \\\\ \\\\ \\phantom{\\scriptsize{1}} \\\\" +
            answerString +
            " \\\\  \\end{array}"
        );
        break;
      case 3: //bundling - this one's fun, changes a lot, third button press AND performSwap
        ggbObject.setTextValue(
          "algorithmText",
          "\\begin{array}{} " +
            firstNumberString +
            " \\\\" +
            secondNumberString +
            " \\\\ \\\\ " +
            carryString +
            " \\\\" +
            answerString +
            " \\\\ \\end{array}"
        );
        break;
      default:
        break;
    }

    //concatenate the numbers such that each single digit number gets a column in the matrix
    //add a comma where necessary, and don't add an empty column (&) at the end
    function convertArraysIntoStrings(numArray, commas = "true") {
      let nameString = "";
      numArray.forEach(function (element, index) {
        if (commas) {
          switch (true) {
            case index == numArray.length - 1:
              nameString = nameString + numArray[numArray.length - index - 1].toString();
              break;
            case index == numArray.length - 4:
            case index == numArray.length - 7:
              if (numArray[numArray.length - index - 1].toString() != "") {
                nameString = nameString + numArray[numArray.length - index - 1].toString() + "," + "&";
              } else {
                nameString = nameString + numArray[numArray.length - index - 1].toString() + "&";
              }
              break;
            case index < numArray.length - 1:
              nameString = nameString + numArray[numArray.length - index - 1].toString() + "&";
              break;
            default:
              break;
          }
        } else {
          switch (true) {
            case index == numArray.length - 1:
              nameString = nameString + numArray[numArray.length - index - 1].toString();
              break;
            case index < numArray.length - 1:
              nameString = nameString + numArray[numArray.length - index - 1].toString() + "&";
              break;
            default:
              break;
          }
        }
      });
      return nameString;
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function updateReadText() {
    let regionString = "";
    for (let i = 0, L = 6; i < L; i++) {
      if (i == L - 1) {
        regionString = regionString + "and " + regions[i];
      } else {
        regionString = regionString + regions[i] + ", ";
      }
    }
    ggbObject.setTextValue("AAppletStatus", "A place value chart shows " + regionString + ".");
  }

  //sets aria-label and removes role
  const getCanvas = function (name) {
    var allCanvases = document.querySelectorAll("canvas");
    for (i = 0; i < allCanvases.length; i++) {
      var ggbDiv = allCanvases[i].closest("div.appletParameters,div.notranslate");
      if (ggbDiv) {
        var parameterID = ggbDiv.getAttribute("id");
        var canvasID = "canvas" + parameterID;
        allCanvases[i].setAttribute("id", canvasID);
        var parameterRole = ggbDiv.querySelectorAll('[role="application"]');
        if (parameterRole) {
          for (i = 0; i < parameterRole.length; i++) {
            parameterRole[i].setAttribute("role", "");
          }
        }
      }
    }
    var id = "canvas" + name;
    var ggbcanvas = document.getElementById(id);
    return ggbcanvas;
  };

  const setAriaLabel = function (arialabel, canvas) {
    if (canvas) {
      canvas.setAttribute("aria-label", arialabel);
    }
  };
  const ggbcanvas = getCanvas(name);

  //CHANGE ARIA LABEL HERE
  setAriaLabel("Place Value Interactive", ggbcanvas);

  function button1Click() {
    // button 1 code here
    enableButton(1, false);
    enableButton(2, true);
    enableButton(3, false);
    enableButton(4, true);
    updateAlgorithmText(1);
    popul8();
    ggbReadText("What happens when the button is clicked?");
  }

  function button2Click() {
    // button 2 code here
    updateAlgorithmText(2);
    organize();
    enableButton(1, false);
    enableButton(2, false);
    //enableButton(3, true);
    enableButton(4, true);
  }

  function button3Click() {
    // button 3 code here
    updateAlgorithmText(3);
    bundle();
    enableButton(1, false);
    enableButton(2, false);
    //enableButton(3, true);
    enableButton(4, true);
  }

  function button4Click() {
    // button 4 code here
    updateAlgorithmText(0);
    ggbObject.setVisible("f", false);
    ggbObject.setVisible("text11", false);

    carryArray = [
      "\\phantom{\\scriptsize{1}}",
      "\\phantom{\\scriptsize{1}}",
      "\\phantom{\\scriptsize{1}}",
      "\\phantom{\\scriptsize{1}}",
      "\\phantom{\\scriptsize{1}}",
      "\\phantom{\\scriptsize{1}}",
      "\\phantom{\\scriptsize{1}}",
    ];
    reset();
    enableButton(1, true);
    enableButton(2, false);
    enableButton(3, false);
    enableButton(4, true);
  }

  function button5Click() {
    // button 5 code here
  }

  // required replacement 2: replaces readButtonText and keyboardInstructions
  function defineKeyboardInstructions(obj) {
    // takes a GGB object name as an argument, returns its keyboard text.
    var unavailableButtonText = "This button is unavailable.";
    var keyboardInstructions = {
      // object you shouldn't need to change
      AAppletStatus: "Press tab to select next object.",
      instructionsIcon: "Keyboard instructions enabled",
      xIcon: "Keyboard instructions enabled",
      // static text objects
      /* A: "Press the arrow keys to move this point.", // example for a point */
      // dynamic text objects
      ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to populate." : unavailableButtonText,
      ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to organize." : unavailableButtonText,
      ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to bundle." : unavailableButtonText,
      ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to reset." : unavailableButtonText,
      ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to _____." : unavailableButtonText,
    };
    // if obj is a key in keyboardInstructions, then return the value. If not, then return the default string.
    return keyboardInstructions[obj] || "Keyboard instructions enabled.";
  }
  // end 2

  // optional name changes:
  ggbObject.registerClientListener(clientFunction);
  ggbObject.registerClickListener(clickListenerFunction);
  ggbObject.registerObjectUpdateListener("number", quickChange);
  ggbObject.registerObjectUpdateListener("number2", quickChange);
  ggbObject.registerObjectUpdateListener("FirstNumber", quickChange);
  ggbObject.registerObjectUpdateListener("SecondNumber", quickChange);
  ggbcanvas.addEventListener("keyup", keyit);
  ggbObject.registerAddListener(hideSegments);

  function quickChange() {
    updateAlgorithmText(0);
    ggbObject.setVisible("f", false);
    ggbObject.setVisible("text11", false);
    carryArray = [
      "\\phantom{\\scriptsize{1}}",
      "\\phantom{\\scriptsize{1}}",
      "\\phantom{\\scriptsize{1}}",
      "\\phantom{\\scriptsize{1}}",
      "\\phantom{\\scriptsize{1}}",
      "\\phantom{\\scriptsize{1}}",
      "\\phantom{\\scriptsize{1}}",
    ];
    reset();
    enableButton(1, true);
    enableButton(2, false);
    enableButton(3, false);
    enableButton(4, true);
  }

  function hideSegments(added) {
    if (ggbObject.getObjectType(added) == "segment") {
      ggbObject.setVisible(added, false);
      ggbObject.setFixed(added, true, false);
    }
  }

  // // required replacement 3: replaces enableButton
  // call when you want to read what the keyboard instructions say, pass in an object
  function readKeyboardInstructions(obj) {
    var readIt = defineKeyboardInstructions(obj);
    ggbReadText(readIt);
  }

  // call when you want to show keyboard instructions for current object
  function updateKeyboardInstructions(obj = "") {
    var showIt = defineKeyboardInstructions(obj);
    ggbObject.setTextValue("keyboardInstructions", "\\text{" + showIt + "}");
  }

  // screen reader function
  // if readString is the name of a GGB text object, include true as a second argument
  function ggbReadText(readString, isGGBTextObj = false) {
    var addQuotes = isGGBTextObj ? "" : '"';
    ggbObject.evalCommand("ReadText(" + addQuotes + readString + addQuotes + ")");
  }

  // button state function
  function enableButton(buttonNum, boolean) {
    var enableOrDisable = boolean ? "enable" : "disable";
    ggbObject.evalCommand("Execute(" + enableOrDisable + "BarButton, ggbButton" + buttonNum + ")");
  }
  // end 3

  var barButtons = ["ggbButton1", "ggbButton2", "ggbButton3", "ggbButton4", "ggbButton5"];

  function clientFunction(a) {
    var clientTarget = a.target;
    switch (a.type) {
      case "select":
        selectedItem = clientTarget;
        // // required addition 4
        // on select always: update the keyboard instructions
        updateKeyboardInstructions(clientTarget);
        // if input box selected, show the keyboard instructions temporarily
        var forceKeyboardInstructions = ["textfield"];
        if (forceKeyboardInstructions.includes(ggbObject.getObjectType(clientTarget))) {
          ggbObject.setValue("showKeyboardInstructionsTemporarily", true);
        }
        if (clientTarget.includes("Frame")) {
          showSelection(clientTarget);
        }
        // end 4
        switch (clientTarget) {
          // // required deletion 5
          // end 5
          case "AAppletStatus":
            // if status selected, don't read out escape text more than once
            ggbObject.setValue("escTextCount", ggbObject.getValue("escTextCount") + 1);
            break;
          default:
            // if button selected, read out its keyboard instructions
            if (barButtons.includes(clientTarget)) {
              // // required replacement 6
              readKeyboardInstructions(clientTarget);
              // end 6
            }
        }
        break;
      case "dragEnd":
        console.log("dragged");
        showSelection();
        let totalNumArray = howManyPoints();
        performSwap(totalNumArray);
        break;
      case "deselect":
        // on deselect always: stop showing keyboard instructions temporarily, update keyboard instructions
        // // required replacement 7
        showSelection();
        ggbObject.setValue("showKeyboardInstructionsTemporarily", false);
        updateKeyboardInstructions();
        // end 7
        break;
    }
  }

  // optional name change
  function clickListenerFunction(a) {
    switch (a) {
      case "instructionsIcon":
        // show instructions, read out instructions, select xIcon
        var rawInstructions = ggbObject.getLaTeXString("instructionsText");
        var trimmedInstructions = rawInstructions.substr(6, rawInstructions.length - 7);
        var finalInstructions = trimmedInstructions.concat(" Press space to close the instructions.");
        // // required deletion 8: focus indicator
        // end 8
        ggbObject.setValue("showInstructions", true);
        ggbReadText(finalInstructions);
        ggbObject.evalCommand("SelectObjects(xIcon)");
        break;
      case "xIcon":
        // hide instructions, select instructionsIcon
        // // required deletion 9: focus indicator
        // end 9
        ggbObject.setValue("showInstructions", false);
        ggbObject.evalCommand("SelectObjects(instructionsIcon)");
        break;
      default:
        if (barButtons.includes(a)) {
          // clicked button: run its function if it's enabled, read its text otherwise; always update keyboard instructions
          var buttonFunctions = {
            ggbButton1: button1Click,
            ggbButton2: button2Click,
            ggbButton3: button3Click,
            ggbButton4: button4Click,
            ggbButton5: button5Click,
          };
          if (buttonFunctions[a] && ggbObject.getValue(a + "Enabled")) {
            buttonFunctions[a]();
          } else {
            // // required replacement 10
            readKeyboardInstructions(a);
            // end 10
          }
          // required addition 11
          updateKeyboardInstructions(a);
          // end 11
        }
    }
  }

  // // required addition 12
  function keyit(event) {
    console.log(event);
    console.log(selectedItem);
    switch (true) {
      case event.code === "KeyK":
        // toggle keyboard instructions, read new value
        var KIBool = ggbObject.getValue("showKeyboardInstructions");
        var KIText = "Keyboard instructions " + (KIBool ? "hidden" : "shown") + ".";
        ggbReadText(KIText);
        ggbObject.setValue("showKeyboardInstructions", !KIBool);
        break;
      case event.code.includes("ArrowLeft") && selectedItem.includes("Frame"):
        totalNumArray = howManyPoints();
        performSwap(totalNumArray);
        break;
      case event.code.includes("ArrowRight") && selectedItem.includes("Point"):
        totalNumArray = howManyPoints();
        performSwap(totalNumArray);
      // uncomment if you have >5 selectable objects
      /* case "KeyX":
    ggbObject.evalCommand("SelectObjects(AAppletStatus)");
    break; */
    }
  }

  function showSelection(target) {
    var thingsToIgnore = ["instructionsIcon", "xIcon"];
    if (thingsToIgnore.includes(target)) {
      return;
    }
    // delete previous selection objects
    var allObjects = ggbObject.getAllObjectNames();
    for (var i = 0, L = allObjects.length; i < L; i++) {
      var obj = allObjects[i];
      if (ggbObject.getCaption(obj) === "selectionIndicator") {
        ggbObject.deleteObject(obj);
      }
    }
    if (!target) {
      return;
    }
    // create selection indicator object depending on type
    if (isPoly(target)) {
      var vertString = ggbObject.evalCommandGetLabels("Vertex(" + target + ")");
      var vertArr = vertString.split(",");
      hidePieces(vertArr);
      var selPoly = ggbObject.evalCommandGetLabels("Polygon({" + vertString + "})");
      styleSelection(selPoly, target);
    } else if (ggbObject.getObjectType(target) === "circle") {
      var newName = target.concat("selection");
      ggbObject.evalCommand(newName + " = " + target);
      styleSelection(newName, target);
    }
  }

  function styleSelection(obj, originalObj) {
    var color = [0, 0, 0];
    ggbObject.setFixed(obj, false, false);
    ggbObject.setColor(obj, ...color);
    ggbObject.setFilling(obj, 0);
    ggbObject.setLineThickness(obj, 8);
    ggbObject.setLayer(obj, ggbObject.getLayer(originalObj) + 1);
    ggbObject.setCaption(obj, "selectionIndicator");
  }

  function hidePieces(arr) {
    for (var i = 0, L = arr.length; i < L; i++) {
      var obj = arr[i];
      ggbObject.setVisible(obj, false);
      ggbObject.setCaption(obj, "selectionIndicator");
    }
  }

  function isPoly(thing) {
    var polyTypes = ["polygon", "triangle", "quadrilateral", "pentagon", "hexagon"];
    return polyTypes.includes(ggbObject.getObjectType(thing));
  }
}

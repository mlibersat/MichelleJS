/* eslint-disable no-undef */
/* eslint-disable prefer-const */
function ggbOnInit(name, ggbObject) {
  loadUtils().then(function (setupGGB) {
    const buttonClicks = defineButtonClickScripts();
    const {
      getCanvas,
      setAriaLabel,
      readKeyboardInstructions,
      updateKeyboardInstructions,
      ggbReadText,
      enableButton,
      libClientFunction,
      libClickFunction,
      libKeyFunction,
      registerSafeObjectUpdateListener,
      registerSafeObjectClickListener,
      registerHoverListener,
      unavailableButtonText,
      setTabOrder,
      manageAddedList,
    } = setupGGB({
      name,
      ggbObject,
      defineKeyboardInstructions,
      buttonClicks,
      statusName: "AAppletStatus",
    });
    const ggbcanvas = getCanvas();

    /*
     * IGNORE above
     * EDIT below
     */

    setAriaLabel(ggbcanvas, "Place Value Interactive");

    // Global-ish variables

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

    let selectedItem;

    // listeners here; keep these, add your own as needed
    ggbObject.registerClientListener(function (a) {
      clientFunction(a);
      libClientFunction(a);
    });
    ggbObject.registerClickListener(function (a) {
      clickListenerFunction(a);
      libClickFunction(a);
    });
    ggbcanvas.addEventListener("keyup", function (event) {
      keyit(event);
      libKeyFunction(event);
    });
    ggbObject.registerClientListener(clientFunction);
    ggbObject.registerClickListener(clickListenerFunction);
    ggbObject.registerObjectUpdateListener("number", quickChange);
    ggbObject.registerObjectUpdateListener("number2", quickChange);
    ggbObject.registerObjectUpdateListener("FirstNumber", quickChange);
    ggbObject.registerObjectUpdateListener("SecondNumber", quickChange);
    ggbcanvas.addEventListener("keyup", keyit);
    ggbObject.registerAddListener(hideSegments);

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

    function reset() {
      ggbObject.setAnimating();
      ggbObject.setValue("time", 0);
      const deletablePoints = ggbObject.getAllObjectNames("point").filter(function (value) {
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
      const deletablePolys = ggbObject.getAllObjectNames("quadrilateral").filter(function (value) {
        return !value.includes("box") && !value.includes("Bar") && !value.includes("Box");
      });

      deletablePolys.forEach(function (element) {
        ggbObject.deleteObject(element);
      });
    }

    //breaks an integer down into place values, returns ones, tens, hundreds, etc
    function pulverize(number) {
      const numArray = number.toString().split("").map(Number).reverse();
      return numArray;
    }

    function howManyPoints() {
      const totalNumArray = [];
      const allPoints = ggbObject.getAllObjectNames("point");
      let count = 0;
      for (let i = 0, L = numRegions; i < L; i++) {
        allPoints.forEach(function (element) {
          if (element.startsWith(regions[i] + "Point") && ggbObject.getVisible(element) == true) {
            count++;
          }
        });
        totalNumArray.push(count);
        count = 0;
      }
      return totalNumArray;
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

    function updateAlgorithmText(textStep = "0") {
      //show the vinculum and plus sign
      ggbObject.setVisible("f", true);
      ggbObject.setVisible("text11", true);
      //get all pertinent numbers and turn them into arrays
      const number1 = ggbObject.getValue("number");
      const number2 = ggbObject.getValue("number2");
      const num1Array = pulverize(number1);
      const num2Array = pulverize(number2);
      const answerArray = howManyPoints();

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

    //creates max two rows of five with this configuration, but does contain spacer parameter Math.floor(j/10) in line 67
    // I DON'T LOVE THE POINT NAMING HERE!!!!!!!!!!!!!!!
    function popul8() {
      reset();
      //pull data from inputs (GGB or Platform)
      const number1 = ggbObject.getValue("number");
      const number2 = ggbObject.getValue("number2");
      const multiplier = ggbObject.getValue("multiplier");

      //break down into digits
      const num1Array = pulverize(number1);
      const num2Array = pulverize(number2);

      //for as many multiples exist
      for (let k = 0; k < multiplier; k++) {
        //for as many regions as there are place values defined
        if (num1Array.length <= numRegions && num2Array.length <= numRegions) {
          //need error messaging to allow higher than 9 in a region
          for (let i = 0, L = num1Array.length; i < L; i++) {
            //create a point in that region named by the region name (from array above) and attached to that box
            for (let j = 0, K = num1Array[i]; j < K; j++) {
              if (i == 0) {
                ggbObject.evalCommand(
                  regions[i] + "Point" + (j + 1) + "Set" + (k + 1) + "=PointIn(box" + (i + 1) + ")"
                );
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

    //this function creates a draggable ten frame
    function bundle() {
      organize();
      const totalNumArray = howManyPoints();
      totalNumArray.every(function (element, i) {
        //highlight one or more tens frames
        if (element >= 10 && i <= numRegions - 1) {
          const x1 = ggbObject.getXcoord(regions[i] + "Point1"); //change this to be the first point showing
          const y1 = ggbObject.getYcoord(regions[i] + "Point1"); //change this to be the first point showing
          const x2 = x1 + 4;
          const y2 = y1 - 1;
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
          const first = totalNumArray[i];
          const second = totalNumArray[i + 1];
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
      const selectedItemRegion = selectedItem.replace(/(Point)\d+|(TensFrame)/g, "");
      //gets the index of the region from the const array "regions"
      const regionNum = regions.indexOf(selectedItemRegion);
      console.log(selectedItem, selectedItemRegion, regionNum);
      const bundling =
        ggbObject.getXcoord(regions[regionNum] + "TenFrameCorner") <
          (numRegions - regionNum - 1) * ggbObject.getValue("sectionWidth") && selectedItem.includes("Frame");
      const unbundling =
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
          // eslint-disable-next-line no-case-declarations
          const midPointX = ggbObject.getValue("sectionWidth") * (numRegions - regionNum - 2 + 0.5);
          ggbObject.evalCommand(
            regions[regionNum + 1] +
              "Point" +
              (totalNumArray[regionNum + 1] + 1) +
              "=PointIn(box" +
              (regionNum + 2) +
              ")"
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
              // eslint-disable-next-line brace-style
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

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function showSelection(target) {
      const thingsToIgnore = ["instructionsIcon", "xIcon"];
      if (thingsToIgnore.includes(target)) {
        return;
      }
      // delete previous selection objects
      const allObjects = ggbObject.getAllObjectNames();
      for (let i = 0, L = allObjects.length; i < L; i++) {
        const obj = allObjects[i];
        if (ggbObject.getCaption(obj) === "selectionIndicator") {
          ggbObject.deleteObject(obj);
        }
      }
      if (!target) {
        return;
      }
      // create selection indicator object depending on type
      if (isPoly(target)) {
        const vertString = ggbObject.evalCommandGetLabels("Vertex(" + target + ")");
        const vertArr = vertString.split(",");
        hidePieces(vertArr);
        const selPoly = ggbObject.evalCommandGetLabels("Polygon({" + vertString + "})");
        styleSelection(selPoly, target);
      } else if (ggbObject.getObjectType(target) === "circle") {
        const newName = target.concat("selection");
        ggbObject.evalCommand(newName + " = " + target);
        styleSelection(newName, target);
      }
    }

    function styleSelection(obj, originalObj) {
      const color = [0, 0, 0];
      ggbObject.setFixed(obj, false, false);
      ggbObject.setColor(obj, ...color);
      ggbObject.setFilling(obj, 0);
      ggbObject.setLineThickness(obj, 8);
      ggbObject.setLayer(obj, ggbObject.getLayer(originalObj) + 1);
      ggbObject.setCaption(obj, "selectionIndicator");
    }

    function hidePieces(arr) {
      for (let i = 0, L = arr.length; i < L; i++) {
        const obj = arr[i];
        ggbObject.setVisible(obj, false);
        ggbObject.setCaption(obj, "selectionIndicator");
      }
    }

    function isPoly(thing) {
      const polyTypes = ["polygon", "triangle", "quadrilateral", "pentagon", "hexagon"];
      return polyTypes.includes(ggbObject.getObjectType(thing));
    }

    function defineButtonClickScripts() {
      return {
        ggbButton1: function () {
          enableButton(1, false);
          enableButton(2, true);
          enableButton(3, false);
          enableButton(4, true);
          updateAlgorithmText(1);
          popul8();
          ggbReadText("What happens when the button is clicked?");
        },
        ggbButton2: function () {
          updateAlgorithmText(2);
          organize();
          enableButton(1, false);
          enableButton(2, false);
          enableButton(4, true);
        },
        ggbButton3: function () {
          updateAlgorithmText(3);
          bundle();
          enableButton(1, false);
          enableButton(2, false);
          enableButton(4, true);
        },
        ggbButton4: function () {
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
        },
        ggbButton5: function () {},
      };
    }

    function defineKeyboardInstructions(obj) {
      // takes a GGB object name as an argument, returns its keyboard text.
      const keyboardInstructions = {
        // A: "Press the arrow keys to move this point.", // example for a point
        ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to populate." : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to organize." : unavailableButtonText,
        ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to bundle." : unavailableButtonText,
        ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to reset." : unavailableButtonText,
        ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to _____." : unavailableButtonText,
      };
      return keyboardInstructions[obj];
    }

    function clientFunction(a) {
      const clientTarget = a.target;
      switch (a.type) {
        case "select":
          selectedItem = clientTarget;
          // // required addition 4
          // on select always: update the keyboard instructions
          updateKeyboardInstructions(clientTarget);
          // if input box selected, show the keyboard instructions temporarily
          // eslint-disable-next-line no-var
          var forceKeyboardInstructions = ["textfield"];
          if (forceKeyboardInstructions.includes(ggbObject.getObjectType(clientTarget))) {
            ggbObject.setValue("showKeyboardInstructionsTemporarily", true);
          }
          if (clientTarget.includes("Frame")) {
            showSelection(clientTarget);
          }
          break;
        case "dragEnd":
          console.log("dragged");
          showSelection();
          // eslint-disable-next-line no-case-declarations
          const totalNumArray = howManyPoints();
          performSwap(totalNumArray);
          break;
        case "deselect":
          showSelection();
          break;
      }
    }

    function clickListenerFunction(a) {
      // switch (a) {}
    }

    function keyit(event) {
      console.log(event);
      console.log(selectedItem);
      switch (true) {
        case event.code.includes("ArrowLeft") && selectedItem.includes("Frame"):
          totalNumArray = howManyPoints();
          performSwap(totalNumArray);
          break;
        case event.code.includes("ArrowRight") && selectedItem.includes("Point"):
          totalNumArray = howManyPoints();
          performSwap(totalNumArray);
      }
    }

    // add new stuff above this line
  });

  /*
   * IGNORE BELOW
   */
  function loadUtils() {
    function parseJS(JSString) {
      return Function("" + JSString)();
    }
    if (!window.didUtils || !window.didUtils.setupGGB) {
      return fetch("https://cdn.digital.greatminds.org/did-utils/latest/index.js", {
        cache: "no-cache",
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (codingText) {
          parseJS(codingText);
        })
        .then(function () {
          return window.didUtils.setupGGB;
        });
    }
    return Promise.resolve(window.didUtils.setupGGB);
  }
}

// ISSUE: Bundle tens frams can be dragged outside the PVC (currently snaps back, but should be constrained)

// TODO: Could: Instead of using kerning and phantom characters in the convertArraysIntoStrings function to reduce array colum width, find a way to set column width, if possible

/* eslint-disable id-length */
/* eslint-disable no-mixed-operators */

// PVC appears in grades 2 through 6
// this PVC covers population for addition and multiplication at the moment

// requires PVC that has sectionWidth (default 6), sectionHeight (default 15), box# regions in order from right to left and
//  starter points at the beginning of each region that are named StarterPoint# in order right to left
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
      // editXML,
      // selectedObject,
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
    let preXCoord = 0;
    let preYCoord = 0;
    let previousSelectedObject = "";
    let regionUnbundledFrom = "";
    // let selectedPointDeleted = false;
    let selectedObject = "";
    let unbundling = false;
    let snapBack = false;

    // used for snapping back points and bundle polygons if the target region is full
    const regionFullNum = 41;
    // used for scaling the algorithm text box if students type in inputs resulting in text11 going off the screen. Redefined in cases of updateAlgorithm
    const boxScale = 1;

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

    // finds x and y coords of the start points
    const starterX = starterArray.map(function (element) {
      return ggbObject.getXcoord(element);
    });
    const starterY = starterArray.map(function (element) {
      return ggbObject.getYcoord(element);
    });
    let carryArray = [];
    // let carryArray = [
    //     "\\phantom{\\scriptsize{1}}",
    //     "\\phantom{\\scriptsize{1}}",
    //     "\\phantom{\\scriptsize{1}}",
    //     "\\phantom{\\scriptsize{1}}",
    //     "\\phantom{\\scriptsize{1}}",
    //     "\\phantom{\\scriptsize{1}}",
    //     "\\phantom{\\scriptsize{1}}",
    // ];
    // selectedObject,
    let oldNum;
    let oldNum2;
    let unbundleHotKeyPressed = false;

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

    registerSafeObjectUpdateListener("number", quickChange);
    registerSafeObjectUpdateListener("number2", quickChange);
    registerSafeObjectUpdateListener("FirstNumber", quickChange);
    registerSafeObjectUpdateListener("SecondNumber", quickChange);
    // registerSafeObjectUpdateListener("AlgorithmTextCorner", scaleTextBox);

    ggbObject.registerAddListener(hideSegments);

    function updateReadText() {
      let regionString = "";
      for (let i = 0, L = 6; i < L; i++) {
        if (i === L - 1) {
          regionString = regionString + "and " + regions[i];
        } else {
          regionString = regionString + regions[i] + ", ";
        }
      }
      ggbObject.setTextValue("AAppletStatus", "A place value chart shows " + regionString + ".");
    }

    function quickChange() {
      // console.log("In quickChange - boxScale:", boxScale);
      // Used to check if the value has changed
      const newNum = ggbObject.getValue("number");
      const newNum2 = ggbObject.getValue("number2");
      // console.warn(
      //   "in Quick change - Are there valid inputs? newNum: %o, newNum2: %o, validateInputs: %o",
      //   newNum,
      //   newNum2,
      //   validateInputs()
      // );

      // Reset the applet only if the student changes one of the input values
      if (newNum !== oldNum || newNum2 !== oldNum2) {
        updateAlgorithmText(0);
        ggbObject.setVisible("f", false);
        ggbObject.setVisible("text11", false);
        carryArray = [];
        // carryArray = [
        //   "\\phantom{\\scriptsize{1}}",
        //   "\\phantom{\\scriptsize{1}}",
        //   "\\phantom{\\scriptsize{1}}",
        //   "\\phantom{\\scriptsize{1}}",
        //   "\\phantom{\\scriptsize{1}}",
        //   "\\phantom{\\scriptsize{1}}",
        //   "\\phantom{\\scriptsize{1}}",
        // ];
        reset();

        if (validateInputs()) {
          enableButton(1, true);
        } else {
          enableButton(1, false);
        }
        enableButton(2, false);
        enableButton(3, false);
        enableButton(4, true);

        oldNum = newNum;
        oldNum2 = newNum2;
      }
    }

    // Set maximum allowed number for the student inputs nad check whether the input can be added with the algorithm
    function validateInputs() {
      ggbObject.setValue("maxAllowedNumber", 4999999);
      const newNum = ggbObject.getValue("number");
      const newNum2 = ggbObject.getValue("number2");

      const numValid = ggbObject.getValue("numberIsValid") === 1 && Number.isInteger(newNum);
      const num2Valid = ggbObject.getValue("number2IsValid") === 1 && Number.isInteger(newNum2);
      const bothValid = numValid && num2Valid;
      return bothValid;
    }

    function hideSegments(added) {
      if (ggbObject.getObjectType(added) === "segment") {
        ggbObject.setVisible(added, false);
        ggbObject.setFixed(added, true, false);
        // console.log("XML:", ggbObject.getXML(added));
      }
    }

    function reset() {
      // console.log("selectedObject in reset", selectedObject);
      previousSelectedObject = selectedObject;
      // console.log("preResetSelObj:", previousSelectedObject);

      ggbObject.setAnimating();
      ggbObject.setValue("time", 0);
      const deletablePoints = ggbObject.getAllObjectNames("point").filter(function (value) {
        return (
          !value.includes("Starter") &&
          !value.includes("corner") &&
          !value.includes("Bar") &&
          !value.includes("Export") &&
          !value.includes("Icon") &&
          !value.includes("Instructions") &&
          !value.includes("Algorithm")
        );
      });
      deletablePoints.forEach(function (element) {
        ggbObject.deleteObject(element);
        // console.log("element: %o", element);
        // If a point was selected and will now be deleted, flag that so it can be later re-selected after points are recreated and organized
        if (element === previousSelectedObject) {
          // selectedPointDeleted = true;
          // console.log("selectedObject (Point) was deleted and deselected.");
        }
      });
      // console.log(
      //   "selectedObject in reset - after deletablePoints for loop. If selectedObject was a point, it should be empty:",
      //   selectedObject
      // );

      const deletablePolys = ggbObject.getAllObjectNames("quadrilateral").filter(function (value) {
        return !value.includes("box") && !value.includes("Bar") && !value.includes("Box");
      });

      deletablePolys.forEach(function (element) {
        ggbObject.deleteObject(element);
        // if (element === preResetSelObj) {
        //   selectedPolyDeleted = true;
        //   console.log("selectedObject (Poly) was deleted and deselected.");
        // }
      });
    }

    // breaks an integer down into place values, returns ones, tens, hundreds, etc
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
          if (element.startsWith(regions[i] + "Point") && ggbObject.getVisible(element) === true) {
            count++;
          }
        });
        totalNumArray.push(count);
        count = 0;
      }
      return totalNumArray;
    }

    // move all of the points into the fewest number of rows of 5
    function organize() {
      // console.log(
      //   "selectedObject in organize: %o, regionUnbundledFrom: %o",
      //   selectedObject,
      //   regionUnbundledFrom
      // );
      let lastPointInNewRegion = "";
      let totalNumArray = howManyPoints();
      reset();
      // console.log(
      //   "selectedObject in organize - after reset",
      //   selectedObject
      // );

      // Ex: i = 1 for Ones region (new region); Ex: j = 15 for OnePoint15 (New name)
      for (let i = 0, L = totalNumArray.length; i < L; i++) {
        // create a point in that region named by the region name (from array above) and attached to that box
        for (let j = 0, K = totalNumArray[i]; j < K; j++) {
          if (i === 0) {
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

          // flag the last point created in the region so it can be selected if points are unbundling
          let lastPointsAllRegions = [];
          const isLastElementInARegion = j === K - 1;
          const regionUnbundlingTo = regionUnbundledFrom - 1;
          const isInRegionUnbundlingTo = i + 1 === regionUnbundlingTo;
          const currentPoint = regions[i] + "Point" + (j + 1);
          // console.log(
          //   "currentPoint: %o, isLastElementInARegion: %o, isInRegionUnbundlingTo: %o, current region of point (i+1): %o, regionUnbundlingTo: %o",
          //   currentPoint,
          //   isLastElementInARegion,
          //   isInRegionUnbundlingTo,
          //   i + 1,
          //   regionUnbundlingTo
          // );

          if (isLastElementInARegion) {
            lastPointsAllRegions.push(currentPoint);
            // console.log("lastPoint added to array:", currentPoint);
          }
          lastPointsAllRegions.forEach(function (element) {
            if (isInRegionUnbundlingTo) {
              lastPointInNewRegion = element;
              // console.log("lastPointInNewRegion:", lastPointInNewRegion);
            }
          });
          lastPointsAllRegions = [];
        }
      }
      totalNumArray = howManyPoints();
      // console.log(totalNumArray);
      totalNumArray.every(function (element) {
        if (element >= 10) {
          enableButton(3, true);
          return false;
        }
        enableButton(3, false);
        return true;
      });

      // const pointDeleted =
      //   selectedPointDeleted &&
      //   ggbObject.getObjectType(previousSelectedObject) === "point";
      // console.log(
      //   "Points have been re-created and the previously-selected point is selected. Please. I hope.\\snapBack: %o, pointDeleted: %o, preResetSelObj: %o, lastPointInNewRegion: %o",
      //   snapBack,
      //   pointDeleted,
      //   previousSelectedObject,
      //   lastPointInNewRegion
      // );
      // if (snapBack || (preResetSelObj !== "" && pointDeleted)) {
      // If a point is unbundling, select the last point in region. If a point was selected but was deleted during reset(), re-select it here
      snapBack
        ? ggbObject.evalCommand("SelectObjects(" + previousSelectedObject + ")")
        : ggbObject.evalCommand("SelectObjects(" + lastPointInNewRegion + ")");
      if (snapBack) {
        // console.log(
        //   "SnapBack detected. SelectObject:",
        //   previousSelectedObject
        // );
      } else {
        // console.log(
        //   "Unbundling or Bundling detected. SelectObject:",
        //   lastPointInNewRegion
        // );
      }
      // }
      snapBack = false;
      // selectedPointDeleted = false;
    }

    function updateAlgorithmText(textStep = "0") {
      console.log("In updateAlgorithm - textStep:", textStep);

      // show the vinculum and plus sign
      ggbObject.setVisible("f", true);
      ggbObject.setVisible("text11", true);
      // get all pertinent numbers and turn them into arrays
      const number1 = ggbObject.getValue("number");
      const number2 = ggbObject.getValue("number2");
      const num1Array = pulverize(number1);
      const num2Array = pulverize(number2);
      let answerArray = howManyPoints();

      // Note: \colsep adjusts space/separation to the beginning of the table column.
      // FIXME: Find a way to set the horizontal width of the column - currently using phantom characters - not fun!
      const beginArrayString = "\\setlength{\\tabcolsep}{-3pt}\\begin{array}{} ";

      console.log("answerArray before", answerArray);
      // removes preceeding zeros from answerArray when there are no points in the region
      if (textStep === 2) {
        removeZeros();
      }
      console.log("answerArray after", answerArray);

      // if one of the arrays is shorter than the other, add empty elements to make them align correctly
      switch (true) {
        case num1Array.length > num2Array.length:
          while (num1Array.length !== num2Array.length) {
            num2Array.push("");
          }
          break;
        case num1Array.length < num2Array.length:
          while (num1Array.length !== num2Array.length) {
            num1Array.push("");
          }
          break;
        default:
          break;
      }

      // set up each of the strings that will be used in the matrix
      let firstNumberString = "";
      let secondNumberString = "";
      let carryString = "";
      let answerString = "";

      // Allows extra spaces to be added before num1 and num2 when the full answer string is visible
      const showShortStrings = textStep === 1;

      // change arrays into strings with appropriate columns and commas
      firstNumberString = convertArraysIntoStrings(num1Array);
      secondNumberString = convertArraysIntoStrings(num2Array);
      answerString = convertArraysIntoStrings(answerArray);
      if (textStep === 3) {
        makeCarryArray();
      }
      carryString = convertArraysIntoStrings(carryArray, false);

      function makeCarryArray() {
        console.log("In makeCarryArray. answ:", answerArray);
        const length = answerArray.length;
        const carryString = "\\phantom{\\scriptsize{1}}";
        // add as many phantom 1's as there are elements in answerArray
        // for (let i = 0; carryArray.length < length; i++) {
        //   carryArray.push(carryString);
        // }
        console.log("carry:", carryArray);
      }

      // // TEST
      // // figure out where something has been carried and append that to the carry string where necessary
      // answerArray.forEach(function (element, index) {
      //   switch (true) {
      //     case num1Array[index] + num2Array[index] < element &&
      //       num1Array[index] + num2Array[index] < 10 &&
      //       index === answerArray.length - 1:
      //       carryString = "\\scriptsize{1}" + carryString;
      //       break;
      //     case num1Array[index] + num2Array[index] < element &&
      //       num1Array[index] + num2Array[index] < 10:
      //       carryString = "\\scriptsize{1} &" + carryString;
      //       break;
      //     default:
      //       carryString = "\\phantom{\\scriptsize{1}} &" + carryString;
      //       break;
      //   }
      //   console.log(carryString);
      // });

      // set the value of the text string based on which step of the addition process you're on
      switch (textStep) {
        // reset, starting point, no text
        case 0:
          // console.warn("Case 0. alg Text: ", "");
          ggbObject.setTextValue("algorithmText", "");
          break;
        // show first two addends only, first button press
        case 1:
          ggbObject.setTextValue(
            "algorithmText",
            "\\setlength{\\tabcolsep}{-3pt}\\begin{array}{} " +
              firstNumberString +
              " \\\\" +
              secondNumberString +
              " \\\\	\\end{array}"
          );
          break;
        // show sum of the numbers when putting dots together in a region, second button press
        case 2:
          {
            // set text value, then check if the text goes off screen, if so rescale text to fit
            // console.log("answer array in case 2", answerArray);
            // console.log("answer array in case 2 - after removeZeros", answerArray);

            ggbObject.setTextValue(
              "algorithmText",
              beginArrayString +
                firstNumberString +
                " \\\\" +
                secondNumberString +
                " \\\\ \\\\ \\phantom{\\scriptsize{1}} \\\\" +
                answerString +
                " \\\\  \\end{array}"
            );
          }
          break;
        // bundling - this one's fun, changes a lot, third button press AND performSwap
        case 3:
          // set text value, then check if the text goes off screen, if so rescale text to fit
          // console.log("answer array in case 3", answerArray);

          // removeZeros();

          ggbObject.setTextValue(
            "algorithmText",
            beginArrayString +
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

      // removes leftmost (preceeding) zero's from answerArray
      function removeZeros() {
        let tempArray = [];
        const reversedArray = answerArray.reverse();
        console.log("reversedArray with zeros", reversedArray);

        let numZerosToErase = 0;
        for (let index = 0, L = reversedArray.length; index < L; index++) {
          const element = reversedArray[index];
          if (element === 0) {
            console.log("finding elements to erase: element:%o, index: %o", element, index);
            numZerosToErase++;
          } else {
            break;
          }
        }
        console.log("numZerosToErase", numZerosToErase);
        console.log("reversedArray,", reversedArray);
        console.log("reversedArray,", reversedArray.slice(numZerosToErase, reversedArray.length));
        tempArray = [...reversedArray.slice(numZerosToErase, reversedArray.length)];
        // tempArray = [...reversedArray.slice(numZerosToErase, reversedArray.length)];
        // tempArray = [...reversedArray.slice(numZerosToErase, reversedArray.length)];
        console.log("reversedArray without zeros", tempArray);
        answerArray = tempArray.reverse();
        const unReversedArray = answerArray;

        // answerArray = [...reversedArray.slice(numZerosToErase, reversedArray.length)];

        console.log("unReversedArray", unReversedArray);
        // answerString = convertArraysIntoStrings(answerArray);

        // console.log("NEW answerArray", answerArray, "NEW answerString", answerString);
      }

      // concatenate the numbers such that each single digit number gets a column in the matrix
      // add a comma where necessary, and don't add an empty column (&) at the end
      function convertArraysIntoStrings(numArray, commas = "true") {
        // TEST indentedString

        let nameString = "";
        let kernString = "";
        const kernedNumArray = [];
        // Creates a phantom comma height that will be concatinated with each number string so that the Carry string (1's) always align with the vinculum bar
        const phantomCommaStr = "\\vphantom{,}";

        // numArray.forEach(function (element, index) {
        //   kernedNumArray.push(kernString + element);
        // });

        numArray.forEach(function (element) {
          // kern each string so that there is less space between columns
          kernString = "\\kern{-6pt}";

          // If element in the string is one character long, add a phantom character in front so that the columns don't bounce

          if (element.toString().length === 1) {
            kernString = "\\phantom{1}" + kernString;
          }
          kernedNumArray.push(kernString + element);
        });

        // Used to reduce the width between array columns
        // TODO: Find a way to set the width of the column while also right justifying. Currently using kerning and phantom characters
        kernedNumArray.forEach(function (elementKern, indexKern) {
          if (commas) {
            // const indentString = "";
            const numTotalDigits = answerArray.length;
            const addSpaceToBeginning = !showShortStrings && kernedNumArray.length - 1 < numTotalDigits;
            const numSpacesToAdd = numTotalDigits - (kernedNumArray.length - 1) - 1;
            // const numSpacesToAdd = answerArray.length - kernedNumArray.length;
            switch (true) {
              case indexKern === kernedNumArray.length - 1:
                nameString = nameString + kernedNumArray[kernedNumArray.length - indexKern - 1].toString();

                // aligns the digits to the right by adding space ("&" signs) to the front of the string
                if (addSpaceToBeginning) {
                  for (let i = 0, L = numSpacesToAdd; i < L; i++) {
                    nameString = "&".concat(nameString);
                  }
                }

                break;
              case indexKern === kernedNumArray.length - 4:

              // eslint-disable-next-line no-fallthrough
              case indexKern === kernedNumArray.length - 7:
                if (
                  kernedNumArray[kernedNumArray.length - indexKern - 1].toString() !== "" &&
                  kernedNumArray[kernedNumArray.length - indexKern - 1].toString() !== kernString
                ) {
                  nameString =
                    nameString + kernedNumArray[kernedNumArray.length - indexKern - 1].toString() + "," + "&";
                } else {
                  nameString = nameString + kernedNumArray[kernedNumArray.length - indexKern - 1].toString() + "&";
                }

                break;

              case indexKern === kernedNumArray.length - 3:
              case indexKern === kernedNumArray.length - 6:
                nameString = nameString + kernedNumArray[kernedNumArray.length - indexKern - 1].toString() + "&";

                break;
              case indexKern < kernedNumArray.length - 1:
                nameString = nameString + kernedNumArray[kernedNumArray.length - indexKern - 1].toString() + "&";

                break;
              default:
                break;
            }
            if (!nameString.includes(",")) {
              nameString = nameString + phantomCommaStr;
            }
          } else {
            // Carry String, no commas
            switch (true) {
              case indexKern === kernedNumArray.length - 1:
                nameString = nameString + kernedNumArray[kernedNumArray.length - indexKern - 1].toString();
                // console.log("Carry string, no commas. 1st case", nameString);
                break;
              case indexKern < kernedNumArray.length - 1:
                nameString = nameString + kernedNumArray[kernedNumArray.length - indexKern - 1].toString() + "&";
                // console.log("Carry string, no commas. 2nd case", nameString);
                break;
              default:
                break;
            }
          }
        });
        // console.log("nameString", nameString);
        return nameString;
      }

      // function convertArraysIntoStrings(numArray, commas = "true") {
      //   // TEST indentedString
      //   let nameString = "";
      //   numArray.forEach(function (element, index) {
      //     if (commas) {
      //       // const indentString = "";
      //       const numTotalDigits = ggbObject.getValue("requiredRegions");
      //       const addSpaceToBeginning =
      //         !showShortStrings && numArray.length - 1 < numTotalDigits;
      //       const numSpacesToAdd = numTotalDigits - (numArray.length - 1);
      //       let ampArray = [];
      //       switch (true) {
      //         case index === numArray.length - 1:
      //           nameString =
      //             nameString + numArray[numArray.length - index - 1].toString();
      //           console.log(
      //             "case last digit from the right. index:%o, numArray[index]:%o, numArray:%o, nameString:%o",
      //             index,
      //             numArray[index],
      //             numArray,
      //             nameString
      //           );
      //           // /COME BACK TO THIS ///////////////////////////////////////////////////////////////////////////

      //           // if numArray.length - 1 is less than numTotalDigits, push "&" signs to ampArray. loop (as many as numSpacesToAdd) - convert it to a string
      //           if (addSpaceToBeginning) {
      //             for (let i = 0, L = numSpacesToAdd; i < L; i++) {
      //               // ampArray.push("&");
      //               // nameString += "&";
      //               nameString = "&".concat(nameString);
      //             }
      //             // indentString = ampArray.toString().concat(nameString);
      //             // nameString = indentString;
      //           }
      //           console.warn(
      //             "nameString: %o, ampArray: %o ",
      //             nameString,
      //             ampArray
      //           );
      //           ampArray = [];
      //           break;
      //         case index === numArray.length - 4:

      //         // eslint-disable-next-line no-fallthrough
      //         case index === numArray.length - 7:
      //           if (numArray[numArray.length - index - 1].toString() !== "") {
      //             nameString =
      //               nameString +
      //               numArray[numArray.length - index - 1].toString() +
      //               "," +
      //               "&";
      //           } else {
      //             nameString =
      //               nameString +
      //               numArray[numArray.length - index - 1].toString() +
      //               "&";
      //           }
      //           console.log(
      //             "case 4th to last digit or 7th to last digit from the right (add commas). index:%o, numArray[index]:%o, numArray:%o, nameString:%o",
      //             index,
      //             numArray[index],
      //             numArray,
      //             nameString
      //           );
      //           break;
      //         case index < numArray.length - 1:
      //           nameString =
      //             nameString +
      //             numArray[numArray.length - index - 1].toString() +
      //             "&";
      //           console.log(
      //             "case other than first digit, or comma digit. index:%o, numArray[index]:%o, numArray:%o, nameString:%o",
      //             index,
      //             numArray[index],
      //             numArray,
      //             nameString
      //           );
      //           break;
      //         default:
      //           break;
      //       }
      //     } else {
      //       switch (true) {
      //         case index === numArray.length - 1:
      //           nameString =
      //             nameString + numArray[numArray.length - index - 1].toString();
      //           break;
      //         case index < numArray.length - 1:
      //           nameString =
      //             nameString +
      //             numArray[numArray.length - index - 1].toString() +
      //             "&";
      //           break;
      //         default:
      //           break;
      //       }
      //     }
      //   });
      //   return nameString;
      // }
    }

    // creates max two rows of five with this configuration, but does contain spacer parameter Math.floor(j/10) in line 67
    // I DON'T LOVE THE POINT NAMING HERE!!!!!!!!!!!!!!!
    function popul8() {
      reset();
      // pull data from inputs (GGB or Platform)
      const number1 = ggbObject.getValue("number");
      const number2 = ggbObject.getValue("number2");
      const multiplier = ggbObject.getValue("multiplier");
      // break down into digits
      const num1Array = pulverize(number1);
      const num2Array = pulverize(number2);

      // for as many multiples exist
      for (let k = 0; k < multiplier; k++) {
        // for as many regions as there are place values defined
        if (num1Array.length <= numRegions && num2Array.length <= numRegions) {
          // need error messaging to allow higher than 9 in a region
          for (let i = 0, L = num1Array.length; i < L; i++) {
            // create a point in that region named by the region name (from array above) and attached to that box
            for (let j = 0, K = num1Array[i]; j < K; j++) {
              if (i === 0) {
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
          // if we have a second number
          for (let i = 0, L = num2Array.length; i < L; i++) {
            // create a point in that region named by the region name (from array above) and attached to that box
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

    // makes the points into the desired style
    function prettyPoints(pointName, regionNumber = 0) {
      ggbObject.setPointStyle(pointName, 0);
      ggbObject.setPointSize(pointName, 7);
      // ggbObject.setPointSize(pointName, 8);
      ggbObject.setVisible(pointName, true);
      ggbObject.setLayer(pointName, 1);
      // console.log("Points set to 1");
      ggbObject.evalCommand("SetColor(" + pointName + ',"' + regionColors[regionNumber] + '")');
    }

    // this function creates a draggable ten frame
    function bundle() {
      organize();
      const totalNumArray = howManyPoints();
      totalNumArray.every(function (element, i) {
        // highlight one or more tens frames

        // // If the region being bundled TO has room, allow it to bundle, otherwise skip over the bundle and allow the next ten frame to bundle
        // for (let i = 0, L = totalNumArray.length; i < L; i++) {
        //   const element = totalNumArray[i];
        //   console.log("element in for loop of Bundling case", element);
        //   if (element > 41) {
        //     regionNum++;
        //   }
        // }

        // if (totalNumArray[regionNum + 1] < 41) {

        const nextRegionIsFull = totalNumArray[i + 1] > regionFullNum - 1;
        // console.log(
        //   "In Bundle. Check if next region is full!! element: %o, nextRegionIsFull: %o",
        //   element,
        //   nextRegionIsFull
        // );
        const x1 = ggbObject.getXcoord(regions[i] + "Point1");
        // change this to be the first point showing
        const y1 = ggbObject.getYcoord(regions[i] + "Point1");
        const x2 = x1 + 4;
        const y2 = y1 - 1;
        if (element >= 10 && i <= numRegions - 1 && !nextRegionIsFull) {
          // change this to be the first point showing
          // makes draggable tens frame and sets properties
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
          // console.log(
          //   "frame set to",
          //   ggbObject.getLayer(regions[i] + "TensFrame")
          // );
          ggbObject.deleteObject("tabOrder");
          ggbObject.evalCommand(
            "tabOrder={ggbButton3," + regions[i] + "TensFrame,ggbButton3,ggbButton4,ggbButton1,ggbButton2}"
          );
          // copies tens frame to make outline and sets properties
          ggbObject.evalCommand(regions[i] + "TensFrameOutline=" + regions[i] + "TensFrame");
          ggbObject.setColor(regions[i] + "TensFrameOutline", 0, 0, 0);
          ggbObject.setFilling(regions[i] + "TensFrameOutline", 0);
          ggbObject.setVisible(regions[i] + "TensFrameOutline", true);

          ggbObject.setFixed(regions[i] + "TensFrameOutline", true, false);
          ggbObject.setLayer(regions[i] + "TensFrameOutline", 3);
          // console.log(
          //   "outline set to",
          //   ggbObject.getLayer(regions[i] + "TensFrameOutline")
          // );

          // makes corner so that points can be made based off of tens frame position
          ggbObject.evalCommand(regions[i] + "TenFrameCorner=Corner(" + regions[i] + "TensFrameOutline,1)");
          ggbObject.setVisible(regions[i] + "TenFrameCorner", false);

          // create points attached to that tens frame and sets properties
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
            // console.log(
            //   "points set to",
            //   ggbObject.getLayer("Moving" + regions[i] + "Point" + (j + 1))
            // );

            ggbObject.setFixed("Moving" + regions[i] + "Point" + (j + 1), true, false);
            ggbObject.setVisible(regions[i] + "Point" + (j + 1), false);
          }
          enableButton(3, false);
          // changes number of points in each region
          const first = totalNumArray[i];
          const second = totalNumArray[i + 1];
          totalNumArray[i] = first - 10;
          totalNumArray[i + 1] = second + 1;
          // leaves the loop early
          return false;
        }
        // allows loop to continue
        // eslint-disable-next-line no-else-return
        else {
          // console.log("bundle not in region");
        }

        return true;
      });
      // make all visible points nonselectable so students can't move dots before completing the bundle
      makeAllPointsSelectable(false);
    }

    // bundles or unbundles, based on the case
    function performSwap(totalNumArray) {
      // console.log("in performSwap", selectedObject, totalNumArray);
      // figure out the type of point or tens frame that was grabbed by removing all but the region
      const selectedObjectRegion = selectedObject.replace(/(Point)\d+|(TensFrame)/g, "");
      // gets the index of the region from the const array "regions"
      const regionNum = regions.indexOf(selectedObjectRegion);
      const bundling =
        ggbObject.getXcoord(regions[regionNum] + "TenFrameCorner") <
          (numRegions - regionNum - 1) * ggbObject.getValue("sectionWidth") && selectedObject.includes("Frame");
      unbundling =
        (selectedObject.includes("Point") &&
          ggbObject.getXcoord(selectedObject) > (numRegions - regionNum) * ggbObject.getValue("sectionWidth")) ||
        unbundleHotKeyPressed;

      switch (true) {
        // moving tenframe (bundle)
        case bundling:
          // hide old tenframe
          for (let j = 0, K = 10; j < K; j++) {
            ggbObject.setVisible("Moving" + regions[regionNum] + "Point" + (j + 1), false);
          }

          ggbObject.setVisible(regions[regionNum] + "TensFrameOutline", false);
          ggbObject.setVisible(regions[regionNum] + "TensFrame", false);

          // create ten point in new region
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
          // carryArray.splice(regionNum + 1, 1, "\\scriptsize{1}");
          ggbObject.evalCommand(
            "SelectObjects(" + regions[regionNum + 1] + "Point" + (totalNumArray[regionNum + 1] + 1) + ")"
          );
          // reorganizes points after waiting half a second
          // During the pause don't allow points to be selectable, then reselectable after organized
          makeAllPointsSelectable(false);
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
            makeAllPointsSelectable(true);
          }, 500);
          // } else {
          //   console.log("Region Bundling TO is full. Snap back!");
          //   snapItBack();
          // }

          break;
        // moving point or hotkey (unbundle)
        case unbundling:
          // Used for re-selecting point after unbunding/organize is complete
          regionUnbundledFrom = regionNum + 1;

          // If the region being unbundled TO has room, allow it to unbundle, otherwise snap the point back
          if (totalNumArray[regionNum - 1] < regionFullNum) {
            // Do all the stuff that unbundling does

            // hides the point that was dropped in a new region
            ggbObject.setVisible(selectedObject, false);
            // creates ten new points
            for (let i = 0, L = 10; i < L; i++) {
              // if you pulled a tens point, it can only go in the ones region
              if (regionNum === 1) {
                ggbObject.evalCommand(
                  regions[regionNum - 1] +
                    "Point" +
                    (totalNumArray[regionNum - 1] + i + 1) +
                    "=PointIn(box" +
                    regionNum +
                    ")"
                );
              } else if (regionNum > 1) {
                // anything that's not a tens point needs to be able to unbundle again, so it needs two regions
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

              const tempYCoord = 2;
              // sets the coordinates of the new points - temporarily at the bottom for half a second until it's reorganized
              ggbObject.setCoords(
                regions[regionNum - 1] + "Point" + (totalNumArray[regionNum - 1] + i + 1),
                starterX[regionNum - 1] + (i % 5),
                // "- Math.floor(i / 5) - Math.floor(i / 10)" separates them into two stacks of 5
                tempYCoord - Math.floor(i / 5) - Math.floor(i / 10)
              );

              // make the points the right color, size, style
              prettyPoints(regions[regionNum - 1] + "Point" + (totalNumArray[regionNum - 1] + i + 1), regionNum - 1);
            }
            // update the array that tracks the number of points in each region
            totalNumArray = howManyPoints();
            updateAlgorithmText(3);
            enableButton(3, true);

            // Final clean up of points after a half-second pause
            snapBack = false;
            // During the pause don't allow points to be selectable, then reselectable after organized
            makeAllPointsSelectable(false);
            setTimeout(function () {
              organize();
              makeAllPointsSelectable(true);
            }, 500);
            break;
          } else {
            // console.log("Region Unbundling TO is full. Snap back!");
            snapItBack();
          }
      }
    }

    // If Region unbundling or bundling TO  is full, snap the point back to its previous location after a half-second delay
    function snapItBack() {
      snapBack = true;
      // During the pause don't allow points to be selectable, then reselectable after organized
      makeAllPointsSelectable(false);
      setTimeout(function () {
        // console.log("selectedObject in snap back", selectedObject);
        ggbObject.setCoords(selectedObject, preXCoord, preYCoord);
        // console.log(
        //   "selectedObject in snap back - after setCoords",
        //   selectedObject
        // );
        organize();
        makeAllPointsSelectable(true);
      }, 500);
    }

    // make all visible points selectable or nonSelectable. Pass a bool for selectability
    function makeAllPointsSelectable(bool) {
      const objectNames = ggbObject.getAllObjectNames();
      // const selectableBoolStr = bool.toString();
      // console.log("makePointsSelectable", bool);
      for (let i = 0, L = objectNames.length; i < L; i++) {
        if (
          !objectNames[i].includes("Starter") &&
          ggbObject.getVisible(objectNames[i]) === true &&
          ggbObject.getObjectType(objectNames[i]) === "point"
        ) {
          ggbObject.setFixed(objectNames[i], !bool, bool);
        }
      }
    }

    // capture the pre-unbundled coords so that the dot can be snapped back in place if a student tries to unbundle to a region that is already full
    function capturePreviousCoords(obj) {
      if (ggbObject.getObjectType(obj) === "point") {
        preXCoord = ggbObject.getXcoord(obj);
        preYCoord = ggbObject.getYcoord(obj);
        // console.log(selectedObject, preXCoord, preYCoord);
      }
    }

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    function defineButtonClickScripts() {
      return {
        ggbButton1() {
          enableButton(1, false);
          enableButton(2, true);
          enableButton(3, false);
          enableButton(4, true);
          updateAlgorithmText(1);
          popul8();
          makeAllPointsSelectable(false);
          ggbReadText("What happens when the button is clicked?");
        },
        ggbButton2() {
          updateAlgorithmText(2);
          organize();
          enableButton(1, false);
          enableButton(2, false);
          enableButton(4, true);

          makeAllPointsSelectable(true);
        },
        ggbButton3() {
          updateAlgorithmText(3);
          bundle();
          enableButton(1, false);
          enableButton(2, false);
          enableButton(4, true);
        },
        ggbButton4() {
          updateAlgorithmText(0);
          ggbObject.setVisible("f", false);
          ggbObject.setVisible("text11", false);

          carryArray = [];
          // carryArray = [
          //   "\\phantom{\\scriptsize{1}}",
          //   "\\phantom{\\scriptsize{1}}",
          //   "\\phantom{\\scriptsize{1}}",
          //   "\\phantom{\\scriptsize{1}}",
          //   "\\phantom{\\scriptsize{1}}",
          //   "\\phantom{\\scriptsize{1}}",
          //   "\\phantom{\\scriptsize{1}}",
          // ];
          reset();
          // only enable button if there are legit values in the input boxes
          if (validateInputs()) {
            enableButton(1, true);
          } else {
            enableButton(1, false);
          }
          enableButton(2, false);
          enableButton(3, false);
          enableButton(4, true);
        },
        ggbButton5() {},
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

    function clientFunction(clientEvent) {
      // console.log("clientFunction, a:", a);
      const clientTarget = clientEvent.target;
      switch (clientEvent.type) {
        case "select":
          selectedObject = clientTarget;
          // console.log("select", selectedObject);
          // capture coords of pre-unbundled point of potential snap-back
          capturePreviousCoords(selectedObject);
          break;
        case "mousedown":
          // setTimeout(function () {
          // console.warn("MouseDown", selectedObject);
          // if (
          //   selectedObject.includes("Frame") ||
          //   selectedObject.includes("Point")
          // ) {
          //   previousSelectedObject = selectedObject;
          // }
          // });
          // console.log("MouseDown", selectedObject);
          if (selectedObject.includes("Frame") || selectedObject.includes("Point")) {
            previousSelectedObject = clientTarget;
          }

          break;
        case "dragEnd":
          // console.log("dragged");

          // capture coords of pre-unbundled point of potential snap-back
          capturePreviousCoords(selectedObject);

          // eslint-disable-next-line no-case-declarations
          const totalNumArray = howManyPoints();

          // // make all points selectable when a tens frame is dragged to correct location
          // makeAllPointsSelectable(true);

          // console.log("performSwap called from dragEnd");
          performSwap(totalNumArray);
          preXCoord = 0;
          preYCoord = 0;

          // if(clientTarget.includes("Frame")){

          // }
          break;
        case "deselect":
          // setTimeout(function () {
          // console.log(
          //   "Deselect Is Happening! target:%o, obj: %o",
          //   a.target,
          //   selectedObject
          // );
          // });
          unbundleHotKeyPressed = false;
          // showSelection();
          // selectedObject = "";
          break;
      }
    }

    // eslint-disable-next-line no-unused-vars
    function clickListenerFunction(clicked) {
      // console.log("in clickListener");
      // switch (clicked) {}
    }

    function keyit(event) {
      // console.log("in keyit", event);
      // console.log(selectedObject);
      unbundleHotKeyPressed = false;
      let totalNumArray = [];
      switch (true) {
        case event.code.includes("ArrowLeft") && selectedObject.includes("Frame"):
          totalNumArray = howManyPoints();
          // console.log("performSwap called from Arrow Left");
          performSwap(totalNumArray);
          break;
        case event.code.includes("ArrowRight") && selectedObject.includes("Point"):
          totalNumArray = howManyPoints();
          // console.log("performSwap called from Arrow Right");
          performSwap(totalNumArray);
          break;
        case event.code === "KeyU":
          totalNumArray = howManyPoints();
          unbundleHotKeyPressed = true;
          // console.log("performSwap called from KeyU");
          performSwap(totalNumArray);
          break;
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

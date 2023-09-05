/* 
ISSUE: Bundle tens frams can be dragged outside the PVC (currently snaps back, but should be constrained)
ISSUE: Points that cannot be unbundled (i.e., those that haven't been bundled yet) can be dragged outside their region (currently snaps back to their previous location and reorganize points in the PVC. Ideally, the point would be constrained - the current definition of the point does not allow it.)
*/

// PVC appears in grades 2 through 6
// this PVC covers population for addition and multiplication at the moment

// requires PVC that has sectionWidth (default 6), sectionHeight (default 15), box# regions in order from right to left and
// starter points at the beginning of each region that are named StarterPoint# in order right to left
function ggbOnInit(name, ggbObject) {
  loadUtils().then(function(setupGGB) {
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
      let selectedObject = "";
      let unbundling = false;
      let snapBack = false;
      let carryString = "";
      let prevAnswerArray = [];
      let prevNum1Array = [];
      let prevNum2Array = [];
      let bundledRegions = [];

      const hiddenCarryString = "\\phantom{\\scriptsize{1}}";
      const visibleCarryString = "\\scriptsize{1}";
      // used for snapping back points and bundle polygons if the target region is full
      const bundlingRegionFullNum = 19;
      const unbundlingRegionFullNum = 10;

      const numRegions = ggbObject.getValue("requiredRegions");
      const regions = [
          "One",
          "Ten",
          "Hundred",
          "Thousand",
          "TenThousand",
          "HundredThousand",
          "Million",
      ];
      const regionColors = [
          "#E60E20",
          "#009B44",
          "#0075A4",
          "#949494",
          "#F17E09",
          "#FFDA00",
          "#7ECDEB",
      ];

      ggbObject.setCoordSystem(-0.05 * numRegions * ggbObject.getValue("sectionWidth"),
          1.05 * numRegions * ggbObject.getValue("sectionWidth"), -1,
          ggbObject.getValue("sectionHeight") + 3
      );
      updateReadText();

      const starterArray = ggbObject
          .getAllObjectNames("point")
          .filter(function(value) {
              return value.includes("StarterPoint");
          });

      // finds x and y coords of the start points
      const starterX = starterArray.map(function(element) {
          return ggbObject.getXcoord(element);
      });
      const starterY = starterArray.map(function(element) {
          return ggbObject.getYcoord(element);
      });
      let carryArray = [];

      let oldNum;
      let oldNum2;
      let unbundleHotKeyPressed = false;

      // setInitialTabOrder
      const initList =
          "FirstNumber, SecondNumber, ggbButton1, ggbButton2, ggbButton3";
      const added = "";
      const enders = "ggbButton4";
      manageTabOrder(added);

      ggbObject.registerClientListener(function(clientEvent) {
          clientFunction(clientEvent);
          libClientFunction(clientEvent);
      });
      ggbObject.registerClickListener(function(clickedName) {
          clickListenerFunction(clickedName);
          libClickFunction(clickedName);
      });
      ggbcanvas.addEventListener("keyup", function(keyEvent) {
          keyit(keyEvent);
          libKeyFunction(keyEvent);
      });

      registerSafeObjectUpdateListener("number", quickChange);
      registerSafeObjectUpdateListener("number2", quickChange);
      registerSafeObjectUpdateListener("FirstNumber", quickChange);
      registerSafeObjectUpdateListener("SecondNumber", quickChange);

      ggbObject.registerAddListener(hideSegments);

      function manageTabOrder(added = "") {
          // AAppletStatus and iIcon are automatically added by the library
          // Note: addedList = manageAddedList("Point4", true); // to add Point4 to the tabOrder, false to remove (also use sTO before deleting the object)

          // switch (step) {
          //   case 0:
          //   // inputs
          //   // falls through
          //   case 1:
          //     // Ready to add? clicked
          //     addedList = "ggbButton2, ggbButton3" + added;
          //     break;
          //   case 2:
          //     // Add it clicked
          //     added = "OnePoint1";
          //     addedList = "ggbButton2" + added + "ggbButton3";
          //     break;
          //   case 3:
          //     // Bundle clicked
          //     addedList = "ggbButton2,ggbButton3";
          //     break;

          //   default:
          //     break;
          // }
          setTabOrder(initList, added, enders);
          console.log("new tabOrder: ", ggbObject.getValueString("tabOrder"));
      }

      function updateReadText() {
          let regionString = "";
          for (let i = 0, L = 6; i < L; i++) {
              if (i === L - 1) {
                  regionString = regionString + "and " + regions[i];
              } else {
                  regionString = regionString + regions[i] + ", ";
              }
          }
          ggbObject.setTextValue(
              "AAppletStatus",
              "A place value chart shows " + regionString + "."
          );
      }

      function quickChange() {
          // Used to check if the value has changed
          const newNum = ggbObject.getValue("number");
          const newNum2 = ggbObject.getValue("number2");

          // Reset the applet only if the student changes one of the input values
          if (newNum !== oldNum || newNum2 !== oldNum2) {
              // console.log(
              //   "1. reset! - in quickChange (before updateAlgorithm, textCase 0)"
              // );
              updateAlgorithmText(0);
              ggbObject.setVisible("f", false);
              ggbObject.setVisible("text11", false);
              // console.log(
              //   "2. reset! - in quickChange (after updateAlgorithm, textCase 0)"
              // );
              carryArray = [];

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
          resetBundledRegionsArray();
      }

      function resetBundledRegionsArray() {
          bundledRegions = [];
      }

      // Set maximum allowed number for the student inputs nad check whether the input can be added with the algorithm
      function validateInputs() {
          ggbObject.setValue("maxAllowedNumber", 9999998);
          const newNum = ggbObject.getValue("number");
          const newNum2 = ggbObject.getValue("number2");
          const sumInputs = didUtils.round(newNum + newNum2, 0);

          const numValid =
              ggbObject.getValue("numberIsValid") === 1 && Number.isInteger(newNum);
          const num2Valid =
              ggbObject.getValue("number2IsValid") === 1 && Number.isInteger(newNum2);
          const bothValid = numValid && num2Valid && sumInputs <= 9999999;
          return bothValid;
      }

      function hideSegments(added) {
          if (ggbObject.getObjectType(added) === "segment") {
              ggbObject.setVisible(added, false);
              ggbObject.setFixed(added, true, false);
          }
      }

      function reset() {
          previousSelectedObject = selectedObject;

          ggbObject.setAnimating();
          ggbObject.setValue("time", 0);
          const deletablePoints = ggbObject
              .getAllObjectNames("point")
              .filter(function(value) {
                  return (!value.includes("Starter") && !value.includes("corner") && !value.includes("Bar") && !value.includes("Export") && !value.includes("Icon") && !value.includes("Instructions") && !value.includes("Algorithm"));
              });
          deletablePoints.forEach(function(element) {
              ggbObject.deleteObject(element);
          });

          const deletablePolys = ggbObject
              .getAllObjectNames("quadrilateral")
              .filter(function(value) {
                  return (!value.includes("box") && !value.includes("Bar") && !value.includes("Box"));
              });

          deletablePolys.forEach(function(element) {
              ggbObject.deleteObject(element);
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
              allPoints.forEach(function(element) {
                  if (
                      element.startsWith(regions[i] + "Point") &&
                      ggbObject.getVisible(element) === true
                  ) {
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
          let lastPointInNewRegion = "";
          let totalNumArray = howManyPoints();
          reset();

          const selectedObjectRegion = selectedObject.replace(
              /(Point)\d+|(TensFrame)/g,
              ""
          );

          for (let i = 0, L = totalNumArray.length; i < L; i++) {
              // create a point in that region named by the region name (from array above) and attached to that box
              for (let j = 0, K = totalNumArray[i]; j < K; j++) {
                  if (i === 0) {
                      ggbObject.evalCommand(
                          regions[i] + "Point" + (j + 1) + "=PointIn(box" + (i + 1) + ")"
                      );
                  } else {
                      ggbObject.evalCommand(
                          regions[i] +
                          "Point" +
                          (j + 1) +
                          "=PointIn(Union(box" +
                          (i + 1) +
                          ",box" +
                          i +
                          "))"
                      );
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

                  if (isLastElementInARegion) {
                      lastPointsAllRegions.push(currentPoint);
                  }
                  lastPointsAllRegions.forEach(function(element) {
                      if (isInRegionUnbundlingTo) {
                          lastPointInNewRegion = element;
                      }
                  });
                  lastPointsAllRegions = [];
              }
          }
          totalNumArray = howManyPoints();
          totalNumArray.every(function(element) {
              if (element >= 10) {
                  enableButton(3, true);
                  return false;
              }
              enableButton(3, false);
              return true;
          });

          console.warn(
              "Selecting objects:",
              previousSelectedObject,
              lastPointInNewRegion
          );
          // If a point is unbundling, select the last point in region. If a point was selected but was deleted during reset(), re-select it here
          snapBack ? ggbObject.evalCommand("SelectObjects(" + previousSelectedObject + ")") : ggbObject.evalCommand("SelectObjects(" + lastPointInNewRegion + ")");

          snapBack = false;
      }

      function updateAlgorithmText(textStep = "0") {
          // Note: \colsep adjusts space/separation to the beginning of the table column.
          // TODO: Find a way to set the horizontal width of the column - currently using phantom characters - not fun!
          const beginArrayString =
              "\\setlength{\\tabcolsep}{-3pt}\\begin{array}{rrrrrrr} ";

          // show the vinculum and plus sign
          ggbObject.setVisible("f", true);
          ggbObject.setVisible("text11", true);
          // get all pertinent numbers and turn them into arrays
          const number1 = ggbObject.getValue("number");
          const number2 = ggbObject.getValue("number2");
          const num1Array = pulverize(number1);
          const num2Array = pulverize(number2);
          let answerArray = howManyPoints();
          // console.log("In updateAlg---answerArray:", answerArray);

          // Used for detcting whether or not the answer array length changed during unbundling
          prevNum1Array = [...num1Array];
          prevNum2Array = [...num2Array];

          // removes preceeding zeros from answerArray when there are no points in the region
          if (textStep >= 2) {
              removeZeros();
              prevAnswerArray = [...answerArray];
          }

          if (textStep === 2 && !unbundling) {
              console.warn(
                  "makeCarryArray called! - in updateAlg textStep === 2 && !unbundling"
              );
              makeCarryArray();
          }

          function makeCarryArray() {
              // console.log("Begin makeCarryArray - check answerArray:", answerArray);
              const tempCarryArray = [];
              console.log(
                  "Making carryArray! tempCarryArray: %o,answerArray: %o ",
                  tempCarryArray,
                  answerArray
              );
              // add as many phantom 1's to tempCarryArray as there are elements in answerArray
              for (let i = 0; tempCarryArray.length < answerArray.length; i++) {
                  tempCarryArray.push(hiddenCarryString);
              }
              carryArray = [...tempCarryArray];
              console.log("Carry array made! length:", carryArray.length, carryArray);
          }

          // if one of the number arrays is shorter than the other, add empty elements to make them align correctly
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
          let answerString = "";

          // Allows extra spaces to be added before num1 and num2 when the full answer string is visible
          const showShortStrings = textStep === 1;

          // change arrays into strings with appropriate columns and commas
          firstNumberString = convertArraysIntoStrings(num1Array);
          secondNumberString = convertArraysIntoStrings(num2Array);
          answerString = convertArraysIntoStrings(answerArray);
          // console.log(
          //   "Step ",
          //   textStep,
          //   "--carryString made - in updateAlg. Check carryArray:",
          //   carryArray
          // );

          if (textStep === 2 && carryArray.length === 0) {
              console.error("Carry String error! Carry Array empty.");
          }

          carryString = convertArraysIntoStrings(carryArray, false);

          // set the value of the text string based on which step of the addition process you're on
          switch (true) {
              // reset, starting point, no text
              case textStep === 0:
                  ggbObject.setTextValue("algorithmText", "");
                  break;
                  // show first two addends only, first button press
              case textStep === 1:
                  ggbObject.setTextValue(
                      "algorithmText",
                      beginArrayString +
                      firstNumberString +
                      " \\\\" +
                      secondNumberString +
                      " \\\\	\\end{array}"
                  );

                  break;
                  // show sum of the numbers when putting dots together in a region, second button press
              case textStep === 2 && !unbundling:
                  {
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

                      break;
                  }
                  // bundling - this one's fun, changes a lot, third button press AND performSwap
              case textStep === 3 || unbundling:
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
              const reversedArray = answerArray.reverse();
              let numZerosToErase = 0;
              for (let index = 0, L = reversedArray.length; index < L; index++) {
                  const element = reversedArray[index];
                  if (element === 0) {
                      numZerosToErase++;
                  } else {
                      break;
                  }
              }
              answerArray = [
                  ...reversedArray.slice(numZerosToErase, reversedArray.length),
              ].reverse();
          }

          /* 
    concatenate the numbers such that each single digit number gets a column in the matrix
    add a comma where necessary, and don't add an empty column (&) at the end
    TODO: Could: Instead of using kerning and phantom characters in the convertArraysIntoStrings function to reduce array colum width, find a way to set column width, if possible 
    */
          function convertArraysIntoStrings(numArray, commas = "true") {
              let nameString = "";
              let kernString = "";
              const kernedNumArray = [];
              // Creates a phantom comma height that will be concatinated with each number string so that the Carry string (1's) always align with the vinculum bar
              const phantomCommaStr = "\\vphantom{,}";
              numArray.forEach(function(element) {
                  // kern each string so that there is less space between columns
                  kernString = "\\kern{-6pt}";

                  // If element in the string is one character long, add a phantom character in front so that the columns don't bounce
                  if (element.toString().length === 1) {
                      kernString = "\\phantom{1}" + kernString;
                  }
                  kernedNumArray.push(kernString + element);
              });
              /* 
      Used to reduce the width between array columns
      TODO: Find a way to set the width of the column while also right justifying. Currently using kerning and phantom characters
       */
              kernedNumArray.forEach(function(elementKern, indexKern) {
                  if (commas) {
                      const numTotalDigits = answerArray.length;
                      const addSpaceToBeginning = !showShortStrings && kernedNumArray.length - 1 < numTotalDigits;
                      const numSpacesToAdd =
                          numTotalDigits - (kernedNumArray.length - 1) - 1;

                      switch (true) {
                          case indexKern === kernedNumArray.length - 1:
                              nameString =
                                  nameString +
                                  kernedNumArray[
                                      kernedNumArray.length - indexKern - 1
                              ].toString();

                              // aligns the digits to the right by adding space ("&" signs) to the front of the string
                              if (addSpaceToBeginning) {
                                  for (let i = 0, L = numSpacesToAdd; i < L; i++) {
                                      nameString = "&".concat(nameString);
                                  }
                              }

                              break;
                          case indexKern === kernedNumArray.length - 4:
                              // falls through
                          case indexKern === kernedNumArray.length - 7:
                              if (
                                  kernedNumArray[
                                      kernedNumArray.length - indexKern - 1
                                  ].toString() !== "" &&
                                  kernedNumArray[
                                      kernedNumArray.length - indexKern - 1
                                  ].toString() !== kernString
                              ) {
                                  nameString =
                                      nameString +
                                      kernedNumArray[
                                          kernedNumArray.length - indexKern - 1
                                  ].toString() +
                                      "," +
                                      "&";
                              } else {
                                  nameString =
                                      nameString +
                                      kernedNumArray[
                                          kernedNumArray.length - indexKern - 1
                                  ].toString() +
                                      "&";
                              }
                              break;

                          case indexKern === kernedNumArray.length - 3:
                              // falls through
                          case indexKern === kernedNumArray.length - 6:
                              nameString =
                                  nameString +
                                  kernedNumArray[
                                      kernedNumArray.length - indexKern - 1
                              ].toString() +
                                  "&";
                              break;
                          case indexKern < kernedNumArray.length - 1:
                              nameString =
                                  nameString +
                                  kernedNumArray[
                                      kernedNumArray.length - indexKern - 1
                              ].toString() +
                                  "&";
                              break;
                          default:
                              break;
                      }
                      if (!nameString.includes(",")) {
                          nameString = nameString + phantomCommaStr;
                      }
                  } else {
                      // Carry String, no commas (add a phantom comma so that the 1 lines up with the ones digit of each answerString array element)
                      switch (true) {
                          case indexKern === kernedNumArray.length - 1:
                              nameString =
                                  nameString +
                                  kernedNumArray[
                                      kernedNumArray.length - indexKern - 1
                              ].toString();
                              break;
                          case indexKern === kernedNumArray.length - 4:
                              // falls through
                          case indexKern === kernedNumArray.length - 7:
                              if (
                                  kernedNumArray[
                                      kernedNumArray.length - indexKern - 1
                                  ].toString() !== "" &&
                                  kernedNumArray[
                                      kernedNumArray.length - indexKern - 1
                                  ].toString() !== kernString
                              ) {
                                  nameString =
                                      nameString +
                                      kernedNumArray[
                                          kernedNumArray.length - indexKern - 1
                                  ].toString() +
                                  // Add an extra little space when in the "commas" column so the digits line up.
                                  "\\hphantom{\\scriptsize{c}}" +
                                      "&";
                              } else {
                                  nameString =
                                      nameString +
                                      kernedNumArray[
                                          kernedNumArray.length - indexKern - 1
                                  ].toString() +
                                      "&";
                              }
                              break;
                          case indexKern < kernedNumArray.length - 1:
                              nameString =
                                  nameString +
                                  kernedNumArray[
                                      kernedNumArray.length - indexKern - 1
                              ].toString() +
                                  "&";
                              break;
                          default:
                              break;
                      }
                  }
              });
              return nameString;
          }
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
          for (let index = 0; index < multiplier; index++) {
              // for as many regions as there are place values defined
              if (num1Array.length <= numRegions && num2Array.length <= numRegions) {
                  // need error messaging to allow higher than 9 in a region
                  for (let i = 0, L = num1Array.length; i < L; i++) {
                      // create a point in that region named by the region name (from array above) and attached to that box
                      for (let j = 0, K = num1Array[i]; j < K; j++) {
                          if (i === 0) {
                              ggbObject.evalCommand(
                                  regions[i] +
                                  "Point" +
                                  (j + 1) +
                                  "Set" +
                                  (index + 1) +
                                  "=PointIn(box" +
                                  (i + 1) +
                                  ")"
                              );
                          } else {
                              ggbObject.evalCommand(
                                  regions[i] +
                                  "Point" +
                                  (j + 1) +
                                  "Set" +
                                  (index + 1) +
                                  "=PointIn(Union(box" +
                                  (i + 1) +
                                  ",box" +
                                  i +
                                  "))"
                              );
                          }
                          ggbObject.setCoords(
                              regions[i] + "Point" + (j + 1) + "Set" + (index + 1),
                              starterX[i] + (j % 5),
                              starterY[i] - Math.floor(j / 5) - Math.floor(j / 10) - 3 * index
                          );
                          prettyPoints(
                              regions[i] + "Point" + (j + 1) + "Set" + (index + 1),
                              i
                          );
                      }
                  }
                  // if we have a second number
                  for (let i = 0, L = num2Array.length; i < L; i++) {
                      // create a point in that region named by the region name (from array above) and attached to that box
                      for (let j = 0, K = num2Array[i]; j < K; j++) {
                          ggbObject.evalCommand(
                              regions[i] + "PointB" + (j + 1) + "=PointIn(box" + (i + 1) + ")"
                          );
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
          ggbObject.setVisible(pointName, true);
          ggbObject.setLayer(pointName, 1);
          ggbObject.evalCommand(
              "SetColor(" + pointName + ',"' + regionColors[regionNumber] + '")'
          );
      }

      // this function creates a draggable ten frame
      function bundle() {
          organize();
          const totalNumArray = howManyPoints();
          totalNumArray.every(function(element, i) {
              // highlight one or more tens frames

              const nextRegionIsFull =
                  totalNumArray[i + 1] > bundlingRegionFullNum - 1;

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

                  // ggbObject.deleteObject("tabOrder");
                  // ggbObject.evalCommand(
                  //   "tabOrder={ggbButton3," +
                  //     regions[i] +
                  //     "TensFrame,ggbButton3,ggbButton4,ggbButton1,ggbButton2}"
                  // );
                  // copies tens frame to make outline and sets properties
                  ggbObject.evalCommand(
                      regions[i] + "TensFrameOutline=" + regions[i] + "TensFrame"
                  );
                  ggbObject.setColor(regions[i] + "TensFrameOutline", 0, 0, 0);
                  ggbObject.setFilling(regions[i] + "TensFrameOutline", 0);
                  ggbObject.setVisible(regions[i] + "TensFrameOutline", true);

                  ggbObject.setFixed(regions[i] + "TensFrameOutline", true, false);
                  ggbObject.setLayer(regions[i] + "TensFrameOutline", 3);

                  // makes corner so that points can be made based off of tens frame position
                  ggbObject.evalCommand(
                      regions[i] +
                      "TenFrameCorner=Corner(" +
                      regions[i] +
                      "TensFrameOutline,1)"
                  );
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

                      ggbObject.setFixed(
                          "Moving" + regions[i] + "Point" + (j + 1),
                          true,
                          false
                      );
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
                  //
              }

              return true;
          });
          // make all visible points nonselectable so students can't move dots before completing the bundle
          makeAllPointsSelectable(false);
      }

      /* 
  Note: Bundling is intentionally restricted to once, otherwise the carryString would be incorrect (can only have 1's in the carryString)
  Note: Similarly, unbundling is intentionally restricted to only points that have been previously bundled, otherwise the carryString in the algorithm would be incorrect (can't go in the negatives).
  bundles or unbundles, based on the case 
  */
      function performSwap(totalNumArray) {
          // figure out the type of point or tens frame that was grabbed by removing all but the region
          const selectedObjectRegion = selectedObject.replace(
              /(Point)\d+|(TensFrame)/g,
              ""
          );
          // gets the index of the region from the const array "regions"
          const regionNum = regions.indexOf(selectedObjectRegion);
          const bundling =
              ggbObject.getXcoord(regions[regionNum] + "TenFrameCorner") <
              (numRegions - regionNum - 1) * ggbObject.getValue("sectionWidth") &&
              selectedObject.includes("Frame");
          unbundling =
              (selectedObject.includes("Point") &&
              ggbObject.getXcoord(selectedObject) >
              (numRegions - regionNum) * ggbObject.getValue("sectionWidth")) ||
              unbundleHotKeyPressed;

          switch (true) {
              // moving tenframe (bundle)
              case bundling:
                  {
                      // hide old tenframe
                      for (let j = 0, K = 10; j < K; j++) {
                          ggbObject.setVisible(
                              "Moving" + regions[regionNum] + "Point" + (j + 1),
                              false
                          );
                      }

                      ggbObject.setVisible(
                          regions[regionNum] + "TensFrameOutline",
                          false
                      );
                      ggbObject.setVisible(regions[regionNum] + "TensFrame", false);

                      // create ten point in new region
                      const midPointX =
                          ggbObject.getValue("sectionWidth") *
                          (numRegions - regionNum - 2 + 0.5);
                      ggbObject.evalCommand(
                          regions[regionNum + 1] +
                          "Point" +
                          (totalNumArray[regionNum + 1] + 1) +
                          "=PointIn(box" +
                          (regionNum + 2) +
                          ")"
                      );
                      ggbObject.setCoords(
                          regions[regionNum + 1] +
                          "Point" +
                          (totalNumArray[regionNum + 1] + 1),
                          midPointX,
                          1
                      );
                      prettyPoints(
                          regions[regionNum + 1] +
                          "Point" +
                          (totalNumArray[regionNum + 1] + 1),
                          regionNum + 1
                      );
                      // console.log(
                      //   "carryArray splicing! in bundling case of performSwap:"
                      // );

                      carryArray.splice(regionNum + 1, 1, visibleCarryString);

                      ggbObject.evalCommand(
                          "SelectObjects(" +
                          regions[regionNum + 1] +
                          "Point" +
                          (totalNumArray[regionNum + 1] + 1) +
                          ")"
                      );

                      // reorganizes points after waiting half a second
                      // During the pause don't allow points to be selectable, then reselectable after organized
                      makeAllPointsSelectable(false);
                      setTimeout(function() {
                          organize();
                          ggbObject.evalCommand(
                              "SelectObjects(" +
                              regions[regionNum + 1] +
                              "Point" +
                              (totalNumArray[regionNum + 1] + 1) +
                              ")"
                          );
                          updateAlgorithmText(3);
                          // ggbObject.deleteObject("tabOrder");
                          // ggbObject.evalCommand(
                          //   "tabOrder={ggbButton3,ggbButton4,ggbButton1,ggbButton2,AAppletStatus,instructionsIcon,xIcon,FirstNumber,SecondNumber}"
                          // );
                          makeAllPointsSelectable(true);
                          console.log(
                              "select object (bundling case):",
                              regions[regionNum + 1] +
                              "Point" +
                              (totalNumArray[regionNum + 1] + 1)
                          );
                      }, 500);
                      bundledRegions.push(regions[regionNum + 1]);
                  }
                  break;
                  // moving point or hotkey (unbundle)
              case unbundling:
                  {
                      // second "false" sets it fixed false
                      makeAllPointsSelectable(false, false);
                      // Used for re-selecting point after unbunding/organize is complete
                      regionUnbundledFrom = regionNum + 1;
                      // If the region being unbundled TO has room, allow it to unbundle, otherwise snap the point back
                      if (
                          totalNumArray[regionNum - 1] < unbundlingRegionFullNum &&
                          bundledRegions.includes(regions[regionNum])
                      ) {
                          /*       
            Do all the stuff that unbundling does

            ----- Immediately -----

            Reorganize points that are already in the region unbundling TO to account for students moving them around the region.  Keep dragged point visible and don't create 10 points yet. 
            */

                          // Temporarily take out the dragged point from the totalNumArray values so that it is not placed back in the unbundlingFrom column
                          totalNumArray.forEach(function(element, index) {
                              // do something with each element in the array
                              if (index === regionUnbundledFrom - 1) {
                                  totalNumArray.splice(index, 1, element - 1);
                              }
                          });

                          // Clean up points in all regions first
                          // get all the original points in the unbundling TO region and organize them into two rows of 5 points each
                          const allPoints = ggbObject.getAllObjectNames("point");
                          const dots = allPoints.filter(function(el) {
                              return (
                                  el.includes("Point") && !el.includes("Icon") && !el.includes("Starter")
                              );
                          });
                          regions.forEach(function(regionName, regionIndex) {
                              const currentRegionNum = regionIndex + 1;

                              dots.forEach(function(pointName) {
                                  if (
                                      pointName.includes(regionName + "Point") &&
                                      pointName !== selectedObject
                                  ) {
                                      const pointNum = Number(
                                          pointName.replace(
                                              regions[currentRegionNum - 1] + "Point",
                                              ""
                                          )
                                      );
                                      const newX =
                                          starterX[currentRegionNum - 1] + ((pointNum - 1) % 5);

                                      const newY =
                                          starterY[currentRegionNum - 1] -
                                          Math.floor((pointNum - 1) / 5) -
                                          Math.floor((pointNum - 1) / 10);

                                      ggbObject.setCoords(pointName, newX, newY);
                                  }
                              });
                          });

                          /* 
            ----- Pause #1 -----
            Hide dragged pint. Make 10 points and place them at the bottom 
            */
                          setTimeout(function() {
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
                                  // false selectable, false fixed
                                  makeAllPointsSelectable(false, false);

                                  const tempYCoord = 2;
                                  // sets the coordinates of the new points - temporarily at the bottom for half a second until it's reorganized
                                  ggbObject.setCoords(
                                      regions[regionNum - 1] +
                                      "Point" +
                                      (totalNumArray[regionNum - 1] + i + 1),
                                      starterX[regionNum - 1] + (i % 5),
                                      // separate them into two stacks of 5
                                      tempYCoord - Math.floor(i / 5) - Math.floor(i / 10)
                                  );

                                  // make the points the right color, size, style
                                  prettyPoints(
                                      regions[regionNum - 1] +
                                      "Point" +
                                      (totalNumArray[regionNum - 1] + i + 1),
                                      regionNum - 1
                                  );
                              }

                              // update the array that tracks the number of points in each region
                              totalNumArray = howManyPoints();

                              /*  
             If highest place value had a 1 and it was unbundled, delete the extra "column" for the highest place value - delete the array element, don't replace it. Otherwise, replace the array element with the hidden carry string
              OR If carryString ends in a &, need to get rid of it. 
              */

                              if (
                                  prevAnswerArray.length > prevNum1Array.length &&
                                  prevAnswerArray.length > prevNum2Array.length &&
                                  prevAnswerArray[regionNum] === 1 &&
                                  selectedObject.includes(regions[regionNum])
                              ) {
                                  // console.log(
                                  //   "Carry Array splicing! (Unbundling case of performSwap) Number of digits changed in carryString- highest place value is 1 and just unbundled!!!"
                                  // );

                                  carryArray.splice(regionNum, 1);
                              } else {
                                  carryArray.splice(regionNum, 1, hiddenCarryString);
                                  // console.log(
                                  //   "Carry Array splicing! (Unbundling case of performSwap) "
                                  // );
                              }
                              enableButton(3, true);
                          }, 1000);

                          /* 
            ----- Pause #2 -----
            Final clean up of points 
            */
                          setTimeout(function() {
                              snapBack = false;
                              // During the pause don't allow points to be selectable, then make reselectable after organized
                              makeAllPointsSelectable(false);
                              organize();
                              makeAllPointsSelectable(true);
                              updateAlgorithmText(2);
                          }, 1500);
                      } else {
                          snapItBack();
                          updateAlgorithmText(2);
                      }
                  }
                  break;
          }
      }

      // If Region unbundling or bundling TO  is full, snap the point back to its previous location after a half-second delay
      function snapItBack() {
          snapBack = true;
          // During the pause don't allow points to be selectable, then reselectable after organized
          makeAllPointsSelectable(false);
          setTimeout(function() {
              ggbObject.setCoords(selectedObject, preXCoord, preYCoord);
              organize();
              makeAllPointsSelectable(true);
          }, 500);
      }

      // make all visible points selectable or nonSelectable. Pass a bool for selectability
      function makeAllPointsSelectable(
          selectableBool,
          fixedBool = !selectableBool
      ) {
          const objectNames = ggbObject.getAllObjectNames();
          for (let i = 0, L = objectNames.length; i < L; i++) {
              if (!objectNames[i].includes("Starter") &&
                  ggbObject.getVisible(objectNames[i]) === true &&
                  ggbObject.getObjectType(objectNames[i]) === "point"
              ) {
                  ggbObject.setFixed(objectNames[i], fixedBool, selectableBool);
              }
          }
      }

      // capture the pre-unbundled coords so that the dot can be snapped back in place if a student tries to unbundle to a region that is already full
      function capturePreviousCoords(obj) {
          if (ggbObject.getObjectType(obj) === "point") {
              preXCoord = ggbObject.getXcoord(obj);
              preYCoord = ggbObject.getYcoord(obj);
          }
      }

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
                  manageTabOrder("");
              },
              ggbButton2() {
                  updateAlgorithmText(2);
                  organize();
                  enableButton(1, false);
                  enableButton(2, false);
                  enableButton(4, true);
                  makeAllPointsSelectable(true);
                  manageTabOrder("");
              },
              ggbButton3() {
                  updateAlgorithmText(3);
                  bundle();
                  enableButton(1, false);
                  enableButton(2, false);
                  enableButton(4, true);
                  manageTabOrder("");
              },
              ggbButton4() {
                  updateAlgorithmText(0);
                  ggbObject.setVisible("f", false);
                  ggbObject.setVisible("text11", false);
                  carryArray = [];
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
                  resetBundledRegionsArray();
                  manageTabOrder("");
              },
              ggbButton5() {},
              // button3() {
              // console.log("Clicked!!!!!")
              // for (let i = 0; i < 100; i++) {
              //   const num1 = Math.floor(Math.random() * 9999998);
              //   const num2 = Math.floor(Math.random() * (9999998 - num1));
              //   ggbObject.setValue("number1", num1);
              //   ggbObject.setValue("number2", num2);
              //   enableButton(1, false);
              //   enableButton(2, true);
              //   enableButton(3, false);
              //   enableButton(4, true);
              //   updateAlgorithmText(1);
              //   popul8();
              //   makeAllPointsSelectable(false);
              //   ggbReadText("What happens when the button is clicked?");
              //   // click function 2
              //   updateAlgorithmText(2);
              //   organize();
              //   enableButton(1, false);
              //   enableButton(2, false);
              //   enableButton(4, true);

              //   makeAllPointsSelectable(true);
              // }
              // },
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
          const clientTarget = clientEvent.target;
          switch (clientEvent.type) {
              case "select":
                  selectedObject = clientTarget;
                  console.log("selectedObject:", selectedObject);
                  // capture coords of pre-unbundled point of potential snap-back
                  capturePreviousCoords(selectedObject);
                  break;
              case "mousedown":
                  if (
                      selectedObject.includes("Frame") ||
                      selectedObject.includes("Point")
                  ) {
                      previousSelectedObject = clientTarget;
                  }

                  break;
              case "dragEnd":
                  {
                      // capture coords of pre-unbundled point of potential snap-back
                      capturePreviousCoords(selectedObject);
                      const totalNumArray = howManyPoints();
                      performSwap(totalNumArray);
                      preXCoord = 0;
                      preYCoord = 0;
                      break;
                  }
              case "deselect":
                  unbundleHotKeyPressed = false;
                  break;
          }
      }

      function clickListenerFunction(clickedName) {
          // switch (clickedName) {}
      }

      function keyit(keyEvent) {
          unbundleHotKeyPressed = false;
          let totalNumArray = [];
          switch (true) {
              case keyEvent.code.includes("ArrowLeft") &&
                  selectedObject.includes("Frame"):
                  totalNumArray = howManyPoints();
                  performSwap(totalNumArray);
                  break;
              case keyEvent.code.includes("ArrowRight") &&
                  selectedObject.includes("Point"):
                  totalNumArray = howManyPoints();
                  performSwap(totalNumArray);
                  break;
              case keyEvent.code === "KeyU":
                  totalNumArray = howManyPoints();
                  unbundleHotKeyPressed = true;
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
          return fetch(
              "https://cdn.digital.greatminds.org/did-utils/latest/index.js", {
                  cache: "no-cache",
              }
          )
              .then(function(response) {
                  return response.text();
              })
              .then(function(codingText) {
                  parseJS(codingText);
              })
              .then(function() {
                  return window.didUtils.setupGGB;
              });
      }
      return Promise.resolve(window.didUtils.setupGGB);
  }
}
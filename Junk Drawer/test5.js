// Dane's PVC subtraction

function ggbOnInit(name, ggbObject) {
  loadUtils().then(function(setupGGB) {
      const buttonClicks = defineButtonClickScripts();
      // you may replace the following function call with the name of your status text object as a string
      // if you do, you can delete the function defineStatusName
      const statusName = defineStatusName();
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
          editXML,
      } = setupGGB({
          name,
          ggbObject,
          defineKeyboardInstructions,
          buttonClicks,
          statusName,
      });
      const ggbcanvas = getCanvas(name);

      /*
       * IGNORE above
       * EDIT below
       */

      setAriaLabel(ggbcanvas, "Place Value Chart Interactive");

      var selectedObject = "";

      //all of the global variables
      let rowAdderOnes = 0;
      let rowAdderTens = 0;
      let rowAdderHuns = 0;
      let labelHuns = ggbObject.getValue("hunsCount");
      let labelTens = ggbObject.getValue("tensCount");
      let labelOnes = ggbObject.getValue("onesCount");
      let labelHuns2 = ggbObject.getValue("hunsCount2");
      let labelTens2 = ggbObject.getValue("tensCount2");
      let labelOnes2 = ggbObject.getValue("onesCount2");
      let unbundledHuns = 0;
      let unbundledTens = 0;
      let unbundledOnes = 0;
      let pointsH = [];
      let pointsT = [];
      let pointsO = [];
      let click = 0;

      let number1 = 417;
      let number2 = 228;
      let regex = /\d+/;
      let regex2 = /\-\d+/;

      var initList = "InputBox4";
      var addedList = "";
      var enders = "ggbButton1, ggbButton2, ggbButton3";

      // Needed for going forward and back a slide
      if (ggbObject.getValue("Length(tabOrder)") === 0) {
          setTabOrder(initList, addedList, enders);
      }

      function defineStatusName() {
          // put the name of your GGB status text object here
          return "AAppletStatus";
      }
      // listeners here; keep these, add your own as needed
      ggbObject.registerClientListener(function(a) {
          clientFunction(a);
          libClientFunction(a);
      });
      ggbObject.registerClickListener(function(a) {
          clickListenerFunction(a);
          libClickFunction(a);
      });
      ggbcanvas.addEventListener("keyup", function(event) {
          keyit(event);
          libKeyFunction(event);
      });

      registerSafeObjectUpdateListener("step", hup234);
      registerSafeObjectUpdateListener("subtractReady", subtractReadyUpdate);
      registerSafeObjectUpdateListener("inputBoxText", inputBoxTextUpdate);

      function hup234() {
          if (ggbObject.getValue("step") == 1) {
              popul8();
          }
          if (ggbObject.getValue("step") == 2) {
              matchIt();
          }
          if (ggbObject.getValue("step") == 3) {
              reset();
          }
      }

      //creates the initial points
      function popul8() {
          reset();
          click = click + 1;
          labelHuns = ggbObject.getValue("hunsCount");
          labelTens = ggbObject.getValue("tensCount");
          labelOnes = ggbObject.getValue("onesCount");
          labelHuns2 = ggbObject.getValue("hunsCount2");
          labelTens2 = ggbObject.getValue("tensCount2");
          labelOnes2 = ggbObject.getValue("onesCount2");
          if (click == 1) {
              //create points in hundreds region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelHuns; popLoop++) {
                  ggbObject.evalCommand("HU_" + popLoop + "=PointIn(tenHunRegion)");
                  ggbObject.setCoords(
                      "HU_" + popLoop,
                      ggbObject.getXcoord("ig5") + (popLoop % 5),
                      ggbObject.getYcoord("ig5") - Math.floor(popLoop / 5)
                  );
                  ggbObject.setColor("HU_" + popLoop, 0, 127, 175);
                  ggbObject.setLayer("HU_" + popLoop, 0);
                  pointsH.push("HU_" + popLoop);
              }
              //create points in tens region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelTens; popLoop++) {
                  ggbObject.evalCommand("TE_" + popLoop + "=PointIn(oneTenRegion)");
                  ggbObject.setCoords(
                      "TE_" + popLoop,
                      ggbObject.getXcoord("ig6") + (popLoop % 5),
                      ggbObject.getYcoord("ig6") - Math.floor(popLoop / 5)
                  );
                  ggbObject.setColor("TE_" + popLoop, 0, 0, 255);
                  ggbObject.setLayer("TE_" + popLoop, 0);
                  pointsT.push("TE_" + popLoop);
              }
              //create points in ones region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelOnes; popLoop++) {
                  ggbObject.evalCommand("ZO_" + popLoop + "=PointIn(oneRegion)");
                  ggbObject.setCoords(
                      "ZO_" + popLoop,
                      ggbObject.getXcoord("ig7") + (popLoop % 5),
                      ggbObject.getYcoord("ig7") - Math.floor(popLoop / 5)
                  );
                  ggbObject.setColor("ZO_" + popLoop, 127, 0, 255);
                  ggbObject.setLayer("ZO_" + popLoop, 0);
                  pointsO.push("ZO_" + popLoop);
              }
              ggbObject.setValue("onesCount3", pointsO.length);
              ggbObject.setValue("tensCount3", pointsT.length);
              ggbObject.setValue("hunsCount3", pointsH.length);
          }

          let newPointNames = ggbObject.getAllObjectNames("point");
          for (let i = 0, L = newPointNames.length; i < L; i++) {
              if (newPointNames[i].includes("ZO_")) {
                  editXML(newPointNames[i], "dynamicCaption", "val", "onesCaption");
              } else if (newPointNames[i].includes("TE_")) {
                  editXML(newPointNames[i], "dynamicCaption", "val", "tensCaption");
              } else if (newPointNames[i].includes("HU_")) {
                  editXML(newPointNames[i], "dynamicCaption", "val", "hunsCaption");
              }
          }
          if (
              ggbObject.getValue("onesCount3") > 0 ||
              ggbObject.getValue("tensCount3") > 0 ||
              ggbObject.getValue("hunsCount3") > 0
          ) {
              sortPointNames();
          }
      }

      //If there are at least as many points at the top as the bottom, set the crosses on top of the dots for each region
      function matchIt() {
          ggbObject.setValue("crossesShown", true);
          for (i = 0, L = pointsH.length; i < L; i++) {
              ggbObject.setFixed(pointsH[i], true, false);
          }
          for (i = 0, L = pointsT.length; i < L; i++) {
              ggbObject.setFixed(pointsT[i], true, false);
          }
          for (i = 0, L = pointsO.length; i < L; i++) {
              ggbObject.setFixed(pointsO[i], true, false);
          }
          if (pointsH.length >= labelHuns2) {
              //create x points in hundreds region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelHuns2; popLoop++) {
                  ggbObject.evalCommand("HB" + popLoop + "=PointIn(box)");
                  ggbObject.setCoords(
                      "HB" + popLoop,
                      ggbObject.getXcoord(pointsH[popLoop]),
                      ggbObject.getYcoord(pointsH[popLoop])
                  );
                  ggbObject.setVisible("HB" + popLoop, false);
                  if (labelHuns2 == 1) {
                      ggbObject.evalCommand(
                          "HBCross" + popLoop + "=Segment(HB" + popLoop + "-(0.5,0.5),HB" + popLoop + "+(0.5,0.5))"
                      );
                      ggbObject.setLayer("HBCross" + popLoop, 2);
                      ggbObject.setColor("HBCross" + popLoop, 0, 0, 0);
                      ggbObject.setFixed("HBCross" + popLoop, true, false);
                  } else {
                      ggbObject.evalCommand(
                          "HBCross" + popLoop + "=Segment(HB" + popLoop + "+(0.5,0),HB" + popLoop + "-(0.5,0))"
                      );
                      ggbObject.setLayer("HBCross" + popLoop, 2);
                      ggbObject.setColor("HBCross" + popLoop, 0, 0, 0);
                      ggbObject.setFixed("HBCross" + popLoop, true, false);
                  }
              }
          }
          if (pointsT.length >= labelTens2) {
              //create x points in tens region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelTens2; popLoop++) {
                  ggbObject.evalCommand("TB" + popLoop + "=PointIn(box)");
                  ggbObject.setCoords(
                      "TB" + popLoop,
                      ggbObject.getXcoord(pointsT[popLoop]),
                      ggbObject.getYcoord(pointsT[popLoop])
                  );
                  ggbObject.setVisible("TB" + popLoop, false);
                  if (labelTens2 == 1) {
                      ggbObject.evalCommand(
                          "TBCross" + popLoop + "=Segment(TB" + popLoop + "-(0.5,0.5),TB" + popLoop + "+(0.5,0.5))"
                      );
                      ggbObject.setLayer("TBCross" + popLoop, 2);
                      ggbObject.setColor("TBCross" + popLoop, 0, 0, 0);
                      ggbObject.setFixed("TBCross" + popLoop, true, false);
                  } else {
                      ggbObject.evalCommand(
                          "TBCross" + popLoop + "=Segment(TB" + popLoop + "+(0.5,0),TB" + popLoop + "-(0.5,0))"
                      );
                      ggbObject.setLayer("TBCross" + popLoop, 2);
                      ggbObject.setColor("TBCross" + popLoop, 0, 0, 0);
                      ggbObject.setFixed("TBCross" + popLoop, true, false);
                  }
              }
          }
          if (pointsO.length >= labelOnes2) {
              //create x points in ones region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelOnes2; popLoop++) {
                  ggbObject.evalCommand("OB" + popLoop + "=PointIn(box)");
                  ggbObject.setCoords(
                      "OB" + popLoop,
                      ggbObject.getXcoord(pointsO[popLoop]),
                      ggbObject.getYcoord(pointsO[popLoop])
                  );
                  ggbObject.setVisible("OB" + popLoop, false);
                  if (labelOnes2 == 1) {
                      ggbObject.evalCommand(
                          "OBCross" + popLoop + "=Segment(OB" + popLoop + "-(0.5,0.5),OB" + popLoop + "+(0.5,0.5))"
                      );
                      ggbObject.setLayer("OBCross" + popLoop, 2);
                      ggbObject.setColor("OBCross" + popLoop, 0, 0, 0);
                  } else {
                      ggbObject.evalCommand(
                          "OBCross" + popLoop + "=Segment(OB" + popLoop + "+(0.5,0),OB" + popLoop + "-(0.5,0))"
                      );
                      ggbObject.setLayer("OBCross" + popLoop, 2);
                      ggbObject.setColor("OBCross" + popLoop, 0, 0, 0);
                      ggbObject.setFixed("OBCross" + popLoop, true, false);
                  }
              }
          }
          ggbObject.setValue("hunsCrossedOut", ggbObject.getValue("hunsCount2"));
          ggbObject.setValue("tensCrossedOut", ggbObject.getValue("tensCount2"));
          ggbObject.setValue("onesCrossedOut", ggbObject.getValue("onesCount2"));
      }

      //sets all values back to the start
      function reset() {
          initList = "InputBox4";
          addedList = "";
          enders = "ggbButton1, ggbButton2, ggbButton3";
          ggbObject.setTextValue("addedList", "");
          setTabOrder(initList, addedList, enders);

          click = 0;
          //set question button visible and subtract it button invisible
          ggbObject.setValue("subtractReady", false);
          rowAdderOnes = 0;
          rowAdderTens = 0;
          rowAdderHuns = 0;
          unbundledHuns = 0;
          unbundledTens = 0;
          unbundledOnes = 0;
          pointsH = [];
          pointsT = [];
          pointsO = [];
          pointNames = [];

          labelHuns = ggbObject.getValue("hunsCount");
          labelTens = ggbObject.getValue("tensCount");
          labelOnes = ggbObject.getValue("onesCount");

          labelHuns2 = ggbObject.getValue("hunsCount2");
          labelTens2 = ggbObject.getValue("tensCount2");
          labelOnes2 = ggbObject.getValue("onesCount2");

          ggbObject.setValue("hunBool", false);
          ggbObject.setValue("tenBool", false);
          ggbObject.setValue("oneBool", false);
          ggbObject.setValue("crossesShown", false);

          //determined what points where not integral to applet and deletes them
          pointNames = ggbObject.getAllObjectNames("point");
          lengthPointNames = pointNames.length;
          for (iter9 = 0; iter9 < lengthPointNames; iter9++) {
              if (!pointNames[iter9].includes("ig")) {
                  ggbObject.deleteObject(pointNames[iter9]);
              }
          }
      }

      function subtractReadyUpdate() {
          if (ggbObject.getValue("subtractReady")) {
              enableButton(1, false);
              enableButton(2, true);
          } else {
              enableButton(1, true);
              enableButton(2, false);
          }
      }

      function inputBoxTextUpdate() {
          if (ggbObject.getValueString("inputBoxText").match(regex) != null) {
              number1 = ggbObject.getValueString("inputBoxText").match(regex);
          }
          if (ggbObject.getValueString("inputBoxText").match(regex2) != null) {
              number2 = -1 * ggbObject.getValueString("inputBoxText").match(regex2);
          }
      }

      function dragEndKeyUpHotKeyCheck() {
          if (ggbObject.getObjectType(selectedObject) == "point") {
              if (
                  selectedObject.includes("HU_") &&
                  ggbObject.getXcoord(selectedObject) > -3 &&
                  ggbObject.getYcoord(selectedObject) > -10
              ) {
                  var choppingBlock = pointsH.indexOf(selectedObject);
                  pointsH.splice(choppingBlock, 1);
                  ggbObject.setVisible(selectedObject, false);
                  for (var column = 0; column < 2; column++) {
                      for (var row = 0; row < 5; row++) {
                          ggbObject.evalCommand("TE_" + labelTens + " =PointIn(oneTenRegion)");
                          ggbObject.setCoords(
                              "TE_" + labelTens,
                              ggbObject.getXcoord("ig6") + row,
                              ggbObject.getYcoord("ig6") - 3 - column - 2 * rowAdderTens
                          );
                          ggbObject.setColor("TE_" + labelTens, 0, 0, 255);
                          ggbObject.setLayer("TE_" + labelTens, 0);
                          pointsT.push("TE_" + labelTens);
                          ggbObject.setValue("hunsCount3", pointsH.length);
                          ggbObject.setValue("tensCount3", pointsT.length);
                          ggbObject.setVisible("t_1", true);
                          ggbObject.setVisible("a_1", true);
                          ggbObject.setValue("hunBool", true);
                          ggbObject.setValue("tenBool", true);
                          labelTens++;
                      }
                  }
                  rowAdderTens = rowAdderTens + 1;
                  unbundledTens = unbundledTens + 1;
                  let beginningReadText = "This dot has been unbundled. ";
                  let finalReadText = beginningReadText.concat(ggbObject.getValueString("updateText"));
                  ggbReadText(finalReadText);
                  sortPointNames();
              }
          }

          if (ggbObject.getObjectType(selectedObject) == "point") {
              if (
                  selectedObject.includes("TE_") &&
                  ggbObject.getXcoord(selectedObject) > 3 &&
                  ggbObject.getYcoord(selectedObject) > -10
              ) {
                  var choppingBlock = pointsT.indexOf(selectedObject);
                  pointsT.splice(choppingBlock, 1);
                  ggbObject.setVisible(selectedObject, false);
                  for (var column = 0; column < 2; column++) {
                      for (var row = 0; row < 5; row++) {
                          ggbObject.evalCommand("ZO_" + labelOnes + "=PointIn(oneRegion)");
                          ggbObject.setCoords(
                              "ZO_" + labelOnes,
                              ggbObject.getXcoord("ig7") + row,
                              ggbObject.getYcoord("ig7") - 3 - column - 2 * rowAdderOnes
                          );
                          ggbObject.setColor("ZO_" + labelOnes, 127, 0, 255);
                          ggbObject.setLayer("ZO_" + labelOnes, 0);
                          pointsO.push("ZO_" + labelOnes);
                          ggbObject.setValue("tensCount3", pointsT.length);
                          ggbObject.setValue("onesCount3", pointsO.length);
                          ggbObject.setVisible("a_1", true);
                          ggbObject.setVisible("b_1", true);
                          ggbObject.setValue("tenBool", true);
                          ggbObject.setValue("oneBool", true);
                          labelOnes++;
                      }
                  }
                  rowAdderOnes = rowAdderOnes + 1;
                  unbundledOnes = unbundledOnes + 1;
                  let beginningReadText = "This dot has been unbundled. ";
                  let finalReadText = beginningReadText.concat(ggbObject.getValueString("updateText"));
                  ggbReadText(finalReadText);
                  sortPointNames();
              }
          }
          if (pointsH.length >= labelHuns2 && pointsT.length >= labelTens2 && pointsO.length >= labelOnes2) {
              //set question button invisible and subtract it button visible
              ggbObject.setValue("subtractReady", true);
          } else {
              ggbObject.setValue("subtractReady", false);
          }
      }

      function checkForMaxMinDragSituation() {
          let selectedObjectXCoord = ggbObject.getXcoord(selectedObject);
          let selectedObjectYCoord = ggbObject.getYcoord(selectedObject);
          let appletMaxXCoord = 9;
          let appletMaxYCoord = 5;
          let appletMinXCoord = -9;
          let appletMinYCoord = -10;

          switch (true) {
              case selectedObject.includes("ZO_"):
                  appletMaxXCoord = 8.99;
                  appletMinXCoord = 3.01;
                  break;
              case selectedObject.includes("TE_"):
                  appletMinXCoord = -3;
                  break;
              case selectedObject.includes("HU_"):
                  appletMaxXCoord = 3;
                  appletMinXCoord = -9;
                  break;
          }

          let minXOnly =
              selectedObjectXCoord === appletMinXCoord &&
              selectedObjectYCoord != appletMinYCoord &&
              selectedObjectYCoord != appletMaxYCoord;
          let maxXOnly =
              selectedObjectXCoord === appletMaxXCoord &&
              selectedObjectYCoord != appletMinYCoord &&
              selectedObjectYCoord != appletMaxYCoord;

          let minYOnly =
              selectedObjectYCoord === appletMinYCoord &&
              selectedObjectXCoord != appletMinXCoord &&
              selectedObjectXCoord != appletMaxXCoord;
          let maxYOnly =
              selectedObjectYCoord === appletMaxYCoord &&
              selectedObjectXCoord != appletMinXCoord &&
              selectedObjectXCoord != appletMaxXCoord;

          let minXAndMinY = selectedObjectXCoord === appletMinXCoord && selectedObjectYCoord === appletMinYCoord;
          let maxXAndMinY = selectedObjectXCoord === appletMaxXCoord && selectedObjectYCoord === appletMinYCoord;
          let maxXAndMaxY = selectedObjectXCoord === appletMaxXCoord && selectedObjectYCoord === appletMaxYCoord;
          let minXAndMaxY = selectedObjectXCoord === appletMinXCoord && selectedObjectYCoord === appletMaxYCoord;

          switch (true) {
              case minXOnly:
                  ggbReadText("This point is at its minimum x value for this interactive.");
                  break;
              case maxXOnly:
                  ggbReadText("This point is at its maximum x value for this interactive.");
                  break;
              case minYOnly:
                  ggbReadText("This point is at its minimum y value for this interactive.");
                  break;
              case maxYOnly:
                  ggbReadText("This point is at its maximum y value for this interactive.");
                  break;
              case minXAndMinY:
                  ggbReadText("This point is at its minimum x and y value for this interactive.");
                  break;
              case maxXAndMinY:
                  ggbReadText("This point is at its maximum x value and minimum y value for this interactive.");
                  break;
              case maxXAndMaxY:
                  ggbReadText("This point is at its maximum x and y value for this interactive.");
                  break;
              case minXAndMaxY:
                  ggbReadText("This point is at its minimum x value and maximum y value for this interactive.");
                  break;
          }
      }

      function sortPointNames() {
          initList = "InputBox4";
          addedList = "";
          enders = "ggbButton1, ggbButton2, ggbButton3";
          ggbObject.setTextValue("addedList", "");
          setTabOrder(initList, addedList, enders);

          let newPointNamesToSort = ggbObject.getAllObjectNames("point");
          let blankArray = [];
          for (let i = 0, L = newPointNamesToSort.length; i < L; i++) {
              if (
                  newPointNamesToSort[i].includes("ZO_") ||
                  newPointNamesToSort[i].includes("TE_") ||
                  newPointNamesToSort[i].includes("HU_")
              ) {
                  blankArray.push(newPointNamesToSort[i]);
              }
          }
          const sortAlphaNum = (a, b) =>
              a.localeCompare(b, "en", {
                  numeric: true,
              });
          // let sortedArray = blankArray.sort();
          let sortedArray = blankArray.sort(sortAlphaNum);
          for (let i = 0, L = sortedArray.length; i < L; i++) {
              addedList = manageAddedList(sortedArray[i], true);
              setTabOrder(initList, addedList, enders);
          }
      }

      function defineButtonClickScripts() {
          // defines button scripts
          // keep this function, but you can delete anything/everything inside it
          return {
              ggbButton1: function() {
                  ggbObject.setValue("subt1", number1);
                  ggbObject.setValue("subt2", number2);
                  popul8();
                  ggbObject.setValue("step", 1);
                  enableButton(3, true);
                  if (number1 == number2) {
                      ggbObject.setValue("subtractReady", true);
                  }
                  ggbReadText("updateText", true);
              },
              ggbButton2: function() {
                  matchIt();
                  ggbObject.setValue("step", 2);
                  ggbReadText("updateText", true);
              },
              ggbButton3: function() {
                  reset();
                  ggbObject.setValue("step", 3);
                  enableButton(3, false);
                  ggbReadText("updateText", true);
              },
              ggbButton4: function() {},
              ggbButton5: function() {},
          };
      }

      function defineKeyboardInstructions(obj) {
          // takes a GGB object name as an argument, returns its keyboard text.

          if (ggbObject.getObjectType(obj) === "point") {
              if (obj.includes("ZO_")) {
                  return "Press the arrow keys to move this dot.";
              } else {
                  return "Press the arrow keys to move this dot.\\\\Press u to unbundle this dot.";
              }
          }

          const keyboardInstructions = {
              InputBox4: "Input a value and click the Display button to submit.",
              ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to display the subtraction problem." : unavailableButtonText,
              ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to subtract the dots." : unavailableButtonText,
              ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to reset your work." : unavailableButtonText,
              ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
              ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
          };
          return keyboardInstructions[obj];
      }

      //unbundles points dragged into new regions
      function clientFunction(a) {
          switch (a.type) {
              case "select":
                  selectedObject = a.target;
                  if (ggbObject.getObjectType(a.target) == "point") {
                      xCoord = ggbObject.getXcoord(a.target);
                      yCoord = ggbObject.getYcoord(a.target);
                  }
                  break;
              case "deselect":
                  selectedObject = "";
                  break;
              case "dragEnd":
                  dragEndKeyUpHotKeyCheck();
                  setTimeout(function() {
                      checkForMaxMinDragSituation();
                  }, 100);
                  break;
          }
      }

      function clickListenerFunction(a) {
          // switch (a) {}
      }

      function keyit(event) {
          // feel free to use event.key instead
          switch (true) {
              case event.key.includes("Arrow"):
                  if (ggbObject.getObjectType(selectedObject) === "point" && ggbObject.getVisible(selectedObject)) {
                      dragEndKeyUpHotKeyCheck();
                  }
                  setTimeout(function() {
                      checkForMaxMinDragSituation();
                  }, 100);
                  break;
              case event.key === "u" && !selectedObject.includes("ZO_"):
                  if (ggbObject.getObjectType(selectedObject) === "point" && ggbObject.getVisible(selectedObject)) {
                      ggbObject.setCoords(
                          selectedObject,
                          ggbObject.getXcoord(selectedObject) + 6.5,
                          ggbObject.getYcoord(selectedObject)
                      );
                      dragEndKeyUpHotKeyCheck();
                  }
                  break;
          }
      }

      //add new stuff above this line
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
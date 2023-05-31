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
      } = setupGGB({
          name,
          ggbObject,
          defineKeyboardInstructions,
          buttonClicks,
          statusName,
          preventCustomFocusIndicators: true,
      });
      const ggbcanvas = getCanvas();

      /*
       * IGNORE above
       * EDIT below
       */

      setAriaLabel(ggbcanvas, "Arranging Rectangle Side Lengths Interactive");

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

      function defineButtonClickScripts() {
          // defines button scripts
          // keep this function, but you can delete anything/everything inside it
          return {
              ggbButton1: function() {
                  createSides();
                  enableButton(1, false);
                  enableButton(2, true);
                  enableButton(3, true);
                  ggbReadText("Points have been created on the corners of the rectangle. Use the Break Apart Button to pull apart the sides.");
                  ggbObject.setFixed("InputBox1", true, false); //string name, fixed, selection allowed
                  ggbObject.setFixed("InputBox2", true, false); //string name, fixed, selection allowed
              },
              ggbButton2: function() {
                  enableButton(2, false);
                  moveSides();
                  ggbObject.setValue("ShowTop", true);
                  ggbReadText("Moveable side length segments have been created.");
              },
              ggbButton3: function() {
                  reset();
                  enableButton(1, true);
                  enableButton(2, false);
                  enableButton(3, false);
                  ggbObject.setFixed("InputBox1", true, true); //string name, fixed, selection allowed
                  ggbObject.setFixed("InputBox2", true, true); //string name, fixed, selection allowed
              },
              ggbButton4: function() {},
              ggbButton5: function() {},
          };
      }

      function defineKeyboardInstructions(obj) {
          // takes a GGB object name as an argument, returns its keyboard text.
          const keyboardInstructions = {
              InputBox1: "Enter a number between 1 and 10 and press enter to submit.",
              InputBox2: "Enter a number between 1 and 10 and press enter to submit.",
              MoveTop3: "Use the arrow keys to move the segment.",
              MoveRight3: "Use the arrow keys to move the segment.",
              MoveLeft3: "Use the arrow keys to move the segment.",
              MoveBottom3: "Use the arrow keys to move the segment.",
              RotateTop3: "Use + or - to move this point.",
              RotateRight3: "Use + or - to move this point.",
              RotateLeft3: "Use + or - to move this point.",
              RotateBottom3: "Use + or - to move this point.",
              ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to display the sides of the rectangle." : unavailableButtonText,
              ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to break apart the sides of the rectangle." : unavailableButtonText,
              ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to reset the interactive." : unavailableButtonText,
              ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
              ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
          };
          return keyboardInstructions[obj];
      }

      var selectedObject = "";
      let spaceCount = ggbObject.getValue("spaceCounter");
      let isLastTop3 = ggbObject.getValue("indexLastRotateTop3");
      let indexOfTop3 = ggbObject.getValue("indexRotateTop3");
      let isLastLeft3 = ggbObject.getValue("indexLastRotateLeft3");
      let indexOfLeft3 = ggbObject.getValue("indexRotateLeft3");
      let isLastBottom3 = ggbObject.getValue("indexLastRotateBottom3");
      let indexOfBottom3 = ggbObject.getValue("indexRotateBottom3");
      let isLastRight3 = ggbObject.getValue("indexLastRotateRight3");
      let indexOfRight3 = ggbObject.getValue("indexRotateRight3");

      function clientFunction(a) {
          var clientTarget = a.target;
          switch (a.type) {
              case "select":
                  selectedObject = clientTarget;
                  switch (clientTarget) {
                      case "InputBox1":
                          ggbObject.setValue("flag", false);
                          break;
                      case "MoveTop3":
                      case "RotateTop3":
                          ggbObject.setLayer("MoveTop3", 5);
                          ggbObject.setLayer("RotateTop3", 5);
                          ggbObject.setLayer("MoveBottom3", 4);
                          ggbObject.setLayer("RotateBottom3", 4);
                          ggbObject.setLayer("MoveRight3", 4);
                          ggbObject.setLayer("RotateRight3", 4);
                          ggbObject.setLayer("MoveLeft3", 4);
                          ggbObject.setLayer("RotateLeft3", 4);
                          ggbObject.setValue("ShowTop", true);
                          ggbObject.setValue("ShowRight", false);
                          ggbObject.setValue("ShowBottom", false);
                          ggbObject.setValue("ShowLeft", false);
                          break;
                      case "MoveRight3":
                      case "RotateRight3":
                          ggbObject.setLayer("MoveTop3", 4);
                          ggbObject.setLayer("RotateTop3", 4);
                          ggbObject.setLayer("MoveBottom3", 4);
                          ggbObject.setLayer("RotateBottom3", 4);
                          ggbObject.setLayer("MoveRight3", 5);
                          ggbObject.setLayer("RotateRight3", 5);
                          ggbObject.setLayer("MoveLeft3", 4);
                          ggbObject.setLayer("RotateLeft3", 4);
                          ggbObject.setValue("ShowTop", false);
                          ggbObject.setValue("ShowRight", true);
                          ggbObject.setValue("ShowBottom", false);
                          ggbObject.setValue("ShowLeft", false);
                          break;
                      case "MoveBottom3":
                      case "RotateBottom3":
                          ggbObject.setLayer("MoveTop3", 4);
                          ggbObject.setLayer("RotateTop3", 4);
                          ggbObject.setLayer("MoveBottom3", 5);
                          ggbObject.setLayer("RotateBottom3", 5);
                          ggbObject.setLayer("MoveRight3", 4);
                          ggbObject.setLayer("RotateRight3", 4);
                          ggbObject.setLayer("MoveLeft3", 4);
                          ggbObject.setLayer("RotateLeft3", 4);
                          ggbObject.setValue("ShowTop", false);
                          ggbObject.setValue("ShowRight", false);
                          ggbObject.setValue("ShowBottom", true);
                          ggbObject.setValue("ShowLeft", false);
                          break;
                      case "MoveLeft3":
                      case "RotateLeft3":
                          ggbObject.setLayer("MoveTop3", 4);
                          ggbObject.setLayer("RotateTop3", 4);
                          ggbObject.setLayer("MoveBottom3", 4);
                          ggbObject.setLayer("RotateBottom3", 4);
                          ggbObject.setLayer("MoveRight3", 4);
                          ggbObject.setLayer("RotateRight3", 4);
                          ggbObject.setLayer("MoveLeft3", 5);
                          ggbObject.setLayer("RotateLeft3", 5);
                          ggbObject.setValue("ShowTop", false);
                          ggbObject.setValue("ShowRight", false);
                          ggbObject.setValue("ShowBottom", false);
                          ggbObject.setValue("ShowLeft", true);
                          break;
                  }
                  break;
              case "deselect":
                  // on deselect always: stop showing keyboard instructions temporarily, update keyboard instructions
                  // // required replacement 7
                  selectedObject = "";
                  ggbObject.setValue("showKeyboardInstructionsTemporarily", false);
                  updateKeyboardInstructions();
                  ggbObject.setValue("ShowTop", false);
                  ggbObject.setValue("ShowRight", false);
                  ggbObject.setValue("ShowBottom", false);
                  ggbObject.setValue("ShowLeft", false);
                  // end 7
                  break;
              case "dragEnd":
                  if (selectedObject === "MoveBottom3") {
                      ggbReadText("moveBottomMinMax", true);
                  } else if (selectedObject === "MoveLeft3") {
                      ggbReadText("moveLeftMinMax", true);
                  } else if (selectedObject === "MoveRight3") {
                      ggbReadText("moveRightMinMax", true);
                  } else if (selectedObject === "MoveTop3") {
                      ggbReadText("moveTopMinMax", true);
                  } else if (
                      selectedObject === "RotateTop3" ||
                      selectedObject === "RotateBottom3" ||
                      selectedObject === "RotateLeft3" ||
                      selectedObject === "RotateRight3"
                  ) {
                      ggbReadText("rotateText", true);
                  }
                  isLastTop3 = ggbObject.getValue("indexLastRotateTop3");
                  indexOfTop3 = ggbObject.getValue("indexRotateTop3");
                  isLastLeft3 = ggbObject.getValue("indexLastRotateLeft3");
                  indexOfLeft3 = ggbObject.getValue("indexRotateLeft3");
                  isLastBottom3 = ggbObject.getValue("indexLastRotateBottom3");
                  indexOfBottom3 = ggbObject.getValue("indexRotateBottom3");
                  isLastRight3 = ggbObject.getValue("indexLastRotateRight3");
                  indexOfRight3 = ggbObject.getValue("indexRotateRight3");
                  break;
          }
      }

      function clickListenerFunction(a) {
          // let length = ggbObject.getValue("length");
          // let width = ggbObject.getValue("width");
          // switch (a) {
          //   case "MoveBottom3":
          //   case "RotateBottom3":
          //   case "RotateTop3":
          //   case "MoveTop3":
          //   case "MoveRight3":
          //   case "RotateRight3":
          //   case "RotateLeft3":
          //   case "MoveLeft3":
          //     if (spaceCount === 0) {
          //       ggbObject.setCoords("MoveBottom3", 0, -5);
          //       ggbObject.setCoords("RotateBottom3", length, -5);
          //       ggbObject.setCoords("MoveLeft3", length, -5);
          //       ggbObject.setCoords("RotateLeft3", length + width, -5);
          //       ggbObject.setCoords("MoveTop3", length + width, -5);
          //       ggbObject.setCoords("RotateTop3", 2 * length + width, -5);
          //       ggbObject.setCoords("MoveRight3", 2 * length + width, -5);
          //       ggbObject.setCoords("RotateRight3", 2 * length + 2 * width, -5);
          //       spaceCount = 1;
          //     } else if (spaceCount === 1) {
          //       ggbObject.setCoords("MoveBottom3", 0, -5);
          //       ggbObject.setCoords("RotateBottom3", length, -5);
          //       ggbObject.setCoords("MoveTop3", length, -5);
          //       ggbObject.setCoords("RotateTop3", 2 * length, -5);
          //       ggbObject.setCoords("MoveLeft3", 2 * length + 3, -5);
          //       ggbObject.setCoords("RotateLeft3", 2 * length + 3 + width, -5);
          //       ggbObject.setCoords("MoveRight3", 2 * length + 3 + width, -5);
          //       ggbObject.setCoords("RotateRight3", 2 * length + 3 + 2 * width, -5);
          //       spaceCount = 2;
          //     } else if (spaceCount === 2) {
          //       ggbObject.setCoords("MoveBottom3", 0, -5);
          //       ggbObject.setCoords("RotateBottom3", length, -5);
          //       ggbObject.setCoords("MoveTop3", length, -5);
          //       ggbObject.setCoords("RotateTop3", 2 * length, -5);
          //       ggbObject.setCoords("MoveLeft3", 2 * length, -5);
          //       ggbObject.setCoords("RotateLeft3", 2 * length + width, -5);
          //       ggbObject.setCoords("MoveRight3", 2 * length + width, -5);
          //       ggbObject.setCoords("RotateRight3", 2 * length + 2 * width, -5);
          //       spaceCount = 0;
          //     }
          //     break;
          // }
      }

      function keyit(event) {
          let length = ggbObject.getValue("length");
          let width = ggbObject.getValue("width");
          if (event.code == "KeyX") {
              ggbObject.evalCommand("SelectObjects(AAppletStatus)");
          }
          if (selectedObject === "RotateTop3") {
              if (isLastTop3 && (event.code == "NumpadAdd" || event.code == "Equal")) {
                  ggbObject.setCoords("RotateTop3", ggbObject.getValue("xFirstTop3"), ggbObject.getValue("yFirstTop3"));
              } else if (indexOfTop3 === 1 && (event.code == "NumpadSubtract" || event.code == "Minus")) {
                  ggbObject.setCoords("RotateTop3", ggbObject.getValue("xLastTop3"), ggbObject.getValue("yLastTop3"));
              }
              ggbReadText("rotateText", true);
              isLastTop3 = ggbObject.getValue("indexLastRotateTop3");
              indexOfTop3 = ggbObject.getValue("indexRotateTop3");
          } else if (selectedObject === "RotateLeft3") {
              if (isLastLeft3 && (event.code == "NumpadAdd" || event.code == "Equal")) {
                  ggbObject.setCoords("RotateLeft3", ggbObject.getValue("xFirstLeft3"), ggbObject.getValue("yFirstLeft3"));
              } else if (indexOfLeft3 === 1 && (event.code == "NumpadSubtract" || event.code == "Minus")) {
                  ggbObject.setCoords("RotateLeft3", ggbObject.getValue("xLastLeft3"), ggbObject.getValue("yLastLeft3"));
              }
              ggbReadText("rotateText", true);
              isLastLeft3 = ggbObject.getValue("indexLastRotateLeft3");
              indexOfLeft3 = ggbObject.getValue("indexRotateLeft3");
          } else if (selectedObject === "RotateBottom3") {
              if (isLastBottom3 && (event.code == "NumpadAdd" || event.code == "Equal")) {
                  ggbObject.setCoords("RotateBottom3", ggbObject.getValue("xFirstBottom3"), ggbObject.getValue("yFirstBottom3"));
              } else if (indexOfBottom3 === 1 && (event.code == "NumpadSubtract" || event.code == "Minus")) {
                  ggbObject.setCoords("RotateBottom3", ggbObject.getValue("xLastBottom3"), ggbObject.getValue("yLastBottom3"));
              }
              ggbReadText("rotateText", true);
              isLastBottom3 = ggbObject.getValue("indexLastRotateBottom3");
              indexOfBottom3 = ggbObject.getValue("indexRotateBottom3");
          } else if (selectedObject === "RotateRight3") {
              if (isLastRight3 && (event.code == "NumpadAdd" || event.code == "Equal")) {
                  ggbObject.setCoords("RotateRight3", ggbObject.getValue("xFirstRight3"), ggbObject.getValue("yFirstRight3"));
              } else if (indexOfRight3 === 1 && (event.code == "NumpadSubtract" || event.code == "Minus")) {
                  ggbObject.setCoords("RotateRight3", ggbObject.getValue("xLastRight3"), ggbObject.getValue("yLastRight3"));
              }
              ggbReadText("rotateText", true);
              isLastRight3 = ggbObject.getValue("indexLastRotateRight3");
              indexOfRight3 = ggbObject.getValue("indexRotateRight3");
          }
          if (event.code == "ArrowUp" || event.code == "ArrowDown" || event.code == "ArrowLeft" || event.code == "ArrowRight") {
              if (selectedObject === "MoveBottom3") {
                  ggbReadText("moveBottomMinMax", true);
              } else if (selectedObject === "MoveLeft3") {
                  ggbReadText("moveLeftMinMax", true);
              } else if (selectedObject === "MoveRight3") {
                  ggbReadText("moveRightMinMax", true);
              } else if (selectedObject === "MoveTop3") {
                  ggbReadText("moveTopMinMax", true);
              }
          }
          if (event.code == "Space") {
              if (ggbObject.getObjectType(selectedObject) === "point") {
                  if (spaceCount === 0) {
                      ggbObject.setCoords("MoveBottom3", 0, -5);
                      ggbObject.setCoords("RotateBottom3", length, -5);
                      ggbObject.setCoords("MoveLeft3", length, -5);
                      ggbObject.setCoords("RotateLeft3", length + width, -5);
                      ggbObject.setCoords("MoveTop3", length + width, -5);
                      ggbObject.setCoords("RotateTop3", 2 * length + width, -5);
                      ggbObject.setCoords("MoveRight3", 2 * length + width, -5);
                      ggbObject.setCoords("RotateRight3", 2 * length + 2 * width, -5);
                      spaceCount = 1;
                  } else if (spaceCount === 1) {
                      ggbObject.setCoords("MoveBottom3", 0, -5);
                      ggbObject.setCoords("RotateBottom3", length, -5);
                      ggbObject.setCoords("MoveTop3", length, -5);
                      ggbObject.setCoords("RotateTop3", 2 * length, -5);
                      ggbObject.setCoords("MoveLeft3", 2 * length + 3, -5);
                      ggbObject.setCoords("RotateLeft3", 2 * length + 3 + width, -5);
                      ggbObject.setCoords("MoveRight3", 2 * length + 3 + width, -5);
                      ggbObject.setCoords("RotateRight3", 2 * length + 3 + 2 * width, -5);
                      spaceCount = 2;
                  } else if (spaceCount === 2) {
                      ggbObject.setCoords("MoveBottom3", 0, -5);
                      ggbObject.setCoords("RotateBottom3", length, -5);
                      ggbObject.setCoords("MoveTop3", length, -5);
                      ggbObject.setCoords("RotateTop3", 2 * length, -5);
                      ggbObject.setCoords("MoveLeft3", 2 * length, -5);
                      ggbObject.setCoords("RotateLeft3", 2 * length + width, -5);
                      ggbObject.setCoords("MoveRight3", 2 * length + width, -5);
                      ggbObject.setCoords("RotateRight3", 2 * length + 2 * width, -5);
                      spaceCount = 0;
                  }
              }
          }
      }

      registerSafeObjectUpdateListener("rotateTop3InRegion", rotateTop);
      registerSafeObjectUpdateListener("time", playable);
      //registerSafeObjectUpdateListener("InputBox1", inputChange);
      //registerSafeObjectUpdateListener("InputBox2", inputChange);
      registerSafeObjectUpdateListener("width", valueChange);
      registerSafeObjectUpdateListener("length", valueChange);

      //When Input Boxes are updated
      // function inputChange() {
      //   ggbObject.setValue("length", ggbObject.getValue("length"));
      //   ggbObject.setValue("width", values[1].text);
      // }

      function rotateTop() {
          let length = ggbObject.getValue("length");
          let width = ggbObject.getValue("width");
          if (!ggbObject.getValue("rotateTop3InRegion")) {
              if (ggbObject.getXcoord("MoveTop3") > 32) {
                  ggbObject.setCoords("RotateTop3", ggbObject.getXcoord("MoveTop3") - length, ggbObject.getYcoord("MoveTop3"));
              } else {
                  ggbObject.setCoords("RotateTop3", ggbObject.getXcoord("MoveTop3") + length, ggbObject.getYcoord("MoveTop3"));
              }
          }
      }

      function valueChange() {
          reset();
      }

      //Object Update Listener of time
      //Time 0-1, increment OF 0.01, speed=speed
      //speed=10
      function playable() {
          ggbObject.setCoords("MoveLeft3", ggbObject.getXcoord("PointBL") - 2, ggbObject.getYcoord("PointBL"));
          ggbObject.setCoords("MoveTop3", ggbObject.getXcoord("PointTL"), ggbObject.getYcoord("PointTL") + 2);
          ggbObject.setCoords("MoveBottom3", ggbObject.getXcoord("PointBR"), ggbObject.getYcoord("PointBR") - 2);
          ggbObject.setCoords("MoveRight3", ggbObject.getXcoord("PointTR") + 2, ggbObject.getYcoord("PointTR"));
          ggbObject.setCoords("RotateLeft3", ggbObject.getXcoord("PointTL") - 2, ggbObject.getYcoord("PointTL"));
          ggbObject.setCoords("RotateTop3", ggbObject.getXcoord("PointTR"), ggbObject.getYcoord("PointTR") + 2);
          ggbObject.setCoords("RotateBottom3", ggbObject.getXcoord("PointBL"), ggbObject.getYcoord("PointBL") - 2);
          ggbObject.setCoords("RotateRight3", ggbObject.getXcoord("PointBR") + 2, ggbObject.getYcoord("PointBR"));
          if (ggbObject.getValue("time") == 1) {
              ggbObject.setValue("Step2Visible", false);
              ggbObject.setValue("Step3Visible", true);
              ggbObject.setValue("ShowTop", true);
          }
      }

      //Fires on button 1 - "Show Sides"
      function createSides() {
          ggbObject.setValue("Step1Visible", true);
          ggbObject.setCoords("MoveLeft", ggbObject.getXcoord("PointBL"), ggbObject.getYcoord("PointBL"));
          ggbObject.setCoords("MoveTop", ggbObject.getXcoord("PointTL"), ggbObject.getYcoord("PointTL"));
          ggbObject.setCoords("MoveBottom", ggbObject.getXcoord("PointBR"), ggbObject.getYcoord("PointBR"));
          ggbObject.setCoords("MoveRight", ggbObject.getXcoord("PointTR"), ggbObject.getYcoord("PointTR"));
          ggbObject.setCoords("RotateLeft", ggbObject.getXcoord("PointTL"), ggbObject.getYcoord("PointTL"));
          ggbObject.setCoords("RotateTop", ggbObject.getXcoord("PointTR"), ggbObject.getYcoord("PointTR"));
          ggbObject.setCoords("RotateBottom", ggbObject.getXcoord("PointBL"), ggbObject.getYcoord("PointBL"));
          ggbObject.setCoords("RotateRight", ggbObject.getXcoord("PointBR"), ggbObject.getYcoord("PointBR"));
      }

      //Fires on Button 2 - "Break Apart"
      function moveSides() {
          ggbObject.setValue("Step1Visible", true);
          ggbObject.setValue("Step1Visible", false);
          ggbObject.setValue("Step2Visible", true);
          ggbObject.setAnimating("time", true);
          ggbObject.startAnimation();
      }

      //Fires on Button 3 - "Reset"
      function reset() {
          ggbObject.setValue("Step1Visible", false);
          ggbObject.setValue("Step2Visible", false);
          ggbObject.setValue("Step3Visible", false);
          ggbObject.setValue("time", 0);
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

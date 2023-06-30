function ggbOnInit(name, ggbObject) {
  const arialabel = "Angles Interactive";
  const ggbcanvasarray = document.querySelectorAll("canvas");
  for (let i = 0; i < ggbcanvasarray.length; i++) {
    const parameterID = ggbcanvasarray[i].closest("div.appletParameters,div.notranslate").getAttribute("id");
    const canvasID = "canvas" + parameterID;
    ggbcanvasarray[i].setAttribute("id", canvasID);
  }
  const id = "canvas" + name;
  const ggbcanvas = document.getElementById(id);
  if (ggbcanvas) {
    ggbcanvas.setAttribute("aria-label", arialabel);
  }

  // ggbObject.setErrorDialogsActive(false);

  ////////////////////////////////////////////////////////
  // let selectedObject = "";

  // function button1Click() {
  //   // button 1 code here
  //   //  enableButton(1, false); //use this structure to enable or disable any of the (up to) 5 buttons
  //   //  ggbObject.evalCommand('ReadText("What happened as a result of the button click.")');
  // }

  // function button2Click() {
  //   // button 2 code here
  // }

  // function button3Click() {
  //   // button 3 code here
  // }

  // function button4Click() {
  //   // button 4 code here
  // }

  // function button5Click() {
  //   // button 5 code here
  // }

  // restore object listeners
  // ggbObject.registerAddListener(function (a) {
  //   const assignment = {
  //     DangleDAB: {
  //       type: "click",
  //       callback: cycle,
  //     },
  //     showLinearPair: {
  //       type: "update",
  //       callback: checkbox,
  //     },
  //     CangleCAE: {
  //       type: "click",
  //       callback: cycle,
  //     },
  //     optionSelected: {
  //       type: "update",
  //       callback: dropdown,
  //     },
  //     // add more here if you have more objects
  //   };
  //   if (assignment[a]) {
  //     const reAddedProperties = assignment[a];
  //     switch (reAddedProperties.type) {
  //       case "click":
  //         ggbObject.registerObjectClickListener(a, reAddedProperties.callback);
  //         break;
  //       case "update":
  //         // delay update registration within the call stack to prevent premature firing
  //         setTimeout(function () {
  //           ggbObject.registerObjectUpdateListener(a, reAddedProperties.callback);
  //         });
  //     }
  //   }
  // });
  ///////////////////////////////////
  // ggbObject.registerClientListener(focusIndicatorsAndErrorMessages);
  // ggbObject.registerClickListener(buttonAndIconClicks);
  // ggbObject.registerObjectClickListener("DangleDAB", cycle);
  // ggbObject.registerObjectClickListener("CangleCAE", cycle);
  // ggbcanvas.addEventListener("keyup", keyit);
  // ggbObject.registerObjectUpdateListener("showLinearPair", checkbox);
  // // ggbObject.registerObjectClickListener("dropDownList", dropdown);
  // ggbObject.registerObjectUpdateListener("optionSelected", dropdown);

  // const barButtons = ["ggbButton1", "ggbButton2", "ggbButton3", "ggbButton4", "ggbButton5"];

  function focusIndicatorsAndErrorMessages(a) {
    let xmlstring;
    let parser;
    let xmldom;
    let serializer;

    switch (a.type) {
      case "dragEnd":
        xmlstring = ggbObject.getXML(a.target);
        parser = new DOMParser();
        xmldom = parser.parseFromString(xmlstring, "application/xml");
        xmldom.getElementsByTagName("animation")[0].setAttribute("step", "1°");
        serializer = new XMLSerializer();
        xmlstring = serializer.serializeToString(xmldom);
        ggbObject.evalXML(xmlstring);
        if (a.target == "DangleDAB") {
          let xmlstring2 = ggbObject.getXML("CangleCAE");
          const parser2 = new DOMParser();
          const xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
          xmldom2.getElementsByTagName("animation")[0].setAttribute("step", "1°");
          const serializer = new XMLSerializer();
          xmlstring2 = serializer.serializeToString(xmldom2);
          ggbObject.evalXML(xmlstring2);
        } else {
          let xmlstring2 = ggbObject.getXML("DangleDAB");
          const parser2 = new DOMParser();
          const xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
          xmldom2.getElementsByTagName("animation")[0].setAttribute("step", "1°");
          const serializer = new XMLSerializer();
          xmlstring2 = serializer.serializeToString(xmldom2);
          ggbObject.evalXML(xmlstring2);
        }
        ggbObject.setValue("currentStep", 1);
        ggbObject.evalCommand("ReadText(status+stepText)");

        break;
      case "mouseDown":
        if (a.hits[0] == "DangleDAB" || a.hit[0] == "CangleCAE") {
          let xmlstring = ggbObject.getXML(a.hits[0]);
          const parser = new DOMParser();
          const xmldom = parser.parseFromString(xmlstring, "application/xml");
          xmldom.getElementsByTagName("animation")[0].setAttribute("step", "5°");
          ggbObject.setValue("currentStep", 5);
          const serializer = new XMLSerializer();
          xmlstring = serializer.serializeToString(xmldom);
          ggbObject.evalXML(xmlstring);
          if (a.hits[0] == "DangleDAB") {
            let xmlstring2 = ggbObject.getXML("CangleCAE");
            const parser2 = new DOMParser();
            const xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
            xmldom2.getElementsByTagName("animation")[0].setAttribute("step", "5°");
            const serializer = new XMLSerializer();
            xmlstring2 = serializer.serializeToString(xmldom2);
            ggbObject.evalXML(xmlstring2);
          } else {
            let xmlstring2 = ggbObject.getXML("DangleDAB");
            const parser2 = new DOMParser();
            const xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
            xmldom2.getElementsByTagName("animation")[0].setAttribute("step", "5°");
            const serializer = new XMLSerializer();
            xmlstring2 = serializer.serializeToString(xmldom2);
            ggbObject.evalXML(xmlstring2);
          }
        }
        break;
      // case "select":
      //   selectedObject = a.target;
      // const myVals =
      //   a.target == "instructionsIcon"
      //     ? 1
      //     : a.target == "xIcon"
      //     ? 2
      //     : a.target == "AAppletStatus"
      //     ? 3
      //     : a.target == "dropDownList"
      //     ? 4
      //     : a.target == "DangleDAB" || a.target == "CangleCAE"
      //     ? 5
      //     : 6;
      // switch (selectedObject) {
      //   // case 1:
      //   //   ggbObject.setVisible("instructionsIconFocusIndicator", true);
      //   //   // ggbObject.setVisible("displayedGGBButtonMessage", false);
      //   //   break;
      //   // case 2:
      //   //   ggbObject.setVisible("xIconFocusIndicator", true);
      //   //   // ggbObject.setVisible("displayedGGBButtonMessage", false);
      //   //   break;
      //   // case 3:
      //   //   ggbObject.setValue(
      //   //     "escTextCount",
      //   //     ggbObject.getValue("escTextCount") + 1
      //   //   );
      //   //   break;
      //   case "dropDownList":
      //     ggbObject.evalCommand("ReadText(selectAngleText)");
      //     break;
      //   case "DangleDAB":
      //   case "CangleCAE":
      //     ggbObject.evalCommand("ReadText(stepText)");
      //     break;
      //   default:
      //     if (barButtons.includes(a.target) && !ggbObject.getValue(a.target + "Enabled")) {
      //       disabledButtonDisplayMessage();
      //     } else {
      //       // ggbObject.setVisible("displayedGGBButtonMessage", false);
      //     }
      // }
      // const myVals =
      //   a.target == "instructionsIcon"
      //     ? 1
      //     : a.target == "xIcon"
      //     ? 2
      //     : a.target == "AAppletStatus"
      //     ? 3
      //     : a.target == "dropDownList"
      //     ? 4
      //     : a.target == "DangleDAB" || a.target == "CangleCAE"
      //     ? 5
      //     : 6;
      // switch (myVals) {
      //   case 1:
      //     ggbObject.setVisible("instructionsIconFocusIndicator", true);
      //     // ggbObject.setVisible("displayedGGBButtonMessage", false);
      //     break;
      //   case 2:
      //     ggbObject.setVisible("xIconFocusIndicator", true);
      //     // ggbObject.setVisible("displayedGGBButtonMessage", false);
      //     break;
      //   case 3:
      //     ggbObject.setValue(
      //       "escTextCount",
      //       ggbObject.getValue("escTextCount") + 1
      //     );
      //     break;
      //   case 4:
      //     ggbObject.evalCommand("ReadText(selectAngleText)");
      //     break;
      //   case 5:
      //     ggbObject.evalCommand("ReadText(stepText)");
      //     break;
      //   default:
      //     if (
      //       barButtons.includes(a.target) &&
      //       !ggbObject.getValue(a.target + "Enabled")
      //     ) {
      //       disabledButtonDisplayMessage();
      //     } else {
      //       // ggbObject.setVisible("displayedGGBButtonMessage", false);
      //     }
      // }
      //   break;
      // case "deselect":
      //   ggbObject.setVisible("instructionsIconFocusIndicator", false);
      //   ggbObject.setVisible("xIconFocusIndicator", false);
      //   break;
    }
  }

  // function buttonAndIconClicks(a) {
  //   let rawInstructions = "";
  //   let trimmedInstructions = "";
  //   let finalInstructions = "";
  //   switch (a) {
  //     case "instructionsIcon":
  //       rawInstructions = ggbObject.getLaTeXString("instructionsText");
  //       trimmedInstructions = rawInstructions.substr(6, rawInstructions.length - 7);
  //       finalInstructions = trimmedInstructions.concat(" Press space to close the instructions.");
  //       ggbObject.setValue("showInstructions", true);
  //       ggbObject.evalCommand('ReadText("' + finalInstructions + '")');
  //       ggbObject.evalCommand("SelectObjects(xIcon)");
  //       break;
  //     case "xIcon":
  //       ggbObject.setVisible("xIconFocusIndicator", false);
  //       ggbObject.setValue("showInstructions", false);
  //       ggbObject.evalCommand("SelectObjects(instructionsIcon)");
  //       break;

  //     default:
  //       if (barButtons.includes(a)) {
  //         const buttonFunctions = {
  //           ggbButton1: button1Click,
  //           ggbButton2: button2Click,
  //           ggbButton3: button3Click,
  //           ggbButton4: button4Click,
  //           ggbButton5: button5Click,
  //         };
  //         if (buttonFunctions[a] && ggbObject.getValue(a + "Enabled")) {
  //           buttonFunctions[a]();
  //         } else {
  //           disabledButtonDisplayMessage();
  //         }
  //       }
  //   }
  // }

  // function enableButton(buttonNum, boolean) {
  //   ggbObject.setValue("ggbButton" + buttonNum + "Enabled", boolean);
  //   const color = boolean ? "0/255, 11/255, 92/255" : "118/255, 118/255,118/255";
  //   ggbObject.evalCommand("SetBackgroundColor(ggbButton" + buttonNum + ", " + color + ")");
  // }

  // function disabledButtonDisplayMessage() {}

  // //cycle through point increments
  // function cycle(a) {
  //   let xmlstring = ggbObject.getXML(a);
  //   const parser = new DOMParser();
  //   const xmldom = parser.parseFromString(xmlstring, "application/xml");
  //   let step = xmldom.getElementsByTagName("animation")[0].getAttribute("step");
  //   switch (step) {
  //     case "10°":
  //       xmldom.getElementsByTagName("animation")[0].setAttribute("step", "5°");
  //       ggbObject.setValue("currentStep", 5);
  //       ggbObject.evalCommand("ReadText(stepText)");
  //       break;
  //     case "5°":
  //       xmldom.getElementsByTagName("animation")[0].setAttribute("step", "1°");
  //       ggbObject.setValue("currentStep", 1);
  //       ggbObject.evalCommand("ReadText(stepText)");
  //       break;
  //     case "1°":
  //       xmldom.getElementsByTagName("animation")[0].setAttribute("step", "10°");
  //       ggbObject.setValue("currentStep", 10);
  //       ggbObject.evalCommand("ReadText(stepText)");
  //   }
  //   const serializer = new XMLSerializer();
  //   xmlstring = serializer.serializeToString(xmldom);
  //   ggbObject.evalXML(xmlstring);
  //   step = xmldom.getElementsByTagName("animation")[0].getAttribute("step");
  //   if (a == "DangleDAB") {
  //     let xmlstring2 = ggbObject.getXML("CangleCAE");
  //     const parser2 = new DOMParser();
  //     const xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
  //     xmldom2.getElementsByTagName("animation")[0].setAttribute("step", step);
  //     const serializer = new XMLSerializer();
  //     xmlstring2 = serializer.serializeToString(xmldom2);
  //     ggbObject.evalXML(xmlstring2);
  //   } else {
  //     let xmlstring2 = ggbObject.getXML("DangleDAB");
  //     const parser2 = new DOMParser();
  //     const xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
  //     xmldom2.getElementsByTagName("animation")[0].setAttribute("step", step);
  //     const serializer = new XMLSerializer();
  //     xmlstring2 = serializer.serializeToString(xmldom2);
  //     ggbObject.evalXML(xmlstring2);
  //   }
  // }

  // function keyit(event) {
  //   if (
  //     (selectedObject.includes("angle") &&
  //       // took out arrow keys because arrows are used for the dropdown box
  //       event.key == "+") ||
  //     event.key == "-"
  //   ) {
  //     check();
  //   }
  // }

  // function check() {
  //   ggbObject.evalCommand("ReadText(status+stepText)");
  // }

  // function checkbox() {
  //   setTimeout(function () {
  //     ggbObject.evalCommand("ReadText(angleText)");
  //   }, 500);
  // }

  // function dropdown() {
  //   if (ggbObject.getValue("optionSelected") == 1) {
  //     ggbObject.evalCommand('ReadText("Point C is moveable.")');
  //   } else {
  //     ggbObject.evalCommand('ReadText("Point D is moveable.")');
  //   }
  // }
}
function ggbOnInit(name, ggbObject) {
  loadUtils().then(function (setupGGB) {
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
    });
    const ggbcanvas = getCanvas(name);

    /*
     * IGNORE above
     * EDIT below
     */

    //global-ish variables
    let viewAnimate = false;
    let startAnimation = false;
    let selectedObject = "";
    const moverPoints = [
      "CubeMover",
      "ConeEdge",
      "CylinderEdge",
      "HemisphereEdge",
      "HexMover",
      "RectanglePt2",
      "SphereEdge",
      "SquarePyramidMover",
      "TriPrismMover",
      "TriPyramidMover",
    ];

    const showDIBooleans = [
      "showCubeArrows",
      "showConeArrows",
      "showCylinderArrows",
      "showHemiArrows",
      "showHexArrows",
      "showRecPrismArrows",
      "showSphereArrows",
      "showSPArrows",
      "showTPrismArrows",
      "showTPyramidArrows",
    ];

    let storedViewNum = ggbObject.getValue("viewSelected"); //needed to keep track of when shape view is animating

    //register my listeners
    registerSafeObjectUpdateListener("viewSelected", setView);
    registerSafeObjectUpdateListener("viewPoint", updateViewDropDown);

    setAriaLabel(ggbcanvas, "Growing Shapes Interactive");

    function defineStatusName() {
      // put the name of your GGB status text object here
      return "AAppletStatus";
    }
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

    function defineButtonClickScripts() {
      // defines button scripts
      // keep this function, but you can delete anything/everything inside it
      return {
        ggbButton1: function () {
          ggbObject.evalCommand("SetViewDirection()");
          // enableButton(1, false);
        },
        ggbButton2: function () {
          enableButton(1, true);
          enableButton(2, false);
        },
        ggbButton3: function () {},
        ggbButton4: function () {},
        ggbButton5: function () {},
      };
    }

    function defineKeyboardInstructions(obj) {
      // takes a GGB object name as an argument, returns its keyboard text.
      if (moverPoints.includes(obj)) {
        return "Use + or – to move this point.";
      }
      const keyboardInstructions = {
        // A: "Press the arrow keys to move this point.", // example for a point
        height: "Press the up and down arrow keys to change the value.",
        dropDown:
          "Press space to open. Press up arrow and down arrow\\\\to go to different options. Press enter to select.",
        viewDropDown:
          "Press space to open. Press up arrow and down arrow\\\\to go to different options. Press enter to select.",
        ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
      };
      return keyboardInstructions[obj];
    }

    function clientFunction(a) {
      // console.log(a);
      switch (a.type) {
        case "select":
          selectedObject = a.target;
          if (moverPoints.includes(selectedObject)) {
            //need to set the correct boolean to true to show DIs
            let tempIndex = moverPoints.indexOf(selectedObject);
            ggbObject.setValue(showDIBooleans[tempIndex], true);
          }
          break;
        case "deselect":
          showDIBooleans.forEach((el) => {
            ggbObject.setValue(el, false);
          });
          selectedObject = "";
          break;
        case "viewChanged3D":
          break;
        case "mouseDown":
          if (a.viewNo === 512) {
            //mouseDown in 3D
            // console.log("mouseDown in 3D view");
            viewAnimate = false;
            ggbObject.enableShiftDragZoom(true);
          }
          break;
        case "dragEnd":
          break;
      }
    }

    function clickListenerFunction(a) {
      // switch (a) {}
    }

    function keyit(event) {
      // feel free to use event.key instead
      // switch (event.code) {}
    }

    function setView() {
      //sets the view of the applet based on the dropdown selection.
      let viewNum = ggbObject.getValue("viewSelected");

      if (viewNum !== 1) {
        viewAnimate = true;
        startAnimation = true;
        ggbObject.enableShiftDragZoom(false);
      }
      switch (viewNum) {
        case 2:
          //home view
          ggbObject.evalCommand("SetViewDirection()");
          break;
        case 3:
          //top view
          ggbObject.evalCommand("SetViewDirection(topVec)");
          break;
        case 4:
          //side view
          ggbObject.evalCommand("SetViewDirection(sideVec)");
          break;
        case 5:
          //front view
          ggbObject.evalCommand("SetViewDirection(frontVec)");
          break;
      }
      console.log("viewAnimate at end of setView:", viewAnimate);
      console.warn("set view direction start");
    }

    function updateViewDropDown() {
      //if a view is selected and a student uses mouse to move off that view, set the dropdown back to "Select an Option"
      let xCoord = didUtils.round(ggbObject.getXcoord("viewPoint"), 2);
      let yCoord =
        ggbObject.getYcoord("viewPoint") < 0.001 || isNaN(ggbObject.getYcoord("viewPoint"))
          ? 0
          : didUtils.round(ggbObject.getYcoord("viewPoint"), 2);
      let zCoord =
        ggbObject.getZcoord("viewPoint") < 0.001 || isNaN(ggbObject.getZcoord("viewPoint"))
          ? 0
          : didUtils.round(ggbObject.getZcoord("viewPoint"), 2);

      let coordsArray = [xCoord, yCoord, zCoord];
      let homeArray = [-0.47, 0.81, 0];
      let frontArray = [0, 1, 0];
      let sideArray = [-1, 0, 0];
      let topArray = [0, 0, 0];

      let trackObject = {
        2: homeArray,
        3: topArray,
        4: sideArray,
        5: frontArray,
      };

      if (viewAnimate) {
        //check to see if its double counting where it started
        if (
          coordsArray[0] === trackObject[storedViewNum.toString()][0] &&
          coordsArray[1] === trackObject[storedViewNum.toString()][1] &&
          coordsArray[2] === trackObject[storedViewNum.toString()][2]
        ) {
          // console.warn("double counting is happening!")
        }
      }

      // console.log("viewAnimate before switch in update:", viewAnimate);
      // console.log("x:", coordsArray[0], "y:", coordsArray[1], "z:", coordsArray[2]);

      switch (true) {
        case coordsArray[0] === homeArray[0] && coordsArray[1] === homeArray[1] && coordsArray[2] === homeArray[2]:
          // console.log("at home");
          viewAnimate = false;
          ggbObject.enableShiftDragZoom(true);
          storedViewNum = ggbObject.getValue("viewSelected");
          break;
        case coordsArray[0] === frontArray[0] && coordsArray[1] === frontArray[1] && coordsArray[2] === frontArray[2]:
          // console.log("front");
          viewAnimate = false;
          ggbObject.enableShiftDragZoom(true);
          storedViewNum = ggbObject.getValue("viewSelected");
          break;
        case coordsArray[0] === sideArray[0] && coordsArray[1] === sideArray[1] && coordsArray[2] === sideArray[2]:
          // console.log("side");
          viewAnimate = false;
          ggbObject.enableShiftDragZoom(true);
          storedViewNum = ggbObject.getValue("viewSelected");
          break;
        case coordsArray[0] === topArray[0] && coordsArray[1] === topArray[1] && coordsArray[2] === topArray[2]:
          // console.log("top");
          viewAnimate = false;
          ggbObject.enableShiftDragZoom(true);
          storedViewNum = ggbObject.getValue("viewSelected");
          break;
        case !viewAnimate:
          // console.log("random loc");
          // console.log("set to Select an Option");
          ggbObject.setValue("viewDropDown", 1);
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

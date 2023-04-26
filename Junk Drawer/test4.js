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

    setAriaLabel(ggbcanvas, "Zoom Interactive");

    // tabOrder = {AAppletStatus, instructionsIcon, xIcon, NewA, NewB, NewC, picDefZoomOut, picDefZoomIn, picDefHome}

    var initList = "NewA, NewB, NewC"; // A list of all things desired in the tabOrder on initialization of the applet. One string, separated by commas. No need to add status name, instructionIcon or xIcon. Those are added in the library.
    var addedList = ""; // A list of all items added since the first initialization (e.g., objects created onthe fly). One string, separated by commas.
    var enders = "ggbButton1"; // A list of all items that need to be at the end of the tabOrder list. One string, separated by commas.

    // Needed for going forward and back a slide
    if (ggbObject.getValue("Length(tabOrder)") === 0) {
      setTabOrder(initList, addedList, enders);
    }

    // Add this to your code when needed.
    addedList = manageAddedList("Point4", true); // to add Point4 to the tabOrder
    // addedList = manageAddedList("Point4", false) // to remove Point4 from tabOrder <- Use this before deleting the GGB object, if applicable
    setTabOrder(initList, addedList, enders);

    ggbObject.setErrorDialogsActive(false);

    var selectedObject = "";

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

    registerHoverListener();

    registerSafeObjectUpdateListener("corner1", showHideKeyInstr);

    function defineButtonClickScripts() {
      // defines button scripts
      // keep this function, but you can delete anything/everything inside it
      return {
        ggbButton1: function () {
          enableButton(1, false);
          enableButton(2, true);
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
      var stepText = ggbObject.getValueString("stepText");
      var arrowText = "Press the arrow keys to move this point. ";
      var compiledStepText = arrowText.concat(stepText);
      var wrappedStepText = compiledStepText.replace(/(?![^\n]{1,75}$)([^\n]{1,75})\s/g, "$1\\\\");

      const keyboardInstructions = {
        NewA: wrappedStepText,
        NewB: wrappedStepText,
        NewC: wrappedStepText,
        picDefHome: ggbObject.getValue("enableHome")
          ? "Press space to reset to the default zoom."
          : "This button is unavailable. The graph is\\\\at the default zoom.",
        picDefZoomIn: ggbObject.getValue("enableZoomIn")
          ? "Press space to zoom in on the graph."
          : "This button is unavailable. The graph is\\\\zoomed in.",
        picDefZoomOut: "Press space to zoom out of the graph.",
        ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
      };
      return keyboardInstructions[obj];
    }

    function clientFunction(a) {
      switch (a.type) {
        case "select":
          selectedObject = a.target;

          break;
        case "deselect":
          selectedObject = "";
          break;
        case "dragEnd":
          selectedObject = a.target;
          if (ggbObject.getObjectType(selectedObject) === "point") {
            restrictFreePoint(selectedObject);
          }
          setTimeout(function () {
            checkForMaxMinDragSituation();
          }, 100);
          break;
      }
    }

    function clickListenerFunction(a) {
      var zoomStarterText;
      var zoomReadText;
      switch (true) {
        case ggbObject.getObjectType(a) === "point":
          ggbObject.setValue("step", ggbObject.getValue("nextStep"));
          ggbReadText("stepText", true);

          break;
        case a === "picDefHome":
          if (ggbObject.getValue("enableHome") === 1) {
            // ggbObject.evalCommand("ZoomIn(-10.50005,-10.5,10.50005,12.6357)");
            ggbObject.evalCommand("ZoomIn(-11, -11, 11, 13.39)");
            ggbObject.setValue("enableHome", false);
            // ggbObject.setValue("zoomClicked", true);
            ggbObject.setValue("count", 0);
            setTimeout(function () {
              zoomStarterText = "You have reset to the default zoom. ";
              zoomReadText = zoomStarterText.concat(ggbObject.getValueString("windowUpdateText"));
              ggbReadText(zoomReadText);
              ggbObject.evalCommand("SelectObjects(picDefHome)");
            }, 400);
          } else {
            ggbReadText("This button is unavailable. You are at the default zoom.");
            ggbObject.evalCommand("SelectObjects(picDefHome)");
          }
          break;
        case a === "picDefZoomIn":
          ggbObject.evalCommand("ZoomIn(2,(0,0))");
          ggbObject.setValue("enableHome", true);
          // ggbObject.setValue("zoomClicked", true);
          ggbObject.setValue("count", ggbObject.getValue("count") - 1);
          setTimeout(function () {
            zoomStarterText = "You zoomed in by a scale factor of 2. ";
            zoomReadText = zoomStarterText.concat(ggbObject.getValueString("windowUpdateText"));
            ggbReadText(zoomReadText);
            ggbObject.evalCommand("SelectObjects(picDefZoomIn)");
          }, 400);
          break;
        case a === "picDefZoomOut":
          ggbObject.evalCommand("ZoomIn(0.5,(0,0))");
          ggbObject.setValue("enableHome", true);
          // ggbObject.setValue("zoomClicked", true);
          ggbObject.setValue("count", ggbObject.getValue("count") + 1);
          setTimeout(function () {
            zoomStarterText = "You zoomed out by a scale factor of 2. ";
            zoomReadText = zoomStarterText.concat(ggbObject.getValueString("windowUpdateText"));
            ggbReadText(zoomReadText);
            ggbObject.evalCommand("SelectObjects(picDefZoomOut)");
          }, 400);
          break;
      }
    }

    function keyit(event) {
      // feel free to use event.key instead
      switch (true) {
        case event.key.includes("Arrow"):
          if (ggbObject.getObjectType(selectedObject) === "point") {
            restrictFreePoint(selectedObject);
          }
          setTimeout(function () {
            checkForMaxMinDragSituation();
          }, 100);
          break;
      }
    }

    function restrictFreePoint(point) {
      const xCoord = ggbObject.getXcoord(point);
      const yCoord = ggbObject.getYcoord(point);
      const xMin = ggbObject.getValue("minXPoint");
      const xMax = ggbObject.getValue("maxXPoint");
      const yMin = ggbObject.getValue("minYPoint");
      const yMax = ggbObject.getValue("maxYPoint");

      var newXCoord;
      if (xCoord < xMin) {
        newXCoord = xMin;
      } else if (xCoord > xMax) {
        newXCoord = xMax;
      } else {
        newXCoord = xCoord;
      }

      var newYCoord;
      if (yCoord < yMin) {
        newYCoord = yMin;
      } else if (yCoord > yMax) {
        newYCoord = yMax;
      } else {
        newYCoord = yCoord;
      }

      ggbObject.setCoords(point, newXCoord, newYCoord);
    }

    // temp hide key instructions because they're hopping around the screen during zoom. This is due to a setTimeout
    function showHideKeyInstr() {
      if (ggbObject.getValue("showKeyboardInstructions") === 1) {
        ggbObject.setValue("showKeyboardInstructions", false);
        setTimeout(() => {
          ggbObject.setValue("showKeyboardInstructions", true);
        }, 500);
      }
    }

    function checkForMaxMinDragSituation() {
      let selectedObjectXCoord = ggbObject.getXcoord(selectedObject);
      let selectedObjectYCoord = ggbObject.getYcoord(selectedObject);
      let appletMaxXCoord = ggbObject.getValue("maxDragX");
      let appletMaxYCoord = ggbObject.getValue("maxDragY");
      let appletMinXCoord = ggbObject.getValue("minDragX");
      let appletMinYCoord = ggbObject.getValue("minDragY");

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

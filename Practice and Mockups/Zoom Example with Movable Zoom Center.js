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

    var selectedObject = "";
    var homeEnabled = false;

    ggbObject.setErrorDialogsActive(false);

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

    // temp hide key instructions because they hop around the screen during zoom.
    function showHideKeyInstr() {
      if (ggbObject.getValue("showKeyboardInstructions") === 1) {
        ggbObject.setValue("showKeyboardInstructions", false);
        setTimeout(function () {
          ggbObject.setValue("showKeyboardInstructions", true);
        }, 500);
      }
    }

    function defineButtonClickScripts() {
      return {
        ggbButton1: function () {},
        ggbButton2: function () {},
        ggbButton3: function () {},
        ggbButton4: function () {},
        ggbButton5: function () {},
      };
    }

    function defineKeyboardInstructions(obj) {
      const keyboardInstructions = {
        picDefHome: "Press space to reset to the default zoom.",
        picDefHomeDisabled: "This button is unavailable.",
        picDefZoomIn: "Press space to zoom in on the graph.",
        picDefZoomOut: "Press space to zoom out of the graph.",
        ggbButton1: ggbObject.getValue("ggbButton2Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
      };
      return keyboardInstructions[obj];
    }

    function clientFunction(a) {
      console.log("clientListener", a);

      switch (a.type) {
        case "select":
          selectedObject = a.target;
          break;
        case "deselect":
          selectedObject = "";
          break;
      }
    }

    function clickListenerFunction(a) {
      console.log("clickListener", a);
      ggbObject.setValue("tabbed", false);
      var zoomStarterText;
      var zoomReadText;

      switch (true) {
        case a === "picDefHome":
          {
            showHideKeyInstr();

            ggbObject.evalCommand("ZoomIn(-11, -11, 11, 13.39)");
            ggbObject.setValue("enableHome", false);
            ggbObject.setCoords("CrosshairsPoint", 0, 0);
            homeEnabled = false;
            ggbObject.setValue("count", 0);
            // zoomStarterText =
            //   "Zoom home button pressed. This button is unavailable. The graph is set to the default zoom. ";
            // zoomReadText = zoomStarterText.concat(ggbObject.getValueString("windowUpdateText"));
            // ggbReadText(zoomReadText);
            ggbObject.evalCommand("SelectObjects(picDefHomeDisabled)");
            setTimeout(function () {
              updateKeyboardInstructions("picDefHomeDisabled");
              ggbObject.getValueString("windowUpdateText");
            }, 100);
          }
          break;
        case a === "picDefHomeDisabled":
          {
            zoomReadText =
              "Zoom home button pressed. This button is unavailable. The graph is set to the default zoom. ";
            ggbReadText(zoomReadText);
          }
          break;
        case a === "picDefZoomIn":
          {
            showHideKeyInstr();
            ggbObject.evalCommand("ZoomIn(2,CrosshairsPoint)");
            ggbObject.setValue("enableHome", true);
            homeEnabled = true;
            ggbObject.setValue("count", ggbObject.getValue("count") - 1);
            setTimeout(function () {
              // zoomStarterText = "Image zoom in button pressed. You zoomed in by a scale factor of 2. ";
              // zoomReadText = zoomStarterText.concat(ggbObject.getValueString("windowUpdateText"));
              // ggbReadText(zoomReadText);
              ggbObject.evalCommand("SelectObjects(picDefZoomIn)");
              ggbObject.getValueString("windowUpdateText");
            }, 400);
          }
          break;
        case a === "picDefZoomOut":
          {
            showHideKeyInstr();
            ggbObject.evalCommand("ZoomIn(0.5,CrosshairsPoint)");
            ggbObject.setValue("enableHome", true);
            homeEnabled = true;
            ggbObject.setValue("count", ggbObject.getValue("count") + 1);
            setTimeout(function () {
              // zoomStarterText = "Image zoom out button pressed. You zoomed out by a scale factor of 2. ";
              // zoomReadText = zoomStarterText.concat(ggbObject.getValueString("windowUpdateText"));
              // ggbReadText(zoomReadText);
              ggbObject.evalCommand("SelectObjects(picDefZoomOut)");
              ggbObject.getValueString("windowUpdateText");
            }, 400);
          }
          break;
      }
    }

    function keyit(event) {
      console.log("key event");
      // feel free to use event.key instead
      switch (event.key) {
        case "Tab":
          ggbObject.setValue("tabbed", true);
          break;
        case " ":
          ggbObject.setValue("tabbed", false);
          break;
      }
    }
  }); // ALL CODE ABOVE HERE

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

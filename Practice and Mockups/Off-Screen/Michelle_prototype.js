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
    const ggbcanvas = getCanvas();

    /*
     * IGNORE above
     * EDIT below
     */

    setAriaLabel(ggbcanvas, "Interactive");

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

    var selectedObject;
    var prevAX;
    var prevAY;
    var bIsLast;
    var bIsFirst;

    updateFirstLastIndex();

    function updateFirstLastIndex() {
      bIsLast = ggbObject.getValue("bIsLastIndex");
      bIsFirst = ggbObject.getValue("bIsFirstIndex");
    }

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
      const keyboardInstructions = {
        // A: "Press the arrow keys to move this point.", // example for a point
        ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
      };
      return keyboardInstructions[obj];
    }

    function clientFunction(a) {
      // console.log("In client function", a);
      switch (a.type) {
        case "select":
          selectedObject = a.target;
          switch (selectedObject) {
            case "A":
              console.log("in select A");
              ggbObject.setValue("showBFake", true);
              break;
            case "B":
              // console.log("in select B");
              prevAX = ggbObject.getXcoord("A");
              prevAY = ggbObject.getYcoord("A");
              break;
            default:
              break;
          }

          break;
        case "dragEnd":
          if (selectedObject === "B") {
            // console.log("in dragEnd B, call setBFakeCoords & positionAInRegion");
            repositionStuff();
          } else if (selectedObject === "A") {
            // console.log("in dragEnd A, call setCoords B (before):", ggbObject.getXcoord("B"), ggbObject.getYcoord("B"));
            repositionB();
            ggbObject.setValue("showBFake", false);
            console.log("in dragEnd A, call setCoords B (after):", ggbObject.getXcoord("B"), ggbObject.getYcoord("B"));
          }
          break;
        case "deselect":
          // console.log("in deselect. selectedObj:", selectedObject);

          if (selectedObject === "A") {
            // console.log("in deselect. selectedObj is A. Hide FakeAB");
            ggbObject.setValue("showBFake", false);
            ggbObject.evalCommand("SelectObjects(B)");
          }
          selectedObject = "";
          console.log("end deselect");
          break;
      }
    }

    function positionAInRegion() {
      // Define New Drag Region
      // console.log("in function positionAInRegion");
      const xA = ggbObject.getXcoord("A");
      const xB = ggbObject.getXcoord("BFake");
      const yA = ggbObject.getYcoord("A");
      const yB = ggbObject.getYcoord("BFake");

      // console.log("in function positionAInRegion - A before:", xA, xB, ".  BFake:", xB, yB);

      const rise = yB - yA;
      const run = xB - xA;
      const riseDist = Math.abs(yB - yA);
      const runDist = Math.abs(xB - xA);
      const ver = Math.sign(rise); // COME BACK TO THIS <- CHECK DECIMALS
      const hor = Math.sign(run);

      ggbObject.setValue("gapBot", ver === -1 ? riseDist : 1);
      ggbObject.setValue("gapTop", ver === 1 ? riseDist : 1);

      ggbObject.setValue("gapLeft", hor === -1 ? runDist : 1);
      ggbObject.setValue("gapRight", hor === 1 ? runDist : 1);

      ggbObject.setCoords("A", prevAX, prevAY);
      // console.log("in function positionAInRegion - A AFTER:", prevAX, prevAY);
    }

    function setBFakeCoords() {
      // console.log("in setBFakeCoords - BEOFRE - BFake:", ggbObject.getXcoord("BFake"), ggbObject.getYcoord("BFake"));

      ggbObject.setCoords("vectorABFake", ggbObject.getXcoord("vectorAB"), ggbObject.getYcoord("vectorAB"));

      // console.log("in setBFakeCoords - AFTER - BFake:", ggbObject.getXcoord("BFake"), ggbObject.getYcoord("BFake"));
    }

    function repositionB() {
      ggbObject.setCoords("B", ggbObject.getXcoord("BFake"), ggbObject.getYcoord("BFake"));
    }

    function repositionStuff() {
      setBFakeCoords();
      positionAInRegion();
      repositionB();
    }

    function clickListenerFunction(a) {
      // switch (a) {}
    }

    function keyit(event) {
      // feel free to use event.key instead
      const key = event.key;
      if (selectedObject === "B" && (key === "+" || key === "-" || key.includes("Arrow") || key === "Tab")) {
        // console.log("in keyit. B selected. Call setBFakeCoords and positionAInRegion");
        repositionStuff();

        // If B is the first or last element in the path list, allow B to loop around the list on press + or -
        updateFirstLastIndex();
        if (bIsFirst && key === "-") {
          console.log("bIsFirst", bIsFirst);
          ggbObject.setCoords("B", ggbObject.getXcoord("BEnd"), ggbObject.getYcoord("BEnd"));
        } else if (bIsLast && key === "+") {
          console.log("bIsLast", bIsLast);
          ggbObject.setCoords("B", ggbObject.getXcoord("BStart"), ggbObject.getYcoord("BStart"));
        }
      } else if (selectedObject === "A" && (key.includes("Arrow") || key === "Tab")) {
        console.log("in keyit. A selected. setCoordsB");

        repositionB();
      }
      updateFirstLastIndex();
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

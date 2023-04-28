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

    setAriaLabel(ggbcanvas, "Interactive");

    /* 
Kim's Example video: https://www.loom.com/share/e7a03d001eb245bc9f202c44e0bbff3b
Kim's example starts with a geogebra file with the button bar added.
Objects in GGB are: 
  Points A, B, C, D, and E.  
  tabOrder={}
  addedList=""
Remove tabOrder and addedList from Graphics View 1 so they never show.
*/

    var initList = "A,B,C,D,E"; // A list of all things you want in the tabOrder when the applet initializes. One string, separated by commas. No need to add status name, instructionIcon or xIcon. Those are added in the library.
    var addedList = ""; // A list of all items added since the first initialization (e.g., objects created onthe fly). One string, separated by commas.
    var enders = "ggbButton1, ggbButton2"; // A list of all items that need to be at the end of the tabOrder list. One string, separated by commas.

    // Example for creating a click counter. Used to name created points
    var click = 0;

    // Needed for going forward and back a slide
    if (ggbObject.getValue("Length(tabOrder)") === 0) {
      setTabOrder(initList, addedList, enders);
    }

    function defineStatusName() {
      return "AAppletStatus";
    }
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
      return {
        ggbButton1: function () {
          enableButton(1, false);
          enableButton(2, true);
        },
        ggbButton2: function () {
          enableButton(1, true);
          enableButton(2, false);
          reset();
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

    // Write a function that adds objects to (or subtracts objects from) your tabOrder
    function clientFunction(a) {
      switch (a.type) {
        case "mouseDown":
          {
            if (ggbObject.getValue("ggbButton1Enabled") === 0) {
              click++;
              ggbObject.evalCommand("Point".concat(click, "=(", a.x, ",", a.y, ")"));
              ggbObject.setLayer("Point".concat(click), 5);
              ggbObject.setLabelVisible("Point".concat(click), true);
              // Use manageAddedList library function by taking the newly created object and use true for added, false for subtracted
              // If you will be deleting an object and using "false" to subtract an item from tabOrder, make sure to use manageAddedList and setTabOrder before deleting the object.
              addedList = manageAddedList("Point".concat(click), true); // adds new point to AddedList
              console.log(addedList);
              setTabOrder(initList, addedList, enders);
            }
          }
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

    // Optional/Recommended: If you want to be able to reset your applet to the initial number of objects on initialization, write a function that resets your lists to their initial state and sets the click count to 0
    // Ex: Call this funciton on a reset button
    function reset() {
      initList = "A,B,C,D,E"; // A list of all things on "stage" when applet initializes. One string, separated by commas
      addedList = ""; // A list of all items added since the first initialization (e.g., objects created onthe fly). One string, separated by commas.
      enders = "ggbButton1"; // A list of all items that need to be at the end of the tabOrder list. One string, separated by commas.
      click = 0;
      // setTextValue is needed for setTabOrder to work
      // Do this before deleting any objects using deleteObject())
      ggbObject.setTextValue("addedList", "");
      setTabOrder(initList, addedList, enders);

      // Delete points that were created on mouseDown
      allObjects = ggbObject.getObjectNames("Point");
      allObjects.forEach((el) => {
        if (el.includes("Point")) {
          ggbObject.deleteObject(el);
        }
      });
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

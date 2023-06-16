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

    //globalish-variables
    let selectedObject = "";
    const movePoints = ["MovePoint1", "MovePoint2", "MovePoint3"];
    const xmin = ggbObject.getValue("xMinShown");
    const xmax = ggbObject.getValue("xMaxShown");
    const ymin = ggbObject.getValue("yMinShown");
    const ymax = ggbObject.getValue("yMaxShown");

    setAriaLabel(ggbcanvas, "Graph Vertices to Find Length Interactive");

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

    //register my listeners
    registerSafeObjectUpdateListener("boxText", value);
    registerSafeObjectUpdateListener("value", sqrtReadText);

    function defineButtonClickScripts() {
      // defines button scripts
      // keep this function, but you can delete anything/everything inside it
      return {
        ggbButton1: function () {
          for (let i = 1; i < 4; i++) {
            ggbObject.setCoords(
              "MovePoint".concat(i),
              ggbObject.getXcoord("Point".concat(i)),
              ggbObject.getYcoord("Point".concat(i))
            );
          }
          ggbObject.setValue("value", "?");
          ggbObject.setLayer("CaptionMovePoint1", 5);
          ggbObject.setLayer("CaptionMovePoint2", 4);
          ggbObject.setLayer("CaptionMovePoint3", 3);
          ggbReadText("resetButtonText", true);
        },
        ggbButton2: function () {},
        ggbButton3: function () {},
        ggbButton4: function () {},
        ggbButton5: function () {},
      };
    }

    function defineKeyboardInstructions(obj) {
      // takes a GGB object name as an argument, returns its keyboard text.
      if (movePoints.includes(obj)) {
        let current = ggbObject.getValue("step");
        let next = current === 1 ? "5" : current === 2 ? "1" : "2";
        return "Press the arrow keys to move this point.\\\\Current movement increment is ".concat(
          current,
          ". Press space to increment by ",
          next,
          "."
        );
      }
      if (ggbObject.getObjectType(obj) == "textfield" && ggbObject.getValue("error" + selectedObject)) {
        ggbObject.setColor("displayedKeyboardInstructions", 218, 41, 28);
        const errorText = ggbObject.getValueString("errorMessage");
        return errorText;
      } else if (ggbObject.getObjectType(obj) == "textfield" && ggbObject.getValue("error" + selectedObject) == false) {
        ggbObject.setColor("displayedKeyboardInstructions", 0, 0, 0);
        return "Input a value and press enter to submit.";
      }
      const keyboardInstructions = {
        // A: "Press the arrow keys to move this point.", // example for a point
        ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to reset." : unavailableButtonText,
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
          ggbObject.setValue("deselected", true);
          movePoints.forEach((el) => {
            switch (true) {
              case el === selectedObject:
                ggbObject.setLayer("Caption".concat(el), 5);
                ggbObject.setLayer(el, 5);
                break;
              case el === "MovePoint1":
                ggbObject.setLayer("Caption".concat(el), 4);
                ggbObject.setLayer(el, 4);
                break;
              case el === "MovePoint2":
                ggbObject.setLayer("Caption".concat(el), 3);
                ggbObject.setLayer(el, 3);
                break;
              case el === "MovePoint3":
                ggbObject.setLayer("Caption".concat(el), 2);
                ggbObject.setLayer(el, 2);
                break;
            }
          });
          break;
        case "deselect":
          ggbObject.setColor("displayedKeyboardInstructions", 0, 0, 0);
          selectedObject = "";
          break;
        case "dragEnd":
          ggbObject.setValue("step", 1);
          if (movePoints.includes(selectedObject)) {
            updateKeyboardInstructions(selectedObject);
            readText(selectedObject);
          }
          break;
        case "mouseDown":
          if (movePoints.includes(a.hits[0])) {
            ggbObject.setValue("step", 2);
          }
          break;
      }
    }

    function clickListenerFunction(a) {
      if (movePoints.includes(a)) {
        let step = ggbObject.getValue("step");
        switch (step) {
          case 5:
            ggbObject.setValue("step", 2);
            break;
          case 2:
            ggbObject.setValue("step", 1);
            break;
          case 1:
            ggbObject.setValue("step", 5);
        }
        let current = ggbObject.getValue("step");
        let next = current === 1 ? "5" : current === 2 ? "1" : "2";
        ggbReadText("Current movement increment is ".concat(current, ". Press space to increment by ", next, "."));
      }
      if (a === "AAppletStatus") {
        ggbReadText("promptText", true);
      }
    }

    function keyit(event) {
      // feel free to use event.key instead
      // switch (event.code) {}
      if (event.code.includes("Arrow") && movePoints.includes(selectedObject)) {
        readText(selectedObject);
      }
    }

    function value() {
      console.log("in value function");
      //ADD
      // box is inputbox name
      let box = "Box";
      ggbObject.setValue("deselected", false);
      var xmlstring = ggbObject.getXML(box);
      console.log("box xml:", xmlstring);
      var parser = new DOMParser();
      var xmldom = parser.parseFromString(xmlstring, "application/xml");
      var element = xmldom.getElementsByTagName("tempUserInput")[0];
      console.log("box element:", element);

      // if blank, don't show error message
      if (element === undefined) {
        ggbObject.setValue("error" + box, false);
      } else {
        ggbObject.setValue("error" + box, true);
      }
      setTimeout(function () {
        if (selectedObject !== box) {
        } else {
          updateKeyboardInstructions("Box");
        }
      }, 100);
    }

    function sqrtReadText() {
      let sqrtReadString = ggbObject.getScreenReaderOutput("Box");
      ggbObject.setTextValue("rootValReadString", sqrtReadString);
    }

    function readText(a) {
      //creates and reads out updates on points, includes min/max text
      let tempX = ggbObject.getXcoord(a);
      let tempY = ggbObject.getYcoord(a);
      let minMaxText = "";
      let num = a.slice(-1);

      switch (true) {
        case tempX === xmin && tempY === ymax:
          //top left corner
          minMaxText = "This point is at its minimum x value and maximum y value.";
          break;
        case tempX === xmin && tempY === ymin:
          //bottom left corner
          minMaxText = "This point is at its minimum x and y value.";
          break;
        case tempX === xmax && tempY === ymin:
          //bottom right corner
          minMaxText = "This point is at its maximum x value and minimum y value.";
          break;
        case tempX === xmax && tempY === ymax:
          //top right corner
          minMaxText = "This point is at its maximum x and y value.";
          break;
        case tempX === xmin:
          //left side
          minMaxText = "This point is at its minimum x value.";
          break;
        case tempX === xmax:
          //right side
          minMaxText = "This point is at its maximum x value.";
          break;
        case tempY === ymin:
          //bottom
          minMaxText = "This point is at its minimum y value.";
          break;
        case tempY === ymax:
          //top
          minMaxText = "This point is at its maximum y value.";
          break;
      }

      let moveText = ggbObject.getValueString("Move".concat(num));
      let readOutText = moveText.concat(" ", minMaxText);
      ggbReadText(readOutText);
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

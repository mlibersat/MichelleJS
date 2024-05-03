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

    setAriaLabel(ggbcanvas, "Division Interactive");

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

    registerSafeObjectUpdateListener("buttonsReady", buttonsReadyUpdate);
    // registerSafeObjectUpdateListener("greenShadeVisible", announceFractions);
    // registerSafeObjectUpdateListener("blackDotsVisible", announceFractions);

    function buttonsReadyUpdate() {
      if (ggbObject.getValue("buttonsReady") && !ggbObject.getValue("answerBool")) {
        enableButton(1, true);
      } else {
        enableButton(1, false);
      }
    }

    // function announceFractions() {
    //   if (ggbObject.getValue("greenShadeVisible") || ggbObject.getValue("blackDotsVisible")) {
    //     setTimeout(function () {
    //       ggbReadText("AAppletStatus", true);
    //     }, 100);
    //   }
    // }

    function checkForMaxMinDragSituation() {
      let selectedObjectXCoord;
      let selectedObjectYCoord;

      if (selectedObject === "fracQuad") {
        selectedObjectXCoord = ggbObject.getXcoord("bottomQuad2LC");
        selectedObjectYCoord = ggbObject.getYcoord("bottomQuad2LC");
      } else if (selectedObject === "fracQuad1") {
        selectedObjectXCoord = ggbObject.getXcoord("bottomQuad1LC");
        selectedObjectYCoord = ggbObject.getYcoord("bottomQuad1LC");
      }

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
          ggbReadText("This shape is at its minimum x value for this interactive.");
          break;
        case maxXOnly:
          ggbReadText("This shape is at its maximum x value for this interactive.");
          break;
        case minYOnly:
          ggbReadText("This shape is at its minimum y value for this interactive.");
          break;
        case maxYOnly:
          ggbReadText("This shape is at its maximum y value for this interactive.");
          break;
        case minXAndMinY:
          ggbReadText("This shape is at its minimum x and y value for this interactive.");
          break;
        case maxXAndMinY:
          ggbReadText("This shape is at its maximum x value and minimum y value for this interactive.");
          break;
        case maxXAndMaxY:
          ggbReadText("This shape is at its maximum x and y value for this interactive.");
          break;
        case minXAndMaxY:
          ggbReadText("This shape is at its minimum x value and maximum y value for this interactive.");
          break;
      }
    }

    function defineButtonClickScripts() {
      // defines button scripts
      // keep this function, but you can delete anything/everything inside it
      return {
        ggbButton1: function () {
          enableButton(1, false);
          enableButton(2, true);
          ggbObject.setValue("answerBool", true);
          ggbReadText("answerReadText", true);
        },
        ggbButton2: function () {
          enableButton(1, true);
          enableButton(2, false);
          ggbObject.setValue("answerBool", false);
          ggbReadText("The answer is now hidden.");
        },
        ggbButton3: function () {},
        ggbButton4: function () {},
        ggbButton5: function () {},
      };
    }

    function defineKeyboardInstructions(obj) {
      // takes a GGB object name as an argument, returns its keyboard text.

      const keyboardInstructions = {
        fracQuad: "Press the arrow keys to move this shape.\\\\Press space to automatically move it to the other tape.",
        fracQuad1:
          "Press the arrow keys to move this shape.\\\\Press space to automatically move it to the other tape.",
        InputBox3: "Input a value and press enter to submit.",
        frac1Denom: "Input a value and press enter to submit.",
        frac1Num: "Input a value and press enter to submit.",
        frac2Denom: "Input a value and press enter to submit.",
        Same: "Press the up and down arrow keys to change the value.",
        ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to show the answer." : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to hide the answer." : unavailableButtonText,
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
          if (selectedObject === "fracQuad" || selectedObject === "fracQuad1") {
            setTimeout(function () {
              checkForMaxMinDragSituation();
            }, 100);
          } else {
            ggbReadText("dividersText", true);
          }
          break;
      }
    }

    function clickListenerFunction(a) {
      switch (a) {
        case "fracQuad":
          if (ggbObject.getYcoord("topQuad2LC") === 1) {
            ggbObject.setCoords("bottomQuad2LC", 0, 2);
            ggbObject.setCoords("topQuad2LC", 0, 3);
            ggbReadText("The green shade shape is now in the tape labeled Green Shade.");
          } else {
            ggbObject.setCoords("bottomQuad2LC", 0, 0);
            ggbObject.setCoords("topQuad2LC", 0, 1);
            ggbReadText("The green shade shape is now in the tape labeled Black Dots.");
          }
          break;
        case "fracQuad1":
          if (ggbObject.getYcoord("topQuad1LC") === 1) {
            ggbObject.setCoords("bottomQuad1LC", 0, 2);
            ggbObject.setCoords("topQuad1LC", 0, 3);
            ggbReadText("The black dots shape is now in the tape labeled Green Shade.");
          } else {
            ggbObject.setCoords("bottomQuad1LC", 0, 0);
            ggbObject.setCoords("topQuad1LC", 0, 1);
            ggbReadText("The black dots shape is now in the tape labeled Black Dots.");
          }
          break;
      }
    }

    function keyit(event) {
      // feel free to use event.key instead
      switch (true) {
        case event.key === " " && selectedObject === "Same":
          if (ggbObject.isAnimationRunning()) {
            ggbReadText(
              "An animation shows the number of dividers in each tape increasing by 1 divider from 1 to 15 dividers. Press space to stop the animation."
            );
          } else {
            ggbReadText("Animation has stopped.");
          }
          break;
        case event.key.includes("Arrow"):
          if (selectedObject === "fracQuad" || selectedObject === "fracQuad1") {
            setTimeout(function () {
              checkForMaxMinDragSituation();
            }, 100);
          } else {
            ggbReadText("dividersText", true);
          }
          break;
        case event.key === "+" || event.key === "-":
          ggbReadText("dividersText", true);
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

function ggbOnInit(name, ggbObject) {
  var arialabel = "Circle Interactive";
  var ggbcanvasarray = document.querySelectorAll("canvas");
  for (i = 0; i < ggbcanvasarray.length; i++) {
    var parameterID = ggbcanvasarray[i].closest("div.appletParameters,div.notranslate").getAttribute("id");
    var canvasID = "canvas" + parameterID;
    ggbcanvasarray[i].setAttribute("id", canvasID);
  }
  var id = "canvas" + name;
  var ggbcanvas = document.getElementById(id);
  if (ggbcanvas) {
    ggbcanvas.setAttribute("aria-label", arialabel);
  }

  function button1Click() {
    // button 1 code here
    //        enableButton(1, false); //use this structure to enable or disable any of the (up to) 5 buttons
    //        ggbObject.evalCommand('ReadText("What happened as a result of the button click.")');
  }

  function button2Click() {
    // button 2 code here
  }

  function button3Click() {
    // button 3 code here
  }

  function button4Click() {
    // button 4 code here
  }

  function button5Click() {
    // button 5 code here
  }

  // restore object listeners
  ggbObject.registerAddListener(function (a) {
    var assignment = {
      showAngles: {
        type: "update",
        callback: checkbox,
      },
      // add more here if you have more objects
    };
    if (assignment[a]) {
      var reAddedProperties = assignment[a];
      switch (reAddedProperties.type) {
        case "click":
          ggbObject.registerObjectClickListener(a, reAddedProperties.callback);
          break;
        case "update":
          // delay update registration within the call stack to prevent premature firing
          setTimeout(function () {
            ggbObject.registerObjectUpdateListener(a, reAddedProperties.callback);
          });
      }
    }
  });

  ///////////////////////////////////
  ggbObject.registerClientListener(focusIndicatorsAndErrorMessages);
  ggbObject.registerClickListener(buttonAndIconClicks);
  ggbObject.registerObjectUpdateListener("showAngles", checkbox);
  ggbcanvas.addEventListener("keyup", keyit);

  var barButtons = ["ggbButton1", "ggbButton2", "ggbButton3", "ggbButton4", "ggbButton5"];

  var selectedObject = "";

  function focusIndicatorsAndErrorMessages(a) {
    switch (a.type) {
      case "select":
        switch (a.target) {
          case "instructionsIcon":
            ggbObject.setVisible("instructionsIconFocusIndicator", true);
            // ggbObject.setVisible("displayedGGBButtonMessage", false);
            break;
          case "xIcon":
            ggbObject.setVisible("xIconFocusIndicator", true);
            // ggbObject.setVisible("displayedGGBButtonMessage", false);
            break;
          case "AAppletStatus":
            ggbObject.setValue("escTextCount", ggbObject.getValue("escTextCount") + 1);
            break;
          case "ggbButton1":
            ggbObject.evalCommand('ReadText("Press space to [describe what will happen].")');
            break;
          // case "showAngles":
          //   ggbObject.evalCommand("ReadText(checkboxSelectText)");
          //   break;
          case "β":
            selectedObject = "β";
            ggbObject.evalCommand("ReadText(sliderSelectText)");
            break;
          default:
            if (barButtons.includes(a.target) && !ggbObject.getValue(a.target + "Enabled")) {
              disabledButtonDisplayMessage();
            } else {
              // ggbObject.setVisible("displayedGGBButtonMessage", false);
            }
        }
        break;
      case "deselect":
        selectedObject = "";
        ggbObject.setVisible("instructionsIconFocusIndicator", false);
        ggbObject.setVisible("xIconFocusIndicator", false);
        break;
      case "dragEnd":
        if (a.target === "β") {
          ggbObject.evalCommand("ReadText(status)");
        }
        break;
      default:
    }
  }

  function buttonAndIconClicks(a) {
    switch (a) {
      case "instructionsIcon":
        var rawInstructions = ggbObject.getLaTeXString("instructionsText");
        var trimmedInstructions = rawInstructions.substr(6, rawInstructions.length - 7);
        var finalInstructions = trimmedInstructions.concat(" Press space to close the instructions.");
        ggbObject.setValue("showInstructions", true);
        ggbObject.evalCommand('ReadText("' + finalInstructions + '")');
        ggbObject.evalCommand("SelectObjects(xIcon)");
        break;
      case "xIcon":
        ggbObject.setVisible("xIconFocusIndicator", false);
        ggbObject.setValue("showInstructions", false);
        ggbObject.evalCommand("SelectObjects(instructionsIcon)");
        break;
      default:
        if (barButtons.includes(a)) {
          var buttonFunctions = {
            ggbButton1: button1Click,
            ggbButton2: button2Click,
            ggbButton3: button3Click,
            ggbButton4: button4Click,
            ggbButton5: button5Click,
          };
          if (buttonFunctions[a] && ggbObject.getValue(a + "Enabled")) {
            buttonFunctions[a]();
          } else {
            disabledButtonDisplayMessage();
          }
        }
    }
  }

  function enableButton(buttonNum, boolean) {
    ggbObject.setValue("ggbButton" + buttonNum + "Enabled", boolean);
    var color = boolean ? "0/255, 11/255, 92/255" : "118/255, 118/255,118/255";
    ggbObject.evalCommand("SetBackgroundColor(ggbButton" + buttonNum + ", " + color + ")");
  }

  function disabledButtonDisplayMessage() {
    // ggbObject.setVisible("displayedGGBButtonMessage", true);
    // ggbObject.evalCommand("ReadText(displayedGGBButtonMessage)");
  }

  function checkbox() {
    // ggbObject.evalCommand("ReadText(checkboxUpdateText)");
    setTimeout(() => {
      ggbObject.evalCommand("ReadText(checkboxUpdateText)");
    }, 500);
  }

  function keyit(event) {
    if (event.key == "ArrowUp" || event.key == "ArrowDown" || event.key == "ArrowLeft" || event.key == "ArrowRight") {
      check();
    }
    if (event.key === " " && selectedObject === "β") {
      if (ggbObject.isAnimationRunning()) {
        ggbObject.evalCommand("ReadText(animationText)");
      } else {
        ggbObject.evalCommand("ReadText(animationStopText)");
      }
    }
  }

  function check() {
    ggbObject.evalCommand("ReadText(status)");
  }
}

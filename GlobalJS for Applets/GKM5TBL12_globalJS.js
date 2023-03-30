function ggbOnInit(name, ggbObject) {
  var arialabel = "Bowling Game Interactive";
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

  // restore object listeners
  ggbObject.registerAddListener(function (a) {
    var assignment = {
      BowlingBall: {
        type: "update",
        callback: knockEmDown,
      },
      optionSelected: {
        type: "update",
        callback: dropDown,
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

  ggbObject.registerObjectUpdateListener("BowlingBall", knockEmDown);
  ggbObject.registerObjectUpdateListener("optionSelected", dropDown);
  ggbObject.registerClientListener(focusIndicatorsAndErrorMessages);
  ggbObject.registerClickListener(buttonAndIconClicks);
  ggbcanvas.addEventListener("keyup", keyit);

  function dropDown() {
    console.log("optionSelected updated");
    ggbObject.getValue("optionSelected");
    for (var i = 1; i < 11; i++) {
      ggbObject.setLineStyle("Pin" + i, 0);
    }
    if (ggbObject.getValue("optionSelected") === 0) {
      ggbObject.setVisible("BowlingBall", false);
      enableButton(2, false);
      enableButton(1, false);
      ggbObject.setValue("careful", false);
      ggbObject.setValue("setup", true);
      ggbObject.setCoords("BowlingBall", ggbObject.getValue("x(N)"), ggbObject.getValue("y(N)"));
      // ggbObject.evalCommand(myResetText);
    }
    if (ggbObject.getValue("optionSelected") === 1) {
      ggbObject.setValue("careful", true);
      ggbObject.setValue("setup", true);
      ggbObject.setCoords("BowlingBall", ggbObject.getValue("x(N)"), ggbObject.getValue("y(N)"));
      ggbObject.setVisible("BowlingBall", true);
      ggbObject.evalCommand('ReadText("There is one moveable point. ")');
      // ggbObject.evalCommand(myResetText);
      enableButton(1, true);
      enableButton(2, false);
    }
    if (ggbObject.getValue("optionSelected") === 2) {
      ggbObject.setValue("careful", false);
      ggbObject.setValue("setup", false);
      ggbObject.setCoords("BowlingBall", ggbObject.getValue("x(N)"), ggbObject.getValue("y(N)"));
      // ggbObject.evalCommand(myResetText);
      ggbObject.setVisible("BowlingBall", true);
      enableButton(1, true);
      enableButton(2, false);
    }
  }

  function knockEmDown() {
    if (ggbObject.getYcoord("BowlingBall") > -1) {
      ggbObject.setValue("speed", 10);
    }
    for (var i = 1; i < 11; i++) {
      if (ggbObject.getValue("IsInRegion(BowlingBall,Pin" + i + ")") === true) {
        ggbObject.setLineStyle("Pin" + i, 1);
      }
      if (ggbObject.getYcoord("BowlingBall") > 6) {
        switch (ggbObject.getValue("CaseNumber")) {
          case 1:
            ggbObject.setLineStyle("Pin8", 1);
            ggbObject.setValue("knockedDown", 1);
            break;
          case 2:
            ggbObject.setLineStyle("Pin8", 1);
            ggbObject.setLineStyle("Pin4", 1);
            ggbObject.setValue("knockedDown", 2);
            break;
          case 3:
            ggbObject.setLineStyle("Pin8", 1);
            ggbObject.setLineStyle("Pin4", 1);
            ggbObject.setLineStyle("Pin3", 1);
            ggbObject.setValue("knockedDown", 3);
            break;
          case 4:
            ggbObject.setLineStyle("Pin8", 1);
            ggbObject.setLineStyle("Pin4", 1);
            ggbObject.setLineStyle("Pin3", 1);
            ggbObject.setLineStyle("Pin7", 1);
            ggbObject.setValue("knockedDown", 4);
            break;
          case 5:
            ggbObject.setLineStyle("Pin8", 1);
            ggbObject.setLineStyle("Pin4", 1);
            ggbObject.setLineStyle("Pin3", 1);
            ggbObject.setLineStyle("Pin7", 1);
            ggbObject.setLineStyle("Pin5", 1);
            ggbObject.setValue("knockedDown", 5);
            break;
          case 6:
            for (var i = 1; i < 11; i++) {
              ggbObject.setLineStyle("Pin" + i, 1);
              ggbObject.setValue("knockedDown", 10);
            }
            break;
          case 7:
            ggbObject.setLineStyle("Pin1", 1);
            ggbObject.setLineStyle("Pin2", 1);
            ggbObject.setLineStyle("Pin9", 1);
            ggbObject.setLineStyle("Pin6", 1);
            ggbObject.setLineStyle("Pin10", 1);
            ggbObject.setValue("knockedDown", 5);
            break;
          case 8:
            ggbObject.setLineStyle("Pin1", 1);
            ggbObject.setLineStyle("Pin2", 1);
            ggbObject.setLineStyle("Pin6", 1);
            ggbObject.setLineStyle("Pin10", 1);
            ggbObject.setValue("knockedDown", 4);
            break;
          case 9:
            ggbObject.setLineStyle("Pin2", 1);
            ggbObject.setLineStyle("Pin6", 1);
            ggbObject.setLineStyle("Pin10", 1);
            ggbObject.setValue("knockedDown", 3);
            break;
          case 10:
            ggbObject.setLineStyle("Pin6", 1);
            ggbObject.setLineStyle("Pin10", 1);
            ggbObject.setValue("knockedDown", 2);
            break;
          case 11:
            ggbObject.setLineStyle("Pin10", 1);
            ggbObject.setValue("knockedDown", 1);
            break;
          case -1:
            for (var i = 1; i < 11; i++) {
              ggbObject.setLineStyle("Pin" + i, 0);
              ggbObject.setValue("knockedDown", 0);
            }
            break;
        }
      }
    }
  }

  //From ClickScript Button1> Roll the Ball
  function bowl() {
    ggbObject.setValue("speed", 3);
    ggbObject.setCoords("BowlingBall", ggbObject.getXcoord("N"), ggbObject.getYcoord("N"));
    for (var i = 1; i < 11; i++) {
      ggbObject.setLineStyle("Pin" + i, 0);
    }
    if (ggbObject.getValue("careful") === 0) {
      ggbObject.setCoords(
        "M",
        ggbObject.getXcoord("K") + ggbObject.getValue("Length(i)") * Math.random(),
        ggbObject.getYcoord("K")
      );
    }
    if (ggbObject.getXcoord("M") < 8.5 || ggbObject.getXcoord > -0.7) {
      ggbObject.evalCommand("RunClickScript(button2)");
    }
    ggbObject.setAnimating("BowlingBall", true);
    ggbObject.startAnimation();
    ggbObject.setValue("setup", false);
  }

  //roll the ball
  function button1Click() {
    enableButton(1, false);
    enableButton(2, true);
    bowl();
    setTimeout(function () {
      ggbObject.evalCommand('ReadText(rollText+" Use the reset button or dropdown list to clear the alley. ")');
    }, 4000);
  }

  //reset
  function button2Click() {
    ggbObject.setValue("knockedDown", 0);
    enableButton(2, false);
    enableButton(1, true);
    for (var i = 1; i < 11; i++) {
      ggbObject.setLineStyle("Pin" + i, 0);
    }
    if (ggbObject.getValue("optionSelected") === 0) {
      ggbObject.setVisible("BowlingBall", false);
      ggbObject.setValue("careful", false);
      ggbObject.setValue("setup", true);
      ggbObject.setCoords("BowlingBall", ggbObject.getValue("x(N)"), ggbObject.getValue("y(N)"));
      ggbObject.evalCommand('ReadText("The bowling ball moved to the starting place. All 10 pins are standing. ")');
    }
    if (ggbObject.getValue("optionSelected") === 1) {
      ggbObject.setValue("careful", true);
      ggbObject.setValue("setup", true);
      ggbObject.setCoords("BowlingBall", ggbObject.getValue("x(N)"), ggbObject.getValue("y(N)"));
      ggbObject.setVisible("BowlingBall", true);
      ggbObject.evalCommand(
        'ReadText("The bowling ball moved to the starting place. All 10 pins are standing. Bowl carefully is selected and there is one moveable point. ")'
      );
    }
    if (ggbObject.getValue("optionSelected") === 2) {
      ggbObject.setValue("careful", false);
      ggbObject.setValue("setup", false);
      ggbObject.setCoords("BowlingBall", ggbObject.getValue("x(N)"), ggbObject.getValue("y(N)"));
      ggbObject.evalCommand(
        'ReadText("The bowling ball moved to the starting place. All 10 pins are standing. Bowl randomly is selected and there are no moveable points. ")'
      );
      ggbObject.setVisible("BowlingBall", true);
      // enableButton(1, true);
      // enableButton(2, false);
    }
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

  function readButtonText(tar) {
    var readText = {
      ggbButton1: {
        enabled: ggbObject.getValueString("rollSelectText"),
        disabled: "This button is unavailable.",
      },
      ggbButton2: {
        enabled: "Press space to reset the ball and pins.",
        disabled: "This button is unavailable.",
      },
      ggbButton3: {
        enabled: "Press space to [describe what will happen].",
        disabled: "This button is unavailable.",
      },
      ggbButton4: {
        enabled: "Press space to [describe what will happen].",
        disabled: "This button is unavailable.",
      },
      ggbButton5: {
        enabled: "Press space to [describe what will happen].",
        disabled: "This button is unavailable.",
      },
    };
    var enabledOrDisabled = ggbObject.getValue(tar + "Enabled") ? "enabled" : "disabled";
    ggbObject.evalCommand(`ReadText("${readText[tar][enabledOrDisabled]}")`);
  }

  var barButtons = ["ggbButton1", "ggbButton2", "ggbButton3", "ggbButton4", "ggbButton5"];

  function focusIndicatorsAndErrorMessages(a) {
    var clientTarget = a.target;
    switch (a.type) {
      case "select":
        switch (clientTarget) {
          case "M":
            ggbObject.evalCommand(
              'ReadText("Use the left and right arrow keys to change the direction the ball will roll. " + directionText)'
            );
            break;
          case "instructionsIcon":
            ggbObject.setVisible("instructionsIconFocusIndicator", true);
            break;
          case "xIcon":
            ggbObject.setVisible("xIconFocusIndicator", true);
            break;
          case "AAppletStatus":
            ggbObject.setValue("escTextCount", ggbObject.getValue("escTextCount") + 1);
            break;
          case "dropDownList":
            for (var i = 1; i < 11; i++) {
              ggbObject.setLineStyle("Pin" + i, 0);
            }
            ggbObject.setCoords("BowlingBall", ggbObject.getValue("x(N)"), ggbObject.getValue("y(N)"));
            if (ggbObject.getValue("optionSelected") === 0) {
              ('ReadText("Choose how you want to roll the ball. ")');
              ggbObject.setValue("careful", false);
              // ggbObject.setCoords("BowlingBall", ggbObject.getValue("x(N)"), ggbObject.getValue("y(N)"));
              // for (var i = 1; i < 11; i++) {
              //   ggbObject.setLineStyle("Pin" + i, 0);
              // }
            }
            if (ggbObject.getValue("optionSelected") === 1) {
              ggbObject.setValue("careful", true);
              ggbObject.setValue("setup", true);
              // ggbObject.setCoords("BowlingBall", ggbObject.getValue("x(N)"), ggbObject.getValue("y(N)"));
              // for (var i = 1; i < 11; i++) {
              //   ggbObject.setLineStyle("Pin" + i, 0);
              // }
              // ggbObject.evalCommand('ReadText("Bowl carefully is selected. ")');
            }
            if (ggbObject.getValue("optionSelected") === 2) {
              // ('ReadText("Bowl randomly is selected. ")');
              ggbObject.setValue("careful", false);
              // ggbObject.setCoords("BowlingBall", ggbObject.getValue("x(N)"), ggbObject.getValue("y(N)"));
              // for (var i = 1; i < 11; i++) {
              //   ggbObject.setLineStyle("Pin" + i, 0);
              // }
            }
            break;
          default:
            if (barButtons.includes(clientTarget)) {
              readButtonText(clientTarget);
            }
        }
        break;
      case "dragEnd":
        if (a.target === "M") {
          ggbObject.evalCommand('ReadText(directionText + " When ready use the button to roll the ball. ")');
        }
        break;
      case "deselect":
        ggbObject.setVisible("instructionsIconFocusIndicator", false);
        ggbObject.setVisible("xIconFocusIndicator", false);
        break;
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
      case "dropDownList":
        ///////////////////////////
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
            readButtonText(a);
          }
        }
    }
  }

  function enableButton(buttonNum, boolean) {
    ggbObject.setValue("ggbButton" + buttonNum + "Enabled", boolean);
    var color = boolean ? "0/255, 11/255, 92/255" : "118/255, 118/255,118/255";
    ggbObject.evalCommand("SetBackgroundColor(ggbButton" + buttonNum + ", " + color + ")");
  }

  function keyit(event) {
    if (event.key == "ArrowLeft" || event.key == "ArrowRight") {
      ggbObject.evalCommand('ReadText(directionText + " When ready use the button to roll the ball. ")');
      //copy to dragEnd
    }
  }
}

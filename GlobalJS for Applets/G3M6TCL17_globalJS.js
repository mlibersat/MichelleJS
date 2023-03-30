function ggbOnInit(name, ggbObject) {
  var arialabel = "Rectangles Interactive";
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

  var selectedObject = "";

  ggbObject.registerAddListener(function (a) {
    var assignment = {
      A: {
        type: "update",
        callback: showP,
      },
    };
    if (assignment[a]) {
      var reAddedProperties = assignment[a];
      switch (reAddedProperties.type) {
        case "click":
          ggbObject.registerObjectClickListener(a, reAddedProperties.callback);
          break;
        case "update":
          setTimeout(function () {
            ggbObject.registerObjectUpdateListener(a, reAddedProperties.callback);
          });
      }
    }
  });

  ggbObject.registerClientListener(focusIndicatorsAndErrorMessages);
  ggbObject.registerClickListener(buttonAndIconClicks);
  ggbObject.registerObjectUpdateListener("A", showP);

  function showP() {
    ggbObject.setVisible("H", false);
    ggbObject.setVisible("P", true);
    ggbObject.setVisible("q2", false);
    ggbObject.setVisible("q3", true);
    ggbObject.setVisible("h", false);
    ggbObject.setVisible("h'", false);
    ggbObject.setVisible("i", false);
    ggbObject.setVisible("i'", false);
    ggbObject.setValue("isHShowing", false);
  }

  function button1Click() {
    // button 1 code here
    enableButton(1, false); //use this structure to enable or disable any of the (up to) 5 buttons
    ggbObject.evalCommand('ReadText("What happened as a result of the button click.")');
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

  function readButtonText(tar) {
    var readText = {
      ggbButton1: {
        enabled: "Press space to [describe what will happen].",
        disabled: "This button is unavailable.",
      },
      ggbButton2: {
        enabled: "Press space to [describe what will happen].",
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
    if ((a.target === "A" && a.type === "select") || (a.hits === "A" && a.type === "mouseDown")) {
      showP;
    }
    if ((a.target === "P" && a.type === "select") || (a.target === "H" && a.type === "select")) {
      ggbObject.evalCommand("ReadText(blueSelectText)");
    }
    if (a.target === "A" && a.type === "dragEnd") {
      ggbObject.setVisible("H", true);
      ggbObject.setVisible("P", false);
      ggbObject.setVisible("q2", true);
      ggbObject.setVisible("q3", false);
      ggbObject.setVisible("h", true);
      ggbObject.setVisible("h'", true);
      ggbObject.setVisible("i", true);
      ggbObject.setVisible("i'", true);
      ggbObject.setCoords("H", ggbObject.getXcoord("P"), ggbObject.getYcoord("P"));
      ggbObject.setValue("isHShowing", true);
      ggbObject.evalCommand("ReadText(sameLengthText)");
    }
    if (a.target === "H" && a.type === "dragEnd") {
      ggbObject.setCoords("H", ggbObject.getValue("floor(x(H))"), ggbObject.getValue("floor(y(H))"));
      ggbObject.evalCommand("ReadText(blueLengthText)");
    }

    var clientTarget = a.target;
    switch (a.type) {
      case "select":
        switch (clientTarget) {
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
          case "A":
            ggbObject.evalCommand("ReadText(greenSelectText)");
            selectedObject = "A";
            ggbObject.setValue("showHArrows", false);
            ggbObject.setValue("showAArrows", true);
            break;
          case "P":
            selectedObject = "P";
            ggbObject.setValue("showHArrows", true);
            ggbObject.setValue("showAArrows", false);
            break;
          case "H":
            selectedObject = "H";
            ggbObject.setValue("showHArrows", true);
            ggbObject.setValue("showAArrows", false);
            break;

          default:
            if (barButtons.includes(clientTarget)) {
              readButtonText(clientTarget);
            }
        }
        break;
      case "deselect":
        ggbObject.setVisible("instructionsIconFocusIndicator", false);
        ggbObject.setVisible("xIconFocusIndicator", false);
        ggbObject.setValue("showHArrows", false);
        ggbObject.setValue("showAArrows", false);
        selectedObject = "";
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

  var ggbcanvasarray = document.querySelectorAll("canvas");
  for (i = 0; i < ggbcanvasarray.length; i++) {
    var parameterID = ggbcanvasarray[i].closest("div.appletParameters,div.notranslate").getAttribute("id");
    var canvasID = "canvas" + parameterID;
    ggbcanvasarray[i].setAttribute("id", canvasID);
  }
  var id = "canvas" + name;
  var ggbcanvas = document.getElementById(id);
  ggbcanvas.addEventListener("keyup", keyit);

  function keyit(event) {
    if (
      event.key === "ArrowUp" ||
      event.key === "ArrowDown" ||
      event.key === "ArrowLeft" ||
      event.key === "ArrowRight"
    ) {
      ggbObject.setCoords("H", ggbObject.getXcoord("P"), ggbObject.getYcoord("P"));
      ggbObject.setVisible("H", true);
      ggbObject.setVisible("P", false);
      ggbObject.setVisible("q2", true);
      ggbObject.setVisible("q3", false);
      ggbObject.setVisible("h", true);
      ggbObject.setVisible("h'", true);
      ggbObject.setVisible("i", true);
      ggbObject.setVisible("i'", true);
      ggbObject.setValue("isHShowing", true);
      if (selectedObject === "A") {
        ggbObject.evalCommand("ReadText(sameLengthText)");
      }
    }
    if (event.key === "+" || event.key === "-") {
      if (selectedObject === "P" || selectedObject === "H") {
        if (!ggbObject.getValue("sideIsSplit")) {
          ggbObject.evalCommand("ReadText(sameLengthText)");
        } else {
          {
            ggbObject.evalCommand("ReadText(blueLengthText)");
          }
        }
      }
    }
    if (event.key === "x") {
      ggbObject.evalCommand("SelectObjects(AAppletStatus)");
    }
  }
}

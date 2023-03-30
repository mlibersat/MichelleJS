function ggbOnInit(name, ggbObject) {
  var arialabel = "Angles Interactive";
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

  ggbObject.setErrorDialogsActive(false);

  ////////////////////////////////////////////////////////
  function button1Click() {
    // button 1 code here
    //  enableButton(1, false); //use this structure to enable or disable any of the (up to) 5 buttons
    //  ggbObject.evalCommand('ReadText("What happened as a result of the button click.")');
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

  ggbObject.registerClientListener(focusIndicatorsAndErrorMessages);
  ggbObject.registerClickListener(buttonAndIconClicks);
  // ggbObject.registerObjectClickListener("DangleDAB", cycle);
  // ggbObject.registerObjectClickListener("CangleCAE", cycle);
  document.addEventListener("keyup", keyit);

  var barButtons = ["ggbButton1", "ggbButton2", "ggbButton3", "ggbButton4", "ggbButton5"];

  function focusIndicatorsAndErrorMessages(a) {
    switch (a.type) {
      case "dragEnd":
        var xmlstring = ggbObject.getXML(a.target);
        var parser = new DOMParser();
        var xmldom = parser.parseFromString(xmlstring, "application/xml");
        xmldom.getElementsByTagName("animation")[0].setAttribute("step", "1°");
        var serializer = new XMLSerializer();
        xmlstring = serializer.serializeToString(xmldom);
        ggbObject.evalXML(xmlstring);
        ggbObject.setValue("currentStep", 1);
        ggbObject.evalCommand("ReadText(status+stepText)");

        break;
      case "mouseDown":
        if (a.hits[0] == "DangleDAB" || a.hit[0] == "CangleCAE") {
          var xmlstring = ggbObject.getXML(a.hits[0]);
          var parser = new DOMParser();
          var xmldom = parser.parseFromString(xmlstring, "application/xml");
          xmldom.getElementsByTagName("animation")[0].setAttribute("step", "5°");
          var serializer = new XMLSerializer();
          xmlstring = serializer.serializeToString(xmldom);
          ggbObject.evalXML(xmlstring);
        }
        break;
      case "select":
        var myVals =
          a.target == "instructionsIcon"
            ? 1
            : a.target == "xIcon"
            ? 2
            : a.target == "AAppletStatus"
            ? 3
            : a.target == "DangleDAB"
            ? 4
            : a.target == "CangleCAE"
            ? 5
            : 6;
        switch (myVals) {
          case 1:
            ggbObject.setVisible("instructionsIconFocusIndicator", true);
            // ggbObject.setVisible("displayedGGBButtonMessage", false);
            ggbObject.setValue("DangleSelected", false);
            ggbObject.setValue("CangleSelected", false);
            break;
          case 2:
            ggbObject.setVisible("xIconFocusIndicator", true);
            // ggbObject.setVisible("displayedGGBButtonMessage", false);
            ggbObject.setValue("DangleSelected", false);
            ggbObject.setValue("CangleSelected", false);
            break;
          case 3:
            ggbObject.setValue("escTextCount", ggbObject.getValue("escTextCount") + 1);
            ggbObject.setValue("DangleSelected", false);
            ggbObject.setValue("CangleSelected", false);
            break;
          case 4:
            ggbObject.evalCommand("ReadText(stepText)");
            ggbObject.setValue("DangleSelected", true);
            ggbObject.setValue("CangleSelected", false);
            break;
          case 5:
            ggbObject.evalCommand("ReadText(stepText)");
            ggbObject.setValue("DangleSelected", false);
            ggbObject.setValue("CangleSelected", true);
            break;

          default:
            ggbObject.setValue("DangleSelected", false);
            ggbObject.setValue("CangleSelected", false);
            if (barButtons.includes(a.target) && !ggbObject.getValue(a.target + "Enabled")) {
              disabledButtonDisplayMessage();
            } else {
              // ggbObject.setVisible("displayedGGBButtonMessage", false);
            }
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

  function disabledButtonDisplayMessage() {}
  // ggbObject.setVisible("displayedGGBButtonMessage", true);
  // ggbObject.evalCommand("ReadText(displayedGGBButtonMessage)");

  ///////////////////////////////////////////////////////////

  //cycle through point increments
  function cycle(a) {
    if (a == "DangleDAB" || a == "CangleCAE") {
      var xmlstring = ggbObject.getXML(a);
      var parser = new DOMParser();
      var xmldom = parser.parseFromString(xmlstring, "application/xml");
      var step = xmldom.getElementsByTagName("animation")[0].getAttribute("step");
      switch (step) {
        case "10°":
          xmldom.getElementsByTagName("animation")[0].setAttribute("step", "5°");
          break;
        case "5°":
          xmldom.getElementsByTagName("animation")[0].setAttribute("step", "1°");
          break;
        case "1°":
          xmldom.getElementsByTagName("animation")[0].setAttribute("step", "10°");
      }
      var serializer = new XMLSerializer();
      xmlstring = serializer.serializeToString(xmldom);
      ggbObject.evalXML(xmlstring);
    }
  }

  function keyit(event) {
    if (event.key == " ") {
      if (ggbObject.getValue("DangleSelected")) {
        cycle("DangleDAB");
      } else if (ggbObject.getValue("CangleSelected")) {
        cycle("CangleCAE");
      }
    }
    if (
      event.key == "ArrowLeft" ||
      event.key == "ArrowUp" ||
      event.key == "ArrowRight" ||
      event.key == "ArrowDown" ||
      event.key == "+" ||
      event.key == "-"
    ) {
      check();
    }
  }

  function check() {
    ggbObject.evalCommand("ReadText(status+stepText)");
  }
}

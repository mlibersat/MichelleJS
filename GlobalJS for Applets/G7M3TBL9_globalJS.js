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

  // restore object listeners
  ggbObject.registerAddListener(function (a) {
    var assignment = {
      DangleDAB: {
        type: "click",
        callback: cycle,
      },
      showLinearPair: {
        type: "update",
        callback: checkbox,
      },
      CangleCAE: {
        type: "click",
        callback: cycle,
      },
      optionSelected: {
        type: "update",
        callback: dropdown,
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
  ggbObject.registerObjectClickListener("DangleDAB", cycle);
  ggbObject.registerObjectClickListener("CangleCAE", cycle);
  ggbcanvas.addEventListener("keyup", keyit);
  ggbObject.registerObjectUpdateListener("showLinearPair", checkbox);
  // ggbObject.registerObjectClickListener("dropDownList", dropdown);
  ggbObject.registerObjectUpdateListener("optionSelected", dropdown);

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
        if (a.target == "DangleDAB") {
          var xmlstring2 = ggbObject.getXML("CangleCAE");
          var parser2 = new DOMParser();
          var xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
          xmldom2.getElementsByTagName("animation")[0].setAttribute("step", "1°");
          var serializer = new XMLSerializer();
          xmlstring2 = serializer.serializeToString(xmldom2);
          ggbObject.evalXML(xmlstring2);
        } else {
          var xmlstring2 = ggbObject.getXML("DangleDAB");
          var parser2 = new DOMParser();
          var xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
          xmldom2.getElementsByTagName("animation")[0].setAttribute("step", "1°");
          var serializer = new XMLSerializer();
          xmlstring2 = serializer.serializeToString(xmldom2);
          ggbObject.evalXML(xmlstring2);
        }
        ggbObject.setValue("currentStep", 1);
        ggbObject.evalCommand("ReadText(status+stepText)");

        break;
      case "mouseDown":
        if (a.hits[0] == "DangleDAB" || a.hit[0] == "CangleCAE") {
          var xmlstring = ggbObject.getXML(a.hits[0]);
          var parser = new DOMParser();
          var xmldom = parser.parseFromString(xmlstring, "application/xml");
          xmldom.getElementsByTagName("animation")[0].setAttribute("step", "5°");
          ggbObject.setValue("currentStep", 5);
          var serializer = new XMLSerializer();
          xmlstring = serializer.serializeToString(xmldom);
          ggbObject.evalXML(xmlstring);
          if (a.hits[0] == "DangleDAB") {
            var xmlstring2 = ggbObject.getXML("CangleCAE");
            var parser2 = new DOMParser();
            var xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
            xmldom2.getElementsByTagName("animation")[0].setAttribute("step", "5°");
            var serializer = new XMLSerializer();
            xmlstring2 = serializer.serializeToString(xmldom2);
            ggbObject.evalXML(xmlstring2);
          } else {
            var xmlstring2 = ggbObject.getXML("DangleDAB");
            var parser2 = new DOMParser();
            var xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
            xmldom2.getElementsByTagName("animation")[0].setAttribute("step", "5°");
            var serializer = new XMLSerializer();
            xmlstring2 = serializer.serializeToString(xmldom2);
            ggbObject.evalXML(xmlstring2);
          }
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
            : a.target == "dropDownList"
            ? 4
            : a.target == "DangleDAB" || a.target == "CangleCAE"
            ? 5
            : 6;
        switch (myVals) {
          case 1:
            ggbObject.setVisible("instructionsIconFocusIndicator", true);
            // ggbObject.setVisible("displayedGGBButtonMessage", false);
            break;
          case 2:
            ggbObject.setVisible("xIconFocusIndicator", true);
            // ggbObject.setVisible("displayedGGBButtonMessage", false);
            break;
          case 3:
            ggbObject.setValue("escTextCount", ggbObject.getValue("escTextCount") + 1);
            break;
          case 4:
            ggbObject.evalCommand("ReadText(selectAngleText)");
            break;
          case 5:
            ggbObject.evalCommand("ReadText(stepText)");
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
    var xmlstring = ggbObject.getXML(a);
    var parser = new DOMParser();
    var xmldom = parser.parseFromString(xmlstring, "application/xml");
    var step = xmldom.getElementsByTagName("animation")[0].getAttribute("step");
    switch (step) {
      case "10°":
        xmldom.getElementsByTagName("animation")[0].setAttribute("step", "5°");
        ggbObject.setValue("currentStep", 5);
        ggbObject.evalCommand("ReadText(stepText)");
        break;
      case "5°":
        xmldom.getElementsByTagName("animation")[0].setAttribute("step", "1°");
        ggbObject.setValue("currentStep", 1);
        ggbObject.evalCommand("ReadText(stepText)");
        break;
      case "1°":
        xmldom.getElementsByTagName("animation")[0].setAttribute("step", "10°");
        ggbObject.setValue("currentStep", 10);
        ggbObject.evalCommand("ReadText(stepText)");
    }
    var serializer = new XMLSerializer();
    xmlstring = serializer.serializeToString(xmldom);
    ggbObject.evalXML(xmlstring);
    var step = xmldom.getElementsByTagName("animation")[0].getAttribute("step");
    if (a == "DangleDAB") {
      var xmlstring2 = ggbObject.getXML("CangleCAE");
      var parser2 = new DOMParser();
      var xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
      xmldom2.getElementsByTagName("animation")[0].setAttribute("step", step);
      var serializer = new XMLSerializer();
      xmlstring2 = serializer.serializeToString(xmldom2);
      ggbObject.evalXML(xmlstring2);
    } else {
      var xmlstring2 = ggbObject.getXML("DangleDAB");
      var parser2 = new DOMParser();
      var xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
      xmldom2.getElementsByTagName("animation")[0].setAttribute("step", step);
      var serializer = new XMLSerializer();
      xmlstring2 = serializer.serializeToString(xmldom2);
      ggbObject.evalXML(xmlstring2);
    }
  }

  function keyit(event) {
    if (
      //took out arrow keys because arrows are used for the dropdown box
      event.key == "+" ||
      event.key == "-"
    ) {
      check();
      //  else if (event.key == "Enter") {
      //   dropdown();
    }
  }

  function check() {
    ggbObject.evalCommand("ReadText(status+stepText)");
  }

  function checkbox() {
    // if (ggbObject.getValue("showLinearPair")) {
    //   ggbObject.evalCommand("ReadText(angleText)");
    // } else {
    //   ggbObject.evalCommand("ReadText(angleText)");
    // }

    setTimeout(() => {
      ggbObject.evalCommand("ReadText(angleText)");
    }, 500);
    // setTimeout(ggbObject.evalCommand("ReadText(angleText)"), 2000);
  }

  function dropdown() {
    if (ggbObject.getValue("optionSelected") == 1) {
      ggbObject.evalCommand('ReadText("Point C is moveable.")');
    } else {
      ggbObject.evalCommand('ReadText("Point D is moveable.")');
    }
  }
}

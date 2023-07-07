// Nate's 3D applet code

function ggbOnInit(name, ggbObject) {
  var arialabel = "Interactive";
  // optional name change:
  var allCanvases = document.querySelectorAll("canvas");
  for (i = 0; i < allCanvases.length; i++) {
    // // required replacement 1:
    var ggbDiv = allCanvases[i].closest("div.appletParameters,div.notranslate");
    if (ggbDiv) {
      var parameterID = ggbDiv.getAttribute("id");
      var canvasID = "canvas" + parameterID;
      allCanvases[i].setAttribute("id", canvasID);
    }
    // end 1
  }
  var id = "canvas" + name;
  var ggbcanvas = document.getElementById(id);
  if (ggbcanvas) {
    ggbcanvas.setAttribute("aria-label", arialabel);
  }

  function button1Click() {
    enableButton(1, false);
    enableButton(2, true);
    ggbReadText("Two halves of the prism slide apart along a diagonal plane.");
    ggbObject.setValue("time", 0);
    ggbObject.setAnimating("time", true);
    ggbObject.startAnimation();
  }

  function button2Click() {
    enableButton(2, false);
    enableButton(1, true);
    ggbReadText("The halves of the prism slide together along the diagonal plane to form the original prism.");
    ggbObject.setValue("time", -1);
    ggbObject.setAnimating("time", true);
    ggbObject.startAnimation();
  }

  function button3Click() {
    ggbObject.setValue("CameraX", 0);
    ggbObject.setValue("CameraY", 0);
    ggbObject.setValue("time", 0);
    enableButton(3, false);
  }

  function button4Click() {
    // button 4 code here
  }

  function button5Click() {
    // button 5 code here
  }

  // required replacement 2: replaces readButtonText and keyboardInstructions
  function defineKeyboardInstructions(obj) {
    // takes a GGB object name as an argument, returns its keyboard text.
    var unavailableButtonText = "This button is unavailable.";
    var keyboardInstructions = {
      // object you shouldn't need to change
      AAppletStatus: "Press tab to select next object.",
      instructionsIcon: "Keyboard instructions enabled",
      xIcon: "Keyboard instructions enabled",
      // static text objects
      /* A: "Press the arrow keys to move this point.", // example for a point */
      // dynamic text objects
      ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to ___." : unavailableButtonText,
      ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to ___." : unavailableButtonText,
      ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to ___." : unavailableButtonText,
      ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
      ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
    };
    // if obj is a key in keyboardInstructions, then return the value. If not, then return the default string.
    return keyboardInstructions[obj] || "Keyboard instructions enabled.";
  }
  // end 2

  // optional name changes:
  ggbObject.registerClientListener(clientFunction);
  ggbObject.registerClickListener(clickListenerFunction);
  ggbObject.registerObjectUpdateListener("time", stopAnim);
  ggbObject.registerObjectUpdateListener("CameraX", enableReset);
  ggbObject.registerObjectUpdateListener("CameraY", enableReset);
  ggbcanvas.addEventListener("keyup", keyit);

  function stopAnim() {
    if ([-1, 0].includes(ggbObject.getValue("time"))) {
      ggbObject.stopAnimation();
      ggbObject.setAnimating("time", false);
    }
  }

  function enableReset() {
    if (ggbObject.getValue("CameraX") !== 0 || ggbObject.getValue("CameraY") !== 0) {
      enableButton(3, true);
    }
  }

  // // required replacement 3: replaces enableButton
  // call when you want to read what the keyboard instructions say, pass in an object
  function readKeyboardInstructions(obj) {
    var readIt = defineKeyboardInstructions(obj);
    ggbReadText(readIt);
  }

  // call when you want to show keyboard instructions for current object
  function updateKeyboardInstructions(obj = "") {
    var showIt = defineKeyboardInstructions(obj);
    ggbObject.setTextValue("keyboardInstructions", "\\text{" + showIt + "}");
  }

  // screen reader function
  // if readString is the name of a GGB text object, include true as a second argument
  function ggbReadText(readString, isGGBTextObj = false) {
    var addQuotes = isGGBTextObj ? "" : '"';
    ggbObject.evalCommand("ReadText(" + addQuotes + readString + addQuotes + ")");
  }

  // button state function
  function enableButton(buttonNum, boolean) {
    var enableOrDisable = boolean ? "enable" : "disable";
    ggbObject.evalCommand("Execute(" + enableOrDisable + "BarButton, ggbButton" + buttonNum + ")");
  }
  // end 3

  var barButtons = ["ggbButton1", "ggbButton2", "ggbButton3", "ggbButton4", "ggbButton5"];

  function clientFunction(a) {
    var clientTarget = a.target;
    switch (a.type) {
      case "select":
        // // required addition 4
        // on select always: update the keyboard instructions
        updateKeyboardInstructions(clientTarget);
        // if input box selected, show the keyboard instructions temporarily
        var forceKeyboardInstructions = ["textfield"];
        if (forceKeyboardInstructions.includes(ggbObject.getObjectType(clientTarget))) {
          ggbObject.setValue("showKeyboardInstructionsTemporarily", true);
        }
        // end 4
        switch (clientTarget) {
          // // required deletion 5
          // end 5
          case "AAppletStatus":
            // if status selected, don't read out escape text more than once
            ggbObject.setValue("escTextCount", ggbObject.getValue("escTextCount") + 1);
            break;
          default:
            // if button selected, read out its keyboard instructions
            if (barButtons.includes(clientTarget)) {
              // // required replacement 6
              readKeyboardInstructions(clientTarget);
              // end 6
            }
        }
        break;
      case "deselect":
        // on deselect always: stop showing keyboard instructions temporarily, update keyboard instructions
        // // required replacement 7
        ggbObject.setValue("showKeyboardInstructionsTemporarily", false);
        updateKeyboardInstructions();
        // end 7
        break;
    }
  }

  // optional name change
  function clickListenerFunction(a) {
    switch (a) {
      case "instructionsIcon":
        // show instructions, read out instructions, select xIcon
        var rawInstructions = ggbObject.getLaTeXString("instructionsText");
        var trimmedInstructions = rawInstructions.substr(6, rawInstructions.length - 7);
        var finalInstructions = trimmedInstructions.concat(" Press space to close the instructions.");
        // // required deletion 8: focus indicator
        // end 8
        ggbObject.setValue("showInstructions", true);
        ggbReadText(finalInstructions);
        ggbObject.evalCommand("SelectObjects(xIcon)");
        break;
      case "xIcon":
        // hide instructions, select instructionsIcon
        // // required deletion 9: focus indicator
        // end 9
        ggbObject.setValue("showInstructions", false);
        ggbObject.evalCommand("SelectObjects(instructionsIcon)");
        break;
      default:
        if (barButtons.includes(a)) {
          // clicked button: run its function if it's enabled, read its text otherwise; always update keyboard instructions
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
            // // required replacement 10
            readKeyboardInstructions(a);
            // end 10
          }
          // required addition 11
          updateKeyboardInstructions(a);
          // end 11
        }
    }
  }

  // // required addition 12
  function keyit(event) {
    switch (event.code) {
      case "KeyK":
        // toggle keyboard instructions, read new value
        var KIBool = ggbObject.getValue("showKeyboardInstructions");
        var KIText = "Keyboard instructions " + (KIBool ? "hidden" : "shown") + ".";
        ggbReadText(KIText);
        ggbObject.setValue("showKeyboardInstructions", !KIBool);
        break;
      // uncomment if you have >5 selectable objects
      /* case "KeyX":
          ggbObject.evalCommand("SelectObjects(AAppletStatus)");
          break; */
    }
  }
  // end 12
}

const {
  ggb1,
  feedback1,
  text3,
  cc_submit_6ff1fe7b670b_textbox1: text1,
  cc_submit_6ff1fe7b670b_input1: input1,
  cc_submit_6ff1fe7b670b_button1: button1,
  separator1,
  cc_sharewithclass_568244c7cd83_textbox1: text2,
  cc_sharewithclass_568244c7cd83_input1: input2,
  cc_sharewithclass_568244c7cd83_button1: button2,
  cc_sharewithclass_568244c7cd83_studentanswers1,
} = components;

ggb1.instance.setErrorDialogsActive(false);

onInit();
function onInit() {
  if (!ggb1.data.init) {
    text1.updateData({ visible: false });
    input1.updateData({ visible: false });
    button1.updateData({ visible: false });
    text2.updateData({ visible: false });
    input2.updateData({ visible: false });
    button2.updateData({ visible: false });
    ggb1.updateData({ init: true });
  }
}
ggb1.instance.setAxisLabels(1, "$\\mathit{x}$", "$\\mathit{y}$");
ggb1.instance.registerObjectUpdateListener("dragPoint", update);

// function update() {
//   text1.updateData({ visible: true });
//   input1.updateData({ visible: true });
//   button1.updateData({ visible: true });
// }

button1.on("click", () => {
  text2.updateData({ visible: true });
  input2.updateData({ visible: true });
  button2.updateData({ visible: true });
});

/////////////////////////////
function button1Click() {
  text1.updateData({ visible: true });
  input1.updateData({ visible: true });
  button1.updateData({ visible: true });
  enableButton(1, false);
}

function update() {
  enableButton(1, true);
  button2.updateData({ disabled: false });
  button1.updateData({ disabled: false });
}

// ggb1.instance.setAxisLabels(1, "$\\mathit{x}$", "$\\mathit{y}$");
/*
let now = controls.current;
autorun(() => {
  if (controls.current == now + 1) {
    utils.RTS.sendData("slide-a54624cada0b", {
      xVal: ggb1.instance.getValue("xVal"),
      yVal: ggb1.instance.getValue("yVal"),
    });
  }
});
*/
///////////////////////////

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

ggb1.instance.registerClientListener(focusIndicatorsAndErrorMessages);
ggb1.instance.registerClickListener(buttonAndIconClicks);

var barButtons = ["ggbButton1", "ggbButton2", "ggbButton3", "ggbButton4", "ggbButton5"];

function focusIndicatorsAndErrorMessages(a) {
  switch (a.type) {
    case "select":
      switch (a.target) {
        case "instructionsIcon":
          ggb1.instance.setVisible("instructionsIconFocusIndicator", true);
          // ggb1.instance.setVisible("displayedGGBButtonMessage", false);
          break;
        case "xIcon":
          ggb1.instance.setVisible("xIconFocusIndicator", true);
          // ggb1.instance.setVisible("displayedGGBButtonMessage", false);
          break;
        case "AAppletStatus":
          ggb1.instance.setValue("escTextCount", ggb1.instance.getValue("escTextCount") + 1);
          break;
        default:
          if (barButtons.includes(a.target) && !ggb1.instance.getValue(a.target + "Enabled")) {
            disabledButtonDisplayMessage();
          } else {
            // ggb1.instance.setVisible("displayedGGBButtonMessage", false);
          }
      }
      break;
    case "deselect":
      ggb1.instance.setVisible("instructionsIconFocusIndicator", false);
      ggb1.instance.setVisible("xIconFocusIndicator", false);
  }
}

function buttonAndIconClicks(a) {
  switch (a) {
    case "instructionsIcon":
      ggb1.instance.setValue("showInstructions", true);
      ggb1.instance.evalCommand("ReadText(instructionsText)");
      break;
    case "xIcon":
      ggb1.instance.setVisible("xIconFocusIndicator", false);
      ggb1.instance.setValue("showInstructions", false);
      ggb1.instance.evalCommand('ReadText("The instructions have been closed.")');
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
        if (buttonFunctions[a] && ggb1.instance.getValue(a + "Enabled")) {
          buttonFunctions[a]();
        } else {
          disabledButtonDisplayMessage();
        }
      }
  }
}

function enableButton(buttonNum, boolean) {
  ggb1.instance.setValue("ggbButton" + buttonNum + "Enabled", boolean);
  var color = boolean ? "0/255, 11/255, 92/255" : "118/255, 118/255,118/255";
  ggb1.instance.evalCommand("SetBackgroundColor(ggbButton" + buttonNum + ", " + color + ")");
}

function disabledButtonDisplayMessage() {
  // ggb1.instance.setVisible("displayedGGBButtonMessage", true);
  // ggb1.instance.evalCommand("ReadText(displayedGGBButtonMessage)");
}

/*
let now = controls.current;
autorun(() => {
  if (controls.current == now + 1) {
    utils.RTS.sendData("slide-a54624cada0b", {
      xVal: ggb1.instance.getValue("xVal"),
      yVal: ggb1.instance.getValue("yVal"),
    });
  }
});
*/
/*
{"compTotals":{"geogebra":1,"textbox":2,"submit":1,"separator":1,"sharewithclass":1},"stage":"Launch","lessonInfo":"8 M3 TD L17 - Similar Triangles on a Line","teacherView":false,"layout":"two col"}
*/

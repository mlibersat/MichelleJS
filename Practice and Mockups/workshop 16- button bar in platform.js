const { ggb1, feedback1, text1, buttonGroup1, separator1, text2, table1, text3 } = components;
ggb1;
onInit();
function onInit() {
  if (!ggb1.data.init) {
    //cntrl F this line, and replace with   enableButton(1, false); (from bnelow)
    //updateSingleButtonGroup(1, { disabled: false }, buttonGroup1);
    enableButton(1, false);
    enableButton(2, false);
    enableButton(3, false);
    text2.updateData({ visible: false });
    table1.updateData({ visible: false });
    table1.updateCell(0, 0, { value: "$0$" });
    table1.updateCell(1, 0, { value: "$0$" });
    table1.updateCell(0, 1, { value: "$0$" });
    table1.updateCell(1, 1, { value: "$0$" });
    ggb1.updateData({ init: true });
  }
}

ggb1.instance.setErrorDialogsActive(false);

// comment this out and anything that has buttonGroup
//const indexStartingInOne = 1;

//buttonGroup1.updateData({ align: "center" });

// function updateSingleButtonGroup(indexStartingInOne, data, buttonGroup1) {
//   const newButtonGroupData = [];
//   const bgButtons = buttonGroup1.data.buttons;
//   const index = indexStartingInOne - 1;
//   for (let i = 0; i < bgButtons.length; i++) {
//     if (i === index) {
//       newButtonGroupData[i] = { ...bgButtons[i], ...data }; // Merge the single button data with the respective button using the index
//     } else {
//       newButtonGroupData[i] = bgButtons[i]; // Every other button remain the same
//     }
//   }
//   buttonGroup1.updateData({ buttons: newButtonGroupData }); // Run updateData over buttons prop
// }

function button1Click() {
  ggb1.instance.setValue("show2", 1);
  ggb1.instance.setValue("show3", 0);
  shootIt();
  enableButton(1, false); //use this structure to enable or disable any of the (up to) 5 buttons
}

function button2Click() {
  ggb1.instance.setValue("show2", 0);
  ggb1.instance.setValue("show3", 1);
  shootIt();
}

function button3Click() {
  ggb1.instance.setValue("score", 0);
  if (ggb1.instance.getValue("set") == 1) {
    ggb1.instance.setValue("twoShots", 0);
    ggb1.instance.setValue("threeShots", 0);
  }
  ggb1.instance.setValue("twoShots2", 0);
  ggb1.instance.setValue("threeShots2", 0);
  text3.updateData({ text: " " });
}
//these buttonGroup names will be deleted. Everhthing that references these button groups needs to be replaced
//buttonGroup1.on("click:1", () => {

//});

//buttonGroup1.on("click:2", () => {

//});

//buttonGroup1.on("click:3", () => {

//});

function shootIt() {
  ggb1.instance.setAnimating("time", false);
  ggb1.instance.setValue("time", 0);
  ggb1.instance.setAnimating("time", true);
  ggb1.instance.startAnimation();
}

ggb1.instance.registerObjectUpdateListener("score", update);

function update() {
  if (ggb1.instance.getValue("score") == 0) {
    enableButton(1, false);
    enableButton(2, false);
    enableButton(3, false);
    text3.updateData({ text: " " });
  }
  if (ggb1.instance.getValue("score") > 0 && ggb1.instance.getValue("score") != 32) {
    enableButton(3, true);
  }
  if (ggb1.instance.getValue("score") > 32) {
    enableButton(1, false);
    enableButton(2, false);
    enableButton(3, true);
    text3.updateData({ text: "Try again." });
  }
  if (ggb1.instance.getValue("score") == 32 && ggb1.instance.getValue("set") == 1) {
    enableButton(1, false);
    enableButton(2, false);
    enableButton(3, false);
    text2.updateData({ visible: true });
    text3.updateData({ visible: true });
    table1.updateData({ visible: true });
    ggb1.instance.setValue("set", ggb1.instance.getValue("set") + 1);
  }
  if (ggb1.instance.getValue("score") == 32 && ggb1.instance.getValue("set") > 1) {
    enableButton(1, false);
    enableButton(2, false);
    enableButton(3, true);
  }
  if (
    ggb1.instance.getValue("score") == 32 &&
    table1.getCell(0, 0).value == table1.getCell(1, 0).value &&
    ggb1.instance.getValue("set") > 1
  ) {
    text3.updateData({ text: "Try again." });
  }
  if (
    ggb1.instance.getValue("score") == 32 &&
    table1.getCell(0, 0).value != table1.getCell(1, 0).value &&
    ggb1.instance.getValue("set") > 1
  ) {
    text3.updateData({ text: "Good job!" });
  }
}

ggb1.instance.registerObjectUpdateListener("set", setChange);

function setChange() {
  if (ggb1.instance.getValue("set") == 2) {
    ggb1.instance.setValue("score", 0);
  }
}

ggb1.instance.registerObjectUpdateListener("twoShots", add2One);

function add2One() {
  let num = ggb1.instance.getValue("twoShots");
  table1.updateCell(0, 0, { value: `$${num}$` });
}

ggb1.instance.registerObjectUpdateListener("threeShots", add3One);

function add3One() {
  let num2 = ggb1.instance.getValue("threeShots");
  table1.updateCell(0, 1, { value: `$${num2}$` });
}

ggb1.instance.registerObjectUpdateListener("twoShots2", add2One2);

function add2One2() {
  let num3 = ggb1.instance.getValue("twoShots2");
  table1.updateCell(1, 0, { value: `$${num3}$` });
}

ggb1.instance.registerObjectUpdateListener("threeShots2", add3One2);

function add3One2() {
  let num4 = ggb1.instance.getValue("threeShots2");
  table1.updateCell(1, 1, { value: `$${num4}$` });
}

let row1Total;
let row2Total;
let x1;
let y1;
let x2;
let y2;
autorun(() => {
  x1 = parseInt(table1.getCell(0, 0).value.replaceAll("$", ""));
  y1 = parseInt(table1.getCell(0, 1).value.replaceAll("$", ""));
  x2 = parseInt(table1.getCell(1, 0).value.replaceAll("$", ""));
  y2 = parseInt(table1.getCell(1, 1).value.replaceAll("$", ""));
  row1Total = 2 * x1 + 3 * y1;
  row2Total = 2 * x2 + 3 * y2;
});

let now = controls.current;
autorun(() => {
  if (controls.current == now + 1) {
    utils.RTS.sendData("slide-dc880babda70", {
      x1,
      y1,
      x2,
      y2,
      row1Total,
      row2Total,
    });
  }
});

/*
{"compTotals":{"geogebra":1,"textbox":4,"buttongroup":1,"separator":1,"table":1},"stage":"Launch","lessonInfo":"8 M4 TC L12 - Solutions to Linear Equations in Two Variables","teacherView":false,"layout":"two col"}
*/

/////////////////////////////////////////////////////
//works in platform with one minor chnage (ggbObjectt -> ggb1.instance, as usual). Could delete extra buttons underneath and also in function buttonAndIconClicks
function button1Click() {
  // button 1 code here
  enableButton(1, false); //use this structure to enable or disable any of the (up to) 5 buttons
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

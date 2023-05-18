/*
 1. Create a new button in GeoGebra and paste this code in the On Click script of the button
 2. Change the button script from GeoGebra Script to JavaScript
 3. Adjust the lines below
 4. Save the applet and share to the web
 5. Press the button twice, then delete the button
 6. Click "edit applet" and use GeoGebra's web menu to download as ggb file
 7. Watch this video if you need more support: https://bit.ly/3OzeSlO
*/

const numOfButtons = 2; //5 buttons or less (code won't work for more than 5)
const appletWidth = 590; //590 or 1210 pixels
const numSelectableObjects = 2; // be sure to count all selectable objects on "stage", excluding button bar objects

let xmax = 11; //What is your current xmax value in your applet?
let xmin = -11; //What is your current xmin value in your applet?

let willAxesEverBeShown = true; //If you never need an x or y axis, set this to false
let firstQuad = false; //Is the graph a first quadrant only graph?
let showAxes = true; //Do you want the x and y-axis displayed immediately?

let buttonName1 = "Try It";
let buttonName2 = "Reset";
let buttonName3 = "Insert Name";
let buttonName4 = "Insert Name";
let buttonName5 = "Insert Name";

let button1Enabled = true;
let button2Enabled = false;
let button3Enabled = true;
let button4Enabled = true;
let button5Enabled = true;

////////////////////////////////////////////////////////////////////////////////////////////
//Please don't edit anything below

let createObjectsList = [
  "corner1=Corner(1)",
  "corner2=Corner(2)",
  "corner3=Corner(3)",
  "corner4=Corner(4)",
  "corner=Corner(5)",
  "xpixel =(x(corner3)-x(corner1))/x(corner)",
  "ypixel = (y(corner3) - y(corner1)) / y(corner)",
  "buttonBarHeight=60ypixel",
  "xMaxButtonBar=" + xmax + "",
  "xMinButtonBar=" + xmin + "",
  "yMaxButtonBar=y(corner) / x(corner) xMaxButtonBar + buttonBarHeight / 2",
  "yMinButtonBar=y(corner) / x(corner) xMinButtonBar + buttonBarHeight / 2",
  "BottomLeftButtonBar=corner4 + (0, -buttonBarHeight)",
  "BottomRightButtonBar=corner3 + (0, -buttonBarHeight)",
  "Export_1=corner1",
  "Export_2=BottomRightButtonBar+(0,-2ypixel)",
  "InstructionsIconPoint=corner4 + (31xpixel, (-buttonBarHeight) / 2)",
  "YAxisTop=(0xpixel, y(corner4)-buttonBarHeight-2ypixel)",
  "YAxisBottom=(0xpixel, y(corner1)+2ypixel)",
  "showInstructions=false",
  "showKeyboardInstructions = false",
  "showKeyboardInstructionsTemporarily = false",
  'disableBarButton = {"SetBackgroundColor(%1, 118/255, 118/255, 118/255)", "SetValue(%1Enabled, false)"}',
  'enableBarButton = {"SetBackgroundColor(%1, 0, 11/255, 92/255)", "SetValue(%1Enabled, true)"}',
  "showAxes=" + showAxes + "",
  "fakeYaxis=Segment(YAxisTop,YAxisBottom)",
  'yAxisY=Text("y", YAxisTop + (4xpixel, -1 ypixel), true, true)',
  "buttonBar=Polygon({corner4, BottomLeftButtonBar, BottomRightButtonBar, corner3})",
  "buttonBarBorder=Segment(BottomLeftButtonBar, BottomRightButtonBar)",
  "escTextCount=0",
  'escText=""+ If(escTextCount<2,"Press the escape key to exit the interactive and return to the page.","")',
  'defaultGGBLanguage="English"',
];

let selectText = numSelectableObjects >= 5 ? "true" : "false";

let textList = [
  //"ggbButtonMessageWidth=x(Corner(ggbButtonMessage, 3)) - x(Corner(ggbButtonMessage, 1))",
  //"ggbButtonMessageHeight=y(Corner(ggbButtonMessage, 3)) - y(Corner(ggbButtonMessage, 1))",
  //"displayedGGBButtonMessage=Text(ggbButtonMessage, BottomRightButtonBar + (-ggbButtonMessageWidth + 3xpixel, -3 ypixel), true, true)",
  "displayedInstructionsText=Text(instructionsText, BottomLeftButtonBar + 3(xpixel, -ypixel),true,true)",
  "instructionsBox=Polygon({Corner(displayedInstructionsText, 4), Corner(displayedInstructionsText, 3) + (32xpixel, 0), Corner(displayedInstructionsText, 2) + (32xpixel, 0), Corner(displayedInstructionsText, 1)})",
  "XIconPoint=Corner(displayedInstructionsText, 3) + (16xpixel, -16 ypixel)",
  'intermediateKeyboardInstructions = Text("\\text{" + keyboardInstructions + "}", (0,0), true, true)',
  "KeyInstructionsBR = Corner(intermediateKeyboardInstructions, 2)",
  "KeyInstructionsTL = Corner(intermediateKeyboardInstructions, 4)",
  "keyInstructionsVec: Vector(KeyInstructionsBR, KeyInstructionsTL)",
  "displayedKeyboardInstructions=Text(intermediateKeyboardInstructions, corner2 + keyInstructionsVec + (2 xpixel, -2 ypixel), true, true)",
  'keybindText = "\\\\ \\\\Press k to " + If(showKeyboardInstructions,"hide","show") + " keyboard instructions." + If(' +
    selectText +
    ',"\\\\ \\\\Press x to restart the tab cycle.","")',
];

let setFixedList = [
  "fakeYaxis",
  "buttonBar",
  "buttonBarBorder",
  //"displayedGGBButtonMessage",
  "yAxisY",
  "displayedInstructionsText",
  "displayedKeyboardInstructions",
  "instructionsBox",
];

let evalCommandList = [
  "SetDecoration(fakeYaxis, 4, 4)",
  "SetConditionToShowObject(fakeYaxis, showAxes)",
  "SetConditionToShowObject(yAxisY, showAxes)",
  //"SetBackgroundColor(displayedGGBButtonMessage, 1,1,1)",
  "SetConditionToShowObject(displayedInstructionsText, showInstructions)",
  "SetConditionToShowObject(instructionsBox, showInstructions)",
  "SetConditionToShowObject(displayedKeyboardInstructions, showKeyboardInstructions || showKeyboardInstructionsTemporarily)",
  "SetBackgroundColor(displayedKeyboardInstructions, 1, 1, 1)",
];

let setVisibleList = [
  "BottomLeftButtonBar",
  "BottomRightButtonBar",
  "YAxisTop",
  "YAxisBottom",
  //"ggbButtonMessage",
  //"displayedGGBButtonMessage",
  "InstructionsIconPoint",
  "instructionsText",
  "displayedInstructionsText",
  "XIconPoint",
  "instructionsBox",
  "escText",
  "Export_1",
  "Export_2",
  "disableBarButton",
  "enableBarButton",
  "KeyInstructionsBR",
  "KeyInstructionsTL",
  "keyInstructionsVec",
  "keyboardInstructions",
  "intermediateKeyboardInstructions",
  "keybindText",
  "defaultGGBLanguage",
];

let setLineOpacityList = ["fakeYaxis", "buttonBarBorder"];

let noAxesNeededDeleteObjectsList = ["YAxisTop", "YAxisBottom", "showAxes", "fakeYaxis", "yAxisY"];

// let noButtonsNeededDeleteObjectsList = [
//   "ggbButtonMessageWidth",
//   "ggbButtonMessageHeight",
//   "displayedGGBButtonMessage",
//   "ggbButtonMessage",
// ];

if (ggbApplet.exists("buttonBar")) {
  if (numOfButtons > 0) {
    createButtons();
    buttonSizeandBold();
  }
  alignButtons();
} else {
  createObjects();
  setLayers();
  evalCommandStuff();
  setFixedStuff();
  setColors();
  setLineThickness();
  setFilling();
  setVisibleStuff();
  if (numOfButtons > 0) {
    createButtons();
    buttonSizeandBold();
  }
  textObjectSizeandStyle();
  setLineOpacity();
  deleteUnneededObjects();
  createSVGs();
}

function alignButtons() {
  //position buttons
  let button1Width = ggbApplet.getValue(
    ggbApplet.evalCommandGetLabels("ggbButton1Width=(x(Corner(ggbButton1, 3))-x(Corner(ggbButton1, 1)))/xpixel")
  );

  let button2Width;
  let button3Width;
  let button4Width;
  let button5Width;
  if (numOfButtons > 1) {
    button2Width = ggbApplet.getValue(
      ggbApplet.evalCommandGetLabels("ggbButton2Width=(x(Corner(ggbButton2, 3))-x(Corner(ggbButton2, 1)))/xpixel")
    );
  }
  if (numOfButtons > 2) {
    button3Width = ggbApplet.getValue(
      ggbApplet.evalCommandGetLabels("ggbButton3Width=(x(Corner(ggbButton3,3))-x(Corner(ggbButton3,1)))/xpixel")
    );
  }
  if (numOfButtons > 3) {
    button4Width = ggbApplet.getValue(
      ggbApplet.evalCommandGetLabels("ggbButton4Width=(x(Corner(ggbButton4,3))-x(Corner(ggbButton4,1)))/xpixel")
    );
  }
  if (numOfButtons > 4) {
    button5Width = ggbApplet.getValue(
      ggbApplet.evalCommandGetLabels("ggbButton5Width=(x(Corner(ggbButton5,3))-x(Corner(ggbButton5,1)))/xpixel")
    );
  }

  if (numOfButtons == 1) {
    ggbApplet.evalCommand(
      "SetCoords(ggbButton1, " + appletWidth + "-" + button1Width + "-15, (buttonBarHeight/ypixel-30)/2)"
    );
  } else if (numOfButtons == 2) {
    ggbApplet.evalCommand(
      "SetCoords(ggbButton1, " +
        appletWidth +
        "-" +
        button1Width +
        "-" +
        button2Width +
        "-2*15, (buttonBarHeight/ypixel-30)/2)"
    );
    ggbApplet.evalCommand(
      "SetCoords(ggbButton2, " + appletWidth + "-" + button2Width + "-15, (buttonBarHeight/ypixel-30)/2)"
    );
  } else if (numOfButtons == 3) {
    ggbApplet.evalCommand(
      "SetCoords(ggbButton1, " +
        appletWidth +
        "-" +
        button1Width +
        "-" +
        button2Width +
        "-" +
        button3Width +
        "-3*15, (buttonBarHeight/ypixel-30)/2)"
    );
    ggbApplet.evalCommand(
      "SetCoords(ggbButton2, " +
        appletWidth +
        "-" +
        button2Width +
        "-" +
        button3Width +
        "-2*15, (buttonBarHeight/ypixel-30)/2)"
    );
    ggbApplet.evalCommand(
      "SetCoords(ggbButton3, " + appletWidth + "-" + button3Width + "-15, (buttonBarHeight/ypixel-30)/2)"
    );
  } else if (numOfButtons == 4) {
    ggbApplet.evalCommand(
      "SetCoords(ggbButton1, " +
        appletWidth +
        "-" +
        button1Width +
        "-" +
        button2Width +
        "-" +
        button3Width +
        "-" +
        button4Width +
        "-4*15, (buttonBarHeight/ypixel-30)/2)"
    );
    ggbApplet.evalCommand(
      "SetCoords(ggbButton2, " +
        appletWidth +
        "-" +
        button2Width +
        "-" +
        button3Width +
        "-" +
        button4Width +
        "-3*15, (buttonBarHeight/ypixel-30)/2)"
    );
    ggbApplet.evalCommand(
      "SetCoords(ggbButton3, " +
        appletWidth +
        "-" +
        button3Width +
        "-" +
        button4Width +
        "-2*15, (buttonBarHeight/ypixel-30)/2)"
    );
    ggbApplet.evalCommand(
      "SetCoords(ggbButton4, " + appletWidth + "-" + button4Width + "-15, (buttonBarHeight/ypixel-30)/2)"
    );
  } else if (numOfButtons == 5) {
    ggbApplet.evalCommand(
      "SetCoords(ggbButton1, " +
        appletWidth +
        "-" +
        button1Width +
        "-" +
        button2Width +
        "-" +
        button3Width +
        "-" +
        button4Width +
        "-" +
        button5Width +
        "-5*15, (buttonBarHeight/ypixel-30)/2)"
    );
    ggbApplet.evalCommand(
      "SetCoords(ggbButton2, " +
        appletWidth +
        "-" +
        button2Width +
        "-" +
        button3Width +
        "-" +
        button4Width +
        "-" +
        button5Width +
        "-4*15, (buttonBarHeight/ypixel-30)/2)"
    );
    ggbApplet.evalCommand(
      "SetCoords(ggbButton3, " +
        appletWidth +
        "-" +
        button3Width +
        "-" +
        button4Width +
        "-" +
        button5Width +
        "-3*15, (buttonBarHeight/ypixel-30)/2)"
    );
    ggbApplet.evalCommand(
      "SetCoords(ggbButton4, " +
        appletWidth +
        "-" +
        button4Width +
        "-" +
        button5Width +
        "-2*15, (buttonBarHeight/ypixel-30)/2)"
    );
    ggbApplet.evalCommand(
      "SetCoords(ggbButton5, " + appletWidth + "-" + button5Width + "-15, (buttonBarHeight/ypixel-30)/2)"
    );
  }
  ggbApplet.deleteObject("ggbButton1Width");
  ggbApplet.deleteObject("ggbButton2Width");
  ggbApplet.deleteObject("ggbButton3Width");
  ggbApplet.deleteObject("ggbButton4Width");
  ggbApplet.deleteObject("ggbButton5Width");
}

function createObjects() {
  for (let i = 0, L = createObjectsList.length; i < L; i++) {
    ggbApplet.evalCommand(createObjectsList[i]);
  }
  if (firstQuad) {
    ggbApplet.evalCommand("YAxisBottom = (0,0)");
  }
  //ggbApplet.evalCommand('ggbButtonMessage=Text("\\text{This button is unavailable}",(0,0),false,true)');
  ggbApplet.evalCommand(
    'instructionsText=Text("\\text{Insert instructions here. Please use\\\\Nates text helper slide to have\\\\consistent line breaks across applets.}",(0,0),false,true)'
  );
  ggbApplet.evalCommand('keyboardInstructions = "Keyboard instructions enabled"');

  for (let i = 0, L = textList.length; i < L; i++) {
    ggbApplet.evalCommand(textList[i]);
  }
}

function setLayers() {
  ggbApplet.setLayer("fakeYaxis", 0);
  ggbApplet.setLayer("yAxisY", 0);
  ggbApplet.setLayer("instructionsBox", 5);
  // ggbApplet.setLayer("displayedGGBButtonMessage", 6);
  ggbApplet.setLayer("displayedInstructionsText", 6);
  ggbApplet.setLayer("buttonBar", 7);
  ggbApplet.setLayer("buttonBarBorder", 8);
  ggbApplet.setLayer("displayedKeyboardInstructions", 8);
}

function evalCommandStuff() {
  for (let i = 0, L = evalCommandList.length; i < L; i++) {
    ggbApplet.evalCommand(evalCommandList[i]);
  }
  if (firstQuad) {
    ggbApplet.evalCommand("SetDecoration(fakeYaxis, 4, 0)");
  }
}

function setFixedStuff() {
  for (let i = 0, L = setFixedList.length; i < L; i++) {
    ggbApplet.setFixed(setFixedList[i], false, false);
  }
}

function setColors() {
  ggbApplet.setColor("buttonBarBorder", 0, 0, 0);
  ggbApplet.setColor("fakeYaxis", 0, 0, 0);
  ggbApplet.setColor("buttonBar", 255, 255, 255);
  ggbApplet.setColor("instructionsBox", 255, 255, 255);
}

function setLineThickness() {
  ggbApplet.setLineThickness("buttonBar", 0);
  ggbApplet.setLineThickness("fakeYaxis", 4);
  ggbApplet.setLineThickness("buttonBarBorder", 5);
  ggbApplet.setLineThickness("instructionsBox", 0);
}

function setFilling() {
  ggbApplet.setFilling("buttonBar", 1);
  ggbApplet.setFilling("instructionsBox", 1);
}

function setVisibleStuff() {
  for (let i = 0, L = setVisibleList.length; i < L; i++) {
    ggbApplet.setVisible(setVisibleList[i], false);
  }
}

function createButtons() {
  //list of names and booleans to pull from in the below for loops
  let buttonNameList = [buttonName1, buttonName2, buttonName3, buttonName4, buttonName5];

  let buttonEnabledList = [button1Enabled, button2Enabled, button3Enabled, button4Enabled, button5Enabled];

  //creating booleans to enable buttons
  for (let i = 1, L = numOfButtons + 1; i < L; i++) {
    ggbApplet.evalCommand("ggbButton" + i + "Enabled=" + buttonEnabledList[i - 1] + "");
  }

  //creating and coloring buttons
  for (let i = 1, L = numOfButtons + 1; i < L; i++) {
    ggbApplet.evalCommand(
      'Execute({"ggbButton' +
        i +
        '=Button("+UnicodeToLetter(34)+"' +
        buttonNameList[i - 1] +
        '"+UnicodeToLetter(34)+")"})'
    );
    ggbApplet.setFixed("ggbButton" + i, true, true);
    ggbApplet.setColor("ggbButton" + i, 255, 255, 255);
    if (buttonEnabledList[i - 1]) {
      ggbApplet.evalCommand("SetBackgroundColor(ggbButton" + i + ",0/255,11/255,92/255)");
    } else {
      ggbApplet.evalCommand("SetBackgroundColor(ggbButton" + i + ",118/255,118/255,118/255)");
    }
  }
}

function buttonSizeandBold() {
  //button names to pull from in for loop below
  let buttonStringNameList = ["ggbButton1", "ggbButton2", "ggbButton3", "ggbButton4", "ggbButton5"];

  //changing button font size to medium and style to bold
  for (let i = 0, L = numOfButtons; i < L; i++) {
    var xmlstring = ggbApplet.getXML(buttonStringNameList[i]);

    //convert XML string to XML document
    var parser = new DOMParser();
    var xmldom = parser.parseFromString(xmlstring, "application/xml");

    //navigate the XML DOM to change the value of an attribute
    var newElement = xmldom.createElement("font");
    xmldom.getElementsByTagName("element")[0].appendChild(newElement);
    xmldom.getElementsByTagName("font")[0].setAttribute("serif", "false");
    xmldom.getElementsByTagName("font")[0].setAttribute("sizeM", "1.4");
    xmldom.getElementsByTagName("font")[0].setAttribute("size", "8");
    xmldom.getElementsByTagName("font")[0].setAttribute("style", "1");

    //convert the XML document back into a string
    var serializer = new XMLSerializer();
    xmlstring = serializer.serializeToString(xmldom);

    //evaluate XML string to update the element in Geogebra
    ggbApplet.evalXML(xmlstring);
  }
}

//changing certain text objects' size and style (serif vs. sans-serif)
function textObjectSizeandStyle() {
  let xmlstring1 = ggbApplet.getXML("instructionsText");
  let xmlstring2 = ggbApplet.getXML("displayedInstructionsText");
  let xmlstring3 = ggbApplet.getXML("intermediateKeyboardInstructions");
  let xmlstring4 = ggbApplet.getXML("displayedKeyboardInstructions");
  let xmlstring5 = ggbApplet.getXML("yAxisY");
  //convert XML string to XML document
  let parser = new DOMParser();
  let xmldom1 = parser.parseFromString(xmlstring1, "application/xml");
  let xmldom2 = parser.parseFromString(xmlstring2, "application/xml");
  let xmldom3 = parser.parseFromString(xmlstring3, "application/xml");
  let xmldom4 = parser.parseFromString(xmlstring4, "application/xml");
  let xmldom5 = parser.parseFromString(xmlstring5, "application/xml");
  //naviagte the XML DOM to change the value of an attribute
  xmldom1.getElementsByTagName("font")[0].setAttribute("serif", "false");
  xmldom1.getElementsByTagName("isLaTeX")[0].setAttribute("val", "true");
  xmldom1.getElementsByTagName("font")[0].setAttribute("sizeM", "0.7");
  xmldom1.getElementsByTagName("font")[0].setAttribute("size", "-6");
  xmldom2.getElementsByTagName("font")[0].setAttribute("serif", "false");
  xmldom2.getElementsByTagName("font")[0].setAttribute("sizeM", "0.7");
  xmldom2.getElementsByTagName("font")[0].setAttribute("size", "-6");
  xmldom3.getElementsByTagName("font")[0].setAttribute("serif", "false");
  xmldom3.getElementsByTagName("font")[0].setAttribute("sizeM", "0.7");
  xmldom3.getElementsByTagName("font")[0].setAttribute("size", "-6");
  xmldom4.getElementsByTagName("font")[0].setAttribute("serif", "false");
  xmldom4.getElementsByTagName("font")[0].setAttribute("sizeM", "0.7");
  xmldom4.getElementsByTagName("font")[0].setAttribute("size", "-6");
  xmldom5.getElementsByTagName("font")[0].setAttribute("serif", "true");
  xmldom5.getElementsByTagName("font")[0].setAttribute("sizeM", "1");
  //convert the XML document back into a string
  let serializer = new XMLSerializer();
  xmlstring1 = serializer.serializeToString(xmldom1);
  xmlstring2 = serializer.serializeToString(xmldom2);
  xmlstring3 = serializer.serializeToString(xmldom3);
  xmlstring4 = serializer.serializeToString(xmldom4);
  xmlstring5 = serializer.serializeToString(xmldom5);
  //evaluate XML string to update the element in Geogebra
  ggbApplet.evalXML(xmlstring1);
  ggbApplet.evalXML(xmlstring2);
  ggbApplet.evalXML(xmlstring3);
  ggbApplet.evalXML(xmlstring4);
  ggbApplet.evalXML(xmlstring5);
}

function setLineOpacity() {
  //changing line opacity to 95% because I don't know the value for 100%
  for (let i = 0, L = setLineOpacityList.length; i < L; i++) {
    var xmlstring = ggbApplet.getXML(setLineOpacityList[i]);

    //convert XML string to XML document
    var parser = new DOMParser();
    var xmldom = parser.parseFromString(xmlstring, "application/xml");

    //naviagte the XML DOM to change the value of an attribute
    var newElement = xmldom.createElement("opacity");
    xmldom.getElementsByTagName("element")[0].appendChild(newElement);
    xmldom.getElementsByTagName("lineStyle")[0].setAttribute("opacity", "255");

    //convert the XML document back into a string
    var serializer = new XMLSerializer();
    xmlstring = serializer.serializeToString(xmldom);

    //evaluate XML string to update the element in Geogebra
    ggbApplet.evalXML(xmlstring);
  }
}

function deleteUnneededObjects() {
  if (!willAxesEverBeShown) {
    for (let i = 0, L = noAxesNeededDeleteObjectsList.length; i < L; i++) {
      ggbApplet.deleteObject(noAxesNeededDeleteObjectsList[i]);
    }
  }
  if (numOfButtons == 0) {
    // for (let i = 0, L = noButtonsNeededDeleteObjectsList.length; i < L; i++) {
    //   ggbApplet.deleteObject(noButtonsNeededDeleteObjectsList[i]);
    // }
  }
}

function createSVGs() {
  const workingJSON = ggbApplet.getFileJSON();

  for (let i = 0, L = workingJSON.archive.length; i < L; i++) {
    if (workingJSON.archive[i].fileName === "geogebra.xml") {
      workingJSON.archive[i].fileContent = workingJSON.archive[i].fileContent
        .replace(
          "</element>",
          '</element>\n<element type="image" label="instructionsIcon">\n\t<file name="ece879b49edae94bc1adb86074bc603d/instructionsIcon.svg"/>\n\t<inBackground val="false"/>\n\t<centered val="true"/>\n\t<startPoint number="3" exp="InstructionsIconPoint"/>\n\t<show object="true" label="true"/>\n\t<objColor r="0" g="0" b="0" alpha="1"/>\n\t<layer val="8"/>\n\t<labelMode val="0"/>\n\t<animation step="0.1" speed="1" type="0" playing="false"/>\n\t<auxiliary val="false"/>\n\t<caption val="Instructions. Press space to open the instructions."/>\n</element>'
        )
        .replace(
          "</element>",
          '</element>\n<element type="image" label="xIcon">\n\t<file name="2acae2ad4d6cccb2eb4b675aaea33301/xIcon.svg"/>\n\t<inBackground val="false"/>\n\t<centered val="true"/>\n\t<startPoint number="3" exp="XIconPoint"/>\n\t<show object="true" label="true"/>\n\t<condition showObject="showInstructions"/>\n\t<objColor r="0" g="0" b="0" alpha="1"/>\n\t<layer val="8"/>\n\t<labelMode val="0"/>\n\t<animation step="0.1" speed="1" type="0" playing="false"/>\n\t<auxiliary val="false"/>\n\t<caption val="Close."/>\n</element>'
        );
    }
  }

  workingJSON.archive[workingJSON.archive.length] = {
    fileName: "ece879b49edae94bc1adb86074bc603d/instructionsIcon.svg",
    fileContent:
      '<svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" height="40" width="40"><defs><style>.cls-1{fill:#010101;}</style></defs><g id="icon"><path class="cls-1" d="M21.25,11.86a1.52,1.52,0,0,0-.56-.26,3.39,3.39,0,0,0-1.37,0,1.49,1.49,0,0,0-.57.26,1.32,1.32,0,0,0-.38.49,2.16,2.16,0,0,0,0,1.53,1.28,1.28,0,0,0,.38.5,1.49,1.49,0,0,0,.57.26,2.51,2.51,0,0,0,.69.08,2.49,2.49,0,0,0,.68-.08,1.52,1.52,0,0,0,.56-.26,1.41,1.41,0,0,0,.39-.5,2.16,2.16,0,0,0,0-1.53A1.46,1.46,0,0,0,21.25,11.86Z"/><rect class="cls-1" x="18.37" y="16.21" width="3.26" height="11.96"/><path class="cls-1" d="M20,4A16,16,0,1,0,36,20,16,16,0,0,0,20,4Zm0,29.69A13.69,13.69,0,1,1,33.69,20,13.7,13.7,0,0,1,20,33.69Z"/></g></svg>\n',
  };

  workingJSON.archive[workingJSON.archive.length] = {
    fileName: "2acae2ad4d6cccb2eb4b675aaea33301/xIcon.svg",
    fileContent:
      '<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g id="a"/><g id="b"><g id="c"><path d="M9.62,8L15.67,1.95c.45-.45,.45-1.17,0-1.62s-1.17-.45-1.62,0L8,6.38,1.95,.33C1.5-.11,.78-.11,.33,.33S-.11,1.5,.33,1.95l6.05,6.05L.33,14.05c-.45,.45-.45,1.17,0,1.62,.22,.22,.52,.33,.81,.33s.58-.11,.81-.33l6.05-6.05,6.05,6.05c.22,.22,.52,.33,.81,.33s.58-.11,.81-.33c.45-.45,.45-1.17,0-1.62l-6.05-6.05Z"/></g></g></svg>',
  };

  ggbApplet.setFileJSON(workingJSON);
}

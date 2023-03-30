// var ggbObject;

function ggbOnInit(name, ggbObject) {
  var arialabel = "System of Inequalities Interactive";
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
  ggbObject.registerClickListener(styleit);
  ggbObject.registerClickListener(space);
  ggbObject.registerClientListener(indicator);

  ggbcanvas.addEventListener("keyup", keyit);

  function space(a) {
    if (a === "AAppletStatus") {
      ggbObject.evalCommand("ReadText(promptText)");
    }
  }

  points = ["A", "B", "C", "D", "E", "F"];

  var selectedPoint = "";

  var newXCoord = ggbObject.getXcoord(a.target);
  var newYCoord = ggbObject.getYcoord(a.target);
  var myDragEndText = ggbObject.getValueString(a.target.concat("selectText"));
  var myDragString = 'ReadText( " '.concat(
    myDragEndText,
    " moved to open parenthesis ",
    newXCoord,
    " comma ",
    newYCoord,
    ' close parenthesis.")'
  );
  var mySelectText = ggbObject.getValueString(a.target.concat("selectText"));
  var mySelectString = 'ReadText("Move '.concat(mySelectText, ' to change the line. ")');

  function indicator(a) {
    switch (a.type) {
      case "dragEnd":
        ggbObject.setValue("step", 1);

        ggbObject.evalCommand(myDragString);
        setTimeout(function () {
          switch (a.target) {
            case "E":
              ggbObject.evalCommand("ReadText(kStatus+pointText)");
              break;
            case "F":
              ggbObject.evalCommand("ReadText(kStatus+pointText)");
              break;
            case "C":
              ggbObject.evalCommand("ReadText(gStatus+pointText)");
              break;
            case "D":
              ggbObject.evalCommand("ReadText(gStatus+pointText)");
              break;
            case "A":
              ggbObject.evalCommand("ReadText(fStatus+pointText)");
              break;
            case "B":
              ggbObject.evalCommand("ReadText(fStatus+pointText)");
              break;
          }
        }, 1000);

        break;
      case "select":
        if (ggbObject.getObjectType(a.target) == "point") {
          ggbObject.setLabelVisible(a.target, true);
          ggbObject.evalCommand(mySelectString);
          selectedPoint = a.target;
          // console.log("selectedPoint");
          // console.log(selectedPoint);
          setTimeout(function () {
            ggbObject.evalCommand("ReadText(stepText)");
          }, 100);
        }

        if (ggbObject.getObjectType(a.target) == "vector") {
          setTimeout(function () {
            // console.log("changedFocus 1");
            // console.log(ggbObject.getValue("changedFocus"));
            if (ggbObject.getValue("changedFocus") === 0) {
              if (a.target === "a_1" || a.target === "w_1" || a.target === "v_1" || a.target === "u_1") {
                ggbObject.evalCommand('ReadText(""+kArrowsText +" Press space to change the direction of shading.")');
              }
              if (a.target === "i_1" || a.target === "b_1" || a.target === "l_1" || a.target === "j_1") {
                ggbObject.evalCommand('ReadText(""+gArrowsText +" Press space to change the direction of shading.")');
              }
              if (a.target === "u" || a.target === "w" || a.target === "v" || a.target === "s") {
                ggbObject.evalCommand('ReadText(""+fArrowsText +" Press space to change the direction of shading.")');
              }
            }
          }, 300);
        }

        if (ggbObject.getObjectType(a.target) == "line") {
          ggbObject.setVisible(a.target + "Caption", true);
          setTimeout(function () {
            if (ggbObject.getValue("lineClicked") === 0) {
              ggbObject.evalCommand("ReadText(" + a.target + "LineSelect)");
            }
          }, 100);
        }

        break;
      case "mouseDown":
        console.log(a);
        if (points.includes(a.hits[0])) {
          ggbObject.setValue("step", 2);
        }
        if (ggbObject.getObjectType(a.hits[0]) == "line") {
          setTimeout(function () {
            ggbObject.setValue("lineClicked", true);
          }, 100);
        }

        break;
      case "deselect":
        ggbObject.setLabelVisible("A", false);
        ggbObject.setLabelVisible("B", false);
        ggbObject.setLabelVisible("C", false);
        ggbObject.setLabelVisible("D", false);
        ggbObject.setLabelVisible("E", false);
        ggbObject.setLabelVisible("F", false);
        ggbObject.setLabelVisible("g", false);
        ggbObject.setLabelVisible("f", false);
        ggbObject.setLabelVisible("k", false);
        ggbObject.setVisible("fCaption", false);
        ggbObject.setVisible("gCaption", false);
        ggbObject.setVisible("kCaption", false);
        ggbObject.setValue("changedFocus", false);
        ggbObject.setValue("lineClicked", false);

        selectedPoint = "";
        break;
    }
  }

  function styleit(a) {
    if (points.includes(a)) {
      var step = ggbObject.getValue("step");
      switch (step) {
        case 5:
          ggbObject.setValue("step", 2);
          break;
        case 2:
          ggbObject.setValue("step", 1);
          break;
        case 1:
          ggbObject.setValue("step", 5);
      }
    }
    if (ggbObject.getObjectType(a) == "line") {
      if (ggbObject.getLineStyle(a) == 0) {
        ggbObject.setLineStyle(a, 2);
        switch (a) {
          case "f":
            ggbObject.setValue("i", false);
            ggbObject.evalCommand("ReadText(fLineSelect)");
            break;
          case "g":
            ggbObject.setValue("j", false);
            ggbObject.evalCommand("ReadText(gLineSelect)");
            break;
          case "k":
            ggbObject.setValue("l", false);
            ggbObject.evalCommand("ReadText(kLineSelect)");
            break;
        }
      } else {
        ggbObject.setLineStyle(a, 0);
        switch (a) {
          case "f":
            ggbObject.setValue("i", true);
            ggbObject.evalCommand("ReadText(fLineSelect)");
            break;
          case "g":
            ggbObject.setValue("j", true);
            ggbObject.evalCommand("ReadText(gLineSelect)");
            break;
          case "k":
            ggbObject.setValue("l", true);
            ggbObject.evalCommand("ReadText(kLineSelect)");
            break;
        }
      }
    }

    //////////////////////////////////
    //We may not need all these if/else statements. The vectors are hidden under these booleans, so they cannot be clicked. Ex: "u" is only visible when e is false, so we don't need an if e==true statement
    if (ggbObject.getObjectType(a) == "vector") {
      setTimeout(function () {
        ggbObject.setValue("changedFocus", true);
      }, 100);
      switch (a) {
        case "u":
          // if (ggbObject.getValue("e") == true) {
          //   ggbObject.setValue("e", false);
          // } else {
          ggbObject.setValue("e", true);
          ggbObject.evalCommand("SelectObjects(v)");
          ggbObject.evalCommand(
            'ReadText(""+fArrowsText+shadedText+" Press space to change the direction of shading.")'
          );
          // }
          break;
        case "w":
          // if (ggbObject.getValue("e") == true) {
          //   ggbObject.setValue("e", false);
          // } else {
          ggbObject.setValue("e", true);
          ggbObject.evalCommand("SelectObjects(s)");
          ggbObject.evalCommand(
            'ReadText(""+fArrowsText+shadedText+" Press space to change the direction of shading.")'
          );
          // }
          break;
        case "v":
          // if (ggbObject.getValue("e") == true) {
          ggbObject.setValue("e", false);
          ggbObject.evalCommand("SelectObjects(u)");
          ggbObject.evalCommand(
            'ReadText(""+fArrowsText+shadedText+" Press space to change the direction of shading.")'
          );
          // } else {
          //   ggbObject.setValue("e", true);
          // }
          break;
        case "s":
          // if (ggbObject.getValue("e") == true) {
          ggbObject.setValue("e", false);
          ggbObject.evalCommand("SelectObjects(w)");
          ggbObject.evalCommand(
            'ReadText(""+fArrowsText+shadedText+" Press space to change the direction of shading.")'
          );
          // } else {
          //   ggbObject.setValue("e", true);
          // }
          break;
        case "u_1":
          // if (ggbObject.getValue("c") == true) {
          ggbObject.setValue("c", false);
          ggbObject.evalCommand("SelectObjects(v_1)");
          ggbObject.evalCommand(
            'ReadText(""+kArrowsText+shadedText+" Press space to change the direction of shading.")'
          );
          // } else {
          //   ggbObject.setValue("c", true);
          // }
          break;
        case "w_1":
          // if (ggbObject.getValue("c") == true) {
          ggbObject.setValue("c", false);
          ggbObject.evalCommand("SelectObjects(a_1)");
          ggbObject.evalCommand(
            'ReadText(""+kArrowsText+shadedText+" Press space to change the direction of shading.")'
          );
          // } else {
          //   ggbObject.setValue("c", true);
          // }
          break;
        case "v_1":
          // if (ggbObject.getValue("c") == true) {
          //   ggbObject.setValue("c", false);
          // } else {
          ggbObject.setValue("c", true);
          ggbObject.evalCommand("SelectObjects(u_1)");
          ggbObject.evalCommand(
            'ReadText(""+kArrowsText+shadedText+" Press space to change the direction of shading.")'
          );
          // }
          break;
        case "a_1":
          // if (ggbObject.getValue("c") == true) {
          //   ggbObject.setValue("c", false);
          // } else {
          ggbObject.setValue("c", true);
          ggbObject.evalCommand("SelectObjects(w_1)");
          ggbObject.evalCommand(
            'ReadText(""+kArrowsText+shadedText+" Press space to change the direction of shading.")'
          );
          // }
          break;
        case "l_1":
          // if (ggbObject.getValue("h") == true) {
          ggbObject.setValue("h", false);
          ggbObject.evalCommand("SelectObjects(j_1)");
          ggbObject.evalCommand(
            'ReadText(""+gArrowsText+shadedText+" Press space to change the direction of shading.")'
          );
          // } else {
          //   ggbObject.setValue("h", true);
          // }
          break;
        case "j_1":
          // if (ggbObject.getValue("h") == true) {
          //   ggbObject.setValue("h", false);
          // } else {
          ggbObject.setValue("h", true);
          ggbObject.evalCommand("SelectObjects(l_1)");
          ggbObject.evalCommand(
            'ReadText(""+gArrowsText+shadedText+" Press space to change the direction of shading.")'
          );
          // }
          break;
        case "i_1":
          // if (ggbObject.getValue("h") == true) {
          ggbObject.setValue("h", false);
          ggbObject.evalCommand("SelectObjects(b_1)");
          ggbObject.evalCommand(
            'ReadText(""+gArrowsText+shadedText+" Press space to change the direction of shading.")'
          );
          // } else {
          //   ggbObject.setValue("h", true);
          // }
          break;
        case "b_1":
          // if (ggbObject.getValue("h") == true) {
          //   ggbObject.setValue("h", false);
          // } else {
          ggbObject.setValue("h", true);
          ggbObject.evalCommand("SelectObjects(i_1)");
          ggbObject.evalCommand(
            'ReadText(""+gArrowsText+shadedText+" Press space to change the direction of shading.")'
          );
          // }
          break;
      }
    }
    if (ggbObject.getObjectType(a) == "point") {
      ggbObject.evalCommand("ReadText(stepText)");
    }
  }

  function keyit(event) {
    if (event.key == "x") {
      ggbObject.evalCommand("SelectObjects(AAppletStatus)");
    }
    if (event.key == "ArrowLeft" || event.key == "ArrowUp" || event.key == "ArrowRight" || event.key == "ArrowDown") {
      // console.log("selectedPoint");
      // console.log(selectedPoint);
      setTimeout(function () {
        switch (selectedPoint) {
          case "E":
            ggbObject.evalCommand("ReadText(kStatus+pointText+stepText)");
            break;
          case "F":
            ggbObject.evalCommand("ReadText(kStatus+pointText+stepText)");
            break;
          case "C":
            ggbObject.evalCommand("ReadText(gStatus+pointText+stepText)");
            break;
          case "D":
            ggbObject.evalCommand("ReadText(gStatus+pointText+stepText)");
            break;
          case "A":
            ggbObject.evalCommand("ReadText(fStatus+pointText+stepText)");
            break;
          case "B":
            ggbObject.evalCommand("ReadText(fStatus+pointText+stepText)");
            break;
        }
      }, 1000);
    }
  }
}

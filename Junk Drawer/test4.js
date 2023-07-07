// Copy of Julia's G7>M2>TD L17>Global JS>aw4xhgga
// For alt text in JS

function ggbOnInit(name, ggbObject) {
  loadUtils().then(function (setupGGB) {
    const buttonClicks = defineButtonClickScripts();
    // you may replace the following function call with the name of your status text object as a string
    // if you do, you can delete the function defineStatusName
    const statusName = defineStatusName();
    const {
      getCanvas,
      setAriaLabel,
      readKeyboardInstructions,
      updateKeyboardInstructions,
      ggbReadText,
      enableButton,
      libClientFunction,
      libClickFunction,
      libKeyFunction,
      registerSafeObjectUpdateListener,
      registerSafeObjectClickListener,
      registerHoverListener,
      unavailableButtonText,
      setTabOrder,
      manageAddedList,
      editXML,
    } = setupGGB({
      name,
      ggbObject,
      defineKeyboardInstructions,
      buttonClicks,
      statusName,
    });
    const ggbcanvas = getCanvas(name);

    /*
     * IGNORE above
     * EDIT below
     */

    setAriaLabel(ggbcanvas, "Number Line with Number Bond Interactive");

    //global-ish variables
    let sketchToolObjects = [];
    let pictureToolObjects = [
      "MovableDragSegLeft",
      "PermaDragSegLeft",
      "MovableDragSegRight",
      "PermaDragSegRight",
      "bin",
    ];
    let selectedObject = "";
    const binThreshold = ggbObject.getValue("outsideBinY"); //this is fine outside
    let storedSelectedObject = "";
    let pointsInPictureToolToDelete = [];
    let clickCount = 0;
    let activeSegmentNames = [];
    let spaceToDelete = false;
    let lastSeg;
    const xmin = ggbObject.getValue("xminPadding"); //using the padding number because segments can't go farther than it
    const xmax = ggbObject.getValue("xmaxPadding");
    const boxWidth = ggbObject.getValue("boxWidth");
    let boxCount = 0; //keeps an accurate count of how many boxes are on the screen and will be used for captions and names of boxes.
    let boxNames = []; //helps me see what are the active box names
    let segmentObject = {}; //will be structured as {nameOfSeg: {yVal: #, xValL: #, xValR: #}, nameOfSeg: {yVal: #, xValL: #, xValR: #}, ...}
    let boxObject = {}; //will be structed as {nameOfBox: {type: "to the left", "to the right", "between", leftPoint: "name", rightPoint: "name"}}
    const standardWidth = 4; //this value is the typical width of a box you want, probably the same length as your movable drag segs
    //variables for tabOrder
    let middleTabOrder = [];
    let myTabOrder;
    let myTabString;
    let storedTabOrder;
    //variables for AAppletStatus
    let myCounts = {}; //used in multiple places
    let segmentReadOrder = [];
    //variables for screen reader help other than AAppletStatus
    let placed; //used in mulitple places
    let storedTool = ggbObject.getMode();

    //hide reset button & disable pan and zoom
    ggbObject.showResetIcon(false);
    ggbObject.enableShiftDragZoom(false);
    //   ggbObject.showToolBar(false);

    if (ggbObject.getValue("pictureTool")) {
      ggbObject.showToolBar(false);
    } else {
      ggbObject.showToolBar(true);
    }

    function checkObjectsOnLoad() {
      //called on load of the applet to see if there is anything stored in the boxObject and segmentObject that I need to retrieve
      const ggbStringsToCheck = [
        "boxObject",
        "segmentObject",
        "segmentReadOrder",
        "activeSegmentNames",
        "myCounts",
        "boxNames",
        "pictureToolObjects",
        "sketchToolObjects",
        "middleTabOrder",
        "pointsInPictureToolToDelete",
      ];
      ggbStringsToCheck.forEach((el) => {
        if (ggbObject.getValueString(el.concat("String")) !== "") {
          toGlobalJSObject(el);
        }
      });
      //   console.log("checked objects on load");
    }
    checkObjectsOnLoad();

    function defineStatusName() {
      // put the name of your GGB status text object here
      return "AAppletStatus";
    }
    // listeners here; keep these, add your own as needed
    ggbObject.registerClientListener(function (a) {
      clientFunction(a);
      libClientFunction(a);
    });
    ggbObject.registerClickListener(function (a) {
      clickListenerFunction(a);
      libClickFunction(a);
    });
    ggbcanvas.addEventListener("keyup", function (event) {
      keyit(event);
      libKeyFunction(event);
    });

    function defineButtonClickScripts() {
      // defines button scripts
      // keep this function, but you can delete anything/everything inside it
      return {
        ggbButton1: function () {
          //show the sketch tool
          showSketchTool();
          // ggbObject.setPointCapture(1, 3);
          enableButton(1, false);
          enableButton(2, true);
          ggbReadText(
            "The Sketch Tool has not been optimized for accessibility. For the accessible version of this learning experience navigate to the Picture Tool."
          );
          //last line of code below
          ggbObject.setValue("pictureTool", false); //keeps track of which tool they are using
        },
        ggbButton2: function () {
          //show the picture tool
          showPictureTool();
          // ggbObject.setPointCapture(1, 2);
          enableButton(1, true);
          enableButton(2, false);
          //last line of code below
          ggbObject.setValue("pictureTool", true); //keeps track of which tool they are using
        },
        ggbButton3: function () {
          reset();
        },
        ggbButton4: function () {},
        ggbButton5: function () {},
      };
    }

    function defineKeyboardInstructions(obj) {
      if (obj.includes("Spot")) {
        return "Press space to send the directed line segment to this location.";
      }
      if (obj.includes("Point0")) {
        return "Press the arrow keys to move this point.";
      }
      if (obj.includes("Point1")) {
        return "Press the left and right arrow keys to move this point.";
      }
      if (ggbObject.getObjectType(obj) === "penstroke") {
        return "Use the arrow keys to move this part of your sketch.";
      }
      const pictureBoo = ggbObject.getValue("pictureTool") ? "picture tool" : "sketch tool";
      // takes a GGB object name as an argument, returns its keyboard text.
      const keyboardInstructions = {
        MovableDragSegLeft: "Press space to show locations of where to place this directed line segment.",
        MovableDragSegRight: "Press space to show locations of where to place this directed line segment.",
        // A: "Press the arrow keys to move this point.", // example for a point
        ggbButton1: ggbObject.getValue("ggbButton1Enabled")
          ? "Press space to use the sketch tool."
          : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled")
          ? "Press space to use the picture tool."
          : unavailableButtonText,
        ggbButton3: ggbObject.getValue("ggbButton3Enabled")
          ? "Press space to reset your work for the " + pictureBoo + "."
          : unavailableButtonText,
        ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
      };
      return keyboardInstructions[obj];
    }

    function clientFunction(a) {
      if (a.type === "deselect") {
        console.warn("deselect is happening! here is selectedObject:", selectedObject);
      }
      const clientTarget = a.target;
      switch (a.type) {
        case "select":
          selectedObject = clientTarget;
          clickCount = 0;
          switch (true) {
            case selectedObject === "AAppletStatus":
              updateAppletStatus();
              break;
            case selectedObject === "MovableDragSegLeft":
              lastSeg = selectedObject;
              break;
            case selectedObject === "MovableDragSegRight":
              lastSeg = selectedObject;
              break;
            case ggbObject.getObjectType(selectedObject) === "segment":
              // setSegmentCaption(selectedObject);
              //commented out for not because segments will not be selectable.
              break;
            case selectedObject.includes("Spot"):
              setSpotCaption(selectedObject);
              break;
            case selectedObject.includes("Point0") || selectedObject.includes("Point1"):
              setPointCaption(selectedObject);
              if (ggbObject.getVisible("LeftSpot1") || ggbObject.getVisible("RightSpot1")) {
                updateTabOrder("remove", boxNames);
                deleteSpots();
              }
              break;
          }
          break;
        case "deselect":
          storedSelectedObject = selectedObject;
          selectedObject = "";
          // clearInterval(drawIt);
          // drawIt = null;
          break;
        case "mouseDown":
          //This is the case where a student uses the keyboard to move off the arrow but then clicks off of it using the mouse.
          if (a.hits.length === 0 && clickCount === 0) {
            if (a.target != "canvas" && selectedObject.includes("Movable")) {
              snapback("stick", selectedObject);
            } else if (
              !selectedObject.includes("Movable") &&
              !selectedObject.includes("bin") &&
              !selectedObject.includes("button")
            ) {
              console.log("calling snapback return from mouseDown");
              snapback("return", selectedObject);
            }
            clickCount++;
          } else if (a.hits.length > 0) {
            //if they click on something that has a target, set the clickCount back to 0.
            //issue: what if they click on nothing again
            clickCount = 0;
          }
          if (ggbObject.getVisible("LeftSpot1") || (ggbObject.getVisible("RightSpot1") && a.hits.length > 0)) {
            //delete spots
            if (!a.hits[0].includes("Spot")) {
              deleteSpots();
            }
            //   }
          }
          break;
        case "dragEnd":
          switch (ggbObject.getValue("pictureTool")) {
            case 0:
              // clearInterval(drawIt);
              // drawIt = null;
              break;
            case 1:
              if (a.target != "canvas" && selectedObject.includes("Movable")) {
                placed = false;
                snapback("stick", selectedObject);
                if (placed) {
                  ggbReadText(
                    "A directed line segment has been placed. It starts at ".concat(
                      segmentObject[activeSegmentNames[activeSegmentNames.length - 1]]["point0"],
                      " and ends at ",
                      segmentObject[activeSegmentNames[activeSegmentNames.length - 1]]["point1"],
                      ". Press space to create options of where to place the next directed line segment. Press tab to select next object."
                    )
                  );
                } else {
                  ggbReadText(
                    "No directed line segment was placed. Press space to create options of where to place the next directed line segment. Press tab to select next object."
                  );
                }
              } else if (
                !selectedObject.includes("Movable") &&
                !selectedObject.includes("bin") &&
                !selectedObject.includes("button")
              ) {
                console.log("calling snapback return from dragEnd");
                snapback("return", selectedObject);
                screenReaderWork(selectedObject);
              }
              break;
          }
          break;
      }
    }

    function clickListenerFunction(a) {
      // switch (a) {}
    }

    function keyit(event) {
      //picture tool
      switch (true) {
        case event.key == "Tab" && storedSelectedObject.includes("Movable"):
          //tabbing off a movable drag seg either sticks it to the stage or returns it to the bin
          snapback("stick", storedSelectedObject);
          break;
        case event.key == "Tab" &&
          //   !storedSelectedObject.includes("Movable") &&
          //   !storedSelectedObject.includes("bin") &&
          //   !storedSelectedObject.includes("button"):
          ggbObject.getObjectType(storedSelectedObject) === "point" &&
          storedSelectedObject.includes("DragSeg"):
          //tabbing off a drag seg that is already on the stage tests to see if it's in the bin to delete it
          console.log("calling snapback return from tab");
          snapback("return", storedSelectedObject);
          break;
        case event.code.includes("Arrow") &&
          (selectedObject === "MovableDragSegLeft" || selectedObject === "MovableDragSegRight"): {
          //move the seg back to it's original position
          const tempName = selectedObject.slice(7);
          ggbObject.setCoords(
            tempName + "EndBL",
            ggbObject.getXcoord(tempName + "StartBL"),
            ggbObject.getYcoord(tempName + "StartBL")
          );
          ggbObject.setCoords(
            tempName + "EndBR",
            ggbObject.getXcoord(tempName + "StartBR"),
            ggbObject.getYcoord(tempName + "StartBR")
          );
          //tell students to use the space key to select a spot to place the directed line seg.
          ggbReadText("Press space to create options of where to place this directed line segment.");
          break;
        }
        case event.code.includes("Arrow") && selectedObject.includes("Point0"):
          updateObject(selectedObject, "stick");
          screenReaderWork(selectedObject);
          break;
        case event.code.includes("Arrow") && selectedObject.includes("Point1"):
          updateObject(selectedObject, "stick");
          screenReaderWork(selectedObject);
          break;
        case event.code === "Space" && selectedObject.includes("Movable"): {
          //this is where I want to give them options on where to put the segment
          boxNames = [];
          const activeLeft = ggbObject.getValue("DragSegLeftOnScreen");
          const activeRight = ggbObject.getValue("DragSegRightOnScreen");
          //first I need to place the polygons on either side of the directed line segment (if there is room)
          if (activeSegmentNames.length == 0) {
            //probably want to change this^ condition to be the sum of the two or the length of the active segements array
            //new functions to create left and right spots at the ends of a directed line segment
            createLeftSpot(-4, 1, standardWidth, ++boxCount);
            boxObject["LeftSpot".concat(boxCount)] = {
              type: "to the left",
              attachedTo: [],
            };
            createRightSpot(0, 1, standardWidth, ++boxCount);
            boxObject["RightSpot".concat(boxCount)] = {
              type: "to the right",
              attachedTo: [],
            };
            toGGBString(boxObject);
          } else if (activeSegmentNames.length == 1) {
            //could also write this^ conditional as the sum of the two numbers being 1
            //place a box at the end of each part of the segment if it will fit on screen. If it won't fit on one side, then don't show that box.
            const myOneSeg = activeSegmentNames[0];
            //check the endpoints of myOneSeg
            const tempLeftX =
              ggbObject.getPointStyle(myOneSeg + "Point1") === 9
                ? ggbObject.getXcoord(myOneSeg + "Point1")
                : ggbObject.getXcoord(myOneSeg + "Point0");
            const tempRightX =
              ggbObject.getPointStyle(myOneSeg + "Point1") === 9
                ? ggbObject.getXcoord(myOneSeg + "Point0")
                : ggbObject.getXcoord(myOneSeg + "Point1");
            //I only need to find one Y because they are restricted to being the same Y coords
            const tempY = ggbObject.getYcoord(myOneSeg + "Point0");
            //give options for each box - either boxWidth length, or from 1-3 depending on abs value, or don't show.
            switch (true) {
              //this switch is for the LEFT box.
              case Math.abs(xmin - tempLeftX) >= boxWidth:
                //when there is 4 or more units left until the edge, no adjustment needed
                createLeftSpot(tempLeftX - standardWidth, tempY, standardWidth, ++boxCount);
                boxObject["LeftSpot".concat(boxCount)] = {
                  type: "to the left",
                  attachedTo: [myOneSeg],
                };
                break;
              case Math.abs(xmin - tempLeftX) > 0 && Math.abs(xmin - tempLeftX) < standardWidth:
                //adjust the size of the box to fit the need.
                createLeftSpot(tempLeftX - Math.abs(xmin - tempLeftX), tempY, Math.abs(xmin - tempLeftX), ++boxCount);
                boxObject["LeftSpot".concat(boxCount)] = {
                  type: "to the left",
                  attachedTo: [myOneSeg],
                };
                break;
              case Math.abs(xmin - tempLeftX) === 0:
                //do not show the box.
                break;
            }
            toGGBString(boxObject);
            switch (true) {
              //this switch is for the RIGHT box.
              case Math.abs(xmax - tempRightX) >= boxWidth:
                //when there is 4 or more units until the edge, no adjustment needed
                createRightSpot(tempRightX, tempY, standardWidth, ++boxCount);
                boxObject["RightSpot".concat(boxCount)] = {
                  type: "to the right",
                  attachedTo: [myOneSeg],
                };
                break;
              case Math.abs(xmax - tempRightX) > 0 && Math.abs(xmax - tempRightX) < standardWidth:
                //adjust the size of the box to fit the need
                createRightSpot(tempRightX, tempY, xmax - tempRightX, ++boxCount);
                boxObject["RightSpot".concat(boxCount)] = {
                  type: "to the right",
                  attachedTo: [myOneSeg],
                };
                break;
              case Math.abs(xmax - tempRightX) == 0:
                //do not show this box.
                break;
            }
            toGGBString(boxObject);
          } else {
            //first, let's see how many segments are on the screen.
            const numActiveSegments = activeSegmentNames.length;
            //second, get the y coords of all the segments so we can see how many have same y value?
            const yCoordsOfSegs = [];
            activeSegmentNames.forEach(function (el) {
              const tempY = ggbObject.getYcoord(el + "Point0");
              yCoordsOfSegs.push(tempY);
            });
            //find duplicates in that array so we can conquer those differently than different y-values.
            const duplicateYVals = [];
            yCoordsOfSegs.forEach(function (el, index) {
              for (let i = 0, L = yCoordsOfSegs.length; i < L; i++) {
                if (i !== index && el === yCoordsOfSegs[i] && !duplicateYVals.includes(yCoordsOfSegs[i])) {
                  duplicateYVals.push(yCoordsOfSegs[i]);
                }
              }
            });
            const tempArray = [];
            let runDuplicateCount = 0;
            activeSegmentNames.forEach(function (el) {
              //this is the big forEach
              const testYCoord = ggbObject.getYcoord(el + "Point1");

              if (duplicateYVals.includes(testYCoord)) {
                //create boxes when multiple segments have the same y-coordinate
                if (runDuplicateCount === 0) {
                  //only want this to run once within the forEach
                  createArraysForSegmentsWithSameY(duplicateYVals);
                  runDuplicateCount++;
                }
              } else {
                //easier stuff, only one segment at a y-value
                const tempLeftXSingle =
                  ggbObject.getPointStyle(el + "Point1") === 9
                    ? ggbObject.getXcoord(el + "Point1")
                    : ggbObject.getXcoord(el + "Point0");
                const tempRightXSingle =
                  ggbObject.getPointStyle(el + "Point1") === 9
                    ? ggbObject.getXcoord(el + "Point0")
                    : ggbObject.getXcoord(el + "Point1");
                const tempYSingle = ggbObject.getYcoord(el + "Point0");

                //give options for each box - either boxWidth length, or from 1-3 depending on abs value, or don't show.
                switch (true) {
                  //this switch is for the LEFT box.
                  case Math.abs(xmin - tempLeftXSingle) >= boxWidth:
                    //when there is 4 or more units left until the edge, no adjustment needed
                    createLeftSpot(tempLeftXSingle - standardWidth, tempYSingle, standardWidth, ++boxCount);
                    boxObject["LeftSpot".concat(boxCount)] = {
                      type: "to the left",
                      attachedTo: [el],
                    };
                    break;
                  case Math.abs(xmin - tempLeftXSingle) > 0 && Math.abs(xmin - tempLeftXSingle) < standardWidth:
                    //adjust the size of the box to fit the need.
                    createLeftSpot(
                      tempLeftXSingle - Math.abs(xmin - tempLeftXSingle),
                      tempYSingle,
                      Math.abs(xmin - tempLeftXSingle),
                      ++boxCount
                    );
                    boxObject["LeftSpot".concat(boxCount)] = {
                      type: "to the left",
                      attachedTo: [el],
                    };
                    break;
                  case Math.abs(xmin - tempLeftXSingle) === 0:
                    //do not show the box.
                    break;
                }
                toGGBString(boxObject);
                switch (true) {
                  //this switch is for the RIGHT box.
                  case Math.abs(xmax - tempRightXSingle) >= boxWidth:
                    //when there is 4 or more units until the edge, no adjustment needed
                    createRightSpot(tempRightXSingle, tempYSingle, standardWidth, ++boxCount);
                    boxObject["RightSpot".concat(boxCount)] = {
                      type: "to the right",
                      attachedTo: [el],
                    };
                    break;
                  case Math.abs(xmax - tempRightXSingle) > 0 && Math.abs(xmax - tempRightXSingle) < standardWidth:
                    //adjust the size of the box to fit the need
                    createRightSpot(tempRightXSingle, tempYSingle, xmax - tempRightXSingle, ++boxCount);
                    boxObject["RightSpot".concat(boxCount)] = {
                      type: "to the right",
                      attachedTo: [el],
                    };
                    break;
                  case Math.abs(xmax - tempRightXSingle) == 0:
                    //do not show this box.
                    break;
                }
                toGGBString(boxObject);
              }
            });
          }
          //need to announce to the screen reader that potential regions appeared and how many and to tab to each of them OR if none appear, tell them how to add more.
          updateTabOrder("boxes", boxNames);
          //variables for alt text
          let isAreString;
          //if no boxes appear, let students know to move segments on the screen or reset the interactive.
          //if boxes appear, state how many spots are available and to tab to hear a description of each spot.
          if (boxNames.length === 0) {
            ggbReadText(
              "No locations were created. Move the directed line " +
                (activeSegmentNames.length === 1 ? "segment" : "segments") +
                " or reset the interactive."
            );
          } else {
            const spotsString = boxNames.length === 1 ? "location" : "locations";
            isAreString = boxNames.length === 1 ? "is" : "are";
            ggbReadText(
              "There ".concat(
                isAreString,
                " ",
                boxNames.length,
                " open ",
                spotsString,
                ". Press tab to hear a description of each location where you can place this directed line segment."
              )
            );
          }
          // updateKeyboardInstructions(selectedObject, "Press tab to cycle through possible locations for this directed line segment.")
          //   console.log("boxObject:", boxObject);
          break;
        }
        case event.code === "Space" &&
          ggbObject.getObjectType(selectedObject) === "quadrilateral" &&
          selectedObject.includes("Spot"): {
          //this is when a student clicks on the spot they want to send the segment to
          const tempSeg = lastSeg.includes("Left") ? "DragSegLeft" : "DragSegRight";
          ggbObject.setCoords(
            tempSeg + "EndBL",
            ggbObject.getXcoord(selectedObject + "MidpointL"),
            ggbObject.getYcoord(selectedObject + "MidpointL")
          );
          ggbObject.setCoords(
            tempSeg + "EndBR",
            ggbObject.getXcoord(selectedObject + "MidpointR"),
            ggbObject.getYcoord(selectedObject + "MidpointR")
          );
          snapback("stick", lastSeg);
          //set not visible all spotPolys
          const allOptions = ggbObject.getAllObjectNames("quadrilateral").filter(function (item) {
            return item.includes("Spot");
          });
          allOptions.forEach(function (el) {
            ggbObject.setVisible(el, false);
          });
          updateKeyboardInstructions();
          //ADD ALT TEXT HERE
          ggbReadText(
            "A directed line segment has been placed. It starts at ".concat(
              segmentObject[activeSegmentNames[activeSegmentNames.length - 1]]["point0"],
              " and ends at ",
              segmentObject[activeSegmentNames[activeSegmentNames.length - 1]]["point1"],
              ". "
            )
          );
          boxCount = 0; //no more boxes on screen. set boxCount back to zero for alt text purposes later.
          boxObject = {}; //make the boxObject back to empty because all new boxes will populate later
          break;
        }
        case event.code === "Space" &&
          !selectedObject.includes("Movable") &&
          !selectedObject.includes("Button") &&
          !selectedObject.includes("Icon") &&
          selectedObject.includes("Point"): {
          //this is if they press space on a point on a segment outside the bin because they want to remove it
          let returnSeg = "";
          //find out some info to delete the segment (segment takes care of points)
          const tempDirection = selectedObject.includes("Left") ? "Left" : "Right";
          const regexReturnNum = /\d+/g;
          const tempNum = selectedObject.match(regexReturnNum)[0];
          returnSeg = "DragSeg".concat(tempDirection, tempNum);
          //here is where I'll want to call snapback with return.
          //spaceToDelete boolean allows things outside of dragBin to be deleted in snapback "return".
          spaceToDelete = true;
          console.log("calling snapback return from space press");
          snapback("return", returnSeg);
          spaceToDelete = false;
          ggbReadText("The directed line segment has been deleted.");
          break;
        }
      }
      // }
    }

    function screenReaderWork(a) {
      switch (true) {
        case a.includes("Point0"): {
          //dragEnd or arrows
          const segName = a.slice(0, -6);
          const locationOfSeg =
            segmentObject[segName]["yVal"] < 0 ? "below" : segmentObject[segName]["yVal"] > 0 ? "above" : "on";
          const myString = "The directed line segment is ".concat(
            locationOfSeg,
            " the number line. It starts at ",
            segmentObject[segName]["point0"],
            " and ends at ",
            segmentObject[segName]["point1"],
            ". "
          );
          ggbReadText(myString);
          break;
        }
        case a.includes("Point1"): {
          //dragEnd or arrows
          const segName = a.slice(0, -6);
          const myString = "The directed line segment starts at ".concat(
            segmentObject[segName]["point0"],
            " and ends at ",
            segmentObject[segName]["point1"],
            ". "
          );
          ggbReadText(myString);
          break;
        }
      }
    }

    function snapback(a, whichObject) {
      console.log("in snapback with:", a, whichObject);
      if (ggbObject.getValue("pictureTool")) {
        //whichObject is either selectedObject (mouse) or storedSelectedObject (keyboard)
        //called on dragEnd
        // console.log("in snapback with selectedObj:", whichObject);
        switch (a) {
          case "stick": {
            //this either sends the Movable___ back to the drag bin OR sticks a copy to the stage and then sends back the Movable___
            // console.log("in stick");
            const imageName = whichObject.slice(7);
            const objectNumber = ggbObject.getValue("active" + imageName);
            if (!ggbObject.getValue("IsInRegion(" + imageName + "EndBL, bin)")) {
              ggbObject.evalCommand(imageName + objectNumber + "=CopyFreeObject(Movable" + imageName + ")");
              ggbObject.evalCommand(imageName + "Point" + objectNumber + "=Corner(" + imageName + objectNumber + ",1)"); //?
              ggbObject.setVisible(imageName + "Point" + objectNumber, false); //?
              ggbObject.setValue("active" + imageName, ggbObject.getValue("active" + imageName) + 1);
              ggbObject.setValue(imageName + "OnScreen", ggbObject.getValue(imageName + "OnScreen") + 1);
              //add the object to the pictureToolObjects array
              pictureToolObjects.push(imageName + objectNumber);
              toGGBString(pictureToolObjects);
              if (whichObject.includes("DragSeg")) {
                segmentStyle(imageName + objectNumber);
              }
              activeSegmentNames.push(imageName + objectNumber);
              toGGBString(activeSegmentNames);
              //   console.log("activeSegmentNames in stick snapback");
              //   console.log(activeSegmentNames);
              //call updateXML function
              //if image, updateXML(imageName + "Point" + objectNumber)
              updateObject(imageName + objectNumber, "stick");
              updateTabOrder("add", [
                imageName + objectNumber + "Point0",
                imageName + objectNumber,
                imageName + objectNumber + "Point1",
              ]);
              placed = true;
            }
            ggbObject.setCoords(
              imageName + "EndBL",
              ggbObject.getXcoord(imageName + "StartBL"),
              ggbObject.getYcoord(imageName + "StartBL")
            );
            ggbObject.setCoords(
              imageName + "EndBR",
              ggbObject.getXcoord(imageName + "StartBR"),
              ggbObject.getYcoord(imageName + "StartBR")
            );
            if (!ggbObject.getValue("ggbButton1Enabled")) {
              enableButton(1, true);
            }
            break;
          }
          case "return": {
            // console.log("in return");
            //FIX THIS ON MONDAY
            //if whichObject is the point, then it is: DragSegLeft3Point0, if it's the segment, then it's DragSegLeft3
            //this returns a ____# after it has already been stuck on the stage (not an object with Movable in the name)
            const findNum = /\d+/;
            const imageNumber = whichObject.match(findNum)[0];
            let deletingImage = "";

            //split into two cases because of the way I names the segments -- do I still actually do this?
            switch (true) {
              case whichObject.includes("DragSeg"): {
                let yCoord;
                if (imageNumber >= 10) {
                  if (whichObject.includes("Point")) {
                    deletingImage = whichObject;
                    yCoord = ggbObject.getYcoord(deletingImage);
                  } else {
                    deletingImage = whichObject.slice(0, -2);
                    yCoord = ggbObject.getYcoord(deletingImage + imageNumber + "Point0");
                  }
                  // if (deletingImage.includes("Point")) {
                  //   yCoord = ggbObject.getYcoord(deletingImage + "0");
                  // } else {
                  //   yCoord = ggbObject.getYcoord(deletingImage + imageNumber + "Point0");
                  // }
                } else {
                  if (whichObject.includes("Point")) {
                    deletingImage = whichObject;
                    yCoord = ggbObject.getYcoord(deletingImage);
                  } else {
                    deletingImage = whichObject.slice(0, -1);
                    yCoord = ggbObject.getYcoord(deletingImage + imageNumber + "Point0");
                  }
                  // deletingImage = whichObject.slice(0, -1);
                  // if (deletingImage.includes("Point")) {
                  //   yCoord = ggbObject.getYcoord(deletingImage + "0");
                  // } else {
                  //   yCoord = ggbObject.getYcoord(deletingImage + imageNumber + "Point0");
                  // }
                }

                const leftOrRightDeletingImage = whichObject.includes("Left") ? "DragSegLeft" : "DragSegRight";

                if (yCoord < binThreshold || spaceToDelete) {
                  if (!whichObject.includes("Point")) {
                    ggbObject.deleteObject(whichObject);
                    ggbObject.deleteObject(deletingImage + imageNumber + "Point0");
                    ggbObject.deleteObject(deletingImage + imageNumber + "Point1");
                    updateTabOrder("remove", [
                      whichObject,
                      deletingImage + imageNumber + "Point0",
                      deletingImage + imageNumber + "Point1",
                    ]);
                  } else {
                    ggbObject.deleteObject(whichObject);
                    ggbObject.deleteObject(deletingImage.slice(0, -1).concat("1"));
                    updateTabOrder("remove", [
                      leftOrRightDeletingImage + imageNumber,
                      whichObject,
                      deletingImage.slice(0, -1).concat("1"),
                    ]);
                  }
                  //also increment either DragSegLeftOnScreen or DragSegRightOnScreen
                  ggbObject.setValue(
                    leftOrRightDeletingImage + "OnScreen",
                    ggbObject.getValue(leftOrRightDeletingImage + "OnScreen") - 1
                  );
                  //remove the element from the activeSegmentNames array
                  const spot = activeSegmentNames.indexOf(leftOrRightDeletingImage + imageNumber);
                  if (spot > -1) {
                    activeSegmentNames.splice(spot, 1);
                  }
                  //also remove the segment from the object that is keeping track of which ones have same y-value
                  updateObject(leftOrRightDeletingImage + imageNumber, "return");
                  ggbReadText("The directed line segment was deleted.");
                } else {
                  updateObject(leftOrRightDeletingImage + imageNumber, "stick");
                }
                break;
              }
            }
            break;
          }
        }
        toGGBString(activeSegmentNames);
        // console.log("activeSegmentNames");
        // console.log(activeSegmentNames);
      }
    }

    function segmentStyle(obj) {
      //recreate the segment
      //first, get the definition so I can search through it.
      const leftArrow = obj.includes("Left");
      const tempDefinition = ggbObject.getDefinitionString(obj);
      //second, get the two points from the definition and create points with names at those locations
      const regexPoint = /\(-?\d+\.?\d*, -?\d+\.?\d*\)/g;
      const tempMatches = tempDefinition.match(regexPoint); //returns an array with two matches
      tempMatches.forEach(function (item, index) {
        const tempPointName = obj + "Point" + index;
        // ggbObject.evalCommand(tempPointName + "= PointIn(drawRegion)"); //this made the segment not able to be moved (points could move though). The points must be free. Probably need to use the onUpdate script here
        ggbObject.evalCommand(tempPointName + "= " + item);
        ggbObject.setLabelVisible(tempPointName, false);
        if (index === 1) {
          //this is going to be the arrowhead point.
          if (leftArrow) {
            ggbObject.setPointStyle(tempPointName, 9);
          } else {
            ggbObject.setPointStyle(tempPointName, 8);
          }
          // ggbObject.setVisible(tempPointName, false);
          // ggbObject.setPointStyle(tempPointName, 0);
          ggbObject.setPointSize(tempPointName, 5);
          ggbObject.setColor(tempPointName, 0, 0, 0);
          pictureToolObjects.push(tempPointName);
        } else {
          ggbObject.setPointStyle(tempPointName, 0);
          ggbObject.setPointSize(tempPointName, 6);
          ggbObject.setColor(tempPointName, 0, 0, 0);
          pictureToolObjects.push(tempPointName);
        }
        updateXML(tempPointName);
        pointsInPictureToolToDelete.push(tempPointName);
        // ggbObject.setCoords(tempPointName, xCoord, yCoord);
      });
      toGGBString(pictureToolObjects);
      toGGBString(pointsInPictureToolToDelete);
      //third, delete the segment
      ggbObject.deleteObject(obj);
      //fourth, recreate the segment between the two points in step 2
      ggbObject.evalCommand(obj + "= Segment(" + obj + "Point0, " + obj + "Point1)");
      ggbObject.setLineThickness(obj, 8);
      //fifth, pretty points with label shown and restrict region
      //  I want to only show the point at the tail, not the arrow, show that point and set the other to not visible and arrow
      // ggbObject.evalCommand("SetDecoration(" + obj + ", 0, 4)");
      // //  Set the caption to the value and make it larger and LaTeX
      ggbObject.setLabelStyle(obj, 3);
      ggbObject.setCaption(obj, "$%v$");
      // //  Show the caption
      ggbObject.setLabelVisible(obj, true);
      //If I don't want the segment selectable, then uncomment below. That starts issues with captions of words versus length.
      editXML(obj, "selectionAllowed", "val", "false");
      //   ggbObject.setFixed(obj, false, false);
      // //  Note: I'll need to restrict the movable point later (in the region and also can't go past the arrow head)
    }

    function updateXML(pointName) {
      const tempString = pointName.slice(0, -1);
      //update the XML of each point for the on update tab
      //get XML of element as a string
      let xmlstring = ggbObject.getXML(pointName);

      //edit string to remove the expression tag IF NEEDED
      xmlstring = xmlstring.slice(xmlstring.indexOf("/>") + 2);

      //convert XML string to XML document
      const parser = new DOMParser();
      const xmldom = parser.parseFromString(xmlstring, "application/xml");

      //create new node for ggbscript
      const node = xmldom.createElement("ggbscript");
      const element = xmldom.documentElement;
      const position = xmldom.getElementsByTagName("objColor")[0];
      element.insertBefore(node, position);

      //naviagte the XML DOM to change the value of an attribute
      xmldom
        .getElementsByTagName("ggbscript")[0]
        .setAttribute(
          "onUpdate",
          "SetCoords(" +
            pointName +
            ", If(x(" +
            pointName +
            ") < xminPadding, xminPadding, If(x(" +
            pointName +
            ") >= xmaxPadding, xmaxPadding, x(" +
            pointName +
            "))), If(y(" +
            pointName +
            ") < yminPadding, yminPadding, If(y(" +
            pointName +
            ") >= ymaxPadding, ymaxPadding, y(" +
            pointName +
            "))))\r\n SetCoords(" +
            tempString +
            "1, x(" +
            tempString +
            "1), y(" +
            tempString +
            "0))\r\n If(x(" +
            tempString +
            "1)>x(" +
            tempString +
            "0), SetPointStyle(" +
            tempString +
            "1, 8), SetPointStyle(" +
            tempString +
            "1, 9))"
        );

      //convert the XML document back into a string
      const serializer = new XMLSerializer();
      xmlstring = serializer.serializeToString(xmldom);

      //evaluate XML string to update the element in Geogebra
      ggbObject.evalXML(xmlstring);
    }

    //function used to update the object storing info about where segments are
    function updateObject(name, stickOrReturn) {
      //need to know the name of the object coming in, e.g. DragSegLeft1
      let tempName = name; //I needed to create tempName because they can drag the endpoints which include "Point0/1" at the end of the string
      if (name.includes("Point")) {
        //remove the Point# from the end of the name.
        const myRegex = /DragSeg(Left|Right)\d+/g;
        tempName = name.match(myRegex);
      }
      // eslint-disable-next-line no-prototype-builtins
      if (!segmentObject.hasOwnProperty(tempName)) {
        //create the new property for this segment
        segmentObject[tempName] = {
          yVal: ggbObject.getYcoord(tempName + "Point1"),
          xValL:
            ggbObject.getPointStyle(tempName + "Point1") === 9
              ? ggbObject.getXcoord(tempName + "Point1")
              : ggbObject.getXcoord(tempName + "Point0"),
          xValR:
            ggbObject.getPointStyle(tempName + "Point1") === 9
              ? ggbObject.getXcoord(tempName + "Point0")
              : ggbObject.getXcoord(tempName + "Point1"),
          direction: ggbObject.getXcoord(tempName + "Point1") < ggbObject.getXcoord(tempName + "Point0") ? "RL" : "LR",
          point0: ggbObject.getXcoord(tempName + "Point0"),
          point1: ggbObject.getXcoord(tempName + "Point1"),
        };
      } else if (
        // eslint-disable-next-line no-prototype-builtins
        segmentObject.hasOwnProperty(tempName) &&
        stickOrReturn === "stick"
      ) {
        //update values
        segmentObject[tempName]["yVal"] = ggbObject.getYcoord(tempName + "Point1");
        segmentObject[tempName]["xValL"] =
          ggbObject.getPointStyle(tempName + "Point1") === 9
            ? ggbObject.getXcoord(tempName + "Point1")
            : ggbObject.getXcoord(tempName + "Point0");
        segmentObject[tempName]["xValR"] =
          ggbObject.getPointStyle(tempName + "Point1") === 9
            ? ggbObject.getXcoord(tempName + "Point0")
            : ggbObject.getXcoord(tempName + "Point1");
        segmentObject[tempName]["direction"] =
          ggbObject.getXcoord(tempName + "Point1") < ggbObject.getXcoord(tempName + "Point0") ? "RL" : "LR";
        segmentObject[tempName]["point0"] = ggbObject.getXcoord(tempName + "Point0");
        segmentObject[tempName]["point1"] = ggbObject.getXcoord(tempName + "Point1");
      } else if (stickOrReturn === "return") {
        //delete the property from the object
        delete segmentObject[tempName];
      }
      //   console.warn("segmentObject", segmentObject);
      updateReadOrderArray();
      toGGBString(segmentObject);
    }

    function updateReadOrderArray() {
      const segmentReadOrderHelper = [];
      segmentReadOrder = [];
      for (const property in segmentObject) {
        segmentReadOrderHelper.push([property, segmentObject[property]["yVal"], segmentObject[property]["xValL"]]);
      }

      segmentReadOrderHelper.sort(function (a, b) {
        if (a[1] < b[1]) {
          return -1;
        }
        if (a[1] > b[1]) {
          return 1;
        }
        //if a[1] === b[1], need to find the smaller xValL, probably could've just included segmentObject[property]["xValL"] in the segmentReadOrder array
        if (a[2] < b[2]) {
          return -1;
        }
        if (a[2] > b[2]) {
          return 1;
        }
        //else (same x and same y)
        return 0;
      });
      segmentReadOrderHelper.forEach(function (el) {
        segmentReadOrder.push(el[0]);
      });
      toGGBString(segmentReadOrder);

      myCounts = {};
      for (const element of segmentReadOrderHelper) {
        const tempEl = element[1];
        if (myCounts[tempEl]) {
          myCounts[tempEl] += 1;
        } else {
          myCounts[tempEl] = 1;
        }
      }
      toGGBString(myCounts);
    }

    function createArraysForSegmentsWithSameY(duplicateArray) {
      //can use xmin and xmax variables from above.
      //first, figure out which segments have the same ycoord by using info in segmentObject
      const numDuplicateY = duplicateArray.length;
      for (let i = 0; i < numDuplicateY; i++) {
        const segsWithSameYArray = [];
        for (const property in segmentObject) {
          if (segmentObject[property]["yVal"] === duplicateArray[i]) {
            segsWithSameYArray.push(property);
          }
        }
        findTheGaps(segsWithSameYArray);
      }
    }

    function findTheGaps(arr) {
      //   console.warn("in the find the gaps function with arr:", arr);
      const myXCoords = [];
      let xToSend;
      const tempYMultiple = segmentObject[arr[0]]["yVal"];
      const tempCount = 0;
      arr.forEach(function (el) {
        myXCoords.push(segmentObject[el]["xValL"]);
        myXCoords.push(segmentObject[el]["xValR"]);
      });
      if (!myXCoords.includes(xmin)) {
        //find the smallest xval in the array and make a left box from it if it is not the minimum
        const tempSmallest = Math.min(...myXCoords);
        //find which segment in arr has that Xcoord
        let segWithSmallestX = "";
        arr.forEach(function (el) {
          if (segmentObject[el]["xValL"] === tempSmallest || segmentObject[el]["xValR"] === tempSmallest) {
            segWithSmallestX = el;
          }
        });
        xToSend = Math.abs(xmin - tempSmallest) > standardWidth ? standardWidth : Math.abs(xmin - tempSmallest);
        createLeftSpot(tempSmallest - xToSend, tempYMultiple, xToSend, ++boxCount);
        boxObject["LeftSpot".concat(boxCount)] = {
          type: "to the left",
          attachedTo: [segWithSmallestX], //need to find the seg that has the SMALLEST xright here.
        };
      }
      if (!myXCoords.includes(xmax)) {
        //find the largest xval in the array and make a right box from it if it is not the maximum
        const tempLargest = Math.max(...myXCoords);
        let segWithLargestX = "";
        arr.forEach(function (el) {
          if (segmentObject[el]["xValL"] === tempLargest || segmentObject[el]["xValR"] === tempLargest) {
            segWithLargestX = el;
          }
        });
        xToSend = Math.abs(xmax - tempLargest) > standardWidth ? standardWidth : Math.abs(xmax - tempLargest);
        createRightSpot(tempLargest, tempYMultiple, xToSend, ++boxCount);
        boxObject["RightSpot".concat(boxCount)] = {
          type: "to the right",
          attachedTo: [segWithLargestX], //need to find the seg that has the LARGEST xright here.
        };
      }
      toGGBString(boxObject);

      //now find any gaps in the middle.
      const leftXList = [];
      const rightXList = [];
      let nextSmallestLeft;
      arr.forEach(function (el) {
        leftXList.push(segmentObject[el]["xValL"]);
        rightXList.push(segmentObject[el]["xValR"]);
      });

      leftXList.sort(compareNumbers);
      rightXList.sort(compareNumbers);

      rightXList.forEach(function (el) {
        if (el === Math.max(...rightXList)) {
          return;
        } else {
          nextSmallestLeft = leftXList.find(function (element) {
            return element > el;
          });
          // console.log("nextSmallestLeft", nextSmallestLeft); //warning!!! this could be undefined if two right points are at the end caused by overlap- doesn't seem to make a diff but might revist l8r
          //test if there are any left or right points between current el and nextSmallestLeft
          let pointsBetween = myXCoords.length;
          // console.log("pointsBetween start", pointsBetween);
          myXCoords.forEach(function (testX) {
            //   console.log("el, testX, nextSmallestLeft", el, testX, nextSmallestLeft);
            if (testX <= el || testX >= nextSmallestLeft) {
              //I think this if needs to also say && nextSmallestLeft !== undefined (will check later for overlap)
              pointsBetween--;
              return; //do I need this return here?
            }
          });
          if (pointsBetween === 0) {
            //check the distance to each seg in arr. If it's greater than 1, don't make a box
            const testNum = getRandomBetween(el, nextSmallestLeft);
            //   console.log("from getRandomInt function: el, testNum, nextSmallestLeft", el, testNum, nextSmallestLeft);
            let distanceCount = 0;
            ggbObject.evalCommand("CheckDistancePoint = (" + testNum + "," + tempYMultiple + ")");
            ggbObject.setVisible("CheckDistancePoint", false);
            arr.forEach(function (testArray) {
              ggbObject.evalCommand("MyDistance = Distance(CheckDistancePoint," + testArray + ")");
              if (ggbObject.getValue("MyDistance") === 0) {
                distanceCount++;
              }
            });
            //   console.log("distanceCount after forEach", distanceCount);
            //make a box between el and nextSmallestLeft
            if (distanceCount === 0) {
              // console.log("make a box between ".concat(el, " and ", nextSmallestLeft));
              let leftSegName = "";
              let rightSegName = "";
              arr.forEach(function (element) {
                if (segmentObject[element]["xValL"] === el || segmentObject[element]["xValR"] === el) {
                  leftSegName = element;
                }
                if (
                  segmentObject[element]["xValL"] === nextSmallestLeft ||
                  segmentObject[element]["xValR"] === nextSmallestLeft
                ) {
                  rightSegName = element;
                }
              });
              //figuret out the segment names that have either Point0 or Point1 at el and nextSmallestLeft
              createRightSpot(el, tempYMultiple, Math.abs(el - nextSmallestLeft), ++boxCount);
              boxObject["RightSpot".concat(boxCount)] = {
                type: "between",
                attachedTo: [leftSegName, rightSegName], //the segments this box is between
              };
              toGGBString(boxObject);
            }
          }
        }
      });
    }

    function compareNumbers(a, b) {
      return a - b;
    }

    function getRandomBetween(min, max) {
      //note this function returns a STRING between the two values with max two digits
      return (Math.random() * (max - min) + (min + 0.1)).toFixed(2);
    }

    //maybe I can make this into one function? for later :)
    function createLeftSpot(xcoord, ycoord, width, spotNum) {
      ggbObject.evalCommand("LeftSpotBL" + spotNum + "=(" + xcoord + ", " + ycoord + " - 0.5*boxHeight)");
      ggbObject.setVisible("LeftSpotBL" + spotNum, false);
      //create polygon for potential spot.
      ggbObject.evalCommand(
        "LeftSpot" +
          spotNum +
          "=Polygon({LeftSpotBL" +
          spotNum +
          ", LeftSpotBL" +
          spotNum +
          " + (" +
          width +
          ", 0), LeftSpotBL" +
          spotNum +
          " + (" +
          width +
          ", boxHeight), LeftSpotBL" +
          spotNum +
          " + (0, boxHeight)})"
      );
      //style for polygon
      ggbObject.setColor("LeftSpot" + spotNum, 148, 148, 148);
      ggbObject.setFilling("LeftSpot" + spotNum, 0);
      ggbObject.setFilling("LeftSpot" + spotNum, 0);
      ggbObject.setLineStyle("LeftSpot" + spotNum, 1);
      ggbObject.setFixed("LeftSpot" + spotNum, true, true);
      ggbObject.setVisible("LeftSpot" + spotNum, true);

      //create midpoints so that arrows can go to these places
      ggbObject.evalCommand(
        "LeftSpot" + spotNum + "MidpointL = (x(LeftSpotBL" + spotNum + "), y(LeftSpotBL" + spotNum + ")+ 0.5*boxHeight)"
      );
      ggbObject.evalCommand(
        "LeftSpot" +
          spotNum +
          "MidpointR = (x(LeftSpotBL" +
          spotNum +
          ") + " +
          width +
          ", y(LeftSpotBL" +
          spotNum +
          ")+ 0.5*boxHeight)"
      );
      ggbObject.setVisible("LeftSpot" + spotNum + "MidpointL", false);
      ggbObject.setVisible("LeftSpot" + spotNum + "MidpointR", false);
      boxNames.push("LeftSpot".concat(spotNum));
      toGGBString(boxNames);
    }

    function createRightSpot(xcoord, ycoord, width, spotNum) {
      ggbObject.evalCommand("RightSpotBL" + spotNum + "=(" + xcoord + ", " + ycoord + " - 0.5*boxHeight)");
      ggbObject.setVisible("RightSpotBL" + spotNum, false);
      //create polygon for potential spot.
      ggbObject.evalCommand(
        "RightSpot" +
          spotNum +
          "=Polygon({RightSpotBL" +
          spotNum +
          ", RightSpotBL" +
          spotNum +
          " + (" +
          width +
          ", 0), RightSpotBL" +
          spotNum +
          " + (" +
          width +
          ", boxHeight), RightSpotBL" +
          spotNum +
          " + (0, boxHeight)})"
      );
      //style for polygon
      ggbObject.setColor("RightSpot" + spotNum, 148, 148, 148);
      ggbObject.setFilling("RightSpot" + spotNum, 0);
      ggbObject.setFilling("RightSpot" + spotNum, 0);
      ggbObject.setLineStyle("RightSpot" + spotNum, 1);
      ggbObject.setFixed("RightSpot" + spotNum, true, true);
      ggbObject.setVisible("RightSpot" + spotNum, true);

      //create midpoints so that arrows can go to these places
      ggbObject.evalCommand(
        "RightSpot" +
          spotNum +
          "MidpointL = (x(RightSpotBL" +
          spotNum +
          "), y(RightSpotBL" +
          spotNum +
          ")+ 0.5*boxHeight)"
      );
      ggbObject.evalCommand(
        "RightSpot" +
          spotNum +
          "MidpointR = (x(RightSpotBL" +
          spotNum +
          ") + " +
          width +
          ", y(RightSpotBL" +
          spotNum +
          ")+ 0.5*boxHeight)"
      );
      ggbObject.setVisible("RightSpot" + spotNum + "MidpointL", false);
      ggbObject.setVisible("RightSpot" + spotNum + "MidpointR", false);
      boxNames.push("RightSpot".concat(spotNum));
      toGGBString(boxNames);
    }

    function updateAppletStatus() {
      if (ggbObject.getValue("pictureTool")) {
        //set status for picture tool
        const slide4 = ggbObject.getValue("slide4");
        const firstSentence =
          "There are two tools you can use to show your work. You are currently using the picture tool. A number bond and a number line. The number bond is decomposed into 2 parts. The total is ".concat(
            slide4 ? "8. 1 part is 4. 1 part is 4." : "negative 8. 1 part is negative 4. 1 part is negative 4.",
            " The number line is from negative 12 to 12. The interval is 1. There is a stack of directed line segments pointing left and a stack of directed line segments pointing right. "
          );
        let numSegsOnScreenSentence = "";
        let positionDescription = "";
        let boxesDescription = "";
        // console.log(
        //   "activeSegmentNames in AppletStatus function",
        //   activeSegmentNames
        // );
        if (activeSegmentNames.length > 0) {
          //state how many directed line segments are on the stage
          numSegsOnScreenSentence = "The number line has ".concat(
            activeSegmentNames.length.toString(),
            " ",
            activeSegmentNames.length === 1 ? "directed line segment. " : "directed line segments. "
          );
          //describe each directed line segment from bottom to top.
          let beneathOnOrAbove;
          const mySentences = [];
          let multipleCounter = 1;

          segmentReadOrder.forEach(function (el) {
            let tempSentence;
            beneathOnOrAbove =
              segmentObject[el]["yVal"] < 0
                ? "Beneath "
                : segmentObject[el]["yVal"] == 1
                ? "Directly above "
                : segmentObject[el]["yVal"] > 1
                ? "Higher above "
                : "On ";
            if (myCounts[segmentObject[el]["yVal"]] == 1) {
              tempSentence = beneathOnOrAbove.concat(
                "the number line is 1 directed line segment. It starts at ",
                segmentObject[el]["point0"].toString(),
                " and ends at ",
                segmentObject[el]["point1"].toString(),
                ". "
              );
              mySentences.push(tempSentence);
            } else {
              if (multipleCounter === 1) {
                tempSentence = beneathOnOrAbove.concat(
                  "the number line are ",
                  myCounts[segmentObject[el]["yVal"]],
                  " directed line segments. One starts at ",
                  segmentObject[el]["point0"].toString(),
                  " and ends at ",
                  segmentObject[el]["point1"].toString(),
                  ". "
                );
                mySentences.push(tempSentence);
                multipleCounter++;
              } else if (multipleCounter !== 1 && multipleCounter < myCounts[segmentObject[el]["yVal"]]) {
                tempSentence = "Another starts at ".concat(
                  segmentObject[el]["point0"].toString(),
                  " and ends at ",
                  segmentObject[el]["point1"].toString(),
                  ". "
                );
                mySentences.push(tempSentence);
                multipleCounter++;
              } else if (multipleCounter == myCounts[segmentObject[el]["yVal"]]) {
                //last one
                tempSentence = "Another starts at ".concat(
                  segmentObject[el]["point0"].toString(),
                  " and ends at ",
                  segmentObject[el]["point1"].toString(),
                  ". "
                );
                //final sentence for that count
                mySentences.push(tempSentence);
                multipleCounter = 1;
              }
            }
          });

          positionDescription = mySentences.join(" ");
          if (ggbObject.getVisible("LeftSpot1") || ggbObject.getVisible("RightSpot1")) {
            boxesDescription = " ".concat(
              boxNames.length,
              " locations are shown where a directed line segment can be placed. "
            );
          }
        }
        ggbObject.setTextValue(
          "AAppletStatus",
          firstSentence.concat(
            numSegsOnScreenSentence,
            positionDescription,
            boxesDescription,
            ggbObject.getValueString("escText")
          )
        );
        // console.log("AAppletStatus", ggbObject.getValueString("AAppletStatus"));
      } else {
        //set status for sketch tool
        const numPenstrokes = ggbObject.getAllObjectNames("penstroke").length;
        const firstSentenceSketch =
          "There are two tools you can use to show your work. You are currently using the sketch tool. This tool is not optimized for accessibilty. For the accessible version of this learning experience navigate to the Picture Tool. A number bond and a number line. The number bond is decomposed into 2 parts. The total is 8. 1 part is 4. 1 part is 4. The number line is from negative 12 to 12. The interval is 1. ";
        // let secondSentenceSketch = "There ".concat(
        //   numPenstrokes === 1 ? "is" : "are",
        //   " currently ",
        //   numPenstrokes,
        //   numPenstrokes === 1 ? " line" : " lines",
        //   " drawn. "
        // );
        // ggbObject.setTextValue("AAppletStatus", firstSentenceSketch.concat(secondSentenceSketch, ggbObject.getValueString("escText")));
        ggbObject.setTextValue("AAppletStatus", firstSentenceSketch.concat(" ", ggbObject.getValueString("escText")));
        // console.log("AAppletStatus", ggbObject.getValueString("AAppletStatus"));
      }
    }

    function setSpotCaption(a) {
      /*
              Location [#] of [total#] for the [left/right] directed line segment. 
                  - The segment will start at [#] and end at [#]. 
                  - It is: (pick one if other segs are present at same y value.)
                      - to the left/right of a directed lines segment that goes from [] to []
                      - between two directed line segments that go from [] to [] and from [] to []. 
                  - (If segments at multiple y-vals)
                      - There is/are [] directed line segments (above/below) this location. 
  
              Press space to send to this Location. (Press tab to hear a description of the next open Location.) 
          */

      //(1) find spot number at end of a
      const spotNumRegex = /\d+/;
      const tempSpotNum = a.match(spotNumRegex)[0];

      //(2) get total number of spots - should be boxCount - yep, already got it

      //(3) need start and end points of box: if left seg, go right to left, if right seg, go left to right
      ggbObject.evalCommand("tempCentroid = Centroid(" + a + ")");
      ggbObject.setVisible("tempCentroid", false);
      const tempLeftOrRight = a.includes("Left") ? "Left" : "Right";
      const tempWidth =
        2 *
        Math.abs(
          ggbObject.getXcoord(tempLeftOrRight.concat("SpotBL", tempSpotNum)) - ggbObject.getXcoord("tempCentroid")
        );
      const tempStartX = lastSeg.includes("Left")
        ? ggbObject.getXcoord(tempLeftOrRight.concat("SpotBL", tempSpotNum)) + tempWidth
        : ggbObject.getXcoord(tempLeftOrRight.concat("SpotBL", tempSpotNum));
      const tempEndX = lastSeg.includes("Left")
        ? ggbObject.getXcoord(tempLeftOrRight.concat("SpotBL", tempSpotNum))
        : ggbObject.getXcoord(tempLeftOrRight.concat("SpotBL", tempSpotNum)) + tempWidth;

      //(4) Are other segments present at the same y-val and attached to this box? If yes, describe them. If not, skip.
      let otherSegmentsString;
      let tempNum1;
      let tempNum2;
      let tempNum3;
      let tempNum4;
      let seg1;
      let seg2;
      if (activeSegmentNames.length > 0 && boxObject[a]["type"] === "between") {
        //write for between
        seg1 = boxObject[a]["attachedTo"][0];
        seg2 = boxObject[a]["attachedTo"][1];
        //figure out if each seg goes LR or RL to accurately describe.
        tempNum1 =
          segmentObject[seg1]["direction"] === "LR" ? segmentObject[seg1]["xValL"] : segmentObject[seg1]["xValR"];
        tempNum2 =
          segmentObject[seg1]["direction"] === "LR" ? segmentObject[seg1]["xValR"] : segmentObject[seg1]["xValL"];
        tempNum3 =
          segmentObject[seg2]["direction"] === "LR" ? segmentObject[seg2]["xValL"] : segmentObject[seg2]["xValR"];
        tempNum4 =
          segmentObject[seg2]["direction"] === "LR" ? segmentObject[seg2]["xValR"] : segmentObject[seg2]["xValL"];
        otherSegmentsString = " It is between two directed line segments that go from ".concat(
          tempNum1,
          " to ",
          tempNum2,
          " and from ",
          tempNum3,
          " to ",
          tempNum4,
          ". "
        );
      } else if (activeSegmentNames.length > 0 && boxObject[a]["type"] !== "between") {
        //write for one direction
        const leftOrRight = boxObject[a]["type"];
        seg1 = boxObject[a]["attachedTo"][0];
        tempNum1 =
          segmentObject[seg1]["direction"] === "LR" ? segmentObject[seg1]["xValL"] : segmentObject[seg1]["xValR"];
        tempNum2 =
          segmentObject[seg1]["direction"] === "LR" ? segmentObject[seg1]["xValR"] : segmentObject[seg1]["xValL"];
        otherSegmentsString = "It is ".concat(
          leftOrRight,
          " of a directed line segment that goes from ",
          tempNum1,
          " to ",
          tempNum2,
          ". "
        );
      } else {
        //just two boxes shown with no segments.
        otherSegmentsString = "";
      }

      //(5) Are other segments present at different y-vals? If yes, let them know. If not, skip.
      let aboveBelowSegmentsString = "";
      if (activeSegmentNames.length > 0) {
        let numAtDifferentY = 0;
        let above = 0;
        let below = 0;
        const testY = segmentObject[seg1]["yVal"];
        activeSegmentNames.forEach(function (el) {
          const tempTestY = ggbObject.getYcoord(el.concat("Point0"));
          if (tempTestY > testY) {
            above++;
            numAtDifferentY++;
          } else if (tempTestY < testY) {
            below++;
            numAtDifferentY++;
          }
        });

        if (numAtDifferentY > 0) {
          switch (true) {
            case above > 0 && below > 0:
              aboveBelowSegmentsString = " There ".concat(
                above === 1 ? "is" : "are",
                " ",
                above,
                above === 1 ? " segment " : " segments ",
                " above this location and there ",
                below === 1 ? "is" : "are",
                " ",
                below,
                below === 1 ? " segment " : " segments ",
                " below this location."
              );
              break;
            case above > 0:
              aboveBelowSegmentsString = " There ".concat(
                above === 1 ? "is" : "are",
                " ",
                above,
                above === 1 ? " segment " : " segments ",
                " above this location. "
              );
              break;
            case below > 0:
              aboveBelowSegmentsString = " There ".concat(
                below === 1 ? "is" : "are",
                " ",
                below,
                below === 1 ? " segment " : " segments ",
                " below this location. "
              );
              break;
          }
        }
      }

      //(6) Final statement to press space or tab to next object.
      const finalCaptionString =
        "Press space to send to this location. " +
        (tempSpotNum == boxCount
          ? "This is the last open location."
          : "Press tab to hear a description of the next open location.");

      //(7) Set the caption
      const selectedSegLR = lastSeg.includes("Left") ? "left" : "right";
      ggbObject.setCaption(
        a,
        "Location ".concat(
          tempSpotNum,
          " of ",
          boxCount,
          " for the ",
          selectedSegLR,
          " directed line segment. The segment will start at ",
          tempStartX,
          " and end at ",
          tempEndX,
          ". ",
          otherSegmentsString,
          " ",
          aboveBelowSegmentsString,
          " ",
          finalCaptionString
        )
      );
      //   console.log("caption for box:", ggbObject.getCaption(a));
    }

    function setPointCaption(a) {
      /*
          Starting/ending point for a directed line segment that goes from [] to []. Move the point to change the length [or location] of the directed line segment. Press space to delete this directed line segment. 
          */
      let pointCaptionString;
      const otherPoint = a.includes("Point0") ? a.slice(0, -1).concat("1") : a.slice(0, -1).concat("0");
      const startOrEnd = a.includes("Point0") ? "Starting" : "Ending";
      if (a.includes("Point0")) {
        //from a to otherPoint
        pointCaptionString = startOrEnd.concat(
          " point for a directed line segment that goes from ",
          ggbObject.getXcoord(a),
          " to ",
          ggbObject.getXcoord(otherPoint),
          ". Move the point to change the length or location of the directed line segment. Press space to delete this directed line segment. "
        );
      } else {
        //from otherPoint to a
        pointCaptionString = startOrEnd.concat(
          " point for a directed line segment that goes from ",
          ggbObject.getXcoord(otherPoint),
          " to ",
          ggbObject.getXcoord(a),
          ". Move the point to change the length of the directed line segment. Press space to delete this directed line segment. "
        );
      }
      ggbObject.setCaption(a, pointCaptionString);
      //   console.log("point caption", ggbObject.getCaption(a));
    }

    function setSegmentCaption(a) {
      /*
          Directed line segment that goes from [] to []. Use the arrow keys to move this segment. 
          */
      const mySegCaption = "Directed line segment that goes from ".concat(
        ggbObject.getXcoord(a + "Point0"),
        " to ",
        ggbObject.getXcoord(a + "Point1"),
        ". "
      );
      // ggbObject.setCaption(a, mySegCaption);
      // ggbObject.setLabelStyle(a, 3);
      // ggbObject.setCaption(a, "$%v$");
      // ggbObject.setLabelVisible(a, true);
      // console.log("segment caption", ggbObject.getCaption(a));
    }

    function deleteSpots() {
      //delete all spot polygons and reset boxCount to 0.
      const allSpots = ggbObject.getAllObjectNames("quadrilateral").filter(function (item) {
        return item.includes("Spot");
      });
      allSpots.forEach(function (el) {
        ggbObject.deleteObject(el);
      });
      boxCount = 0;
    }

    function updateTabOrder(whatType, arrayOfNames) {
      //original tabOrder = {AAppletStatus, instructionsIcon, xIcon, MovableDragSegRight, MovableDragSegLeft, A, ggbButton1, ggbButton2, ggbButton3}
      //needs to be reset when a segment or polyline is added (and perhaps removed) and when reset is pressed.
      //   console.log("begin of tab order function");
      //   console.log(whatType, arrayOfNames);
      //create new tabOrder for boxes and break out of the function when done.
      const frontTabOrder = ["AAppletStatus", "instructionsIcon", "xIcon", "MovableDragSegLeft", "MovableDragSegRight"];
      const endTabOrder = ["ggbButton1", "ggbButton2", "ggbButton3"];
      switch (whatType) {
        case "add":
          if (arrayOfNames.length > 0 && !middleTabOrder.includes(arrayOfNames[0])) {
            //push each new item that was passed into the function to the middleTabOrder array
            arrayOfNames.forEach(function (el) {
              middleTabOrder.push(el);
            });
          }
          toGGBString(middleTabOrder);
          break;
        case "remove":
          //find the index of the removing item in middleTabOrder and remove it. This only happens for segments as they get dragged back into the bin.
          // console.log("Here is what I'd like to remove: ", arrayOfNames);
          arrayOfNames.forEach(function (el) {
            const index = middleTabOrder.indexOf(el);
            // console.log(index);
            //remove from middleTabOrder
            if (index > -1) {
              middleTabOrder.splice(index, 1);
            }
          });
          toGGBString(middleTabOrder);
          // console.log("middleTabOrder in remove", middleTabOrder);
          break;
        case "reset":
          //this will need two cases, if picture tool or if sketch tool.
          if (ggbObject.getValue("pictureTool")) {
            //remove all segments and images and keep all polylines.
            middleTabOrder.forEach(function (el, index) {
              if (el.includes("DragSeg")) {
                //remove from middleTabOrder
                if (index > -1) {
                  middleTabOrder.splice(index);
                }
              }
            });
          } else {
            //remove all polylines and keep all segments.
            middleTabOrder.forEach(function (el, index) {
              if (el.includes("polyLine")) {
                //remove from middleTabOrder
                if (index > -1) {
                  middleTabOrder.splice(index);
                }
              }
            });
          }
          toGGBString(middleTabOrder);
          break;
        case "boxes": {
          //(1) find the index of the selectedObject (either DragSegLeft or DragSegRight)
          const tempSegIndex = frontTabOrder.indexOf(selectedObject);
          // console.log("frontTabOrder, selectedObject, index:", frontTabOrder, selectedObject, tempSegIndex);
          //(2) insert the array of boxes right after the selectedObject
          frontTabOrder.splice(tempSegIndex + 1, 0, [...arrayOfNames]);
          // console.log(frontTabOrder);
          break;
        }
      }
      ggbObject.deleteObject("tabOrder");
      myTabOrder = [...frontTabOrder, ...middleTabOrder, ...endTabOrder];
      myTabString = String(myTabOrder);
      ggbObject.evalCommand("tabOrder={" + myTabString + "}");
      ggbObject.setVisible("tabOrder", false);
      //   console.log("tabOrder at the end of the function", ggbObject.getDefinitionString("tabOrder"));
    }

    function showSketchTool() {
      //called on button click
      //this function will need to hide all of the objects used for the picture tool (bin, images, segments, etc.) and then show any saved sketches and the toolbar
      pictureToolObjects.forEach(function (element) {
        ggbObject.setVisible(element, false);
      });
      if (sketchToolObjects.length > 0) {
        sketchToolObjects.forEach(function (element) {
          ggbObject.setVisible(element, true);
        });
      }
      deleteSpots();
      //   console.log("show tool bar");
      ggbObject.showToolBar(true);
      // ggbObject.setMode(62);
      ggbObject.registerAddListener(addedSketch);
      storedTool = ggbObject.getMode(); //will be 0
      // ggbObject.registerObjectUpdateListener("Follow", getYCoord);
      //   console.log("end of showSketchTool function");
    }

    function getYCoord() {
      //I don't think I need this function anymore. I think this was when we wanted the tool to turn back to mouse when hovering over button bar - it didn't end up working
      if (ggbObject.getYcoord("Follow") > ggbObject.getYcoord("Export_2") && ggbObject.getMode() !== 0) {
        storedTool = ggbObject.getMode();
        // console.log("storedTool when at the top before setting mode to 0:", storedTool);
        ggbObject.setMode(0);
      }
      if (
        ggbObject.getYcoord("Follow") < ggbObject.getYcoord("Export_2") &&
        ggbObject.getMode() === 0 &&
        storedTool !== 0
      ) {
        // console.log("setting mode to this stored tool:", storedTool);
        ggbObject.setMode(storedTool);
        storedTool = 0;
      }
    }

    function showPictureTool() {
      //called on button click
      //this function will need to hide all of the objects used for the sketch tool (toolbar and sketches) and then show objects used for the picture tool (bin, images, segments, etc.)
      ggbObject.unregisterAddListener(addedSketch);
      // ggbObject.unregisterObjectUpdateListener("Follow");
      pictureToolObjects.forEach(function (element) {
        ggbObject.setVisible(element, true);
      });
      if (sketchToolObjects.length > 0) {
        sketchToolObjects.forEach(function (element) {
          ggbObject.setVisible(element, false);
        });
      }
      //   console.log("hide tool bar");
      ggbObject.showToolBar(false);
      // ggbObject.setMode(0);
      //   console.log("end of showPictureTool function");
    }

    function addedSketch(a) {
      //   console.log("a, ggbObject.getObjectType(a)", a, ggbObject.getObjectType(a));
      if (ggbObject.getObjectType(a) === "penstroke") {
        sketchToolObjects.push(a);
        toGGBString(sketchToolObjects);
        ggbObject.setLayer(a, 4);
      }
    }

    function toGGBString(objName) {
      //objName will either be boxObject or segmentObject
      //convert my global js object to a string in GGB.
      //have to change double quotes to something else (we used &quot) to avoid errors in GGB text objects
      const jsonString = JSON.stringify(objName);
      //   console.log("jsonString", jsonString);
      const crazyString = objectConverter(jsonString, "removeDoubleQuotes");
      const stringName =
        objName === segmentObject
          ? "segmentObject"
          : objName === boxObject
          ? "boxObject"
          : objName === activeSegmentNames
          ? "activeSegmentNames"
          : objName === myCounts
          ? "myCounts"
          : objName === "boxNames"
          ? boxNames
          : objName === segmentReadOrder
          ? "segmentReadOrder"
          : objName === pictureToolObjects
          ? "pictureToolObjects"
          : objName === sketchToolObjects
          ? "sketchToolObjects"
          : objName === middleTabOrder
          ? "middleTabOrder"
          : objName === pointsInPictureToolToDelete
          ? "pointsInPictureToolToDelete"
          : "";
      //   console.log(stringName, typeof stringName);
      ggbObject.setTextValue(stringName.concat("String"), crazyString);
      //   console.log(
      //     "objectString after JSON stuff:",
      //     ggbObject.getValueString(stringName.concat("String"))
      //   );
    }

    function toGlobalJSObject(objNameStr) {
      //objName will either be boxObject or segmentObject
      //convert GGB text object to an actual JS object
      //replace &quot with double quotes
      const myUsableString = objectConverter(ggbObject.getValueString(objNameStr.concat("String")), "addDoubleQuotes");
      const jsonObject = JSON.parse(myUsableString);
      //   console.log("jsonObject", jsonObject);
      switch (true) {
        case objNameStr === "segmentObject":
          segmentObject = jsonObject;
          //   console.log(segmentObject);
          break;
        case objNameStr === "boxObject":
          boxObject = jsonObject;
          //   console.log(boxObject);
          break;
        case objNameStr === "activeSegmentNames":
          activeSegmentNames = jsonObject;
          //   console.log(activeSegmentNames);
          break;
        case objNameStr === "segmentReadOrder":
          segmentReadOrder = jsonObject;
          //   console.log(segmentReadOrder);
          break;
        case objNameStr === "myCounts":
          myCounts = jsonObject;
          //   console.log(myCounts);
          break;
        case objNameStr === "boxNames":
          boxNames = jsonObject;
          //   console.log(boxNames);
          break;
        case objNameStr === "pictureToolObjects":
          pictureToolObjects = jsonObject;
          //   console.log("pictureToolObjects");
          //   console.log(pictureToolObjects);
          break;
        case objNameStr === "sketchToolObjects":
          sketchToolObjects = jsonObject;
          //   console.log("sketchToolObjects");
          //   console.log(sketchToolObjects);
          break;
        case objNameStr === "middleTabOrder":
          middleTabOrder = jsonObject;
          //   console.log("middleTabOrder");
          //   console.log(middleTabOrder);
          break;
        case objNameStr === "pointsInPictureToolToDelete":
          pointsInPictureToolToDelete = jsonObject;
          //   console.log("pointsInPictureToolToDelete");
          //   console.log(pointsInPictureToolToDelete);
          break;
      }
    }

    function objectConverter(string, addOrRemove) {
      switch (addOrRemove) {
        case "addDoubleQuotes": {
          const usableString = string.replace(/&quot/g, '"');
          return usableString;
        }

        case "removeDoubleQuotes": {
          const newString = string.replace(/"/g, "&quot");
          return newString;
        }
      }
    }

    function reset() {
      const keeper = [
        "instructionsIcon",
        "xIcon",
        "buttonBarBorder",
        "MovableDragSegLeft",
        "MovableDragSegRight",
        "PermaDragSegLeft",
        "PermaDragSegRight",
        "pic1'",
      ];
      updateTabOrder("reset", []);
      if (ggbObject.getValue("pictureTool")) {
        //delete all new images and segments in the stage and remove them from the pictureToolObjects array
        const trashCan = [...ggbObject.getAllObjectNames("segment"), ...pointsInPictureToolToDelete];
        for (let i = 0, L = trashCan.length; i < L; i++) {
          if (!keeper.includes(trashCan[i])) {
            ggbObject.deleteObject(trashCan[i]);
            //deletes the objects from the pictureToolsObjects array as well.
            const index = pictureToolObjects.indexOf(trashCan[i]);
            if (index > 1) {
              pictureToolObjects.splice(index, 1);
            }
          }
        }
        toGGBString(pictureToolObjects);
        toGGBString(pointsInPictureToolToDelete);

        //delete all spot polygons
        deleteSpots();

        //empty out arrays and objects and reset vals to 0
        activeSegmentNames = [];
        segmentObject = {};
        boxCount = 0;
        ggbObject.setValue("DragSegLeftOnScreen", 0);
        ggbObject.setValue("DragSegRightOnScreen", 0);
        boxNames = [];
        boxObject = {};
        myCounts = {};
      } else {
        //if the sketch tool is shown and reset is clicked
        //delete all polylines in the stage and remove them from the sketchToolObjects array
        //note the polylines are categorized as penstrokes because "true" was added to the end of the polyline to make it a penstroke
        //then, if the drawing tool is activated, we need to deactive it and clear the stage.
        const trashCan2 = ggbObject.getAllObjectNames("penstroke");
        for (let i = 0, L = trashCan2.length; i < L; i++) {
          if (!keeper.includes(trashCan2[i])) {
            ggbObject.deleteObject(trashCan2[i]);
            //deletes the objects from the pictureToolsObjects array as well.
            sketchToolObjects = sketchToolObjects.filter(function (item) {
              return item !== trashCan2[i];
            });
          }
        }
        toGGBString(sketchToolObjects);
      }
    } // end reset function
  });

  /*
   * IGNORE BELOW
   */
  function loadUtils() {
    function parseJS(JSString) {
      return Function("" + JSString)();
    }
    if (!window.didUtils || !window.didUtils.setupGGB) {
      return fetch("https://cdn.digital.greatminds.org/did-utils/latest/index.js", {
        cache: "no-cache",
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (codingText) {
          parseJS(codingText);
        })
        .then(function () {
          return window.didUtils.setupGGB;
        });
    }
    return Promise.resolve(window.didUtils.setupGGB);
  }
}

function ggbOnInit(name, ggbObject) {
  loadUtils().then(function (setupGGB) {
    const buttonClicks = defineButtonClickScripts();
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
      isPoly,
      // selectedObject,
    } = setupGGB({
      name,
      ggbObject,
      defineKeyboardInstructions,
      buttonClicks,
      statusName: "AAppletStatus",
      preventCustomFocusIndicators: false,
    });
    const ggbcanvas = getCanvas();

    /*
     * IGNORE above
     * EDIT below
     */

    setAriaLabel(ggbcanvas, "Patterns Interactive");

    let selectedObject = "";
    const numAllowableShapes = ggbObject.getValue("numAllowableShapes");

    const shapes = ["Rhombus", "Square", "Trapezoid", "Triangle"];

    // get the starting coordinates of the images in the bin
    const starterXCoords = [];
    const starterYCoords = [];
    const boxXCoords = [];
    const boxYCoord = ggbObject.getYcoord("CenterBox");
    const snapGap = ggbObject.getValue("snapGap");
    const minBoxWidth = ggbObject.getValue("boxWidthMin");
    const maxBoxWidth = ggbObject.getValue("boxWidthMax");

    const imagesToIgnore = [
      "instructionsIcon",
      "permaRhombusPic",
      "permaTrianglePic",
      "permaTrapezoidPic",
      "permaSquarePic",
    ];

    const findNum = /\d+/g;

    let moveBinImageToBox = false;
    let dragging = false;
    // let tabSelect = false;

    // Use for screen reader text to announce the objects in the box
    let objectPointsInBox = [];
    getStarterCoordsAndSetupGGB();

    // listeners here; keep these, add your own as needed
    ggbObject.registerClientListener(function (clientEvent) {
      clientFunction(clientEvent);
      libClientFunction(clientEvent);
    });
    ggbObject.registerClickListener(function (clickedName) {
      clickListenerFunction(clickedName);
      libClickFunction(clickedName);
    });
    ggbcanvas.addEventListener("keyup", function (keyEvent) {
      keyit(keyEvent);
      libKeyFunction(keyEvent);
    });

    registerSafeObjectUpdateListener("numObjectsInBox", manageButtons);

    function manageButtons() {
      if (ggbObject.getValue("numObjectsInBox") === 0) {
        enableButton(1, false);
        enableButton(2, false);
      } else {
        enableButton(1, true);
        enableButton(2, true);
      }
    }

    // if the selectedObject is in the bin (includes movable), increase the width until max width reached. If an object was deleted from the box, reduce the width until min width reacherd
    function setBoxWidth(imageName = "") {
      const currentBoxWidth = ggbObject.getValue("boxWidth");
      // Do not add any extra width if the object is being deselected - remove width
      console.log("imageName :%o,  getWidthFromImageName: %o", imageName, getWidthFromImageName(imageName));
      const objWidth = imageName === "" ? 0 : getWidthFromImageName(imageName);
      const numObjectsInBox = objectPointsInBox.length;

      const allGaps = (numObjectsInBox + 2) * snapGap;
      let sumWidths = 0;
      console.warn("imageName", imageName, "objectPointsInBox before.", objectPointsInBox);
      console.log("Is imageName %o in objectPointsInBox? %o", imageName, objectPointsInBox.includes(imageName));
      objectPointsInBox.forEach(function (pointInBox) {
        sumWidths += getWidthFromImageName(getImageNameFromPointName(pointInBox));

        console.log(
          "getWidthFromImageName(getImageNameFromPointName(%o)) %o + snapGap %o",
          pointInBox,
          getWidthFromImageName(getImageNameFromPointName(pointInBox)),
          (numObjectsInBox - 1) * snapGap
        );
      });
      const neededWidth = sumWidths + allGaps + objWidth;
      const widthToSet =
        neededWidth >= maxBoxWidth
          ? maxBoxWidth
          : neededWidth <= minBoxWidth
          ? minBoxWidth
          : neededWidth >= currentBoxWidth
          ? neededWidth
          : currentBoxWidth;

      console.log(
        "neededWidth %o = \nsumWidths %o + \nobjWidth %o + \nsnapGap %o, \nneededWidth >= maxBoxWidth %o.  If True: %o , \nneededWidth <= minBoxWidth %o,  If True: %o  \nneededWidth >= currentBoxWidth %o,  If True: %o \nIf all false: currentBoxWidth %o.....\n>>> Width To Set: %o",
        neededWidth,
        sumWidths,
        objWidth,
        snapGap,
        neededWidth >= maxBoxWidth,
        maxBoxWidth,
        neededWidth <= minBoxWidth,
        minBoxWidth,
        neededWidth >= currentBoxWidth,
        neededWidth,
        currentBoxWidth,
        widthToSet
      );

      // if there is room for the currently selected object to fit inside the box, do not change the width. Otherwise make the width wide enough to accommodate the currently selected object, up until the maxBoxWidth
      ggbObject.setValue("boxWidth", widthToSet);
      snapAllBoxObjects();
    }

    function snapAllBoxObjects() {
      console.warn("in snapAllBoxPoints", selectedObject);
      const selectedPointName = getPointNameFromImageName(selectedObject);
      // (re)organize the objects in the box to fill in any gaps, & sort objectPointsInBox array from least to greatest x-coord
      let sortedObjects = [];

      // Only set the order based on coords if the item was dragged or keyyed - not clicked - if clicked always send to the end of the list
      if (!moveBinImageToBox) {
        sortedObjects = determineOrder();
        objectPointsInBox = [...sortedObjects];
      }

      const indexItemBeingDragged = dragging ? objectPointsInBox.indexOf(selectedPointName) : -1;

      // Send the image to the first available snapPoint
      // Cycle through all the sorted obj points in the box and place them in the first available space in the box
      objectPointsInBox.forEach(function (element, index) {
        // console.log(
        //   "element: %o,  dragging: %o, index: %o, indexItemBeingDragged: %o",
        //   element,
        //   dragging,
        //   index,
        //   indexItemBeingDragged
        // );
        // const elemIsBeingDragged = dragging && element === selectedPointName;
        let prevCornerBRXCoord;
        // Used to shift the image to the right by half of its width
        const currentObjWidth = getWidthFromImageName(getImageNameFromPointName(element));
        const prevImageIsBeingDragged = dragging && index === indexItemBeingDragged + 1 && indexItemBeingDragged !== -1;
        const currentImageIsBeingDragged = dragging && index === indexItemBeingDragged;

        const totalSnapNCurrentObj = +snapGap + currentObjWidth / 2;
        const totalSnapSelectedObj = +snapGap + getWidthFromImageName(selectedObject) / 2;
        switch (true) {
          case !prevImageIsBeingDragged: {
            // console.log("prevImage is NOT being dragged");
            // "Unless the "prevImage" is the object being dragged, find the first available snapPoint using the BR corner of the prevImage
            if (index === 0) {
              prevCornerBRXCoord = ggbObject.getXcoord("BoxBL");
              // If the objects is the first in the box...
              // and another item is not being dragged in front of it, start at leftmost x coord of box
              // if another item is being dragged & the dragged x cord of corner 2 is in front of prevCornerBRXCoord + totalSnapNudge, start at leftmost x coord of box
            } else {
              // if (index > 0)
              const prevImagePointInBox = objectPointsInBox[index - 1];
              // leave space if the dragging item is in front of the first static item in the box
              const prevImageInBox = getImageNameFromPointName(prevImagePointInBox);
              prevCornerBRXCoord = getImageCornerCoord(2, "x", prevImageInBox);
            }
            break;
          }
          case prevImageIsBeingDragged: {
            // console.log("prevImage IS being dragged");

            // If an item is being dragged, the item after the dragged item will set its coords based on thebottom right corner of the last previous item before the dragged item

            // If prevImageInBox is currently being dragged, set the coords based on the item before it plus the width of the dragged item and gaps
            // prevImage is the image before the item being dragged

            if (index >= 2) {
              const prevPrevImagePointInBox = objectPointsInBox[index - 2];
              const prevPrevImageInBox = getImageNameFromPointName(prevPrevImagePointInBox);
              prevCornerBRXCoord =
                getImageCornerCoord(2, "x", prevPrevImageInBox) + getWidthFromImageName(selectedObject) + snapGap;
            } else if (index === 1) {
              prevCornerBRXCoord = ggbObject.getXcoord("BoxBL") + totalSnapSelectedObj;
            } else console.error("check index in prevImageIsBeingDragged case");
            break;
          }
          default: {
            break;
          }
        }

        // Set coords of image based on first available point - except don't set coords if the current element is the selected object and is currently being dragged
        if (!currentImageIsBeingDragged) {
          ggbObject.setCoords(element, prevCornerBRXCoord + totalSnapNCurrentObj, boxYCoord);
        } else {
          // console.warn("current Image Is Being Dragged - do not set coords");
        }
      });
      console.log("End snapAllBoxPoints");
    }

    function getImageNameFromPointName(pointName) {
      return pointName.replace("Point", "");
    }

    function getStarterCoordsAndSetupGGB() {
      // Find the coordinates of the points inside the bottom bin where the movable images should be placed, then place the movable images thusly.
      if (starterXCoords.length === 0) {
        shapes.forEach(function (element, index) {
          starterXCoords.push(ggbObject.getXcoord("Center" + element));
          starterYCoords.push(ggbObject.getYcoord("Center" + element));
          ggbObject.setCoords("Center" + element + "Movable", starterXCoords[index], starterYCoords[index]);
        });
      }

      // Find the coordinates of the points inside the center box to which the images with be snapped
      if (boxXCoords.length === 0) {
        // Call the function to push values from 'MyGeoGebraList' to 'myArray'
        pushGeoGebraListToJSArray("snapPoints", boxXCoords, "x");
        // pushGeoGebraListToJSArray("snapPoints", boxYCoords, "y");
      }
    }

    // Function to push GeoGebra list values to a JavaScript array
    function pushGeoGebraListToJSArray(geoGebraListName, jsArray, xOrYString) {
      // Get the size of the GeoGebra list
      const listSize = ggbObject.getValue("Length(" + geoGebraListName + ")");

      // Push each value from the GeoGebra list to the JavaScript array
      for (let i = 1; i <= listSize; i++) {
        const value = ggbObject.getValue(xOrYString + "(Element(" + geoGebraListName + ", " + i + "))");
        jsArray.push(value);
      }
    }

    function checkLocation(imageName) {
      console.warn("In checkLocation", imageName, "dragging", dragging);
      const shape = getShapeTypeFromImageName(imageName);

      const numTotalObjectsOfType = ggbObject.getValue("active" + shape);

      const imageCornerXVals = [];
      const imageCornerYVals = [];
      const cornerIsInBin = [];
      const cornerIsInBox = [];

      // capture the corner points of each image in the box & whether they are in the bin or out of the bin
      for (let cornerNum = 1, Length = 4; cornerNum <= Length; cornerNum++) {
        const xVal = getImageCornerCoord(cornerNum, "x", imageName);
        const yVal = getImageCornerCoord(cornerNum, "y", imageName);

        imageCornerXVals.push(xVal);
        imageCornerYVals.push(yVal);
        cornerIsInBin.push(checkInBin(xVal, yVal));
        cornerIsInBox.push(checkInBox(xVal, yVal));
      }

      // determine the location & of the image relative to the bin or box
      const isCompletelyOutOfBox = !cornerIsInBox[0] && !cornerIsInBox[1] && !cornerIsInBox[2] && !cornerIsInBox[3];
      const topCornerNotInBin = !cornerIsInBin[0];
      const movedOutOfBin = topCornerNotInBin && imageName.includes("movable");
      const movedWithinBox = !isCompletelyOutOfBox && !imageName.includes("movable");
      const movedOutOfBox = isCompletelyOutOfBox && !imageName.includes("movable");

      switch (true) {
        case movedOutOfBin || moveBinImageToBox: {
          // If student moves a bin image upward out of the bin or clicks the bin image, make a copy of the image
          if (numTotalObjectsOfType <= numAllowableShapes + 1 && !dragging) {
            makeCopy(shape);
          } else if (!dragging) {
            ggbObject.evalCommand("SelectObjects(movable" + shape + "+Pic)");
          }
          break;
        }
        case movedOutOfBox: {
          // If a student moves an image out of the box, delete the image
          if (!dragging) {
            deleteCopy(imageName);
            console.log("movedOutOfBin && not dragging");
          }
          break;
        }
        case movedWithinBox || (dragging && movedOutOfBin): {
          // If the student reagganges the images in the box, organize the images
          snapAllBoxObjects();
          break;
        }
        default:
          break;
      }
    }

    function makeCopy(shape) {
      console.log("In makeCopy. shape:", shape);
      const movableImageName = "movable" + shape + "Pic";
      const numTotalObjectsOfType = ggbObject.getValue("active" + shape);
      // console.log(selectedObject, objectPointsInBox);
      const newShapeName = ggbObject.evalCommandGetLabels(
        shape + numTotalObjectsOfType + "=CopyFreeObject(" + movableImageName + ")"
      );
      // movePointName (ex: "CenterRhombusMovable")
      const movePtName = "Center" + shape + "Movable";
      const xValMovable = ggbObject.getXcoord(movePtName);
      const yValMovable = ggbObject.getYcoord(movePtName);

      // the image copy will be centered at the newShapePoint (ex: "Rhombus1")
      const newShapePoint = ggbObject.evalCommandGetLabels(
        shape + numTotalObjectsOfType + "Point=(" + xValMovable + "," + yValMovable + ")"
      );
      // console.log(
      //   "new shape point made:",
      //   newShapePoint,
      //   ggbObject.exists(newShapePoint)
      // );

      // hide the new image center point
      ggbObject.setVisible(newShapePoint, false);

      // Make the image centered at a point. Set the "startPoint expression" (aka center point name) using the XML
      editXML(newShapeName, "startPoint", "exp", newShapePoint);

      // update the ggb counter for number of active points by shape type (ex: activeRhombus)
      ggbObject.setValue("active" + shape, ggbObject.getValue("active" + shape) + 1);

      // set the coordinates of the new centering point to the correct location in the bin so the image snaps to this point
      const starterX = getStarterBinCoordsFromShapeType(shape, "x");
      const starterY = getStarterBinCoordsFromShapeType(shape, "y");
      ggbObject.setCoords(movePtName, starterX, starterY);

      // // select the newly created shape
      // ggbObject.evalCommand("SelectObjects(" + newShapeName + ")");

      // push the object name to the objectsInBox array
      if (!objectPointsInBox.includes(newShapePoint)) {
        objectPointsInBox.push(newShapePoint);
      }

      // add 1 to the GGB object numObjectsInBox (when numObjectsInBox >=5, the movable pics will not be visible)
      ggbObject.setValue("numObjectsInBox", objectPointsInBox.length);

      // console.log("in makeCopy before snappAllBoxPoints", objectPointsInBox);
      // organize image in the box
      snapAllBoxObjects();

      // console.log("End makeCopy");
    }

    function getStarterBinCoordsFromShapeType(shapeType, xOrYString) {
      if (xOrYString === "x") {
        return starterXCoords[shapes.indexOf(shapeType)];
      }
      return starterYCoords[shapes.indexOf(shapeType)];
    }

    // if a bottom point of a newly created image is moved to the bin, delete the image
    function deleteCopy(imageName) {
      console.log("in DeleteCopy,", imageName);

      const shape = getShapeTypeFromImageName(imageName);
      const indexBeforeDeletion = objectPointsInBox.indexOf(getPointNameFromImageName(imageName));
      console.log("indexBeforeDeletion", indexBeforeDeletion);
      // delete the image
      ggbObject.deleteObject(imageName);

      const numNewActiveOfShapeType = ggbObject.getValue("active" + shape) - 1;
      // set the value of the ggb active shape counter for conditional visibility
      ggbObject.setValue("active" + shape, numNewActiveOfShapeType);

      const newNumObjectsInBox = ggbObject.getValue("numObjectsInBox") - 1;

      // update the value of the ggb numObjectsInBox counter for conditional visibility
      ggbObject.setValue("numObjectsInBox", newNumObjectsInBox);

      // remove the point from the objectPointsInBox array
      objectPointsInBox = objectPointsInBox.filter(function (el) {
        return el !== imageName + "Point";
      });

      // set the box width based on the remaining objects in the box
      // console.log("in deleteCopy - setBoxWidth()");
      setBoxWidth();

      // select the desired object after deleting the previously selected object
      selectNextObjectAfterDeletion(imageName, indexBeforeDeletion);
    }

    function selectNextObjectAfterDeletion(deletedImage, indexBeforeDeletion) {
      // const pointName = getPointNameFromImageName(deletedImage);
      const numObjectsInBox = objectPointsInBox.length;

      // If a shape was deleted from the box and the box is empty, select the first object in the bin
      if (numObjectsInBox === 0) {
        ggbObject.evalCommand("SelectObjects(movable" + shapes[0] + "Pic)");
      } else {
        // If there are still objects in the box after current object was deleted, select the next object in the box.
        // const lastObjectPoint = objectPointsInBox[numObjectsInBox - 1];
        // const lastImageName = getImageNameFromPointName(lastObjectPoint);
        // console.log("In selectNext. Else - select lastImage", lastImageName);
        // ggbObject.evalCommand("SelectObjects(" + lastImageName + ")");
        console.log("deletedImage", deletedImage, "indexBeforeDeletion", indexBeforeDeletion);

        const nextShapeInBox = objectPointsInBox[indexBeforeDeletion];
        ggbObject.evalCommand("SelectObjects(" + getImageNameFromPointName(nextShapeInBox) + ")");
      }
    }

    // let numRhombusInBox;
    // let numSquareInBox;
    // let numTriangleInBox;
    // let numTrapezoidInBox;
    let rhombusesInBoxArray = [];
    let squaresInBoxArray = [];
    let trianglesInBoxArray = [];
    let trapezoidsInBoxArray = [];

    function renameImagesInBox() {
      console.log("In rename Images, ", objectPointsInBox);
      // updateActiveNumsInBox();
      updateShapeNamesArrays();
      console.log("previous Arrays", rhombusesInBoxArray, squaresInBoxArray, trianglesInBoxArray, trapezoidsInBoxArray);

      renameArrayElements(rhombusesInBoxArray, "Rhombus");
      renameArrayElements(squaresInBoxArray, "Square");
      renameArrayElements(trianglesInBoxArray, "Triangle");
      renameArrayElements(trapezoidsInBoxArray, "Trapezoid");

      console.log("renamed Arrays", rhombusesInBoxArray, squaresInBoxArray, trianglesInBoxArray, trapezoidsInBoxArray);
      // updateActiveNumsInBox();
      // TODO: update objectPointsInBox based on these new names

      function renameArrayElements(arrayName, shapeType) {
        arrayName.forEach(function (element, index) {
          if (ggbObject.exists(element)) {
            const numString = (index + 1).toString();
            console.log("nenaming ", element, " to ", shapeType + numString);
            ggbObject.renameObject(element, shapeType + numString);
          } else {
            console.error(element, " does not exist");
          }
        });
      }
      // function updateActiveNumsInBox() {
      //   numRhombusInBox = getNumActiveShapes("Rhombus");
      //   numSquareInBox = getNumActiveShapes("Square");
      //   numTriangleInBox = getNumActiveShapes("Triangle");
      //   numTrapezoidInBox = getNumActiveShapes("Trapezoid");
      // }

      function updateShapeNamesArrays() {
        rhombusesInBoxArray = getGGBImageNamesInBox("Rhombus");
        squaresInBoxArray = getGGBImageNamesInBox("Square");
        trianglesInBoxArray = getGGBImageNamesInBox("Triangle");
        trapezoidsInBoxArray = getGGBImageNamesInBox("Trapezoid");
      }
    }
    // function getNumActiveShapes(shape) {
    //   // console.log("getNumactive:", shape, ggbObject.getValue("active" + shape));
    //   return ggbObject.getValue("active" + shape) -
    //     ggbObject.getVisible("movable" + shape + "Pic")
    //     ? 1
    //     : 0;
    // }
    function getGGBImageNamesInBox(shape) {
      const allNames = ggbObject.getAllObjectNames("image").filter(function (element) {
        return !imagesToIgnore.includes(element) && !element.includes("movable") && element.includes(shape);
      });
      return allNames;
    }

    // function deleteAndRecreateAllImages() {
    //   const
    //   function deleteAllImages() {
    //     console.log("In deleteAll:", objectPointsInBox);
    //     objectPointsInBox.forEach(function (element) {
    //       deleteCopy(getImageNameFromPointName(element));
    //     });
    //     console.log("End deleteAll:", objectPointsInBox);
    //   }

    //   function createAllImages() {
    //     console.log("In createAllImages", objectPointsInBox);
    //     objectPointsInBox.forEach(function (element) {
    //       const shape = getShapeTypeFromImageName(
    //         getImageNameFromPointName(element)
    //       );
    //       makeCopy(shape);
    //       console.log("1. making copy", shape);
    //       // snapAllBoxObjects();
    //       // console.log("2. making copy - snapped");
    //     });
    //   }
    // }

    // returns the point name (ex: "CenterRhombusMovable" or"Rhombus1Point"). Accepts the imageName as an argument (ex: "movableRhombusPic" or "Rhombus1")
    function getPointNameFromImageName(imageName) {
      return imageName.includes("movable")
        ? "Center" + getShapeTypeFromImageName(imageName) + "Movable"
        : imageName.concat("Point");
    }

    // returns the x or y coordinate of an image. Accepts arguments cornerNum (ex: 2 for bottom right point), xOrYString (ex: "x" or "y"), imageName (ex:"movableRhombusPic" or "Rhombus1" - defaults to selectedObject )
    function getImageCornerCoord(cornerNum, xOrYString, imageName = selectedObject) {
      const shape = getShapeTypeFromImageName(imageName);

      switch (xOrYString) {
        case "x": {
          let xVal = ggbObject.getValue("x(Corner(" + imageName + "," + cornerNum + "))");
          // hone in on the "true" corner points for slanted objects
          const nudgeLeft = (shape === "Triangle" || shape === "Trapezoid" || shape === "Rhombus") && cornerNum === 3;
          const nudgeRight =
            ((shape === "Trapezoid" || shape === "Triangle") && cornerNum === 4) ||
            (shape === "Rhombus" && cornerNum === 1);
          const indent = ggbObject.getValue("indent" + shape);
          if (nudgeLeft) {
            xVal = xVal - indent;
          } else if (nudgeRight) {
            xVal = xVal + indent;
          }
          return xVal;
        }
        case "y": {
          const yVal = ggbObject.getValue("y(Corner(" + imageName + "," + cornerNum + "))");
          return yVal;
        }
      }
    }

    function getWidthFromImageName(imageName) {
      const shape = getShapeTypeFromImageName(imageName).toLowerCase();

      return ggbObject.getValue(shape + "WidthManual");
    }

    function checkInBin(xVal, yVal) {
      return ggbObject.getValue("IsInRegion((" + xVal + "," + yVal + "),bin)");
    }

    function checkInBox(xVal, yVal) {
      return ggbObject.getValue("IsInRegion((" + xVal + "," + yVal + "),box)");
    }

    // returns the shape type in capital letters (ex: "Rhombus"). Accepts the imageName as an argument (ex: "movableRhombusPic" or "Rhombus1")
    function getShapeTypeFromImageName(obj) {
      return obj.includes("movable") ? obj.substring(7, obj.length - 3) : obj.replace(findNum, "");
    }

    function reset() {
      const images = ggbObject.getAllObjectNames("image");
      for (let i = 0, L = images.length; i < L; i++) {
        if (!images[i].includes("movable") && !imagesToIgnore.includes(images[i])) {
          ggbObject.deleteObject(images[i]);
        }
      }
    }

    // function that gets the vertical order of images on the screen if they contain the word "Movable"
    function determineOrder() {
      const allInits = [...objectPointsInBox];

      // sorts the images from the previous array based on their x-coordinate
      const sortedInits = allInits.sort(function (aName, bName) {
        // if the dragged image was in the box (i.e. selectedObject doesn't have moving in its name), compare the left x coord of one to the right x coord of the other
        const aXCoord = ggbObject.getXcoord(aName);
        const bXCoord = ggbObject.getXcoord(bName);
        // const aYCoord = ggbObject.getYcoord(aName);
        // const bYCoord = ggbObject.getYcoord(bName);
        // if the dragged image was in the box (i.e. selectedObject doesn't have moving in its name), compare the left x coord of one to the right x coord of the other
        // console.log("SORTING! - aName: %o, bName: %o", aName, bName);
        // const cornerToCompareA =
        //   "x(Corner(" + getImageNameFromPointName(aName) + ",1))";
        // const cornerToCompareB =
        //   "x(Corner(" + getImageNameFromPointName(bName) + ",2))";
        // console.log(
        //   "SORTING! - cornerToCompareA: %o, cornerToCompareB: %o",
        //   cornerToCompareA,
        //   cornerToCompareB
        // );
        // const aXCoord = ggbObject.getValue(cornerToCompareA);
        // const bXCoord = ggbObject.getValue(cornerToCompareB);
        // console.log(
        //   "SORTING! - %o: %o, %o: %o",
        //   aName,
        //   aXCoord,
        //   bName,
        //   bXCoord
        // );

        // const aYCoord = ggbObject.getYcoord(aName);
        // const bYCoord = ggbObject.getYcoord(bName);

        // determines which x-coord is bigger and returns a number accordingly to tell the sort which order they go in, if x-coords are the same, place the higher y coord before the lower one.
        switch (true) {
          case aXCoord < bXCoord:
            return -1;
          // falls through
          case aXCoord > bXCoord:
            return 1;
          // falls through
          case aXCoord === bXCoord:
            return 0;
          // default:
        }

        return 0;
      });
      return sortedInits;
    }

    function defineButtonClickScripts() {
      // defines button scripts
      // keep this function, but you can delete anything/everything inside it
      return {
        ggbButton1() {
          enableButton(1, false);
          enableButton(2, true);
          renameImagesInBox();
        },
        ggbButton2() {
          enableButton(1, true);
          enableButton(2, false);
          reset();
        },
        ggbButton3() {},
        ggbButton4() {},
        ggbButton5() {},
      };
    }

    function defineKeyboardInstructions(obj) {
      // takes a GGB object name as an argument, returns its keyboard text.
      const keyboardInstructions = {
        // A: "Press the arrow keys to move this point.",
        ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
      };
      return keyboardInstructions[obj];
    }

    function clientFunction(clientEvent) {
      const { type, target } = clientEvent;
      switch (type) {
        case "select": {
          selectedObject = target;
          console.log("select ", selectedObject);
          // make the box wider if the student grabs an image (not on tabSelect to avoid the width changing while selectObject is happening)
          if (selectedObject.includes("movable")) {
            console.log("in select IF - setBoxWidth(selObj)", selectedObject);
            setBoxWidth(selectedObject);
          }
          // if (tabSelect && selectedObject.includes("movable")) { //////////////////////////////// COME BACK
          //   console.log("in select IF - setBoxWidth(selObj)", selectedObject);
          //   setBoxWidth(selectedObject);
          // }
          else {
            console.log("in select ELSE - setBoxWidth()");
            setBoxWidth();
          }
          break;
        }
        case "dragEnd": {
          console.log("dragEnd");
          if (!selectedObject.includes(imagesToIgnore) && ggbObject.getObjectType(selectedObject) === "image") {
            checkLocation(selectedObject);
          }
          break;
        }
        // case "mouseDown": {
        //   // console.log("mousedown, selObj: ", selectedObject);
        //   // if (selectedObject.includes("movable")) {
        //   //   console.log("in mouseDown - setBoxWidth(selObj)", selectedObject);
        //   //   setBoxWidth(selectedObject);
        //   // }
        //   break;
        // }
        case "movedGeos": {
          console.log("movedGeos");
          dragging = true;
          // Check: Should checkLocation be moved after the if statement
          checkLocation(selectedObject);
          if (selectedObject.includes("movable")) {
            setBoxWidth(selectedObject);
          }
          dragging = false;
          break;
        }
        case "deselect": {
          // tabSelect = false;
          moveBinImageToBox = false;
          console.error("deselect");
          // console.log("in deselect - setBoxWidth()");
          selectedObject = "";
          setBoxWidth();
          break;
        }
      }
    }

    function clickListenerFunction(clickedName) {
      // clickedName is a string
      console.log("clickedName", clickedName);
      if (ggbObject.getObjectType(clickedName) === "image") {
        if (clickedName.includes("movable")) {
          // console.log("movable Pic clicked, -> check location");
          moveBinImageToBox = true;
          // If an image in the bin was clicked, add it to the box above
          checkLocation(clickedName);
          // select the bin object if available, otherwise, select the play button
          console.log(
            "In click Listener - ggbObject.getVisible(clickedName: %o): %o  \nobjectPointsInBox.length === numAllowableShapes: %o",
            clickedName,
            ggbObject.getVisible(clickedName),
            objectPointsInBox.length === numAllowableShapes
          );
          // The clicked shape is able to be replicated again, select the clicked shape
          if (ggbObject.getVisible(clickedName)) {
            ggbObject.evalCommand("SelectObjects(" + clickedName + ")");
          } else if (objectPointsInBox.length === numAllowableShapes) {
            console.log("In click listener. Box is full - select play button");
            // All bin objects are disabled - the limit for the box has been reached, select the play button
            ggbObject.evalCommand("SelectObjects(ggbButton1)");
          } else {
            console.log("In click listener - else statement");
            // the clicked shape has reached it's limit for the box, but a different shape can be added
            const nextShapeInBin = shapes[shapes.indexOf(getShapeTypeFromImageName(clickedName)) + 1];
            ggbObject.evalCommand("SelectObjects(movable" + nextShapeInBin + "Pic)");
            console.log("In click Listener - selecting next shape in bin: ", nextShapeInBin);
          }
          // setBoxWidth(clickedName);
        } else if (!imagesToIgnore.includes(clickedName)) {
          // If an image in the box was clicked, send it back to the bin and delete
          console.log("deleting Copy", clickedName);
          deleteCopy(clickedName);
        }
      }
    }

    function keyit(keyEvent) {
      // feel free to delete key or code depending on your preferences
      const { key } = keyEvent;
      // console.log("key it", key);

      // set the tabSelect bool - used for setting the width of the box strategically
      // if (key === "Tab") {
      //   tabSelect = true;
      // } else {
      //   tabSelect = false;
      // }

      const objType = ggbObject.getObjectType(selectedObject);
      const imageSelected = !selectedObject.includes(imagesToIgnore) && objType === "image";

      const nudgeNum = getWidthFromImageName(selectedObject) + snapGap;

      // If the student uses the arrow key while an image is selected
      if (key.includes("Arrow") && imageSelected) {
        const binImageSelected = imageSelected && selectedObject.includes("movable");
        const boxImageSelected = imageSelected && !selectedObject.includes("movable");
        // console.log(
        //   "keyit event, key:",
        //   key,
        //   "binImageSelected",
        //   binImageSelected,
        //   "boxImageSelected",
        //   boxImageSelected
        // );
        const starterX = getStarterBinCoordsFromShapeType(getShapeTypeFromImageName(selectedObject), "x");
        const starterY = getStarterBinCoordsFromShapeType(getShapeTypeFromImageName(selectedObject), "y");

        const selectedPointName = getPointNameFromImageName(selectedObject);

        // determine what to do with the bin image or box image when the student presses a certain arrow key
        switch (true) {
          case binImageSelected: {
            switch (true) {
              case key === "ArrowUp": {
                // send to box
                moveBinImageToBox = true;
                checkLocation(selectedObject);
                break;
              }
              case key === "ArrowDown" || key === "ArrowRight" || key === "ArrowLeft": {
                // snap back to bin
                ggbObject.setCoords(selectedPointName, starterX, starterY);
                break;
              }

              default:
                break;
            }
            break;
          }
          case boxImageSelected: {
            switch (true) {
              case key === "ArrowDown": {
                // send to bin
                deleteCopy(selectedObject);
                break;
              }
              case key === "ArrowUp": {
                // snap back to box
                snapAllBoxObjects();
                break;
              }
              case key === "ArrowLeft": {
                // change order
                ggbObject.setCoords(
                  selectedPointName,
                  ggbObject.getXcoord(selectedPointName) - nudgeNum,
                  ggbObject.getYcoord(selectedPointName)
                );
                checkLocation(selectedObject);

                break;
              }
              case key === "ArrowRight": {
                // change order
                ggbObject.setCoords(
                  selectedPointName,
                  ggbObject.getXcoord(selectedPointName) + nudgeNum,
                  ggbObject.getYcoord(selectedPointName)
                );
                checkLocation(selectedObject);

                break;
              }

              default:
                break;
            }
            // checkLocation(selectedObject);
            break;
          }
        }
      }
    }

    // add new stuff above this line
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

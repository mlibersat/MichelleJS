//on dragEnd and keyup:
setTimeout(function () {
  checkForMaxMinDragSituation();
}, 100);

/////////////////OPTION 1 -  X only ////////////////
function checkForMaxMinDragSituation() {
  let selectedObjectXCoord = ggbObject.getXcoord(selectedObject);
  let appletMaxXCoord = ggbObject.getValue("maxDragX");
  let appletMinXCoord = ggbObject.getValue("minDragX");

  let minXOnly = selectedObjectXCoord === appletMinXCoord;
  let maxXOnly = selectedObjectXCoord === appletMaxXCoord;

  switch (true) {
    case minXOnly:
      ggbReadText("This point is at its minimum value for this interactive.");
      break;
    case maxXOnly:
      ggbReadText("This point is at its maximum value for this interactive.");
      break;
  }
}

/////////////OPTION 2 -  X and Y ////////////////////////
function checkForMaxMinDragSituation() {
  let selectedObjectXCoord = ggbObject.getXcoord(selectedObject);
  let selectedObjectYCoord = ggbObject.getYcoord(selectedObject);
  let appletMaxXCoord = ggbObject.getValue("maxDragX");
  let appletMaxYCoord = ggbObject.getValue("maxDragY");
  let appletMinXCoord = ggbObject.getValue("minDragX");
  let appletMinYCoord = ggbObject.getValue("minDragY");

  let minXOnly =
    selectedObjectXCoord === appletMinXCoord &&
    selectedObjectYCoord != appletMinYCoord &&
    selectedObjectYCoord != appletMaxYCoord;
  let maxXOnly =
    selectedObjectXCoord === appletMaxXCoord &&
    selectedObjectYCoord != appletMinYCoord &&
    selectedObjectYCoord != appletMaxYCoord;

  let minYOnly =
    selectedObjectYCoord === appletMinYCoord &&
    selectedObjectXCoord != appletMinXCoord &&
    selectedObjectXCoord != appletMaxXCoord;
  let maxYOnly =
    selectedObjectYCoord === appletMaxYCoord &&
    selectedObjectXCoord != appletMinXCoord &&
    selectedObjectXCoord != appletMaxXCoord;

  let minXAndMinY = selectedObjectXCoord === appletMinXCoord && selectedObjectYCoord === appletMinYCoord;
  let maxXAndMinY = selectedObjectXCoord === appletMaxXCoord && selectedObjectYCoord === appletMinYCoord;
  let maxXAndMaxY = selectedObjectXCoord === appletMaxXCoord && selectedObjectYCoord === appletMaxYCoord;
  let minXAndMaxY = selectedObjectXCoord === appletMinXCoord && selectedObjectYCoord === appletMaxYCoord;

  switch (true) {
    case minXOnly:
      ggbReadText("This point is at its minimum x value for this interactive.");
      break;
    case maxXOnly:
      ggbReadText("This point is at its maximum x value for this interactive.");
      break;
    case minYOnly:
      ggbReadText("This point is at its minimum y value for this interactive.");
      break;
    case maxYOnly:
      ggbReadText("This point is at its maximum y value for this interactive.");
      break;
    case minXAndMinY:
      ggbReadText("This point is at its minimum x and y value for this interactive.");
      break;
    case maxXAndMinY:
      ggbReadText("This point is at its maximum x value and minimum y value for this interactive.");
      break;
    case maxXAndMaxY:
      ggbReadText("This point is at its maximum x and y value for this interactive.");
      break;
    case minXAndMaxY:
      ggbReadText("This point is at its minimum x value and maximum y value for this interactive.");
      break;
  }
}

/////////////////////OPTION 3 RETURN STRING TO CONCAT//////////////

function returnMinMaxString() {
  const selectedObjectXCoord = ggbObject.getXcoord(selectedObject);
  const selectedObjectYCoord = ggbObject.getYcoord(selectedObject);
  const appletMaxXCoord = ggbObject.getValue("maxXPoint");
  const appletMaxYCoord = ggbObject.getValue("maxYPoint");
  const appletMinXCoord = ggbObject.getValue("minXPoint");
  const appletMinYCoord = ggbObject.getValue("minYPoint");
  let readMinMax = "";
  const pointLocationStr = "";
  // If using restrictFreePoint function
  // if (pointRestricted) {
  //   pointLocationStr = "The point moved to (".concat(
  //     ggbObject.getXcoord(selectedObject),
  //     ", ",
  //     ggbObject.getYcoord(selectedObject),
  //     ")."
  //   );
  // }

  const moveFurtherText = " To move this point further, first use the Zoom Out button to expand the zoom window. ";

  const minXOnly =
    selectedObjectXCoord === appletMinXCoord &&
    selectedObjectYCoord !== appletMinYCoord &&
    selectedObjectYCoord !== appletMaxYCoord;
  const maxXOnly =
    selectedObjectXCoord === appletMaxXCoord &&
    selectedObjectYCoord !== appletMinYCoord &&
    selectedObjectYCoord !== appletMaxYCoord;

  const minYOnly =
    selectedObjectYCoord === appletMinYCoord &&
    selectedObjectXCoord !== appletMinXCoord &&
    selectedObjectXCoord !== appletMaxXCoord;
  const maxYOnly =
    selectedObjectYCoord === appletMaxYCoord &&
    selectedObjectXCoord !== appletMinXCoord &&
    selectedObjectXCoord !== appletMaxXCoord;

  const minXAndMinY = selectedObjectXCoord === appletMinXCoord && selectedObjectYCoord === appletMinYCoord;
  const maxXAndMinY = selectedObjectXCoord === appletMaxXCoord && selectedObjectYCoord === appletMinYCoord;
  const maxXAndMaxY = selectedObjectXCoord === appletMaxXCoord && selectedObjectYCoord === appletMaxYCoord;
  const minXAndMaxY = selectedObjectXCoord === appletMinXCoord && selectedObjectYCoord === appletMaxYCoord;

  switch (true) {
    case minXOnly:
      readMinMax = "This point is at its minimum x value for this zoom window.".concat(moveFurtherText);
      break;
    case maxXOnly:
      readMinMax = "This point is at its maximum x value for this zoom window.".concat(moveFurtherText);
      break;
    case minYOnly:
      readMinMax = "This point is at its minimum y value for this zoom window.".concat(moveFurtherText);
      break;
    case maxYOnly:
      readMinMax = "This point is at its maximum y value for this zoom window.".concat(moveFurtherText);
      break;
    case minXAndMinY:
      readMinMax = "This point is at its minimum x and y value for this zoom window.".concat(moveFurtherText);
      break;
    case maxXAndMinY:
      readMinMax = "This point is at its maximum x value and minimum y value for this zoom window.".concat(
        moveFurtherText
      );
      break;
    case maxXAndMaxY:
      readMinMax = "This point is at its maximum x and y value for this zoom window.".concat(moveFurtherText);
      break;
    case minXAndMaxY:
      readMinMax = "This point is at its minimum x value and maximum y value for this zoom window.".concat(
        moveFurtherText
      );
      break;
  }

  // returns the point location and the min max language
  return pointLocationStr.concat(" ", readMinMax);
}

// let pointRestricted = false;
// function restrictFreePoint(point) {
//   const xCoord = ggbObject.getXcoord(point);
//   const yCoord = ggbObject.getYcoord(point);
//   const xMin = ggbObject.getValue("minXPoint");
//   const xMax = ggbObject.getValue("maxXPoint");
//   const yMin = ggbObject.getValue("minYPoint");
//   const yMax = ggbObject.getValue("maxYPoint");

//   var xRestricted = false;
//   var yRestricted = false;

//   var newXCoord;
//   if (xCoord < xMin) {
//     newXCoord = xMin;
//     xRestricted = true;
//   } else if (xCoord > xMax) {
//     newXCoord = xMax;
//     xRestricted = true;
//   } else {
//     newXCoord = xCoord;
//     xRestricted = false;
//   }

//   var newYCoord;
//   if (yCoord < yMin) {
//     newYCoord = yMin;
//     yRestricted = true;
//   } else if (yCoord > yMax) {
//     newYCoord = yMax;
//     yRestricted = true;
//   } else {
//     newYCoord = yCoord;
//     yRestricted = false;
//   }

//   pointRestricted = xRestricted || yRestricted;
//   console.log(xRestricted, yRestricted, pointRestricted);

//   ggbObject.setCoords(point, newXCoord, newYCoord);
//   console.log("new", newXCoord, newYCoord);
// }

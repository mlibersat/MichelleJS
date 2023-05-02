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
  let selectedObjectXCoord = ggbObject.getXcoord(selectedObject);
  let selectedObjectYCoord = ggbObject.getYcoord(selectedObject);
  let appletMaxXCoord = ggbObject.getValue("maxXPoint");
  let appletMaxYCoord = ggbObject.getValue("maxYPoint");
  let appletMinXCoord = ggbObject.getValue("minXPoint");
  let appletMinYCoord = ggbObject.getValue("minYPoint");
  let readMinMax = "";
  let pointLocationStr = "";
  if (pointRestricted) {
    pointLocationStr = "The point moved to (".concat(
      ggbObject.getXcoord(selectedObject),
      ", ",
      ggbObject.getYcoord(selectedObject),
      ")."
    );
  }

  let moveFurtherText = " To move this point further, first use the Zoom Out button to expand the zoom window. ";

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

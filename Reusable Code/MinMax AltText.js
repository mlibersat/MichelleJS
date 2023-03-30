//on dragEnd and keyup:
setTimeout(function () {
  checkForMaxMinDragSituation();
}, 100);

// X only
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

// X and Y
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

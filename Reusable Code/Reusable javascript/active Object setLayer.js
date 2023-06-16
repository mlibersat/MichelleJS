////////////////// Simple case ////////////////

function clientFunction(a) {
  const lowerLayer = 5;
  const upperLayer = 6;
  switch (a.type) {
    case "select":
      selectedObject = a.target;
      if (selectedObject == "A") {
        ggbObject.setLayer("A", upperLayer);
        ggbObject.setLayer("B", lowerLayer);
      } else if (selectedObject == "B") {
        ggbObject.setLayer("A", lowerLayer);
        ggbObject.setLayer("B", upperLayer);
      }
      break;
    case "deselect":
      ggbObject.setLayer("A", lowerLayer);
      ggbObject.setLayer("B", lowerLayer);
      break;
  }
}

///////////////// Complex example ////////////////
// from IM1 M2 L13 slide 8 global JS
// Useful when clicking one object needs to change the layer of many objects

// on click of lock it in
bringSallyDown();

// on click of unlock
bringSallyUp();

function clientFunction(a) {
  switch (a.type) {
    case "select":
      selectedObject = a.target;
      if (selectedObject == "DragPoint1" || selectedObject == "DragPoint2") {
        bringSallyUp();
      }
      break;
  }
}

// When unlock is pressed, bring drag line to top layers, and move boundary line on bottom
// Note: Layers/visiblity also affected by platform components
function bringSallyUp() {
  ggbObject.setLayer("dragLineWhite", 4);
  ggbObject.setLayer("DragPoint1", 7);
  ggbObject.setLayer("DragPoint2", 7);
  ggbObject.setLayer("White1", 6);
  ggbObject.setLayer("White2", 6);
  ggbObject.setLayer("dragLine", 6);
  ggbObject.setLayer("eq1White", 2);
  ggbObject.setLayer("eq1", 3);
  ggbObject.setLayer("text1", 3);
}

// When lock is pressed, bring drag line to bottom layers, and move boundary line on top
// Note: Layers/visiblity also affected by platform components
function bringSallyDown() {
  ggbObject.setLayer("dragLineWhite", 3);
  ggbObject.setLayer("DragPoint1", 4);
  ggbObject.setLayer("DragPoint2", 4);
  ggbObject.setLayer("White1", 4);
  ggbObject.setLayer("White2", 4);
  ggbObject.setLayer("dragLine", 4);
  ggbObject.setLayer("eq1White", 5);
  ggbObject.setLayer("eq1", 6);
  ggbObject.setLayer("text1", 6);
}

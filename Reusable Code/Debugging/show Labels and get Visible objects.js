// log and/or show labels of visible objects of a certain type
var objectNames;
objectNames = ggbApplet.getAllObjectNames();
for (let i = 0, L = objectNames.length; i < L; i++) {
  if (
    ggbApplet.getVisible(objectNames[i]) === true &&
    ggbApplet.getObjectType(objectNames[i]) === "segment"
    // || ggbApplet.getObjectType(objectNames[i]) === "hexagon" ||
    // ggbApplet.getObjectType(objectNames[i]) === "pentagon" ||
    // ggbApplet.getObjectType(objectNames[i]) === "quadrilateral" ||
    // ggbApplet.getObjectType(objectNames[i]) === "triangle" // only show labels of certain object type
  ) {
    console.log(objectNames[i], " visible: ", ggbApplet.getVisible(objectNames[i]));
    ggbApplet.setLabelVisible(objectNames[i], true);
    console.log("line Style:", ggbApplet.getLineStyle(objectNames[i]));
    // ggbApplet.setColor(objectNames[i], 0, 127, 175);
  }
}

// set hidden object labels visible as well
var objectNames;
objectNames = ggbApplet.getAllObjectNames();
for (let i = 0, L = objectNames.length; i < L; i++) {
  if (ggbApplet.getVisible(objectNames[i]) === true) {
    console.log(objectNames[i], " visible: ", ggbApplet.getVisible(objectNames[i]));
  }
  ggbApplet.setLabelVisible(objectNames[i], true);
}

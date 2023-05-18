// show labels on visible objects
var objectNames;
objectNames = ggbApplet.getAllObjectNames();
for (let i = 0, L = objectNames.length; i < L; i++) {
  if (
    ggbApplet.getVisible(objectNames[i]) === true
    // && ggbApplet.getObjectType(objectNames[i]) === "polygon" // only show labels of certain object type
  ) {
    console.log(objectNames[i], " visible: ", ggbApplet.getVisible(objectNames[i]));
    ggbApplet.setLabelVisible(objectNames[i], true);
  }
}

/* 
// set hidden object labels visible as well
var objectNames;
objectNames = ggbApplet.getAllObjectNames();
for (let i = 0, L = objectNames.length; i < L; i++) {
  if (ggbApplet.getVisible(objectNames[i]) === true) {
    console.log(objectNames[i], " visible: ", ggbApplet.getVisible(objectNames[i]));
  }
  ggbApplet.setLabelVisible(objectNames[i], true);
}
 */

// when using selectedObject as a global variable, and when also using setFixed, use this work around for the deselect case
switch (a.type) {
  case "deselect":
    if (a.target) break;
    selectedObject = "";
    break;
}

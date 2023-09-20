// Example from G4M1L16

function insertButton3InTabOrder() {
  // First take ggbButton3 out of the tabOrder
  added = manageAddedList("ggbButton3", false);
  setTabOrder(initList, added, enders);

  // Convert tabOrder without ggbButton3 to a JS array
  const tabString = ggbObject.getDefinitionString("tabOrder");
  const tabNoSpaces = tabString.replaceAll(" ", "");
  // const tabArray = tabString.substr(1, tabString.length-1);
  const tabArray = tabNoSpaces.substr(1, tabNoSpaces.length - 2).split(",");

  // const indexButton3 = tabArray.indexOf("ggbButton3");
  const indexSelected = tabArray.indexOf(selectedObject);
  // const buttonComesFirst = indexButton3 < indexSelected;
  // const lowIndex = buttonComesFirst ? indexButton3 : indexSelected;
  // const maxIndex = Math.max(indexButton3, indexSelected);

  console.log(
    "ggbTabOrder",
    ggbObject.getDefinitionString("tabOrder"),
    // "tabNoSpaces",
    // tabNoSpaces,
    // "JS tabString",
    // tabString,
    "selectedObject",
    selectedObject,
    "indexSelected",
    indexSelected,
    "tabArray",
    tabArray

    // "maxIndex",
    // maxIndex
  );

  const tabArrayLastIndex = tabArray.length - 1;
  const newTabEnder = tabArray.splice(indexSelected + 1, tabArrayLastIndex);
  const newTabInit = tabArray.splice(0, indexSelected + 1);

  console.log("newTabInit", newTabInit, "newTabEnder", newTabEnder);

  const newTabArray = newTabInit.concat(["ggbButton3"], newTabEnder);
  console.log("newTabArray", newTabArray);

  ggbObject.evalCommand("tabOrder={}");
  newTabArray.forEach(function (element, index) {
    ggbObject.setListValue("tabOrder", index + 1, element);
  });
}

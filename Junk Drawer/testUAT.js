/* eslint-disable no-extra-boolean-cast */
const {
  ggb1,
  richTextEditor1,
  cc_sharewithclass_8470cb5ad686_textbox1: shareText1,
  cc_sharewithclass_8470cb5ad686_input1: shareInput1,
  cc_sharewithclass_8470cb5ad686_button1: shareButton1,
} = components;

// const readOrder = [richTextEditor1, ggb1, shareText1, shareInput1, shareButton1];

didUtils.onInit(() => {
  ggb1.instance.setValue("slide7", true);

  shareText1.updateData({ visible: false });
  shareInput1.updateData({ visible: false });
  shareButton1.updateData({ visible: false });
  // save status
  saveData({ initialized: true });
}, ggb1);

ggb1.instance.registerObjectUpdateListener("DragPoint1", showSolutions);
ggb1.instance.registerObjectUpdateListener("DragPoint2", showSolutions);
ggb1.instance.registerObjectUpdateListener("DragPoint3", showSolutions);

ggb1.instance.registerObjectUpdateListener("locked", () => {
  if (ggb1.instance.getValue("locked") === 1) {
    showSolutions();
    shareText1.updateData({ visible: true });
    shareInput1.updateData({ visible: true });
    shareButton1.updateData({ visible: true });
  }
});
showSolutions();

function showSolutions() {
  function x(pointName) {
    return round(ggb1.instance.getXcoord(pointName), 1);
  }
  function y(pointName) {
    return round(ggb1.instance.getYcoord(pointName), 1);
  }
  const point1 = `$(${x("DragPoint1")},${y("DragPoint1")})$`;
  const point2 = `$(${x("DragPoint2")},${y("DragPoint2")})$`;
  const point3 = `$(${x("DragPoint3")},${y("DragPoint3")})$`;
  const text = `Your solutions: \n\n ${point1} \n\n ${point2} \n\n ${point3}`;
  richTextEditor1.updateData({ text });
}

// RTS

const now = controls.current;
autorun(() => {
  if (controls.current !== now) {
    const { getXcoord: x, getYcoord: y } = ggb1.instance;
    const points = ["DragPoint1", "DragPoint2", "DragPoint3"];
    const sendObject = points.reduce((acc, point) => {
      acc[point] = {
        x: x(point),
        y: y(point),
        inRegion: !!ggb1.instance.getValue(`${point}InRegion`),
      };
      return acc;
    }, {});
    utils.RTS.sendData("slide-0bca97913e87", sendObject);
  }
});

// library

function saveData(dataObj = {}, target = "") {
  const allComps = Object.keys(components).sort();
  const [firstComp] = allComps;
  // const firstComp = allComps[0];
  if (!firstComp) {
    return;
  } // make sure at least 1 comp exists
  if (typeof target !== "string" || typeof dataObj !== "object") {
    console.error("saveData error: Parameters should be an object and a string!");
  }
  const tarComp = !!target ? target : firstComp;
  if (!components[tarComp]?.storage) {
    components[tarComp].storage = {};
  }
  components[tarComp].storage = { ...components[tarComp].storage, ...dataObj };
}

function getData(dataName, target = "") {
  const allComps = Object.keys(components).sort();
  const [firstComp] = allComps;
  // const firstComp = allComps[0];
  if (!firstComp) {
    return;
  } // make sure at least 1 comp exists
  if (typeof target !== "string" || typeof dataName !== "string") {
    console.error("getData error: Parameters should both be strings!");
  }
  const tarComp = !!target ? target : firstComp;
  return components[tarComp]?.storage?.[dataName];
}

function round(value, decimals) {
  return Number(Math.round(value + "e" + decimals) + "e-" + decimals);
}

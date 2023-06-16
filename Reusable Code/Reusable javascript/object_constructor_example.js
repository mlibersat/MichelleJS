// Constructors create objects based on a prototype made by the constructor

// Constructors start with a capital letter by convention
// uses new and this. in the constructor function
function Person(name) {
  this.name = name;
  this.introduceSelf = function () {
    console.log(`Hi! I'm ${this.name}.`);
  };
}

// To call Person() as a constructor, use new:
const salva = new Person("Salva");
salva.name;
salva.introduceSelf();
// "Hi! I'm Salva."

///////////////// Example from IM1M6L11

// creator function to create a new object on adding a point to a segment
// Ex obj: AddedPoint {name: "NewMdpt5", endoint1: "NewPoint3", endpoint2: "NewPoint4", poly: "polyGon1"}
function AddedPoint(name, seg) {
  this.name = name;
  this.endpoint1 = getEndpointArrayFromSegName(seg)[0];
  this.endpoint2 = getEndpointArrayFromSegName(seg)[1];
  this.poly = getPolyNameFromSegName(seg);
}
function makeAddedPointObj(pt, seg) {
  addedCoutner++;
  const added = new AddedPoint(pt, seg);
  addedPtObjArray.push(added);
  // console.log("addedPtObjArray", addedPtObjArray);
}

// Ex: called in click of segment
makeAddedPointObj(newPointName, newSegmentName);

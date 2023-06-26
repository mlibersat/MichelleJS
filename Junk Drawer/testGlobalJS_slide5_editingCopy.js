function ggbOnInit(name, ggbObject) {
  loadUtils().then(function (setupGGB) {
    const buttonClicks = defineButtonClickScripts();
    // you may replace the following function call with the name of your status text object as a string
    // if you do, you can delete the function defineStatusName
    const statusName = defineStatusName();
    const {
      getCanvas,
      setAriaLabel,
      readKeyboardInstructions,
      updateKeyboardInstructions,
      ggbReadText,
      enableButton,
      libClientFunction,
      libClickFunction,
      libKeyFunction,
      registerSafeObjectUpdateListener,
      registerSafeObjectClickListener,
      registerHoverListener,
      unavailableButtonText,
      setTabOrder,
      manageAddedList,
    } = setupGGB({
      name,
      ggbObject,
      defineKeyboardInstructions,
      buttonClicks,
      statusName,
    });
    const ggbcanvas = getCanvas(name);

    /*
     * IGNORE above
     * EDIT below
     */

    setAriaLabel(ggbcanvas, "Aral Sea Interactive");

    function defineStatusName() {
      return "AAppletStatus";
    }

    let click = 0;
    // let mdptCounter = 0;
    let tempPointsArray = [];
    let Length = 0;
    let selectedObject = "";
    const createdPolys = [];
    // const createdWhitePolys = [];
    let allPolyPoints = [];
    let activePoly = "";
    let activePolyPointsArray = [];
    let activePolySegsArray = [];
    let polysToDelete = [];
    let allPolySegsArray = [];
    const separatePolySegsArrays = [];
    // let allWhitePolySegs = [];
    const separateWhitePolySegs = [];
    let tempMdpt = "";
    let selectOptionToolActive;
    let createPolysToolActive;
    let editVertsToolActive;
    let addVertsToolActive;
    let deletePolysToolActive;
    let nonActiveFirstPolys = [];
    let nonActiveLastPolys = [];
    const initList = " polygonTools, Stamp";
    let addedList = "";
    const enders = "ggbButton1, ggbButton2, ggbButton3, showGrid, showAxes, showArea, view";

    let polyCreatedString = "";
    const allPolyCreatedStringsArray = [];
    let whitePolyCreatedString = "";
    const allWhitePolyCreatedStringsArray = [];

    const whitePolyLayer = 2;
    const whitePointLayer = 2;
    const polyLayer = 3;
    const segLayer = 3;
    const pointLayer = 4;

    const pointSizeSmall = 4;
    const whitePointSizeSmall = 5;
    const pointSizeBig = 6;
    const whitePointSizeBig = 7;
    const regLineThickness = 5;
    const whiteLineThickness = 8;
    const hoverLineThickness = 10;
    let segmentHoverActivated = false;
    let hoverSeg = "";
    let spaceFlag = false;
    let addedCoutner = 0;
    const addedPtObjArray = [];

    ///////// Immediately Invoked Code///////////////

    if (ggbObject.getValue("Length(tabOrder)") === 0) {
      setTabOrder(initList, addedList, enders);
    }
    defineToolNum();

    /////////// Standard Listeners ///////////

    ggbObject.registerClientListener(function (a) {
      clientFunction(a);
      libClientFunction(a);
    });
    ggbObject.registerClickListener(function (a) {
      clickListenerFunction(a);
      libClickFunction(a);
    });
    ggbcanvas.addEventListener("keyup", function (event) {
      keyit(event);
      libKeyFunction(event);
    });

    /////////// Custom Listeners ///////////////

    registerHoverListener(hoverFunction()); // This register hover listener seems to make me call a function
    registerSafeObjectUpdateListener("Follow", function () {
      // Can I register and deregister the obj listener in manageToolChange instead?
      if (addVertsToolActive) {
        if (ggbObject.getValue("followInDropZone") === 1) {
          segmentHoverActivated = true;
          // updateAllPolySegsArray();
          segmentHover();
        } else {
          segmentHoverActivated = false;
        }
      }
    });

    ///////////// Custom Functions ///////////////

    function defineToolNum() {
      const toolNum = ggbObject.getValue("toolNum");
      const selectOptionToolNum = 0;
      const createPolysToolNum = 1;
      const editVertsToolNum = 2;
      const addVertsToolNum = 3;
      const deletePolysToolNum = 4;
      selectOptionToolActive = toolNum === selectOptionToolNum;
      createPolysToolActive = toolNum === createPolysToolNum;
      editVertsToolActive = toolNum === editVertsToolNum;
      addVertsToolActive = toolNum === addVertsToolNum;
      deletePolysToolActive = toolNum === deletePolysToolNum;
      if (selectOptionToolActive) {
        console.log("selectOptionToolActive");
      }
      if (createPolysToolActive) {
        console.log("createPolysToolActive");
      }
      if (editVertsToolActive) {
        console.log("editVertsToolActive");
      }
      if (addVertsToolActive) {
        console.log("addVertsToolActive");
      }
      if (deletePolysToolActive) {
        console.log("deletePolysToolActive");
      }
    }

    function makePoints() {
      console.log("in makePoints function");
      click++;
      const stampX = ggbObject.getXcoord("Stamp");
      const stampY = ggbObject.getYcoord("Stamp");
      // console.log("Stamp is at%o, %o, at click # %o", stampX, stampY, click);
      let newPointName = "NewPoint".concat(click);

      // If creating points on add verts tool
      if (addVertsToolActive) {
        // When add verts Tool is Active, create points at midpoints of segments (when space is pressed) and add points on mousedown when the segment hover is active
        // Ex name: "NewMdpt3"
        newPointName = "NewMdpt".concat(click);

        // If students are creating points from pressing space on a segment, drop a point at the midpoint
        if (spaceFlag) {
          ggbObject.evalCommand(newPointName.concat("=(", stampX, ",", stampY, ")"));
          makeAddedPointObj(newPointName, selectedObject);
        } else {
          // --------------------------- COME BACK TO THIS------------------Add midpoint on seg, not anywhere on seg
          /*  // If students are creating points on mouseDown, drop a point at the closest location of their mouse to the active segment. Note: Make a temp point with closest point, then place a point on the segment and set its coords to the temp point coords (prevents point jumping as Stamp changes later).
          const tempPointOnSeg = ggbObject.evalCommandGetLabels("=ClosestPoint(".concat(hoverSeg, ", Stamp)"));
          ggbObject.evalCommand(newPointName.concat("=Point(", hoverSeg, ")"));
          ggbObject.setCoords(newPointName, ggbObject.getXcoord(tempPointOnSeg), ggbObject.getYcoord(tempPointOnSeg));
          ggbObject.deleteObject(tempPointOnSeg);
          // console.log(
          //   "in makePoints - hoverSeg:",
          //   hoverSeg,
          //   ", newMdpt:",
          //   newPointName
          // );
          makeAddedPointObj(newPointName, hoverSeg); */
        }
        ggbObject.setColor(newPointName, 0, 0, 0);
      }
      // If creating points on create Poly tool
      else {
        newPointName = "NewPoint".concat(click);
        ggbObject.evalCommand(newPointName.concat("=(", stampX, ",", stampY, ")"));
      }

      const newWhitePointName = newPointName.concat("White");

      ggbObject.evalCommand(newWhitePointName.concat("=", newPointName, ""));

      ggbObject.setPointSize(newPointName, pointSizeSmall);

      ggbObject.setPointSize(newWhitePointName, whitePointSizeSmall);
      ggbObject.setColor(newWhitePointName, 255, 255, 255);
      ggbObject.setLayer(newPointName, pointLayer);
      ggbObject.setLayer(newWhitePointName, whitePointLayer);
      ggbObject.setFixed(newPointName, false, false);
      ggbObject.setFixed(newWhitePointName, false, false);

      tempPointsArray.push(newPointName);
      // console.log("tempPointsArray", tempPointsArray);

      // If points are added on a midpoint by clicking a segment, don't set the increment now. Set it later after the point is reconfigured as a vertex of the polygon
      if (!addVertsToolActive) {
        setIncrement(newPointName);
      }
      Length = tempPointsArray.length;
      enableDisableButton();

      console.log("END tempPointsArray: ", tempPointsArray);
      console.log("END MakePoint, point name: ", newPointName);
    }

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

    function styleDeletePoly(obj) {
      // mark poly for deletion
      // console.log("polysToDelete Before:", polysToDelete);
      if (!polysToDelete.includes(obj)) {
        ggbObject.evalCommand("SetDecoration(" + obj + ", 1)");
        ggbObject.setFilling(obj.concat("White"), 1);
        polysToDelete.push(obj);
        enableButton(2, true);
      } else {
        ggbObject.evalCommand("SetDecoration(" + obj + ", 0)");
        ggbObject.setFilling(obj.concat("White"), 0.7);

        polysToDelete = polysToDelete.filter(function (el) {
          return el !== obj;
        });
      }
      if (polysToDelete.length === 0) {
        enableButton(2, false);
      }
      // console.log("polysToDelete >>>After:", polysToDelete);
    }

    function addMidpointToSeg(seg) {
      // create point at midpoint (tempMdpt is defined on select of the segment)
      const xTempMdpt = ggbObject.getXcoord(tempMdpt);
      const yTempMdpt = ggbObject.getYcoord(tempMdpt);
      ggbObject.setCoords("Stamp", xTempMdpt, yTempMdpt);

      let pointAlreadyThere = false;
      let midptToDelete = "";

      for (let i = 0, L = tempPointsArray.length; i < L; i++) {
        const el = tempPointsArray[i];
        if (xTempMdpt === ggbObject.getXcoord(el) && yTempMdpt === ggbObject.getYcoord(el)) {
          midptToDelete = el;
          pointAlreadyThere = true;
          break;
        }
        showMidpoint;
      }

      // If a midpont is already on the seg, delete it, otherside make a midpoint on the seg
      if (!pointAlreadyThere) {
        makePoints();
      } else {
        const newTemp = tempPointsArray.filter(function (el) {
          return !(el === midptToDelete);
        });
        ggbObject.deleteObject(midptToDelete);

        // remove the "deleted" temp mdpt from addedPtObjArray
        addedPtObjArray.forEach(function (obj, index) {
          if (obj.name === midptToDelete) {
            addedPtObjArray.splice(index, 1);
          }
        });

        // remove the "deleted" temp mdpt from allPolyCreatedStrings
        allPolyCreatedStringsArray.forEach(function (element, index) {
          if (element.includes(midptToDelete.concat(","))) {
            allPolyCreatedStringsArray.splice(index, 1);
          }
        });

        tempPointsArray = [...newTemp];
      }

      enableDisableAddButton();
    }

    function enableDisableAddButton() {
      // console.log("tempPointsArray.length", tempPointsArray.length);

      const numPts = tempPointsArray.length;
      // console.log("numPts", numPts);
      if (numPts >= 1) {
        enableButton(3, true);
      } else if (numPts < 1) {
        enableButton(3, false);
      }
      // console.warn("End Enable/Disable button. ", numPts >= 1);
    }

    function makePoly() {
      // console.log("in makePoly ");
      // console.log(
      //   "in makePoly - tabOrder",
      //   ggbObject.getDefinitionString("tabOrder")
      // );
      // console.log("addedList", addedList);
      // console.log("tempPointsArray", tempPointsArray);
      const createdPolysNum = createdPolys.length;
      const createdWhitePolysNum = createdPolys.length;
      const newPolyName = "polyGon".concat(createdPolysNum + 1);
      const newWhitePolyName = "polyGon".concat(createdWhitePolysNum + 1, "White");

      // reorder points to make sides non-intersecting
      const points = tempPointsArray.map(function (el) {
        return {
          x: ggbObject.getXcoord(el),
          y: ggbObject.getYcoord(el),
          name: el,
        };
      });

      // Get the center (mean value) using reduce
      const center = points.reduce(
        function (acc, { x, y, name }) {
          // acc.x = (acc.x + x) / points.length;
          acc.x += x / points.length;
          acc.y += y / points.length;
          return acc;
        },
        {
          x: 0,
          y: 0,
        }
      );

      // Add an angle property to each point using tan(angle) = y/x
      const angles = points.map(function (_ref2) {
        const x = _ref2.x,
          y = _ref2.y,
          name = _ref2.name;
        return {
          x: x,
          y: y,
          angle: (Math.atan2(y - center.y, x - center.x) * 180) / Math.PI,
          name: name,
        };
      });

      // Sort your points by angle
      const pointsSorted = angles.sort(function (a, b) {
        return a.angle - b.angle;
      });
      // console.log("tempPointsArraySorted", pointsSorted);

      function getFields(input, field) {
        const output = [];
        for (let i = 0, L = input.length; i < L; ++i) output.push(input[i][field]);
        return output;
      }

      tempPointsArray = getFields(pointsSorted, "name");
      // console.log("tempPointsArray", tempPointsArray);
      // console.log("in Make Polys polyCreatedString");
      // create the poly with non-intersecting sides using the new order of points in tempPointsArray

      polyCreatedString = ggbObject.evalCommandGetLabels(newPolyName.concat("=Polygon(", tempPointsArray, ")"));
      // console.log("polyCreatedString", polyCreatedString);
      allPolyCreatedStringsArray.push(polyCreatedString);
      // console.log("allPolyCreatedStringsArray", allPolyCreatedStringsArray);
      createdPolys.push(newPolyName);
      // console.log("createdPolys", createdPolys);

      // createdPolys.push(ggbObject.evalCommandGetLabels(newPolyName.concat("=Polygon({", tempPointsArray, "})")));
      // console.log("created polys", createdPolys);

      // create polys in GGB

      whitePolyCreatedString = ggbObject.evalCommandGetLabels(
        newWhitePolyName.concat("=Polygon({", tempPointsArray, "})")
      );
      allWhitePolyCreatedStringsArray.push(whitePolyCreatedString);
      // console.log("allWhitePolyCreatedStringsArray", allWhitePolyCreatedStringsArray);

      // createdWhitePolys.push(newWhitePolyName);

      setLineOpacity(newPolyName);
      ggbObject.setLayer(newPolyName, polyLayer);
      ggbObject.setColor(newPolyName, 0, 127, 175);
      ggbObject.setFilling(newPolyName, 0.35);
      ggbObject.setFixed(newPolyName, false, false);
      // console.log("poly created in GGB");

      // create white polys
      setLineOpacity(newWhitePolyName);
      ggbObject.setLayer(newWhitePolyName, whitePolyLayer);
      ggbObject.setColor(newWhitePolyName, 255, 255, 255);
      ggbObject.setFixed(newWhitePolyName, false, false);
      ggbObject.setLineThickness(newWhitePolyName, whiteLineThickness);

      tempPointsArray = [];

      // console.log("addedList before manageAdded", addedList);
      addedList = manageAddedList(newPolyName, true); // add the polys to the tab order, but they remain nonselectable until tool drop down is on edit or delete
      // console.log("addedList after manageAdded", addedList);

      setTabOrder(initList, addedList, enders);

      formatAllSegs();
    }

    //Note: White poly segs are not separate GGB objects. White polys are formatted when they are created.
    function formatAllSegs() {
      const selectableBool = addVertsToolActive;

      updateAllPolySegsArray();
      allPolySegsArray.forEach(function (seg) {
        // console.log("each seg:", seg);
        ggbObject.setColor(seg, 0, 127, 175);
        ggbObject.setFixed(seg, false, selectableBool);
        ggbObject.setLineThickness(seg, regLineThickness);
        ggbObject.setLayer(seg, segLayer);
      });
      // allPolySegsArray.forEach(function (array) {
      //   array.forEach(function (seg) {
      //     console.log("each seg:", seg);
      //     ggbObject.setColor(seg, 0, 127, 175);
      //     ggbObject.setFixed(seg, false, selectableBool);
      //     ggbObject.setLineThickness(seg, regLineThickness);
      //     ggbObject.setLayer(seg, segLayer);
      //   });
      // });
    }

    // // Note: Segments created by makePoly() are automatically named by GGB as "newpoint1","newpoint2", etc.
    // // Note2: Segment are named according to which point they are being drawn TO.
    // // Note3: Segments are also made in the addVerts step on click of Add button. (These segments are named with lowercase letters, ex: g, h, i)
    function updateAllPolySegsArray() {
      // console.log("updateAllPolySegsArray");
      allPolySegsArray = [];
      let newArray = [];
      const createdWhitePolys = [];
      createdPolys.forEach(function (element) {
        newArray = [...getSegsArrayFromPolyName(element)];
        createdWhitePolys.push(element.concat("White"));
        newArray.forEach(function (segElement) {
          allPolySegsArray.push(segElement);
        });
      });
      // console.log("createdWhitePolys", createdWhitePolys);
      // console.log("END updateAllPolySegsArray ", allPolySegsArray);
    }

    // Detect active polygon, make all points associated with the polygon big and all others small. (all are selectable but not all in tab cycle)
    // Called on: space press of poly, on mouseDown of point or poly, and on click of point or poly
    function detectAndStyleActivePolyPoints(obj) {
      // console.log("in detectAndStyleActivePolyPOINTS");
      const pointSelected = ggbObject.getObjectType(obj) === "point";
      const polySelected = createdPolys.includes(obj);

      let polyDefString = "";

      // console.log("call makeAllPolyPointsSmall");
      makeAllPolyPointsSmall(editVertsToolActive); // editVertsToolActive bool is passed so that points are selectable only if Edit Verts Tool is active (not add Verts tool)

      // if a poly is selected, detect its vertices
      if (polySelected || pointSelected) {
        // define the active poly when a poly is selected or when a point on the poly is selected
        if (pointSelected) {
          createdPolys.forEach(function (element) {
            polyDefString = ggbObject.getDefinitionString(element);
            if (polyDefString.includes(obj)) {
              activePoly = element;
            }
          });
        } else {
          activePoly = obj;
        }

        activePolyPointsArray = getPointsArrayFromPolyName(activePoly);
        // console.log(
        //   "in detectAndStylePOINTS - activePolyPointsArray (make only these active points visible and small, rest hidden - make sure this includes MdPt pts.)",
        //   activePolyPointsArray
        // );
        // Edit Vertices Tool: make the active points big, all points are visible (stay small)
        if (editVertsToolActive) {
          activePolyPointsArray.forEach(function (element) {
            ggbObject.setFixed(element, false, true);
            ggbObject.setPointSize(element, pointSizeBig);
            ggbObject.setPointSize(element.concat("White"), whitePointSizeBig);
          });
        } else if (addVertsToolActive) {
          updateAllPolyPointsArray();
          // Add Verts Tool: Temporarily make all points hidden
          allPolyPoints.forEach(function (element) {
            if (!element.includes("Mdpt") && ggbObject.getColor(element) !== "#000000") {
              ggbObject.setVisible(element, false);
              ggbObject.setVisible(element.concat("White"), false);
              ggbObject.setFixed(element, true, false);
            }
          });

          // Add Verts Tool: Make active vertices visible but small and nonselectable.
          activePolyPointsArray.forEach(function (element) {
            ggbObject.setVisible(element, true);
            ggbObject.setVisible(element.concat("White"), true);
            // ggbObject.setFixed(element, false, false);
          });
          // console.log("poly points non-selectable");
        }
      }
      // console.log("END detectAndStyleActivePolyPOINTS");
    }

    //
    function updateAllPolyPointsArray() {
      const unfilteredGGBPoints = ggbObject.getAllObjectNames("point");

      // filter out anything that doesn't contain "NewPoint"/"NewMdpt" and anything that does contain "White"
      allPolyPoints = unfilteredGGBPoints.filter(function (el) {
        return (el.includes("NewPoint") || el.includes("NewMdpt")) && !el.includes("White");
      });
      // console.log("END updateAllPolyPointsArray", allPolyPoints);
    }

    // Makes all poly points small. Pass a bool for whether or not to make points selectable
    function makeAllPolyPointsSmall(selectableBool) {
      updateAllPolyPointsArray();
      // console.log("in makeAllPolyPointsSmall, selectableBool", selectableBool);
      allPolyPoints.forEach(function (element) {
        ggbObject.setFixed(element, false, selectableBool);
        ggbObject.setPointSize(element, pointSizeSmall);
        ggbObject.setPointSize(element.concat("White"), whitePointSizeSmall);
        // if(ggbObject.getColor(element)!== "#007FAF"){ggbObject.setColor(element, 0, 127, 175)}
      });
    }

    // detect active polygon, make all segments associated with the polygon thick and all others regular. (all are selectable but not all in tab cycle)
    // Called on: space press of poly, on mouseDown of seg or poly, and on click of seg or poly
    function detectAndStyleActivePolySegs(obj) {
      // console.log("in detectAndStyleActivePolySEGS");
      const segSelected = ggbObject.getObjectType(obj) === "segment";
      const polySelected = createdPolys.includes(obj);

      let polyDefString = "";

      makeSegsSelectable(false);

      // if a poly is clicked, make its vertices visible
      if (polySelected || segSelected) {
        if (segSelected) {
          const truncSegName = obj.substring(3, obj.length);
          // console.log("trunc seg name:", truncSegName);
          createdPolys.forEach(function (element) {
            polyDefString = ggbObject.getDefinitionString(element);
            // console.log("In segSelected of detectAndStyle - Poly def string", ggbObject.getDefinitionString(element));
            if (polyDefString.includes(truncSegName)) {
              activePoly = element;
            }
          });
        } else {
          activePoly = obj;
        }

        // console.log("call getSegsArray - from detectAndStyle");
        activePolySegsArray = getSegsArrayFromPolyName(activePoly);
        // console.log("activePolySegsArray", activePolySegsArray);
        // console.log("activePolyPointsArray", activePolyPointsArray);

        activePolyPointsArray.forEach(function (element) {
          ggbObject.setFixed(element, true, false);
        });

        activePolySegsArray.forEach(function (element) {
          ggbObject.setFixed(element, true, true);
        });
        // console.log("set segments fixed and selectable");
      }
      // console.log("end detectAndStyleActivePolySEGS");
    }

    function makeSegsSelectable(selectableBool) {
      // console.log("in makeSegsSelectable");
      allPolySegsArray.forEach(function (element) {
        ggbObject.setVisible(element, true);
        ggbObject.setFixed(element, false, selectableBool);
      });
      // console.log("END makeSegsSelectable, selectablebool:", selectableBool);
    }

    function getEndpointArrayFromSegName(seg) {
      // console.log("in getEndpointArrayFromSegName");
      const segDefString = ggbObject.getDefinitionString(seg);
      const segEndpointString = segDefString.substring(8, segDefString.length);
      // console.log(
      //   "end getEndpointArrayFromSegName, return:",
      //   segEndpointString.split(", ")
      // );
      return segEndpointString.split(", ");
    }

    function getPointsArrayFromPolyName(poly) {
      // console.log("in getPointsArrayFromPolyName");

      const polyDefString = ggbObject.getDefinitionString(poly);
      const polyPointsString = polyDefString.substring(8, polyDefString.length);
      // const polyPointsString = polyDefString.substring(9, polyDefString.length - 1);
      // console.log(
      //   "end getPointsArrayFromPolyName, return:",
      //   polyPointsString.split(", ")
      // );

      return polyPointsString.split(", ");
    }

    function getPolyNameFromSegName(seg) {
      let polyStr = "";
      createdPolys.forEach(function (poly) {
        // let currentPolyCreatedString = "";

        allPolyCreatedStringsArray.forEach(function (str) {
          // console.warn("allPolyCreatedStringsArray", allPolyCreatedStringsArray, ".   segment passed", seg);
          const currentPolyCreatedString = str;
          const array = currentPolyCreatedString.split(",");
          if (array.includes(seg)) {
            console.log("currentPolyCreatedString", currentPolyCreatedString);
            console.log("current array", array);
            polyStr = array.shift().toString(); // mutates array (array no longer contains the polyGon1 element)
          }
        });
      });
      // console.log("end getPolyNameFromSegName:", polyStr);
      if (polyStr === "") {
        console.error("in getPolyNameFromSegName. Cannot detect polygon.");
      } else {
        console.log("polyStr", polyStr);
      }
      return polyStr;
    }

    function getSegsArrayFromPolyName(poly) {
      // console.log("in getSegsArrayFromPolyName");
      // console.log("allPolyCreatedStrings,", allPolyCreatedStringsArray);
      let currentPolyCreatedStringStr = "";
      allPolyCreatedStringsArray.forEach(function (element) {
        if (element.includes(poly.concat(","))) {
          currentPolyCreatedStringStr = element;
          // console.log(
          //   "currentPolyCreatedStringString",
          //   currentPolyCreatedStringStr
          // );
        }
      });

      const array = currentPolyCreatedStringStr.split(",");
      array.shift(); // mutates array (array no longer contains the polyGon1 element)
      // console.log("end getSEGSArrayFromPolyName:", array);
      return array;
    }

    function manageToolChange() {
      // console.log("in manageToolChange");
      enableButton(1, false);
      enableButton(2, false);
      enableButton(3, false);
      // console.log("polyGon1 exists", ggbObject.exists("polyGon1"));

      // console.log("tabOrder in manageToolChange", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);

      defineToolNum();

      let selectableOrNot = false;

      if (!editVertsToolActive) {
        // console.log("in manageToolChange - not editsVertTool");

        makeAllPolyPointsSmall(false); // selectableBool == false
        // updateAllPolyPointsArray();
        allPolyPoints.forEach(function (element) {
          ggbObject.setFixed(element, false, false);
        });
      }
      // console.log("1. polyGon1 exists", ggbObject.exists("polyGon1"));

      const allPoints = ggbObject.getAllObjectNames("point");
      // When the tool is changed away from delete polys, reset the shading of any polys that may have been marked for deletion & show poly points again
      if (!deletePolysToolActive) {
        // console.log("in manageToolChange - not deletePolysTool");

        polysToDelete.forEach(function (element) {
          ggbObject.evalCommand("SetDecoration(" + element + ", 0)");
        });
        polysToDelete = [];

        allPoints.forEach(function (element) {
          if (element.includes("NewPoint") || element.includes("Mdpt")) {
            ggbObject.setVisible(element, true);
          }
        });
      }

      if (addVertsToolActive || deletePolysToolActive) {
        allPoints.forEach(function (element) {
          // console.log("in manageToolChange - hidePolyPoints");

          // console.log("point element", element);
          if (element.includes("NewPoint") || element.includes("Mdpt")) {
            // hide poly points when add Verts or delete Polys is chosen
            ggbObject.setVisible(element, false);
          }
        });

        formatAllSegs();
      }

      // format segments when changing to and from AddVerts Tool
      if (addVertsToolActive) {
        // console.log("in manageToolChange - addVertsToolActive");
        // Stamp is at it's previous location. Move Stamp off the dropZone so that a point is not inadvertantly created at this last location
        ggbObject.setCoords("Stamp", ggbObject.getXcoord("corner2") + 15, ggbObject.getYcoord("corner2") - 15);
        ggbObject.setValue("showFollow", true);
      } else {
        // console.log("addVertsTool is Inactive");
        ggbObject.setValue("showFollow", false);
      }

      // console.log("2. polyGon1 exists", ggbObject.exists("polyGon1"));
      // console.log("tempPointsArray", tempPointsArray);

      // When the tool is changed away from create polys, delete any stray points that may have been created and not made into a poly and disable create button.
      if (!createPolysToolActive) {
        // console.log("in manageToolChange - not createPolyTool");
        enableButton(1, false);

        selectableOrNot = selectOptionToolActive ? false : true;
        // console.log("tempPointsArray before", tempPointsArray);
        // console.log("tabOrder before", ggbObject.getDefinitionString("tabOrder"));
        // console.log(">>>> tempPointsArray AFTER", tempPointsArray);
        // console.log(">>>> tabOrder AFTER", ggbObject.getDefinitionString("tabOrder"));

        // reset tempPoints array to clear any any unused create poly points or add verts points.
        if (tempPointsArray.length !== 0) {
          tempPointsArray.forEach(function (element) {
            ggbObject.deleteObject(element);
            ggbObject.deleteObject(element + "White");
          });
          tempPointsArray = [];
        }
      }

      // console.log("3. polyGon1 exists", ggbObject.exists("polyGon1"));

      // console.log("createdPolys", createdPolys);

      createdPolys.forEach(function (element) {
        // console.log(
        //   "in manageToolChange - setFixed,",
        //   element,
        //   selectableOrNot
        // );
        ggbObject.setFixed(element, true, selectableOrNot); // make the poly selectable if toolNum 2 or 3, otherwise nonselectable
      });
      // console.log("tabOrder --END-- manageToolChange", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);
      // console.log("end manageToolChange");
      // console.log("polyGon1 exists", ggbObject.exists("polyGon1"));
    }

    // function formatAllSegs() {
    //   console.warn("in formatAllSegs");
    //   const selectableBool = addVertsToolActive ? true : false;

    //   updateAllPolySegsArray();
    //   allPolySegsArray.forEach(function (element) {
    //     ggbObject.setLineThickness(element, regLineThickness);
    //     ggbObject.setLayer(element, segLayer);
    //     ggbObject.setFixed(element, false, selectableBool);
    //   });

    //   // const allWhiteSegs = ggbObject.getAllObjectNames("segment").filter(function (el) {
    //   //   return ggbObject.getColor(el) === "#FFFFFF";
    //   // });
    //   // // console.log("allWhiteSegs", allWhiteSegs);
    //   // allWhiteSegs.forEach(function (element) {
    //   //   ggbObject.setLayer(element, whiteSegLayer);
    //   //   ggbObject.setFixed(element, false, false);
    //   // });
    // }

    function manageTabOrderOnClick(obj) {
      // console.log("in manageTabOrderOnClick - tabOrder", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);
      const sortedPolys = detectVisiblePolys();
      // Find the "first" nonActive polys (a.k.a.the poly(s) in the tabcycle that come before the active poly)
      nonActiveFirstPolys = sortedPolys.filter(function (el, index) {
        const activeIndex = sortedPolys.indexOf(activePoly);
        return !activePoly.includes(el) && index < activeIndex;
      });
      // console.log("nonActiveFirstPolys", nonActiveFirstPolys);
      // Find the "last" active poly (a.k.a.the poly(s) in the tabcycle that come after the active poly)
      nonActiveLastPolys = sortedPolys.filter(function (el, index) {
        const activeIndex = sortedPolys.indexOf(activePoly);
        return !activePoly.includes(el) && index > activeIndex;
      });
      // console.log("nonActiveLastPolys", nonActiveLastPolys);

      // >>>>>>> Added List (0 of 4) - resetAddedList <<<<<<<<
      // addedList = "";
      ggbObject.setTextValue("addedList", "");
      setTabOrder(initList, addedList, enders);

      // >>>>>>>> Added List (1 of 4) - - nonActive "first" polys <<<<<<<<
      nonActiveFirstPolys.forEach(function (element) {
        addedList = manageAddedList(element, true); // put nonactive first polys back in the tab order
      });

      // >>>>>>>> Added List (2 of 4) - activePoly <<<<<<<<
      addedList = manageAddedList(activePoly, true); // put nonactive first polys back in the tab order

      // >>>>>>>> Added List (3(a) of 4) - active points <<<<<<<<
      // only add points to tabOrder if "Edit Vertices" is selected
      if (editVertsToolActive) {
        // console.log("in manageToolChange - editVertsToolActive");
        // const allPoints = ggbObject.getAllObjectNames("point");
        // // filter out anything that doesn't contain "NewPoint" and anything that does contain "White"
        // console.log("activePolyPointsArray", activePolyPointsArray);
        activePolyPointsArray.forEach(function (element) {
          addedList = manageAddedList(element, true);
        });
      }

      // >>>>>>>> Added List (3(b) of 4) - active segments <<<<<<<<
      // only add segments to tabOrder if "Add Vertices" is selected
      if (addVertsToolActive) {
        updateAllPolySegsArray();
        // console.log("activePolySegsArray", activePolySegsArray);
        activePolySegsArray.forEach(function (element) {
          addedList = manageAddedList(element, true);
        });
      }

      // >>>>>>>>  Added List (4 of 4) - nonActive "last" polys <<<<<<<<
      nonActiveLastPolys.forEach(function (element) {
        addedList = manageAddedList(element, true); // put nonactive polys back in the tab order after active poly points
      });
      // console.log("addedList", addedList);
      setTabOrder(initList, addedList, enders);
      // console.log("end of manageTabOrderOnClick - tabOrder AFTER", ggbObject.getDefinitionString("tabOrder"));
    }

    function deletePolygons() {
      // console.log("DELETE POLYS");
      // console.log("tabOrder before", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);

      let pointsToDelete = [];
      polysToDelete.forEach(function (element) {
        pointsToDelete = pointsToDelete.concat(getPointsArrayFromPolyName(element));
      });
      // console.log("pointsToDelete", pointsToDelete);

      polysToDelete.forEach(function (element) {
        addedList = manageAddedList(element, false);
        setTabOrder(initList, addedList, enders);
        ggbObject.deleteObject(element);
        ggbObject.deleteObject(element + "White");
      });

      polysToDelete = [];
      // console.log("tabOrder afterDelete Polys", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);

      pointsToDelete.forEach(function (el) {
        // console.log("el", el);
        // addedList = manageAddedList(el, false);
        // setTabOrder(initList, addedList, enders);
        ggbObject.deleteObject(el);
        ggbObject.deleteObject(el + "White");
      });
      // console.log("tabOrder afterDelete Points", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);

      pointsToDelete = [];
      // console.log("End deletePolygons function - createdPolys:", createdPolys);
    }

    function segmentHover() {
      const distances = [];
      allPolySegsArray.forEach(function (element) {
        ggbObject.setLineThickness(element, regLineThickness);
        ggbObject.evalCommand("dist = Distance(Follow," + element + ")");
        const dist = ggbObject.getValue("dist");
        distances.push(dist);
      });

      const min = Math.min.apply(null, distances);
      if (min < 1) {
        const indexMin = distances.indexOf(min);

        ggbObject.setLineThickness(allPolySegsArray[indexMin], hoverLineThickness);
        hoverSeg = allPolySegsArray[indexMin];
      } else {
        hoverSeg = "";
      }
    }

    function addVerticesToPoly() {
      // console.clear();
      console.warn("in addVerticesToPoly!!!!!!!!!!!!!!!!!!!!!");
      // capture the old points array before any points are added to the array

      createdPolys.forEach(function (poly) {
        //    for each obj in addedPtObjArray, if obj.poly === poly, run the function that inserts the new point inside the points string. Update the points string after each insertion. At the end (for that poly), run the eval command.. Repeat for other polys.

        const oldPointsArray = [...getPointsArrayFromPolyName(poly)];
        const lastPointInPoly = oldPointsArray[oldPointsArray.length - 1]; // Note: 1 is subtracted from length since length is counted starting with 1, but index starts at 0
        console.log("last point in poly", lastPointInPoly);

        let newPointString = "";
        // take the starting "oldPointsArray", make a new array that can be altered to insert points in the correct place
        const newPointsArray = [...oldPointsArray];
        console.log("current newPointsArray", newPointsArray);
        console.log("addedPtObjArray", addedPtObjArray);

        addedPtObjArray.forEach(function (obj) {
          // console.warn("beginning newPointsArray:", newPointsArray);
          if (!newPointsArray.includes(obj.name) && poly === obj.poly) {
            // Add the first point (obj.name) where it goes, capture the new array.
            // Start with the new array, add the next point, capture the newest array.
            // repeat with each obj.name
            const endpt1 = obj.endpoint1;
            const endpt2 = obj.endpoint2;
            const endpt1Index = newPointsArray.indexOf(endpt1);
            const endpt2Index = newPointsArray.indexOf(endpt2);

            // if mdpt was added on the last segment of the polygon, add the point after the hightest index. Otherwise, add the midpoint to the lowest index
            // const maxIndex = Math.max(endpt1Index, endpt2Index);
            const minIndex = Math.min(endpt1Index, endpt2Index);
            console.log("Here 1, endpoints: ", endpt1, ">>>>", obj.name, "<<<<", endpt2);

            let indexToAddPt = 0;
            if (endpt1 === lastPointInPoly) {
              indexToAddPt = endpt1Index + 1;
            } else if (endpt2 === lastPointInPoly) {
              indexToAddPt = endpt2Index;
            } else {
              indexToAddPt = minIndex + 1;
            }

            console.warn(
              "endpt1islast?",
              endpt1 === lastPointInPoly,
              "endpt2isLast?",
              endpt2 === lastPointInPoly,
              "indexToAddPt",
              indexToAddPt
            );

            // console.warn([obj.name, endpt1, endpt1Index, endpt2, endpt2Index, indexToAddPt]);

            newPointsArray.splice(indexToAddPt, 0, obj.name);
            console.log("CURRENT newPointsArray", newPointsArray);

            ggbObject.setColor(obj.name, 0, 127, 175);
            ggbObject.setPointSize(obj.name, pointSizeSmall);
          }
          // // console.warn("beginning newPointsArray:", newPointsArray);
          // if (poly === obj.poly) {
          //   // Add the first point (obj.name) where it goes, capture the new array.
          //   // Start with the new array, add the next point, capture the newest array.
          //   // repeat with each obj.name
          //   const endpt1 = obj.endpoint1;
          //   const endpt2 = obj.endpoint2;
          //   const endpt1Index = newPointsArray.indexOf(endpt1);
          //   const endpt2Index = newPointsArray.indexOf(endpt2);

          //   // if mdpt was added on the last segment of the polygon, add the point after the hightest index. Otherwise, add the midpoint to the lowest index
          //   // const maxIndex = Math.max(endpt1Index, endpt2Index);
          //   const minIndex = Math.min(endpt1Index, endpt2Index);
          //   console.log("Here 1, endpoints: ", endpt1, ">>>>", obj.name, "<<<<", endpt2);

          //   let indexToAddPt = 0;
          //   if (endpt1 === lastPointInPoly) {
          //     indexToAddPt = endpt1Index + 1;
          //   } else if (endpt2 === lastPointInPoly) {
          //     indexToAddPt = endpt2Index;
          //   } else {
          //     indexToAddPt = minIndex + 1;
          //   }

          //   console.warn(
          //     "endpt1islast?",
          //     endpt1 === lastPointInPoly,
          //     "endpt2isLast?",
          //     endpt2 === lastPointInPoly,
          //     "indexToAddPt",
          //     indexToAddPt
          //   );

          //   // console.warn([obj.name, endpt1, endpt1Index, endpt2, endpt2Index, indexToAddPt]);

          //   newPointsArray.splice(indexToAddPt, 0, obj.name);
          //   console.log("CURRENT newPointsArray", newPointsArray);

          //   ggbObject.setColor(obj.name, 0, 127, 175);
          //   ggbObject.setPointSize(obj.name, pointSizeSmall);
          // }
        });
        console.log("newPointsArray for evalCommand", newPointsArray);
        // console.log(
        //   "2. in addVerticesToPoly",
        //   ggbObject.getDefinitionString("tabOrder")
        // );

        addedList = "";
        setTabOrder(initList, addedList, enders);

        // set all vertices (including new vertices) visible
        newPointsArray.forEach(function (element) {
          ggbObject.setVisible(element, true);
        });
        newPointString = newPointsArray.toString();
        polyCreatedString = ggbObject.evalCommandGetLabels("" + poly + "= Polygon(" + newPointString + ")");
        whitePolyCreatedString = ggbObject.evalCommandGetLabels("" + poly + "White= Polygon({" + newPointString + "})");

        // console.log(
        //   "3. in addVerticesToPoly",
        //   ggbObject.getDefinitionString("tabOrder")
        // );

        // console.log("allPolyCreatedStringsArray - BEFORE", allPolyCreatedStringsArray);
        allPolyCreatedStringsArray.forEach(function (element, indexStr) {
          const elementToArray = element.split(",");
          elementToArray.forEach(function (item) {
            // console.log("item%o, element%o, poly %o", item, element, poly);
            if (item.includes(poly)) {
              allPolyCreatedStringsArray.splice(indexStr, 1, polyCreatedString);
              allWhitePolyCreatedStringsArray.splice(indexStr, 1, whitePolyCreatedString);
            }
          });
        });
        console.warn("END addVertices -- addedPtObjArray", addedPtObjArray);
        // addedPtObjArray = [];
      });

      console.log("allPolyCreatedStringsArray - AFTER", allPolyCreatedStringsArray);

      const polyStr = createdPolys.toString();
      // console.log("polyStr", createdPolys.toString());
      addedList = polyStr;
      setTabOrder(initList, addedList, enders);

      // console.log(
      //   "4. in addVerticesToPoly",
      //   ggbObject.getDefinitionString("tabOrder")
      // );
      makeAllPolyPointsSmall(false); // false is the selectable bool - points should not be selectable
      formatAllSegs();
      tempPointsArray = [];
      // console.log("end addVerticesToPoly", ggbObject.getDefinitionString("tabOrder"));
    }

    ///////////// CUSTOM HELPER FUNCTIONS ////////////

    function hoverFunction() {
      //
    }

    function showMidpoint(seg) {
      tempMdpt = ggbObject.evalCommandGetLabels("Midpoint(" + seg + ")");
      ggbObject.setPointStyle(tempMdpt, 2);
      ggbObject.setPointSize(tempMdpt, 5);
      ggbObject.setLayer(tempMdpt, pointLayer);
      ggbObject.setColor(tempMdpt, 255, 255, 255);
      ggbObject.setFixed(tempMdpt, true, false);
      // console.log("tempMdpt created", tempMdpt);
    }

    function detectVisiblePolys() {
      // console.log("in DetectVisiblePolys");
      const unfilteredPolys = ggbObject
        .getAllObjectNames("triangle")
        .concat(
          ggbObject.getAllObjectNames("quadrilateral"),
          ggbObject.getAllObjectNames("pentagon"),
          ggbObject.getAllObjectNames("hexagon"),
          ggbObject.getAllObjectNames("polygon")
        );

      // console.log("allPolys unsorted", allPolys);
      const sortAlphaNum = function sortAlphaNum(a, b) {
        return a.localeCompare(b, "en", {
          numeric: true,
        });
      };
      const sortedPolys = unfilteredPolys.sort(sortAlphaNum);
      const siftedAndSortedPolys = sortedPolys.filter(function (el) {
        return el.includes("Gon") && !el.includes("White");
      });
      // console.log("END detectVisiblePolys", siftedAndSortedPolys);
      return siftedAndSortedPolys;
    }

    function enableDisableButton() {
      defineToolNum();
      if (createPolysToolActive) {
        // console.log(tempPointsArray);
        Length = tempPointsArray.length;
        const enableBool = Length > 2 ? true : false;
        enableButton(1, enableBool);
        // console.log("create button enabled?? - from add listener:", enableBool);
      }
    }

    function setIncrement(a) {
      let xmlstring = ggbObject.getXML(a);
      xmlstring = xmlstring.slice(xmlstring.indexOf("/>") + 2);
      const parser = new DOMParser();
      const xmldom = parser.parseFromString(xmlstring, "application/xml");

      xmldom.getElementsByTagName("animation")[0].setAttribute("step", "0.5");
      const serializer = new XMLSerializer();
      xmlstring = serializer.serializeToString(xmldom);
      ggbObject.evalXML(xmlstring);
    }

    function setLineOpacity(obj, opacity = 1) {
      let xmlstring = ggbObject.getXML(obj);
      const parser = new DOMParser();
      const xmldom = parser.parseFromString(xmlstring, "application/xml");
      const GGBopacity = String(Math.ceil(255 * opacity));
      xmldom.getElementsByTagName("lineStyle")[0].setAttribute("opacity", GGBopacity);
      const serializer = new XMLSerializer();
      xmlstring = serializer.serializeToString(xmldom);
      ggbObject.evalXML(xmlstring);
    }

    //
    //
    //////////////////////////////// STANDARD FUNCTIONS ////////////////////////////////
    //
    //
    function defineButtonClickScripts() {
      return {
        ggbButton1: function () {
          enableButton(1, false);
          // console.log("create button disabled - from buttonClickScript");

          makePoly();
        },
        ggbButton2: function () {
          enableButton(1, false);
          enableButton(2, false);
          deletePolygons();
        },
        ggbButton3: function () {
          enableButton(3, false);
          addVerticesToPoly();
        },
        ggbButton4: function () {},
        ggbButton5: function () {},
      };
    }

    function defineKeyboardInstructions(obj) {
      // takes a GGB object name as an argument, returns its keyboard text.
      if (ggbObject.getObjectType(obj) === "point") {
        return "Press the arrow keys to move this point.";
      }
      if (createdPolys.includes(obj)) {
        return activePoly === obj
          ? "Press tab to select next object."
          : "Press space to edit the vertices of this polygon.";
      }

      const keyboardInstructions = {
        showGrid: ggbObject.getValue("showGrid") ? "Press space to show the grid." : "Press space to hide the grid.",
        showAxes: ggbObject.getValue("showAxes") ? "Press space to show the axes." : "Press space to hide the axes.",
        polygonTools:
          "Press space to open. Press up arrow\\\\and down arrow to go to different \\\\options. Press enter to select.",
        view: "Press space to open. Press up arrow\\\\and down arrow to go to different \\\\options. Press enter to select.",
        ggbButton1: ggbObject.getValue("ggbButton1Enabled")
          ? "Press space to create a polygon."
          : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled")
          ? "Press space to delete the selected polygon."
          : unavailableButtonText,
        ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
      };
      return keyboardInstructions[obj];
    }

    let stampClicked;

    function clientFunction(a) {
      // console.log("a.type", a.type);
      switch (a.type) {
        case "select":
          {
            selectedObject = a.target;
            // console.log("select - selectedObject", selectedObject);
          }

          break;
        case "mouseDown":
          {
            spaceFlag = false;

            const hitTarget = a.hits[0];
            // console.log("mouseDown - hitTarget", hitTarget);

            switch (true) {
              case createPolysToolActive || (addVertsToolActive && segmentHoverActivated):
                //  && a.target === "Stamp"
                {
                  // if (a.target === "Stamp") {
                  ggbObject.setCoords("TempPt", didUtils.round(a.x, 1), didUtils.round(a.y, 1));
                  if (ggbObject.getValue("tempPtInDropZone") === 1) {
                    stampClicked = hitTarget === "Stamp";

                    ggbObject.setCoords("Stamp", didUtils.round(a.x, 1), didUtils.round(a.y, 1));
                    if (!stampClicked) {
                      // console.log("stamp was not clicked");
                      // console.log("makePoints called from mouseDown");

                      if (!addVertsToolActive) {
                        makePoints();
                      }
                      // if (addVertsToolActive) {
                      //   enableDisableAddButton();
                      // }
                    }
                  }
                  // }
                }

                break;
              case editVertsToolActive:
                {
                  if (ggbObject.getObjectType(hitTarget) === "point" || createdPolys.includes(hitTarget)) {
                    detectAndStyleActivePolyPoints(hitTarget);
                    manageTabOrderOnClick(selectedObject);
                  }
                }

                break;

              default:
                break;
            }
          }
          break;
        case "dragEnd":
          {
            // console.log("dragEnd - selectedObject", selectedObject);

            if (createPolysToolActive && stampClicked) {
              // console.log("makePoints called from dragEnd");

              makePoints();
            }
          }
          break;
        case "dropdownClosed":
          // console.log("DropDownClosed");
          manageToolChange();
          break;
        case "deselect":
          {
            if (a.target) break;
            selectedObject = "";

            // If student clicked on the segment to make a point, delete the point on deselect of the segment
            if (tempMdpt !== "") {
              ggbObject.setVisible(tempMdpt, false);
              ggbObject.deleteObject(tempMdpt);

              tempMdpt = "";
            }
          }
          break;
      }
    }

    function clickListenerFunction(a) {
      // console.warn("click listener,", a);
      const clickedObject = a;

      // Edit & Add Vertices Tool: detect the active poly and make a list of its vertices or segments
      if (createdPolys.includes(clickedObject)) {
        if (editVertsToolActive) {
          activePolyPointsArray = getPointsArrayFromPolyName(clickedObject);
        } else if (addVertsToolActive) {
          // console.log("call getSegsArray - from click Listener");

          activePolySegsArray = getSegsArrayFromPolyName(clickedObject);
        }
      }

      // Edit, Delete, or Add Tools: style the active points/segments/poly and include only necessary items in the tabOrder
      if (
        ((editVertsToolActive || deletePolysToolActive || addVertsToolActive) &&
          createdPolys.includes(clickedObject)) ||
        activePolyPointsArray.includes(clickedObject)
        // || allPolySegsArray.includes(clickedObject)
      ) {
        if (editVertsToolActive || addVertsToolActive) {
          // console.log("call detectAndStyle - Points");
          detectAndStyleActivePolyPoints(clickedObject);
          if (addVertsToolActive) {
            // console.log("call detectAndStyle - Segs");
            // detectAndStyleActivePolySegs(clickedObject);
          }
        }
        manageTabOrderOnClick(clickedObject);

        if (deletePolysToolActive) {
          styleDeletePoly(clickedObject);
        }
      }

      // if (
      //   addVertsToolActive &&
      //   allPolySegsArray.includes(clickedObject) &&
      //   !spaceFlag
      // ) {
      //   makePoints();
      // }
    }

    function keyit(event) {
      // console.warn("event.key", event.key, ",  ", "selectedObject", selectedObject);
      switch (event.key) {
        case " ":
          spaceFlag = true;
          // Create Polygon Tool: make points on space press of stamp
          if (createPolysToolActive && selectedObject === "Stamp") {
            // console.log("makePoints called from space press");
            makePoints();
          }

          if (ggbObject.getObjectType(selectedObject) === "segment") {
            addMidpointToSeg(selectedObject);
          }
          break;
        case "Tab":
          if (ggbObject.getObjectType(selectedObject) === "segment") {
            showMidpoint(selectedObject);
          }
          break;
        default:
          spaceFlag = false;

          break;
      }
    }

    // //pair canvas elements with material IDs
    // var ggbcanvasarray = document.querySelectorAll("canvas");
    // // for (let i = 0, L = ggbcanvasarray.length; i < L; i++) {
    // ggbcanvasarray.forEach((element) => {
    //   var parameter = element.closest("div.appletParameters,div.notranslate");
    //   if (parameter) {
    //     var parameterID = parameter.getAttribute("id");
    //     var canvasID = "canvas" + parameterID;
    //     if (canvasID) {
    //       element.setAttribute("id", canvasID);
    //     }
    //   }
    //   // }
    // });

    //////// FOR PIXEL COLOR PICKER /////////// << may be helpful for alt text
    /* 
var id = "canvas" + name;
//  var ggbcanvas = document.getElementById(id);
if (ggbcanvas) {
//  ggbcanvas.setAttribute("aria-label", "Hover Interactive");
ggbcanvas.addEventListener("mousemove", function (e) {
hover(e);
});
ggbcanvas.addEventListener(
"touchmove",
function (e) {
var touch = e.touches[0];
var mouseEvent = new MouseEvent("mousemove", {
clientX: touch.clientX,
clientY: touch.clientY,
});
ggbcanvas.dispatchEvent(mouseEvent);
},
false
);
}
*/

    //add new stuff above this line
  });

  /*
   * IGNORE BELOW
   */
  function loadUtils() {
    function parseJS(JSString) {
      return Function("" + JSString)();
    }
    if (!window.didUtils || !window.didUtils.setupGGB) {
      return fetch("https://cdn.digital.greatminds.org/did-utils/latest/index.js", {
        cache: "no-cache",
      })
        .then(function (response) {
          return response.text();
        })
        .then(function (codingText) {
          parseJS(codingText);
        })
        .then(function () {
          return window.didUtils.setupGGB;
        });
    }
    return Promise.resolve(window.didUtils.setupGGB);
  }
}

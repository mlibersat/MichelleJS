///////////////////TESTING TABORDER REDESIGN/////////////////

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
    setAriaLabel(ggbcanvas, "Aral Sea Interactive");

    function defineStatusName() {
      return "AAppletStatus";
    }
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

    registerHoverListener(hoverFunction()); // This register hover listener seems to make me call a function
    registerSafeObjectUpdateListener("Follow", function () {
      if (addVertsToolActive) {
        if (ggbObject.getValue("followInDropZone") === 1) {
          segmentHoverActivated = true;
          segmentHover();
        } else {
          segmentHoverActivated = false;
        }
      }
    });

    let click = 0;
    // let mdptCounter = 0;
    let tempPointsArray = [];
    let Length = 0;
    let selectedObject = "";
    const createdPolys = [];
    const createdWhitePolys = [];
    let allPolyPoints = [];
    let activePoly = "";
    let activePolyPointsArray = [];
    let activePolySegsArray = [];
    let polysToDelete = [];
    let allPolys = [];
    let allPolySegs = [];
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
    const enders =
      "ggbButton1, ggbButton2, ggbButton3, showGrid, showAxes, showArea, view";

    const pointLayer = 3;
    const addVertPointLayer = 6;
    const whitePointLayer = 2;
    const pointSizeSmall = 4;
    const whitePointSizeSmall = 5;
    const pointSizeBig = 6;
    const whitePointSizeBig = 7;
    const polyLayer = 2;
    const whitePolyLayer = 1;
    let segLayer = 3;
    const regLineThickness = 5;
    const whiteLineThickness = 8;
    const hoverLineThickness = 10;
    let segmentHoverActivated = false;
    let hoverSeg = "";
    let spaceFlag = false;

    if (ggbObject.getValue("Length(tabOrder)") === 0) {
      setTabOrder(initList, addedList, enders);
    }
    defineToolNum();

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
          console.log("run addVerts func");
          addVerticesToPoly();
          console.log("back from addVerts func");
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
        showGrid: ggbObject.getValue("showGrid")
          ? "Press space to show the grid."
          : "Press space to hide the grid.",
        showAxes: ggbObject.getValue("showAxes")
          ? "Press space to show the axes."
          : "Press space to hide the axes.",
        polygonTools:
          "Press space to open. Press up arrow\\\\and down arrow to go to different \\\\options. Press enter to select.",
        view: "Press space to open. Press up arrow\\\\and down arrow to go to different \\\\options. Press enter to select.",
        ggbButton1: ggbObject.getValue("ggbButton1Enabled")
          ? "Press space to create a polygon."
          : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled")
          ? "Press space to delete the selected polygon."
          : unavailableButtonText,
        ggbButton3: ggbObject.getValue("ggbButton3Enabled")
          ? "Press space to ___."
          : unavailableButtonText,
        ggbButton4: ggbObject.getValue("ggbButton4Enabled")
          ? "Press space to ___."
          : unavailableButtonText,
        ggbButton5: ggbObject.getValue("ggbButton5Enabled")
          ? "Press space to ___."
          : unavailableButtonText,
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
              case createPolysToolActive ||
                (addVertsToolActive && segmentHoverActivated):
                {
                  // if (a.target === "Stamp") {
                  ggbObject.setCoords(
                    "TempPt",
                    didUtils.round(a.x, 1),
                    didUtils.round(a.y, 1)
                  );
                  if (ggbObject.getValue("tempPtInDropZone") === 1) {
                    const xStamp = didUtils.round(
                      ggbObject.getXcoord("Stamp"),
                      0
                    );
                    const yStamp = didUtils.round(
                      ggbObject.getYcoord("Stamp"),
                      0
                    );
                    const xTempPt = didUtils.round(
                      ggbObject.getXcoord("TempPt"),
                      0
                    );
                    const yTempPt = didUtils.round(
                      ggbObject.getYcoord("TempPt"),
                      0
                    );

                    hitTarget === "Stamp"
                      ? (stampClicked = true)
                      : (stampClicked = false);

                    ggbObject.setCoords(
                      "Stamp",
                      didUtils.round(a.x, 1),
                      didUtils.round(a.y, 1)
                    );
                    if (!stampClicked) {
                      // console.log("stamp was not clicked");
                      // console.log("makePoints called from mouseDown");

                      makePoints();
                    }
                  }
                  // }
                }

                break;
              case editVertsToolActive:
                {
                  if (
                    ggbObject.getObjectType(hitTarget) === "point" ||
                    createdPolys.includes(hitTarget)
                  ) {
                    detectAndStyleActivePolyPoints(hitTarget);
                    manageTabOrder(selectedObject);
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
          // console.warn("DropDownClosed");
          manageToolChange();
          break;
        case "deselect":
          {
            if (a.target) break;
            selectedObject = "";

            // If had student clicked on the segment to make a point, delete the point on deselect of the segment
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
      // console.log("click listener,", a);
      const clickedObject = a;
      // console.log("click - a", a);

      // Edit & Add Vertices Tool: detect the active poly and make a list of its vertices or segments
      if (createdPolys.includes(clickedObject)) {
        if (editVertsToolActive) {
          activePolyPointsArray = getPointsArrayFromPolyName(clickedObject);
        } else if (addVertsToolActive) {
          activePolySegsArray = getSegsArrayFromPolyName(clickedObject);
        }
      }

      // Edit, Delete, or Add Tools: style the active points/segments/poly and include only necessary items in the tabOrder
      if (
        ((editVertsToolActive || deletePolysToolActive || addVertsToolActive) &&
          createdPolys.includes(clickedObject)) ||
        activePolyPointsArray.includes(clickedObject)
        // || allPolySegs.includes(clickedObject)
      ) {
        if (editVertsToolActive || addVertsToolActive) {
          // console.log("call detectAndStyle - Points");
          detectAndStyleActivePolyPoints(clickedObject);
          if (addVertsToolActive) {
            // console.log("call detectAndStyle - Segs");
            detectAndStyleActivePolySegs(clickedObject);
          }
        }
        manageTabOrder(clickedObject);

        if (deletePolysToolActive) {
          styleDeletePoly(clickedObject);
        }
      }
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
          // // console.log("el", el);
          // console.log("a", obj);

          return el !== obj;
        });
      }
      if (polysToDelete.length === 0) {
        enableButton(2, false);
      }
      // console.log("polysToDelete >>>After:", polysToDelete);
    }

    function keyit(event) {
      // console.log("event.key", event.key, ",  ", "selectedObject", selectedObject);
      switch (event.key) {
        case " ":
          spaceFlag = true;
          // Create Polygon Tool: make points on space press of stamp
          if (createPolysToolActive && selectedObject === "Stamp") {
            // console.log("makePoints called from space press");
            makePoints();
          }

          // create point at midpoint (tempMdpt is defined on select of the segment)
          if (ggbObject.getObjectType(selectedObject) === "segment") {
            console.warn("segment pressed!!!!!!");
            const xTempMdpt = ggbObject.getXcoord(tempMdpt);
            const yTempMdpt = ggbObject.getYcoord(tempMdpt);
            ggbObject.setCoords("Stamp", xTempMdpt, yTempMdpt);
            console.log(tempPointsArray);

            let pointAlreadyThere = false;
            let midptToDelete = "";

            for (let i = 0, L = tempPointsArray.length; i < L; i++) {
              const el = tempPointsArray[i];
              if (
                xTempMdpt === ggbObject.getXcoord(el) &&
                yTempMdpt === ggbObject.getYcoord(el)
              ) {
                midptToDelete = el;
                pointAlreadyThere = true;
                break;
              }
              showMidpoint;
            }

            // console.log("pointAlreadyThere", pointAlreadyThere);
            if (!pointAlreadyThere) {
              makePoints();
            } else {
              const newTemp = tempPointsArray.filter(function (el) {
                return !(el === midptToDelete);
              });
              ggbObject.deleteObject(midptToDelete);
              tempPointsArray = [...newTemp];
            }
            // console.log("new tempPointsArray", tempPointsArray);

            enableDisableAddButton();
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

    function enableDisableAddButton() {
      // console.log("tempPointsArray.length", tempPointsArray.length);

      const numPts = tempPointsArray.length;
      // console.log("numPts", numPts);
      if (numPts >= 1) {
        enableButton(3, true);
        console.log("enableButton3");
      } else if (numPts < 1) {
        enableButton(3, false);
        console.log("disableButton3");
      }
    }

    function makePoints() {
      click++;
      const stampX = ggbObject.getXcoord("Stamp");
      const stampY = ggbObject.getYcoord("Stamp");
      let newPointName = "NewPoint".concat(click);

      // If creating points on add verts tool
      if (addVertsToolActive) {
        // When add verts Tool is Active, create points at midpoints of segments (when space is pressed) and add points on mousedown when the segment hover is active
        // Ex name: "NewMdpt3"
        newPointName = "NewMdpt".concat(click);
        console.log(
          "in makePoints - hoverSeg",
          hoverSeg,
          "newMdpt",
          newPointName
        );

        // If students are creating points from pressing space on a segment, drop a point at the midpoint
        if (spaceFlag) {
          ggbObject.evalCommand(
            newPointName.concat("=(", stampX, ",", stampY, ")")
          );
        } else {
          // If students are creating points on mouseDown, drop a point at the closest location of their mouse to the active segment. Note: Make a temp point with closest point, then place a point on the segment and set its coords to the temp point coords (prevents point jumping as Stamp changes later).
          const tempPointOnSeg = ggbObject.evalCommandGetLabels(
            "=ClosestPoint(".concat(hoverSeg, ", Stamp)")
          );
          ggbObject.evalCommand(newPointName.concat("=Point(", hoverSeg, ")"));
          ggbObject.setCoords(
            newPointName,
            ggbObject.getXcoord(tempPointOnSeg),
            ggbObject.getYcoord(tempPointOnSeg)
          );
          ggbObject.deleteObject(tempPointOnSeg);
        }
        ggbObject.setColor(newPointName, 0, 0, 0);
      }
      // If creating points on create Poly tool
      else {
        newPointName = "NewPoint".concat(click);
        ggbObject.evalCommand(
          newPointName.concat("=(", stampX, ",", stampY, ")")
        );
      }

      const newWhitePointName = newPointName.concat("White");

      ggbObject.evalCommand(newWhitePointName.concat("=", newPointName, ""));

      ggbObject.setPointSize(newPointName, pointSizeSmall);

      ggbObject.setPointSize(newWhitePointName, whitePointSizeSmall);
      ggbObject.setColor(newWhitePointName, 255, 255, 255);
      ggbObject.setLayer(
        newPointName,
        addVertsToolActive ? addVertPointLayer : pointLayer
      );
      ggbObject.setLayer(newWhitePointName, whitePointLayer);
      ggbObject.setFixed(newPointName, false, false);
      ggbObject.setFixed(newWhitePointName, false, false);

      tempPointsArray.push(newPointName);
      console.warn("tempPointsArray", tempPointsArray);

      // If points are added on a midpoint by clicking a segment, don't set the increment now. Set it later after the point is reconfigured as a vertex of the polygon
      if (!addVertsToolActive) {
        setIncrement(newPointName);
      }
      Length = tempPointsArray.length;
      enableDisableButton();
    }

    function makePoly() {
      // console.log("in makePoly - tabOrder", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);
      // console.log("tempPointsArray", tempPointsArray);
      const createdPolysNum = createdPolys.length;
      const createdWhitePolysNum = createdPolys.length;
      const newPolyName = "polyGon".concat(createdPolysNum + 1);
      const newWhitePolyName = "polyGon".concat(
        createdWhitePolysNum + 1,
        "White"
      );

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
        { x: 0, y: 0 }
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
        for (let i = 0, L = input.length; i < L; ++i)
          output.push(input[i][field]);
        return output;
      }

      tempPointsArray = getFields(pointsSorted, "name");
      // console.log("tempPointsArray names???", tempPointsArray);

      // create the poly with non-intersecting sides using the new order of points in tempPointsArray
      createdPolys.push(
        ggbObject.evalCommandGetLabels(
          newPolyName.concat("=Polygon({", tempPointsArray, "})")
        )
      );
      // console.log("created polys", createdPolys);

      // create polys in GGB
      createdWhitePolys.push(
        ggbObject.evalCommandGetLabels(
          newWhitePolyName.concat("=Polygon(", tempPointsArray, ")")
        )
      );
      setLineOpacity(newPolyName);
      ggbObject.setLayer(newPolyName, polyLayer);
      ggbObject.setColor(newPolyName, 0, 127, 175);
      ggbObject.setFilling(newPolyName, 0.35);
      ggbObject.setFixed(newPolyName, false, false);
      // console.log("poly created in GGB");

      // create white polys
      ggbObject.setLineThickness(newWhitePolyName, whiteLineThickness);
      setLineOpacity(newWhitePolyName);
      ggbObject.setLayer(newWhitePolyName, whitePolyLayer);
      ggbObject.setColor(newWhitePolyName, 255, 255, 255);
      ggbObject.setFixed(newWhitePolyName, false, false);

      tempPointsArray = [];

      // console.log("addedList before manageAdded", addedList);
      addedList = manageAddedList(newPolyName, true); // add the polys to the tab order, but they remain nonselectable until tool drop down is edit or delete
      // console.log("addedList after manageAdded", addedList);

      setTabOrder(initList, addedList, enders);

      updateAllPolySegs();
      allPolySegs.forEach(function (element) {
        ggbObject.setColor(element, 0, 127, 175);
        ggbObject.setFixed(element, false, false);
        ggbObject.setLineThickness(element, regLineThickness);
        ggbObject.setLayer(element, segLayer);
      });
    }

    // Note: segments created by makePoly() are automatically named by GGB as "newpoint1","newpoint2", etc.
    // Note2: segment are named according to which point they are being drawn TO.
    function updateAllPolySegs() {
      allPolySegs = ggbObject
        .getAllObjectNames("segment")
        .filter(function (el) {
          return el.includes("newpoint");
        });
      const sortAlphaNum = function (a, b) {
        return a.localeCompare(b, "en", {
          numeric: true,
        });
      };
      const sortedSegs = allPolySegs.sort(sortAlphaNum);
      allPolySegs = [...sortedSegs];
      // console.log("allPolySegs", allPolySegs);
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
      xmldom
        .getElementsByTagName("lineStyle")[0]
        .setAttribute("opacity", GGBopacity);
      const serializer = new XMLSerializer();
      xmlstring = serializer.serializeToString(xmldom);
      ggbObject.evalXML(xmlstring);
    }

    // Detect active polygon, make all points associated with the polygon big and all others small. (all are selectable but not all in tab cycle)
    // Called on: space press of poly, on mouseDown of point or poly, and on click of point or poly
    function detectAndStyleActivePolyPoints(obj) {
      const pointSelected = ggbObject.getObjectType(obj) === "point";
      const polySelected = createdPolys.includes(obj);

      let polyDefString = "";

      // console.log("call makePointsSmall");
      makePointsSmall(editVertsToolActive); // editVertsToolActive bool is passed so that points are selectable only if Edit Verts Tool is active (not add Verts tool)

      // if a poly is selected, detect its vertices
      if (polySelected || pointSelected) {
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
        // Edit Vertices Tool: make the active points big
        if (editVertsToolActive) {
          activePolyPointsArray.forEach(function (element) {
            // console.log("make active points selectable and BIG");
            ggbObject.setFixed(element, false, true);
            ggbObject.setPointSize(element, pointSizeBig);
            ggbObject.setPointSize(element.concat("White"), whitePointSizeBig);
          });
        } else if (addVertsToolActive) {
          // console.log("in detectAndStyle called from clickListener - addVertstool");

          // Add Vertices Tool
          // temporarily make all points hidden
          updateAllPointsArray();
          allPolyPoints.forEach(function (element) {
            // console.log("make active points visible");

            ggbObject.setVisible(element, false);
            ggbObject.setVisible(element.concat("White"), false);
            ggbObject.setFixed(element, true, false);
          });
          // Add Vertices Tool: Make active vertices visible but small and nonselectable.
          activePolyPointsArray.forEach(function (element) {
            ggbObject.setVisible(element, true);
            ggbObject.setVisible(element.concat("White"), true);
            ggbObject.setFixed(element, false, false);
          });
          // console.log("poly points non-selectable");
        }
      }
    }

    // Makes all poly points small. Pass a bool for whether or not to make points selectable
    function makePointsSmall(selectableBool) {
      updateAllPointsArray();
      // console.log("in makePointsSmall, selectableBool", selectableBool);
      allPolyPoints.forEach(function (element) {
        ggbObject.setFixed(element, false, selectableBool);
        ggbObject.setPointSize(element, pointSizeSmall);
        ggbObject.setPointSize(element.concat("White"), whitePointSizeSmall);
      });
    }

    function updateAllPointsArray() {
      const allPoints = ggbObject.getAllObjectNames("point");

      // filter out anything that doesn't contain "NewPoint" and anything that does contain "White"
      allPolyPoints = allPoints.filter(function (el) {
        return el.includes("NewPoint") && !el.includes("White");
      });
      // console.log("allPolyPoints", allPolyPoints);
    }

    // detect active polygon, make all segments associated with the polygon thick and all others regular. (all are selectable but not all in tab cycle)
    // Called on: space press of poly, on mouseDown of seg or poly, and on click of seg or poly
    function detectAndStyleActivePolySegs(obj) {
      // console.log("in detectAndStyleActivePolySegs");
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

        activePolySegsArray = getSegsArrayFromPolyName(activePoly);

        activePolyPointsArray.forEach(function (element) {
          ggbObject.setFixed(element, true, false);
        });
        activePolySegsArray.forEach(function (element) {
          ggbObject.setFixed(element, true, true);
        });
      }
    }

    function makeSegsSelectable(selectableBool) {
      allPolySegs.forEach(function (element) {
        ggbObject.setVisible(element, true);
        ggbObject.setFixed(element, false, selectableBool);
      });
    }

    function getPointsArrayFromPolyName(poly) {
      const polyDefString = ggbObject.getDefinitionString(poly);
      const polyPointsString = polyDefString.substring(
        9,
        polyDefString.length - 1
      );
      console.log("end getPointsArray", polyPointsString.split(", "));
      return polyPointsString.split(", ");
    }

    function getSegsArrayFromPolyName(poly) {
      const polyDefString = ggbObject.getDefinitionString(poly);
      const polySegsString = polyDefString.substring(
        9,
        polyDefString.length - 1
      );
      const segs = polySegsString.toLowerCase();
      return segs.split(", ");
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

    function manageToolChange() {
      // console.log("tabOrder in manageToolChange", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);

      defineToolNum();

      enableButton(2, false);
      let selectableOrNot = false;

      if (!editVertsToolActive) {
        makePointsSmall(false); // selectableBool == false
        updateAllPointsArray();
        allPolyPoints.forEach(function (element) {
          ggbObject.setFixed(element, false, false);
        });
        // console.log("in manageToolChange - points are not selectable");
      }

      const allPoints = ggbObject.getAllObjectNames("point");
      // When the tool is changed away from delete polys, reset the shading of any polys that may have been marked for deletion & show poly points again
      if (!deletePolysToolActive) {
        polysToDelete.forEach(function (element) {
          ggbObject.evalCommand("SetDecoration(" + element + ", 0)");
        });
        polysToDelete = [];

        allPoints.forEach(function (element) {
          if (element.includes("NewPoint")) {
            ggbObject.setVisible(element, true);
          }
        });
      }

      if (addVertsToolActive || deletePolysToolActive) {
        allPoints.forEach(function (element) {
          // console.log("point element", element);
          if (element.includes("NewPoint")) {
            // hide poly points when add Verts or delete Polys is chosen
            ggbObject.setVisible(element, false);
          }
        });

        // format segments when changing to and from AddVerts Tool
        if (addVertsToolActive) {
          ggbObject.setValue("showFollow", true);
          // show poly segments and make them selectable when add Verts is chosen
          allPolySegs.forEach(function (element) {
            ggbObject.setVisible(element, true);
            ggbObject.setFixed(element, false, false);
          });
        }
      } else {
        console.log("addVertsTool is Inactive");
        ggbObject.setValue("showFollow", false);
        segLayer = 6;
        updateAllPolySegs();
        allPolySegs.forEach(function (element) {
          ggbObject.setLineThickness(element, regLineThickness);
          ggbObject.setLayer(element, segLayer);
        });
      }

      // When the tool is changed away from create polys, delete any stray points that may have been created and not made into a poly and disable create button.
      if (!createPolysToolActive) {
        enableButton(1, false);

        selectableOrNot = selectOptionToolActive ? false : true;
        // console.warn("tempPointsArray before", tempPointsArray);
        // console.warn("tabOrder before", ggbObject.getDefinitionString("tabOrder"));
        if (tempPointsArray.length !== 0) {
          tempPointsArray.forEach(function (element) {
            ggbObject.deleteObject(element);
            ggbObject.deleteObject(element + "White");
          });
          tempPointsArray = [];
        }
        // console.log(">>>> tempPointsArray AFTER", tempPointsArray);
        // console.log(">>>> tabOrder AFTER", ggbObject.getDefinitionString("tabOrder"));
      }

      createdPolys.forEach(function (element) {
        ggbObject.setFixed(element, false, selectableOrNot); // make the poly selectable if toolNum 2 or 3, otherwise nonselectable
      });
      // console.log("tabOrder --END-- manageToolChange", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);
    }

    function manageTabOrder(obj) {
      // console.log("in manageTabOrder - tabOrder", ggbObject.getDefinitionString("tabOrder"));
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
        updateAllPolySegs();
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
      // console.log("end of manageTabOrder - tabOrder AFTER", ggbObject.getDefinitionString("tabOrder"));
    }

    function detectVisiblePolys() {
      allPolys = ggbObject
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
      const sortedPolys = allPolys.sort(sortAlphaNum);
      const siftedAndSortedPolys = sortedPolys.filter(function (el) {
        return el.includes("Gon") && !el.includes("White");
      });
      // console.log("allPolys siftedAndSortedPolys", siftedAndSortedPolys);
      return siftedAndSortedPolys;
    }

    function deletePolygons() {
      // console.log("DELETE POLYS");
      // console.log("tabOrder before", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);

      let pointsToDelete = [];
      polysToDelete.forEach(function (element) {
        pointsToDelete = pointsToDelete.concat(
          getPointsArrayFromPolyName(element)
        );
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

    function hoverFunction() {
      //
    }

    function segmentHover() {
      const distances = [];
      allPolySegs.forEach(function (element) {
        ggbObject.setLineThickness(element, regLineThickness);
        ggbObject.evalCommand("dist = Distance(Follow," + element + ")");
        const dist = ggbObject.getValue("dist");
        distances.push(dist);
      });
      const min = Math.min.apply(null, distances);
      if (min < 1) {
        const indexMin = distances.indexOf(min);

        ggbObject.setLineThickness(allPolySegs[indexMin], hoverLineThickness);
        hoverSeg = allPolySegs[indexMin];
      } else {
        hoverSeg = "";
      }
    }
    // Could this be used as an alternative to "evalCommand = distance(Follow..."???
    // function distance(v, w, p) {
    //   function sqr(x) {
    //     return x * x;
    //   }
    //   function dist2(v, w) {
    //     return sqr(v.x - w.x) + sqr(v.y - w.y);
    //   }
    //   function distToSegmentSquared(p, v, w) {
    //     var l2 = dist2(v, w);
    //     if (l2 == 0) return dist2(p, v);
    //     var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    //     t = Math.max(0, Math.min(1, t));
    //     return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
    //   }
    //   function distToSegment(p, v, w) {
    //     return Math.sqrt(distToSegmentSquared(p, v, w));
    //   }
    // }

    function showMidpoint(seg) {
      tempMdpt = ggbObject.evalCommandGetLabels("Midpoint(" + seg + ")");
      ggbObject.setPointStyle(tempMdpt, 2);
      ggbObject.setPointSize(tempMdpt, 5);
      ggbObject.setLayer(tempMdpt, addVertPointLayer);
      ggbObject.setColor(tempMdpt, 255, 255, 255);
      ggbObject.setFixed(tempMdpt, true, false);
      console.log("tempMdpt created", tempMdpt);

      // const addedPtObj = makeAddedPointObj(tempMdpt, seg);
      // console.log(addedPtObj);
    }

    // class AddedPoint {
    //   constructor() {
    //     this.name = "AddedPoint";
    //   }
    // }

    // function makeAddedPointObj2(){

    // }

    // function makeAddedPointObj(pt, seg) {
    //   return {
    //     point: pt,
    //     segDef: function () {
    //       ggbObject.getDefinitionString(seg);
    //     },
    //   };
    // }

    function addVerticesToPoly() {
      console.log("in addVerticesToPoly function");
      // 1. For each poly in allPolys getPointsArrayFromPolyName and getSegsArrayFromPolyName (make sure it's the order that's in GGB, not numerically ordered)
      allPolys = detectVisiblePolys();
      allPolys.forEach(function (element) {
        const points = [...getPointsArrayFromPolyName(element)];
        const segs = [...getSegsArrayFromPolyName(element)];
        console.log(points);
        console.log(segs);
        //    a. For each "black" point in tempPointsArray, locate the points in allPolys it's on (hopefully they're all actually "on" a segment)
        //       (detect iscollinear, and x and y coords are between the endpoints of the segment)
        const ptsOnSeg = tempPointsArray.filter(function (el) {
          const collinear =
            ggbObject.evalCommandGetLabels("AreCollinear(el, )");
          return;
        });
      });
      //    b. If the point is also in the "current" poly segs array:
      //       i.  Insert the addedPoint between the two points in the points array
      //       ii.  Repeat for each point that's on a segment in the current poly
      //    c. Create a new poly based on the new points array
      // 2. Repeat a - c for each poly in allPolys
    }

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
      return fetch(
        "https://cdn.digital.greatminds.org/did-utils/latest/index.js",
        {
          cache: "no-cache",
        }
      )
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

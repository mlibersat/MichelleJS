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

    //////// FOR PIXEL COLOR PICKER ///////////
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

    // ggbObject.registerAddListener(enableDisableButton);
    registerHoverListener(hoverFunction());
    // registerSafeObjectUpdateListener("toolNum", function () {
    registerSafeObjectUpdateListener("Follow", function () {
      // COME BACK TO THIS --- Can/Should I register this inside of manageTool function and deregister it after it's not needed?
      if (addVertsToolActive) {
        if (ggbObject.getValue("followInDropZone") === 1) {
          segmentHoverActivated = true;
          segmentHover();
        } else {
          segmentHoverActivated = false;
        }
      }
    });
    // console.log("update listener fired");
    // });

    var click = 0;
    var mdptCounter = 0;
    var tempPointsArray = [];
    var Length = 0;
    var selectedObject = "";
    var createdPolys = [];
    var createdWhitePolys = [];
    var allPolyPoints = [];
    var activePoly = "";
    var activePolyPointsArray = [];
    var activePolySegsArray = [];
    var polysToDelete = [];
    var allPolySegs = [];
    var tempMdpt = "";
    // var tempAddedPointsArray = [];
    var selectOptionToolActive;
    var createPolysToolActive;
    var editVertsToolActive;
    var addVertsToolActive;
    var deletePolysToolActive;
    var nonActiveFirstPolys = [];
    var nonActiveLastPolys = [];
    const initList = " polygonTools, Stamp";
    var addedList = "";
    var enders = "ggbButton1, ggbButton2, showGrid, showAxes, showArea, view";

    // var showFollowBool = false;

    const pointLayer = 3;
    const addVertPointLayer = 6;
    const whitePointLayer = 2;
    const pointSizeSmall = 4;
    const whitePointSizeSmall = 5;
    const pointSizeBig = 6;
    const whitePointSizeBig = 7;
    const polyLayer = 2;
    const whitePolyLayer = 1;
    const segLayer = 6;
    const regLineThickness = 5;
    const whiteLineThickness = 8;
    const hoverLineThickness = 10;
    var segmentHoverActivated = false;
    var hoverSeg = "";
    var spaceFlag = false;

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
        ggbButton3: function () {},
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
      // if (createdPolys.includes(obj) === "polygon") {
      //   return activePoly === obj
      //     ? "Press tab to select next object."
      //     : "Press space to edit the vertices of this polygon.";
      // }
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

    var stampClicked;

    function clientFunction(a) {
      // console.log("a.type", a.type);
      switch (a.type) {
        case "select":
          {
            selectedObject = a.target;
            // console.log("select - selectedObject", selectedObject);
            // manageToolChange();
            // if (ggbObject.getObjectType(selectedObject) === "segment") {
            //   // detectAndStyleActivePolySegs();
            //   showMidpoint(selectedObject);
            // }
          }

          break;
        case "mouseDown":
          {
            spaceFlag = false;

            var hitTarget = a.hits[0];
            // console.log("mouseDown - hitTarget", hitTarget);

            switch (true) {
              case createPolysToolActive || (addVertsToolActive && segmentHoverActivated):
                {
                  // if (a.target === "Stamp") {
                  ggbObject.setCoords("TempPt", didUtils.round(a.x, 1), didUtils.round(a.y, 1));
                  if (ggbObject.getValue("tempPtInDropZone") === 1) {
                    const xStamp = didUtils.round(ggbObject.getXcoord("Stamp"), 0);
                    const yStamp = didUtils.round(ggbObject.getYcoord("Stamp"), 0);
                    const xTempPt = didUtils.round(ggbObject.getXcoord("TempPt"), 0);
                    const yTempPt = didUtils.round(ggbObject.getYcoord("TempPt"), 0);
                    // stampClicked = Math.abs(xStamp - xTempPt) <= 0.25 && Math.abs(yStamp - yTempPt) <= 0.25;
                    // console.log("stampClicked", stampClicked);
                    // console.log("distance X", Math.abs(xStamp - xTempPt));
                    // console.log("distance Y", Math.abs(yStamp - yTempPt));
                    hitTarget === "Stamp" ? (stampClicked = true) : (stampClicked = false);

                    ggbObject.setCoords("Stamp", didUtils.round(a.x, 1), didUtils.round(a.y, 1));
                    if (!stampClicked) {
                      // console.log("stamp was not clicked");
                      // console.log("makePoints called from mouseDown");

                      makePoints();
                      // console.log(
                      //   "was stamp close????????????????",
                      //   Math.abs(xStamp - xTempPt) <= 0.25 && Math.abs(yStamp - yTempPt) <= 0.25
                      // );
                    }
                  }
                  // }
                }

                break;
                makePoints();
              case editVertsToolActive:
                {
                  if (ggbObject.getObjectType(hitTarget) === "point" || createdPolys.includes(hitTarget)) {
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

            //if the student did not add the point on the segment, delete the temporary midpoint

            // if (ggbObject.getColor(tempMdpt) === "000000") {
            //   mdptCounter++;
            //   ggbObject.evalCommand("Midpoint" + mdptCounter + "=CopyFreePoint(" + tempMdpt + ")");
            //   ggbObject.deleteObject(tempMdpt);
            // }
            // ggbObject.setVisible(tempMdpt, false);

            // If student clicked on the segment to make a point
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
      console.log("click listener,", a);
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
      // switch (event.key) {
      //   case " ":
      //     // console.log("keyit - space press");
      //     if (selectedObject === "Stamp" && createPolysToolActive) {
      //       makePoints();
      //     }
      //     // else if (editVertsToolActive && createdPolys.includes(selectedObject)) {
      //     //   // activePolyPointsArray.forEach(function (element) {
      //     //   detectAndStyleActivePolyPoints(selectedObject);
      //     //   // });
      //     // }
      //     break;
      // }
      // console.log("event.key", event.key, ",  ", "selectedObject", selectedObject);
      switch (event.key) {
        case " ":
          spaceFlag = true;
          // Create Polygon Tool: make points on space press of stamp
          // defineToolNum();
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

            var pointAlreadyThere = false;
            var midptToDelete = "";

            for (let i = 0, L = tempPointsArray.length; i < L; i++) {
              const el = tempPointsArray[i];
              console.log("element", el);
              console.log(
                "xTemp ",
                xTempMdpt,
                "yTemp ",
                yTempMdpt,
                "x",
                el,
                " ",
                ggbObject.getXcoord(el),
                "y",
                el,
                " ",
                ggbObject.getYcoord(el)
              );
              console.log(
                "Are they equal?",
                xTempMdpt === ggbObject.getXcoord(el) && yTempMdpt === ggbObject.getYcoord(el)
              );
              if (xTempMdpt === ggbObject.getXcoord(el) && yTempMdpt === ggbObject.getYcoord(el)) {
                midptToDelete = el;
                pointAlreadyThere = true;
                break;
              }
            }

            // tempPointsArray.forEach(function (el) {
            //   console.log("element", el);
            //   console.log(
            //     "xTemp ",
            //     xTempMdpt,
            //     "yTemp ",
            //     yTempMdpt,
            //     "x",
            //     el,
            //     " ",
            //     ggbObject.getXcoord(el),
            //     "y",
            //     el,
            //     " ",
            //     ggbObject.getYcoord(el)
            //   );
            //   if (ggbObject.evalCommand("AreEqual(" + el + ",tempMdpt)") === 0) {
            //     pointAlreadyThere = false;
            //   } else {
            //     pointAlreadyThere = true;
            //   }
            // });
            console.log("pointAlreadyThere", pointAlreadyThere);
            if (!pointAlreadyThere) {
              makePoints();
            } else {
              ggbObject.deleteObject(midptToDelete);
              tempPointsArray.filter(function (el) {
                return !tempMdpt;
              });
              // tempMdpt = "";
            }
            console.log("new tempPointsArray", tempPointsArray);
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

    function makePoints() {
      click++;
      var stampX = ggbObject.getXcoord("Stamp");
      var stampY = ggbObject.getYcoord("Stamp");
      var newPointName = "";
      var newWhitePointName = newPointName.concat("White");

      // console.log("1");

      //create and name the created point
      if (addVertsToolActive) {
        // When add verts Tool is Active, create points at midpoints of segments (when space is pressed) and add points on mousedown when the segment hover is active
        // Ex name: "NewMdpt3"
        console.log("2");

        //   // COME BACK TO THIS -- MAYBE PUT THIS IN THE TEMP POINT function
        //   // eval command create temp Point on segment
        //   // find closest point from the Stamp on the active segment
        newPointName = "NewMdpt".concat(click);
        console.log("in makePoints - hoverSeg", hoverSeg, "newMdpt", newPointName);

        // If students are creating points from pressing space on a segment, drop a point at the midpoint
        if (spaceFlag) {
          ggbObject.evalCommand(newPointName.concat("=(", stampX, ",", stampY, ")"));
        } else {
          // If students are creating points on mouseDown, drop a point at the closest location of their mouse to the active segment
          ggbObject.evalCommand(newPointName.concat("=ClosestPoint(", hoverSeg, ", Stamp)"));
        }
        ggbObject.setColor(newPointName, 0, 0, 0);
        console.log("end 2");
      } else {
        //   console.log("3");
        newPointName = "NewPoint".concat(click);

        ggbObject.evalCommand(newPointName.concat("=(", stampX, ",", stampY, ")"));
      }

      // console.log("4");

      ggbObject.evalCommand(newWhitePointName.concat("=", newPointName, ""));

      ggbObject.setPointSize(newPointName, pointSizeSmall);
      // if (addVertsToolActive) {
      //   console.log("5");
      // }
      // console.log("6");
      ggbObject.setPointSize(newWhitePointName, whitePointSizeSmall);
      ggbObject.setColor(newWhitePointName, 255, 255, 255);
      ggbObject.setLayer(newPointName, addVertsToolActive ? addVertPointLayer : pointLayer);
      ggbObject.setLayer(newWhitePointName, whitePointLayer);
      ggbObject.setFixed(newPointName, false, false);
      ggbObject.setFixed(newWhitePointName, false, false);
      // console.log("7");

      tempPointsArray.push(newPointName);
      console.warn("tempPointsArray", tempPointsArray);
      // console.log("8");

      // If points are added on a midpoint by clicking a segment, don't set the increment now. Set it later after the point is reconfigured as a vertex of the polygon
      if (!addVertsToolActive) {
        setIncrement(newPointName);
      }
      // console.log("9");
      Length = tempPointsArray.length;
      // console.log("10");
      enableDisableButton();
    }

    function makePoly() {
      // console.log("in makePoly - tabOrder", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);

      // console.log("tempPointsArray", tempPointsArray);
      var createdPolysNum = createdPolys.length;
      var createdWhitePolysNum = createdPolys.length;
      var newPolyName = "polyGon".concat(createdPolysNum + 1);
      var newWhitePolyName = "polyGon".concat(createdWhitePolysNum + 1, "White");

      // reorder points to make sides non-intersecting
      const points = Array.from(tempPointsArray, (el) => ({
        x: ggbObject.getXcoord(el),
        y: ggbObject.getYcoord(el),
        name: el,
      }));
      // console.log("points:", points);

      // Get the center (mean value) using reduce
      const center = points.reduce(
        (acc, { x, y, name }) => {
          acc.x += x / points.length;
          acc.y += y / points.length;
          return acc;
        },
        { x: 0, y: 0 }
      );

      // Add an angle property to each point using tan(angle) = y/x
      const angles = points.map(({ x, y, name }) => {
        return {
          x,
          y,
          angle: (Math.atan2(y - center.y, x - center.x) * 180) / Math.PI,
          name,
        };
      });

      // Sort your points by angle
      const pointsSorted = angles.sort((a, b) => a.angle - b.angle);
      // console.log("tempPointsArraySorted", pointsSorted);

      function getFields(input, field) {
        var output = [];
        for (var i = 0, L = input.length; i < L; ++i) output.push(input[i][field]);
        return output;
      }

      tempPointsArray = getFields(pointsSorted, "name");
      // console.log("tempPointsArray names???", tempPointsArray);

      // create the poly with non-intersecting sides using the new order of points in tempPointsArray
      createdPolys.push(ggbObject.evalCommandGetLabels(newPolyName.concat("=Polygon({", tempPointsArray, "})")));
      // console.log("created polys", createdPolys);

      // create polys in GGB
      createdWhitePolys.push(
        ggbObject.evalCommandGetLabels(newWhitePolyName.concat("=Polygon(", tempPointsArray, ")"))
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
      // ggbObject.setFilling(newWhitePolyName, 1);
      ggbObject.setFixed(newWhitePolyName, false, false);
      // console.log("white poly created in GGB");

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
      allPolySegs = ggbObject.getAllObjectNames("segment").filter(function (el) {
        return el.includes("newpoint");
      });
      const sortAlphaNum = (a, b) =>
        a.localeCompare(b, "en", {
          numeric: true,
        });
      var sortedSegs = allPolySegs.sort(sortAlphaNum);

      // sortedSegs.forEach(function (element) {
      //   ggbObject.setVisible(element, false);
      //   // ggbObject.setLineThickness(element, 0);
      // });

      allPolySegs = [...sortedSegs];
      // console.log("allPolySegs", allPolySegs);
    }

    function setIncrement(a) {
      console.log("setIncrement 1");
      var xmlstring = ggbObject.getXML(a);
      xmlstring = xmlstring.slice(xmlstring.indexOf("/>") + 2);
      var parser = new DOMParser();
      var xmldom = parser.parseFromString(xmlstring, "application/xml");
      console.log("setIncrement 2");

      xmldom.getElementsByTagName("animation")[0].setAttribute("step", "0.5");
      var serializer = new XMLSerializer();
      console.log("setIncrement 3");
      xmlstring = serializer.serializeToString(xmldom);
      console.log("setIncrement 4");
      ggbObject.evalXML(xmlstring);
      console.log("setIncrement end");
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

    // detect active polygon, make all points associated with the polygon big and all others small. (all are selectable but not all in tab cycle)
    // Called on: space press of poly, on mouseDown of point or poly, and on click of point or poly
    function detectAndStyleActivePolyPoints(obj) {
      const pointSelected = ggbObject.getObjectType(obj) === "point";
      const polySelected = createdPolys.includes(obj);

      var polyDefString = "";

      // temporarily make all points small

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

    function makePointsSmall(selectableBool) {
      updateAllPointsArray();
      // make all vertices small ("active" vertices will be made big in next step)
      // console.log("in makePointsSmall, selectableBool", selectableBool);
      allPolyPoints.forEach(function (element) {
        ggbObject.setFixed(element, false, selectableBool);
        ggbObject.setPointSize(element, pointSizeSmall);
        ggbObject.setPointSize(element.concat("White"), whitePointSizeSmall);
      });
    }

    function updateAllPointsArray() {
      var allPoints = ggbObject.getAllObjectNames("point");

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

      var polyDefString = "";

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
      var polyDefString = ggbObject.getDefinitionString(poly);
      var polyPointsString = polyDefString.substring(9, polyDefString.length - 1);
      return polyPointsString.split(", ");
    }

    function getSegsArrayFromPolyName(poly) {
      var polyDefString = ggbObject.getDefinitionString(poly);
      var polySegsString = polyDefString.substring(9, polyDefString.length - 1);
      var segs = polySegsString.toLowerCase();
      return segs.split(", ");
    }

    function enableDisableButton() {
      defineToolNum();
      if (createPolysToolActive) {
        // console.log(tempPointsArray);
        Length = tempPointsArray.length;
        var enableBool = Length > 2 ? true : false;
        enableButton(1, enableBool);
        // console.log("create button enabled?? - from add listener:", enableBool);
      }
    }

    function manageToolChange() {
      // console.log("tabOrder   in    manageToolChange", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);

      defineToolNum();

      enableButton(2, false);
      var selectableOrNot = false;

      if (!editVertsToolActive) {
        makePointsSmall(false); // selectableBool == false
        updateAllPointsArray();
        allPolyPoints.forEach(function (element) {
          ggbObject.setFixed(element, false, false);
        });
        // console.log("in manageToolChange - points are not selectable");
      }

      // When the tool is changed away from delete polys, reset the shading of any polys that may have been marked for deletion & show poly points again
      var allPoints = ggbObject.getAllObjectNames("point");

      if (addVertsToolActive || deletePolysToolActive) {
        allPoints.forEach(function (element) {
          // console.log("point element", element);
          if (element.includes("NewPoint")) {
            // hide poly points when add Verts or delete Polys is chosen
            ggbObject.setVisible(element, false);
          }
        });
        if (addVertsToolActive) {
          ggbObject.setValue("showFollow", true);
          // show poly segments and make them selectable when add Verts is chosen
          allPolySegs.forEach(function (element) {
            ggbObject.setVisible(element, true);
            ggbObject.setFixed(element, false, false);
          });
        }
      } else if (!deletePolysToolActive) {
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
      if (!addVertsToolActive) {
        console.log("addVertsTool is Inactive");
        ggbObject.setValue("showFollow", false);
        updateAllPolySegs();
        allPolySegs.forEach(function (element) {
          ggbObject.setLineThickness(element, regLineThickness);
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
      // Find the "first" nonActive polys
      nonActiveFirstPolys = sortedPolys.filter(function (el, index) {
        const activeIndex = sortedPolys.indexOf(activePoly);
        return !activePoly.includes(el) && index < activeIndex;
      });

      // console.log("nonActiveFirstPolys", nonActiveFirstPolys);

      // Find the "last" active poly
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
        // const nonActivePolyPoints = allPolyPoints.filter(function (el) {
        //   return el.includes("NewPoint") && !el.includes("White") && !activePolyPointsArray.includes(el);
        // });
        // console.log("activePolyPointsArray", activePolyPointsArray);
        activePolyPointsArray.forEach(function (element) {
          addedList = manageAddedList(element, true);
        });
      }

      // >>>>>>>> Added List (3(b) of 4) - active segments <<<<<<<<
      // only add segments to tabOrder if "Add Vertices" is selected
      if (addVertsToolActive) {
        updateAllPolySegs();

        // const nonActivePolySegs = allPolySegs.filter(function (el) {
        //   return !activePolySegsArray.includes(el);
        // });
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
      const allPolys = ggbObject
        .getAllObjectNames("triangle")
        .concat(
          ggbObject.getAllObjectNames("quadrilateral"),
          ggbObject.getAllObjectNames("pentagon"),
          ggbObject.getAllObjectNames("hexagon"),
          ggbObject.getAllObjectNames("polygon")
        );

      // console.log("allPolys unsorted", allPolys);
      const sortAlphaNum = (a, b) =>
        a.localeCompare(b, "en", {
          numeric: true,
        });
      let sortedPolys = allPolys.sort(sortAlphaNum);
      let siftedAndSortedPolys = sortedPolys.filter(function (el) {
        return el.includes("Gon") && !el.includes("White");
      });
      // console.log("allPolys siftedAndSortedPolys", siftedAndSortedPolys);
      return siftedAndSortedPolys;
    }

    function deletePolygons() {
      // console.log("DELETE POLYS");
      // console.log("tabOrder before", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);

      var pointsToDelete = [];
      polysToDelete.forEach(function (element) {
        pointsToDelete = pointsToDelete.concat(getPointsArrayFromPolyName(element));
      });
      // console.log("pointsToDelete", pointsToDelete);

      polysToDelete.forEach(function (element) {
        addedList = manageAddedList(element, false);
        // ggbObject.setTextValue("addedList", "");
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
      // const xFollow = ggbObject.getXcoord("Follow");
      // const yFollow = ggbObject.getYcoord("Follow");
      // console.log("Follow", xFollow, yFollow);
    }

    function segmentHover() {
      const distances = [];
      allPolySegs.forEach(function (element) {
        ggbObject.setLineThickness(element, regLineThickness);
        ggbObject.evalCommand("dist = Distance(Follow," + element + ")");
        const dist = ggbObject.getValue("dist");
        distances.push(dist);
      });
      // console.warn("distances,", distances);
      const min = Math.min.apply(null, distances);
      // console.log(min);
      if (min < 1) {
        const indexMin = distances.indexOf(min);
        // console.log("indexMin", indexMin, "allPolySegs indexMin:", allPolySegs[indexMin]);

        ggbObject.setLineThickness(allPolySegs[indexMin], hoverLineThickness);
        hoverSeg = allPolySegs[indexMin];
      } else {
        hoverSeg = "";
      }
      // console.log("hoverSeg", hoverSeg);
    }

    function showMidpoint(seg) {
      tempMdpt = ggbObject.evalCommandGetLabels("Midpoint(" + seg + ")");
      ggbObject.setPointStyle(tempMdpt, 2);
      ggbObject.setPointSize(tempMdpt, 5);
      ggbObject.setLayer(tempMdpt, addVertPointLayer);
      ggbObject.setColor(tempMdpt, 255, 255, 255);
      ggbObject.setFixed(tempMdpt, true, false);
      console.log("tempMdpt created", tempMdpt);
    }

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

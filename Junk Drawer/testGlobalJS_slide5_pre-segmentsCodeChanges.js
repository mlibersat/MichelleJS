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
    registerHoverListener();
    // registerSafeObjectUpdateListener("toolNum", function () {
    // console.log("update listener fired");
    // });

    var click = 0;
    var pointsArray = [];
    var Length = 0;
    var selectedObject = "";
    var createdPolys = [];
    var createdWhitePolys = [];
    var activePoly = "";
    var activePolyPointsArray = [];
    var polysToDelete = [];

    var toolNum;

    defineToolNum();

    function defineToolNum() {
      toolNum = ggbObject.getValue("toolNum");
    }

    var nonActiveFirstPolys = [];
    var nonActiveLastPolys = [];

    const initList = " polygonTools, Stamp";
    var addedList = "";
    var enders = "ggbButton1, ggbButton2, showGrid, showAxes, showArea, view";

    const pointLayer = 3;
    const pointSizeSmall = 4;
    const whitePointSizeSmall = 5;
    const pointSizeBig = 6;
    const whitePointSizeBig = 7;
    const polyLayer = 2;

    if (ggbObject.getValue("Length(tabOrder)") === 0) {
      setTabOrder(initList, addedList, enders);
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
          : unavailableButtonText, // COME BACK TO THIS - how will the student mark the polygon for deletion? Can the student just press the "backspace" key?
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
          }
          break;
        case "mouseDown":
          {
            var hitTarget = a.hits[0];
            // console.log("mouseDown - hitTarget", hitTarget);

            switch (toolNum) {
              case 1:
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
              case 2:
                {
                  if (ggbObject.getObjectType(hitTarget) === "point" || createdPolys.includes(hitTarget)) {
                    detectAndStyleActivePolyPoints(hitTarget);
                    manageTabOrder(selectedObject);
                  }
                }

                break;
              // case 3:
              //   {
              //     //
              //   }

              //   break;

              default:
                break;
            }
          }
          break;
        case "dragEnd":
          {
            // console.log("dragEnd - selectedObject", selectedObject);

            if (toolNum === 1 && stampClicked) {
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
          }
          break;
      }
    }

    function clickListenerFunction(a) {
      // console.log("click listener,", a);
      // console.log("click - a", a);

      if (createdPolys.includes(a)) {
        activePolyPointsArray = getPointsArrayFromPolyName(a);
      }

      if (toolNum === 1 && a === "Stamp") {
        // console.log("makePoints called from clickListener");
        makePoints();
      }

      if (((toolNum === 2 || toolNum === 3) && createdPolys.includes(a)) || activePolyPointsArray.includes(a)) {
        detectAndStyleActivePolyPoints(a);
        manageTabOrder(a);

        if (toolNum === 3) {
          stylePoly(a);
        }
      }
    }

    function stylePoly(obj) {
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
      //     if (selectedObject === "Stamp" && toolNum === 1) {
      //       makePoints();
      //     }
      //     // else if (toolNum === 2 && createdPolys.includes(selectedObject)) {
      //     //   // activePolyPointsArray.forEach(function (element) {
      //     //   detectAndStyleActivePolyPoints(selectedObject);
      //     //   // });
      //     // }
      //     break;
      // }
    }

    function makePoints() {
      click++;
      var stampX = ggbObject.getXcoord("Stamp");
      var stampY = ggbObject.getYcoord("Stamp");
      var newPointName = "NewPoint".concat(click);
      var newWhitePointName = newPointName.concat("White");

      ggbObject.evalCommand(newPointName.concat("=(", stampX, ",", stampY, ")"));
      ggbObject.evalCommand(newWhitePointName.concat("=", newPointName, ""));

      ggbObject.setPointSize(newPointName, pointSizeSmall);
      ggbObject.setPointSize(newWhitePointName, whitePointSizeSmall);
      ggbObject.setColor(newWhitePointName, 255, 255, 255);
      ggbObject.setLayer(newPointName, pointLayer);
      ggbObject.setLayer(newWhitePointName, pointLayer - 1);
      ggbObject.setFixed(newPointName, false, false);
      ggbObject.setFixed(newWhitePointName, false, false);
      pointsArray.push(newPointName);
      setIncrement(newPointName);
      Length = pointsArray.length;
      enableDisableButton();
      console.warn("new point:", newPointName);
    }

    function makePoly() {
      // console.log("in makePoly - tabOrder", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);

      // console.log("pointsArray", pointsArray);
      var createdPolysNum = createdPolys.length;
      var createdWhitePolysNum = createdPolys.length;
      var newPolyName = "polyGon".concat(createdPolysNum + 1);
      var newWhitePolyName = "polyGon".concat(createdWhitePolysNum + 1, "White");

      // reorder points to make convex poly
      const points = Array.from(pointsArray, (el) => ({
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
        {
          x: 0,
          y: 0,
        }
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
      // console.log("pointsArraySorted", pointsSorted);

      function getFields(input, field) {
        var output = [];
        for (var i = 0, L = input.length; i < L; ++i) output.push(input[i][field]);
        return output;
      }

      pointsArray = getFields(pointsSorted, "name");
      // console.log("pointsArray names???", pointsArray);

      // create the convex poly using the new order of points in pointsArray
      createdPolys.push(ggbObject.evalCommandGetLabels(newPolyName.concat("=Polygon({", pointsArray, "})")));
      // console.log("created polys", createdPolys);

      // create polys in GGB

      setLineOpacity(newPolyName);
      createdWhitePolys.push(ggbObject.evalCommandGetLabels(newWhitePolyName.concat("=Polygon(", pointsArray, ")")));
      ggbObject.setLayer(newPolyName, polyLayer);
      ggbObject.setFilling(newPolyName, 0.35);
      ggbObject.setFixed(newPolyName, false, false);
      // console.log("poly created in GGB");

      // create white polys
      setLineOpacity(newWhitePolyName);
      ggbObject.setLineThickness(newWhitePolyName, 8);
      ggbObject.setLayer(newWhitePolyName, polyLayer - 1);
      ggbObject.setColor(newWhitePolyName, 255, 255, 255);
      // ggbObject.setFilling(newWhitePolyName, 1);
      ggbObject.setFixed(newWhitePolyName, false, false);
      // console.log("white poly created in GGB");

      pointsArray = [];
      // console.log("in makePoly -before manageAddedList - tabOrder", ggbObject.getDefinitionString("tabOrder"));

      //////////COME BACK TO THIS//////////// <-- how can I get it to not delete any elements already in addedList?
      // console.log("addedList before manageAdded", addedList);
      addedList = manageAddedList(newPolyName, true); // add the polys to the tab order, but they remain nonselectable until tool drop down is edit or delete
      // addedList = addedList.concat(", ", manageAddedList(newPolyName, true)); // add the polys to the tab order, but they remain nonselectable until tool drop down is edit or delete
      // if (!addedList.includes(newPolyName)) {
      //   addedList = addedList.concat(", ", manageAddedList(newPolyName, true));
      // } // add the polys to the tab order, but they remain nonselectable until tool drop down is edit or delete
      // console.log("addedList after manageAdded", addedList);

      setTabOrder(initList, addedList, enders);
      // console.log("manageAddedList and setTabOrder");
      // console.log("end makePoly - tabOrder AFTER", ggbObject.getDefinitionString("tabOrder"));
      getSegmentList();
    }

    function getSegmentList() {
      const allPolySegs = ggbObject.getAllObjectNames("segment").filter(function (el) {
        return el.includes("newpoint");
      });
      console.log("allSegs", allPolySegs);
    }

    function setIncrement(a) {
      var xmlstring = ggbObject.getXML(a);
      xmlstring = xmlstring.slice(xmlstring.indexOf("/>") + 2);
      var parser = new DOMParser();
      var xmldom = parser.parseFromString(xmlstring, "application/xml");
      xmldom.getElementsByTagName("animation")[0].setAttribute("step", "0.5");
      var serializer = new XMLSerializer();
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

    // detect active polygon, make all points associated with the polygon big and all others small. (all are selectable but not all in tab cycle)
    // Called on: space press of poly, on mouseDown of point or poly, and on click of point or poly
    function detectAndStyleActivePolyPoints(obj) {
      const pointSelected = ggbObject.getObjectType(obj) === "point";
      const polySelected = createdPolys.includes(obj);

      var polyDefString = "";

      makePointsSmall(true); // selectableBool == true

      // if a poly is selected, make its vertices big
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

        activePolyPointsArray.forEach(function (element) {
          ggbObject.setFixed(element, false, true);
          ggbObject.setPointSize(element, pointSizeBig);
          ggbObject.setPointSize(element.concat("White"), whitePointSizeBig);
        });
      }
    }

    function makePointsSmall(selectableBool) {
      var allPoints = ggbObject.getAllObjectNames("point");

      // filter out anything that doesn't contain "NewPoint" and anything that does contain "White"
      const polyPoints = allPoints.filter(function (el) {
        return el.includes("NewPoint") && !el.includes("White");
      });
      // make all vertices small ("active" vertices will be made big in next step)
      polyPoints.forEach(function (element) {
        ggbObject.setFixed(element, false, selectableBool);
        ggbObject.setPointSize(element, pointSizeSmall);
        ggbObject.setPointSize(element.concat("White"), whitePointSizeSmall);
      });
    }

    function getPointsArrayFromPolyName(poly) {
      var polyDefString = ggbObject.getDefinitionString(poly);
      var polyPointsString = polyDefString.substring(9, polyDefString.length - 1);
      return polyPointsString.split(", ");
    }

    function enableDisableButton() {
      defineToolNum();
      if (toolNum === 1) {
        console.log(pointsArray);
        Length = pointsArray.length;
        var enableBool = Length > 2 ? true : false;
        enableButton(1, enableBool);
        console.log("create button enabled?? - from add listener:", enableBool);
      }
    }

    function manageToolChange() {
      // console.log("tabOrder   in    manageToolChange", ggbObject.getDefinitionString("tabOrder"));
      // console.log("addedList", addedList);

      defineToolNum();
      console.log("toolChange:", toolNum);

      enableButton(2, false);
      var selectableOrNot = false;

      if (toolNum !== 2) {
        makePointsSmall(false); // selectableBool == false
      }

      // When the tool is changed away from delete polys, reset the shading of any polys that may have been marked for deletion & show poly points again
      var allPoints = ggbObject.getAllObjectNames("point");

      if (toolNum !== 3) {
        polysToDelete.forEach(function (element) {
          ggbObject.evalCommand("SetDecoration(" + element + ", 0)");
        });
        polysToDelete = [];

        allPoints.forEach(function (element) {
          if (element.includes("NewPoint")) {
            ggbObject.setVisible(element, true);
          }
        });
      } else {
        // console.log("delete tool");
        // when the tool is changed to delete, hide all poly points
        allPoints.forEach(function (element) {
          // console.log("point element", element);
          if (element.includes("NewPoint")) {
            ggbObject.setVisible(element, false);
          }
        });
      }

      // When the tool is changed away from create polys, delete any stray points that may have been created and not made into a poly and disable create button.
      if (toolNum !== 1) {
        enableButton(1, false);
        console.log("create button disabled - from manageToolChange");

        selectableOrNot = toolNum === 0 ? false : true;
        // console.warn("pointsArray before", pointsArray);
        // console.warn("tabOrder before", ggbObject.getDefinitionString("tabOrder"));
        if (pointsArray.length !== 0) {
          pointsArray.forEach(function (element) {
            ggbObject.deleteObject(element);
            ggbObject.deleteObject(element + "White");
          });
          pointsArray = [];
        }
        // console.log(">>>> pointsArray AFTER", pointsArray);
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

      // >>>>>>>> Added List (3 of 4) - active points <<<<<<<<
      // only add points to tabOrder if "Edit Vertices" is selected
      if (toolNum === 2) {
        const allPoints = ggbObject.getAllObjectNames("point");

        // filter out anything that doesn't contain "NewPoint" and anything that does contain "White"
        const nonActivePolyPoints = allPoints.filter(function (el) {
          return el.includes("NewPoint") && !el.includes("White") && !activePolyPointsArray.includes(el);
        });

        activePolyPointsArray.forEach(function (element) {
          // if (!tabOrder.includes(element)) {
          addedList = manageAddedList(element, true);
          // }
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
    ////////////

    ////////////

    ////////////////////////

    // //use var initlist = determineOrder() if using this to set up initial positioning along with setTabOrder
    // function determineOrder() {
    //   /* This part gets all of the types of objects you want sorted.
    //   Make an array called allInits that contains the objects: images, quadrilaterals, points, etc. */

    // //in this case, gets all of the visible quads whose name starts with "box"
    // var allInits = pointsArray

    // //sorts the images from the previous array based on their y-coordinate
    //   var sortedInits = allInits.sort(function (a, b) {
    //       /*This next part sets up the logic for the sort.
    //       Change it to your situation(vertical alignment based on yCoord, object name alphabetically, etc)*/

    //   //change these to whatever point names govern the position of the object if using object position as sort
    //   var aName = "NewPoint".concat(a.slice(1));
    //       var bName = "NewPoint".concat(b.slice(1));

    //   //in this case, determines which x-coord is smaller and returns a number accordingly to tell the sort which order they go in
    //   if (ggbObject.getXcoord(aName) < ggbObject.getXcoord(bName)) {
    //     return -1;
    //   }
    //   if (ggbObject.getXcoord(aName) > ggbObject.getXcoord(bName)) {
    //     return 1;
    //   }
    //   //if they are the same
    //   return 0;
    // });
    // var initList = sortedInits.join(",");
    // return initList;
    // }

    ///////////////////////

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

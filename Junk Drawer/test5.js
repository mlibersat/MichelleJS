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

    setAriaLabel(ggbcanvas, "Reflections Interactive");
    //global-ish variables

    var imageName = "";
    var thingsToIgnore = ["instructionsIcon", "xIcon"];
    var binTopY = ggbObject.getValue("binTopY");
    var binHeight = ggbObject.getValue("binHeight");
    var colors = [
      [0, 127, 175],
      [218, 41, 28],
      [0, 129, 57],
      [130, 63, 152],
      [242, 106, 54],
      [237, 178, 32],
    ]; // blue, red, green, purple, orange, and yellow
    var sketchToolObjects = [];
    //variables for sketch tool with ggb toolbar
    var storedTool = ggbObject.getMode();

    var testObject = {};

    var imageArray = ["Car", "Fish", "Shoe"];
    // var imageWidth = []; // [2, 2, 2]
    var imagePointNames = ["Start", "End", "RefX", "RefY"];
    // var imageMinX = -6;
    // var imageMaxX = 6;
    // var imageMinY = -4.5;
    // var imageMaxY = 4.5;

    imageArray.forEach(function (el1) {
      // get image widths
      // imageWidth.push(ggbObject.getValue(el1.concat('Width')));
      // console.log(imageWidth);
      // set points to anchor
      var tempAnchorName = el1.concat("Anchor");
      var tempXBL = ggbObject.getXcoord(tempAnchorName);
      var tempXBR = tempXBL + ggbObject.getValue(el1.concat("Width"));
      var tempY = ggbObject.getYcoord(tempAnchorName);
      imagePointNames.forEach(function (el2) {
        ggbObject.setCoords(el1.concat(el2, "BL"), tempXBL, tempY);
        ggbObject.setCoords(el1.concat(el2, "BR"), tempXBR, tempY);
      });
    });
    if (ggbObject.getValue("pictureTool") === 1) {
      showPictureTool();
    } else {
      showSketchTool();
    }

    function defineStatusName() {
      // put the name of your GGB status text object here
      return "AAppletStatus";
    }

    // listeners here; keep these, add your own as needed
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

    ggbObject.registerAddListener(views);

    // registerSafeObjectUpdateListener("displayedKeyboardInstructions", function () {
    // });

    function defineButtonClickScripts() {
      // defines button scripts
      // keep this function, but you can delete anything/everything inside it
      return {
        ggbButton1: function () {
          //show the sketch tool
          showSketchTool();
          enableButton(1, false);
          enableButton(2, true);
          ggbReadText(
            "The Sketch Tool has not been optimized for accessibility. For the accessible version of this learning experience navigate to the Picture Tool."
          );
          ggbObject.setValue("pictureTool", false); //keeps track of which tool they are using
        },
        ggbButton2: function () {
          console.log("ggbButton2");
          //show the picture tool
          showPictureTool();
          enableButton(1, true);
          enableButton(2, false);
          console.log("picture tool before");
          console.log(ggbObject.getValue("pictureTool"));
          ggbObject.setValue("pictureTool", true);
          console.log("picture tool after");
          console.log(ggbObject.getValue("pictureTool"));
          //keeps track of which tool they are using
        },
        ggbButton3: function () {
          reset();
        },
        ggbButton4: function () {},
        ggbButton5: function () {},
      };
    }

    function defineKeyboardInstructions(obj) {
      // takes a GGB object name as an argument, returns its keyboard text.
      // if the reflections are showing AND above the bin "Use the arrow keys to move the image."
      // if the reflections are showing AND below the bin "Use the arrow keys to move the image. Press space to reset the image."
      // if reflections are not shown AND above the bin "Use the arrow keys to move the image. Press space to reflect the image."
      // if reflections are not shown AND below the bin "Image is in bin. Use the arrow keys to move the image."
      if (ggbObject.getObjectType(obj) === "image") {
        //return "Use the arrow keys to move the image.";
        var ReflectionsShowing = ggbObject.getValue("show".concat(obj, "Reflections")) === 1;
        var isAboveBin = ggbObject.getYcoord(obj.concat("EndBL")) >= binTopY;
        var inBinString = "Image is in bin. ";
        var useArrowKeyString = "Use the arrow keys to move the image. ";
        var resetString = "Press space to reset the image. ";
        var reflectString = "Press space to reflect the image. ";

        return "".concat(
          isAboveBin ? inBinString : "",
          useArrowKeyString,
          ReflectionsShowing && !isAboveBin ? resetString : !ReflectionsShowing && isAboveBin ? reflectString : ""
        );
      }
      const keyboardInstructions = {
        ggbButton1: ggbObject.getValue("ggbButton1Enabled")
          ? "Press space to use the Sketch Tool."
          : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled")
          ? "Press space to use the Picture Tool."
          : unavailableButtonText,
        ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to reset your work." : unavailableButtonText,
        ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
      };
      return keyboardInstructions[obj];
    }

    var selectedObject = "";

    function checkForMaxMinDragSituation() {
      const selectedObjectXCoord = ggbObject.getXcoord(selectedObject);
      const selectedObjectYCoord = ggbObject.getYcoord(selectedObject);

      const atMinX = selectedObjectXCoord === ggbObject.getValue("imageMinX");
      const atMaxX = selectedObjectXCoord === ggbObject.getValue("imageMaxX2");
      const atMinY = selectedObjectYCoord === ggbObject.getValue("imageMinY");
      const atMaxY = selectedObjectYCoord === ggbObject.getValue("imageMaxY");

      const atXMinOrMax = atMinX || atMaxX;
      const atYMinOrMax = atMinY || atMaxY;

      const situation =
        !atXMinOrMax && !atYMinOrMax
          ? "neither"
          : atXMinOrMax && !atYMinOrMax
          ? atMinX
            ? "atMinX"
            : "atMaxX"
          : !atXMinOrMax && atYMinOrMax
          ? atMinY
            ? "atMinY"
            : "atMaxY"
          : "at".concat(atMinX ? "MinX" : "MaxX", "and", atMinY ? "MinY" : "MaxY");
      console.log(situation);

      const stemObj = {
        atMinX: "minimum x",
        atMaxX: "maximum x",
        atMinY: "minimum y",
        atMaxY: "maximum y",
        atMinXandMinY: "minimum x and y",
        atMinXandMaxY: "minimum x value and maximum y",
        atMaxXandMinY: "maximum x value and minimum y",
        atMaxXandMaxY: "maximum x and y",
      };

      return situation === "neither"
        ? ""
        : " This point is at its ".concat(stemObj[situation], " value for this interactive.");
    }

    //client listener function that creates new images when they're pulled out of the bin and deletes them when they're put back in
    function clientFunction(event) {
      // var clientTarget = event.target && !"instructionsIcon" && !"xIcon";
      // var ggbReadTextStringStarter = ggbObject.getValueString(
      //   clientTarget.concat("Text")
      // );
      // var minMaxLanguageString = checkForMaxMinDragSituation();
      switch (event.type) {
        case "select": {
          if (thingsToIgnore.includes(event.target)) {
            return;
          }
          imageName = event.target;
          imageReadText();
          break;
        }
        case "deselect":
          deselectDragEndOrSpace();
          break;
        case "dragEnd":
          //need to know if object is in the bin or not.
          deselectDragEndOrSpace();
          // selectedObject == clientTarget;
          // if (imageArray.includes(clientTarget)) {
          //   ggbReadText(ggbReadTextStringStarter.concat(minMaxLanguageString));
          // }
          break;
      }
    }

    function goHomeReadText() {
      ggbReadText("inBinDeselect".concat(imageName));
    }

    function deselectDragEndOrSpace() {
      if (imageArray.includes(imageName)) {
        if (ggbObject.getYcoord(imageName.concat("EndBL")) >= binTopY) {
          //imageAboveBin(imageName);
          ggbObject.setValue("show".concat(imageName, "Reflections"), 1);
          imageReadText();
        } else {
          goHomeReadText();
          imageBelowBin(imageName);
        }
      }
    }

    function imageReadText() {
      console.log("in imageReadText");
      console.log("imageName");
      console.log(imageName);
      //"[image] is at (,). [Image] reflected across the x axis is at (,) and across the y axis at (,)."
      //"[image] is in the bin. Press space to reset the image."
      //"[image] is at (,). Press space to reflect the image across the x and y axis." (not activated)
      var xOfStart = ggbObject.getXcoord(imageName.concat("StartBL"));
      var xOfEnd = ggbObject.getXcoord(imageName.concat("EndBL"));
      var yOfStart = ggbObject.getYcoord(imageName.concat("StartBL"));
      var yOfEnd = ggbObject.getYcoord(imageName.concat("EndBL"));
      if (xOfStart === xOfEnd && yOfStart === yOfEnd) {
        console.log("in true of if statement; image is at start");
        //if at start
        ggbReadText("inBinSelect".concat(imageName));
      } else {
        console.log("in false of if statement; image is not at start");

        var inBin = ggbObject.getValue(imageName.concat("InBin")) === 1;
        var reflectionShown = ggbObject.getValue("show".concat(imageName, "Reflections")) === 1;
        var switchStatementConditions = inBin ? "inBin" : reflectionShown ? "reflections shown" : "no reflection";
        switch (switchStatementConditions) {
          case "inBin": {
            ggbReadText("text".concat(imageName));
            break;
          }
          case "reflections shown": {
            ggbReadText("reflectText".concat(imageName));
            break;
          }
          case "no reflection": {
            ggbReadText("text".concat(imageName));
            break;
          }
          default: {
            console.log("error in imageReadText switch statement");
            break;
          }
        }
      }
    }

    function clickListenerFunction(a) {
      // switch (a) {}
    }

    function keyit(event) {
      console.log(event);
      // you clicked a key while fish, car, or shoe is selected
      if (imageArray.includes(imageName)) {
        // var tempPointNameBL = imageName.concat('EndBL');
        // var tempPointNameBR = imageName.concat('EndBR');
        // var tempX = ggbObject.getXcoord(tempPointNameBL);
        // var tempY = ggbObject.getYcoord(tempPointNameBL);
        switch (event.code) {
          case "ArrowUp":
            // if (ggbObject.getValue(imageName.concat('InBin')) === 1) {
            //   var tempYAdjustedHeight = tempY + binHeight;
            //   console.log('in arrow up function');
            //   ggbObject.setCoords(tempPointNameBL, tempX, tempYAdjustedHeight);
            //   ggbObject.setCoords(
            //     tempPointNameBR,
            //     tempX + imageWidth[imageArray.indexOf(imageName)],
            //     tempYAdjustedHeight
            //   );
            // } else {
            //   console.log('not in bin');
            // }

            console.log("in ArrowUp");
            console.log("imageName");
            console.log(imageName);
            imageReadText();
            break;
          case "ArrowDown":
            console.log("in ArrowDown");
            imageReadText();
            break;
          case "ArrowLeft":
            console.log("in ArrowLeft");
            imageReadText();
            // if (tempX <= imageMinX) {
            //   ggbObject.setCoords(tempPointNameBL, imageMinX, tempY);
            //   ggbObject.setCoords(
            //     tempPointNameBR,
            //     imageMinX + imageWidth[imageArray.indexOf(imageName)],
            //     tempY
            //   );
            // }
            break;
          case "ArrowRight":
            console.log("in ArrowRight");
            imageReadText();
            // var tempAdjustedX =
            //   imageMaxX - imageWidth[imageArray.indexOf(imageName)];
            // if (tempX >= tempAdjustedX) {
            //   ggbObject.setCoords(tempPointNameBL, tempAdjustedX, tempY);
            //   ggbObject.setCoords(tempPointNameBR, imageMaxX, tempY);
            // }
            break;
          case "Space":
            console.log("in Space");
            deselectDragEndOrSpace();
            break;
          case "Tab":
            console.log("in Tab");
            break;

          default:
            console.log("in default");
            break;
        }
      }
    }

    function views(a) {
      //a is "penstroke1"
      //Fires when addListener fires, something is added to GeoGebra - a is the new object added
      var myTempArray = ["reflectx".concat(a), "reflecty".concat(a)];
      //myTempArray=["reflectXPenstroke1", "reflectYPenstroke1"]
      if (!a.includes("reflect") && ggbObject.getObjectType(a) == "penstroke") {
        ggbObject.setLayer(a, 1);
        myTempArray.forEach(function (el, index) {
          var myIndex = index === 0;
          //reflectXPenstroke1= Reflect
          ggbObject.evalCommand(el.concat("=Reflect(", a, ", ", myIndex ? "x" : "y", "Axis)"));
          ggbObject.setLineStyle(el, myIndex ? 1 : 3);
          ggbObject.setColor(el, ...colors[myIndex ? 0 : 1]);
          ggbObject.setFixed(el, false, false);
          ggbObject.setLayer(el, 0);
        });
      }
    }

    //function that gets the vertical order of images on the screen if they contain the word "Movable"
    function determineImageOrder() {
      //gets all of the visible images with "Movable" in their name
      var allInits = ggbObject.getAllObjectNames("image").filter(function (element) {
        return element.startsWith("Movable") && ggbObject.getVisible(element);
      });
      //sorts the images from the previous array based on their y-coordinate
      var sortedInits = allInits.sort(function (a, b) {
        //cuts off the "Movable" part of the name so that we can find the coordinate of a related point
        let aName = a.slice(7);
        let bName = b.slice(7);
        //determines which y-coord is bigger and returns a number accordingly to tell the sort which order they go in
        if (ggbObject.getYcoord(aName.concat("StartBL")) > ggbObject.getYcoord(bName.concat("StartBL"))) {
          return -1;
        }
        if (ggbObject.getYcoord(aName.concat("StartBL")) < ggbObject.getYcoord(bName.concat("StartBL"))) {
          return 1;
        }
        // a must be equal to b
        return 0;
      });
      var initList = sortedInits.join(",").concat(",");
      return initList;
    }

    // function imageAboveBin(tempImageName) {
    //   ggbObject.setVisible(tempImageName.concat("RefX"), true);
    //   ggbObject.setVisible(tempImageName.concat("RefY"), true);
    // }

    function imageBelowBin(tempImageName) {
      ggbObject.setValue("show".concat(tempImageName, "Reflections"), 0);
      var tempStartBL = tempImageName.concat("StartBL");
      var tempStartBR = tempImageName.concat("StartBR");
      ggbObject.setCoords(
        tempImageName.concat("EndBL"),
        ggbObject.getXcoord(tempStartBL),
        ggbObject.getYcoord(tempStartBL)
      );
      ggbObject.setCoords(
        tempImageName.concat("EndBR"),
        ggbObject.getXcoord(tempStartBR),
        ggbObject.getYcoord(tempStartBR)
      );
      imageName = "";
    }

    function reset() {
      if (ggbObject.getValue("pictureTool") === 1) {
        //user is on pictureTool
        imageArray.forEach(function (el) {
          imageBelowBin(el);
        });
      } else {
        //user is on sketchTool
        if (sketchToolObjects.length > 0) {
          sketchToolObjects.forEach(function (el) {
            ggbObject.deleteObject(el);
            ggbObject.setMode(62);
          });
        }
        sketchToolObjects = [];
      }
      //setTabOrder(initList, "");
    }

    function showSketchTool() {
      //called on button click
      //this function will need to hide all of the objects used for the picture tool (bin, images, segments, etc.) and then show any saved sketches and the toolbar
      imageArray.forEach(function (el) {
        ggbObject.setVisible(el, false);
        ggbObject.setVisible(el.concat("RefX"), false);
        ggbObject.setVisible(el.concat("RefY"), false);
      });
      ggbObject.setVisible("bin", false);
      ggbObject.setVisible("binBorder", false);
      if (sketchToolObjects.length > 0) {
        sketchToolObjects.forEach(function (element) {
          ggbObject.setVisible(element, true);
        });
      }
      ggbObject.showToolBar(true);
      ggbObject.setMode(62);
      ggbObject.registerAddListener(addedSketch);
      storedTool = ggbObject.getMode(); //will be 0
      // ggbObject.registerObjectUpdateListener("Follow", getYCoord);
    }

    function showPictureTool() {
      //called on button click
      //this function will need to hide all of the objects used for the sketch tool (toolbar and sketches) and then show objects used for the picture tool (bin, images, etc.)
      ggbObject.unregisterAddListener(addedSketch);
      if (sketchToolObjects.length > 0) {
        sketchToolObjects.forEach(function (element) {
          ggbObject.setVisible(element, false);
        });
      }
      ggbObject.showToolBar(false);
      ggbObject.setMode(0);
      imageArray.forEach(function (el) {
        ggbObject.setVisible(el, true);
        if (ggbObject.getYcoord(el.concat("EndBL")) >= binTopY) {
          // imageAboveBin(el);
          // ggbObject.setValue("show".concat(imageName,"Reflections"), 1);
        }
      });
      ggbObject.setVisible("bin", true);
      ggbObject.setVisible("binBorder", true);
    }

    function addedSketch(a) {
      if (ggbObject.getObjectType(a) === "penstroke") {
        sketchToolObjects.push(a);
      }
    }

    //all new functions above this line
  });

  /*
   * IGNORE BELOW
   */
  function loadUtils() {
    function parseJS(JSString) {
      return Function("".concat(JSString))();
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

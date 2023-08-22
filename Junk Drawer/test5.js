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

    setAriaLabel(ggbcanvas, "Actividad interactiva de El arte de cerca");

    //global-ish variables
    let selectedObject = "";
    const stayVis = ["buttonBar", "instructionsBox", "picReg", "c"];
    const shapes = [
      ...ggbObject.getAllObjectNames("circle"),
      ...ggbObject.getAllObjectNames("quadrilateral"),
      ...ggbObject.getAllObjectNames("triangle"),
    ].filter(function (name) {
      if (!stayVis.includes(name)) {
        return name;
      }
    });

    // object used for alt text
    const shape3 = "Una figura con 3 lados.";
    // const shape3 = "A shape with 3 sides.";
    const shape4 = "Una figura con 4 lados.";
    // const shape4 = "A shape with 4 sides.";
    const sameSize = "Todos los lados de la figura parecen ser del mismo tamaño.";
    // const sameSize = "All sides of the shape appear to be the same size.";
    const someSameSize = "Algunos lados de la figura parecen ser del mismo tamaño, pero otros son diferentes.";
    // const someSameSize = "Some sides of the shape appear to be the same size while others are different.";
    const diffSize = "Todos los lados de la figura parecen ser de diferentes tamaños.";
    // const diffSize = "All sides of the shape appear to be different sizes.";
    const altText = {
      sun: {
        shapeDesc: "Un círculo.",
        // const altText = {
        //   sun: {
        //     shapeDesc: "A circle.",
        sideDesc: "",
      },
      q24: {
        shapeDesc: shape4,
        sideDesc: sameSize,
      },
      t33: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t34: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      q17: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      t22: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t21: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      q12: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      q16: {
        shapeDesc: shape4,
        sideDesc: sameSize,
      },
      t19: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t20: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t14: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      t16: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      t15: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      t27: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      t28: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      q13: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      q10: {
        shapeDesc: shape4,
        sideDesc: sameSize,
      },
      q11: {
        shapeDesc: shape4,
        sideDesc: sameSize,
      },
      q20: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      q21: {
        shapeDesc: shape4,
        sideDesc: sameSize,
      },
      q22: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      t31: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t32: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      q6: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      t11: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t12: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      q8: {
        shapeDesc: shape4,
        sideDesc: sameSize,
      },
      q9: {
        shapeDesc: shape4,
        sideDesc: sameSize,
      },
      q7: {
        shapeDesc: shape4,
        sideDesc: sameSize,
      },
      t10: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t6: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      t13: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      t17: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      t25: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      q18: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      t26: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t24: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      q23: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      t8: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      t9: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      t7: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      q5: {
        shapeDesc: shape4,
        sideDesc: sameSize,
      },
      q4: {
        shapeDesc: shape4,
        sideDesc: sameSize,
      },
      t5: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t18: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      q14: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      t23: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t30: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t29: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t1: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      q1: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      q2: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      q3: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      t2: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      t4: {
        shapeDesc: shape3,
        sideDesc: someSameSize,
      },
      t3: {
        shapeDesc: shape3,
        sideDesc: diffSize,
      },
      q15: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
      q19: {
        shapeDesc: shape4,
        sideDesc: someSameSize,
      },
    };

    //register my listeners
    registerSafeObjectUpdateListener("time", setSpeed);

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

    function defineButtonClickScripts() {
      // defines button scripts
      // keep this function, but you can delete anything/everything inside it
      return {
        ggbButton1: function () {
          enableButton(1, false);
          enableButton(2, true);
        },
        ggbButton2: function () {
          enableButton(1, true);
          enableButton(2, false);
        },
        ggbButton3: function () {},
        ggbButton4: function () {},
        ggbButton5: function () {},
      };
    }

    function defineKeyboardInstructions(obj) {
      // takes a GGB object name as an argument, returns its keyboard text.
      if (shapes.includes(obj)) {
        return ggbObject.getValue("time") === 0
          ? "Presiona la barra de espacio para ampliar esta figura."
          : // return ggbObject.getValue("time") === 0 ? "Press space to zoom in on this shape."
            "Presiona la barra de espacio para reducirla.";
        // : "Press space to zoom out.";
      }

      const keyboardInstructions = {
        // A: "Press the arrow keys to move this point.", // example for a point
        ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
      };
      return keyboardInstructions[obj];
    }

    function clientFunction(a) {
      switch (a.type) {
        case "select": {
          selectedObject = a.target;

          if (selectedObject === "AAppletStatus") {
            updateStatus();
          }

          //set the caption of the shape when selected - depends on whether thew whole picture is shown or just the single shape.
          if (shapes.includes(selectedObject)) {
            const singleShapeBool = ggbObject.getValue("singleShape");
            if (singleShapeBool) {
              //only shape on screen
              ggbObject.setCaption(
                selectedObject,
                altText[selectedObject].shapeDesc.concat(" Presiona la barra de espacio para ampliar toda la imagen.")
              );
            } else {
              //whole picture
              ggbObject.setCaption(
                selectedObject,
                altText[selectedObject].shapeDesc.concat(" Presiona la barra de espacio para reducir la figura.")
              );
            }
          }
          break;
        }
        case "deselect":
          selectedObject = "";
          break;
      }
    }

    function clickListenerFunction(a) {
      console.log("click listener:", a);
      if (shapes.includes(a)) {
        zoom(a);
      }
    }

    function updateStatus() {
      const singleShapeBool = ggbObject.getValue("singleShape");
      const escText = ggbObject.getValueString("escText");
      let statusText = "";
      if (singleShapeBool) {
        //single shape on screen
        const singleShape = ggbObject.getAllObjectNames().filter(function (name) {
          if (ggbObject.getVisible(name) && shapes.includes(name) && !name.includes("Outline")) {
            return name;
          }
        });
        statusText = altText[singleShape].shapeDesc.concat(" ", altText[singleShape].sideDesc);
      } else {
        //whole picture on screen
        statusText =
          "Una imagen creada con distintas figuras. Hay un círculo. Hay algunas figuras con 4 lados. Hay algunas figuras con 3 lados. Algunas figuras comparten lados con otras figuras.";
        // "A picture made up of different shapes. There is 1 circle. There are some shapes with 4 sides. There are some shapes with 3 sides. Some shapes share sides with other shapes.";
      }
      ggbObject.setTextValue("AAppletStatus", statusText.concat(" ", escText));
    }

    function keyit(event) {
      // feel free to use event.key instead
      // switch (event.code) {}
      if (event.code === "Space" && shapes.includes(selectedObject)) {
        zoom(selectedObject);
      }
    }

    function zoom(a) {
      let readOutText = "";
      //set the vertList in GGB equal to its verticies so that zoom locations are accurate
      ggbApplet.evalCommand("vertList = {Vertex(".concat(a, ")}"));
      //depending on value of speed, hide or show the other shapes
      if (ggbObject.getValue("speed") === 6) {
        //zooming in
        //hide other shapes
        hideOrShow(false);
        const tempShape =
          selectedObject === "sun"
            ? "el círculo"
            : ggbObject.getObjectType(selectedObject) === "triangle"
            ? "la figura con 3 lados"
            : "la figura con 4 lados";
        // ? "circle"
        // ? "3 sided shape"
        // : "4 sided shape";
        // readOutText = "The picture zooms in to only show the ".concat(
        readOutText = "La imagen se reduce para mostrar sólo ".concat(
          // readOutText = "The picture zooms in to only show the ".concat(
          tempShape,
          ". ",
          altText[selectedObject].sideDesc,
          "Presiona la barra de espacio para ampliar toda la imagen."
          // " Press space to zoom out to show the whole picture."
        );
      } else {
        //zooming out
        //show other shapes
        hideOrShow(true);
        // readOutText =
        // "The shape zooms out to show the whole picture with all the shapes. Press space to zoom in on this shape.";
        readOutText =
          "La figura se amplía para mostrar la imagen completa con todas las figuras. Presiona la barra de espacio para ampliar esta figura.";
      }
      //start the zooming animation
      ggbObject.setAnimating("time", true);
      ggbObject.startAnimation();

      ggbReadText(readOutText);

      function hideOrShow(show) {
        shapes.forEach(function (el) {
          if (el !== selectedObject && el !== selectedObject.concat("Outline")) {
            ggbObject.setVisible(el, show);
          }
        });
      }
    }

    function setSpeed() {
      // set's the speed to positive or negative based on the value of time
      const currentTime = ggbObject.getValue("time");
      switch (currentTime) {
        case 0:
          ggbObject.stopAnimation();
          ggbObject.setAnimating("time", false);
          ggbObject.setValue("speed", 6);
          updateKeyboardInstructions(selectedObject);
          break;
        case 1:
          ggbObject.stopAnimation();
          ggbObject.setAnimating("time", false);
          ggbObject.setValue("speed", -6);
          updateKeyboardInstructions(selectedObject);
          break;
      }
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

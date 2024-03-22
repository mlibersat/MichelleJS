function ggbOnInit(name, ggbObject) {
  loadUtils().then(function (setupGGB) {
    // you may replace the following function call with the name of your status text object as a string
    // if you do, you can delete the function defineStatusName
    const statusName = defineStatusName();
    const {
      getCanvas,
      setAriaLabel,
      readKeyboardInstructions,
      updateKeyboardInstructions,
      ggbReadText,
      libClientFunction,
      libClickFunction,
      libKeyFunction,
      registerSafeObjectUpdateListener,
      registerSafeObjectClickListener,
      registerHoverListener,
      setTabOrder,
      manageAddedList,
    } = setupGGB({
      name,
      ggbObject,
      defineKeyboardInstructions,
      buttonClicks: {},
      statusName,
    });
    const ggbcanvas = getCanvas(name);

    /*
     * IGNORE above
     * EDIT below
     */

    setAriaLabel(ggbcanvas, "Product Area Model Interactive");

    let ggbContainer = document.querySelectorAll(".appletParameters,.notranslate ");
    ggbContainer[0].setAttribute("data-param-screenReaderMode", "ASCII");

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

    ggbObject.registerObjectUpdateListener("step1box1", value1A);
    ggbObject.registerObjectUpdateListener("step2box1", value2A);
    ggbObject.registerObjectUpdateListener("step2box2", value2B);
    ggbObject.registerObjectUpdateListener("step3box1", value3A);
    ggbObject.registerObjectUpdateListener("step3box2", value3B);
    ggbObject.registerObjectUpdateListener("step4box1", value4A);

    var selectedBox = "Box1A";
    var box = "Box1A";

    function defineKeyboardInstructions(obj) {
      if (ggbObject.getObjectType(obj) == "textfield" && ggbObject.getValue("error" + selectedObject)) {
        ggbObject.setColor("displayedKeyboardInstructions", 218, 41, 28);
        const errorText = ggbObject.getValueString("errorMessage");
        return errorText;
      } else if (ggbObject.getObjectType(obj) == "textfield" && ggbObject.getValue("error" + selectedObject) == false) {
        ggbObject.setColor("displayedKeyboardInstructions", 0, 0, 0);
        const quadText = ggbObject.getValueString(selectedObject + "KI");
        return quadText;
      }
      const keyboardInstructions = {
        p1: "Press tab to select next object.",
        p2: "Press tab to select next object.",
        p3: "Press tab to select next object.",
        p4: "Press tab to select next object.",
      };
      return keyboardInstructions[obj];
    }

    function clientFunction(a) {
      switch (a.type) {
        case "select":
          selectedObject = a.target;
          ggbObject.setValue("deselected", true);
          if (a.target.includes("p")) {
            ggbObject.setValue("flag", false);
            ggbObject.setVisible(a.target + "A", true);
          }
          if (ggbObject.getObjectType(a.target) == "textfield") {
            ggbObject.setTextValue("selectedBox", selectedBox);
          }
          break;
        case "deselect":
          ggbObject.setVisible("p1A", false);
          ggbObject.setVisible("p2A", false);
          ggbObject.setVisible("p3A", false);
          ggbObject.setVisible("p4A", false);
          ggbObject.setColor("displayedKeyboardInstructions", 0, 0, 0);
          break;
      }
    }

    function value1A() {
      // box is inputbox name
      let box = "Box1A";
      ggbObject.setValue("deselected", false);
      var xmlstring = ggbObject.getXML(box);
      var parser = new DOMParser();
      var xmldom = parser.parseFromString(xmlstring, "application/xml");
      var element = xmldom.getElementsByTagName("tempUserInput")[0];
      if (element === undefined) {
        ggbObject.setValue("error" + box, false);
        ggbObject.setColor("displayedKeyboardInstructions", 0, 0, 0);
        updateKeyboardInstructions(selectedBox);
      } else {
        ggbObject.setValue("error" + box, true);
        ggbObject.setColor("displayedKeyboardInstructions", 218, 41, 28);
      }
      setTimeout(function () {
        //Before and after objects
        if (selectedObject == "p1" || selectedObject == "p2") {
        } else {
          if (ggbObject.getValue("error" + box) == true) {
            //reads symbol as "warning"
            updateKeyboardInstructions(selectedBox);
          }
        }
      }, 100);
    }

    function value2A() {
      // box is inputbox name
      let box = "Box2A";
      ggbObject.setValue("deselected", false);
      var xmlstring = ggbObject.getXML(box);
      var parser = new DOMParser();
      var xmldom = parser.parseFromString(xmlstring, "application/xml");
      var element = xmldom.getElementsByTagName("tempUserInput")[0];
      if (element === undefined) {
        ggbObject.setValue("error" + box, false);
        ggbObject.setColor("displayedKeyboardInstructions", 0, 0, 0);
        updateKeyboardInstructions(selectedBox);
      } else {
        ggbObject.setValue("error" + box, true);
        ggbObject.setColor("displayedKeyboardInstructions", 218, 41, 28);
      }
      setTimeout(function () {
        //Before and after objects
        if (selectedObject == "p2" || selectedObject == "Box2B") {
        } else {
          if (ggbObject.getValue("error" + box) == true) {
            //reads symbol as "warning"
            updateKeyboardInstructions(selectedBox);
          }
        }
      }, 100);
    }

    function value2B() {
      // box is inputbox name
      let box = "Box2B";
      ggbObject.setValue("deselected", false);
      var xmlstring = ggbObject.getXML(box);
      var parser = new DOMParser();
      var xmldom = parser.parseFromString(xmlstring, "application/xml");
      var element = xmldom.getElementsByTagName("tempUserInput")[0];
      if (element === undefined) {
        ggbObject.setValue("error" + box, false);
        ggbObject.setColor("displayedKeyboardInstructions", 0, 0, 0);
        updateKeyboardInstructions(selectedBox);
      } else {
        ggbObject.setValue("error" + box, true);
        ggbObject.setColor("displayedKeyboardInstructions", 218, 41, 28);
      }
      setTimeout(function () {
        //Before and after objects
        if (selectedObject == "Box2A" || selectedObject == "p3") {
        } else {
          if (ggbObject.getValue("error" + box) == true) {
            //reads symbol as "warning"
            updateKeyboardInstructions(selectedBox);
          }
        }
      }, 100);
    }

    function value3A() {
      // box is inputbox name
      let box = "Box3A";
      ggbObject.setValue("deselected", false);
      var xmlstring = ggbObject.getXML(box);
      var parser = new DOMParser();
      var xmldom = parser.parseFromString(xmlstring, "application/xml");
      var element = xmldom.getElementsByTagName("tempUserInput")[0];
      if (element === undefined) {
        ggbObject.setValue("error" + box, false);
        ggbObject.setColor("displayedKeyboardInstructions", 0, 0, 0);
        updateKeyboardInstructions(selectedBox);
      } else {
        ggbObject.setValue("error" + box, true);
        ggbObject.setColor("displayedKeyboardInstructions", 218, 41, 28);
      }
      setTimeout(function () {
        //Before and after objects
        if (selectedObject == "p3" || selectedObject == "Box3B") {
        } else {
          if (ggbObject.getValue("error" + box) == true) {
            //reads symbol as "warning"
            updateKeyboardInstructions(selectedBox);
          }
        }
      }, 100);
    }

    function value3B() {
      // box is inputbox name
      let box = "Box3B";
      ggbObject.setValue("deselected", false);
      var xmlstring = ggbObject.getXML(box);
      var parser = new DOMParser();
      var xmldom = parser.parseFromString(xmlstring, "application/xml");
      var element = xmldom.getElementsByTagName("tempUserInput")[0];
      if (element === undefined) {
        ggbObject.setValue("error" + box, false);
        ggbObject.setColor("displayedKeyboardInstructions", 0, 0, 0);
        updateKeyboardInstructions(selectedBox);
      } else {
        ggbObject.setValue("error" + box, true);
        ggbObject.setColor("displayedKeyboardInstructions", 218, 41, 28);
      }
      setTimeout(function () {
        //Before and after objects
        if (selectedObject == "p3" || selectedObject == "Box3A") {
        } else {
          if (ggbObject.getValue("error" + box) == true) {
            //reads symbol as "warning"
            updateKeyboardInstructions(selectedBox);
          }
        }
      }, 100);
    }

    function value4A() {
      // box is inputbox name
      let box = "Box4A";
      ggbObject.setValue("deselected", false);
      var xmlstring = ggbObject.getXML(box);
      var parser = new DOMParser();
      var xmldom = parser.parseFromString(xmlstring, "application/xml");
      var element = xmldom.getElementsByTagName("tempUserInput")[0];
      if (element === undefined) {
        ggbObject.setValue("error" + box, false);
        ggbObject.setColor("displayedKeyboardInstructions", 0, 0, 0);
        updateKeyboardInstructions(selectedBox);
      } else {
        ggbObject.setValue("error" + box, true);
        ggbObject.setColor("displayedKeyboardInstructions", 218, 41, 28);
      }
      setTimeout(function () {
        //Before and after objects
        if (selectedObject == "p4") {
        } else {
          if (ggbObject.getValue("error" + box) == true) {
            //reads symbol as "warning"
            updateKeyboardInstructions(selectedBox);
          }
        }
      }, 100);
    }

    function clickListenerFunction(a) {
      switch (a) {
        case "AAppletStatus":
          ggbObject.evalCommand("ReadText(promptText)");
          break;
      }
    }

    function keyit(event) {
      // feel free to use event.key instead
      // switch (event.code) {}}
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

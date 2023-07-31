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

    ggbObject.setErrorDialogsActive(false);

    const points = ["P1A", "P2A", "P1B", "P2B"];
    const objects = ["frogSVG", "cheese1SVG", "cheese2SVG", "cheese3SVG"];
    const quizPoints = [
      "QuizPoint1",
      "QuizPoint2",
      "QuizPoint3",
      "QuizPoint4",
      "QuizPoint5",
      "QuizPoint6",
      "QuizPoint7",
      "QuizPoint8",
    ];

    const quizPointsOnALine = ["QuizPoint3", "QuizPoint4", "QuizPoint6", "QuizPoint7"];

    //"is a solution" style is 10, "not a solution" style is 1... even though the ggb documention says it is 2 for a "cross"
    const correctPoints = [10, 1, 1, 1, 1, 10, 1, 1];
    let numAttempted = 0;
    let numCorrect = 0;

    const dot = "is a dot";
    const ex = "is an x";
    const gridInt = "is a blank grid intersection";
    let currentPointStyleText; // string -en, dot, or gridInt text
    let nextPointStyleText; // string - en, dot, or gridInt text
    let pointStyle; //string - number character
    let pressSpaceText;
    // var readPointStyleText;

    let quizPointCaption;
    let pointNumber;

    const normalLineThickness = 5;
    const subtleLineThickness = 3;

    let pointReadText;
    let keyUpReadText;

    let selectedObject;
    let tabSelect;

    setAriaLabel(ggbcanvas, "Inequalities Graph Interactive");

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
      // styleIt(a);
    });
    ggbcanvas.addEventListener("keyup", function (event) {
      keyit(event);
      libKeyFunction(event);
    });
    registerSafeObjectUpdateListener("submitPressed", setObjectLayer);

    // registerSafeObjectUpdateListener("frogInFocus", frogFocusUpdated);

    // function frogFocusUpdated() {
    //   // console.log("frogInFocus");
    //   // console.log(ggbObject.getValue("frogInFocus"));
    // }

    function defineButtonClickScripts() {
      // defines button scripts
      // keep this function, but you can delete anything/everything inside it
      return {
        ggbButton1: function () {
          // button 1 code here - LockItIn
          ggbObject.setValue("locked", true);

          //slide2 lock it in
          if (ggbObject.getValue("slide2") === 1) {
            //If correct
            if (
              ggbObject.getValue("frogCompletelyInInequality1") &&
              !ggbObject.getValue("cheese1InInequality1") &&
              !ggbObject.getValue("cheese2InInequality1") &&
              !ggbObject.getValue("cheese3InInequality1")
            ) {
              ggbObject.setValue("allowLineControls", false);
              ggbObject.setLayer("P1AHelp", 3);
              ggbObject.setLayer("P1BHelp", 3);
              enableButton(1, false);
              enableButton(2, true);

              ggbObject.setLineThickness("line1", subtleLineThickness);
              ggbObject.setFixed("line1", true, false);
              ggbObject.setLineThickness("Line1Vector1", subtleLineThickness);
              ggbObject.setLineThickness("Line1Vector2", subtleLineThickness);
              ggbObject.setFixed("Line1Vector1", true, false);
              ggbObject.setFixed("Line1Vector2", true, false);

              ggbObject.setValue("showLine1Points", false);
            } else {
              //if incorrect
              enableButton(1, true);
              enableButton(2, false);

              ggbObject.setLineThickness("line1", normalLineThickness);
              ggbObject.setFixed("line1", false, true);
              ggbObject.setLineThickness("Line1Vector1", normalLineThickness);
              ggbObject.setLineThickness("Line1Vector2", normalLineThickness);
              ggbObject.setFixed("Line1Vector1", false, true);
              ggbObject.setFixed("Line1Vector2", false, true);

              ggbObject.setValue("showLine1Points", true);
            }
          }

          //slide3, 10, or 14 lock it in
          if (
            ggbObject.getValue("slide3") === 1 ||
            ggbObject.getValue("slide10") === 1 ||
            ggbObject.getValue("slide14") === 1
          ) {
            //If the slide has frog and cheese (slide 3 and 14), only lock in the student's work if they are correct
            if (
              ggbObject.getValue("slide10") === 1 ||
              (ggbObject.getValue("frogCompletelyInInequality1") &&
                ggbObject.getValue("frogCompletelyInInequality2") &&
                !(ggbObject.getValue("cheese1InInequality1") && ggbObject.getValue("cheese1InInequality2")) &&
                !(ggbObject.getValue("cheese2InInequality1") && ggbObject.getValue("cheese2InInequality2")) &&
                !(ggbObject.getValue("cheese3InInequality1") && ggbObject.getValue("cheese3InInequality2")))
            ) {
              // console.log("lock it in pressed - student graph locked, button 2 enabled");
              ggbObject.setValue("allowLineControls", false);
              ggbObject.setLayer("P1AHelp", 3);
              ggbObject.setLayer("P1BHelp", 3);
              ggbObject.setLayer("P2AHelp", 3);
              ggbObject.setLayer("P2BHelp", 3);
              enableButton(1, false);
              enableButton(2, true);
              ggbObject.setLineThickness("line1", subtleLineThickness);
              ggbObject.setLineThickness("line2", subtleLineThickness);
              ggbObject.setFixed("line1", true, false);
              ggbObject.setFixed("line2", true, false);
              ggbObject.setFixed("frogSVG", true, false);
              ggbObject.setFixed("cheese1SVG", true, false);
              ggbObject.setFixed("cheese3SVG", true, false);
              ggbObject.setFixed("cheese2SVG", true, false);
              ggbObject.setLineThickness("Line1Vector1", subtleLineThickness);
              ggbObject.setLineThickness("Line2Vector1", subtleLineThickness);
              ggbObject.setLineThickness("Line1Vector2", subtleLineThickness);
              ggbObject.setLineThickness("Line2Vector2", subtleLineThickness);
              ggbObject.setFixed("Line1Vector1", true, false);
              ggbObject.setFixed("Line1Vector2", true, false);
              ggbObject.setFixed("Line2Vector1", true, false);
              ggbObject.setFixed("Line2Vector2", true, false);
              ggbObject.setValue("showLine1Points", false);
              ggbObject.setValue("showLine2Points", false);
            } else {
              //if incorrect
              // console.log("lock it in pressed - graph not locked yet, button 1 still enabled");
              enableButton(1, true);
              enableButton(2, false);

              ggbObject.setLineThickness("line1", normalLineThickness);
              ggbObject.setLineThickness("line2", normalLineThickness);
              ggbObject.setFixed("line1", false, true);
              ggbObject.setFixed("line2", false, true);
              ggbObject.setFixed("frogSVG", false, true);
              ggbObject.setFixed("cheese1SVG", false, true);
              ggbObject.setFixed("cheese3SVG", false, true);
              ggbObject.setFixed("cheese2SVG", false, true);
              ggbObject.setLineThickness("Line1Vector1", normalLineThickness);
              ggbObject.setLineThickness("Line2Vector1", normalLineThickness);
              ggbObject.setLineThickness("Line1Vector2", normalLineThickness);
              ggbObject.setLineThickness("Line2Vector2", normalLineThickness);
              ggbObject.setFixed("Line1Vector1", false, true);
              ggbObject.setFixed("Line2Vector1", false, true);
              ggbObject.setFixed("Line1Vector2", false, true);
              ggbObject.setFixed("Line2Vector2", false, true);
              ggbObject.setValue("showLine1Points", true);
              ggbObject.setValue("showLine2Points", true);
            }
          }

          //slide4 lock it in
          if (ggbObject.getValue("slide4") === 1) {
            ggbObject.setValue("allowLineControls", false);
            ggbObject.setLayer("P1AHelp", 3);
            ggbObject.setLayer("P1BHelp", 3);
            enableButton(1, false);
            enableButton(2, true);

            ggbObject.setLineThickness("line1", subtleLineThickness);
            ggbObject.setFixed("line1", true, false);
            ggbObject.setLineThickness("Line1Vector1", subtleLineThickness);
            ggbObject.setLineThickness("Line1Vector2", subtleLineThickness);
            ggbObject.setFixed("Line1Vector1", true, false);
            ggbObject.setFixed("Line1Vector2", true, false);

            ggbObject.setValue("showLine1Points", false);
          }

          //slide5 lock it in
          if (ggbObject.getValue("slide5") === 1) {
            ggbObject.setValue("allowLineControls", false);
            ggbObject.setLayer("P2AHelp", 3);
            ggbObject.setLayer("P2BHelp", 3);
            enableButton(1, false);
            enableButton(2, true);

            ggbObject.setLineThickness("line2", subtleLineThickness);
            ggbObject.setFixed("line2", true, false);
            ggbObject.setLineThickness("Line2Vector1", subtleLineThickness);
            ggbObject.setLineThickness("Line2Vector2", subtleLineThickness);
            ggbObject.setFixed("Line2Vector1", true, false);
            ggbObject.setFixed("Line2Vector2", true, false);

            ggbObject.setValue("showLine2Points", false);
          }

          //slide8 LockItIn
          if (ggbObject.getValue("slide8") === 1) {
            numCorrect = 0;
            numAttempted = 0;
            for (let i = 1, L = 8; i <= L; i++) {
              if (
                ggbObject.getValue(`answer$ {
                                  i
                              }
                              Selected`) === 1
              ) {
                numAttempted++;
              }
            }
            // eslint-disable-next-line no-redeclare
            for (let i = 1; i < 9; i++) {
              if (
                ggbObject.getPointStyle(`QuizPoint$ {
                                  i
                              }`) == correctPoints[i - 1]
              ) {
                numCorrect++;
              }
              if (numAttempted === 8) {
                ggbObject.setFixed(
                  `QuizPoint$ {
                                  i
                              }`,
                  true,
                  false
                );
              }
            }
            // console.log("numAttempted", numAttempted);
            if (numAttempted === 8) {
              enableButton(1, false);
              enableButton(2, true);
            }
            ggbObject.setValue("numAttempted", numAttempted);
            ggbObject.setValue("numCorrect", numCorrect);
          }

          ggbReadText("button1ClickText", true);
        },
        ggbButton2: function () {
          // button 2 code here - Unlock/Start Over
          enableButton(1, true);
          enableButton(2, false);
          ggbObject.setValue("locked", false);
          //yAxis bools are not working so hide y-axis when unlock pressed
          ggbApplet.setVisible("fakeYAxis", 0);

          //slide 2 or slide 4 unlock graphs
          if (ggbObject.getValue("slide2") === 1 || ggbObject.getValue("slide4") === 1) {
            ggbObject.setValue("showLine1Points", true);
            ggbObject.setValue("allowLineControls", true);
            ggbObject.setLayer("P1AHelp", 4);
            ggbObject.setLayer("P1BHelp", 4);
            ggbObject.setFixed("line1", false, true);
            ggbObject.setFixed("Line1Vector1", false, true);
            ggbObject.setFixed("Line1Vector2", false, true);
            ggbObject.setValue("showStudentGraphVectors", false);

            ggbObject.setValue("showStudentInequality1", false);
            ggbObject.setLineThickness("line1", normalLineThickness);
            ggbObject.setValue("showContrastLine", false);

            ggbObject.setLineThickness("Line1Vector1", normalLineThickness);
            ggbObject.setLineThickness("Line1Vector2", normalLineThickness);

            ggbObject.setValue("showLine1Points", true);
            setObjectLayer();
          }

          //slide 3, 10, or 14 unlock graphs
          // console.log("slide 3,10,14 unlock - set objects selectable");

          if (
            ggbObject.getValue("slide3") === 1 ||
            ggbObject.getValue("slide10") === 1 ||
            ggbObject.getValue("slide14") === 1
          ) {
            ggbObject.setValue("showLine1Points", true);
            ggbObject.setValue("allowLineControls", true);
            ggbObject.setLayer("P1AHelp", 4);
            ggbObject.setLayer("P2AHelp", 4);
            ggbObject.setLayer("P1BHelp", 4);
            ggbObject.setLayer("P2BHelp", 4);
            ggbObject.setFixed("line1", false, true);
            ggbObject.setFixed("line2", false, true);
            ggbObject.setFixed("frogSVG", false, true);
            ggbObject.setFixed("cheese1SVG", false, true);
            ggbObject.setFixed("cheese3SVG", false, true);
            ggbObject.setFixed("cheese2SVG", false, true);
            ggbObject.setFixed("Line1Vector1", false, true);
            ggbObject.setFixed("Line2Vector1", false, true);
            ggbObject.setFixed("Line1Vector2", false, true);
            ggbObject.setFixed("Line2Vector2", false, true);
            ggbObject.setLineThickness("line1", normalLineThickness);
            ggbObject.setLineThickness("line2", normalLineThickness);
            ggbObject.setValue("showContrastLine", false);

            ggbObject.setLineThickness("Line1Vector1", normalLineThickness);
            ggbObject.setLineThickness("Line2Vector1", normalLineThickness);
            ggbObject.setLineThickness("Line1Vector2", normalLineThickness);
            ggbObject.setLineThickness("Line2Vector2", normalLineThickness);

            ggbObject.setValue("showLine1Points", true);
            ggbObject.setValue("showLine2Points", true);
          }

          //slide 5 unlock graphs
          if (ggbObject.getValue("slide5") === 1) {
            ggbObject.setValue("showLine2Points", true);
            ggbObject.setValue("allowLineControls", true);
            ggbObject.setLayer("P2AHelp", 4);
            ggbObject.setLayer("P2BHelp", 4);
            ggbObject.setFixed("line2", false, true);
            ggbObject.setFixed("Line2Vector1", false, true);
            ggbObject.setFixed("Line2Vector2", false, true);
            ggbObject.setValue("showStudentGraphVectors", false);

            ggbObject.setValue("showStudentInequality1", false);
            ggbObject.setLineThickness("line2", normalLineThickness);
            ggbObject.setValue("showContrastLine", false);

            ggbObject.setLineThickness("Line2Vector1", normalLineThickness);
            ggbObject.setLineThickness("Line2Vector2", normalLineThickness);

            ggbObject.setValue("showLine2Points", true);
          }

          //slide 8 Start Over
          if (ggbObject.getValue("slide8") === 1) {
            numAttempted = 0;
            numCorrect = 0;
            ggbObject.setValue("numAttempted", numAttempted);
            ggbObject.setValue("numCorrect", numCorrect);

            for (let i = 1; i < 9; i++) {
              ggbObject.setValue(
                `answer$ {
                                  i
                              }
                              Selected`,
                false
              );
              ggbObject.setFixed(
                `QuizPoint$ {
                              i
                          }`,
                true,
                true
              );
              ggbObject.setPointStyle(
                `QuizPoint$ {
                              i
                          }`,
                3
              );
              ggbObject.setColor(
                `QuizPoint$ {
                              i
                          }`,
                128,
                128,
                128
              );

              ggbObject.setVisible(
                `quizPoint$ {
                                  i
                              }
                              Contrast1X`,
                false
              );
              ggbObject.setVisible(
                `quizPoint$ {
                                  i
                              }
                              Contrast2X`,
                false
              );
            }
          }

          ggbReadText("button2ClickText", true);
        },
        ggbButton3: function () {},
        ggbButton4: function () {},
        ggbButton5: function () {},
      };
    }

    function defineKeyboardInstructions(obj) {
      const stepText = ggbObject.getValueString("stepText");
      const arrowText = "Press the arrow keys to move this point. ";
      const compiledStepText = arrowText.concat(stepText);
      const wrappedStepText = compiledStepText.replace(/(?![^\n]{1,38}$)([^\n]{1,38})\s/g, "$1\\\\");

      const arrowFrogCheeseText = "Press the arrow keys to move this object. ";
      const stepFrogCheeseText = ggbObject.getValueString("stepFrogCheeseText");
      const compiledFrogCheeseStepText = arrowFrogCheeseText.concat(stepFrogCheeseText);
      const wrappedFrogCheeseStepText = compiledFrogCheeseStepText.replace(
        /(?![^\n]{1,38}$)([^\n]{1,38})\s/g,
        "$1\\\\"
      );

      const keyboardInstructions = {
        P1A: wrappedStepText,
        P1B: wrappedStepText,
        P2A: wrappedStepText,
        P2B: wrappedStepText,
        frogSVG: wrappedFrogCheeseStepText,
        cheese1SVG: wrappedFrogCheeseStepText,
        cheese2SVG: wrappedFrogCheeseStepText,
        cheese3SVG: wrappedFrogCheeseStepText,
        QuizPoint1: pressSpaceText,
        QuizPoint2: pressSpaceText,
        QuizPoint3: pressSpaceText,
        QuizPoint4: pressSpaceText,
        QuizPoint5: pressSpaceText,
        QuizPoint6: pressSpaceText,
        QuizPoint7: pressSpaceText,
        QuizPoint8: pressSpaceText,
        Line1Vector1: ggbObject.getValueString("line1VectorKeyboardText"),
        Line2Vector1: ggbObject.getValueString("line2VectorKeyboardText"),
        line1: ggbObject.getValueString("line1KeyboardText"),
        line2: ggbObject.getValueString("line2KeyboardText"),

        ggbButton1: ggbObject.getValue("ggbButton1Enabled")
          ? "Press space to lock in your graph."
          : unavailableButtonText,
        ggbButton2: ggbObject.getValue("ggbButton2Enabled")
          ? ggbObject.getValueString("ggbButton2SelectText")
          : unavailableButtonText,
        ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
        ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
      };
      return keyboardInstructions[obj];
    }

    function clientFunction(a) {
      const clientTarget = a.target;
      switch (a.type) {
        case "select":
          selectedObject = clientTarget;

          if (clientTarget === "frogSVG") {
            ggbObject.setValue("frogInFocus", true);
          } else if (clientTarget === "cheese1SVG") {
            ggbObject.setValue("cheese1InFocus", true);
          } else if (clientTarget === "cheese2SVG") {
            ggbObject.setValue("cheese2InFocus", true);
          } else if (clientTarget === "cheese3SVG") {
            ggbObject.setValue("cheese3InFocus", true);
          }

          pointNumber = ggbObject.getValueString(clientTarget).substr(9, 1);
          // updateKeyboardInstructions(clientTarget);

          //select points P1A, P1B, P2A, P2B
          if (points.includes(clientTarget)) {
            // console.log("tabSelect", tabSelect);
            // do not pass go, do not collect $200 - if lines are not shown because movable points coincide- don't read screader text for point selection
            const line1Shown = ggbObject.getValue("line1IsLine");
            const line2Shown = ggbObject.getValue("line2IsLine");
            if (line1Shown === 0 || line2Shown === 0) {
              if (line1Shown === 0) {
                if (clientTarget === "P1A") {
                  ggbObject.evalCommand(
                    'ReadText("Line A B is hidden because this point coincides with point B. Please move this point to reveal line A B...")'
                  );
                } else if (clientTarget === "P1B") {
                  ggbObject.evalCommand(
                    'ReadText("Line A B is hidden because this point coincides with point A. Please move this point to reveal line A B...")'
                  );
                }
              }
              if (line2Shown === 0) {
                // console.log("line 2 is hidden");
                if (clientTarget === "P2A") {
                  ggbObject.evalCommand(
                    'ReadText("Line C D is hidden because this point coincides with point D. Please move this point to reveal line C D...")'
                  );
                } else if (clientTarget === "P2B") {
                  ggbObject.evalCommand(
                    'ReadText("Line C D is hidden because this point coincides with point C. Please move this point to reveal line C D...")'
                  );
                }
              }
            } else if (tabSelect === false) {
              // get out of jail free -if lines are showing and the point was selected via keyboard tab key, - read screader text for point selection

              switch (clientTarget) {
                case "P1A":
                  ggbReadText("p1ASelectText", true);
                  break;
                case "P1B":
                  ggbReadText("p1BSelectText", true);
                  break;
                case "P2A":
                  ggbReadText("p2ASelectText", true);
                  break;
                case "P2B":
                  ggbReadText("p2BSelectText", true);
                  break;
              }
            }
          }
          //on select of quiz points
          if (quizPoints.includes(clientTarget)) {
            ggbObject.setValue("showQuizPoint" + pointNumber + "Caption", true);
            pointStyle = ggbObject.getPointStyle(clientTarget);
            switch (pointStyle) {
              case 3:
                currentPointStyleText = gridInt;
                nextPointStyleText = dot;
                break;
              case -1:
                currentPointStyleText = dot;
                nextPointStyleText = ex;
                break;
              case 10:
                currentPointStyleText = dot;
                nextPointStyleText = ex;
                break;
              case 1:
                currentPointStyleText = ex;
                nextPointStyleText = gridInt;
                break;
            }
            readQuizPointSelectText();
            // updateKeyboardInstructions(clientTarget);
            ggbObject.setCaption(clientTarget, quizPointCaption);
            ggbObject.setLabelVisible(clientTarget, false);
          }
          //on select of points - except slide 8 or 9 - show labels
          if (
            ggbObject.getObjectType(clientTarget) === "point" &&
            ggbObject.getValue("slide8") === 0 &&
            ggbObject.getValue("slide9") === 0
          ) {
            ggbObject.setLabelVisible(clientTarget, true);
          }
          //on select of lines - show labels and read text
          if (ggbObject.getObjectType(clientTarget) === "line") {
            ggbObject.setValue(clientTarget + "Selected", true);
          }

          switch (clientTarget) {
            // // required deletion 5
            // end 5

            case "Line1Vector1":
              // console.log("L1V1 selected");
              ggbObject.evalCommand("ReadText(objectsInInequality1)");
              break;
            case "Line2Vector1":
              // console.log("L2V1 selected");
              ggbObject.evalCommand("ReadText(objectsInInequality2)");
              break;

            default:
          }
          break;
        case "deselect":
          // on deselect always: stop showing keyboard instructions temporarily, update keyboard instructions
          // // required replacement 7
          ggbObject.setValue("showKeyboardInstructionsTemporarily", false);
          // updateKeyboardInstructions();
          ggbObject.setValue("inequalityGroup1Selected", false);
          ggbObject.setValue("inequalityGroup2Selected", false);
          ggbObject.setLabelVisible("P1A", false);
          ggbObject.setLabelVisible("P1B", false);
          ggbObject.setLabelVisible("P2A", false);
          ggbObject.setLabelVisible("P2B", false);
          ggbObject.setValue("showQuizPoint1Caption", false);
          ggbObject.setValue("showQuizPoint2Caption", false);
          ggbObject.setValue("showQuizPoint3Caption", false);
          ggbObject.setValue("showQuizPoint4Caption", false);
          ggbObject.setValue("showQuizPoint5Caption", false);
          ggbObject.setValue("showQuizPoint6Caption", false);
          ggbObject.setValue("showQuizPoint7Caption", false);
          ggbObject.setValue("showQuizPoint8Caption", false);
          ggbObject.setValue("line1Selected", false);
          ggbObject.setValue("line2Selected", false);
          ggbObject.setValue("pressSpaceCounter", 0);

          ggbObject.setValue("frogInFocus", false);
          ggbObject.setValue("cheese1InFocus", false);
          ggbObject.setValue("cheese2InFocus", false);
          ggbObject.setValue("cheese3InFocus", false);

          selectedObject = "";
          // tabSelect = false;

          // end 7
          break;
        case "dragEnd":
          // console.warn("I'm in the dragEnd client event");
          ggbObject.setValue("step", 1);
          //read where the point is in relation to the frog and cheeses
          if (
            ggbObject.getValue("slide2") === 1 ||
            ggbObject.getValue("slide3") === 1 ||
            ggbObject.getValue("slide14") === 1 ||
            ggbObject.getValue("slide15") === 1
          ) {
            if (
              ggbObject.getObjectType(selectedObject) === "point" ||
              ggbObject.getObjectType(selectedObject) === "image"
            ) {
              readPointDragText();
            }
          }
          break;
        case "mouseDown":
          tabSelect = false;
          break;
      }
    }

    function clickListenerFunction(a) {
      styleIt(a);
      // console.log("*counter before:", ggbObject.getValue("pressSpaceCounter"));
      switch (a) {
        case "AAppletStatus":
          if (
            ggbObject.getValue("slide2") === 1 ||
            ggbObject.getValue("slide3") === 1 ||
            ggbObject.getValue("slide14") === 1
          ) {
            // count the number of spacebar presses to read the proper alt text - prompt, followed by frog and cheese locations, after last cheese location, cycle back to prompt.
            if (ggbObject.getValue("pressSpaceCounter") == 5) {
              ggbObject.setValue("pressSpaceCounter", 1);
            } else {
              ggbObject.setValue("pressSpaceCounter", ggbObject.getValue("pressSpaceCounter") + 1);
            }
          }
          setTimeout(function () {
            ggbObject.evalCommand("ReadText(promptText)");
          }, 300);
          break;
      }
      // console.log("*counter after:", ggbObject.getValue("pressSpaceCounter"));
    }

    function keyit(event) {
      // console.log("In keyit function. event key: ");
      // console.log(event.key);
      switch (event.key) {
        // case "KeyK":
        //   // toggle keyboard instructions, read new value
        //   const KIBool = ggbObject.getValue("showKeyboardInstructions");
        //   const KIText =
        //     "Keyboard instructions " + (KIBool ? "hidden" : "shown") + ".";
        //   ggbReadText(KIText);
        //   ggbObject.setValue("showKeyboardInstructions", !KIBool);
        //   break;
        // // uncomment if you have >5 selectable objects
        // case "KeyX":
        //   ggbObject.evalCommand("SelectObjects(AAppletStatus)");
        //   break;
        case "Tab":
          tabSelect = true;
          break;
      }
      if (event.key.includes("Arrow")) {
        // console.warn("I'm in the arrow keyit event");
        readPointDragText();
      }
    }

    function styleIt(a) {
      if (points.includes(a)) {
        // var step = ggbObject.getValue("step");
        ggbObject.setValue("step", ggbObject.getValue("nextStep"));
        ggbReadText("stepText", true);
        // updateKeyboardInstructions(a);
      }
      if (objects.includes(a)) {
        // var step = ggbObject.getValue("step");
        ggbObject.setValue("step", ggbObject.getValue("nextStep"));
        ggbReadText("stepFrogCheeseText", true);
        // updateKeyboardInstructions(a);
      }
      if (ggbObject.getValue("slide8") === 1) {
        if (quizPoints.includes(a)) {
          const clickedQuizPoint = a;
          pointNumber = ggbObject.getValueString(clickedQuizPoint).substr(9, 1);
          // console.log("pointNumber on click of point", pointNumber);

          pointStyle = ggbObject.getPointStyle(clickedQuizPoint);
          // updateKeyboardInstructions(clickedQuizPoint);

          switch (pointStyle) {
            case 3: //blank grid intersection
              ggbObject.setPointStyle(clickedQuizPoint, 10);
              ggbObject.setColor(clickedQuizPoint, 0, 0, 0);
              ggbObject.setValue("answer" + pointNumber + "Selected", true);
              currentPointStyleText = dot;
              nextPointStyleText = ex;
              if (!quizPointsOnALine.includes(clickedQuizPoint)) {
                ggbObject.setVisible("quizPoint" + pointNumber + "Contrast1X", false);
                ggbObject.setVisible("quizPoint" + pointNumber + "Contrast2X", false);
              }
              ggbObject.evalCommand("SelectObjects(QuizPoint" + pointNumber + ")");

              break;
            case -1: //default point style
              ggbObject.setPointStyle(clickedQuizPoint, 1);

              currentPointStyleText = ex;
              nextPointStyleText = gridInt;
              if (quizPointsOnALine.includes(clickedQuizPoint)) {
                ggbObject.setVisible("quizPoint" + pointNumber + "Contrast1X", true);
                ggbObject.setVisible("quizPoint" + pointNumber + "Contrast2X", true);
              }
              ggbObject.evalCommand("SelectObjects(QuizPoint" + pointNumber + ")");

              break;
            case 10: //dot point style
              ggbObject.setPointStyle(clickedQuizPoint, 1);
              currentPointStyleText = ex;
              nextPointStyleText = gridInt;
              if (quizPointsOnALine.includes(clickedQuizPoint)) {
                ggbObject.setVisible("quizPoint" + pointNumber + "Contrast1X", true);
                ggbObject.setVisible("quizPoint" + pointNumber + "Contrast2X", true);
              }
              ggbObject.evalCommand("SelectObjects(QuizPoint" + pointNumber + ")");

              break;
            case 1: // X point style
              ggbObject.setPointStyle(clickedQuizPoint, 3);
              ggbObject.setColor(clickedQuizPoint, 128, 128, 128);
              ggbObject.setValue("answer" + pointNumber + "Selected", false);
              currentPointStyleText = gridInt;
              nextPointStyleText = dot;
              // updateKeyboardInstructions(clickedQuizPoint);
              ggbObject.setVisible("quizPoint" + pointNumber + "Contrast1X", false);
              ggbObject.setVisible("quizPoint" + pointNumber + "Contrast2X", false);
              ggbObject.evalCommand("SelectObjects(QuizPoint" + pointNumber + ")");

              break;
          }
          // updateKeyboardInstructions(clickedQuizPoint);
        }
        // updateKeyboardInstructions(a);
      }
      if (ggbObject.getValue("slide9") === 1) {
        ggbObject.setValue("showQuizPoint" + pointNumber + "Caption", true);
      }

      if (ggbObject.getObjectType(a) == "line") {
        if (ggbObject.getLineStyle(a) == 0) {
          ggbObject.setLineStyle(a, 1); //set to dashed
          switch (a) {
            case "line1":
              ggbObject.evalCommand("RunClickScript(inequality1EqualNotEqualToggle)");
              // updateKeyboardInstructions(a);
              break;
            case "line2":
              ggbObject.evalCommand("RunClickScript(inequality2EqualNotEqualToggle)");
              // updateKeyboardInstructions(a);
              break;
          }
        } else {
          ggbObject.setLineStyle(a, 0);
          switch (a) {
            case "line1":
              ggbObject.evalCommand("RunClickScript(inequality1EqualNotEqualToggle)");
              // updateKeyboardInstructions(a);
              ggbReadText("objectsInInequality1", true);
              break;
            case "line2":
              ggbObject.evalCommand("RunClickScript(inequality2EqualNotEqualToggle)");
              // updateKeyboardInstructions(a);
              ggbReadText("objectsInInequality2", true);
              break;
          }
        }
        ggbObject.evalCommand("SelectObjects(" + a + ")");
      }

      if (ggbObject.getObjectType(a) == "vector") {
        // console.warn("vector clicked. selectedObject: ", selectedObject);
        // console.warn("vector clicked. tabSelect: ", tabSelect);
        switch (a) {
          case "Line1Vector1":
            if (ggbObject.getValue("line1Greater") === 0) {
              ggbObject.setValue("line1Greater", 1);
              // updateKeyboardInstructions(a);
              ggbReadText("line1VectorClickText", true);
            } else {
              ggbObject.setValue("line1Greater", 0);
              // updateKeyboardInstructions(a);
              ggbReadText("line1VectorClickText", true);
            }
            break;
          case "Line1Vector2":
            if (ggbObject.getValue("line1Greater") === 0) {
              ggbObject.setValue("line1Greater", 1);
              ggbReadText("line1VectorClickText", true);
            } else {
              ggbObject.setValue("line1Greater", 0);
              ggbReadText("line1VectorClickText", true);
            }
            break;
          case "Line2Vector1":
            if (ggbObject.getValue("line2Greater") === 0) {
              ggbObject.setValue("line2Greater", 1);
              // updateKeyboardInstructions(a);
              ggbReadText("line2VectorClickText", true);
            } else {
              ggbObject.setValue("line2Greater", 0);
              // updateKeyboardInstructions(a);
              ggbReadText("line2VectorClickText", true);
            }
            break;
          case "Line2Vector2":
            if (ggbObject.getValue("line2Greater") === 0) {
              ggbObject.setValue("line2Greater", 1);
              ggbReadText("line2VectorClickText", true);
            } else {
              ggbObject.setValue("line2Greater", 0);
              ggbReadText("line2VectorClickText", true);
            }
            break;
        }
        ggbObject.evalCommand("SelectObjects(" + a + ")");
      }
    }

    function readQuizPointSelectText() {
      let quizPointLocationText = "";
      let combinedPointStyleText = "";
      const truncatedNextPointStyleText = nextPointStyleText.replace(/is /, "");
      // console.log("truncatedNextPointStyleText", truncatedNextPointStyleText);

      if (ggbObject.getValue("slide8") === 1) {
        pressSpaceText = " Press space to change the point to " + truncatedNextPointStyleText + ". ";
        // console.log("pressSpaceText in if statement slide 8 readQuizPointFunction:", pressSpaceText);
      } else {
        pressSpaceText = "";
      }

      switch (pointNumber) {
        case "1":
          quizPointLocationText =
            "at open parenthesis 4 comma 4 close parenthesis. The point is in the dark shaded overlapping region of the two half planes above both boundary lines.";
          break;
        case "2":
          quizPointLocationText =
            "at open parenthesis 8 comma minus 2 close parenthesis. The point is in the region above the first boundary line and below the second boundary line.";
          break;
        case "3":
          quizPointLocationText =
            "at open parenthesis 10 comma 1 close parenthesis. The point is in the region above the first boundary line and on the second dashed boundary line.";
          break;
        case "4":
          quizPointLocationText =
            "at open parenthesis 2 comma minus 7 close parenthesis. The point is in the region below the first boundary line and on the second dashed boundary line.";
          break;
        case "5":
          quizPointLocationText =
            "at open parenthesis minus 5 comma minus 3 close parenthesis. The point is in the region below the first boundary line and above the second boundary line.";
          break;
        case "6":
          quizPointLocationText =
            "at open parenthesis minus 3 comma 8 close parenthesis. The point is on the first solid boundary line and in the region above the second boundary line.";
          break;
        case "7":
          quizPointLocationText =
            "at open parenthesis 9 comma minus 4 close parenthesis. The point is on the first solid boundary line and in the region below the second boundary line.";
          break;
        case "8":
          quizPointLocationText =
            "at open parenthesis 6 comma minus 8 close parenthesis. The point is in the unshaded region below the first boundary line and below the second boundary line.";
          break;
      }

      combinedPointStyleText = currentPointStyleText.concat(" ", quizPointLocationText, " ", pressSpaceText);
      // console.log("combinedPointStyleText", combinedPointStyleText);
      quizPointCaption = combinedPointStyleText;
      // console.log("quizPointCaption", quizPointCaption);
    }

    function readPointDragText() {
      //combine & read text for point drag/keyup for various slides (ineq 1 only, ineq2 only, both ineq, and/or frog and cheese showing)
      setTimeout(function () {
        //if points coincide, don't read normal dragEnd/keyup text
        if (ggbObject.getValue("line1IsLine") === 0) {
          ggbReadText("line1Status", true);
        } else if (ggbObject.getValue("line2IsLine") === 0) {
          ggbReadText("line2Status", true);
          //if inequalities are showing normally, read normal dragEnd/keyup text
        } else {
          switch (selectedObject) {
            case "P1A":
              pointReadText = ggbObject.getValueString("p1ASelectText");
              break;
            case "P1B":
              pointReadText = ggbObject.getValueString("p1BSelectText");
              break;
            case "P2A":
              pointReadText = ggbObject.getValueString("p2ASelectText");
              break;
            case "P2B":
              pointReadText = ggbObject.getValueString("p2BSelectText");
              break;
            case "cheese1SVG":
              pointReadText = ggbObject.getValueString("cheese1SelectText");
              break;
            case "cheese2SVG":
              pointReadText = ggbObject.getValueString("cheese2SelectText");
              break;
            case "cheese3SVG":
              pointReadText = ggbObject.getValueString("cheese3SelectText");
              break;
            case "frogSVG":
              pointReadText = ggbObject.getValueString("frogSelectText");
              break;
          }

          const objectsIneq1 = ggbObject.getValueString("objectsInInequality1");
          const objectsSolution = ggbObject.getValueString("frogCheeseInSolutionText");

          //Slides that have point A, B, C, D selectable: #2-5,10, 14
          //Slide 2 - Ineq 1 + frog and cheese
          if (ggbObject.getValue("slide2") === 1) {
            keyUpReadText = pointReadText.concat(objectsIneq1);
            //Slide 3 - Ineq 1 & 2- + frog and cheese - slide 3
          } else if (ggbObject.getValue("slide3") === 1) {
            keyUpReadText = pointReadText.concat(objectsSolution);
            //slides 4, 5, 10, 14 -  Ineq 1 & 2 - no frog and cheese
          } else {
            keyUpReadText = pointReadText;
          }
          setTimeout(function () {
            ggbReadText(keyUpReadText);
          }, 400);
        }
      }, 400);
    }

    function setObjectLayer() {
      // console.log("in setObjectLayerFunction");
      const stGraphVisible = ggbObject.getValue("showStudentInequality1 && showOrigGraph || showStudentGraphVectors"); // if this doesn't update at the right time, consider passing a true/false
      // console.log("in setObjectLayerFunction, stGraphVisible:", stGraphVisible);
      //value to this function based on what button was clicked
      const objects = [
        "polyCheese1",
        "polyCheese2",
        "polyCheese3",
        "cheese1SVG",
        "cheese2SVG",
        "cheese3SVG",
        "frogSVG",
        "stink1SVG",
        "stink2SVG",
        "stink3SVG",
        "frogOutline",
      ];
      const origLayers = [0, 0, 0, 1, 1, 1, 2, 2, 2, 2, 3];
      const newLayers = [6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 8];
      // if st Graphs are visible, take the nth element in objects and change its layer to the nth element in newLayer, else change its layer to the nth element in origLayer
      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];

        const layer = stGraphVisible ? newLayers[i] : origLayers[i];
        ggbObject.setLayer(object, layer);
      }
    }
  }); // All code above here

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

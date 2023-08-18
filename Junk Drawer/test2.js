function ggbOnInit(name, ggbObject) {
  loadUtils().then(function(setupGGB) {
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
      const ggbcanvas = getCanvas();

      /*
       * IgNORE above
       * EDIT below
       */

      setAriaLabel(ggbcanvas, "Subtraction on the Place Value Chart Interactive.");
      //alll of the global variables
      var rowAdderOnes = 0;
      var rowAdderTens = 0;
      var rowAdderHuns = 0;
      var rowAdderThous = 0;
      var rowAdderTenThou = 0;
      var rowAdderHunThou = 0;
      var rowAdderMil = 0;
      var labelMil = ggbObject.getValue("milCount");
      var labelHunThou = ggbObject.getValue("hunthouCount");
      var labelTenThou = ggbObject.getValue("tenthouCount");
      var labelThous = ggbObject.getValue("thouCount");
      var labelHuns = ggbObject.getValue("hunsCount");
      var labelTens = ggbObject.getValue("tensCount");
      var labelOnes = ggbObject.getValue("onesCount");
      var labelMil2 = ggbObject.getValue("milCount2");
      var labelHunThou2 = ggbObject.getValue("hunthouCount2");
      var labelTenThou2 = ggbObject.getValue("tenthouCount2");
      var labelThous2 = ggbObject.getValue("thouCount2");
      var labelHuns2 = ggbObject.getValue("hunsCount2");
      var labelTens2 = ggbObject.getValue("tensCount2");
      var labelOnes2 = ggbObject.getValue("onesCount2");
      var unbundledMil = 0;
      var unbundledHunThou = 0;
      var unbundledTenThou = 0;
      var unbundledThous = 0;
      var unbundledHuns = 0;
      var unbundledTens = 0;
      var unbundledOnes = 0;
      var pointsM = [];
      var pointsHT = [];
      var pointsTT = [];
      var pointsTH = [];
      var pointsH = [];
      var pointsT = [];
      var pointsO = [];
      var click = 0;
      var trackedInput1 = -1;
      var trackedInput2 = -1;
      var a = 0;
      var deletedPoints = {
          millions: 0,
          hundredThousands: 0,
          TenThousands: 0,
          Thousands: 0,
          hundereds: 0,
          tens: 0,
          ones: 0,
          reset: function() {
              this.millions = 0;
              this.hundredThousands = 0;
              this.TenThousands = 0;
              this.Thousands = 0;
              this.hundereds = 0;
              this.tens = 0;
              this.ones = 0;
          }
      };
      //
      var variables = {
          milCount: "milCount",
          milCount2: "milCount2",
          milCount3: "milCount3",
          milCount4: "milCount4",
          hunthouCount: "hunthouCount",
          hunthouCount2: "hunthouCount2",
          hunthouCount3: "hunthouCount3",
          hunthouCount4: "hunthouCount4",
          tenthouCount: "tenthouCount",
          tenthouCount2: "tenthouCount2",
          tenthouCount3: "tenthouCount3",
          tenthouCount4: "tenthouCount4",
          thouCount: "thouCount",
          thouCount2: "thouCount2",
          thouCount3: "thouCount3",
          thouCount4: "thouCount4",
          hunsCount: "hunsCount",
          hunsCount2: "hunsCount2",
          hunsCount3: "hunsCount3",
          hunsCount4: "hunsCount4",
          tensCount: "tensCount",
          tensCount2: "tensCount2",
          tensCount3: "tensCount3",
          tensCount4: "tensCount4",
          onesCount: "onesCount",
          onesCount2: "onesCount2",
          onesCount3: "onesCount3",
          onesCount4: "onesCount4",
      }
      var ordering = {
          millionPoints: [],
          HundredThousandsPoints: [],
          tenThousandsPoints: [],
          thousandsPoints: [],
          hundredsPoints: [],
          tensPoints: [],
          onesPoints: [],

          reset: function() {
              this.millionPoints = [];
              this.HundredThousandsPoints = [];
              this.tenThousandsPoints = [];
              this.thousandsPoints = [];
              this.hundredsPoints = [];
              this.tensPoints = [];
              this.onesPoints = [];
          }

      }
      // tab order
      var intiList = "InputBox2,textMinus,InputBox3,ggbButton1,ggbButton2,ggbButton3";
      var modified = "";
      var addeList = "";
      var enders = "";
      try {

          setTabOrder(intiList, addeList, enders);

      } catch (e) {
          console.log("" + e);
      }

      function defineStatusName() {
          // put the name of your GGB status text object here
          return "AAppletStatus";
      }
      // listeners here; keep these, add your own as needed
      ggbObject.registerClientListener(function(a) {
          clientFunction(a);
          libClientFunction(a);
          breakOut(a);
          setSelectedObject(a);

      });
      ggbObject.registerClickListener(function(a) {
          clickListenerFunction(a);
          libClickFunction(a);
      });
      ggbcanvas.addEventListener("keyup", function(event) {
          keyit(event);
          libKeyFunction(event);

      });
      // when assgning values for the input boxes 1 and 2. it redefines numbers subt1 and subt2. 
      // this makes some elements related to variables to become visible. quickChange hides visable objects. 
      ggbObject.registerObjectUpdateListener("subt1", quickChange);
      ggbObject.registerObjectUpdateListener("subt2", quickChange);

      function defineButtonClickScripts() {
          // defines button scripts
          // keep this function, but you can delete anything/everything inside it
          return {
              ggbButton1: function() {
                  popul8();
                  enableButton(1, false);
                  enableButton(3, true);
                  altText.readLeftPartSentenceBeforeSubtraction();
              },
              ggbButton2: function() {

                  enableButton(2, false);
                  matchIt();
                  altText.readLeftPartSentenceAfterSubtraction();
                  altText.buildAppletStatus();
              },
              ggbButton3: function() {
                  reset2();
                  enableButton(1, true);
                  enableButton(2, false);
                  enableButton(3, false);
                  ggbReadText("Interactive has been reset.");
              },
              ggbButton4: function() {},
              ggbButton5: function() {},
          };
      }

      function defineKeyboardInstructions(obj) {
          // takes a GGB object name as an argument, returns its keyboard text.
          const keyboardInstructions = {
              // A: "Press the arrow keys to move this point.", // example for a point
              InputBox2: "Type in first number",
              InputBox3: "Type in second number",
              ggbButton1: ggbObject.getValue("ggbButton1Enabled") ? "Press space to draw dots in the place value chart." : unavailableButtonText,
              ggbButton2: ggbObject.getValue("ggbButton2Enabled") ? "Press space to subtract." : unavailableButtonText,
              ggbButton3: ggbObject.getValue("ggbButton3Enabled") ? "Press space to reset the interactive." : unavailableButtonText,
              ggbButton4: ggbObject.getValue("ggbButton4Enabled") ? "Press space to ___." : unavailableButtonText,
              ggbButton5: ggbObject.getValue("ggbButton5Enabled") ? "Press space to ___." : unavailableButtonText,
          };
          return keyboardInstructions[obj];
      }

      function clientFunction(a) {
          // switch (a.type) {}
      }

      function clickListenerFunction(a) {
          // switch (a) {}
      }

      function keyit(event) {
          // feel free to use event.key instead
          if (event.code == "Space") {
              altText.listener(a);
          }

          if (event.code == "ArrowRight") {
              breakOutOnSpace(ggbObject.getValueString("selectedObject"));

          }
          if (event.code == "KeyX") {
              ggbObject.evalCommand("SelectObjects(AAppletStatus)");
          }
      }

      function popul8() {
          trackedInput1 = boundIt2("subt1", 0, 9999999);
          const subt1Temp = ggbObject.getValue("subt1");
          trackedInput2 = boundIt2("subt2", 0, subt1Temp);

          // reset();
          click = click + 1;
          labelMil = ggbObject.getValue("milCount");
          labelHunThou = ggbObject.getValue("hunthouCount");
          labelTenThou = ggbObject.getValue("tenthouCount");
          labelThous = ggbObject.getValue("thouCount");
          labelHuns = ggbObject.getValue("hunsCount");
          labelTens = ggbObject.getValue("tensCount");
          labelOnes = ggbObject.getValue("onesCount");
          labelMil2 = ggbObject.getValue("milCount2");
          labelHunThou2 = ggbObject.getValue("hunthouCount2");
          labelTenThou2 = ggbObject.getValue("tenthouCount2");
          labelThous2 = ggbObject.getValue("thouCount2");
          labelHuns2 = ggbObject.getValue("hunsCount2");
          labelTens2 = ggbObject.getValue("tensCount2");
          labelOnes2 = ggbObject.getValue("onesCount2");
          //logger("178- done getting values");

          if (click == 1) {
              //logger("click is one");
              //create points in millions region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelMil; popLoop++) {
                  ggbObject.evalCommand("M" + popLoop + "=PointIn(region7)");
                  ggbObject.setCoords(
                      "M" + popLoop,
                      ggbObject.getXcoord("Ig24") + (popLoop % 5),
                      ggbObject.getYcoord("Ig24") - Math.floor(popLoop / 5)
                  );
                  ggbObject.setColor("M" + popLoop, 32, 157, 203);
                  ggbObject.setLayer("M" + popLoop, 0);
                  pointsM.push("M" + popLoop);
                  ordering.millionPoints.push("M" + popLoop);
                  ggbObject.setPointSize("M" + popLoop, 9)
                  altText.setPointCaption("M" + popLoop);

                  // ggbObject.evalCommand("SetCaption( "+"M" + popLoop+", "point" )")
              }
              //create points in hundred thousands region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelHunThou; popLoop++) {
                  ggbObject.evalCommand("HT" + popLoop + "=PointIn(region6)");
                  ggbObject.setCoords(
                      "HT" + popLoop,
                      ggbObject.getXcoord("Ig23") + (popLoop % 5),
                      ggbObject.getYcoord("Ig23") - Math.floor(popLoop / 5)
                  );
                  ggbObject.setColor("HT" + popLoop, 255, 218, 0);
                  ggbObject.setLayer("HT" + popLoop, 0);
                  pointsHT.push("HT" + popLoop);
                  ordering.HundredThousandsPoints.push("HT" + popLoop);
                  ggbObject.setPointSize("HT" + popLoop, 9)
                  altText.setPointCaption("HT" + popLoop);
              }
              //create points in ten thousands region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelTenThou; popLoop++) {
                  ggbObject.evalCommand("TT" + popLoop + "=PointIn(region5)");
                  ggbObject.setCoords(
                      "TT" + popLoop,
                      ggbObject.getXcoord("Ig22") + (popLoop % 5),
                      ggbObject.getYcoord("Ig22") - Math.floor(popLoop / 5)
                  );
                  ggbObject.setColor("TT" + popLoop, 241, 127, 9);
                  ggbObject.setLayer("TT" + popLoop, 0);
                  pointsTT.push("TT" + popLoop);
                  ordering.tenThousandsPoints.push("TT" + popLoop);
                  ggbObject.setPointSize("TT" + popLoop, 9);
                  altText.setPointCaption("TT" + popLoop);
              }
              //create points in thousands region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelThous; popLoop++) {
                  ggbObject.evalCommand("TH" + popLoop + "=PointIn(region4)");
                  ggbObject.setCoords(
                      "TH" + popLoop,
                      ggbObject.getXcoord("Ig21") + (popLoop % 5),
                      ggbObject.getYcoord("Ig21") - Math.floor(popLoop / 5)
                  );
                  ggbObject.setColor("TH" + popLoop, 120, 120, 120);
                  ggbObject.setLayer("TH" + popLoop, 0);
                  ordering.thousandsPoints.push("TH" + popLoop);
                  pointsTH.push("TH" + popLoop);
                  ggbObject.setPointSize("TH" + popLoop, 9);
                  altText.setPointCaption("TH" + popLoop);

              }
              //create points in hundreds region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelHuns; popLoop++) {
                  ggbObject.evalCommand("HU" + popLoop + "=PointIn(region3)");
                  ggbObject.setCoords(
                      "HU" + popLoop,
                      ggbObject.getXcoord("Ig5") + (popLoop % 5),
                      ggbObject.getYcoord("Ig5") - Math.floor(popLoop / 5)
                  );
                  ggbObject.setColor("HU" + popLoop, 0, 118, 165);
                  ggbObject.setLayer("HU" + popLoop, 0);
                  pointsH.push("HU" + popLoop);
                  ordering.hundredsPoints.push("HU" + popLoop);
                  ggbObject.setPointSize("HU" + popLoop, 9);
                  altText.setPointCaption("HU" + popLoop);

              }
              //create points in tens region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelTens; popLoop++) {
                  ggbObject.evalCommand("TE" + popLoop + "=PointIn(region2)");
                  ggbObject.setCoords(
                      "TE" + popLoop,
                      ggbObject.getXcoord("Ig6") + (popLoop % 5),
                      ggbObject.getYcoord("Ig6") - Math.floor(popLoop / 5)
                  );
                  ggbObject.setColor("TE" + popLoop, 0, 155, 69);
                  ggbObject.setLayer("TE" + popLoop, 0);
                  pointsT.push("TE" + popLoop);
                  ordering.tensPoints.push("TE" + popLoop);

                  ggbObject.setPointSize("TE" + popLoop, 9);
                  altText.setPointCaption("TE" + popLoop);

              }
              //create points in ones region and add point name to list of points in that region
              for (var popLoop = 0; popLoop < labelOnes; popLoop++) {

                  ggbObject.evalCommand("O" + popLoop + "=PointIn(region1)");
                  ggbObject.setCoords(
                      "O" + popLoop,
                      ggbObject.getXcoord("Ig7") + (popLoop % 5),
                      ggbObject.getYcoord("Ig7") - Math.floor(popLoop / 5)
                  );
                  ggbObject.setColor("O" + popLoop, 230, 15, 33);
                  ggbObject.setLayer("O" + popLoop, 0);
                  pointsO.push("O" + popLoop);
                  ordering.onesPoints.push("O" + popLoop);
                  ggbObject.setPointSize("O" + popLoop, 9);
                  altText.setPointCaption("O" + popLoop);

              }

              //updates alogrithm text on rIght
              setText();
              try {
                  if (

                      pointsM.length >= labelMil2 &&
                      pointsHT.length >= labelHunThou2 &&
                      pointsTT.length >= labelTenThou2 &&
                      pointsTH.length >= labelThous2 &&
                      pointsH.length >= labelHuns2 &&
                      pointsT.length >= labelTens2 &&
                      pointsO.length >= labelOnes2
                  ) {
                      //set question button invisible and subtract it button visible
                      enableButton(2, true);
                  } else {
                      enableButton(2, false);
                  }
              } catch (e) {
                  console.log(e);
              }
              updateTabOrderList();
          }
          // ggbObject.setTextValue("AAppletStatus", "nothing" )
          altText.buildAppletStatus();

      }
      const altText = {
          appletStatusSentences: {
              counter: 0,
              statusArray: [],
              reset: function() {
                  this.counter = 0;
                  this.statusArray = [];
              },
              addSentence: function(string) {
                  if (string.length > 0)
                      this.statusArray.push(string);
              },
              readNext: function() {
                  if (this.counter >= this.statusArray.length) {
                      this.counter = 1;
                      return this.statusArray[0] + " Press tab to select next object. Press space to reread describtion";
                  }
                  let string = this.statusArray[this.counter++];
                  if (this.counter < this.statusArray.length) {
                      string += " Press space to continue reading describtion. " + altText.getExitSentence();
                  } else if (this.counter == this.statusArray.length) {
                      string += " Press tab to select next object. Press space to reread describtion";
                  }
                  // ggbReadText(string);

                  return string;
              }
          },

          buildAppletStatus: function() {
              this.appletStatusSentences.reset();
              var firstNumber = ggbObject.getValue("subt1");
              var secondNumber = ggbObject.getValue("subt2");
              ggbObject.setTextValue("AAppletStatus", "A place value chart shows One, Ten, Hundred, Thousand, TenThousand, and HundredThousand. Press tab to select next object. Press space to continue reading describtion. Press the escape key to exit the interactive and return to the page.");

              // this.appletStatusSentences.addSentence("A place value chart shows One, Ten, Hundred, Thousand, TenThousand, and HundredThousand. Press tab to select next object. Press space to continue reading describtion.");
              this.appletStatusSentences.addSentence(this.exedOff(7));
              this.appletStatusSentences.addSentence(this.exedOff(6) + this.exedOff(5) + this.exedOff(4));
              this.appletStatusSentences.addSentence(this.exedOff(3) + this.exedOff(2) + this.exedOff(1));

              var ss = "";
              ss += " To the right of the place value chart " + this.numberToString(firstNumber) + " minus " + secondNumber + " in vertical form."
              ss += this.numberRenamed();
              this.appletStatusSentences.addSentence(ss);
              if (!ggbObject.getValue("ggbButton1Enabled") && !ggbObject.getValue("ggbButton2Enabled")) {
                  altText.appletStatusSentences.reset();
                  altText.appletStatusSentences.addSentence(this.getRightSideSentence());
              }

          },
          setAppletStatusInGeogebraApplet: function() {
              try {
                  // let statusString = this.buildAppletStatus();
                  let statusString = this.appletStatusSentences.readNext();
                  // ggbObject.setTextValue("AAppletStatus", statusString);
                  let string = statusString + "";
                  ggbReadText(string)
              } catch (error) {
                  logger(error);
              }
          },
          getExitSentence: function() {
              return " Press the escape key to exit the interactive and return to the page.";
          },
          pluralOrSingle: function(number) {
              if (number > 1) {
                  return "s are "
              } else if (number == 1) {
                  return " is "
              } else {
                  return "";
              }
          },
          sentenceBuilder: function(area, pointsArray, deletedPoints) {
              let s = "";

              try {
                  if (pointsArray.length > 0) {
                      s += area + " region has a total of " + (pointsArray.length + deletedPoints) + " points."
                      if (deletedPoints) {
                          s += " " + deletedPoints + " point" + this.pluralOrSingle(deletedPoints) + "crossed out."
                      }
                  }
              } catch (error) {
                  console.log(error)
              }

              return s;
          },
          reset: function() {
              this.appletStatusSentences.reset();
          },
          listener: function() {

              if (ggbObject.getValueString("selectedObject") == "AAppletStatus") {
                  this.setAppletStatusInGeogebraApplet();
              }
          },
          getBreakOutSentence: function(number) {
              var s = " ";
              if (number == 7) s += this.getBreakoutSentence2("million", "hundred thousands");
              if (number == 6) s += this.getBreakoutSentence2("hundred thousand", "ten thousands");
              if (number == 5) s += this.getBreakoutSentence2("ten thousands", "thousands");
              if (number == 4) s += this.getBreakoutSentence2("thousand", "hundreds");
              if (number == 3) s += this.getBreakoutSentence2("hundreds", "tens");
              if (number == 2) s += this.getBreakoutSentence2("ten", "ones");

              // var string = "one point in the " + area + " area deleted, but ten points are created in the " + nextArea + " area.";
              // s += this.getCarrySentence(number);
              s += this.exedOff(number) + this.exedOff(number - 1);
              ggbReadText(s);
          },
          getBreakoutSentence2: function(area1, area2) {
              return "1 " + area1 + " is regrouped into 10 " + area2 + " ";
          },
          getPointSentece: function(pointName) {
              if (pointName.includes("M")) {
                  var string = "Press right arrow to regroup 1 million. "
                  // ggbReadText(string);
                  ggbObject.setTextValue("keyboardInstructions", string);
              }
              if (pointName.includes("HT")) {
                  // ggbReadText("dot in the Hundred Thousands column is selected. Press right arrow to regroup 1 hundred thousand. ")
                  ggbObject.setTextValue("keyboardInstructions", "Press right arrow to regroup 1 hundred thousand. ");
              }
              if (pointName.includes("TT")) {
                  // ggbReadText("dot in the Ten Thousands column is selected. Press right arrow to regroup 1 ten thousands. ")
                  ggbObject.setTextValue("keyboardInstructions", "Press right arrow to regroup 1 ten thousands. ");
              }
              if (pointName.includes("TH")) {
                  // ggbReadText("dot in the Thousands column is selected. Press right arrow to regroup 1 thousand. ")
                  ggbObject.setTextValue("keyboardInstructions", "Press right arrow to regroup 1 thousand. ");
              }
              if (pointName.includes("HU")) {
                  // ggbReadText("dot in the Hundreds column is selected. Press right arrow to regroup 1 hundred. ")
                  ggbObject.setTextValue("keyboardInstructions", "Press right arrow to regroup 1 hundred. ");
              }
              if (pointName.includes("TE")) {
                  // ggbReadText("dot in the Tens column is selected. Press right arrow to regroup 1 ten. ")
                  ggbObject.setTextValue("keyboardInstructions", "Press right arrow to regroup 1 ten. ");
              }
              if (pointName.includes("O")) {
                  // ggbReadText("dot in the Ones column is selected. ")
                  ggbObject.setTextValue("keyboardInstructions", "dot in the Ones column is selected. ");
              }
          },
          exedOff: function(number) {
              var s = "";
              if (number == 7) {
                  s += exedOffHelper(pointsM.length, deletedPoints.millions, "Millions");
              }
              if (number == 6) {
                  s += exedOffHelper(pointsHT.length, deletedPoints.hundredThousands, "Hundred Thousands");
              }
              if (number == 5) {
                  s += exedOffHelper(pointsTT.length, deletedPoints.TenThousands, "Ten Thousands");
              }
              if (number == 4) {
                  s += exedOffHelper(pointsTH.length, deletedPoints.Thousands, "Thousands");
              }
              if (number == 3) {
                  s += exedOffHelper(pointsH.length, deletedPoints.hundereds, "Hundreds");
              }
              if (number == 2) {
                  s += exedOffHelper(pointsT.length, deletedPoints.tens, "Tens");
              }
              if (number == 1) {
                  s += exedOffHelper(pointsO.length, deletedPoints.ones, "Ones");
              }

              function exedOffHelper(pointsNumber, deletedPointsNumber, column) {
                  var s = "";
                  if (pointsNumber > 0) {
                      s += column + " column has " + pointsNumber + " dot" + altText.s(pointsNumber);

                  }
                  if (deletedPointsNumber > 0) {
                      s += " with " + deletedPointsNumber + " dot" + altText.s(deletedPointsNumber) + " X'd off. "
                  } else if (pointsNumber > 0) {
                      s += ". ";
                  }
                  return s;
              }
              return s;

          },
          getCarrySentence: function(number) {
              if (number == 7) {
                  return prepareCarrySentence("milCount", "milCount3", "hunthouCount", "hunthouCount3", "Millions", "Hundred Thousands");
              }
              if (number == 6) {
                  return prepareCarrySentence("hunthouCount", "hunthouCount3", "tenthouCount", "tenthouCount3", "Hundred Thousands", "Ten Thousands")
              }
              if (number == 5) {
                  return prepareCarrySentence("tenthouCount", "tenthouCount3", "thouCount", "thouCount3", "Ten Thousands", "Thousands");
              }
              if (number == 4) {
                  return prepareCarrySentence("thouCount", "thouCount3", "hunsCount", "hunsCount3", "Thousands", "Hundreds");
              }
              if (number == 3) {
                  return prepareCarrySentence("hunsCount", "hunsCount3", "tensCount", "tensCount3", "Hundreds", "Tens");
              }
              if (number == 2) {
                  return prepareCarrySentence("tensCount", "tensCount3", "onesCount", "onesCount3", "Tens", "Ones");
              }
              if (number == 1) {
                  ggbReadText("dot in the Ones column is selected.")
              }

              function prepareCarrySentence(num, car, num2, car2, region1, region2) {
                  var string;
                  var number, carry, number2, carry2;
                  number = ggbObject.getValue(num);
                  carry = ggbObject.getValue(car);
                  number2 = ggbObject.getValue(num2);
                  carry2 = ggbObject.getValue(car2);
                  string += "number " + number + " in the " + region1 + " place is Crossed out."
                  string += region1 + " carry is  equal " + carry + ".";
                  string += " number " + number2 + " in the " + region2 + " place is scratched."
                  string += " " + region2 + " carry is  equal " + carry2;
                  return string;
              }


          },
          getLeftPartSentence: function() {
              try {
                  let firstNumber = ggbObject.getValue("subt1");
                  let secondNumber = ggbObject.getValue("subt2");
                  let mil = deletedPoints.millions > 0 ? ggbObject.getValue(variables.milCount3) : ggbObject.getValue(variables.milCount);
                  let hundredthousand = deletedPoints.hundredThousands > 0 ? ggbObject.getValue(variables.hunthouCount3) : ggbObject.getValue(variables.hunthouCount);
                  let tenthousand = deletedPoints.TenThousands > 0 ? ggbObject.getValue(variables.tenthouCount3) : ggbObject.getValue(variables.tenthouCount);
                  let thousand = deletedPoints.Thousands > 0 ? ggbObject.getValue(variables.thouCount3) : ggbObject.getValue(variables.thouCount);
                  let hundreds = deletedPoints.hundereds > 0 ? ggbObject.getValue(variables.hunsCount3) : ggbObject.getValue(variables.hunsCount);
                  let ten = deletedPoints.tens > 0 ? ggbObject.getValue(variables.tensCount3) : ggbObject.getValue(variables.tensCount);
                  let one = deletedPoints.tens > 0 ? ggbObject.getValue(variables.onesCount3) : ggbObject.getValue(variables.onesCount);

                  // var s = firstNumber + " minus " + secondNumber + " in vertical form. " + firstNumber + "is renamed as";
                  let s = "Dots are drawn on the place value to chart to represent the number " + firstNumber + ".";

                  if (mil > 0) {
                      s += " the millions place has " + mil + " dot" + altText.s(mil) + ",";
                  }
                  if (hundredthousand > 0) {
                      s += " the hundred thousands place has " + hundredthousand + " dot" + altText.s(hundredthousand) + ",";
                  }
                  if (tenthousand > 0) {
                      s += " the ten thousands place has " + tenthousand + " dot" + altText.s(tenthousand) + ",";
                  }
                  if (thousand > 0) {
                      s += " the thousands place has " + thousand + " dot" + altText.s(thousand) + ",";
                  }
                  if (hundreds > 0) {
                      s += " the hundreds place has " + hundreds + " dot" + altText.s(hundreds) + ",";
                  }
                  if (ten > 0) {
                      s += " the tens place has " + ten + " dot" + altText.s(ten) + ", ";
                  }
                  if (one > 0) {
                      s += " the ones place has " + one + " dot" + altText.s(one) + ".";
                  }
                  s += " To the right of the place value chart " + firstNumber + " minus " + secondNumber + " in vertical form."
                  return s;
              } catch (error) {
                  console.log(error);

              }


          },
          isAre: function(number) {
              if (number == 1) return "is";
              if (number > 1) return "are";

          },
          s: function(number) {
              if (number == 1) {
                  return "";
              }
              if (number > 1) return "s";
          },
          getRightSideSentence: function() {
              try {
                  var firstNumber = ggbObject.getValue("subt1");
                  var secondNumber = ggbObject.getValue("subt2");
                  var mil = ggbObject.getValue(variables.milCount2);
                  var hundredthousand = ggbObject.getValue(variables.hunthouCount2);
                  var tenthousand = ggbObject.getValue(variables.tenthouCount2)
                  var thousand = ggbObject.getValue(variables.thouCount2)
                  var hundreds = ggbObject.getValue(variables.hunsCount2)
                  var ten = ggbObject.getValue(variables.tensCount2)
                  var one = ggbObject.getValue(variables.onesCount2)

                  var s = "";
                  s += "Dots representing " + secondNumber + " are removed from the place value chart."
                  if (mil > 0) {
                      s += " " + mil + " dot" + this.s(mil) + " in the millions column " + this.isAre(mil) + " crossed off.";
                  }
                  if (hundredthousand > 0) {
                      s += " " + hundredthousand + " dot" + this.s(hundredthousand) + " in the hundred thousand column " + this.isAre(hundredthousand) + " crossed off.";
                  }
                  if (tenthousand > 0) {
                      s += " " + tenthousand + " dot" + this.s(tenthousand) + " in the ten thousands column " + this.isAre(tenthousand) + " crossed off.";
                  }
                  if (thousand > 0) {
                      s += " " + thousand + " dot" + this.s(thousand) + " in the thousands column " + this.isAre(thousand) + " crossed off.";
                  }
                  if (hundreds > 0) {
                      s += " " + hundreds + " dot" + this.s(hundreds) + " in the hundreds column " + this.isAre(hundreds) + " crossed off.";
                  }
                  if (ten > 0) {
                      s += " " + ten + " dot" + this.s(ten) + " in the tens column " + this.isAre(ten) + " crossed off.";
                  }
                  if (one > 0) {
                      s += " " + one + " dot" + this.s(one) + " in the ones column " + this.isAre(one) + " crossed off.";
                  }
                  s += " To the right of the place value chart " + firstNumber + " minus " + secondNumber + " in vertical form."
                  s += this.numberRenamed();
                  s += " Difference is " + (firstNumber - secondNumber);
                  // console.log(s);
                  return s;
              } catch (error) {
                  console.log(error);

              }


          },
          numberRenamed: function() {
              try {
                  let firstNumber = ggbObject.getValue("subt1");
                  let mil = deletedPoints.millions > 0 ? ggbObject.getValue(variables.milCount3) : ggbObject.getValue(variables.milCount);
                  let hundredthousand = deletedPoints.hundredThousands > 0 ? ggbObject.getValue(variables.hunthouCount3) : ggbObject.getValue(variables.hunthouCount);
                  let tenthousand = deletedPoints.TenThousands > 0 ? ggbObject.getValue(variables.tenthouCount3) : ggbObject.getValue(variables.tenthouCount);
                  let thousand = deletedPoints.Thousands > 0 ? ggbObject.getValue(variables.thouCount3) : ggbObject.getValue(variables.thouCount);
                  let hundreds = deletedPoints.hundereds > 0 ? ggbObject.getValue(variables.hunsCount3) : ggbObject.getValue(variables.hunsCount);
                  let ten = deletedPoints.tens > 0 ? ggbObject.getValue(variables.tensCount3) : ggbObject.getValue(variables.tensCount);
                  let one = deletedPoints.tens > 0 ? ggbObject.getValue(variables.onesCount3) : ggbObject.getValue(variables.onesCount);;

                  let s = " " + firstNumber + " is renamed as";
                  if (mil > 0) {
                      s += " " + mil + "million,";
                  }
                  if (hundredthousand > 0) {
                      s += " " + hundredthousand + " hundred thousand,";
                  }
                  if (tenthousand > 0) {
                      s += " " + tenthousand + " ten thousand,";
                  }
                  if (thousand > 0) {
                      s += " " + thousand + " thousands,";
                  }
                  if (hundreds > 0) {
                      s += " " + hundreds + " hundreds,";
                  }
                  if (ten > 0) {
                      s += " " + ten + " tens, ";
                  }
                  if (one > 0) {
                      s += " " + one + " ones.";
                  }
                  // console.log("s");
                  // console.log(s);
                  // console.log("one");
                  // console.log(one);
                  return s;
              } catch (error) {
                  console.log(error);
              }
          },
          getLeftPartResult: function() {

              let firstNumber = ggbObject.getValue("subt1");
              let secondNumber = ggbObject.getValue("subt2");
              return " result is " + (firstNumber - secondNumber);
          },
          readLeftPartSentenceBeforeSubtraction: function() {
              let s = this.getLeftPartSentence();
              // console.log(s);
              ggbReadText(s);
          },
          readLeftPartSentenceAfterSubtraction: function() {
              var s = this.getRightSideSentence();
              ggbReadText(s);
          },
          getResultSentenceCarriesOverloaded: function() {
              var mil = ggbObject.getValue(variables.milCount4);
              var hundredthousand = ggbObject.getValue(variables.hunthouCount4);
              var tenthousand = ggbObject.getValue(variables.tenthouCount4);
              var thousand = ggbObject.getValue(variables.thouCount4);
              var hundreds = ggbObject.getValue(variables.hunsCount4);
              var ten = ggbObject.getValue(variables.tensCount4);
              var one = ggbObject.getValue(variables.onesCount4);

              var s = "result is ";
              if (mil > 0) {
                  s += " " + mil + "million,";
              }
              if (hundredthousand > 0) {
                  s += " " + hundredthousand + " hundred thousand,";
              }
              if (tenthousand > 0) {
                  s += " " + tenthousand + " ten thousand,";
              }
              if (thousand > 0) {
                  s += " " + thousand + " thousands,";
              }
              if (hundreds > 0) {
                  s += " " + hundreds + " hundreds,";
              }
              if (ten > 0) {
                  s += " " + ten + " tens, ";
              }
              if (one > 0) {
                  s += " " + one + " ones.";
              }
              return s;
          },
          readResultSentenceCarriesOverloaded: function() {
              var s = this.getResultSentenceCarriesOverloaded();
              ggbReadText(s);
          },
          numberToString: function(num) {

              function helper(num) {
                  const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
                  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven",
                      "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
                  ];
                  let sb = "";
                  if (num >= 1000000000) {
                      sb += helper(Math.floor(num / 1000000000)) + " Billion " + helper(num % 1000000000);
                  } else if (num >= 1000000) {
                      sb += helper(Math.floor(num / 1000000)) + " Million " + helper(num % 1000000);
                  } else if (num >= 1000) {
                      sb += helper(Math.floor(num / 1000)) + " Thousand " + helper(num % 1000);
                  } else if (num >= 100) {
                      sb += helper(Math.floor(num / 100)) + " Hundred " + helper(num % 100);
                  } else if (num >= 20) {
                      sb += tens[Math.floor(num / 10)] + " " + helper(num % 10);
                  } else {
                      sb += ones[Math.floor(num)];
                  }
                  // console.log(ones[Math.floor(num)]);
                  return sb;
              }
              let s = helper(num);
              return s;
          },
          setPointCaption: function(pointName) {

              let caption = this.getPointSenteceForCaption(pointName);
              ggbObject.setCaption(pointName, caption);

          },
          getPointSenteceForCaption: function(pointName) {
              if (pointName.includes("M")) {
                  var string = "Dot in the millions column is selected. Press right arrow to regroup 1 million. "
                  return string;
              }
              if (pointName.includes("HT")) {
                  let string = "Dot in the Hundred Thousands column is selected. Press right arrow to regroup 1 hundred thousand. "
                  return string;
              }
              if (pointName.includes("TT")) {
                  let string = "Dot in the Ten Thousands column is selected. Press right arrow to regroup 1 ten thousands. ";
                  return string;
              }
              if (pointName.includes("TH")) {
                  let string = "Dot in the Thousands column is selected. Press right arrow to regroup 1 thousand. ";
                  return string;
              }
              if (pointName.includes("HU")) {
                  let string = "Dot in the Hundreds column is selected. Press right arrow to regroup 1 hundred. ";
                  return string;
              }
              if (pointName.includes("TE")) {
                  let string = "Dot in the Tens column is selected. Press right arrow to regroup 1 ten. "
                  return string;
              }
              if (pointName.includes("O")) {
                  let string = "Dot in the Ones column is selected. ";
                  return string;
              }
          },

      }

      function updateTabOrderList() {
          let list = "";


          try {
              list = updateInitListHelper(pointsM, list);
              list = updateInitListHelper(pointsHT, list);
              list = updateInitListHelper(pointsTT, list);
              list = updateInitListHelper(pointsTH, list);
              list = updateInitListHelper(pointsH, list);
              list = updateInitListHelper(pointsT, list);

              var updatedList = "InputBox2,textMinus, InputBox3,ggbButton1,ggbButton2" + list + ",ggbButton3";

              setTabOrder(updatedList, addeList, enders);

          } catch (e) {
              console.log(e);
          }
          return list;
      }

      function updateInitListHelper(pointList, list) {
          if (pointList.length > 0) {
              list = list + ",";
              list += pointList[pointList.length - 1];
          }
          return list;
      }

      function setText() {
          ggbObject.evalCommand("textMil = Text(" + pointsM.length + ")");
          ggbObject.evalCommand("textHunThou = Text(" + pointsHT.length + ")");
          ggbObject.evalCommand("textTenThou = Text(" + pointsTT.length + ")");
          ggbObject.evalCommand("textThou = Text(" + pointsTH.length + ")");
          ggbObject.evalCommand("textHuns = Text(" + pointsH.length + ")");
          ggbObject.evalCommand("textTens = Text(" + pointsT.length + ")");
          ggbObject.evalCommand("textOnes = Text(" + pointsO.length + ")");
          ggbObject.setVisible("textMil", true);
          ggbObject.setVisible("textHunThou", true);
          ggbObject.setVisible("textTenThou", true);
          ggbObject.setVisible("textThou", true);
          ggbObject.setVisible("textHuns", true);
          ggbObject.setVisible("textTens", true);
          ggbObject.setVisible("textOnes", true);
          ggbObject.setVisible("textComma", true);
          ggbObject.setVisible("textCommas", true);
          if (pointsM.length == 0) {
              ggbObject.setVisible("textMil", false);
              ggbObject.setVisible("textCommas", false);
          }
          if (pointsM.length == 0 && pointsHT.length == 0) {
              ggbObject.setVisible("textMil", false);
              ggbObject.setVisible("textHunThou", false);
              ggbObject.setVisible("textCommas", false);
          }
          if (pointsM.length == 0 && pointsHT.length == 0 && pointsTT.length == 0) {
              ggbObject.setVisible("textMil", false);
              ggbObject.setVisible("textHunThou", false);
              ggbObject.setVisible("textTenThou", false);
              ggbObject.setVisible("textCommas", false);
          }
          if (
              pointsM.length == 0 &&
              pointsHT.length == 0 &&
              pointsTT.length == 0 &&
              pointsTH.length == 0
          ) {
              ggbObject.setVisible("textMil", false);
              ggbObject.setVisible("textHunThou", false);
              ggbObject.setVisible("textTenThou", false);
              ggbObject.setVisible("textThou", false);
              ggbObject.setVisible("textCommas", false);
              ggbObject.setVisible("textComma", false);
          }
          if (
              pointsM.length == 0 &&
              pointsHT.length == 0 &&
              pointsTT.length == 0 &&
              pointsTH.length == 0 &&
              pointsH.length == 0
          ) {
              ggbObject.setVisible("textMil", false);
              ggbObject.setVisible("textHunThou", false);
              ggbObject.setVisible("textTenThou", false);
              ggbObject.setVisible("textThou", false);
              ggbObject.setVisible("textHuns", false);
              ggbObject.setVisible("textCommas", false);
              ggbObject.setVisible("textComma", false);
          }
          if (
              pointsM.length == 0 &&
              pointsHT.length == 0 &&
              pointsTT.length == 0 &&
              pointsTH.length == 0 &&
              pointsH.length == 0 &&
              pointsT.length == 0
          ) {
              ggbObject.setVisible("textMil", false);
              ggbObject.setVisible("textHunThou", false);
              ggbObject.setVisible("textTenThou", false);
              ggbObject.setVisible("textThou", false);
              ggbObject.setVisible("textHuns", false);
              ggbObject.setVisible("textTens", false);
              ggbObject.setVisible("textCommas", false);
              ggbObject.setVisible("textComma", false);
          }
          ggbObject.setVisible("textMil2", true);
          ggbObject.setVisible("textHunThou2", true);
          ggbObject.setVisible("textTenThou2", true);
          ggbObject.setVisible("textThou2", true);
          ggbObject.setVisible("textHuns2", true);
          ggbObject.setVisible("textTens2", true);
          ggbObject.setVisible("textOnes2", true);
          ggbObject.setVisible("textComma2", true);
          ggbObject.setVisible("textCommas2", true);
          if (labelMil2 == 0) {
              ggbObject.setVisible("textMil2", false);
              ggbObject.setVisible("textCommas2", false);
          }
          if (labelMil2 == 0 && labelHunThou2 == 0) {
              ggbObject.setVisible("textMil2", false);
              ggbObject.setVisible("textHunThou2", false);
              ggbObject.setVisible("textCommas2", false);
          }
          if (labelMil2 == 0 && labelHunThou2 == 0 && labelTenThou2 == 0) {
              ggbObject.setVisible("textMil2", false);
              ggbObject.setVisible("textHunThou2", false);
              ggbObject.setVisible("textTenThou2", false);
              ggbObject.setVisible("textCommas2", false);
          }
          if (
              labelMil2 == 0 &&
              labelHunThou2 == 0 &&
              labelTenThou2 == 0 &&
              labelThous2 == 0
          ) {
              ggbObject.setVisible("textMil2", false);
              ggbObject.setVisible("textHunThou2", false);
              ggbObject.setVisible("textTenThou2", false);
              ggbObject.setVisible("textThou2", false);
              ggbObject.setVisible("textCommas2", false);
              ggbObject.setVisible("textComma2", false);
          }
          if (
              labelMil2 == 0 &&
              labelHunThou2 == 0 &&
              labelTenThou2 == 0 &&
              labelThous2 == 0 &&
              labelHuns2 == 0
          ) {
              ggbObject.setVisible("textMil2", false);
              ggbObject.setVisible("textHunThou2", false);
              ggbObject.setVisible("textTenThou2", false);
              ggbObject.setVisible("textThou2", false);
              ggbObject.setVisible("textHuns2", false);
              ggbObject.setVisible("textCommas2", false);
              ggbObject.setVisible("textComma2", false);
          }
          if (
              labelMil2 == 0 &&
              labelHunThou2 == 0 &&
              labelTenThou2 == 0 &&
              labelThous2 == 0 &&
              labelHuns2 == 0 &&
              labelTens2 == 0
          ) {
              ggbObject.setVisible("textMil2", false);
              ggbObject.setVisible("textHunThou2", false);
              ggbObject.setVisible("textTenThou2", false);
              ggbObject.setVisible("textThou2", false);
              ggbObject.setVisible("textHuns2", false);
              ggbObject.setVisible("textTens2", false);
              ggbObject.setVisible("textCommas2", false);
              ggbObject.setVisible("textComma2", false);
          }
      }


      function logger(message) {
          console.log(message);
      }

      function logger2(message, message2) {
          console.log(message + " " + message2);
      }

      function logger3(lineNumber, message, message2) {
          console.log(lineNumber + " - " + message + " " + message2);
      }

      function breakoutHelper(pointName, pointsGroup, XPointName, x, y) {
          try {
              var choppingBlock = pointsGroup.indexOf(pointName);
              pointsGroup.splice(choppingBlock, 1);
              // ggbObject.evalCommand(XPointName + "=PointIn(box)");
              ggbObject.setCoords(pointName, x, y);
              // ggbObject.setCoords(XPointName, x, y);
              // ggbObject.evalCommand("SetCoords( "+XPointName+", x("+pointName+"), y("+pointName+") )");
              // ggbObject.evalCommand("SetCoords( "+XPointName+", x("+pointName+"), y("+pointName+") )");
              // ggbObject.evalCommand(XPointName + "=("+"x("+pointName+"), y("+pointName+")+",)");
              ggbObject.evalCommand(XPointName + "=(x(" + pointName + "), y(" + pointName + "))");
              // console.log(XPointName + "=(x("+pointName+"), y("+pointName+"))");

              // console.log("SetCoords( "+XPointName+", x("+pointName+"), y("+pointName+") )");
              ggbObject.setPointStyle(XPointName, 1);
              ggbObject.setPointSize(XPointName, 5)


              ggbObject.setColor(XPointName, 0, 0, 0);
              ggbObject.setFixed(XPointName, false, false);
              ggbObject.setFixed(pointName, false, false);
              ggbObject.setTextValue("selectedObject", "")
          } catch (e) {
              logger(e);
          }
      }

      function organise(region) {

          if (region == 6) {
              order("Ig23", ordering.HundredThousandsPoints);
          } else if (region == 5) {
              order("Ig22", ordering.tenThousandsPoints);
          } else if (region == 4) {
              order("Ig21", ordering.thousandsPoints);
          } else if (region == 3) {
              order("Ig5", ordering.hundredsPoints);
          } else if (region == 2) {
              order("Ig6", ordering.tensPoints);
          } else if (region == 1) {
              order("Ig7", ordering.onesPoints);
          } else if (region == 7) {
              order("Ig24", ordering.millionPoints);
          }
      }

      function order(reference, pointsArray) {
          console.log("" + reference + "       " + pointsArray + "point")
          for (var i = 0; i < pointsArray.length; i++) {
              ggbObject.setCoords(
                  pointsArray[i],
                  ggbObject.getXcoord(reference) + (i % 5),
                  ggbObject.getYcoord(reference) - Math.floor(i / 5) - Math.floor(i / 10)
              );
              //     ggbObject.setCoords(
              //     pointsArray[i],
              //     ggbObject.getXcoord(reference) + (dsfs % 5),
              //     ggbObject.getYcoord(reference) - Math.floor(dsfs / 5)
              // );  

          }

      }

      function breakOut(grabbed) {

          a = a + 1;
          //logger(grabbed);
          //logger3("breakOut","grabbed",grabbed);
          //logger2("breakOut","grabbed.target",grabbed.target);
          //logger3("breakOut","grabbed[2]",grabbed[2]);

          if (grabbed.type == "select") {
              pointName = grabbed.target;
              type = ggbObject.getObjectType(grabbed.target);
              altText.getPointSentece(pointName);
              if (type == "point") {
                  xCoord = ggbObject.getXcoord(grabbed.target);
                  yCoord = ggbObject.getYcoord(grabbed.target);
              }
              if (grabbed.target == "InputBox2") {
                  ggbReadText("for first number in subtraction problem.");
                  ggbObject.setTextValue("keyboardInstructions", "Input a value and press enter to submit.");
              }
              if (grabbed.target == "InputBox3") {
                  ggbReadText("for second number in subtraction problem.");
                  ggbObject.setTextValue("keyboardInstructions", "Input a value and press enter to submit.");

              }
              if (grabbed.target == "textMinus") {
                  ggbReadText("Minus");
                  ggbObject.setTextValue("keyboardInstructions", "Minus");
              }
          }
          if (grabbed.type == "dragEnd") {
              type = ggbObject.getObjectType(grabbed.target);
              if (type == "point") {
                  //point goes from millions to hundred thousands
                  if (
                      pointName.includes("M") &&
                      ggbObject.getXcoord(grabbed.target) > -27 &&
                      ggbObject.getYcoord(grabbed.target) > -10
                  ) {
                      //splice out unbundled point from point list
                      breakoutHelper(pointName, pointsM, "XMil" + a, xCoord, yCoord);
                      deletedPoints.millions++;
                      //set the dragged point to invisible and create ten new points in region
                      for (var column = 0; column < 2; column++) {
                          for (var row = 0; row < 5; row++) {
                              ggbObject.evalCommand(
                                  "HT" + labelHunThou + "=PointIn(region6)"
                              );
                              altText.setPointCaption("HT" + labelHunThou);
                              ggbObject.setCoords(
                                  "HT" + labelHunThou,
                                  ggbObject.getXcoord("Ig23") + row,
                                  ggbObject.getYcoord("Ig23") -
                                  3 -
                                  column -
                                  rowAdderHunThou
                              );
                              ggbObject.setColor(
                                  "HT" + labelHunThou,
                                  255,
                                  218,
                                  0
                              );
                              ggbObject.setPointSize("HT" + labelHunThou, 9);
                              ggbObject.setLayer("HT" + labelHunThou, 0);
                              pointsHT.push("HT" + labelHunThou);
                              ordering.HundredThousandsPoints.push("HT" + labelHunThou);

                              //rewrites the algorithm to reflect new pvc
                              ggbObject.setValue("milCount3", pointsM.length);
                              ggbObject.setValue(
                                  "hunthouCount3",
                                  pointsHT.length
                              );
                              ggbObject.setVisible("k", true);
                              ggbObject.setVisible("j", true);
                              ggbObject.setVisible("textMil3", true);
                              ggbObject.setVisible("textHunThou3", true);
                              ggbObject.setValue("milBool", true);
                              ggbObject.setValue("hunThouBool", true);
                              labelHunThou++;
                          }
                      }
                      //adds a new row for unbundler and tells how many unbundled sets of points there are
                      rowAdderHunThou = rowAdderHunThou + 3;
                      unbundledHunThou = unbundledHunThou + 1;
                      organise(7);
                      organise(6);
                      altText.getBreakOutSentence(7);


                  }
              }
              if (type == "point") {
                  if (
                      pointName.includes("HT") &&
                      ggbObject.getXcoord(grabbed.target) > -21 &&
                      ggbObject.getYcoord(grabbed.target) > -10
                  ) {
                      breakoutHelper(pointName, pointsHT, "XHunThou" + a, xCoord, yCoord);
                      deletedPoints.hundredThousands++;
                      for (var column = 0; column < 2; column++) {
                          for (var row = 0; row < 5; row++) {

                              ggbObject.evalCommand(
                                  "TT" + labelTenThou + "=PointIn(region5)"
                              );
                              altText.setPointCaption("TT" + labelTenThou);

                              ggbObject.setCoords(
                                  "TT" + labelTenThou,
                                  ggbObject.getXcoord("Ig22") + row,
                                  ggbObject.getYcoord("Ig22") -
                                  3 -
                                  column -
                                  rowAdderTenThou
                              );
                              ggbObject.setColor(
                                  "TT" + labelTenThou,
                                  241,
                                  127,
                                  9
                              );
                              ordering.tenThousandsPoints.push("TT" + labelTenThou);
                              ggbObject.setPointSize("TT" + labelTenThou, 9);
                              ggbObject.setLayer("TT" + labelTenThou, 0);
                              pointsTT.push("TT" + labelTenThou);
                              ggbObject.setValue(
                                  "hunthouCount3",
                                  pointsHT.length
                              );
                              ggbObject.setValue(
                                  "tenthouCount3",
                                  pointsTT.length
                              );
                              ggbObject.setVisible("k", true);
                              ggbObject.setVisible("h", true);
                              ggbObject.setVisible("textHunThou3", true);
                              ggbObject.setVisible("textTenThou3", true);
                              ggbObject.setValue("hunThouBool", true);
                              ggbObject.setValue("tenThouBool", true);
                              labelTenThou++;
                          }
                      }
                      rowAdderTenThou = rowAdderTenThou + 3;
                      unbundledTenThou = unbundledTenThou + 1;
                      organise(6);
                      organise(5);
                      altText.getBreakOutSentence(6)

                  }
              }
              if (type == "point") {
                  if (
                      pointName.includes("TT") &&
                      ggbObject.getXcoord(grabbed.target) > -15 &&
                      ggbObject.getYcoord(grabbed.target) > -10
                  ) {
                      breakoutHelper(pointName, pointsTT, "XTenThou" + a, xCoord, yCoord);
                      deletedPoints.TenThousands++;
                      for (var column = 0; column < 2; column++) {
                          for (var row = 0; row < 5; row++) {

                              ggbObject.evalCommand(
                                  "TH" + labelThous + "=PointIn(region4)"
                              );
                              altText.setPointCaption("TH" + labelThous);

                              ggbObject.setCoords(
                                  "TH" + labelThous,
                                  ggbObject.getXcoord("Ig21") + row,
                                  ggbObject.getYcoord("Ig21") -
                                  3 -
                                  column -
                                  rowAdderThous
                              );
                              ggbObject.setColor(
                                  "TH" + labelThous,
                                  120,
                                  120,
                                  120
                              );
                              ggbObject.setPointSize("TH" + labelThous, 9);
                              ggbObject.setLayer("TH" + labelThous, 0);
                              pointsTH.push("TH" + labelThous);
                              ordering.thousandsPoints.push("TH" + labelThous);
                              ggbObject.setValue(
                                  "tenthouCount3",
                                  pointsTT.length
                              );
                              ggbObject.setValue("thouCount3", pointsTH.length);
                              ggbObject.setVisible("h", true);
                              ggbObject.setVisible("i", true);
                              ggbObject.setVisible("textTenThou3", true);
                              ggbObject.setVisible("textThou3", true);
                              ggbObject.setValue("tenThouBool", true);
                              ggbObject.setValue("thouBool", true);
                              labelThous++;
                          }
                      }
                      rowAdderThous = rowAdderThous + 3;
                      unbundledThous = unbundledThous + 1;
                      organise(5);
                      organise(4);
                      altText.getBreakOutSentence(5)

                  }
              }
              if (type == "point") {
                  if (
                      pointName.includes("TH") &&
                      ggbObject.getXcoord(grabbed.target) > -9 &&
                      ggbObject.getYcoord(grabbed.target) > -10
                  ) {
                      breakoutHelper(pointName, pointsTH, "XThou" + a, xCoord, yCoord);
                      deletedPoints.Thousands++;

                      for (var column = 0; column < 2; column++) {
                          for (var row = 0; row < 5; row++) {

                              ggbObject.evalCommand(
                                  "HU" + labelHuns + "=PointIn(region3)"
                              );
                              altText.setPointCaption("HU" + labelHuns);

                              ggbObject.setCoords(
                                  "HU" + labelHuns,
                                  ggbObject.getXcoord("Ig5") + row,
                                  ggbObject.getYcoord("Ig5") -
                                  3 -
                                  column -
                                  rowAdderHuns
                              );

                              ggbObject.setPointSize("HU" + labelHuns, 9);
                              ggbObject.setColor("HU" + labelHuns, 0, 118, 165);
                              ggbObject.setLayer("HU" + labelHuns, 0);
                              pointsH.push("HU" + labelHuns);
                              ordering.hundredsPoints.push("HU" + labelHuns);
                              ggbObject.setValue("thouCount3", pointsTH.length);
                              ggbObject.setValue("hunsCount3", pointsH.length);
                              ggbObject.setVisible("i", true);
                              ggbObject.setVisible("t_1", true);
                              ggbObject.setVisible("textThou3", true);
                              ggbObject.setVisible("textHuns3", true);
                              ggbObject.setValue("thouBool", true);
                              ggbObject.setValue("hunBool", true);
                              labelHuns++;
                          }
                      }
                      rowAdderHuns = rowAdderHuns + 3;
                      unbundledHuns = unbundledHuns + 1;
                      organise(4);
                      organise(3);

                      altText.getBreakOutSentence(4)

                  }
              }
              if (type == "point") {
                  if (
                      pointName.includes("HU") &&
                      ggbObject.getXcoord(grabbed.target) > -3 &&
                      ggbObject.getYcoord(grabbed.target) > -10
                  ) {
                      breakoutHelper(pointName, pointsH, "XHun" + a, xCoord, yCoord);
                      deletedPoints.hundereds++;

                      for (var column = 0; column < 2; column++) {
                          for (var row = 0; row < 5; row++) {

                              ggbObject.evalCommand(
                                  "TE" + labelTens + " =PointIn(region2)"
                              );
                              altText.setPointCaption("TE" + labelTens);

                              ggbObject.setCoords(
                                  "TE" + labelTens,
                                  ggbObject.getXcoord("Ig6") + row,
                                  ggbObject.getYcoord("Ig6") -
                                  3 -
                                  column -
                                  rowAdderTens
                              );
                              ggbObject.setPointSize("TE" + labelTens, 9);
                              ggbObject.setColor("TE" + labelTens, 0, 155, 69);
                              ggbObject.setLayer("TE" + labelTens, 0);
                              pointsT.push("TE" + labelTens);
                              ordering.tensPoints.push("TE" + labelTens);
                              ggbObject.setValue("hunsCount3", pointsH.length);
                              ggbObject.setValue("tensCount3", pointsT.length);
                              ggbObject.setVisible("t_1", true);
                              ggbObject.setVisible("a_1", true);
                              ggbObject.setVisible("textHuns3", true);
                              ggbObject.setVisible("textTens3", true);
                              ggbObject.setValue("hunBool", true);
                              ggbObject.setValue("tenBool", true);
                              labelTens++;
                          }
                      }
                      rowAdderTens = rowAdderTens + 3;
                      unbundledTens = unbundledTens + 1;
                      organise(3);
                      organise(2);
                      altText.getBreakOutSentence(3)

                  }
              }
              if (type == "point") {
                  if (
                      pointName.includes("TE") &&
                      ggbObject.getXcoord(grabbed.target) > 3 &&
                      ggbObject.getYcoord(grabbed.target) > -10
                  ) {
                      breakoutHelper(pointName, pointsT, "XTen" + a, xCoord, yCoord);
                      deletedPoints.tens++;
                      for (var column = 0; column < 2; column++) {
                          for (var row = 0; row < 5; row++) {

                              ggbObject.evalCommand(
                                  "O" + labelOnes + "=PointIn(region1)"
                              );
                              altText.setPointCaption("O" + labelOnes);

                              ggbObject.setCoords(
                                  "O" + labelOnes,
                                  ggbObject.getXcoord("Ig7") + row,
                                  ggbObject.getYcoord("Ig7") -
                                  3 -
                                  column -
                                  rowAdderOnes
                              );
                              ggbObject.setPointSize("O" + labelOnes, 9);

                              ggbObject.setColor("O" + labelOnes, 230, 15, 33);
                              ggbObject.setLayer("O" + labelOnes, 0);
                              pointsO.push("O" + labelOnes);
                              ordering.onesPoints.push("O" + labelOnes);
                              ggbObject.setValue("tensCount3", pointsT.length);
                              ggbObject.setValue("onesCount3", pointsO.length);
                              ggbObject.setVisible("a_1", true);
                              ggbObject.setVisible("b_1", true);
                              ggbObject.setVisible("textTens3", true);
                              ggbObject.setVisible("textOnes3", true);
                              ggbObject.setValue("tenBool", true);
                              ggbObject.setValue("oneBool", true);

                              labelOnes++;
                          }
                      }
                      rowAdderOnes = rowAdderOnes + 3;
                      unbundledOnes = unbundledOnes + 1;
                      organise(2);
                      organise(1);
                      altText.getBreakOutSentence(2)

                  }
              }
              try {

                  if (

                      pointsM.length >= labelMil2 &&
                      pointsHT.length >= labelHunThou2 &&
                      pointsTT.length >= labelTenThou2 &&
                      pointsTH.length >= labelThous2 &&
                      pointsH.length >= labelHuns2 &&
                      pointsT.length >= labelTens2 &&
                      pointsO.length >= labelOnes2
                  ) {
                      //set question button invisible and subtract it button visible
                      enableButton(2, true);
                  } else {
                      enableButton(2, false);
                  }
              } catch (e) {
                  console.log(e);
              }
              updateTabOrderList();
              altText.buildAppletStatus();
          }
      }

      function setSelectedObject(event) {
          try {
              if (event.type == "select") {

                  ggbObject.setTextValue("selectedObject", "" + event.target)

              }
          } catch (error) {
              logger(error)

          }
      }

      function breakOutOnSpace(grabbed) {


          a = a + 1;

          pointName = grabbed;
          type = ggbObject.getObjectType(grabbed);
          // logger("object type")
          // logger(type)
          // logger("grabbed")
          // logger(grabbed)
          if (type == "point") {
              xCoord = ggbObject.getXcoord(grabbed);
              yCoord = ggbObject.getYcoord(grabbed);
          } else {
              // logger("type is not point")
          }

          if (type == "point" && pointName.includes("M")) {
              //point goes from millions to hundred thousands

              breakoutHelper(pointName, pointsM, "XMil" + a, xCoord, yCoord);
              deletedPoints.millions++;
              //set the dragged point to invisible and create ten new points in region
              for (var column = 0; column < 2; column++) {
                  for (var row = 0; row < 5; row++) {
                      ggbObject.evalCommand(
                          "HT" + labelHunThou + "=PointIn(region6)"
                      );
                      altText.setPointCaption("HT" + labelHunThou);
                      ggbObject.setCoords(
                          "HT" + labelHunThou,
                          ggbObject.getXcoord("Ig23") + row,
                          ggbObject.getYcoord("Ig23") -
                          3 -
                          column -
                          rowAdderHunThou
                      );
                      ggbObject.setColor(
                          "HT" + labelHunThou,
                          255,
                          218,
                          0
                      );
                      ggbObject.setPointSize("HT" + labelHunThou, 9);
                      ggbObject.setLayer("HT" + labelHunThou, 0);
                      pointsHT.push("HT" + labelHunThou);
                      ordering.HundredThousandsPoints.push("HT" + labelHunThou);
                      //rewrites the algorithm to reflect new pvc
                      ggbObject.setValue("milCount3", pointsM.length);
                      ggbObject.setValue(
                          "hunthouCount3",
                          pointsHT.length
                      );
                      ggbObject.setVisible("k", true);
                      ggbObject.setVisible("j", true);
                      ggbObject.setVisible("textMil3", true);
                      ggbObject.setVisible("textHunThou3", true);
                      ggbObject.setValue("milBool", true);
                      ggbObject.setValue("hunThouBool", true);
                      labelHunThou++;
                  }
              }
              //adds a new row for unbundler and tells how many unbundled sets of points there are
              rowAdderHunThou = rowAdderHunThou + 3;
              unbundledHunThou = unbundledHunThou + 1;
              organise(7);
              organise(6);
              // ggbReadText("one point in the million area deleted, but ten points are created in the hundred thousands area")
              altText.getBreakOutSentence(7);
              ggbObject.evalCommand("SelectObjects(" + "HT".concat(labelHunThou - 1) + ")");

          } else if (type == "point" && pointName.includes("HT")) {

              breakoutHelper(pointName, pointsHT, "XHunThou" + a, xCoord, yCoord);
              deletedPoints.hundredThousands++;
              for (var column = 0; column < 2; column++) {
                  for (var row = 0; row < 5; row++) {

                      ggbObject.evalCommand(
                          "TT" + labelTenThou + "=PointIn(region5)"
                      );
                      altText.setPointCaption("TT" + labelTenThou);

                      ggbObject.setCoords(
                          "TT" + labelTenThou,
                          ggbObject.getXcoord("Ig22") + row,
                          ggbObject.getYcoord("Ig22") -
                          3 -
                          column -
                          rowAdderTenThou
                      );
                      ggbObject.setColor(
                          "TT" + labelTenThou,
                          241,
                          127,
                          9
                      );
                      ggbObject.setLayer("TT" + labelTenThou, 0);
                      pointsTT.push("TT" + labelTenThou);
                      ordering.tenThousandsPoints.push("TT" + labelTenThou);
                      ggbObject.setValue(
                          "hunthouCount3",
                          pointsHT.length
                      );
                      ggbObject.setValue(
                          "tenthouCount3",
                          pointsTT.length
                      );
                      ggbObject.setPointSize("TT" + labelTenThou, 9);
                      ggbObject.setVisible("k", true);
                      ggbObject.setVisible("h", true);
                      ggbObject.setVisible("textHunThou3", true);
                      ggbObject.setVisible("textTenThou3", true);
                      ggbObject.setValue("hunThouBool", true);
                      ggbObject.setValue("tenThouBool", true);
                      labelTenThou++;
                  }
              }
              rowAdderTenThou = rowAdderTenThou + 3;
              unbundledTenThou = unbundledTenThou + 1;
              organise(6);
              organise(5);
              altText.getBreakOutSentence(6)
              ggbObject.evalCommand("SelectObjects(" + "TT".concat(labelTenThou - 1) + ")");

          } else if (type == "point" && pointName.includes("TT")) {

              breakoutHelper(pointName, pointsTT, "XTenThou" + a, xCoord, yCoord);
              deletedPoints.TenThousands++;
              for (var column = 0; column < 2; column++) {
                  for (var row = 0; row < 5; row++) {

                      ggbObject.evalCommand(
                          "TH" + labelThous + "=PointIn(region4)"
                      );
                      altText.setPointCaption("TH" + labelThous);

                      ggbObject.setCoords(
                          "TH" + labelThous,
                          ggbObject.getXcoord("Ig21") + row,
                          ggbObject.getYcoord("Ig21") -
                          3 -
                          column -
                          rowAdderThous
                      );
                      ggbObject.setColor(
                          "TH" + labelThous,
                          120,
                          120,
                          120
                      );
                      ggbObject.setPointSize("TH" + labelThous, 9);
                      ggbObject.setLayer("TH" + labelThous, 0);
                      pointsTH.push("TH" + labelThous);
                      ordering.thousandsPoints.push("TH" + labelThous);
                      ggbObject.setValue(
                          "tenthouCount3",
                          pointsTT.length
                      );
                      ggbObject.setValue("thouCount3", pointsTH.length);
                      ggbObject.setVisible("h", true);
                      ggbObject.setVisible("i", true);
                      ggbObject.setVisible("textTenThou3", true);
                      ggbObject.setVisible("textThou3", true);
                      ggbObject.setValue("tenThouBool", true);
                      ggbObject.setValue("thouBool", true);
                      labelThous++;
                  }
              }
              rowAdderThous = rowAdderThous + 3;
              unbundledThous = unbundledThous + 1;
              organise(5);
              organise(4);
              altText.getBreakOutSentence(5)
              ggbObject.evalCommand("SelectObjects(" + "TH".concat(labelThous - 1) + ")");


          } else if (type == "point" && pointName.includes("TH")) {

              breakoutHelper(pointName, pointsTH, "XThou" + a, xCoord, yCoord);
              deletedPoints.Thousands++;
              for (var column = 0; column < 2; column++) {
                  for (var row = 0; row < 5; row++) {

                      ggbObject.evalCommand(
                          "HU" + labelHuns + "=PointIn(region3)"
                      );
                      altText.setPointCaption("HU" + labelHuns);

                      ggbObject.setCoords(
                          "HU" + labelHuns,
                          ggbObject.getXcoord("Ig5") + row,
                          ggbObject.getYcoord("Ig5") -
                          3 -
                          column -
                          rowAdderHuns
                      );
                      ggbObject.setPointSize("HU" + labelHuns, 9);
                      ggbObject.setColor("HU" + labelHuns, 0, 118, 165);
                      ggbObject.setLayer("HU" + labelHuns, 0);
                      pointsH.push("HU" + labelHuns);
                      ordering.hundredsPoints.push("HU" + labelHuns);
                      ggbObject.setValue("thouCount3", pointsTH.length);
                      ggbObject.setValue("hunsCount3", pointsH.length);
                      ggbObject.setVisible("i", true);
                      ggbObject.setVisible("t_1", true);
                      ggbObject.setVisible("textThou3", true);
                      ggbObject.setVisible("textHuns3", true);
                      ggbObject.setValue("thouBool", true);
                      ggbObject.setValue("hunBool", true);
                      labelHuns++;
                  }
              }
              rowAdderHuns = rowAdderHuns + 3;
              unbundledHuns = unbundledHuns + 1;
              organise(4);
              organise(3);
              altText.getBreakOutSentence(4)
              ggbObject.evalCommand("SelectObjects(" + "HU".concat(labelHuns - 1) + ")");


          } else if (type == "point" && pointName.includes("HU")) {

              breakoutHelper(pointName, pointsH, "XHun" + a, xCoord, yCoord);
              deletedPoints.hundereds++;
              for (var column = 0; column < 2; column++) {
                  for (var row = 0; row < 5; row++) {

                      ggbObject.evalCommand(
                          "TE" + labelTens + " =PointIn(region2)"
                      );
                      altText.setPointCaption("TE" + labelTens);

                      ggbObject.setCoords(
                          "TE" + labelTens,
                          ggbObject.getXcoord("Ig6") + row,
                          ggbObject.getYcoord("Ig6") -
                          3 -
                          column -
                          rowAdderTens
                      );
                      ggbObject.setPointSize("TE" + labelTens, 9);
                      ggbObject.setColor("TE" + labelTens, 0, 155, 69);
                      ggbObject.setLayer("TE" + labelTens, 0);
                      pointsT.push("TE" + labelTens);
                      ordering.tensPoints.push("TE" + labelTens);
                      ggbObject.setValue("hunsCount3", pointsH.length);
                      ggbObject.setValue("tensCount3", pointsT.length);
                      ggbObject.setVisible("t_1", true);
                      ggbObject.setVisible("a_1", true);
                      ggbObject.setVisible("textHuns3", true);
                      ggbObject.setVisible("textTens3", true);
                      ggbObject.setValue("hunBool", true);
                      ggbObject.setValue("tenBool", true);
                      labelTens++;
                  }
              }
              rowAdderTens = rowAdderTens + 3;
              unbundledTens = unbundledTens + 1;
              organise(3);
              organise(2);
              altText.getBreakOutSentence(3)
              ggbObject.evalCommand("SelectObjects(" + "TE".concat(labelTens - 1) + ")");

          } else if (type == "point" && pointName.includes("TE")) {

              breakoutHelper(pointName, pointsT, "XTen" + a, xCoord, yCoord);
              deletedPoints.tens++;
              for (var column = 0; column < 2; column++) {
                  for (var row = 0; row < 5; row++) {

                      ggbObject.evalCommand(
                          "O" + labelOnes + "=PointIn(region1)"
                      );
                      altText.setPointCaption("O" + labelOnes);

                      ggbObject.setCoords(
                          "O" + labelOnes,
                          ggbObject.getXcoord("Ig7") + row,
                          ggbObject.getYcoord("Ig7") -
                          3 -
                          column -
                          rowAdderOnes
                      );
                      ggbObject.setPointSize("O" + labelOnes, 9);
                      ggbObject.setColor("O" + labelOnes, 230, 15, 33);
                      ggbObject.setLayer("O" + labelOnes, 0);
                      pointsO.push("O" + labelOnes);
                      ordering.onesPoints.push("O" + labelOnes);
                      ggbObject.setValue("tensCount3", pointsT.length);
                      ggbObject.setValue("onesCount3", pointsO.length);
                      ggbObject.setVisible("a_1", true);
                      ggbObject.setVisible("b_1", true);
                      ggbObject.setVisible("textTens3", true);
                      ggbObject.setVisible("textOnes3", true);
                      ggbObject.setValue("tenBool", true);
                      ggbObject.setValue("oneBool", true);
                      labelOnes++;
                  }
              }
              rowAdderOnes = rowAdderOnes + 3;
              unbundledOnes = unbundledOnes + 1;
              organise(2);
              organise(1);
              altText.getBreakOutSentence(2)
              ggbObject.evalCommand("SelectObjects(" + "O".concat(labelOnes - 1) + ")");

          }
          try {
              if (

                  pointsM.length >= labelMil2 &&
                  pointsHT.length >= labelHunThou2 &&
                  pointsTT.length >= labelTenThou2 &&
                  pointsTH.length >= labelThous2 &&
                  pointsH.length >= labelHuns2 &&
                  pointsT.length >= labelTens2 &&
                  pointsO.length >= labelOnes2
              ) {
                  //set question button invisible and subtract it button visible
                  enableButton(2, true);
              } else {
                  enableButton(2, false);
              }
          } catch (e) {
              console.log(e);
          }
          if (type == "point") {
              updateTabOrderList();
              altText.buildAppletStatus();
          } else {
              // logger("type is not point")
          }

      }


      function boundIt2(inputBox, min, max) {
          //logger("bound it function")
          const result2 = ggbObject.getValue(inputBox);
          if (Number.isNaN(result2)) {
              ////logger("463- ggbObject.setValue(inputBox,0); ")
              ggbObject.setValue(inputBox, 0);

          } else if (result2 < min) {
              ggbObject.setValue(inputBox, min);
              //logger3("boundit2"," value is less than min value ", max)
              return min;
          } else if (result2 > max) {
              //logger2("value is more than max value ", max)
              ggbObject.setValue(inputBox, max);
              return max;
          }
          return result2;
      }

      function matchIt() {
          try {
              if (pointsM.length >= labelMil2) {
                  //create x points in millions region and add point name to list of points in that region
                  for (var popLoop = 0; popLoop < labelMil2; popLoop++) {
                      ggbObject.evalCommand("MB" + popLoop + "=PointIn(box)");
                      ggbObject.setCoords(
                          "MB" + popLoop,
                          ggbObject.getXcoord(pointsM[popLoop]),
                          ggbObject.getYcoord(pointsM[popLoop])
                      );
                      ggbObject.setVisible("MB" + popLoop, false);
                      if (labelMil2 == 1) {
                          ggbObject.evalCommand(
                              "MBCross" +
                              popLoop +
                              "=Segment(MB" +
                              popLoop +
                              "-(0.5,0.5),MB" +
                              popLoop +
                              "+(0.5,0.5))"
                          );
                          ggbObject.setFixed("MBCross" + popLoop, true, false);
                          ggbObject.setLayer("MBCross" + popLoop, 2);
                          ggbObject.setColor("MBCross" + popLoop, 0, 0, 0);
                      } else {
                          ggbObject.evalCommand(
                              "MBCross" +
                              popLoop +
                              "=Segment(MB" +
                              popLoop +
                              "+(0.5,0),MB" +
                              popLoop +
                              "-(0.5,0))"
                          );
                          ggbObject.setFixed("MBCross" + popLoop, true, false);
                          ggbObject.setLayer("MBCross" + popLoop, 2);
                          ggbObject.setColor("MBCross" + popLoop, 0, 0, 0);
                      }
                  }
              }
              if (pointsHT.length >= labelHunThou2) {
                  //create x points in hundred thousands region and add point name to list of points in that region
                  for (var popLoop = 0; popLoop < labelHunThou2; popLoop++) {
                      ggbObject.evalCommand("HTB" + popLoop + "=PointIn(box)");
                      ggbObject.setCoords(
                          "HTB" + popLoop,
                          ggbObject.getXcoord(pointsHT[popLoop]),
                          ggbObject.getYcoord(pointsHT[popLoop])
                      );
                      ggbObject.setVisible("HTB" + popLoop, false);
                      if (labelHunThou2 == 1) {
                          ggbObject.evalCommand(
                              "HTBCross" +
                              popLoop +
                              "=Segment(HTB" +
                              popLoop +
                              "-(0.5,0.5),HTB" +
                              popLoop +
                              "+(0.5,0.5))"
                          );
                          ggbObject.setFixed("HTBCross" + popLoop, true, false);
                          ggbObject.setLayer("HTBCross" + popLoop, 2);
                          ggbObject.setColor("HTBCross" + popLoop, 0, 0, 0);
                      } else {
                          ggbObject.evalCommand(
                              "HTBCross" +
                              popLoop +
                              "=Segment(HTB" +
                              popLoop +
                              "+(0.5,0),HTB" +
                              popLoop +
                              "-(0.5,0))"
                          );
                          ggbObject.setFixed("HTBCross" + popLoop, true, false);
                          ggbObject.setLayer("HTBCross" + popLoop, 2);
                          ggbObject.setColor("HTBCross" + popLoop, 0, 0, 0);
                      }
                  }
              }
              if (pointsTT.length >= labelTenThou2) {
                  //create x points in ten thousands region and add point name to list of points in that region
                  for (var popLoop = 0; popLoop < labelTenThou2; popLoop++) {
                      ggbObject.evalCommand("TTB" + popLoop + "=PointIn(box)");
                      ggbObject.setCoords(
                          "TTB" + popLoop,
                          ggbObject.getXcoord(pointsTT[popLoop]),
                          ggbObject.getYcoord(pointsTT[popLoop])
                      );
                      ggbObject.setVisible("TTB" + popLoop, false);
                      if (labelTenThou2 == 1) {
                          ggbObject.evalCommand(
                              "TTBCross" +
                              popLoop +
                              "=Segment(TTB" +
                              popLoop +
                              "-(0.5,0.5),TTB" +
                              popLoop +
                              "+(0.5,0.5))"
                          );
                          ggbObject.setFixed("TTBCross" + popLoop, true, false);
                          ggbObject.setLayer("TTBCross" + popLoop, 2);
                          ggbObject.setColor("TTBCross" + popLoop, 0, 0, 0);
                      } else {
                          ggbObject.evalCommand(
                              "TTBCross" +
                              popLoop +
                              "=Segment(TTB" +
                              popLoop +
                              "+(0.5,0),TTB" +
                              popLoop +
                              "-(0.5,0))"
                          );
                          ggbObject.setFixed("TTBCross" + popLoop, true, false);
                          ggbObject.setLayer("TTBCross" + popLoop, 2);
                          ggbObject.setColor("TTBCross" + popLoop, 0, 0, 0);
                      }
                  }
              }
              if (pointsTH.length >= labelThous2) {
                  //create x points in thousands region and add point name to list of points in that region
                  for (var popLoop = 0; popLoop < labelThous2; popLoop++) {
                      ggbObject.evalCommand("THB" + popLoop + "=PointIn(box)");
                      ggbObject.setCoords(
                          "THB" + popLoop,
                          ggbObject.getXcoord(pointsTH[popLoop]),
                          ggbObject.getYcoord(pointsTH[popLoop])
                      );
                      ggbObject.setVisible("THB" + popLoop, false);
                      if (labelThous2 == 1) {
                          ggbObject.evalCommand(
                              "THBCross" +
                              popLoop +
                              "=Segment(THB" +
                              popLoop +
                              "-(0.5,0.5),THB" +
                              popLoop +
                              "+(0.5,0.5))"
                          );
                          ggbObject.setFixed("THBCross" + popLoop, true, false);
                          ggbObject.setLayer("THBCross" + popLoop, 2);
                          ggbObject.setColor("THBCross" + popLoop, 0, 0, 0);
                      } else {
                          ggbObject.evalCommand(
                              "THBCross" +
                              popLoop +
                              "=Segment(THB" +
                              popLoop +
                              "+(0.5,0),THB" +
                              popLoop +
                              "-(0.5,0))"
                          );
                          ggbObject.setFixed("THBCross" + popLoop, true, false);
                          ggbObject.setLayer("THBCross" + popLoop, 2);
                          ggbObject.setColor("THBCross" + popLoop, 0, 0, 0);
                      }
                  }
              }
              if (pointsH.length >= labelHuns2) {
                  //create x points in hundreds region and add point name to list of points in that region
                  for (var popLoop = 0; popLoop < labelHuns2; popLoop++) {
                      ggbObject.evalCommand("HB" + popLoop + "=PointIn(box)");
                      ggbObject.setCoords(
                          "HB" + popLoop,
                          ggbObject.getXcoord(pointsH[popLoop]),
                          ggbObject.getYcoord(pointsH[popLoop])
                      );
                      ggbObject.setVisible("HB" + popLoop, false);
                      if (labelHuns2 == 1) {
                          ggbObject.evalCommand(
                              "HBCross" +
                              popLoop +
                              "=Segment(HB" +
                              popLoop +
                              "-(0.5,0.5),HB" +
                              popLoop +
                              "+(0.5,0.5))"
                          );
                          ggbObject.setFixed("HBCross" + popLoop, true, false);
                          ggbObject.setLayer("HBCross" + popLoop, 2);
                          ggbObject.setColor("HBCross" + popLoop, 0, 0, 0);
                      } else {
                          ggbObject.evalCommand(
                              "HBCross" +
                              popLoop +
                              "=Segment(HB" +
                              popLoop +
                              "+(0.5,0),HB" +
                              popLoop +
                              "-(0.5,0))"
                          );
                          ggbObject.setFixed("HBCross" + popLoop, true, false);
                          ggbObject.setLayer("HBCross" + popLoop, 2);
                          ggbObject.setColor("HBCross" + popLoop, 0, 0, 0);
                      }
                  }
              }
              if (pointsT.length >= labelTens2) {
                  //create x points in tens region and add point name to list of points in that region
                  for (var popLoop = 0; popLoop < labelTens2; popLoop++) {
                      ggbObject.evalCommand("TB" + popLoop + "=PointIn(box)");
                      ggbObject.setCoords(
                          "TB" + popLoop,
                          ggbObject.getXcoord(pointsT[popLoop]),
                          ggbObject.getYcoord(pointsT[popLoop])
                      );
                      ggbObject.setVisible("TB" + popLoop, false);
                      if (labelTens2 == 1) {
                          ggbObject.evalCommand(
                              "TBCross" +
                              popLoop +
                              "=Segment(TB" +
                              popLoop +
                              "-(0.5,0.5),TB" +
                              popLoop +
                              "+(0.5,0.5))"
                          );
                          ggbObject.setFixed("TBCross" + popLoop, true, false);
                          ggbObject.setLayer("TBCross" + popLoop, 2);
                          ggbObject.setColor("TBCross" + popLoop, 0, 0, 0);
                      } else {
                          ggbObject.evalCommand(
                              "TBCross" +
                              popLoop +
                              "=Segment(TB" +
                              popLoop +
                              "+(0.5,0),TB" +
                              popLoop +
                              "-(0.5,0))"
                          );
                          ggbObject.setFixed("TBCross" + popLoop, true, false);
                          ggbObject.setLayer("TBCross" + popLoop, 2);
                          ggbObject.setColor("TBCross" + popLoop, 0, 0, 0);
                      }
                  }
              }
              if (pointsO.length >= labelOnes2) {
                  //create x points in ones region and add point name to list of points in that region
                  for (var popLoop = 0; popLoop < labelOnes2; popLoop++) {
                      ggbObject.evalCommand("OB" + popLoop + "=PointIn(box)");
                      ggbObject.setCoords(
                          "OB" + popLoop,
                          ggbObject.getXcoord(pointsO[popLoop]),
                          ggbObject.getYcoord(pointsO[popLoop])
                      );
                      ggbObject.setVisible("OB" + popLoop, false);
                      if (labelOnes2 == 1) {
                          ggbObject.evalCommand(
                              "OBCross" +
                              popLoop +
                              "=Segment(OB" +
                              popLoop +
                              "-(0.5,0.5),OB" +
                              popLoop +
                              "+(0.5,0.5))"
                          );
                          ggbObject.setFixed("OBCross" + popLoop, true, false);
                          ggbObject.setLayer("OBCross" + popLoop, 2);
                          ggbObject.setColor("OBCross" + popLoop, 0, 0, 0);
                      } else {
                          ggbObject.evalCommand(
                              "OBCross" +
                              popLoop +
                              "=Segment(OB" +
                              popLoop +
                              "+(0.5,0),OB" +
                              popLoop +
                              "-(0.5,0))"
                          );
                          ggbObject.setFixed("OBCross" + popLoop, true, false);
                          ggbObject.setLayer("OBCross" + popLoop, 2);
                          ggbObject.setColor("OBCross" + popLoop, 0, 0, 0);
                      }
                  }
              }
              //if all of the points at the top are more than all of the points on the bottom, show the answer to the problem
              if (
                  pointsM.length >= labelMil2 &&
                  pointsHT.length >= labelHunThou2 &&
                  pointsTT.length >= labelTenThou2 &&
                  pointsTH.length >= labelThous2 &&
                  pointsH.length >= labelHuns2 &&
                  pointsT.length >= labelTens2 &&
                  pointsO.length >= labelOnes2
              ) {
                  ggbObject.setVisible("textMil4", true);
                  ggbObject.setVisible("textHunThou4", true);
                  ggbObject.setVisible("textTenThou4", true);
                  ggbObject.setVisible("textThou4", true);
                  ggbObject.setVisible("textHuns4", true);
                  ggbObject.setVisible("textTens4", true);
                  ggbObject.setVisible("textOnes4", true);
              } else {
                  ggbObject.setVisible("textMil4", false);
                  ggbObject.setVisible("textHunThou4", false);
                  ggbObject.setVisible("textTenThou4", false);
                  ggbObject.setVisible("textThou4", false);
                  ggbObject.setVisible("textHuns4", false);
                  ggbObject.setVisible("textTens4", false);
                  ggbObject.setVisible("textOnes4", false);
              }
              setAnswerText();
              let everything = ggbObject.getAllObjectNames("point");
              for (let i = 0, L = everything.length; i < L; i++) {
                  ggbObject.setFixed(everything[i], true, false);
              }
          } catch (e) {
              console.log(e);
          }

      }

      function setAnswerText() {
          ggbObject.setVisible("textMil4", true);
          ggbObject.setVisible("textHunThou4", true);
          ggbObject.setVisible("textTenThou4", true);
          ggbObject.setVisible("textThou4", true);
          ggbObject.setVisible("textHuns4", true);
          ggbObject.setVisible("textTens4", true);
          ggbObject.setVisible("textOnes4", true);
          ggbObject.setVisible("textComma4", true);
          ggbObject.setVisible("textCommas4", true);
          if (ggbObject.getValue("milCount4") == 0) {
              ggbObject.setVisible("textMil4", false);
              ggbObject.setVisible("textCommas4", false);
          }
          if (
              ggbObject.getValue("milCount4") == 0 &&
              ggbObject.getValue("hunthouCount4") == 0
          ) {
              ggbObject.setVisible("textMil4", false);
              ggbObject.setVisible("textHunThou4", false);
              ggbObject.setVisible("textCommas4", false);
          }
          if (
              ggbObject.getValue("milCount4") == 0 &&
              ggbObject.getValue("hunthouCount4") == 0 &&
              ggbObject.getValue("tenthouCount4") == 0
          ) {
              ggbObject.setVisible("textMil4", false);
              ggbObject.setVisible("textHunThou4", false);
              ggbObject.setVisible("textTenThou4", false);
              ggbObject.setVisible("textCommas4", false);
          }
          if (
              ggbObject.getValue("milCount4") == 0 &&
              ggbObject.getValue("hunthouCount4") == 0 &&
              ggbObject.getValue("tenthouCount4") == 0 &&
              ggbObject.getValue("thouCount4") == 0
          ) {
              ggbObject.setVisible("textMil4", false);
              ggbObject.setVisible("textHunThou4", false);
              ggbObject.setVisible("textTenThou4", false);
              ggbObject.setVisible("textThou4", false);
              ggbObject.setVisible("textCommas4", false);
              ggbObject.setVisible("textComma4", false);
          }
          if (
              ggbObject.getValue("milCount4") == 0 &&
              ggbObject.getValue("hunthouCount4") == 0 &&
              ggbObject.getValue("tenthouCount4") == 0 &&
              ggbObject.getValue("thouCount4") == 0 &&
              ggbObject.getValue("hunsCount4") == 0
          ) {
              ggbObject.setVisible("textMil4", false);
              ggbObject.setVisible("textHunThou4", false);
              ggbObject.setVisible("textTenThou4", false);
              ggbObject.setVisible("textThou4", false);
              ggbObject.setVisible("textHuns4", false);
              ggbObject.setVisible("textCommas4", false);
              ggbObject.setVisible("textComma4", false);
          }
          if (
              ggbObject.getValue("milCount4") == 0 &&
              ggbObject.getValue("hunthouCount4") == 0 &&
              ggbObject.getValue("tenthouCount4") == 0 &&
              ggbObject.getValue("thouCount4") == 0 &&
              ggbObject.getValue("hunsCount4") == 0 &&
              ggbObject.getValue("tensCount4") == 0
          ) {
              ggbObject.setVisible("textMil4", false);
              ggbObject.setVisible("textHunThou4", false);
              ggbObject.setVisible("textTenThou4", false);
              ggbObject.setVisible("textThou4", false);
              ggbObject.setVisible("textHuns4", false);
              ggbObject.setVisible("textTens4", false);
              ggbObject.setVisible("textCommas4", false);
              ggbObject.setVisible("textComma4", false);
          }
      }


      function reset() {
          click = 0;
          //set question button visible and subtract it button invisible
          //    ggbObject.setVisible("subtract", true);
          //    ggbObject.setVisible("button1", false);
          resetTabOrder();
          ordering.reset();
          rowAdderOnes = 0;
          rowAdderTens = 0;
          rowAdderHuns = 0;
          rowAdderThous = 0;
          rowAdderTenThou = 0;
          rowAdderHunThou = 0;
          rowAdderMil = 0;
          unbundledMil = 0;
          unbundledHunThou = 0;
          unbundledTenThou = 0;
          unbundledThous = 0;
          unbundledHuns = 0;
          unbundledTens = 0;
          unbundledOnes = 0;
          trackedInput1 = -1;
          trackedInput2 = -1;
          pointsM = [];
          pointsHT = [];
          pointsTT = [];
          pointsTH = [];
          pointsH = [];
          pointsT = [];
          pointsO = [];
          pointNames = [];
          labelMil = ggbObject.getValue("milCount");
          labelHunThou = ggbObject.getValue("hunthouCount");
          labelTenThou = ggbObject.getValue("tenthouCount");
          labelThous = ggbObject.getValue("thouCount");
          labelHuns = ggbObject.getValue("hunsCount");
          labelTens = ggbObject.getValue("tensCount");
          labelOnes = ggbObject.getValue("onesCount");
          labelMil2 = ggbObject.getValue("milCount2");
          labelHunThou2 = ggbObject.getValue("hunthouCount2");
          labelTenThou2 = ggbObject.getValue("tenthouCount2");
          labelThous2 = ggbObject.getValue("thouCount2");
          labelHuns2 = ggbObject.getValue("hunsCount2");
          labelTens2 = ggbObject.getValue("tensCount2");
          labelOnes2 = ggbObject.getValue("onesCount2");


          //sets the cross outs and extra text invisible
          //    ggbObject.setVisible("f", false);
          ggbObject.setVisible("k", false);
          ggbObject.setVisible("j", false);

          //    ggbObject.setVisible("g", false);
          ggbObject.setVisible("h", false);
          ggbObject.setVisible("i", false);
          ggbObject.setVisible("a_1", false);
          ggbObject.setVisible("b_1", false);
          ggbObject.setVisible("t_1", false);
          ggbObject.setVisible("textMil", false);
          ggbObject.setVisible("textHunThou", false);
          ggbObject.setVisible("textTenThou", false);
          ggbObject.setVisible("textThou", false);
          ggbObject.setVisible("textHuns", false);
          ggbObject.setVisible("textTens", false);
          ggbObject.setVisible("textOnes", false);
          ggbObject.setVisible("textMil2", false);
          ggbObject.setVisible("textHunThou2", false);
          ggbObject.setVisible("textTenThou2", false);
          ggbObject.setVisible("textThou2", false);
          ggbObject.setVisible("textHuns2", false);
          ggbObject.setVisible("textTens2", false);
          ggbObject.setVisible("textOnes2", false);
          ggbObject.setVisible("textMil3", false);
          ggbObject.setVisible("textHunThou3", false);
          ggbObject.setVisible("textTenThou3", false);
          ggbObject.setVisible("textThou3", false);
          ggbObject.setVisible("textHuns3", false);
          ggbObject.setVisible("textTens3", false);
          ggbObject.setVisible("textOnes3", false);
          ggbObject.setVisible("textMil4", false);
          ggbObject.setVisible("textHunThou4", false);
          ggbObject.setVisible("textTenThou4", false);
          ggbObject.setVisible("textThou4", false);
          ggbObject.setVisible("textHuns4", false);
          ggbObject.setVisible("textTens4", false);
          ggbObject.setVisible("textOnes4", false);
          ggbObject.setVisible("textComma", false);
          ggbObject.setVisible("textComma2", false);
          ggbObject.setVisible("textComma4", false);
          ggbObject.setVisible("textCommas", false);
          ggbObject.setVisible("textCommas2", false);
          ggbObject.setVisible("textCommas4", false);

          ggbObject.setValue("milBool", false);
          ggbObject.setValue("hunThouBool", false);
          ggbObject.setValue("tenThouBool", false);
          ggbObject.setValue("thouBool", false);
          ggbObject.setValue("hunBool", false);
          ggbObject.setValue("tenBool", false);
          ggbObject.setValue("oneBool", false);
          ggbObject.setTextValue("AAppletStatus", "A place value chart shows One, Ten, Hundred, Thousand, TenThousand, and HundredThousand. Press tab to select next object.");
          deletedPoints.reset();
          altText.reset();
          // ggbObject.setValue("subt1", "?");
          // ggbObject.setValue("subt2", "?");



          //determined what points where not integral to applet and deletes them
          pointNames = ggbObject.getAllObjectNames("point");
          lengthPointNames = pointNames.length;
          for (iter9 = 0; iter9 < lengthPointNames; iter9++) {
              if (!(pointNames[iter9].includes("Ig") || pointNames[iter9] === "corner1" || pointNames[iter9] === "corner2" || pointNames[iter9] === "corner3" || pointNames[iter9] === "corner4" || pointNames[iter9] === "corner" || pointNames[iter9] === "BottomLeftButtonBar" || pointNames[iter9] === "BottomRightButtonBar" || pointNames[iter9] === "InstructionsIconPoint" || pointNames[iter9] === "XIconPoint" || pointNames[iter9] === "KeyInstructionsBR" || pointNames[iter9] === "KeyInstructionsTL" || pointNames[iter9] === "Export_1" || pointNames[iter9] === "Export_2" || pointNames[iter9] === "HHH")) {

                  ggbObject.deleteObject(pointNames[iter9]);
              }
          }
          intiList = "InputBox2,textMinus,InputBox3,ggbButton1,ggbButton2,ggbButton3";

          try {
              setTabOrder(intiList, addeList, enders);
          } catch (e) {
              logger("error in tab order ")
              console.log(e);
          }
      }

      function reset2() {
          reset();
          ggbObject.evalCommand(
              "SetValue( subt1, ? )"
          );
          ggbObject.evalCommand(
              "SetValue( subt2, ? )"
          );
      }

      function resetTabOrder() {
          var intiList1 = "InputBox2,textMinus,InputBox3,ggbButton1,ggbButton2,ggbButton3";
          var addeList1 = "";
          var enders1 = "";
          try {

              setTabOrder(intiList1, addeList1, enders1);

          } catch (e) {
              logger("error in tab order ")
              console.log("" + e);
          }
      }

      function trackinputs() {
          const result1 = ggbObject.getValue("subt1");
          const result2 = ggbObject.getValue("subt2");
          if (result1 !== trackedInput1 || result2 !== trackedInput2) {
              reset();
              enableButton(1, true);
              trackedInput1 = result1;
              trackedInput2 = result2;
          }
      }


      function quickChange() {
          trackinputs();
          if (ggbObject.getValue("ggbButton1Enabled")) {
              ggbObject.setVisible("k", false);
              ggbObject.setVisible("j", false);

              //    ggbObject.setVisible("g", false);
              ggbObject.setVisible("h", false);
              ggbObject.setVisible("i", false);
              ggbObject.setVisible("a_1", false);
              ggbObject.setVisible("b_1", false);
              ggbObject.setVisible("t_1", false);
              ggbObject.setVisible("textMil", false);
              ggbObject.setVisible("textHunThou", false);
              ggbObject.setVisible("textTenThou", false);
              ggbObject.setVisible("textThou", false);
              ggbObject.setVisible("textHuns", false);
              ggbObject.setVisible("textTens", false);
              ggbObject.setVisible("textOnes", false);
              ggbObject.setVisible("textMil2", false);
              ggbObject.setVisible("textHunThou2", false);
              ggbObject.setVisible("textTenThou2", false);
              ggbObject.setVisible("textThou2", false);
              ggbObject.setVisible("textHuns2", false);
              ggbObject.setVisible("textTens2", false);
              ggbObject.setVisible("textOnes2", false);
              ggbObject.setVisible("textMil3", false);
              ggbObject.setVisible("textHunThou3", false);
              ggbObject.setVisible("textTenThou3", false);
              ggbObject.setVisible("textThou3", false);
              ggbObject.setVisible("textHuns3", false);
              ggbObject.setVisible("textTens3", false);
              ggbObject.setVisible("textOnes3", false);
              ggbObject.setVisible("textMil4", false);
              ggbObject.setVisible("textHunThou4", false);
              ggbObject.setVisible("textTenThou4", false);
              ggbObject.setVisible("textThou4", false);
              ggbObject.setVisible("textHuns4", false);
              ggbObject.setVisible("textTens4", false);
              ggbObject.setVisible("textOnes4", false);
              ggbObject.setVisible("textComma", false);
              ggbObject.setVisible("textComma2", false);
              ggbObject.setVisible("textComma4", false);
              ggbObject.setVisible("textCommas", false);
              ggbObject.setVisible("textCommas2", false);
              ggbObject.setVisible("textCommas4", false);

              ggbObject.setValue("milBool", false);
              ggbObject.setValue("hunThouBool", false);
              ggbObject.setValue("tenThouBool", false);
              ggbObject.setValue("thouBool", false);
              ggbObject.setValue("hunBool", false);
              ggbObject.setValue("tenBool", false);
              ggbObject.setValue("oneBool", false);
          }

          // enableButton(1, true);
          // enableButton(2, false);
          // enableButton(3, false);
      }

      //add new stuff above this line
  });

  /*
   * IgNORE BELOW
   */
  function loadUtils() {
      function parseJS(JSString) {
          return Function("" + JSString)();
      }
      if (!window.didUtils || !window.didUtils.setupGGB) {
          return fetch("https://cdn.dIgital.greatminds.org/did-utils/latest/index.js", {
              cache: "no-cache",
          })
              .then(function(response) {
                  return response.text();
              })
              .then(function(codingText) {
                  parseJS(codingText);
              })
              .then(function() {
                  return window.didUtils.setupGGB;
              });
      }
      return Promise.resolve(window.didUtils.setupGGB);
  }
}
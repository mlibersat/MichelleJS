const { ggb1, feedback1, text1, buttonGroup1 } = components;

ggbObject.setErrorDialogsActive(false);

// buttonGroup1.on("click:1", () => {
//   // buttonGroup1.updateSingleButton({ disabled: true }, 1);
//   // buttonGroup1.updateSingleButton({ disabled: false }, 2);
//   if (ggbObject.getValue("correct")) {
//     ggbObject.evalCommand(`SetValue(showCheckMark, true)`);
//     ggbObject.evalCommand(`ReadText("The beam is balanced.")`);
//   } else if (ggbObject.getValue("wrongLeft")) {
//     ggbObject.setAnimating("CCangle", false);
//     ggbObject.setValue("CCangle", 0);
//     ggbObject.setAnimating("CCangle", true);
//     ggbObject.startAnimation();
//     ggbObject.evalCommand(`ReadText("The beam tilts to the left.")`);
//   } else {
//     ggbObject.setAnimating("CWangle", false);
//     ggbObject.setValue("CWangle", 0);
//     ggbObject.setAnimating("CWangle", true);
//     ggbObject.startAnimation();
//     ggbObject.evalCommand(`ReadText("The beam tilts to the right.")`);
//   }
// });

// buttonGroup1.on("click:2", () => {
//   // buttonGroup1.updateSingleButton({ disabled: false }, 1);
//   // buttonGroup1.updateSingleButton({ disabled: true }, 2);
//   ggbObject.setAnimating("CCangle", false);
//   ggbObject.setAnimating("CWangle", false);
//   ggbObject.setValue("CCangle", 0);
//   ggbObject.setValue("CWangle", 0);
//   ggbObject.evalCommand(`SetValue(showCheckMark, false)`);
//   ggbObject.evalCommand(`ReadText(AAppletStatus)`);
// });

/*
{"compTotals":{"geogebra":1,"textbox":2,"buttongroup":1},"stage":"Launch","lessonInfo":"6 M6 TB L08 - The Mean as a Balance Point","teacherView":false,"layout":"two col"}
*/

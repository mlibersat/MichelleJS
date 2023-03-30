const {
  text1,
  table1,
  cc_submit_c997e1f0e31b_textbox1: submitText1,
  cc_submit_c997e1f0e31b_input1: submitInput1,
  cc_submit_c997e1f0e31b_button1: submitButton1,
} = components;

// const readOrder = [text1, table1, submitText1, submitInput1, submitButton1];

const safeRoundingPlace = 13;

const id1 = "slide-1a0fd993032e";

// const id1Table1 = getPrevTable(id1, "table1");
// const id1Table2 = getPrevTable(id1, "table2");

const id1PrevTable1 = didUtils.getPrevComp({
  slideID: id1,
  compName: "table1",
  compType: "table",
  utils,
  components,
});

const id1PrevTable2 = didUtils.getPrevComp({
  slideID: id1,
  compName: "table2",
  compType: "table",
  utils,
  components,
});

let total = 0;
const result = utils.math.evaluateLatex(id1PrevTable1.getCell(0, 0, true).value);
const result2 = utils.math.evaluateLatex(id1PrevTable1.getCell(0, 2, true).value);
total = result.value - result2.value;

let total2 = 0;
const result3 = utils.math.evaluateLatex(id1PrevTable2.getCell(0, 0, true).value);
const result4 = utils.math.evaluateLatex(id1PrevTable2.getCell(0, 2, true).value);
total2 = result3.value - result4.value;

let total3 = 0;
const result5 = utils.math.evaluateLatex(id1PrevTable2.getCell(1, 0, true).value);
const result6 = utils.math.evaluateLatex(id1PrevTable2.getCell(1, 2, true).value);
total3 = result5.value - result6.value;

// Use to send to RTS?????????
let now = controls.current;
autorun(() => {
  id1PrevTable1.fillCells("table1", 1);
  id1PrevTable2.fillCells("table1", 2);
  const rowEntries = table1.data.rows.map((row) => row.map((cell) => cell.value)).flat();
  const [trash1, trash2, trash3, trash4, trash5, trash6, x1, y1, x2, y2, x3, y3] = rowEntries;
  // const row1Total = x1 + y1;
  // const row2Total = x2 + y2;
  // const row3Total = x3 + y3;
  // let total4 = 0;
  const result = utils.math.evaluateLatex(x1);
  const result2 = utils.math.evaluateLatex(y1);
  // total4 = result.value - result2.value;
  // let total5 = 0;
  const result3 = utils.math.evaluateLatex(x2);
  const result4 = utils.math.evaluateLatex(y2);
  // total5 = result3.value - result4.value;
  // let total6 = 0;
  const result5 = utils.math.evaluateLatex(x3);
  const result6 = utils.math.evaluateLatex(y3);
  // total6 = result5.value - result6.value;
  // round all values to 13 decimal places to avoid junk decimals
  const [row1Total, row2Total, row3Total, total4, total5, total6] = [
    x1 + y1,
    x2 + y2,
    x3 + y3,
    result.value - result2.value,
    result3.value - result4.value,
    result5.value - result6.value,
  ].map((val) => didUtils.round(val, safeRoundingPlace));
  if (controls.current == now + 1) {
    utils.RTS.sendData("slide-8e74cc3defa1", {
      x1,
      y1,
      x2,
      y2,
      x3,
      y3,
      row1Total,
      row2Total,
      row3Total,
      g: x1,
      h: y1,
      i: x2,
      j: y2,
      k: x3,
      l: y3,
      total4,
      total5,
      total6,
    });
  }
});

let num = id1PrevTable1.getCell(0, 3, true).value; // ineq 1
let num2 = id1PrevTable2.getCell(0, 3, true).value; // ineq 2
let num3 = id1PrevTable2.getCell(1, 3, true).value; // ineq 3

// from id1PrevTable1
const tempVal1 = didUtils.getText(id1PrevTable1.data.rows[0][0]);
const tempVal2 = didUtils.getText(id1PrevTable1.data.rows[0][2]);
// from id1PrevTable2
const tempVal3 = didUtils.getText(id1PrevTable2.data.rows[0][0]);
const tempVal4 = didUtils.getText(id1PrevTable2.data.rows[0][2]);
const tempVal5 = didUtils.getText(id1PrevTable2.data.rows[1][0]);
const tempVal6 = didUtils.getText(id1PrevTable2.data.rows[1][2]);

table1.updateCell(1, 0, {
  value: tempVal1,
});
table1.updateCell(1, 2, {
  value: tempVal2,
});
table1.updateCell(1, 3, {
  value: num,
});
table1.updateCell(2, 0, {
  value: tempVal3,
});
table1.updateCell(2, 2, {
  value: tempVal4,
});
table1.updateCell(2, 3, {
  value: num2,
});
table1.updateCell(3, 0, {
  value: tempVal5,
});
table1.updateCell(3, 2, {
  value: tempVal6,
});
table1.updateCell(3, 3, {
  value: num3,
});

table1.updateCell(1, 0, {
  value: tempVal1 === "" ? id1PrevTable1.data.goBackStringKatex : tempVal1,
});
table1.updateCell(1, 2, {
  value: tempVal2 === "" ? id1PrevTable1.data.goBackStringKatex : tempVal2,
});
table1.updateCell(1, 3, {
  value: num === "" ? "" : num,
});
table1.updateCell(2, 0, {
  value: tempVal3 === "" ? id1PrevTable2.data.goBackStringKatex : tempVal3,
});
table1.updateCell(2, 2, {
  value: tempVal4 === "" ? id1PrevTable2.data.goBackStringKatex : tempVal4,
});
table1.updateCell(2, 3, {
  value: num2 === "" ? "" : num2,
});
table1.updateCell(3, 0, {
  value: tempVal5 === "" ? id1PrevTable2.data.goBackStringKatex : tempVal5,
});
table1.updateCell(3, 2, {
  value: tempVal6 === "" ? id1PrevTable2.data.goBackStringKatex : tempVal6,
});
table1.updateCell(3, 3, {
  value: num3 === "" ? "" : num3,
});

//////////////////BEGIN FROM PARENT LESSON - 3 text boxes //////////////////
/* if (!id1PrevTable1.data.isComplete) {
  num = id1PrevTable1.data.goBackStringKatex;
  // text2.updateData({ text: num });

  ////////////////////////// LIBRARY //////////////////////////////
  // table1.updateCell(0, 0, {
  //   value: didUtils.getText(id1PrevTable1.data.rows[0][0]),
  // });

  ///////////////////////// OR //////////////////////////////

  // const tempVal = didUtils.getText(id1PrevTable1.data.rows[0][0]);
  // table1.updateCell(0, 0, {
  //   value: tempVal === "" ? id1PrevTable1.data.goBackStringKatex : tempVal,
  // });

  //////////////////////////////////////////////////////////
} else if (total < 6 && id1PrevTable1.data.isComplete) {
  num = id1PrevTable1.getCell(0, 3, true).value;
  // text2.updateData({ text: `$${num}$` });
} else if (total > 6) {
  // text2.updateData({ text: "" });
}

if (num2 === "" || id1PrevTable2.getCell(0, 3, true).value === "") {
  num2 = id1PrevTable2.data.goBackStringKatex;
  // text3.updateData({ text: num2 });
} else if (total2 < 6 && id1PrevTable2.getCell(0, 3, true).value != "") {
  num2 = id1PrevTable2.getCell(0, 3, true).value;
  // text3.updateData({ text: `$${num2}$` });
} else if (total2 > 6) {
  // text3.updateData({ text: "" });
}

if (!num3 || id1PrevTable2.getCell(1, 3, true).value == "") {
  num3 = id1PrevTable2.data.goBackStringKatex;
  // text4.updateData({ text: num3 });
} else if (total3 < 6 && id1PrevTable2.getCell(1, 3, true).value != "") {
  num3 = id1PrevTable2.getCell(1, 3, true).value;
  // text4.updateData({ text: `$${num3}$` });
} else if (total3 > 6) {
  // text4.updateData({ text: "" });
} */

//
//
//////////////////////////////// END ///////////////////////////////////////////
//
//

// if (total > 6 && id1PrevTable2.getCell(0, 3, true).value != "" && id1PrevTable2.getCell(1, 3, true).value != "") {
//   text2.updateData({
//     text: "\\text\\color{707070}{You have not yet chosen a pair of numbers with a difference that is less than $6$.}",
//   });
// }

// library

// function getPrevTable(slideID, compName = "table1", inpRows = 0, inpColumns = 0) {
//   // find slide num of source
//   const slideNum = ((slideId) => {
//     if (typeof controls == "undefined" || !controls.slidesNavigationData?.length) {
//       return "missing slide!";
//     }
//     let allIds = controls.slidesNavigationData.map(({ slideId }) => slideId);
//     return allIds.indexOf(slideId) + 1;
//   })(slideID);
//   // establish default in same data structure as original
//   let defTable = {
//     data: { columns: [], rows: [] },
//   };
//   const prelimTable = getFromSlide(slideID, compName, defTable) || defTable;
//   const numRows = prelimTable.data?.rows?.length ? prelimTable.data.rows.length : inpRows;
//   const numColumns = prelimTable.data?.rows?.[0]?.length ? prelimTable.data.rows[0].length : inpColumns;
//   for (let i = 0; i < numRows; i++) {
//     let newRow = [];
//     for (let j = 0; j < numColumns; j++) {
//       newRow.push({ value: "" });
//     }
//     defTable.data.rows.push([...newRow]);
//   }
//   // get previous data
//   let prevTable = getFromSlide(slideID, compName, defTable) || defTable;
//   // check previous data, fill in useful data
//   prevTable.data.hasData =
//     // uncomment following line for original tables where students edit headers:
//     //prevTable.data.columns.some(({ value }) => value) ||
//     prevTable.data.rows.some((row) =>
//       row.some(({ value, mixedText }) => (getMixed(mixedText) ? getMixed(mixedText) : value))
//     );
//   prevTable.data.isComplete =
//     // uncomment following line for original tables where students edit headers:
//     //prevTable.data.columns.every(({ value }) => value) &&
//     prevTable.data.rows.every((row) =>
//       row.every(({ value, mixedText }) => (getMixed(mixedText) ? getMixed(mixedText) : value))
//     );
//   prevTable.data.goBackString = `$\\color{A0A0A0}\\text{\[no input yet on slide ${slideNum}\]}$`;
//   prevTable.data.slideNum = slideNum;
//   prevTable.data.flagText = prevTable.data.isComplete ? "" : prevTable.data.goBackString;
//   // add some useful methods
//   prevTable.getCell = function (row, col, leaveBlanks = false) {
//     const emptyVal = leaveBlanks ? "" : this.data.goBackString;
//     let value = this.data?.rows?.[row]?.[col]?.value ? this.data.rows[row][col].value : emptyVal;
//     let mixedText = this.data?.rows?.[row]?.[col]?.mixedText
//       ? [...this.data.rows[row][col].mixedText]
//       : [{ children: [{ text: emptyVal }] }];
//     return { ...this.data.rows[row][col], value, mixedText };
//   };
//   prevTable.fillCells = function (tableName, rowStart = 0, colStart = 0, leaveBlanks = false, cellUpdates = {}) {
//     const emptyVal = leaveBlanks ? "" : this.data.goBackString;
//     for (let i = 0, L = numColumns; i < L; i++) {
//       for (let j = 0, K = numRows; j < K; j++) {
//         if (this.getCell(j, i).merged) {
//           continue;
//         }
//         let cellVal = this.getCell(j, i, true).value ? this.getCell(j, i, true).value : emptyVal;
//         const rawMixed = this.getCell(j, i, true).mixedText;
//         const cellMixed = getMixed(rawMixed) ? getMixed(rawMixed) : emptyVal;
//         const fillVal = this.getCell(j, i, true).inputType === "mixed" ? cellMixed : cellVal;
//         components[tableName].updateCell(j + rowStart, i + colStart, {
//           ...cellUpdates,
//           value: fillVal,
//         });
//       }
//     }
//   };
//   return { ...prevTable };
// }

// function getMixed(mixedText) {
//   return mixedText[0]?.children
//     .map((child) => {
//       if (child.text) {
//         return child.text;
//       } else if (child.latex) {
//         return `$${child.latex}$`;
//       } else {
//         return "";
//       }
//     })
//     .filter((val) => !!val)
//     .join("");
// }

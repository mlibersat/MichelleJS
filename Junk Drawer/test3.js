const {
  ggb1,
  text1,
  text2,
  table1,
  cc_sharewithclass_cdfa55774547_textbox1: shareText1,
  cc_sharewithclass_cdfa55774547_input1: shareInput1,
  cc_sharewithclass_cdfa55774547_button1: shareButton1,
} = components;

// const readOrder = [text1, text2, table1, ggb1, shareText1, shareInput1, shareButton1];

const safeRoundingPlace = 13;

didUtils.onInit(() => {
  didUtils.disappear(shareText1, shareInput1, shareButton1);
  ggb1.instance.evalCommand("ZoomIn(-11, -11, 11, 13.39)");
}, ggb1);

const id1 = "slide-1a0fd993032e";
const id2 = "slide-8e74cc3defa1";

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

const id2PrevTable1 = didUtils.getPrevComp({
  slideID: id2,
  compName: "table1",
  compType: "table",
  utils,
  components,
});

console.log(id1PrevTable1, id1PrevTable2, id2PrevTable1);

let num = id1PrevTable1.getCellKatex(0, 0, false).value;
let num2 = id1PrevTable1.getCellKatex(0, 2, false).value;

let num3 = id1PrevTable2.getCellKatex(0, 0, false).value;
let num4 = id1PrevTable2.getCellKatex(0, 2, false).value;
let num5 = id1PrevTable2.getCellKatex(1, 0, false).value;
let num6 = id1PrevTable2.getCellKatex(1, 2, false).value;

let num7 = id2PrevTable1.getCellKatex(3, 0, false).value;
let num8 = id2PrevTable1.getCellKatex(3, 1, false).value;
let num9 = id2PrevTable1.getCellKatex(4, 0, false).value;
let num10 = id2PrevTable1.getCellKatex(4, 1, false).value;
let num11 = id2PrevTable1.getCellKatex(5, 0, false).value;
let num12 = id2PrevTable1.getCellKatex(5, 1, false).value;

console.log("nums", num, num2, num3, num4, num5, num6, num7, num8, num9, num10, num11, num12);

// round totals to 13 decimal places to avoid junk decimals
let total = 0;
const result = utils.math.evaluateLatex(num);
const result2 = utils.math.evaluateLatex(num2);
total = didUtils.round(result.value - result2.value, safeRoundingPlace);

let total2 = 0;
const result3 = utils.math.evaluateLatex(num3);
const result4 = utils.math.evaluateLatex(num4);
total2 = didUtils.round(result3.value - result4.value, safeRoundingPlace);

let total3 = 0;
const result5 = utils.math.evaluateLatex(num5);
const result6 = utils.math.evaluateLatex(num6);
total3 = didUtils.round(result5.value - result6.value, safeRoundingPlace);

let total4 = 0;
const result7 = utils.math.evaluateLatex(num7);
const result8 = utils.math.evaluateLatex(num8);
total4 = didUtils.round(result7.value - result8.value, safeRoundingPlace);

let total5 = 0;
const result9 = utils.math.evaluateLatex(num9);
const result10 = utils.math.evaluateLatex(num10);
total5 = didUtils.round(result9.value - result10.value, safeRoundingPlace);

let total6 = 0;
const result11 = utils.math.evaluateLatex(num11);
const result12 = utils.math.evaluateLatex(num12);
total6 = didUtils.round(result11.value - result12.value, safeRoundingPlace);

console.log("totals:", total, total2, total3, total4, total5, total6);

if (!id1PrevTable1.data.isComplete || num == "") {
  num = id1PrevTable1.data.goBackStringKatex;
  num2 = id1PrevTable1.data.goBackStringKatex;
  table1.updateCell(0, 0, { value: `${num}` });
  table1.updateCell(0, 1, { value: `${num2}` });
  table1.updateCell(0, 2, { value: `` });
  ggb1.instance.setValue("showD", false);
}

if (total == 6) {
  ggb1.instance.evalCommand("D=(" + num + "," + num2 + ")");
  ggb1.instance.setValue("showD", true);
  table1.updateCell(0, 0, { value: `${num}` });
  table1.updateCell(0, 1, { value: `${num2}` });
  table1.updateCell(0, 2, { value: `(${num}, ${num2})` });
}

if (total != 6 && num != "" && id1PrevTable1.data.isComplete) {
  table1.updateCell(0, 0, { value: `` });
  table1.updateCell(0, 1, { value: `` });
  table1.updateCell(0, 2, { value: `` });

  ggb1.instance.setValue("showD", false);
}

if (!id1PrevTable2.data.isComplete || num3 == "") {
  // if (!id1PrevTable2.data.hasData || num3 == "") {
  num3 = id1PrevTable2.data.goBackStringKatex;
  num4 = id1PrevTable2.data.goBackStringKatex;
  ggb1.instance.setValue("showE", false);
  table1.updateCell(1, 0, { value: `${num3}` });
  table1.updateCell(1, 1, { value: `${num4}` });
  table1.updateCell(1, 2, { value: `` });
}

if (total2 == 6) {
  ggb1.instance.evalCommand("E=(" + num3 + "," + num4 + ")");
  ggb1.instance.setValue("showE", true);
  table1.updateCell(1, 0, { value: `${num3}` });
  table1.updateCell(1, 1, { value: `${num4}` });
  table1.updateCell(1, 2, { value: `(${num3}, ${num4})` });
}

if (total2 != 6 && num3 != "" && id1PrevTable2.data.isComplete) {
  ggb1.instance.setValue("showE", false);
  table1.updateCell(1, 0, { value: `` });
  table1.updateCell(1, 1, { value: `` });
  table1.updateCell(1, 2, { value: `` });
}

if (!id1PrevTable2.data.isComplete || num5 == "") {
  // if (!id1PrevTable2.data.hasData || num5 == "") {
  num5 = id1PrevTable2.data.goBackStringKatex;
  num6 = id1PrevTable2.data.goBackStringKatex;
  ggb1.instance.setValue("showF", false);
  table1.updateCell(2, 0, { value: `${num5}` });
  table1.updateCell(2, 1, { value: `${num6}` });
  table1.updateCell(2, 2, { value: `` });
}

if (total3 == 6) {
  ggb1.instance.evalCommand("F=(" + num5 + "," + num6 + ")");
  ggb1.instance.setValue("showF", true);
  table1.updateCell(2, 0, { value: `${num5}` });
  table1.updateCell(2, 1, { value: `${num6}` });
  table1.updateCell(2, 2, { value: `(${num5}, ${num6})` });
}

if (total3 != 6 && num5 != "" && id1PrevTable2.data.isComplete) {
  ggb1.instance.setValue("showF", false);
  table1.updateCell(2, 0, { value: `` });
  table1.updateCell(2, 1, { value: `` });
  table1.updateCell(2, 2, { value: `` });
}

if (!id2PrevTable1.data.isComplete || num7 == "") {
  num7 = id2PrevTable1.data.goBackStringKatex;
  num8 = id2PrevTable1.data.goBackStringKatex;
  ggb1.instance.setValue("showG", false);
  table1.updateCell(3, 0, { value: `${num7}` });
  table1.updateCell(3, 1, { value: `${num8}` });
  table1.updateCell(3, 2, { value: `` });
}

if (total4 == 6) {
  ggb1.instance.evalCommand("G=(" + num7 + "," + num8 + ")");
  ggb1.instance.setValue("showG", true);
  table1.updateCell(3, 0, { value: `${num7}` });
  table1.updateCell(3, 1, { value: `${num8}` });
  table1.updateCell(3, 2, { value: `(${num7}, ${num8})` });
}

if (total4 != 6 && num7 != "" && id2PrevTable1.data.isComplete) {
  ggb1.instance.setValue("showG", false);
  table1.updateCell(3, 0, { value: `` });
  table1.updateCell(3, 1, { value: `` });
  table1.updateCell(3, 2, { value: `` });
}

if (!id2PrevTable1.data.isComplete || num9 == "") {
  num9 = id2PrevTable1.data.goBackStringKatex;
  num10 = id2PrevTable1.data.goBackStringKatex;
  ggb1.instance.setValue("showH", false);
  table1.updateCell(4, 0, { value: `${num9}` });
  table1.updateCell(4, 1, { value: `${num10}` });
  table1.updateCell(4, 2, { value: `` });
}

if (total5 == 6) {
  ggb1.instance.evalCommand("H=(" + num9 + "," + num10 + ")");
  ggb1.instance.setValue("showH", true);
  table1.updateCell(4, 0, { value: `${num9}` });
  table1.updateCell(4, 1, { value: `${num10}` });
  table1.updateCell(4, 2, { value: `(${num9}, ${num10})` });
}

if (total5 != 6 && num9 != "" && id2PrevTable1.data.isComplete) {
  ggb1.instance.setValue("showH", false);
  table1.updateCell(4, 0, { value: `` });
  table1.updateCell(4, 1, { value: `` });
  table1.updateCell(4, 2, { value: `` });
}

if (!id2PrevTable1.data.isComplete || num11 == "") {
  num11 = id2PrevTable1.data.goBackStringKatex;
  num12 = id2PrevTable1.data.goBackStringKatex;
  ggb1.instance.setValue("showI", false);
  table1.updateCell(5, 0, { value: `${num11}` });
  table1.updateCell(5, 1, { value: `${num12}` });
  table1.updateCell(5, 2, { value: `` });
}

if (total6 == 6) {
  ggb1.instance.evalCommand("I=(" + num11 + "," + num12 + ")");
  ggb1.instance.setValue("showI", true);
  table1.updateCell(5, 0, { value: `${num11}` });
  table1.updateCell(5, 1, { value: `${num12}` });
  table1.updateCell(5, 2, { value: `(${num11}, ${num12})` });
}

if (total6 != 6 && num11 != "" && id2PrevTable1.data.isComplete) {
  ggb1.instance.setValue("showI", false);
  table1.updateCell(5, 0, { value: `` });
  table1.updateCell(5, 1, { value: `` });
  table1.updateCell(5, 2, { value: `` });
}

ggb1.instance.registerObjectUpdateListener("enablePrompt", update);

function update() {
  if (ggb1.instance.getValue("enablePrompt")) {
    didUtils.show(shareText1, shareInput1, shareButton1);
  }
}

///////////////////////
/* 

utils.RTS.on("datachange", "slide-102b2e9edb49", (register) => {
  if (!register || !register.length) {
    return;
  }

  const lastRegister = discardOldResponses(register).reverse();

  let numX = [];
  let numY = [];

  lastRegister.forEach(({ data, info }) => {
    const { param1, param2 } = data;
    numX.push(param1);
    numY.push(param2);
    for (let j = 0, L = numX.length; j < L; j++) {
      let matches = 0;
      for (let i = 0, M = table1.data.rows.length; i < M; i++) {
        let xCheck = table1.getCell(i, 0).value;
        if (xCheck == numX[j]) {
          matches++;
        }
      }
      if (matches == 0) {
        let newRow = createTableRowsData([[`${numX[j]}`, `${numY[j]}`]]);
        let allRows = [...table1.data.rows, ...newRow];
        table1.updateData({ rows: allRows });
      }
    }
  });
});
 */

/*
{"compTotals":{"geogebra":1,"textbox":3,"table":1,"sharewithclass":1},"stage":"Launch","lessonInfo":"9 M2 TA L01 - Solution Sets of Linear Equations in Two Variables","teacherView":false,"layout":"two col"}
*/

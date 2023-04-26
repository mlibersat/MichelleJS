// From Dane --- Example #2 adding rows
const { text1, table1, button1, errorText1, errorText2 } = components;

// const readOrder = [text1, table1, button1, errorText1, errorText2];

const safeRoundingPlace = 13;

slide.on("firstload", () => {
  button1.updateData({ align: "right" });
  didUtils.hide(errorText1, errorText2);
});

autorun(() => {
  let entries = [
    table1.getCell(0, 0).value,
    table1.getCell(1, 0).value,
    table1.getCell(2, 0).value,
    table1.getCell(0, 1).value,
    table1.getCell(1, 1).value,
    table1.getCell(2, 1).value,
  ];
  if (!arrayEquals(entries, table1.data.last)) {
    button1.updateData({
      text: "Submit",
      disabled: !entries.every((value) => !!value),
    });
    table1.updateData({ last: [...entries] });
  }
});

button1.on("click", () => {
  button1.updateData({ text: "Submitted", disabled: true });
  let correctAnswer1 = false;
  let correctAnswer2 = false;
  let correctAnswer3 = false;
  let integer1 = false;
  let integer2 = false;
  let integer3 = false;
  let num = table1.getCell(0, 0).value;
  let num2 = table1.getCell(1, 0).value;
  let num3 = table1.getCell(2, 0).value;
  let num4 = table1.getCell(0, 1).value;
  let num5 = table1.getCell(1, 1).value;
  let num6 = table1.getCell(2, 1).value;
  table1.updateCell(0, 2, { value: `(${num},${num4})` });
  table1.updateCell(1, 2, { value: `(${num2},${num5})` });
  table1.updateCell(2, 2, { value: `(${num3},${num6})` });
  let total = 0;
  const result = utils.math.evaluateLatex(table1.getCell(0, 0).value);
  const result2 = utils.math.evaluateLatex(table1.getCell(0, 1).value);
  total = didUtils.round(result.value - result2.value, safeRoundingPlace);
  if (total > 5.999999999999998 && total < 6.000000000000002) {
    table1.updateCell(0, 2, { className: "" });
    correctAnswer1 = true;
    integer1 = true;
    if (Number.isInteger(result.value) || Number.isInteger(result2.value)) {
      table1.updateCell(0, 2, { className: "bg-danger text-white" });
      didUtils.show(errorText2);
      integer1 = false;
    }
  } else {
    table1.updateCell(0, 2, { className: "bg-danger text-white" });
    didUtils.show(errorText1);
    correctAnswer1 = false;
  }
  let total2 = 0;
  const result3 = utils.math.evaluateLatex(table1.getCell(1, 0).value);
  const result4 = utils.math.evaluateLatex(table1.getCell(1, 1).value);
  total2 = didUtils.round(result3.value - result4.value, safeRoundingPlace);
  if (total2 == 6) {
    table1.updateCell(1, 2, { className: "" });
    correctAnswer2 = true;
    integer2 = true;
    if (parseInt(num2) == parseFloat(num2) || parseInt(num5) == parseFloat(num5)) {
      table1.updateCell(1, 2, { className: "bg-danger text-white" });
      didUtils.show(errorText2);
      integer2 = false;
    }
  } else {
    table1.updateCell(1, 2, { className: "bg-danger text-white" });
    didUtils.show(errorText1);
    correctAnswer2 = false;
  }
  let total3 = 0;
  const result5 = utils.math.evaluateLatex(table1.getCell(2, 0).value);
  const result6 = utils.math.evaluateLatex(table1.getCell(2, 1).value);
  total3 = didUtils.round(result5.value - result6.value, safeRoundingPlace);
  if (total3 == 6) {
    table1.updateCell(2, 2, { className: "" });
    correctAnswer3 = true;
    integer3 = true;
    if (parseInt(num3) == parseFloat(num3) || parseInt(num6) == parseFloat(num6)) {
      table1.updateCell(2, 2, { className: "bg-danger text-white" });
      didUtils.show(errorText2);
      integer3 = false;
    }
  } else {
    table1.updateCell(2, 2, { className: "bg-danger text-white" });
    didUtils.show(errorText1);
    correctAnswer3 = false;
  }
  if (correctAnswer1 && correctAnswer2 && correctAnswer3) {
    didUtils.hide(errorText1);
  }
  if (integer1 && integer2 && integer3) {
    didUtils.hide(errorText2);
  }
});

function arrayEquals(a, b) {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((val, index) => val === b[index]);
}

let row1Total;
let row2Total;
let row3Total;
let x1;
let y1;
let x2;
let y2;
let x3;
let y3;
autorun(() => {
  x1 = parseInt(table1.getCell(0, 0).value.replaceAll("$", ""));
  y1 = parseInt(table1.getCell(0, 1).value.replaceAll("$", ""));
  x2 = parseInt(table1.getCell(1, 0).value.replaceAll("$", ""));
  y2 = parseInt(table1.getCell(1, 1).value.replaceAll("$", ""));
  x3 = parseInt(table1.getCell(2, 0).value.replaceAll("$", ""));
  y3 = parseInt(table1.getCell(2, 1).value.replaceAll("$", ""));
  row1Total = x1 + y1;
  row2Total = x2 + y2;
  row3Total = x3 + y3;
});

let now = controls.current;
autorun(() => {
  let total4 = 0;
  const result = utils.math.evaluateLatex(table1.getCell(0, 0).value);
  const result2 = utils.math.evaluateLatex(table1.getCell(0, 1).value);
  total4 = didUtils.round(result.value - result2.value, safeRoundingPlace);
  let total5 = 0;
  const result3 = utils.math.evaluateLatex(table1.getCell(1, 0).value);
  const result4 = utils.math.evaluateLatex(table1.getCell(1, 1).value);
  total5 = didUtils.round(result3.value - result4.value, safeRoundingPlace);
  let total6 = 0;
  const result5 = utils.math.evaluateLatex(table1.getCell(2, 0).value);
  const result6 = utils.math.evaluateLatex(table1.getCell(2, 1).value);
  total6 = didUtils.round(result5.value - result6.value, safeRoundingPlace);
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
      g: table1.getCell(0, 0).value,
      h: table1.getCell(0, 1).value,
      i: table1.getCell(1, 0).value,
      j: table1.getCell(1, 1).value,
      k: table1.getCell(2, 0).value,
      l: table1.getCell(2, 1).value,
      total4,
      total5,
      total6,
    });
  }
});

/*
{"compTotals":{"textbox":2,"table":1,"button":1},"stage":"Launch","lessonInfo":"9 M2 TA L01 - Solution Sets of Linear Equations in Two Variables","teacherView":false,"layout":"one col"}
*/

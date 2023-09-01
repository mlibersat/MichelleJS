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

slide.on("firstload", () => {
  didUtils.disappear(shareText1, shareInput1, shareButton1);
});

const id1 = "slide-1a0fd993032e";
const id2 = "slide-8e74cc3defa1";

const id1PrevTable1 = didUtils.getPrevComp({
  slideID: id1,
  compName: "table1",
  compType: "complextable",
  utils,
  components,
});

const id1PrevTable2 = didUtils.getPrevComp({
  slideID: id1,
  compName: "table2",
  compType: "complextable",
  utils,
  components,
});

const id2PrevTable1 = didUtils.getPrevComp({
  slideID: id2,
  compName: "table1",
  compType: "complextable",
  utils,
  components,
});

let num = utils.math.evaluateLatex(id1PrevTable1.data.rows[1][0].value).value;
let num2 = utils.math.evaluateLatex(id1PrevTable1.data.rows[1][2].value).value;

let num3 = id1PrevTable2.data.rows[1][0].value;
let num4 = id1PrevTable2.data.rows[1][2].value;
let num5 = id1PrevTable2.data.rows[2][0].value;
let num6 = id1PrevTable2.data.rows[2][2].value;

let num7 = id2PrevTable1.data.rows[1][0].value;
let num8 = id2PrevTable1.data.rows[1][1].value;
let num9 = id2PrevTable1.data.rows[2][0].value;
let num10 = id2PrevTable1.data.rows[2][1].value;
let num11 = id2PrevTable1.data.rows[3][0].value;
let num12 = id2PrevTable1.data.rows[3][1].value;

let total = 0;
const result = utils.math.evaluateLatex(id1PrevTable1.data.rows[1][0].value);
const result2 = utils.math.evaluateLatex(id1PrevTable1.data.rows[1][2].value);
total = result.value - result2.value;

let total2 = 0;
const result3 = utils.math.evaluateLatex(id1PrevTable2.data.rows[1][0].value);
const result4 = utils.math.evaluateLatex(id1PrevTable2.data.rows[1][2].value);
total2 = result3.value - result4.value;

let total3 = 0;
const result5 = utils.math.evaluateLatex(id1PrevTable2.data.rows[2][0].value);
const result6 = utils.math.evaluateLatex(id1PrevTable2.data.rows[2][2].value);
total3 = result5.value - result6.value;

let total4 = 0;
const result7 = utils.math.evaluateLatex(id2PrevTable1.data.rows[1][0].value);
const result8 = utils.math.evaluateLatex(id2PrevTable1.data.rows[1][1].value);
total4 = result7.value - result8.value;

let total5 = 0;
const result9 = utils.math.evaluateLatex(id2PrevTable1.data.rows[2][0].value);
const result10 = utils.math.evaluateLatex(id2PrevTable1.data.rows[2][1].value);
total5 = result9.value - result10.value;

let total6 = 0;
const result11 = utils.math.evaluateLatex(id2PrevTable1.data.rows[3][0].value);
const result12 = utils.math.evaluateLatex(id2PrevTable1.data.rows[3][1].value);
total6 = result11.value - result12.value;

if (!num || id1PrevTable1.data.rows[1][0].value == "") {
  num = id1PrevTable1.data.goBackStringKatex;
  num2 = id1PrevTable1.data.goBackStringKatex;
  table1.updateCell(1, 0, { value: num });
  table1.updateCell(1, 1, { value: num2 });
  ggb1.instance.setValue("showD", false);
} else if (total < 6 && id1PrevTable1.data.rows[1][0].value != "") {
  num = utils.math.evaluateLatex(id1PrevTable1.data.rows[1][0].value).value;
  num2 = utils.math.evaluateLatex(id1PrevTable1.data.rows[1][2].value).value;
  ggb1.instance.evalCommand("D=(" + num + "," + num2 + ")");
  ggb1.instance.setValue("showD", true);
  table1.updateCell(1, 0, {
    value: `${id1PrevTable1.data.rows[1][0].value}`,
  });
  table1.updateCell(1, 1, {
    value: `${id1PrevTable1.data.rows[1][2].value}`,
  });
} else if (total >= 6) {
  table1.updateCell(1, 0, { value: "" });
  table1.updateCell(1, 1, { value: "" });
  ggb1.instance.setValue("showD", false);
}

if (!num3 || id1PrevTable2.data.rows[1][0].value == "") {
  num3 = id1PrevTable2.data.goBackStringKatex;
  num4 = id1PrevTable2.data.goBackStringKatex;
  ggb1.instance.setValue("showE", false);
  table1.updateCell(2, 0, { value: num3 });
  table1.updateCell(2, 1, { value: num4 });
} else if (total2 < 6 && id1PrevTable2.data.rows[1][0].value != "") {
  num3 = utils.math.evaluateLatex(id1PrevTable2.data.rows[1][0].value).value;
  num4 = utils.math.evaluateLatex(id1PrevTable2.data.rows[1][2].value).value;
  ggb1.instance.evalCommand("E=(" + num3 + "," + num4 + ")");
  ggb1.instance.setValue("showE", true);
  table1.updateCell(2, 0, {
    value: `${id1PrevTable2.data.rows[1][0].value}`,
  });
  table1.updateCell(2, 1, {
    value: `${id1PrevTable2.data.rows[1][2].value}`,
  });
} else if (total2 >= 6) {
  ggb1.instance.setValue("showE", false);
  table1.updateCell(2, 0, { value: "" });
  table1.updateCell(2, 1, { value: "" });
}

if (!num5 || id1PrevTable2.data.rows[2][0].value == "") {
  num5 = id1PrevTable2.data.goBackStringKatex;
  num6 = id1PrevTable2.data.goBackStringKatex;
  ggb1.instance.setValue("showF", false);
  table1.updateCell(3, 0, { value: num5 });
  table1.updateCell(3, 1, { value: num6 });
} else if (total3 < 6 && id1PrevTable2.data.rows[2][0].value != "") {
  num5 = utils.math.evaluateLatex(id1PrevTable2.data.rows[2][0].value).value;
  num6 = utils.math.evaluateLatex(id1PrevTable2.data.rows[2][2].value).value;
  ggb1.instance.evalCommand("F=(" + num5 + "," + num6 + ")");
  ggb1.instance.setValue("showF", true);
  table1.updateCell(3, 0, {
    value: `${id1PrevTable2.data.rows[2][0].value}`,
  });
  table1.updateCell(3, 1, {
    value: `${id1PrevTable2.data.rows[2][2].value}`,
  });
} else if (total3 >= 6) {
  ggb1.instance.setValue("showF", false);
  table1.updateCell(3, 0, { value: "" });
  table1.updateCell(3, 1, { value: "" });
}

if (!num7 || id2PrevTable1.data.rows[1][0].value == "") {
  num7 = id2PrevTable1.data.goBackStringKatex;
  num8 = id2PrevTable1.data.goBackStringKatex;
  ggb1.instance.setValue("showG", false);
  table1.updateCell(4, 0, { value: num7 });
  table1.updateCell(4, 1, { value: num8 });
} else if (total4 < 6 && id2PrevTable1.data.rows[1][0].value != "") {
  num7 = utils.math.evaluateLatex(id2PrevTable1.data.rows[1][0].value).value;
  num8 = utils.math.evaluateLatex(id2PrevTable1.data.rows[1][1].value).value;
  ggb1.instance.evalCommand("G=(" + num7 + "," + num8 + ")");
  ggb1.instance.setValue("showG", true);
  table1.updateCell(4, 0, {
    value: `${id2PrevTable1.data.rows[1][0].value}`,
  });
  table1.updateCell(4, 1, {
    value: `${id2PrevTable1.data.rows[1][1].value}`,
  });
} else if (total4 >= 6) {
  ggb1.instance.setValue("showG", false);
  table1.updateCell(4, 0, { value: "" });
  table1.updateCell(4, 1, { value: "" });
}

if (!num9 || id2PrevTable1.data.rows[2][0].value == "") {
  num9 = id2PrevTable1.data.goBackStringKatex;
  num10 = id2PrevTable1.data.goBackStringKatex;
  ggb1.instance.setValue("showH", false);
  table1.updateCell(5, 0, { value: `${num9}` });
  table1.updateCell(5, 1, { value: `${num10}` });
} else if (total5 < 6 && id2PrevTable1.data.rows[2][0].value != "") {
  num9 = utils.math.evaluateLatex(id2PrevTable1.data.rows[2][0].value).value;
  num10 = utils.math.evaluateLatex(id2PrevTable1.data.rows[2][1].value).value;
  ggb1.instance.evalCommand("H=(" + num9 + "," + num10 + ")");
  ggb1.instance.setValue("showH", true);
  table1.updateCell(5, 0, {
    value: `${id2PrevTable1.data.rows[2][0].value}`,
  });
  table1.updateCell(5, 1, {
    value: `${id2PrevTable1.data.rows[2][1].value}`,
  });
} else if (total5 >= 6) {
  ggb1.instance.setValue("showH", false);
  table1.updateCell(5, 0, { value: "" });
  table1.updateCell(5, 1, { value: "" });
}

if (!num11 || id2PrevTable1.data.rows[3][0].value == "") {
  num11 = id2PrevTable1.data.goBackStringKatex;
  num12 = id2PrevTable1.data.goBackStringKatex;
  ggb1.instance.setValue("showI", false);
  table1.updateCell(6, 0, { value: num11 });
  table1.updateCell(6, 1, { value: num12 });
} else if (total6 < 6 && id2PrevTable1.data.rows[3][0].value != "") {
  num11 = utils.math.evaluateLatex(id2PrevTable1.data.rows[3][0].value).value;
  num12 = utils.math.evaluateLatex(id2PrevTable1.data.rows[3][1].value).value;
  ggb1.instance.evalCommand("I=(" + num11 + "," + num12 + ")");
  ggb1.instance.setValue("showI", true);
  table1.updateCell(6, 0, {
    value: `${id2PrevTable1.data.rows[3][0].value}`,
  });
  table1.updateCell(6, 1, {
    value: `${id2PrevTable1.data.rows[3][1].value}`,
  });
} else if (total6 >= 6) {
  ggb1.instance.setValue("showI", false);
  table1.updateCell(6, 0, { value: "" });
  table1.updateCell(6, 1, { value: "" });
}

ggb1.instance.registerObjectUpdateListener("enablePrompt", update);

function update() {
  if (ggb1.instance.getValue("enablePrompt")) {
    didUtils.show(shareText1, shareInput1, shareButton1);
  }
}

/*
{"compTotals":{"geogebra":1,"textbox":3,"table":1,"sharewithclass":1},"stage":"Learn","lessonInfo":"9 M2 TA L04 - Solution Sets of Linear Inequalities in Two Variables","teacherView":false,"layout":"two col"}
*/

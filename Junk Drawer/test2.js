const {
  ggb1,
  cc_submit_20598763dc91_richtexteditor1: submitText1,
  cc_submit_20598763dc91_button1: submitButton1,
  cc_sharewithclass_75389c71fac4_richtexteditor1: shareText1,
  cc_sharewithclass_75389c71fac4_input1: shareInput1,
  cc_sharewithclass_75389c71fac4_button1: shareButton1,
} = components;

ggb1.instance.setErrorDialogsActive(false);

didUtils.onInit(() => {
  didUtils.disappear(shareText1, shareInput1, shareButton1);
}, ggb1);

const id1 = `slide-5626df25e585`;

const id1PrevInput1 = didUtils.getPrevComp({
  slideID: id1,
  compName: "rte2",
  compType: "richtexteditor",
  utils,
  components,
});

let equa = id1PrevInput1.data?.inputs[0] ?? "";
if (!id1PrevInput1.data || equa.includes("no input yet")) {
  equa = id1PrevInput1.data.goBackString;
  submitText1.updateData({
  text: `<p>${equa}</p><p>What are all zeros of $R$?</p>`,
});
} else {
  const inputPlain = didUtils.undoLaTeX(equa);
  const expression = inputPlain.replace(/R\(x\)=/, "");
  ggb1.instance.setErrorDialogsActive(false);
  const newFunc = ggb1.instance.evalCommandGetLabels(expression);
  ggb1.instance.setVisible(newFunc, false);
  if (newFunc) {
    ggb1.instance.evalLaTeX(`g: ${expression}`);
    ggb1.instance.setFixed("g", false, false);
    ggb1.instance.setVisible("g", true);
    ggb1.instance.setVisible("LeftXInt", true);
    ggb1.instance.setVisible("RightXInt", true);
    ggb1.instance.setValue("showIntercepts", true);
    ggb1.instance.setValue("showGraph", true);
  }
  ggb1.instance.deleteObject(newFunc);
  submitText1.updateData({
  text: `<p>$${equa}$</p><p>What are all zeros of $R$?</p>`,
});
}


submitButton1.on("click", () => {
  didUtils.show(shareText1, shareInput1, shareButton1);
});

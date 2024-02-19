const {
  image1,
  cc_submit_34dbca62b9da_textbox1: submitText1,
  cc_submit_34dbca62b9da_input1: submitInput1,
  cc_submit_34dbca62b9da_button1: submitButton1,
  separator1,
  cc_sharewithclass_f4a62547cd19_textbox1: shareText1,
  cc_sharewithclass_f4a62547cd19_input1: shareInput1,
  cc_sharewithclass_f4a62547cd19_button1: shareButton1,
} = components;
const readOrder = [submitText1, image1, submitInput1, submitButton1, separator1, shareText1, shareInput1, shareButton1];
didUtils.onInit(() => {
  didUtils.disappear(shareText1, shareInput1, shareButton1);
});
const id1 = "slide-352909c8c370";
const id1PrevGGB1 = didUtils.getPrevComp({
  slideID: id1,
  compName: "ggb1",
  compType: "ggb",
  utils,
  components,
  ggbInnerDataDefault: { coinCount: 0 },
});
let coins;
if (id1PrevGGB1.data.hasData) {
  coins = id1PrevGGB1.innerData.coinCount;
} else {
  coins = id1PrevGGB1.data.goBackStringKatex;
}
if (coins === 1) {
  submitText1.updateData({
    text: `Clasificaste $${coins}$ moneda en $10$ segundos. ¿Cuántas crees que podrías clasificar en $30$ segundos?`,
  });
} else {
  submitText1.updateData({
    text: `Clasificaste $${coins}$ monedas en $10$ segundos.  ¿Cuántas crees que podrías clasificar en $30$ segundos?`,
  });
}
submitButton1.on("click", () => {
  didUtils.show(shareText1, shareInput1, shareButton1);
});

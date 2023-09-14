const { ggb1, text1: rte1 } = components;

ggb1.instance.registerObjectUpdateListener("text2", updateRight);

function updateRight() {
  const slopeString = `<p>$${ggb1.instance.getValueString("text1")}$ \n\n $${ggb1.instance
    .getValueString("text2")
    .replaceAll(" ", "")}$</p>`;

  rte1.updateData({ text: slopeString });
}

const { ggb1, text1 } = components;

ggb1.instance.registerObjectUpdateListener("text2", updateRight);

function updateRight() {
  const slopeString = `$${ggb1.instance.getValueString("text1")}$ \n\n $${ggb1.instance
    .getValueString("text2")
    .replaceAll(" ", "")}$`;
  text1.updateData({ text: slopeString });
}

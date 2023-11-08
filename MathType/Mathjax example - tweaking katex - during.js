const { ggb1, rte1 } = components;

ggb1.instance.registerObjectUpdateListener("text2", updateRight);

function updateRight() {
  const slopeString = `<p style="text-align: center; color: #007faf">$${ggb1.instance.getValueString(
    "text1"
  )}$ </p> <p style="text-align: center;">$${ggb1.instance.getValueString("text2").replaceAll(" ", "")}$</p>`;
  rte1.updateData({ text: slopeString });
}

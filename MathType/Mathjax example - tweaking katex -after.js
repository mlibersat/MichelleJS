const { ggb1, rte1 } = components;
const readOrder = [ggb1, rte1];

ggb1.instance.registerObjectUpdateListener("text2", updateRight);

function updateRight() {
  // Centered
  const slopeString = `<p style="text-align: center;">$${ggb1.instance.getValueString("text1")}$ </p>
  <p style="text-align: center;"> $${ggb1.instance.getValueString("text2").replaceAll(" ", "")}$</p>`;

  // Not Centered
  // const slopeString = `<p>$${ggb1.instance.getValueString("text1")}$
  //    \n\n $${ggb1.instance.getValueString("text2").replaceAll(" ", "")}$</p>`;
  rte1.updateData({ text: slopeString });
}

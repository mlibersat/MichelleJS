const { text1, richTextEditor1, button1 } = components;

const newX = 50;
const newY = 100;

button1.on("click", () => {
  button1.updateData({ text: "Done", disabled: true });

  text1.updateData({
    text: `Text component:\n\nThe ordered pair after the button click is $(${newX},${newY})$.`,
    visible: true,
  });
  richTextEditor1.updateData({
    text: `<p>RTE component:</p>

    <p>The ordered pair after the button click&nbsp;is <math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>(</mo><mrow><mn>${newX}</mn><mo separator="true">,</mo><mn>${newY}</mn></mrow><mo>)</mo></mrow></math>.</p>
    `,
    visible: true,
  });
});

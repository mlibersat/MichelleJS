const { richTextEditor1, button1 } = components;

const newX = 50;
const newY = 100;

button1.on("click", () => {
  button1.updateData({ text: "Done", disabled: true });

  richTextEditor1.updateData({
    text: `<p>Text component:</p>

    <p>The ordered pair after the button click is <math xmlns="http://www.w3.org/1998/Math/MathML"><mrow><mo>(</mo><mrow><mn>${newX}</mn><mo separator="true">,</mo><mn>${newY}</mn></mrow><mo>)</mo></mrow></math>.</p>`,
    visible: true,
  });
});

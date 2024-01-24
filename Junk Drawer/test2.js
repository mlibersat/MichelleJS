const { rte1, button1 } = components;

didUtils.fakeSubmit(rte1, button1);

const value = "5";
// const inputID = "3"

button1.on("click", () => {
  const string = `<p style="text-align: center;">This is an input&nbsp;<input data-type="math" id="input1" type="text" />&nbsp;with a fakeSubmit button below.</p><p style="text-align: center;">&nbsp;</p><p style="text-align: center;">After clicking the button, the input will change to&nbsp;5</p><p style="text-align: center;">(and the submit button will become active).</p>`;

  rte1.updateData({ text: string });
  rte1.updateInput(0, { text: value });
  // a quick fix is to manually disable the button and change to "Submitted" on updateInput. Will this break fakeSubmit? Let's find out!
  button1.updateData({ disabled: true, text: "Submitted" });
});

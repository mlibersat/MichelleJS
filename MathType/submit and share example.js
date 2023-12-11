const {
  ggb1,
  cc_submit_532b72388fe8_textbox1: submitText1,
  cc_submit_532b72388fe8_input1: submitInput1,
  cc_submit_532b72388fe8_button1: submitButton1,
  cc_sharewithclass_87c25185ed53_textbox1: shareText1,
  cc_sharewithclass_87c25185ed53_input1: shareInput1,
  cc_sharewithclass_87c25185ed53_button1: shareButton1,
  cc_sharewithclass_87c25185ed53_studentanswers1: answers1,
} = components;

const readOrder = [submitText1, ggb1, submitInput1, submitButton1, shareText1, shareInput1, shareButton1, answers1];

didUtils.onInit(() => {
  // This code works when the slide is on Katex or Mathjax
  submitText1.updateData({
    text: "The graph shows the points that represent your solutions to $x-y<600$.\n\nSuppose the entire class's points were also plotted on the graph. What might the graph look like when zoomed out?\n\nWhat might the graph look like when zoomed in?",
  });
  shareText1.updateData({
    text: "The class's points are now plotted on the graph.\n\nWhat do you think the graph of the entire solution set of\n\n$x-y<600$ looks like? Explain.",
  });
});

submitButton1.on("click", () => {
  didUtils.show(shareText1, shareInput1, shareButton1, answers1);
});

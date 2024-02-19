const { rte2, rte3, buttonGroup1 } = components;
didUtils.onInit(() => {
  buttonGroup1.updateSingleButton({ disabled: true }, 2);
  didUtils.disappear(rte3);
}, rte2);
buttonGroup1.on("click:1", () => {
  buttonGroup1.updateSingleButton({ disabled: true }, 1);
  buttonGroup1.updateSingleButton({ disabled: false }, 2);
  didUtils.show(rte3);
  didUtils.disappear(rte2);
});
buttonGroup1.on("click:2", () => {
  buttonGroup1.updateSingleButton({ disabled: false }, 1);
  buttonGroup1.updateSingleButton({ disabled: true }, 2);
  didUtils.show(rte2);
  didUtils.disappear(rte3);
});

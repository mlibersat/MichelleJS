/////////////////////// Radio
//
autorun(() => {
  // 1. Do stuff on change of radio component
  if (radio1.data.selected) {
  }

  // 2. Do stuff if the first option is selected
  if (radio1.data.selected === "0") {
  }
  // 3. Do stuff if the second option is selected
  if (radio1.data.selected === "1") {
  }

  // 4. Do more stuff on autorun
});

/////////////////////// Select
// 1. Do stuff on change of select component
select1.on("change", function ({ selected }) {
  // 2. Do stuff if the first option is selected
  if (select1.data.selected.includes("0")) {
  }

  // 3. Do stuff if the second option is selected
  if (select1.data.selected.includes("1")) {
  }
});

//  4. Do more stuff on aurotun
autorun(() => {});

utils.RTS.on("datachange", "slide-102b2e9edb49", (register) => {
  if (!register || !register.length) {
    return;
  }

  const lastRegister = discardOldResponses(register).reverse();

  let numX = [];
  let numY = [];

  lastRegister.forEach(({ data, info }) => {
    const { param1, param2 } = data;
    numX.push(param1);
    numY.push(param2);
    for (let j = 0, L = numX.length; j < L; j++) {
      let matches = 0;
      for (let i = 0, M = table1.data.rows.length; i < M; i++) {
        let xCheck = table1.getCell(i, 0).value;
        if (xCheck == numX[j]) {
          matches++;
        }
      }
      if (matches == 0) {
        let newRow = createTableRowsData([[`${numX[j]}`, `${numY[j]}`]]);
        let allRows = [...table1.data.rows, ...newRow];
        table1.updateData({ rows: allRows });
      }
    }
  });
});

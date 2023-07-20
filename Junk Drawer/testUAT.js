const { rte1, rte2 } = components;
console.log(rte1.data.text);

rte1.updateData({
  text: '<p>This is my happy song.  I can sing it <input aria-label="text input here" id="input1" size="7" type="text"> day long. </p>',
});







// Type = "math" - DOESN'T WORK
// rte2.updateData({
//   text: '<p><input aria-label="math input here" id="input3" size="7" type="math"> little ducks went out one day, over the hills and far away.  Mama duck said <input aria-label="text input here" id="input2" size="50" type="text"> and all of those duckies came a-waddling back.',
// });


// data-type = "math" - WORKS
rte2.updateData({
  text: '<p><input aria-label="math input here" data-type="math" id="input3" size="7" type="text" />&nbsp;little ducks went out one day, over the hills and far away. Mama duck said&nbsp;<input aria-label="text input here" data-type="regular" id="input2" size="50" type="text" />&nbsp;and all of those duckies came a-wadling back.</p>',
});


// inputType = "math" - DOESN'T WORK
// rte2.updateData({
//   text: '<p><input aria-label="math input here"  "inputType": "text",="math" id="input3" size="7" type="text" />&nbsp;little ducks went out one day, over the hills and far away. Mama duck said&nbsp;<input aria-label="text input here"  "inputType": "text",="regular" id="input2" size="50" type="text" />&nbsp;and all of those duckies came a-wadling back.</p>',
// });

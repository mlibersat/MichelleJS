// const { ggb1, input1, button1 } = components;

// button1.on("click", () => {});
// console.log(ggb1.instance.getXcoord('A'))
/*
INITIAL CODE STRUCTURE:
const { ggb1, input1, button1 } = components;

button1.on('click', () => {

});
*/

/*
1. console.log();
//try ggb1.instance.getXcoord('A')

2. ggb1.instance.getXcoord();
//try 'A' or 'B' as arguments

3. ggb1.instance.getYcoord();
//try 'A' or 'B' as arguments

4. ggb1.instance.getValue();
//try 'xValB' or 'yValB'

5. ggb1.instance.setValue();
//try "xValB, ggb1.instance.getXcoord('A')", "yValB, ggb1.instance.getYcoord('A')", or try with two lines of code so that both happen at the same time!

6. ggb1.instance.setCoords();
//try "'A', ggb1.instance.getValue('xValB'), ggb1.instance.getValue('yValB')"

And as a bonus... 
7. console.log();
//now try input1.data
//on the preview, type in a number in the input then click the button

8. ggb1.instance.setValue('xValB', parseFloat(input1.data.text));

*/
const { ggb1, button1 } = components;

button1.on("click", () => {
  //the following things happen on the click of button 1
  //set the color of point A to red
  //ggb1.instance.setColor("A", 218, 41, 28);
  //Set the size of point A to 8
  //ggb1.instance.setPointSize('A',8);
  //set point A as  fixed and not selectable
  //ggb1.instance.setFixed('A', false, false);
  //hide pt A. Note in GGB SetVisible
  //ggb1.instance.setVisible('A',false );
  // Sets the value of the boolean (named 'boolean' in GGB) to false.
  ggb1.instance.setValue("boolean", false);
});

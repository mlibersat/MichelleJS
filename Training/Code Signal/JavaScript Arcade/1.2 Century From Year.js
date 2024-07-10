function solution(year) {
  return Math.ceil(year / 100);
}

// function solution(year) {
//   // take a year and give the century
//   // divide 100 and round up (do Floor)
//   const div = year / 100;

//   const cent = Math.ceil(div);

//   return cent;
// }

// function solution(year) {
//   // take a year and give the century
//   // divide 100 and round up (I think parseInt works something like a Floor - but takes a string)
//   const div = year / 100;

//   const cent = parseInt(div.toString());

//   const round = div === cent ? div : cent + 1;
//   // let div;
//   // let cent;

//   // let str;
//   /*   div = year / 100;
//   console.log(div);

//   str = div.toString();
//   console.log(str);

//   cent = parseInt(str);
//   console.log(cent);
//    */

//   /*   div = year / 100;

//   cent = parseInt(div.toString()); */

//   // let round;
//   // If integer,  return integer, else return cent+1
//   /*   if (div === cent) {
//     round = div;
//   } else {
//     round = cent + 1;
//   } */

//   return round;
// }

// trial 1

/* function solution(year) {
  function solution(year) {
  // take a year and give the century
  // divide 100 and round up (I think parseInt works something like a Floor - but takes a string)
  let div;
  let str;
  let cent;
  div = year / 100;
  console.log(div);

  str = year.toString();
  console.log(str);

  cent = parseInt(div);
  console.log(cent);
  return cent;
}

 */

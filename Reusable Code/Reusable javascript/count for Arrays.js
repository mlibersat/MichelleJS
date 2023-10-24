function countStringInArray(arr, desiredStr) {
  const count = arr.reduce((aNum, str) => aNum + str.includes(desiredStr), 0);
  return count;
}

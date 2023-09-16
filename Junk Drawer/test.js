stage1DotsList = Sequence(
  If(i > 1, " ", "") +
    "The " +
    Element(placeValues, i) +
    " column has " +
    If(IsDefined(Element(numberDigits, i)), Element(numberDigits, i), 0) +
    If(Element(numberDigits, i) === 1, " dot", " dots") +
    " dots at the top and " +
    If(IsDefined(Element(number2Digits, i)), Element(number2Digits, i), 0) +
    If(Element(number2Digits, i) === 1, " dot", " dots") +
    " at the bottom.",
  i,
  1,
  numberDigitsLengthMax
);

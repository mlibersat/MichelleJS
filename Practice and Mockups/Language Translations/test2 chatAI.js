createVariablesFromTextObject("status");

function createVariablesFromTextObject(textObject) {
  const variableStrings = [];
  const allObjectNames = ggbApplet.getAllObjectNames();
  console.warn("allObjectNames", allObjectNames);
  allObjectNames.forEach((name) => {
    const objectType = ggbApplet.getObjectType(name);
    if (
      objectType === "point" ||
      objectType === "line" ||
      objectType === "ray" ||
      objectType === "segment" ||
      objectType === "angle" ||
      objectType === "function"
    ) {
      const definitionString = ggbApplet.getDefinitionString(name);
      console.warn("definitionString", definitionString);
      console.warn("definitionString.includes(textObject)", definitionString.includes(textObject));

      if (textObject.includes(definitionString)) {
        let variableString;
        switch (objectType) {
          // case "point":
          //   variableString = `const ${name} = ggbApplet.getValueString("${name}");`;
          //   console.warn("point variableString", variableString);
          //   break;
          case "point":
            variableString = `const ${name} = ggbApplet.get${objectType}("${name}");`;
            console.warn("point variableString", variableString);
            break;
          case "line":
          case "ray":
          case "segment":
            variableString = `const ${name} = ggbApplet.get${objectType}("${name}");`;
            break;
          case "angle":
            variableString = `const ${name} = ggbApplet.get${objectType}("${name}", ${ggbApplet.getPointName(
              ggbApplet.getAnglePoints(name)[0]
            )}, ${ggbApplet.getPointName(ggbApplet.getAnglePoints(name)[1])}, ${ggbApplet.getPointName(
              ggbApplet.getAnglePoints(name)[2]
            )});`;
            break;
          case "function":
            variableString = `const ${name} = ggbApplet.get${objectType}("${name}", "${definitionString}");`;
            break;
          default:
            variableString = "";
            break;
        }
        variableStrings.push(variableString);
      }
    }
  });
  return variableStrings.join("\n");
}

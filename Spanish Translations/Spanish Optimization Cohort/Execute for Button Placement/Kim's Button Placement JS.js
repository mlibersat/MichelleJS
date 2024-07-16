function ggbOnInit() {
  alignButtons(4);
  function alignButtons(numOfButtons) {
    const buttonWidths = [];

    for (let i = numOfButtons; i >= 1; i--) {
      buttonWidths.push(
        ggbApplet.getValue(
          ggbApplet.evalCommandGetLabels(
            "ggbButton" +
              i +
              "Width=(x(Corner(ggbButton" +
              i +
              ", 3))-x(Corner(ggbButton" +
              i +
              ", 1)))/xpixel"
          )
        )
      );
    }
    const appletWidth = ggbApplet.getXcoord("corner");
    buttonWidths.forEach((buttonWidth, index) => {
      const geoGebraIndex = index + 1;
      let concatWidths = 0;
      buttonWidths.slice(0, index + 1).forEach((width) => {
        concatWidths -= width;
      });
      ggbApplet.setCoords(
        "ggbButton" + (buttonWidths.length - index).toString(),
        appletWidth - geoGebraIndex * 15 + concatWidths,
        ggbApplet.getValue("(buttonBarHeight/ypixel-30)/2")
      );
    });
  }
}

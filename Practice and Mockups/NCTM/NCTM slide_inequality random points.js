const { ggb1, text1, button1 } = components;

// show random solutions
button1.on("click", () => {
  button1.updateData({ disabled: true });
  ggb1.instance.setValue("randPointsShowing", true);
  utils.screenReader.sendMessage(ggb1.instance.getValueString("animationText"));
  if (!ggb1.instance.exists("randPointsList")) {
    ggb1.instance.evalCommand("randPointsList = {}");
  }
  if (!ggb1.instance.exists("randPointsString")) {
    ggb1.instance.evalCommand('randPointsString = ""');
    ggb1.instance.setVisible("randPointsString", false);
  }
  function createPoint() {
    let randX = getRandomIndep(-11, 11);
    let randY = getRandomDep(-11, 11);

    function getRandomIndep(min, max) {
      return parseFloat(Math.random() * (max - min) + min);
    }

    function getRandomDep(min, max) {
      let tempNum = Math.random() * (max - min) + min;
      // for (let index = 0; index >= 0; index++) {
      if (randX - tempNum < 6) {
        return parseFloat(tempNum);
      } else {
        // lets the loop continue
        getRandomDep(min, max);
      }
      // }
    }

    const newPoint = ggb1.instance.evalCommandGetLabels("PointIn(solRegion)");

    ggb1.instance.setFixed(newPoint, false, false);
    ggb1.instance.setColor(newPoint, 0, 127, 175);
    ggb1.instance.setCoords(newPoint, randX, randY);
    ggb1.instance.setPointSize(newPoint, 4);
    ggb1.instance.evalCommand(`SetValue(randPointsList, Append(randPointsList, ${newPoint}))`);
    ggb1.instance.setTextValue("randPointsString", ggb1.instance.getValueString("randPointsList") + "");
  }

  let ms = 200;
  function timeout() {
    const allPoints = ggb1.instance.getAllObjectNames("point");
    if (allPoints.length > 500) {
      ggb1.instance.setAnimating("time", false);
      ggb1.instance.setValue("time", 0);
      ggb1.instance.setAnimating("time", true);
      ggb1.instance.startAnimation();
      return;
    }
    if (ms > 100) {
      ms -= 5;
    }
    setTimeout(() => {
      createPoint();
      timeout();
    }, ms);
  }
  timeout();
});

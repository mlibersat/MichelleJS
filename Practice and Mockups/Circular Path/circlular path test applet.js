function ggbOnInit(name, ggbObject) {
  ggbObject.registerAddListener(function (a) {
    var assignment = {
      button2: {
        type: "click",
        callback: deleteThem,
      },
      A: {
        type: "update",
        callback: deleteThem,
      },
      B: {
        type: "update",
        callback: deleteThem,
      },
      C: {
        type: "update",
        callback: deleteThem,
      },
      D: {
        type: "update",
        callback: deleteThem,
      },
      // add more here if you have more objects
    };
    if (assignment[a]) {
      var reAddedProperties = assignment[a];
      switch (reAddedProperties.type) {
        case "click":
          ggbObject.registerObjectClickListener(a, reAddedProperties.callback);
          break;
        case "update":
          // delay update registration within the call stack to prevent premature firing
          setTimeout(function () {
            ggbObject.registerObjectUpdateListener(a, reAddedProperties.callback);
          });
      }
    }
  });

  ggbObject.registerClientListener(fold);
  ggbObject.registerObjectClickListener("button2", deleteThem);
  ggbObject.registerObjectUpdateListener("A", deleteThem);
  ggbObject.registerObjectUpdateListener("B", deleteThem);
  ggbObject.registerObjectUpdateListener("C", deleteThem);
  ggbObject.registerObjectUpdateListener("D", deleteThem);

  ggbObject.evalCommand("    xpixel=(x(Corner(3)) - x(Corner(1))) / x(Corner(5))");
  ggbObject.evalCommand("    guideRadius=18xpixel    ");

  let pointList = ["F"];

  pointList.forEach((element, index) => {
    ggbObject.evalCommand(
      "    rightGuideArrow" +
        element +
        "=Polygon({    Dilate(Rotate(" +
        element +
        ",90deg, Intersect( Circle(" +
        element +
        ",guideRadius), tangent" +
        element +
        ",2)), (3.5xpixel)/guideRadius, Intersect( Circle(" +
        element +
        ",guideRadius), tangent" +
        element +
        ",2)),    Dilate(Rotate(" +
        element +
        ",270deg, Intersect( Circle(" +
        element +
        ",guideRadius), tangent" +
        element +
        ",2)),(3.5xpixel)/guideRadius, Intersect( Circle(" +
        element +
        ",guideRadius), tangent" +
        element +
        ",2)),    Dilate(Reflect(" +
        element +
        ", Intersect( Circle(" +
        element +
        ",guideRadius), tangent" +
        element +
        ",2)),(7.25xpixel)/guideRadius,Intersect( Circle(" +
        element +
        ",guideRadius), tangent" +
        element +
        ",2))}) \n    leftGuideArrow" +
        element +
        "=Polygon({ Dilate(Rotate(" +
        element +
        ",90deg, Intersect( Circle(" +
        element +
        ",guideRadius), tangent" +
        element +
        ",1)), (3.5xpixel)/guideRadius, Intersect( Circle(" +
        element +
        ",guideRadius), tangent" +
        element +
        ",1)),    Dilate(Rotate(" +
        element +
        ",270deg, Intersect( Circle(" +
        element +
        ",guideRadius), tangent" +
        element +
        ",1)),(3.5xpixel)/guideRadius, Intersect( Circle(" +
        element +
        ",guideRadius), tangent" +
        element +
        ",1)),    Dilate(Reflect(" +
        element +
        ", Intersect( Circle(" +
        element +
        ",guideRadius), tangent" +
        element +
        ",1)),(7.25xpixel)/guideRadius,Intersect( Circle(" +
        element +
        ",guideRadius), tangent" +
        element +
        ",1))  })     "
    );
  });

  pointList.forEach((element, index) => {
    ggbObject.evalCommand(
      "    ShowLabel(rightGuideArrow" +
        element +
        ", false) \n    ShowLabel(leftGuideArrow" +
        element +
        ", false) \n    SetColor(rightGuideArrow" +
        element +
        ", 0,0,0) \n    SetColor(leftGuideArrow" +
        element +
        ", 0,0,0) \n    SetFilling(rightGuideArrow" +
        element +
        ", 1) \n    SetFilling(leftGuideArrow" +
        element +
        ", 1) "
    );
  });

  pointList.forEach((element, index) => {
    ggbObject.setVisible("rightGuideArrow" + element + "", false);
  });
  pointList.forEach((element, index) => {
    ggbObject.setVisible("leftGuideArrow" + element + "", false);
  });

  ggbObject.registerClientListener(show);

  function fold(a) {
    if (a[0] === "select" && a[1] != "button1") {
      ggbObject.setValue("time", 0);
    }
    if (a[0] === "dragEnd" && a[1] === "F") {
      ggbObject.setAnimating("time", true);
      ggbObject.startAnimation();
    }
    if (ggbObject.getValue("time") === 1) {
      ggbObject.stopAnimation();
      ggbObject.setAnimating("time", false);
    } else {
      switch (a.type) {
        case "select":
          switch (a.target) {
            case "F":
              ggbObject.setVisible("rightGuideArrowF", true);
              ggbObject.setVisible("leftGuideArrowF", true);
              break;
          }
          break;
        case "deselect":
          ggbObject.setVisible("rightGuideArrowF", false);
          ggbObject.setVisible("leftGuideArrowF", false);
          break;
        default:
      }
    }
  }

  function deleteThem() {
    var segmentList = [];
    segmentList = ggbObject.getAllObjectNames("segment");
    segmentList.splice(segmentList.indexOf("a"), 1);
    segmentList.splice(segmentList.indexOf("b"), 1);
    segmentList.splice(segmentList.indexOf("c"), 1);
    segmentList.splice(segmentList.indexOf("d"), 1);
    for (var i = 0; i < segmentList.length; i++) {
      ggbObject.deleteObject(segmentList[i]);
    }
  }
}

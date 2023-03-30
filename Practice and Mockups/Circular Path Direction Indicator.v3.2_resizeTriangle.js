//Adds direction indicators for points on a circular path. Useful for helping the user identify the direction a draggable point will travel.

function ggbOnInit(name, ggbObject) {
  //Use this code block to add direction indicators for point(s) on circular/conic path(s)
  ggbObject.evalCommand("    xpixel=(x(Corner(3)) - x(Corner(1))) / x(Corner(5))");
  //the guideRadius is based on a 1:1 window setting. If applet uses other window settings, change "18xpixel" below to a comparable value.
  ggbObject.evalCommand("    guideRadius=18xpixel    ");

  //Enter the names of all points that are on circular paths, as separate strings, separated by commas
  let pointList = ["A", "B"];

  //Enter the names of each conic/circular path, in the same order as the points above, as separate strings, separated by commas.
  //Reuse names of conics if necessary, for example ["c","c"]
  let conicList = ["c", "c"]; //need to add this conicList into the code below in place of "c"

  pointList.forEach((element, index) => {
    ggbObject.evalCommand(
      "    rightGuideArrow" +
        element +
        "=Polygon({    Dilate(Rotate(" +
        element +
        ",90deg, Intersect( (x-x(" +
        element +
        "))^2 +(y-y(" +
        element +
        "))^2=guideRadius^2, y-y(" +
        element +
        ")=-(x(Center(c))-x(" +
        element +
        "))/(y(Center(c))-y(" +
        element +
        "))(x-x(" +
        element +
        ")),2)), (3.5xpixel)/guideRadius, Intersect( (x-x(" +
        element +
        "))^2 +(y-y(" +
        element +
        "))^2=guideRadius^2, y-y(" +
        element +
        ")=-(x(Center(c))-x(" +
        element +
        "))/(y(Center(c))-y(" +
        element +
        "))(x-x(" +
        element +
        ")),2)),    Dilate(Rotate(" +
        element +
        ",270deg, Intersect( (x-x(" +
        element +
        "))^2 +(y-y(" +
        element +
        "))^2=guideRadius^2, y-y(" +
        element +
        ")=-(x(Center(c))-x(" +
        element +
        "))/(y(Center(c))-y(" +
        element +
        "))(x-x(" +
        element +
        ")),2)),(3.5xpixel)/guideRadius, Intersect( (x-x(" +
        element +
        "))^2 +(y-y(" +
        element +
        "))^2=guideRadius^2, y-y(" +
        element +
        ")=-(x(Center(c))-x(" +
        element +
        "))/(y(Center(c))-y(" +
        element +
        "))(x-x(" +
        element +
        ")),2)),    Dilate(Reflect(" +
        element +
        ", Intersect( (x-x(" +
        element +
        "))^2 +(y-y(" +
        element +
        "))^2=guideRadius^2, y-y(" +
        element +
        ")=-(x(Center(c))-x(" +
        element +
        "))/(y(Center(c))-y(" +
        element +
        "))(x-x(" +
        element +
        ")),2)),(7.25xpixel)/guideRadius,Intersect( (x-x(" +
        element +
        "))^2 +(y-y(" +
        element +
        "))^2=guideRadius^2, y-y(" +
        element +
        ")=-(x(Center(c))-x(" +
        element +
        "))/(y(Center(c))-y(" +
        element +
        "))(x-x(" +
        element +
        ")),2))}) \n    leftGuideArrow" +
        element +
        "=Polygon({ Dilate(Rotate(" +
        element +
        ",90deg, Intersect( (x-x(" +
        element +
        "))^2 +(y-y(" +
        element +
        "))^2=guideRadius^2, y-y(" +
        element +
        ")=-(x(Center(c))-x(" +
        element +
        "))/(y(Center(c))-y(" +
        element +
        "))(x-x(" +
        element +
        ")),1)), (3.5xpixel)/guideRadius, Intersect( (x-x(" +
        element +
        "))^2 +(y-y(" +
        element +
        "))^2=guideRadius^2, y-y(" +
        element +
        ")=-(x(Center(c))-x(" +
        element +
        "))/(y(Center(c))-y(" +
        element +
        "))(x-x(" +
        element +
        ")),1)),    Dilate(Rotate(" +
        element +
        ",270deg, Intersect( (x-x(" +
        element +
        "))^2 +(y-y(" +
        element +
        "))^2=guideRadius^2, y-y(" +
        element +
        ")=-(x(Center(c))-x(" +
        element +
        "))/(y(Center(c))-y(" +
        element +
        "))(x-x(" +
        element +
        ")),1)),(3.5xpixel)/guideRadius, Intersect( (x-x(" +
        element +
        "))^2 +(y-y(" +
        element +
        "))^2=guideRadius^2, y-y(" +
        element +
        ")=-(x(Center(c))-x(" +
        element +
        "))/(y(Center(c))-y(" +
        element +
        "))(x-x(" +
        element +
        ")),1)),    Dilate(Reflect(" +
        element +
        ", Intersect( (x-x(" +
        element +
        "))^2 +(y-y(" +
        element +
        "))^2=guideRadius^2, y-y(" +
        element +
        ")=-(x(Center(c))-x(" +
        element +
        "))/(y(Center(c))-y(" +
        element +
        "))(x-x(" +
        element +
        ")),1)),(7.25xpixel)/guideRadius,Intersect( (x-x(" +
        element +
        "))^2 +(y-y(" +
        element +
        "))^2=guideRadius^2, y-y(" +
        element +
        ")=-(x(Center(c))-x(" +
        element +
        "))/(y(Center(c))-y(" +
        element +
        "))(x-x(" +
        element +
        ")),1))  })     "
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

  //To make the direction indicators visible on first load of the applet, change the booleans to true
  pointList.forEach((element, index) => {
    ggbObject.setVisible("rightGuideArrow" + element + "", false);
  });
  pointList.forEach((element, index) => {
    ggbObject.setVisible("leftGuideArrow" + element + "", false);
  });

  ggbObject.registerClientListener(show);

  function show(a) {
    console.log(a);
    switch (a.type) {
      case "select":
        switch (a.target) {
          case "A": //change the name of A to the name of the point on a circular path. copy/paste this case for each point as necessary
            //also change the name of rightGuideArrow#, where # is the name of the point
            ggbObject.setVisible("rightGuideArrowA", true);
            ggbObject.setVisible("leftGuideArrowA", true);
            break;
          case "B": //change the name of A to the name of the point on a circular path. copy/paste this case for each point as necessary
            //also change the name of rightGuideArrow#, where # is the name of the point
            ggbObject.setVisible("rightGuideArrowB", true);
            ggbObject.setVisible("leftGuideArrowB", true);
            break;
        }
        break;
      case "deselect": //change the name of A to the name of the point on a circular path. copy/paste both lines for each point as necessary, and add them to this case
        ggbObject.setVisible("rightGuideArrowA", false);
        ggbObject.setVisible("leftGuideArrowA", false);
        ggbObject.setVisible("rightGuideArrowB", false);
        ggbObject.setVisible("leftGuideArrowB", false);
        break;
    }
  }
}

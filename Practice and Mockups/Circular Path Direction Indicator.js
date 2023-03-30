function ggbOnInit(name, ggbObject) {
  ggbObject.evalCommand("    xpixel=(x(Corner(3)) - x(Corner(1))) / x(Corner(5))");
  ggbObject.evalCommand("    guideRadius=10xpixel    ");
  ggbObject.evalCommand(
    "    rightGuideArrow=Polygon({    Dilate(Rotate(A,90deg, Intersect( (x-x(A))^2 +(y-y(A))^2=guideRadius^2, y-y(A)=-(x(Center(c))-x(A))/(y(Center(c))-y(A))(x-x(A)),2)), sqrt(3)/3, Intersect( (x-x(A))^2 +(y-y(A))^2=guideRadius^2, y-y(A)=-(x(Center(c))-x(A))/(y(Center(c))-y(A))(x-x(A)),2)),    Dilate(Rotate(A,270deg, Intersect( (x-x(A))^2 +(y-y(A))^2=guideRadius^2, y-y(A)=-(x(Center(c))-x(A))/(y(Center(c))-y(A))(x-x(A)),2)),sqrt(3)/3, Intersect( (x-x(A))^2 +(y-y(A))^2=guideRadius^2, y-y(A)=-(x(Center(c))-x(A))/(y(Center(c))-y(A))(x-x(A)),2)),    Reflect(A, Intersect( (x-x(A))^2 +(y-y(A))^2=guideRadius^2, y-y(A)=-(x(Center(c))-x(A))/(y(Center(c))-y(A))(x-x(A)),2))}) \n    leftGuideArrow=Polygon({ Dilate(Rotate(A,90deg, Intersect( (x-x(A))^2 +(y-y(A))^2=guideRadius^2, y-y(A)=-(x(Center(c))-x(A))/(y(Center(c))-y(A))(x-x(A)),1)), sqrt(3)/3, Intersect( (x-x(A))^2 +(y-y(A))^2=guideRadius^2, y-y(A)=-(x(Center(c))-x(A))/(y(Center(c))-y(A))(x-x(A)),1)),    Dilate(Rotate(A,270deg, Intersect( (x-x(A))^2 +(y-y(A))^2=guideRadius^2, y-y(A)=-(x(Center(c))-x(A))/(y(Center(c))-y(A))(x-x(A)),1)),sqrt(3)/3, Intersect( (x-x(A))^2 +(y-y(A))^2=guideRadius^2, y-y(A)=-(x(Center(c))-x(A))/(y(Center(c))-y(A))(x-x(A)),1)),    Reflect(A, Intersect( (x-x(A))^2 +(y-y(A))^2=guideRadius^2, y-y(A)=-(x(Center(c))-x(A))/(y(Center(c))-y(A))(x-x(A)),1))  })     "
  );
  ggbObject.evalCommand(
    "    ShowLabel(rightGuideArrow, false) \n    ShowLabel(leftGuideArrow, false) \n    SetColor(rightGuideArrow, 0,0,0) \n    SetColor(leftGuideArrow, 0,0,0) \n    SetFilling(rightGuideArrow, 1) \n    SetFilling(leftGuideArrow, 1) "
  );
  //To make the direction indicators visible on first load of the applet, change the booleans to true
  ggbObject.setVisible("rightGuideArrow", false);
  ggbObject.setVisible("leftGuideArrow", false);

  ggbObject.registerClientListener(show);

  function show(a) {
    console.log(a);
    switch (a.type) {
      case "select":
        switch (a.target) {
          case "A":
            ggbObject.setVisible("rightGuideArrow", true);
            ggbObject.setVisible("leftGuideArrow", true);
            break;
        }
        break;
      case "deselect":
        ggbObject.setVisible("rightGuideArrow", false);
        ggbObject.setVisible("leftGuideArrow", false);
        break;
    }
  }
}

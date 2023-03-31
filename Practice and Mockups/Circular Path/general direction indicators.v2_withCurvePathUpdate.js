//enter points that will need active indicators as keys of the object
//enter type of active indicator the points need as the value for each key (1 = left/right, 2 = up/down, 3 = NSEW, 4 = circle) ---- are there more?

const indicators = {
  A: 1,
  B: 2,
  C: 4,
  D: 3,
};

////////////////////////////// don't touch below this line////////////////////////////////////////
function pixelFunction() {
  if (!ggbApplet.exists("xpixel")) {
    ggbApplet.evalCommand("corner1=Corner(1)");
    ggbApplet.evalCommand("corner2=Corner(2)");
    ggbApplet.evalCommand("corner3=Corner(3)");
    ggbApplet.evalCommand("corner4=Corner(4)");
    ggbApplet.evalCommand("corner=Corner(5)");
    ggbApplet.evalCommand("xpixel =(x(corner3)-x(corner1))/x(corner)");
    ggbApplet.evalCommand("ypixel = (y(corner3) - y(corner1)) / y(corner)");
  }
}
pixelFunction();

const keys = Object.keys(indicators);

keys.forEach((key, index) => {
  switch (indicators[key]) {
    case 1:
      oneFunction(index);
      break;
    case 2:
      twoFunction(index);
      break;
    case 3:
      threeFunction(index);
      break;
    case 4:
      fourFunction(index);
      break;
  }
});

//left/right arrows
function oneFunction(a) {
  //create boolean
  let newBoo = "showArrows" + keys[a];
  ggbApplet.evalCommand(newBoo + "=false");

  //create left arrow object
  let left = "LeftIndicator" + keys[a];
  ggbApplet.evalCommand(left + "= (x(" + keys[a] + ")-15xpixel, y(" + keys[a] + "))");
  ggbApplet.setPointStyle(left, 9);
  ggbApplet.setLabelVisible(left, false);
  ggbApplet.evalCommand("SetConditionToShowObject(" + left + ", " + newBoo + ")");

  //create right arrow object
  let right = "RightIndicator" + keys[a];
  ggbApplet.evalCommand(right + "= (x(" + keys[a] + ")+15xpixel, y(" + keys[a] + "))");
  ggbApplet.setPointStyle(right, 8);
  ggbApplet.setLabelVisible(right, false);
  ggbApplet.evalCommand("SetConditionToShowObject(" + right + ", " + newBoo + ")");
}

//up/down arrows
function twoFunction(a) {
  //create boolean
  let newBoo = "showArrows" + keys[a];
  ggbApplet.evalCommand(newBoo + "=false");

  //create up arrow object
  let up = "UpIndicator" + keys[a];
  ggbApplet.evalCommand(up + "= (x(" + keys[a] + "), y(" + keys[a] + ")+15ypixel)");
  ggbApplet.setPointStyle(up, 6);
  ggbApplet.setLabelVisible(up, false);
  ggbApplet.evalCommand("SetConditionToShowObject(" + up + ", " + newBoo + ")");

  //create down arrow object
  let down = "DownIndicator" + keys[a];
  ggbApplet.evalCommand(down + "= (x(" + keys[a] + "), y(" + keys[a] + ")-15ypixel)");
  ggbApplet.setPointStyle(down, 7);
  ggbApplet.setLabelVisible(down, false);
  ggbApplet.evalCommand("SetConditionToShowObject(" + down + ", " + newBoo + ")");
}

//NSEW arrows
function threeFunction(a) {
  //create boolean
  let newBoo = "showArrows" + keys[a];
  ggbApplet.evalCommand(newBoo + "=false");

  //create left arrow object
  let left = "LeftIndicator" + keys[a];
  ggbApplet.evalCommand(left + "= (x(" + keys[a] + ")-15xpixel, y(" + keys[a] + "))");
  ggbApplet.setPointStyle(left, 9);
  ggbApplet.setLabelVisible(left, false);
  ggbApplet.evalCommand("SetConditionToShowObject(" + left + ", " + newBoo + ")");

  //create right arrow object
  let right = "RightIndicator" + keys[a];
  ggbApplet.evalCommand(right + "= (x(" + keys[a] + ")+15xpixel, y(" + keys[a] + "))");
  ggbApplet.setPointStyle(right, 8);
  ggbApplet.setLabelVisible(right, false);
  ggbApplet.evalCommand("SetConditionToShowObject(" + right + ", " + newBoo + ")");

  //create up arrow object
  let up = "UpIndicator" + keys[a];
  ggbApplet.evalCommand(up + "= (x(" + keys[a] + "), y(" + keys[a] + ")+15ypixel)");
  ggbApplet.setPointStyle(up, 6);
  ggbApplet.setLabelVisible(up, false);
  ggbApplet.evalCommand("SetConditionToShowObject(" + up + ", " + newBoo + ")");

  //create down arrow object
  let down = "DownIndicator" + keys[a];
  ggbApplet.evalCommand(down + "= (x(" + keys[a] + "), y(" + keys[a] + ")-15ypixel)");
  ggbApplet.setPointStyle(down, 7);
  ggbApplet.setLabelVisible(down, false);
  ggbApplet.evalCommand("SetConditionToShowObject(" + down + ", " + newBoo + ")");
}

//circle path arrows
function fourFunction(a) {
  //create boolean
  let newBoo = "showArrows" + keys[a];
  ggbApplet.evalCommand(newBoo + "=false");

  //find circle path
  var pathString = ggbApplet.getDefinitionString(keys[a]);
  // console.log(pathString) //returns "point on _____"
  var regex = /(?<=n ).+/g;
  console.log(regex.test(pathString));
  if (regex.test(pathString)) {
    var path = pathString.match(regex)[0];
  } else {
    console.warn(`Object ${keys[a]} is not on a curved path. Try a different direction indicator choice.`);
    return;
  }
  console.log(path); //returns string of path name

  //create objects
  let left = "CircleIndicatorLeft" + keys[a];
  let right = "CircleIndicatorRight" + keys[a];
  // 1       ////////////////////////////////////////<<<<<<<<<<<<Michelle's Update!!!!!!
  // Tangent("+keys[a]+","+path+")

  // 2        ///////////////////// Find & Replace:
  // y-y(" +
  //     keys[a] +
  //     ")=-(x(Center(" +
  //     path +
  //     "))-x(" +
  //     keys[a] +
  //     "))/(y(Center(" +
  //     path +
  //     "))-y(" +
  //     keys[a] +
  //     "))(x-x(" +
  //     keys[a] +
  //     "))
  ////////////////////

  // 3          /////////////////////////////// Also find and replace:
  //(3.5xpixel)/guideRadius with (3.5xpixel)/guideRadius

  //4           //////////////////////Change REFLECT command to be a DILATE(REFLECT)
  //Dilate(Reflect(.....),(7.25xpixel)/guideRadius, Intersect(....))
  ggbApplet.evalCommand("guideRadius=18xpixel");
  ggbObject.evalCommand("tangent"+keys[a]+"=Tangent("+keys[a]+","+path+")");
  // ggbApplet.evalCommand(
  //   right +
  //     "=Polygon({Dilate(Rotate(" +
  //     keys[a] +
  //     ",90deg, Intersect( (x-x(" +
  //     keys[a] +
  //     "))^2 +(y-y(" +
  //     keys[a] +
  //     "))^2=guideRadius^2, Tangent(" +
  //     keys[a] +
  //     "," +
  //     path +
  //     "),2)), (3.5xpixel)/guideRadius, Intersect( (x-x(" +
  //     keys[a] +
  //     "))^2 +(y-y(" +
  //     keys[a] +
  //     "))^2=guideRadius^2, Tangent(" +
  //     keys[a] +
  //     "," +
  //     path +
  //     "),2)),Dilate(Rotate(" +
  //     keys[a] +
  //     ",270deg, Intersect( (x-x(" +
  //     keys[a] +
  //     "))^2 +(y-y(" +
  //     keys[a] +
  //     "))^2=guideRadius^2, Tangent(" +
  //     keys[a] +
  //     "," +
  //     path +
  //     "),2)),(3.5xpixel)/guideRadius, Intersect( (x-x(" +
  //     keys[a] +
  //     "))^2 +(y-y(" +
  //     keys[a] +
  //     "))^2=guideRadius^2, Tangent(" +
  //     keys[a] +
  //     "," +
  //     path +
  //     "),2)),Dilate(Reflect(" +
  //     keys[a] +
  //     ", Intersect( (x-x(" +
  //     keys[a] +
  //     "))^2 +(y-y(" +
  //     keys[a] +
  //     "))^2=guideRadius^2, Tangent(" +
  //     keys[a] +
  //     "," +
  //     path +
  //     "),2)),(7.25xpixel)/guideRadius,Intersect( (x-x(" +
  //     keys[a] +
  //     "))^2 +(y-y(" +
  //     keys[a] +
  //     "))^2=guideRadius^2, Tangent(" +
  //     keys[a] +
  //     "," +
  //     path +
  //     "),2)))}) "
  // );
  // ggbApplet.evalCommand(
  //   left +
  //     "=Polygon({Dilate(Rotate(" +
  //     keys[a] +
  //     ",90deg, Intersect( (x-x(" +
  //     keys[a] +
  //     "))^2 +(y-y(" +
  //     keys[a] +
  //     "))^2=guideRadius^2, Tangent(" +
  //     keys[a] +
  //     "," +
  //     path +
  //     "),1)), (3.5xpixel)/guideRadius, Intersect( (x-x(" +
  //     keys[a] +
  //     "))^2 +(y-y(" +
  //     keys[a] +
  //     "))^2=guideRadius^2, Tangent(" +
  //     keys[a] +
  //     "," +
  //     path +
  //     "),1)),Dilate(Rotate(" +
  //     keys[a] +
  //     ",270deg, Intersect( (x-x(" +
  //     keys[a] +
  //     "))^2 +(y-y(" +
  //     keys[a] +
  //     "))^2=guideRadius^2, Tangent(" +
  //     keys[a] +
  //     "," +
  //     path +
  //     "),1)),(3.5xpixel)/guideRadius, Intersect( (x-x(" +
  //     keys[a] +
  //     "))^2 +(y-y(" +
  //     keys[a] +
  //     "))^2=guideRadius^2, Tangent(" +
  //     keys[a] +
  //     "," +
  //     path +
  //     "),1)),Dilate(Reflect(" +
  //     keys[a] +
  //     ", Intersect( (x-x(" +
  //     keys[a] +
  //     "))^2 +(y-y(" +
  //     keys[a] +
  //     "))^2=guideRadius^2, Tangent(" +
  //     keys[a] +
  //     "," +
  //     path +
  //     "),1)),(7.25xpixel)/guideRadius,Intersect( (x-x(" +
  //     keys[a] +
  //     "))^2 +(y-y(" +
  //     keys[a] +
  //     "))^2=guideRadius^2, Tangent(" +
  //     keys[a] +
  //     "," +
  //     path +
  //     "),2)))}) "
  // );

  ggbObject.evalCommand(
    right +
      "=Polygon({Dilate(Rotate(" +
      keys[a] +
      ",90deg, Intersect( Circle(" +
      keys[a] +
      ",guideRadius), tangent" +
      keys[a] +
      ",2)), (3.5xpixel)/guideRadius, Intersect( Circle(" +
      keys[a] +
      ",guideRadius), tangent" +
      keys[a] +
      ",2)),    Dilate(Rotate(" +
      keys[a] +
      ",270deg, Intersect( Circle(" +
      keys[a] +
      ",guideRadius), tangent" +
      keys[a] +
      ",2)),(3.5xpixel)/guideRadius, Intersect( Circle(" +
      keys[a] +
      ",guideRadius), tangent" +
      keys[a] +
      ",2)),    Dilate(Reflect(" +
      keys[a] +
      ", Intersect( Circle(" +
      keys[a] +
      ",guideRadius), tangent" +
      keys[a] +
      ",2)),(7.25xpixel)/guideRadius,Intersect( Circle(" +
      keys[a] +
      ",guideRadius), tangent" +
      keys[a] +
      ",2))}) "
  );
  ggbApplet.evalCommand(
    left +
      "=Polygon({Dilate(Rotate(" +
      keys[a] +
      ",90deg, Intersect( Circle(" +
      keys[a] +
      ",guideRadius), tangent" +
      keys[a] +
      ",1)), (3.5xpixel)/guideRadius, Intersect( Circle(" +
      keys[a] +
      ",guideRadius), tangent" +
      keys[a] +
      ",1)),    Dilate(Rotate(" +
      keys[a] +
      ",270deg, Intersect( Circle(" +
      keys[a] +
      ",guideRadius), tangent" +
      keys[a] +
      ",1)),(3.5xpixel)/guideRadius, Intersect( Circle(" +
      keys[a] +
      ",guideRadius), tangent" +
      keys[a] +
      ",1)),    Dilate(Reflect(" +
      keys[a] +
      ", Intersect( Circle(" +
      keys[a] +
      ",guideRadius), tangent" +
      keys[a] +
      ",1)),(7.25xpixel)/guideRadius,Intersect( Circle(" +
      keys[a] +
      ",guideRadius), tangent" +
      keys[a] +
      ",1))  })     "
  );

  ggbApplet.setLabelVisible(right, false);
  ggbApplet.setLabelVisible(left, false);
  ggbApplet.setColor(right, 0, 0, 0);
  ggbApplet.setColor(left, 0, 0, 0);
  ggbApplet.evalCommand("SetFilling(" + right + ", 1)");
  ggbApplet.evalCommand("SetFilling(" + left + ", 1)");
  ggbApplet.evalCommand("SetConditionToShowObject(" + right + ", " + newBoo + ")");
  ggbApplet.evalCommand("SetConditionToShowObject(" + left + ", " + newBoo + ")");
}

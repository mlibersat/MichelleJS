
Execute({  "xpixel=(x(Corner(3)) - x(Corner(1))) / x(Corner(5)) ",  "circlePointList={}  ",  "circlePathList={}  ",  "guideRadius=18xpixel ","arrowSizeFactor=1.2"})
//adjuse guideRadius and arrow size factor as needed

//////////////replace H with point on path, and bluePath with path name
tangentH=Tangent(H,bluePath)

 rightGuideArrowH=Polygon({    Dilate(Rotate(H,90deg, Intersect( Circle(H,guideRadius), tangentH,2)), arrowSizeFactor(3.5xpixel)/guideRadius, Intersect( Circle(H,guideRadius), tangentH,2)),    Dilate(Rotate(H,270deg, Intersect( Circle(H,guideRadius), tangentH,2)),arrowSizeFactor(3.5xpixel)/guideRadius, Intersect( Circle(H,guideRadius), tangentH,2)),    Dilate(Reflect(H, Intersect( Circle(H,guideRadius), tangentH,2)),arrowSizeFactor(7.25xpixel)/guideRadius,Intersect( Circle(H,guideRadius), tangentH,2))}) 
 
 leftGuideArrowH=c


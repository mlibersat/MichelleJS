Execute({
  "tickMarks=Sequence(Segment((j, 0) + (0, -6ypixel), (j, 0) + (0, 6ypixel)), j, 0, 12)",
  "dragPoints=Sequence((j, 0.5), j, 0, 12, 0.5)",
  "TrianglePoint=Point(dragPoints)",
  "triangleSideLength=1.5",
  "triangleHeight=0.75sqrt(3)",
  "triangle=Polygon({TrianglePoint + (triangleSideLength / 2, 0), TrianglePoint + ((-triangleSideLength) / 2, 0), TrianglePoint + (0, triangleHeight)})",
"SetVisibleInView(dragPoints, 1, false)"
})
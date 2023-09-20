// Constellations - Kim

function ggbOnInit() {
  function calculateShortSegs() {
      ggbApplet.getAllObjectNames("Segment").forEach(function(el) {
          ggbApplet.deleteObject(el);
      });
      ggbApplet.updateConstruction();
      const allDistances = {};
      const allPoints = [];
      for (let i = 1; i < 16; i++) {
          allPoints.push("Point" + i);
      }

      for (let i = 1, L = allPoints.length + 1; i < L; i++) {
          allDistances["Dist" + i] = {};
          let minimumDistance = ggbApplet.getValue(
              "Distance(Point" + i + ",Point" + (i + 1) + ")"
          );
          let shortSegmentCommand =
              "Seg" +
              i +
              (i + 1) +
              "=Segment(Point" +
              i +
              ",Point" +
              (i + 1) +
              ")";
          for (let j = 1, K = allPoints.length + 1; j < K; j++) {
              const currentDist = ggbApplet.getValue(
                  "Distance(Point" + i + ",Point" + j + ")"
              );
              allDistances["Dist" + i]["Dist" + j] = {
                  segmentCommand: "Seg" +
                      i +
                      j +
                      "=Segment(Point" +
                      i +
                      ",Point" +
                      j +
                      ")",
                  currentDistance: currentDist,
                  PointI: "Point" + i,
                  PointJ: "Point" + j,
              };
              if (
                  allDistances["Dist" + i]["Dist" + j].currentDistance <
                  minimumDistance &&
                  allDistances["Dist" + i]["Dist" + j].currentDistance !== 0
              ) {
                  minimumDistance =
                      allDistances["Dist" + i]["Dist" + j].currentDistance;
                  shortSegmentCommand =
                      allDistances["Dist" + i]["Dist" + j].segmentCommand;
              }
              if (j === K - 1) {
                  console.log(shortSegmentCommand);
                  if (shortSegmentCommand !== "" && minimumDistance < 5) {
                      ggbApplet.evalCommand(shortSegmentCommand);
                  }
              }
          }
      }
      console.log(allDistances);
  }
  ggbApplet.registerObjectClickListener("button1", calculateShortSegs);
}

/**
* TODO: Get the distance from one point to all of the points.  If minimum distance, make a segment.
* TODO: Get all of the segments, figure out tolerance, then remove segments based on that difference.
* TODO: Create groups based on those segmented sections.
*/
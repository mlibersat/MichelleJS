javascript: (() => {
  const realURL = window.location.href;
  const id = realURL.replace("https://digital.greatminds.org/lessons/player/lesson/preview?id=", "");
  fetch(`https://digital.greatminds.org/lessons/api/authoring/v2/preview/version/${id}`, {
    headers: {
      authorization: `Basic YXV0aG9yaW5nYWRtaW46WnhDd3RXZmNpNyt0alRLcXJ1eG5kZz09`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      getCompInfo(data);
    });
  function getCompInfo(data) {
    console.log("JSON lesson data:", data);

    let uniqueGGBIDs = [];

    data.slides.forEach((el) => {
      const slideContents = el.contents;
      slideContents.forEach((element) => {
        if (element.type === "geogebra" && !uniqueGGBIDs.includes(element.config.materialId)) {
          uniqueGGBIDs.push(element.config.materialId);
        }
      });
    });
    console.log("uniqueGGBIDs:", uniqueGGBIDs);
  }
})();

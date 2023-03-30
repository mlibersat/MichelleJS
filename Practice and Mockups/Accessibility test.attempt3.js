function ggbOnInit(name, ggbObject) {
  //cycle through point increments
  function cycle() {
    var xmlstring = ggbObject.getXML("A");
    var parser = new DOMParser();
    var xmldom = parser.parseFromString(xmlstring, "application/xml");
    var step = xmldom.getElementsByTagName("animation")[0].getAttribute("step");
    switch (step) {
      case "100":
        xmldom.getElementsByTagName("animation")[0].setAttribute("step", "10");
        break;
      case "10":
        xmldom.getElementsByTagName("animation")[0].setAttribute("step", "1");
        break;
      case "1":
        xmldom.getElementsByTagName("animation")[0].setAttribute("step", "100");
    }
    var serializer = new XMLSerializer();
    xmlstring = serializer.serializeToString(xmldom);
    ggbObject.evalXML(xmlstring);
  }

  //set point increment to refined increment on dragEnd and mouseDown/click sequence
  function set(a) {
    switch (a.type) {
      case "dragEnd":
        var xmlstring = ggbObject.getXML("A");
        var parser = new DOMParser();
        var xmldom = parser.parseFromString(xmlstring, "application/xml");
        var step = xmldom
          .getElementsByTagName("animation")[0]
          .getAttribute("step");
        xmldom.getElementsByTagName("animation")[0].setAttribute("step", "1");
        var serializer = new XMLSerializer();
        xmlstring = serializer.serializeToString(xmldom);
        ggbObject.evalXML(xmlstring);
        break;
      case "mouseDown":
        if (a.hits[0] == "A") {
          var xmlstring = ggbObject.getXML("A");
          var parser = new DOMParser();
          var xmldom = parser.parseFromString(xmlstring, "application/xml");
          var step = xmldom
            .getElementsByTagName("animation")[0]
            .getAttribute("step");
          xmldom
            .getElementsByTagName("animation")[0]
            .setAttribute("step", "10");
          var serializer = new XMLSerializer();
          xmlstring = serializer.serializeToString(xmldom);
          ggbObject.evalXML(xmlstring);
        }
    }
  }

  ggbObject.registerObjectClickListener("A", cycle);
  ggbObject.registerClientListener(set);
}

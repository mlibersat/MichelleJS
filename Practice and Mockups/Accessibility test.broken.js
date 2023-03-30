function ggbOnInit(name, ggbObject) {
  function cycle() {
    var xmlstring = ggbObject.getXML("dragPoint");
    var parser = new DOMParser();
    var xmldom = parser.parseFromString(xmlstring, "application/xml");
    var step = xmldom.getElementsByTagName("animation")[0].getAttribute("step");
    switch (step) {
      case "1":
        xmldom.getElementsByTagName("animation")[0].setAttribute("step", "0.5");
        break;
      case "0.5":
        xmldom.getElementsByTagName("animation")[0].setAttribute("step", "0.1");
        break;
      case "0.1":
        xmldom.getElementsByTagName("animation")[0].setAttribute("step", "1");
    }
    var serializer = new XMLSerializer();
    xmlstring = serializer.serializeToString(xmldom);
    ggbObject.evalXML(xmlstring);
  }

  function set(a) {
    switch (a.type) {
      case "dragEnd":
        var xmlstring = ggbObject.getXML("dragPoint");
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
        if (a.hits[0] == "dragPoint") {
          var xmlstring = ggbObject.getXML("dragPoint");
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
        break;
      case "select":
        if (ggbObject.getObjectType(a.target) == "point") {
          ggbObject.setValue(textVisible, 1);
        }
        break;
      case "deselect":
        ggbObject.setValue(textVisible, 0);
    }
  }

  ggbObject.registerObjectClickListener("dragPoint", cycle);
  ggbObject.registerClientListener(set);
}

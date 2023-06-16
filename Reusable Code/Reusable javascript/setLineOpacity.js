function setLineOpacity(obj, opacity = 1) {
  let xmlstring = ggbObject.getXML(obj);
  const parser = new DOMParser();
  const xmldom = parser.parseFromString(xmlstring, "application/xml");
  const GGBopacity = String(Math.ceil(255 * opacity));
  xmldom.getElementsByTagName("lineStyle")[0].setAttribute("opacity", GGBopacity);
  const serializer = new XMLSerializer();
  xmlstring = serializer.serializeToString(xmldom);
  ggbObject.evalXML(xmlstring);
}

const { ggb1, rte1 } = components;
const readOrder = [rte1, ggb1];
ggb1.instance.registerObjectUpdateListener("time", timeUpdate);
function timeUpdate() {
  const time = ggb1.instance.getValue("tim");
  const coins = ggb1.instance.getValue("coinCount");

  if (time > 0) {
    rte1.updateData({
      text: `<p>Practica clasificar $5$ monedas para comenzar.<br />
           <br />Tiempo: $${time}$ segundos<br />&nbsp;&nbsp;<br />Monedas clasificadas: $${coins}$</p>`,
      //       text: `<p>Practica clasificar $5$ monedas para comenzar.</p>\n
      //       <p></p><p></p><p></p>\n\n
      // <p>Tiempo: $${time}$ segundos</p>\n
      // <p></p><p></p><p></p>\n\n
      // <p>Monedas clasificadas: $${coins}$</p>`,\n
    });
  }

  if (ggb1.instance.getValue("allCorrect")) {
    ggb1.instance.stopAnimation();
    ggb1.instance.setAnimating("time", false);
    const partialString = coins === 1 ? "moneda fue clasificada" : "monedas fueron clasificadas";
    const timeString = time === 1 ? "segundo" : "segundos";
    utils.screenReader.sendMessage(
      "Se ha detenido el tiempo. " + coins + " " + partialString + " correctamente en " + time + " " + timeString + "."
    );
  }
  if (time === ggb1.instance.getValue("maxTime") && !ggb1.instance.getValue("allCorrect")) {
    ggb1.instance.setValue("maxTime", ggb1.instance.getValue("maxTime") + 15);
    ggb1.instance.setAnimating("time", true);
    ggb1.instance.startAnimation();
  }
}

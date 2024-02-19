const { ggb1, rte1 } = components;
const readOrder = [rte1, ggb1];
ggb1.instance.registerObjectUpdateListener("time", timeUpdate);
function timeUpdate() {
  const time = ggb1.instance.getValue("time");
  const coins = ggb1.instance.getValue("coinCount");
  if (time > 0) {
    rte1.updateData({
      text: `<p>¡Clasifica las monedas en $10$ segundos!<br />&nbsp;&nbsp;<br />Tiempo: $${time}$ segundos<br />&nbsp;&nbsp;<br />Monedas clasificadas: $${coins}$</p>`,
      //       text: `¡Clasifica las monedas en $10$ segundos!\n\n
      // Tiempo: $${time}$ segundos\n\n
      // Monedas clasificadas: $${coins}$`,
    });
  }
  if (time === ggb1.instance.getValue("maxTime")) {
    for (let i = 1; i < 13; i++) {
      ggb1.instance.setVisible("Dime" + i, false);
      ggb1.instance.setVisible("Nickel" + i, false);
      ggb1.instance.setVisible("Penny" + i, false);
      ggb1.instance.setVisible("Quarter" + i, false);
    }
    const partialString = coins === 1 ? "moneda fue clasificada" : "monedas fueron clasificadas";
    utils.screenReader.sendMessage("Se ha detenido el tiempo. " + coins + " " + partialString + " correctamente.");
  }
}

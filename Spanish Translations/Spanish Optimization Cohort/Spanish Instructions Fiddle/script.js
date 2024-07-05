function format(key=false) {
  const inputText = document.getElementById('input-text').value;
  const showTabText = document.getElementById('toggle-tab-text').checked;
  const useCustomWidth = document.getElementById('toggle-custom-width').checked;
  const width = key ? 88 :useCustomWidth
    ? document.getElementById('custom-width').value
    : 38;
  const rgx = new RegExp(`(?![^\\n]{1,${width}}$)([^\\n]{1,${width}})\\s`, 'g');
  const wrapText = inputText.replace(rgx, '$1\\\\');
  const tabText = showTabText
    ? '\\\\\\\\Presiona x para reiniciar el ciclo de pestañas.'
    : '';
  const result = key ? `\"${wrapText.replaceAll("\\","\\\\")}"`: `Text(\"\\text{${wrapText} \\\\\\\\Presiona k para " + (If(showKeyboardInstructions, "ocultar", "mostrar"))+" las instrucciones de teclado. ${tabText}}\", (0, 0), false, true)`;
  document.getElementById('output-text').value = result;
}

function handleWidthInput() {
  if (document.getElementById('toggle-custom-width').checked) {
    document.getElementById('custom-width').disabled = false;
  } else {
    document.getElementById('custom-width').disabled = true;
  }
}

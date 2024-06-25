const someText = "Insert text string here.";

someText.replace(/(?![^\n]{1,38}$)([^\n]{1,38})\s/g, "$1\\\\");

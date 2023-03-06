if (localStorage.getItem("buttonClass") === null) {
  localStorage.setItem(
    "buttonClass",
    document
      .getElementsByTagName("button")
      [document.getElementsByTagName("button").length - 1].className.replace(
        "absolute",
        ""
      )
  );
}

if (!checkBtn()) {
  addBtn();
}

function addBtn() {
  //we are in the form div
  let location = document.getElementsByTagName("form");

  if (location !== null && location !== undefined) {
    location = location[0].childNodes[0];

    //creating control panel of the extension, that will have 3 buttons
    let controlPanel = document.createElement("div");
    controlPanel.id = "control_panel";
    controlPanel.style.display = "flex";
    controlPanel.style.gap = "10px";

    //button for recording the question
    let micBtn = document.createElement("button");
    micBtn.innerHTML = "Mic";
    micBtn.className = localStorage.getItem("buttonClass");
    micBtn.id = "mic_btn";
    micBtn.type = "button";
    micBtn.style.width = "33%";

    micBtn.onclick = function () {
      record(location);
    };

    //button for automatically sending the question after speaking
    let autoBtn = document.createElement("button");
    autoBtn.innerHTML = "Auto";
    autoBtn.className = localStorage.getItem("buttonClass");
    autoBtn.id = "auto_btn";
    autoBtn.type = "button";
    autoBtn.style.width = "33%";

    //Button for muting chatGPT from speaking(basically make him skip reading)
    let soundBtn = document.createElement("button");
    soundBtn.innerHTML = "Sound";
    soundBtn.className = localStorage.getItem("buttonClass");
    soundBtn.id = "sound_btn";
    soundBtn.type = "button";
    soundBtn.style.width = "33%";

    controlPanel.appendChild(micBtn);
    controlPanel.appendChild(autoBtn);
    controlPanel.appendChild(soundBtn);

    //appending the control panel in the right place

    location.appendChild(controlPanel);
  }
}
function checkBtn() {
  if (document.getElementById("control_panel") === null) {
    return false;
  }
  return true;
}

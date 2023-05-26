var spokenLanguage = "en-US";
var sendKeyword = "submit question now";

var autoMic = false;

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
//checking and adding menu bar of the extension
if (!checkBtn()) {
  addBtn();
}
//enabling send button
document.getElementsByTagName(
  "textarea"
)[0].parentNode.childNodes[1].disabled = false;

//resizing input box as it does not do it himself
function autoResizeTextarea(textarea) {
  textarea.style.height = textarea.scrollHeight + "px"; // Set the height to match the content
}

function addBtn() {
  //we are in the form div
  let location = document.getElementsByTagName("form");

  if (location !== null && location !== undefined) {
    location = location[0].childNodes[0];

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
      if (!autoMic) {
        record();
        activeMicBtnStyle();
      }
    };

    //button for automatically sending the question after speaking
    let autoBtn = document.createElement("button");
    autoBtn.innerHTML = "Auto";
    autoBtn.className = localStorage.getItem("buttonClass");
    autoBtn.id = "auto_btn";
    autoBtn.type = "button";
    autoBtn.style.width = "33%";
    autoBtn.onclick = function () {
      autoMic = !autoMic;
      if (autoMic) {
        //auto button is activated
        activeAutoBtnStyle();

        record();
      } else {
        resetAutoBtnStyle();
      }
    };

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

    location.appendChild(controlPanel);
  }
}
function checkBtn() {
  if (document.getElementById("control_panel") === null) {
    return false;
  }
  return true;
}

function activeAutoBtnStyle() {
  document.getElementById("auto_btn").style.color = "green";
  document.getElementById("auto_btn").style.border = "1px solid green";
}

function resetAutoBtnStyle() {
  document.getElementById("auto_btn").style.color = "";
  document.getElementById("auto_btn").style.border = "";
}

function activeMicBtnStyle() {
  document.getElementById("mic_btn").style.color = "red";
  document.getElementById("mic_btn").style.border = "1px solid red";
}

function resetMicBtnStyle() {
  speechRecon.stop();
  document.getElementById("mic_btn").style.color = "";
  document.getElementById("mic_btn").style.border = "";
}

function record() {
  speechRecon = new webkitSpeechRecognition();
  speechRecon.continuous = true;
  speechRecon.lang = spokenLanguage;
  speechRecon.start();
  speechRecon.onstart = () => {
    activeMicBtnStyle();
  };

  speechRecon.onresult = (e) => {
    let msg = "";
    for (let i = e.resultIndex; i < e.results.length; ++i) {
      if (e.results[i].isFinal) msg += e.results[i][0].transcript;
    }
    speechRecon.stop();

    let sendSplit = sendKeyword.split(" ");
    let msgSplit = msg.split(" ");
    // the send keyword has been said
    let send = false;
    //variable that will keep the index of the last word before the send keyword
    //used for getting rid of the part after the sendind keyword
    let sendIndex = msgSplit.length;

    for (k = 0; k < msgSplit.length - sendSplit.length + 1; k += 1) {
      let keywordSeen = false;
      msgSplit.slice(k, k + sendSplit.length).forEach((element, index) => {
        if (element !== sendSplit[index]) {
          keywordSeen = false;
          return;
        }
        keywordSeen = true;
      });
      if (keywordSeen) {
        send = true;
        sendIndex = k;
      }
    }
    msgSplit = msgSplit.splice(0, sendIndex);
    msg = msgSplit.join(" ");
    //insert the message in the question box
    let textBox = document.getElementById("prompt-textarea");
    document.getElementById("prompt-textarea").value =
      textBox.value + " " + msg;
    autoResizeTextarea(textBox);

    if (send) {
      document
        .getElementsByTagName("textarea")[0]
        .parentNode.childNodes[1].click();

      // .click();
    }
  };

  speechRecon.onend = () => {
    if (autoMic) {
      speechRecon.start();
    } else {
      resetMicBtnStyle();
    }
  };
}

function speak(text) {
  let msg = new SpeechSynthesisUtterance(text);
  msg.rate = 1;
  msg.pitch = 1;
  window.speechSynthesis.speak(msg);
}

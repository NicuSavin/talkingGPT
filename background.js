try {
  //Page change
  chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    chrome.scripting.executeScript({
      files: ["contentScript.js"],
      target: { tabId: tab.id },
    });
  });
} catch (e) {
  console.log(e);
}

// Get the button model
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

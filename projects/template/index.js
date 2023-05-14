function ready(fn) {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}

ready(function () {
  // do something
  const elem = document.getElementById("js-target");
  elem.innerHTML = "Javascript Works!";
});

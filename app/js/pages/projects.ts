import "../shared/imgReady";
import { ready } from "../shared/ready";

/**
 * Sets placeholders for projects
 */
function setPlaceholders(): void {
  //count the number of projects
  const projects = document.querySelectorAll(".project-pill-box").length;

  //get the current screen width
  const screenWidth = window.innerWidth;
  const fitCount = Math.floor(screenWidth / 570);

  //get number of placeholders needed
  const placeholders = fitCount - (projects % fitCount);

  const placeholder1 = document.getElementById(
    "placeholder-1"
  ) as HTMLDivElement;
  const placeholder2 = document.getElementById(
    "placeholder-2"
  ) as HTMLDivElement;

  if (placeholders === fitCount) {
    placeholder1.style.display = "none";
    placeholder2.style.display = "none";
    return;
  } else if (placeholders == 1) {
    placeholder1.style.display = "block";
    placeholder2.style.display = "none";
  } else if (placeholders == 2) {
    placeholder1.style.display = "block";
    placeholder2.style.display = "block";
  }
}

ready(() => {
  setPlaceholders();

  //listen for window resize
  window.addEventListener("resize", setPlaceholders);
});

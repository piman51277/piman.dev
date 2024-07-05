import { CubeManip, Direction, Face } from "../modules/cube/CubeManip";
import { ready } from "../shared/ready";

ready(() => {
  const hostBox = document.getElementById("cube-box") as HTMLDivElement;
  const rotator = document.getElementById("cube-rotator") as HTMLDivElement;

  const snapCheckbox = document.getElementById(
    "cube-control-snap"
  ) as HTMLInputElement;
  const lockCheckbox = document.getElementById(
    "cube-control-lock"
  ) as HTMLInputElement;
  const homeButton = document.getElementById(
    "cube-control-home"
  ) as HTMLButtonElement;

  const directionUp = document.getElementById(
    "cube-control-up"
  ) as HTMLButtonElement;
  const directionDown = document.getElementById(
    "cube-control-down"
  ) as HTMLButtonElement;
  const directionLeft = document.getElementById(
    "cube-control-left"
  ) as HTMLButtonElement;
  const directionRight = document.getElementById(
    "cube-control-right"
  ) as HTMLButtonElement;

  const manip = new CubeManip(hostBox, rotator, {
    //this should be on by default, but autofill can override
    autoSnap: snapCheckbox.checked,
  });

  snapCheckbox.addEventListener("change", () => {
    manip.setAutoSnap(snapCheckbox.checked);
  });

  lockCheckbox.addEventListener("change", () => {
    manip.setPositionLock(lockCheckbox.checked);
  });

  homeButton.addEventListener("click", () => {
    manip.seekHome();
  });

  directionUp.addEventListener("click", () => {
    manip.seekDirection(Direction.UP);
  });

  directionDown.addEventListener("click", () => {
    manip.seekDirection(Direction.DOWN);
  });

  directionLeft.addEventListener("click", () => {
    manip.seekDirection(Direction.LEFT);
  });

  directionRight.addEventListener("click", () => {
    manip.seekDirection(Direction.RIGHT);
  });
});

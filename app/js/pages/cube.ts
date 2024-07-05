import { CubeManip, Face } from "../modules/cube/CubeManip";
import { ready } from "../shared/ready";

const idPairs = [
  ["seek-front", "front"],
  ["seek-back", "back"],
  ["seek-left", "left"],
  ["seek-right", "right"],
  ["seek-top", "top"],
  ["seek-bottom", "bottom"],
];

ready(() => {
  const hostBox = document.getElementById("cube-box") as HTMLDivElement;
  const rotator = document.getElementById("cube-rotator") as HTMLDivElement;

  const manip = new CubeManip(hostBox, rotator);

  const seekHomeBtn = document.getElementById("seek-home") as HTMLButtonElement;
  seekHomeBtn.addEventListener("click", () => manip.seekHome());

  const toggleLockBtn = document.getElementById(
    "toggle-lock"
  ) as HTMLButtonElement;
  toggleLockBtn.addEventListener("click", () => manip.togglePositionLock());

  const toggleSnapBtn = document.getElementById(
    "toggle-snap"
  ) as HTMLButtonElement;
  toggleSnapBtn.addEventListener("click", () => manip.toggleAutoSnap());

  //bind seek buttons
  idPairs.forEach(([id, face]) => {
    const btn = document.getElementById(id) as HTMLButtonElement;
    btn.addEventListener("click", () => manip.seekFace(face as Face));
  });
});

import { CubeManip, Direction } from "../modules/cube/CubeManip";
import { Game } from "../modules/snek/Game";
import { RendererLight } from "../modules/snek/RenderLight";
import { ready } from "../shared/ready";

const blacklistedEvents = ["mousedown", "mouseup"];
const blockProp = (e: Event): void => {
  e.stopPropagation();
};

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

  //bind panel control buttons
  snapCheckbox.addEventListener("change", () => {
    manip.setAutoSnap(snapCheckbox.checked);
  });

  lockCheckbox.addEventListener("change", () => {
    manip.setPositionLock(lockCheckbox.checked);
  });

  homeButton.addEventListener("click", () => {
    manip.seekHome();
  });

  //bind direction buttons
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

  //override mouse events so the drag functionality
  //doesn't interfere with thier operations
  const inputs = [
    snapCheckbox,
    lockCheckbox,
    homeButton,
    directionUp,
    directionDown,
    directionLeft,
    directionRight,
  ];

  for (const event of blacklistedEvents) {
    for (const input of inputs) {
      input.addEventListener(event, blockProp);
    }
  }

  const screen = new RendererLight(
    document.getElementById("cube-canvas-snek") as HTMLCanvasElement
  );

  const game = new Game();

  /**
   * helper ticker
   */
  function tick(): void {
    game.nextTick();
    if (game.game_over) {
      game.reset();
    }

    screen.drawSnek(game.snek.x);
    screen.drawFood(game.food);
  }

  setInterval(tick, 20);
});

export interface ICubeManipOptions {
  lockPosition?: boolean;
  autoSnap?: boolean;
}

interface IDragVars {
  mouseDown: boolean;
  lastX: number;
  lastY: number;
  angleX: number;
  angleY: number;
  angleXChkp: number; //checkpoint
  angleYChkp: number;
}

interface FaceEntry {
  angle: [number, number];
  normal: [number, number, number];
}

export type Face = "front" | "back" | "left" | "right" | "top" | "bottom";

//this controls offset for snapping
const slew = -15;

/**
 * Table of faces and their respective angles and normals
 */
const faces: Record<Face, FaceEntry> = {
  front: {
    angle: [0 + slew, 0 + slew],
    normal: [0, 0, -1],
  },
  back: {
    angle: [0 + slew, 180 + slew],
    normal: [0, 0, 1],
  },
  left: {
    angle: [0 + slew, 90 + slew],
    normal: [-1, 0, 0],
  },
  right: {
    angle: [0 + slew, 270 + slew],
    normal: [1, 0, 0],
  },
  top: {
    angle: [270, 0],
    normal: [0, -1, 0],
  },
  bottom: {
    angle: [90, 0],
    normal: [0, 1, 0],
  },
};

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

/**
 * Table of directional face transfers
 */
const faceTransfers: Record<Face, Record<Direction, Face>> = {
  front: {
    [Direction.UP]: "top",
    [Direction.DOWN]: "bottom",
    [Direction.LEFT]: "left",
    [Direction.RIGHT]: "right",
  },
  back: {
    [Direction.UP]: "top",
    [Direction.DOWN]: "bottom",
    [Direction.LEFT]: "right",
    [Direction.RIGHT]: "left",
  },
  left: {
    [Direction.UP]: "top",
    [Direction.DOWN]: "bottom",
    [Direction.LEFT]: "back",
    [Direction.RIGHT]: "front",
  },
  right: {
    [Direction.UP]: "top",
    [Direction.DOWN]: "bottom",
    [Direction.LEFT]: "front",
    [Direction.RIGHT]: "back",
  },
  top: {
    [Direction.UP]: "back",
    [Direction.DOWN]: "front",
    [Direction.LEFT]: "left",
    [Direction.RIGHT]: "right",
  },
  bottom: {
    [Direction.UP]: "front",
    [Direction.DOWN]: "back",
    [Direction.LEFT]: "left",
    [Direction.RIGHT]: "right",
  },
};

const transitionString = `transform 0.5s ease-in-out`;

//dot product. (no safeguards!)
const dot = (a: number[], b: number[]): number =>
  a.reduce((acc, cur, i) => acc + cur * b[i], 0);

export class CubeManip {
  private host: HTMLDivElement;
  private rotator: HTMLDivElement;

  private options: Required<ICubeManipOptions>;
  private drag: IDragVars;

  constructor(
    host: HTMLDivElement,
    rotator: HTMLDivElement,
    options: ICubeManipOptions = {}
  ) {
    this.host = host;
    this.rotator = rotator;
    this.options = {
      lockPosition: false,
      autoSnap: false,
      ...options,
    };
    this.drag = {
      mouseDown: false,
      lastX: 0,
      lastY: 0,
      angleX: 0,
      angleY: 0,
      angleXChkp: -15,
      angleYChkp: -15,
    };

    this.init();
  }

  /**
   * Binds all relevant handlers
   */
  private init(): void {
    this.host.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
    document.addEventListener("mousemove", this.onMouseMove.bind(this));
  }

  private onMouseDown(e: MouseEvent): void {
    if (this.options.lockPosition) return;

    this.drag.mouseDown = true;
    this.drag.lastX = e.clientX;
    this.drag.lastY = e.clientY;
    this.drag.angleX = 0;
    this.drag.angleY = 0;

    this.rotator!.style.transition = ``;
  }

  private onMouseUp(): void {
    if (!this.drag.mouseDown) return;

    this.drag.mouseDown = false;
    this.drag.angleXChkp = this.drag.angleXChkp + this.drag.angleX;
    this.drag.angleYChkp = this.drag.angleYChkp + this.drag.angleY;

    if (this.options.autoSnap) {
      //fix a bug where cube would snap to wrong face if clicked
      if (Math.abs(this.drag.angleX) < 5 && Math.abs(this.drag.angleY) < 5) {
        return;
      }

      this.rotator!.style.transition = transitionString;
      this.doSnap();
    }
  }

  private onMouseMove(e: MouseEvent): void {
    if (!this.drag.mouseDown) return;

    const x = e.clientX;
    const y = e.clientY;
    const diffX = x - this.drag.lastX;
    const diffY = -(y - this.drag.lastY);
    this.drag.angleX = diffX * 0.5;
    this.drag.angleY = diffY * 0.5;
    const newX = this.drag.angleXChkp + this.drag.angleX;
    const newY = this.drag.angleYChkp + this.drag.angleY;

    this.rotator!.style.transform = `rotateX(${newY}deg) rotateY(${newX}deg)`;
  }

  private getNearestFace(): Face {
    const y = this.drag.angleXChkp;
    const x = this.drag.angleYChkp;

    //converts degrees to radians
    const toRad = (deg: number): number => (deg * Math.PI) / 180;

    const xS = Math.sin(toRad(x)); //sin(x)
    const xC = Math.cos(toRad(x)); //cos(x)
    const yS = Math.sin(toRad(y)); //sin(y)
    const yC = Math.cos(toRad(y)); //cos(y)

    const vec = [-xC * yS, xS, -xC * yC];

    let maxDot = -Infinity;
    let minFace = "";

    for (const [face, { normal }] of Object.entries(faces)) {
      const d = dot(vec, normal);
      if (d > maxDot) {
        maxDot = d;
        minFace = face;
      }
    }

    return minFace as Face;
  }

  private doSnap(): void {
    //this can't be done while dragging
    if (this.drag.mouseDown) return;

    const minFace = this.getNearestFace();

    if (minFace) {
      const entry: FaceEntry = faces[minFace];

      this.rotateTo(...entry.angle);
    }
  }

  /**
   * Normalizes the cube's rotation
   * @returns {boolean} true if the cube was normalized
   */
  private normalize(): boolean {
    const norm = (n: number): number => {
      if (n > 200) return n - 360;
      if (n < -200) return n + 360;
      return n;
    };

    const y = norm(this.drag.angleXChkp);
    const x = norm(this.drag.angleYChkp);

    const didNormalize =
      y !== this.drag.angleXChkp || x !== this.drag.angleYChkp;

    this.drag.angleXChkp = y;
    this.drag.angleYChkp = x;
    this.rotator!.style.transition = ``;
    this.rotator!.style.transform = `rotateX(${x}deg) rotateY(${y}deg)`;

    return didNormalize;
  }

  /**
   * Rotates the cube to the specified angle
   * @param {number} xTarg target x angle
   * @param {number} yTarg target y angle
   * @param {boolean} minimal if true, will rotate to the nearest equivalent angle
   */
  private async rotateTo(
    xTarg: number,
    yTarg: number,
    minimal = true
  ): Promise<void> {
    this.rotator!.style.transition = transitionString;
    if (!minimal) {
      this.drag.angleXChkp = yTarg;
      this.drag.angleYChkp = xTarg;
      this.rotator!.style.transition = transitionString;
      this.rotator!.style.transform = `rotateX(${xTarg}deg) rotateY(${yTarg}deg)`;
      return;
    }

    const didNormalize = this.normalize();
    if (didNormalize) {
      //insert a tiny delay so the event loop clears
      //and the instant rotation doesn't get overridden
      await new Promise((res) => {
        setTimeout(() => {
          res(null);
        }, 10);
      });
    }

    //get nearest equivalent angle
    const nearestAng = (n: number, target: number): number => {
      if (n % 360 === target) return n;
      const offset = Math.floor(n / 360) * 360;
      const candidates = [
        target + offset,
        target + 360 + offset,
        target - 360 + offset,
      ];
      return candidates.reduce(
        (acc, cur) => (Math.abs(n - cur) < Math.abs(n - acc) ? cur : acc),
        3600
      );
    };

    const y = this.drag.angleXChkp;
    const x = this.drag.angleYChkp;
    const nearestX = nearestAng(x, xTarg);
    const nearestY = nearestAng(y, yTarg);
    this.drag.angleXChkp = nearestY;
    this.drag.angleYChkp = nearestX;
    this.rotator!.style.transition = transitionString;
    this.rotator!.style.transform = `rotateX(${nearestX}deg) rotateY(${nearestY}deg)`;
  }

  /**
   * Moves in a direction
   * @param {Direction} direction direction to move in
   */
  public seekDirection(direction: Direction): void {
    const face = this.getNearestFace();
    const newFace = faceTransfers[face][direction];
    this.seekFace(newFace);
  }

  /**
   * Rotates the cube to the front face
   */
  public seekHome(): void {
    //it's okay if this spins quite a lot, it's fun!
    this.rotateTo(-15, -15, false);
  }

  /**
   * Seeks a specific face
   * @param {Face} face the face to seek
   */
  public seekFace(face: Face): void {
    const { angle } = faces[face];
    this.rotateTo(...angle);
  }

  /**
   * Sets the cube's position lock
   * @param {boolean} value the new value
   */
  public setPositionLock(value: boolean): void {
    this.options.lockPosition = value;
  }

  /**
   * Toggles the cube's position lock
   */
  public togglePositionLock(): void {
    this.options.lockPosition = !this.options.lockPosition;
  }

  /**
   * Sets the cube's auto snap
   * @param {boolean} value the new value
   */
  public setAutoSnap(value: boolean): void {
    this.options.autoSnap = value;
    if (this.options.autoSnap) {
      this.doSnap();
    }
  }

  /**
   * Toggles the cube's auto snap
   */
  public toggleAutoSnap(): void {
    this.setAutoSnap(!this.options.autoSnap);
  }
}

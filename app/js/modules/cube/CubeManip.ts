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

const faces: Record<Face, FaceEntry> = {
  front: {
    angle: [0, 0],
    normal: [0, 0, -1],
  },
  back: {
    angle: [0, 180],
    normal: [0, 0, 1],
  },
  left: {
    angle: [0, 90],
    normal: [-1, 0, 0],
  },
  right: {
    angle: [0, 270],
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

//normalizes an angle % 360  to [0,360)
const norm = (n: number): number => (n < 0 ? n + 360 : n);

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
      angleXChkp: 0,
      angleYChkp: 0,
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
    this.drag.angleXChkp = norm(
      (this.drag.angleXChkp + this.drag.angleX) % 360
    );
    this.drag.angleYChkp = norm(
      (this.drag.angleYChkp + this.drag.angleY) % 360
    );

    this.rotator!.style.transition = `transform 0.5s ease-in-out`;

    if (this.options.autoSnap) {
      //fix a bug where cube would snap to wrong face if clicked
      if (Math.abs(this.drag.angleX) < 5 && Math.abs(this.drag.angleY) < 5) {
        return;
      }

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
    const newX = norm((this.drag.angleXChkp + this.drag.angleX) % 360);
    const newY = norm((this.drag.angleYChkp + this.drag.angleY) % 360);

    this.rotator!.style.transform = `rotateX(${newY}deg) rotateY(${newX}deg)`;
  }

  private getNearestFace(): Face {
    const y = this.drag.angleXChkp % 360;
    const x = this.drag.angleYChkp % 360;

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
   * Rotates the cube to the specified angle
   * @param {number} xTarg target x angle
   * @param {number} yTarg target y angle
   * @param {boolean} minimal if true, will rotate to the nearest equivalent angle
   */
  private rotateTo(xTarg: number, yTarg: number, minimal = true): void {
    this.rotator!.style.transition = `transform 0.5s ease-in-out`;
    if (!minimal) {
      this.drag.angleXChkp = yTarg;
      this.drag.angleYChkp = xTarg;
      this.rotator!.style.transform = `rotateX(${xTarg}deg) rotateY(${yTarg}deg)`;
      return;
    }

    //get nearest equivalent angle
    const nearestAng = (n: number, target: number): number => {
      if (n % 360 === target) return n;
      const candidates = [target, target + 360, target - 360];
      return candidates.reduce(
        (acc, cur) => (Math.abs(n - cur) < Math.abs(n - acc) ? cur : acc),
        3600
      );
    };

    const y = this.drag.angleXChkp % 360;
    const x = this.drag.angleYChkp % 360;
    const nearestX = nearestAng(x, xTarg);
    const nearestY = nearestAng(y, yTarg);
    this.drag.angleXChkp = nearestY;
    this.drag.angleYChkp = nearestX;
    this.rotator!.style.transform = `rotateX(${nearestX}deg) rotateY(${nearestY}deg)`;
  }

  /**
   * Rotates the cube to the front face
   */
  public seekHome(): void {
    //it's okay if this spins quite a lot, it's fun!
    this.rotateTo(-10, -20, false);
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
   * Locks the cube's position
   */
  public lockPosition(): void {
    this.options.lockPosition = true;
  }

  /**
   * Unlocks the cube's position
   */
  public unlockPosition(): void {
    this.options.lockPosition = false;
  }

  /**
   * Toggles the cube's position lock
   */
  public togglePositionLock(): void {
    this.options.lockPosition = !this.options.lockPosition;
  }

  /**
   * Enables the cube's auto snap
   */
  public enableAutoSnap(): void {
    this.options.autoSnap = true;
    this.doSnap();
  }

  /**
   * Disables the cube's auto snap
   */
  public disableAutoSnap(): void {
    this.options.autoSnap = false;
  }

  /**
   * Toggles the cube's auto snap
   */
  public toggleAutoSnap(): void {
    this.options.autoSnap = !this.options.autoSnap;
    if (this.options.autoSnap) {
      this.doSnap();
    }
  }
}

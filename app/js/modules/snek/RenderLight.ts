// lighter version designed to work without a background image
export class RendererLight {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    canvas.width = 184;
    canvas.height = 184;
    this.ctx = canvas.getContext("2d")!;
  }

  public drawSnek(snek: number[]): void {
    this.drawBackground();
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";

    //set the stroke width
    this.ctx.lineWidth = 8;

    //handy constants
    const thickness = 8;
    const cellSize = 23;
    const cellOffset = 11;

    //special case for length 1
    if (snek.length === 1) {
      const x1 = (snek[0] % 8) * cellSize + cellOffset;
      const y1 = Math.floor(snek[0] / 8) * cellSize + cellOffset;

      this.ctx.fillRect(
        x1 - thickness / 2,
        y1 - thickness / 2,
        thickness,
        thickness
      );
    } else {
      //draw lines
      this.ctx.beginPath();

      //initial point
      const x0 = (snek[0] % 8) * cellSize + cellOffset;
      const y0 = Math.floor(snek[0] / 8) * cellSize + cellOffset;
      this.ctx.moveTo(x0, y0);

      for (let i = 1; i < snek.length; i++) {
        const x1 = (snek[i] % 8) * cellSize + cellOffset;
        const y1 = Math.floor(snek[i] / 8) * cellSize + cellOffset;

        this.ctx.lineTo(x1, y1);
      }
      this.ctx.stroke();
    }
  }

  private drawBackground(): void {
    this.ctx.fillStyle = "#59729b";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.strokeStyle = "#d9dcd6";
  }

  public drawFood(food: number): void {
    this.ctx.fillStyle = "red";

    const cellSize = 23;
    const cellOffset = 11;

    const x = (food % 8) * cellSize + cellOffset;
    const y = Math.floor(food / 8) * cellSize + cellOffset;

    this.ctx.fillRect(x - 4, y - 4, 8, 8);
  }
}

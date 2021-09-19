//points: [[x,y],[x,y],[x,y]...]
class Graph {
    constructor(x, y, width, height, points, options = {}) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.points = points;

        //calculate bounds
        this.x_max = options.x_max || Math.max(...this.points.map(p => p[0]));
        this.x_min = options.x_min || Math.min(...this.points.map(p => p[0]));

        this.y_max = options.y_max || Math.max(...this.points.map(p => p[1]));
        this.y_min = options.y_min || Math.min(...this.points.map(p => p[1]));

        //calculate scaling
        this.x_scale = options.x_scale || this.width / (this.x_max - this.x_min);
        this.y_scale = options.y_scale || this.height / (this.y_max - this.y_min);

        //stores progress of the animation
        this.progress = 0;
        this.done = false;

        //where we should draw axes
        this.drawAxes = options.drawAxes || false;
    }
    //compute the real coordinates on the graph
    getRealCoords(x, y) {
        const real_x = (x - this.x_min) * this.x_scale + this.x;
        const real_y = this.height - (y - this.y_min) * this.y_scale + this.y;

        return [real_x, real_y];
    }
    //sees if the coordinates are inside the graph
    isInside(x, y) {
        const [real_x, real_y] = this.getRealCoords(x, y);
        return real_x > this.x && real_x < this.x + this.width && real_y > this.y && real_y < this.y + this.height;
    }
    draw(limit, drawDot = false) {

        //draw the background
        ctx.fillStyle = '#303030';
        ctx.fillRect(this.x - 3, this.y - 3, this.width + 6, this.height + 6);

        //draw the axes
        ctx.strokeStyle = 'rgb(155,155,155,1)';
        ctx.lineWidth = 4;
        const [x_axis, y_axis] = this.getRealCoords(0, 0);

        if (this.drawAxes) {

            //if x_axis is inside the graph, draw the x-axis
            if (this.x < x_axis && x_axis < this.x + this.width) {
                ctx.beginPath();
                ctx.moveTo(x_axis, this.y);
                ctx.lineTo(x_axis, this.y + this.height);
                ctx.stroke();
            }

            //if y_axis is inside the graph, draw the y-axis
            if (this.y < y_axis && y_axis < this.y + this.height) {
                ctx.beginPath();
                ctx.moveTo(this.x, y_axis);
                ctx.lineTo(this.x + this.width, y_axis);
                ctx.stroke();
            }

        }

        //draw the graph
        ctx.strokeStyle = 'rgb(255,255,255,1)';
        ctx.lineWidth = 1;

        let firstPointPlaced = false;
        ctx.beginPath();
        for (let index = 0; index < limit; index++) {
            const [x, y] = this.getRealCoords(...this.points[index]);
            if (this.isInside(...this.points[index])) {
                if (!firstPointPlaced) {
                    ctx.moveTo(x, y);
                    firstPointPlaced = true;
                } {
                    ctx.lineTo(x, y);
                }
            }
        }
        ctx.stroke();

        //draw a red dot at the latest point
        if (drawDot) {
            const [x, y] = this.getRealCoords(...this.points[limit]);
            ctx.fillStyle = 'rgb(255,0,0,1)';
            ctx.fillRect(x - 3, y - 3, 6, 6);
        }
    }
    //displays all of the graph points
    display() {
        this.draw(this.points.length);
    }
    //steps forwards the animation
    step() {
        if (this.progress >= this.points.length) {
            this.done = true;
            return true;
        }

        this.draw(this.progress, true);

        this.progress++;
        return false;
    }
}
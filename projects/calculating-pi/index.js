//monte carlo
class MonteCarlo {
    constructor(canvasId,statsId,piOutputId) {
        const canvas = document.getElementById(canvasId.replace('#', ''));
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.delay = 0;
        this.pointCount = 0;
        this.totals = {
            inside: 0,
            outside: 0
        };
        this.statsId=statsId;
        this.piOutputId=piOutputId;
    }
    setDelay(delay) {
        this.delay = delay;
    }
    setPointCount(n) {
        this.pointCount = n;
    }
    draw() {

        //get points
        const points = this.getPoints(this.pointCount);

        //set a black background
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        //draw a white circle
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.width / 2, this.height / 2, this.width / 2, 0, 2 * Math.PI);
        this.ctx.fill();

        //for every point, draw a red dot
        this.ctx.fillStyle = '#f00';
        for (const point of points) {
            const [x, y] = point;
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1, 0, 2 * Math.PI);
            this.ctx.fill();
        }
    }
    getPoints(n) {
        const points = [];
        for (let i = 0; i < n; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            points.push([x, y]);

            //compute whether the point is inside or outside the circle
            const distance = Math.sqrt(Math.pow(x - this.width / 2, 2) + Math.pow(y - this.height / 2, 2));
            if (distance < this.width / 2) {
                this.totals.inside++;
            } else {
                this.totals.outside++;
            }
        }
        return points;
    }
    run() {
        window.requestAnimationFrame(() => {
            this.draw();
            $(this.statsId).text(`n' = ${this.totals.inside} n = ${(this.totals.outside + this.totals.inside)}`);
            $(this.piOutputId).text(`π ≈ ${(this.totals.inside / (this.totals.outside + this.totals.inside)) * 4}`);
            setTimeout(() => {
                this.run();
            }, this.delay);
        });
    }

}

//wait for everything to load
$(document).ready(function() {
    const monteCarloSim = new MonteCarlo("#montecarlo","#montecarlo-stats","#montecarlo-output");
    monteCarloSim.setDelay(1000);
    monteCarloSim.setPointCount(1000);
    monteCarloSim.run();

});
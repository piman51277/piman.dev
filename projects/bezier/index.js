let canvas;
let ctx;

$(document).ready(() => {
    canvas = document.getElementById('display');
    ctx = canvas.getContext('2d');
    canvas.width = 660;
    canvas.height = 500;

    runSimulation([[400,0],[0,200],[300,0],[200,0]],true)

    $("#startSim").click(()=>{
        $("#startSim").prop('disabled', true);
        const controlPoints = [
            [parseFloat($("#px0").val()), parseFloat($("#py0").val())],
            [parseFloat($("#px1").val()), parseFloat($("#py1").val())],
            [parseFloat($("#px2").val()), parseFloat($("#py2").val())],
            [parseFloat($("#px3").val()), parseFloat($("#py3").val())],
        ]
        runSimulation(controlPoints).then(()=>{
            $("#startSim").prop('disabled', false);
        })
    })

})

async function runSimulation(controlPoints,instant=false){

    const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = controlPoints;

    const data = BezierCurve.cubic(x0, y0, x1, y1, x2, y2, x3, y3, 200);

    const data_prime = BezierCurve.cubic_prime(x0, y0, x1, y1, x2, y2, x3, y3, 200);

    //generate data for x-plot
    const xData = data.map((point, i) => [i, point[0]]);

    //generate data for y-plot
    const yData = data.map((point, i) => [i, point[1]]);

    //generate data for x-prime-plot
    const xPrimeData = data_prime.map((point, i) => [i, point[0]]);

    //generate data for y-prime-plot
    const yPrimeData = data_prime.map((point, i) => [i, point[1]]);

    //labels
    ctx.fillStyle = '#000';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';

    //create x-plot
    ctx.fillText('x', 120, 15);
    const xPlot = new Graph(20, 20, 200, 100, xData);

    //create y-plot
    ctx.fillText('y', 120, 135);

    const yPlot = new Graph(20, 140, 200, 100, yData);

    //create plot of bezier curve
    ctx.fillText('Bezier Curve', 440, 15);
    const bezierPlot = new Graph(240, 20, 400, 220, data);

    //create plot of x-prime
    ctx.fillText('x\'', 120, 255);
    const xPrimePlot = new Graph(20, 260, 200, 100, xPrimeData,{drawAxes: true});

    //create plot of y-prime
    ctx.fillText('y\'', 120, 375);
    const yPrimePlot = new Graph(20, 380, 200, 100, yPrimeData,{drawAxes: true});

    //create plot of derivative
    ctx.fillText('Derivative', 440, 255);
    const tangentLine = new Graph(240, 260, 400, 220, data_prime,{drawAxes: true});


    const step = ()=>{
        xPlot.step()
        yPlot.step()
        bezierPlot.step()
        xPrimePlot.step()
        yPrimePlot.step()
        tangentLine.step()
    }

    const display = ()=>{
        xPlot.display()
        yPlot.display()
        bezierPlot.display()
        xPrimePlot.display()
        yPrimePlot.display()
        tangentLine.display()
    }
    
    if(instant){
        display();
        return;
    }

    return new Promise((resolve)=>{
        const animationInterval = setInterval(() => {
            step();
            if(xPlot.done && yPlot.done && bezierPlot.done && xPrimePlot.done && yPrimePlot.done && tangentLine.done){
                clearInterval(animationInterval);
                display();
                resolve();
            }
        }, 25);
    })
}
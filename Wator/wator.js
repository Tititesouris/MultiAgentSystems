window.onload = function () {
    let parameters = activeParameters;
    let viewer = new RectangleGridViewer(document.getElementById("canvas").getContext("2d"));
    let logger = new CSVLogger("wator.csv", ";", 2000);
    //let logger = new ConsoleLogger();

    let plotCanvas = document.getElementById("plots").getContext("2d");

    let plotsParams = {
        pyramid: {
            x: 0,
            y: 0,
            width: plotCanvas.canvas.width,
            height: Math.floor(plotCanvas.canvas.height / 2),
            colors: {
                background: "#ffffff",
                left: parameters.wator.colors.fish,
                right: parameters.wator.colors.shark,
                text: "#000000",
            },
        },
        growth: {
            x: 0,
            y: Math.floor(plotCanvas.canvas.height / 2),
            width: plotCanvas.canvas.width,
            height: Math.floor(plotCanvas.canvas.height / 2),
            colors: {
                background: "#ffffff",
                lines: [parameters.wator.colors.fish, parameters.wator.colors.shark],
                text: "#000000",
                helperLines: "#dddddd"
            },
        },
    };

    let plotter = new PopulationPlotter(plotCanvas, [WatorFishAgent, WatorSharkAgent], plotsParams);
    let system = new WatorMultiAgentSystem(parameters, viewer, document, logger, plotter);
    system.run();
};
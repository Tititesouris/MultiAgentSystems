window.onload = function () {
    let parameters = activeParameters;

    let viewer = new RectangleGridViewer(document.getElementById("canvas").getContext("2d"));
    let logger = new ConsoleLogger();
    let plotter = new Plotter();
    let system = new PacmanMultiAgentSystem(parameters, viewer, document, logger, plotter);
    system.run();
};

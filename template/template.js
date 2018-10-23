window.onload = function () {
    let parameters = activeParameters;
    let viewer = new RectangleGridViewer(document.getElementById("canvas").getContext("2d"));
    let logger = new ConsoleLogger();
    let plotter = new Plotter(document.getElementById("plot").getContext("2d"));
    let system = new TemplateMultiAgentSystem(parameters, viewer, document, logger, plotter);
    system.run();
};

window.onload = function () {
    let parameters = activeParameters;
    let viewer = new RectangleGridViewer(document.getElementById("canvas").getContext("2d"));
    //let logger = new CSVLogger("particles.csv", ";", 1000);
    let logger = new ConsoleLogger();
    let plotter = new Plotter();
    let system = new ParticlesMultiAgentSystem(parameters, viewer, document, logger, plotter);
    system.run();
};

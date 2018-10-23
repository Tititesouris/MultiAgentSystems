class Plotter {
    constructor(view) {
        this.view = view;
    }

    plot(agents) {
    }

}

class PopulationPlotter extends Plotter {
    constructor(view, populations, parameters) {
        super(view);
        this.populations = populations;
        this.populationPyramidPlot = new PopulationPyramidPlot(this.view, parameters.pyramid.x, parameters.pyramid.y, parameters.pyramid.width, parameters.pyramid.height, {
            background: parameters.pyramid.colors.background,
            left: parameters.pyramid.colors.left,
            right: parameters.pyramid.colors.right,
            text: parameters.pyramid.colors.text,
        });

        this.populationGrowthPlot = new PopulationGrowthPlot(this.view, parameters.growth.x, parameters.growth.y, parameters.growth.width, parameters.growth.height, {
            background: parameters.growth.colors.background,
            lines: parameters.growth.colors.lines,
            text: parameters.growth.colors.text,
            helperLines: parameters.growth.colors.helperLines
        }, false);
    }

    plot(agents) {
        super.plot(agents);
        this.populationPyramidPlot.update(agents, this.populations);
        this.populationPyramidPlot.draw();
        this.populationGrowthPlot.update(agents, this.populations);
        this.populationGrowthPlot.draw();
    }
}
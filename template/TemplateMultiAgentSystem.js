class TemplateMultiAgentSystem extends MultiAgentSystem {
    constructor(parameters, viewer, input, logger, plotter) {
        super(parameters, viewer, input, logger, plotter);
    }

    checkSaneParameters() {
        return super.checkSaneParameters() && this.parameters.template.nbAgents > 0;
    }

    init() {
        if (this.checkSaneParameters())
            super.init();
        else
            this.logger.error("Configuration file has invalid/incompatible parameters");
    }

    setup() {
        super.setup();

        let [width, height] = [this.parameters.simulation.environment.width, this.parameters.simulation.environment.height];
        let environment = new TemplateEnvironment(this.parameters.simulation.environment.torus, width, height);

        for (let i = 0; i < this.parameters.template.nbAgents; i++) {
            let x = 0, y = 0;
            do {
                x = RNG.randInt(width);
                y = RNG.randInt(height);
            } while (environment.getAgentAt([x, y]) !== null);
            let agent = new TemplateAgent(environment, [x, y], this.parameters.template.agentProperty);
            environment.addAgent(agent, agent.getPosition());
        }

        this.environment = environment;
    }

    log() {
        let agents = this.environment.getAgents();
        this.logger.log(["TICK", this.tick, agents.length]);
    }

}
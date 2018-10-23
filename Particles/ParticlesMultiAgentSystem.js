class ParticlesMultiAgentSystem extends MultiAgentSystem {
    constructor(parameters, viewer, input, logger, plotter) {
        super(parameters, viewer, input, logger, plotter);
    }

    checkSaneParameters() {
        return super.checkSaneParameters() && this.parameters.particles.nbBalls <= this.parameters.simulation.environment.width * this.parameters.simulation.environment.height;
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
        let environment = new ParticlesEnvironment(this.parameters.simulation.environment.torus, width, height);
        let directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
        for (let i = 0; i < this.parameters.particles.nbBalls; i++) {
            let x = 0, y = 0;
            do {
                x = RNG.randInt(width);
                y = RNG.randInt(height);
            } while (environment.getAgentAt([x, y]) !== null);
            let agent = new ParticlesAgent(environment, [x, y], RNG.randElem(this.parameters.particles.colors.balls), 0, RNG.randElem(directions), this.parameters.particles.bounceBehavior, this.parameters.particles.colors.hit);
            environment.addAgent(agent, agent.getPosition());
        }

        this.environment = environment;
    }

    log() {
        let agents = this.environment.getAgents();
        let nbCollided = agents.filter(agent => agent.hasCollided()).length;
        this.logger.log(["TICK", this.tick, nbCollided]);
    }

}
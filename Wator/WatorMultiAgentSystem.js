class WatorMultiAgentSystem extends MultiAgentSystem {
    constructor(parameters, viewer, input, logger, plotter) {
        super(parameters, viewer, input, logger, plotter);
    }

    checkSaneParameters() {
        return super.checkSaneParameters() && this.parameters.wator.nbFish + this.parameters.wator.nbSharks <= this.parameters.simulation.environment.width * this.parameters.simulation.environment.height;
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
        let environment = new WatorEnvironment(this.parameters.simulation.environment.torus, width, height);
        for (let i = 0; i < this.parameters.wator.nbFish + this.parameters.wator.nbSharks; i++) {
            let x = 0, y = 0;
            do {
                x = RNG.randInt(width);
                y = RNG.randInt(height);
            } while (environment.getAgentAt([x, y]) !== null);
            let agent = null;
            if (i < this.parameters.wator.nbFish) {
                let gestation = this.parameters.wator.fishGestation;
                if (this.parameters.wator.randomGestation)
                    gestation += RNG.randInt(this.parameters.wator.fishGestationRange);
                agent = new WatorFishAgent(environment, [x, y], this.parameters.wator.colors.babyFish, this.parameters.wator.colors.fish, gestation, this.parameters.wator.explosivePregnancy, this.parameters.wator.oneActionPerTurn, this.parameters.wator.fishSuffocate, this.parameters.wator.fishBreath);
            }
            else {
                let gestation = this.parameters.wator.sharkGestation;
                if (this.parameters.wator.randomGestation)
                    gestation += RNG.randInt(this.parameters.wator.sharkGestationRange);
                let starvation = this.parameters.wator.sharkStarvation;
                let babyFood = this.parameters.wator.babySharkFood;
                if (this.parameters.wator.randomStarvation) {
                    starvation += RNG.randInt(this.parameters.wator.sharkStarvationRange);
                    babyFood += RNG.randInt(this.parameters.wator.babySharkFoodRange);
                }
                agent = new WatorSharkAgent(environment, [x, y], this.parameters.wator.colors.babyShark, this.parameters.wator.colors.shark, gestation, this.parameters.wator.explosivePregnancy, this.parameters.wator.oneActionPerTurn, starvation, babyFood, this.parameters.wator.sharkReproduceWhenEating, this.parameters.wator.sharkReproduceWhenMoving, this.parameters.wator.sharkGestateOnlyWhenEating, this.parameters.wator.moveWhenEating);
            }
            environment.addAgent(agent, agent.getPosition());
        }

        this.environment = environment;
    }

    update() {
        super.update();
        if (this.environment.getAgents().length === 0) {
            if (this.logger !== null)
                this.logger.info(["Life didn't find a way after all."]);
            this.paused = true;
        }
    }

    log() {
        let agents = this.environment.getAgents();
        let nbFish = agents.filter(agent => agent instanceof WatorFishAgent).length;
        let nbSharks = agents.filter(agent => agent instanceof WatorSharkAgent).length;
        this.logger.log(["TICK", this.tick, nbFish, nbSharks]);
    }
}
class PacmanMultiAgentSystem extends MultiAgentSystem {
    constructor(parameters, viewer, input, logger, plotter) {
        super(parameters, viewer, input, logger, plotter);
    }

    checkSaneParameters() {
        return super.checkSaneParameters() &&
            1 <= this.parameters.pacman.ghostSpeed &&
            this.parameters.pacman.ghostSpeed <= 100 &&
            1 <= this.parameters.pacman.playerSpeed &&
            this.parameters.pacman.playerSpeed <= 100
    }

    init() {
        if (this.checkSaneParameters())
            super.init();
        else
            this.logger.error("Configuration file has invalid/incompatible parameters");
    }

    setup() {
        super.setup();

        let playerEventListener = function (eventQueue) {
            return function (event) {
                switch (event.key) {
                    case "ArrowUp":
                        eventQueue.pushEvent("up");
                        event.preventDefault();
                        break;
                    case "ArrowDown":
                        eventQueue.pushEvent("down");
                        event.preventDefault();
                        break;
                    case "ArrowLeft":
                        eventQueue.pushEvent("left");
                        break;
                    case "ArrowRight":
                        eventQueue.pushEvent("right");
                        break;
                    case "o":
                    case "O":
                        eventQueue.pushEvent("slowing");
                        break;
                    case "p":
                    case "P":
                        eventQueue.pushEvent("speeding");
                        break;
                }
            };
        };

        let ghostEventListener = function (eventQueue) {
            return function (event) {
                switch (event.key) {
                    case "q":
                    case "Q":
                        eventQueue.pushEvent("slowing");
                        break;
                    case "w":
                    case "W":
                        eventQueue.pushEvent("speeding");
                        break;
                }
            };
        };

        let [width, height] = [this.parameters.simulation.environment.width, this.parameters.simulation.environment.height];
        let environment = new PacmanEnvironment(this.parameters.simulation.environment.torus, width, height);

        for (let i = 0; i < width * height; i++) {
            if (RNG.rand() < this.parameters.pacman.wallProbability) {
                let agent = new PacmanWallAgent(environment, [i % width, Math.floor(i / width)], this.parameters.pacman.colors.wall);
                environment.addAgent(agent, agent.position);
            }
        }

        for (let i = 0; i < 1 + this.parameters.pacman.nbPowerpellets + this.parameters.pacman.nbGhosts; i++) {
            let [x, y] = [0, 0];
            do {
                [x, y] = [RNG.randInt(width), RNG.randInt(height)];
            } while (environment.getAgentAt([x, y]) !== null);

            let agent = null;
            if (i === 0) {
                let playerEventQueue = new EventQueue(1);
                this.addEventListener("keydown", playerEventListener(playerEventQueue));
                agent = new PacmanPlayerAgent(environment, [x, y], this.parameters.pacman.colors.player, this.parameters.pacman.colors.invincibility, this.parameters.pacman.colors.invincibilityWearOff, this.parameters.pacman.colors.exit, this.parameters.pacman.playerSpeed, this.parameters.pacman.overload, playerEventQueue);
                environment.setLayer("distance", new DistanceToTargetLayer(environment, 0, 0, width, height, agent, [PacmanWallAgent]));
            }
            else if (i < 1 + this.parameters.pacman.nbPowerpellets) {
                agent = new PacmanPowerpelletAgent(environment, [x, y], this.parameters.pacman.colors.powerpellet, this.parameters.pacman.powerpelletDurationFactor, this.parameters.pacman.powerpelletStrength);
            }
            else {
                let ghostEventQueue = new EventQueue(1);
                this.addEventListener("keydown", ghostEventListener(ghostEventQueue));
                agent = new PacmanGhostAgent(environment, [x, y], this.parameters.pacman.colors.ghost, this.parameters.pacman.ghostSpeed, ghostEventQueue);
            }
            environment.addAgent(agent, agent.getPosition());
        }

        this.environment = environment;
    }

    update() {
        super.update();
        if (this.environment.checkWinCondition()) {
            if (this.logger !== null)
                this.logger.info(["You won!"]);
            this.paused = true;
        }
        else if (this.environment.checkLoseCondition()) {
            if (this.logger !== null)
                this.logger.info(["You lost!"]);
            this.paused = true;
        }
    }
}

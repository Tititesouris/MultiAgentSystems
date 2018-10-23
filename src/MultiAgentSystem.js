class MultiAgentSystem {
    constructor(parameters, viewer, input, logger, plotter) {
        this.parameters = parameters;
        this.viewer = viewer;
        this.input = input;
        this.logger = logger;
        this.plotter = plotter;
        this.environment = null;
        this.tick = 0;
        this.paused = false;
        this.eventListeners = [];
        this.init();
    }

    checkSaneParameters() {
        return ["SEQ", "RAND_SEQ", "RAND"].includes(this.parameters.simulation.scheduler);
    }

    /**
     * Called once on instantiation
     */
    init() {
        RNG = new Randomizer(this.parameters.simulation.seed);

        let system = this;
        this.addEventListener("keydown", function (event) {
            switch (event.key) {
                case " ":
                    system.paused = !system.paused;
                    event.preventDefault();
                    break;
                case "r":
                case "R":
                    system.setup();
                    system.afterSetup();
                    break;
            }
        }, true);

        switch (this.parameters.simulation.scheduler) {
            case "SEQ":
                this.scheduler = new SequenceScheduler();
                break;
            case "RAND_SEQ":
                this.scheduler = new RandomSequenceScheduler();
                break;
            case "RAND":
                this.scheduler = new RandomScheduler();
                break;
        }

        this.setup();
        this.afterSetup();
    }

    /**
     * Called at every reset
     */
    setup() {
        RNG.reset();
        this.removeEventListeners();
    }

    /**
     * Called after every setup
     */
    afterSetup() {
        this.tick = 0;
        this.paused = false;
        if (this.parameters.logging.environment)
            this.environment.setLogger(this.logger);
    }

    run() {
        let system = this;
        let repeat = function (delta) {
            let startTime = Date.now();
            let delay = Math.max(0, system.parameters.simulation.delay - delta);

            if (!system.paused) {
                system.update();
                if (system.viewer !== null && system.parameters.draw && system.tick % system.parameters.drawing.rate === 0)
                    system.draw();
                if (system.logger !== null && system.parameters.log && system.parameters.logging.ticks && system.tick % system.parameters.logging.rate === 0)
                    system.log();
                if (system.plotter !== null && system.parameters.plot && system.tick % system.parameters.plotting.rate === 0)
                    system.plot();

                system.tick++;
            }
            setTimeout(repeat.bind(null, Date.now() - startTime), delay);
        };
        repeat(0);
    }

    update() {
        if (!this.paused) {
            let agents = this.environment.getAgents();
            this.scheduler.execute(agents);
            this.environment.updateAgentsState();
        }
    }

    draw() {
        this.viewer.draw(this.environment, this.parameters.drawing);
    }

    addEventListener(trigger, eventListener, permanent) {
        this.eventListeners.push({trigger: trigger, listener: eventListener, permanent: permanent});
        this.input.addEventListener(trigger, eventListener);
    }

    removeEventListeners() {
        for (let i = 0; i < this.eventListeners.length; i++) {
            let eventListener = this.eventListeners[i];
            if (!eventListener.permanent)
                this.input.removeEventListener(eventListener.trigger, eventListener.listener);
        }
    }

    log() {
        this.logger.log(["TICK", this.tick]);
    }

    plot() {
        this.plotter.plot(this.environment.getAgents());
    }
}
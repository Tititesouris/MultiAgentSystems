class Scheduler {

}

class SequenceScheduler extends Scheduler {
    execute(agents) {
        for (let i = 0; i < agents.length; i++) {
            let agent = agents[i];
            if (agent.isActive()) {
                if (agent.think()) {
                    agent.decide();
                }
            }
        }
    }
}

class RandomSequenceScheduler extends Scheduler {
    execute(agents) {
        RNG.shuffle(agents);
        for (let i = 0; i < agents.length; i++) {
            let agent = agents[i];
            if (agent.isActive()) {
                if (agent.think()) {
                    agent.decide();
                }
            }
        }
    }
}

class RandomScheduler extends Scheduler {
    execute(agents) {
        for (let i = 0; i < agents.length; i++) {
            let agent = agents[RNG.randInt(agents.length)];
            if (agent.isActive()) {
                if (agent.think()) {
                    agent.decide();
                }
            }
        }
    }
}
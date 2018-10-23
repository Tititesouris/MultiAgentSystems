let configuration = {
    simulation: {
        delay: 1, // How many milliseconds to wait between each tick (at least, will be more if calculations take longer)
        seed: -1, // -1 = Random seed
        scheduler: "RAND_SEQ", // SEQ = Every agent has a turn per tick, in sequential order; RAND_SEQ = Every agent has a turn per tick, in random order; RAND = There are as many turns per tick as the number of agents, but the agents are picked randomly, so some could not have a turn and some could have multiple turns
        environment: {
            torus: true,
            width: 111, // If the width is bigger than the width of the canvas, the environment will be drawn outside of the canvas.
            height: 80, // If the height is bigger than the height of the canvas, the environment will be drawn outside of the canvas.
        },
    },

    draw: true, // Whether or not to draw the simulation
    drawing: {
        rate: 1, // How many ticks to wait before drawing
        textFont: "10px Arial", // Font of the text
        show: {
            grid: true, // Whether or not to show the grid
            layers: false, // Whether or not to show the layers
        },
        sizes: {
            grid: 2, // Thickness of the grid, if there are too many cells to fit the grid on the canvas, it will be set to 0 and not appear
        },
        colors: {
            background: "#222222", // Color of the canvas
            cell: "#616db5", // Color of empty cells
            grid: "#8899ff", // Color of the grid
            text: "#000000", // Color of the text
        },
    },

    log: false, // Whether or not to log the simulation
    logging: {
        rate: 1, // How many ticks to wait before logging ticks
        ticks: true, // Whether or not to log tick updates
        environment: false, // Whether or not to log environment updates
    },

    plot: true, // Whether or not to plot the simulation
    plotting: {
        rate: 1, // How many ticks to wait before plotting
    }
};

let watorConfiguration = {
    wator: {
        oneActionPerTurn: true, // If true, agents can only eat (If moveWhenEating, then also move), reproduce or move during a turn, but not multiple.
        randomGestation: false, // If true, the gestation time is randomised
        randomStarvation: false, // If true, the starvation time is randomised
        moveWhenEating: true, // Whether or not agents move onto their prey when eating.
        nbFish: 2000,
        nbSharks: 50,
        fishGestation: 7, // How many turns needed to be able to reproduce. If randomGestation is true, this is the minimum value.
        fishGestationRange: 10, // If randomGestation is true, this is the range of the random gestation.
        sharkGestation: 10, // How many turns needed to be able to reproduce. If sharkGestateOnlyWhenEating is true, how many fish to eat to be able to reproduce. If randomGestation is true, this is the minimum value.
        sharkGestationRange: 10, // If randomGestation is true, this is the range of the random gestation.
        sharkStarvation: 3, // How many turns can a shark survive without eating. If randomStarvation is true, this is the minimum value.
        sharkStarvationRange: 10, // If randomStarvation is true, this is the range of the random starvation.
        babySharkFood: 3, // How many turns can a baby shark survive before its first meal. If randomStarvation is true, this is the minimum value.
        babySharkFoodRange: 10,// If randomStarvation is true, this is the range of the random baby shark starvation.
        fishSuffocate: false, // Do fish suffocate if there are too many agents around
        fishBreath: 5, // How many free cells needed to breath
        explosivePregnancy: false, // Do agents die if they can reproduce but don't
        sharkReproduceWhenEating: true, // Can sharks reproduce after moving to eat
        sharkReproduceWhenMoving: true, // Can sharks reproduce after moving randomly
        sharkGestateOnlyWhenEating: false, // Do sharks gestate only when eating or over time
        colors: {
            babyFish: "#55cc55",
            fish: "#159115",
            babyShark: "#cc5555",
            shark: "#771111",
        },
    },
};

let activeParameters = Object.assign({}, configuration, watorConfiguration);
let configuration = {
    simulation: {
        delay: 1, // How many milliseconds to wait between each tick (at least, will be more if calculations take longer)
        seed: -1, // -1 = Random seed
        scheduler: "RAND_SEQ", // SEQ = Every agent has a turn per tick, in sequential order; RAND_SEQ = Every agent has a turn per tick, in random order; RAND = There are as many turns per tick as the number of agents, but the agents are picked randomly, so some could not have a turn and some could have multiple turns
        environment: {
            torus: true,
            width: 50, // If the width is bigger than the width of the canvas, the environment will be drawn outside of the canvas.
            height: 35, // If the height is bigger than the height of the canvas, the environment will be drawn outside of the canvas.
        },
    },

    draw: true, // Whether or not to draw the simulation
    drawing: {
        rate: 1, // How many ticks to wait before drawing
        textFont: "8px Arial", // Font of the text
        show: {
            grid: true, // Whether or not to show the grid
            layers: false, // Whether or not to show the layers
        },
        sizes: {
            grid: 2, // Thickness of the grid, if there are too many cells to fit the grid on the canvas, it will be set to 0 and not appear
        },
        colors: {
            background: "#222222", // Color of the canvas
            cell: "#dddddd", // Color of empty cells
            grid: "#bbbbbb", // Color of the grid
            text: "#000000", // Color of the text
        },
    },

    log: false, // Whether or not to log the simulation
    logging: {
        rate: 1, // How many ticks to wait before logging ticks
        ticks: true, // Whether or not to log tick updates
        environment: false, // Whether or not to log environment updates
    },

    plot: false, // Whether or not to plot the simulation
    plotting: {
        rate: 1, // How many ticks to wait before plotting
    }
};

let pacmanConfiguration = {
    pacman: {
        wallProbability: 0.1,
        nbGhosts: 4,
        nbPowerpellets: 2,
        playerSpeed: 87,
        ghostSpeed: 83,
        powerpelletDurationFactor: 2.5, // Powerpellets stay alive for powerpelletDurationFactor * (width + height) ticks
        powerpelletStrength: 50,
        overload: 4, // Number of Power Pellets to eat to enable victory
        colors: {
            wall: "#473d33",
            ghost: "#be302b",
            player: "#3e41c1",
            invincibility: "#5481c1",
            invincibilityWearOff: "#c1ba5d",
            powerpellet: "#3b9e3b",
            exit: "#cbc23e",
        },
    },
};

let activeParameters = Object.assign({}, configuration, pacmanConfiguration);
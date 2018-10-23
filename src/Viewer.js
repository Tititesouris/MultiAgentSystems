class Viewer {
    constructor(view) {
        this.view = view;
    }

    draw(environment, parameters) {
        this.view.fillStyle = parameters.colors.background;
        this.view.fillRect(0, 0, this.view.canvas.width, this.view.canvas.height);
    }
}

class RectangleGridViewer extends Viewer {
    constructor(view) {
        super(view);
    }

    draw(environment, parameters) {
        super.draw(environment, parameters);

        let [width, height] = [environment.getWidth(), environment.getHeight()];
        let gridSize = (parameters.show.grid) ? parameters.sizes.grid : 0;
        let cellSize = Math.floor(Math.min((this.view.canvas.width - gridSize) / width, (this.view.canvas.height - gridSize) / height));
        // If the cell size is too small because there are too many cells to display the grid
        if (cellSize < gridSize) {
            gridSize = 0;
            cellSize = Math.floor(Math.min(this.view.canvas.width / width, this.view.canvas.height / height));
        }
        cellSize = Math.max(1, cellSize);
        let innerCellSize = cellSize - gridSize;

        if (parameters.show.grid) {
            this.view.fillStyle = parameters.colors.grid;
            this.view.fillRect(0, 0, cellSize * width + gridSize, cellSize * height + gridSize);
        }

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {

                let agent = environment.getAgentAt([x, y]);
                let [pX, pY] = [gridSize + x * cellSize, gridSize + y * cellSize];

                this.view.fillStyle = (agent !== null && agent.isVisible()) ? agent.getColor() : parameters.colors.cell;
                this.view.fillRect(pX, pY, innerCellSize, innerCellSize);

                if (parameters.show.layers) {
                    this.view.fillStyle = parameters.colors.text;
                    this.view.font = parameters.textFont;

                    let layers = environment.getLayers();
                    layers = Object.keys(layers).map(function (name) {
                        return layers[name];
                    });
                    for (let i = 0; i < layers.length; i++) {
                        let layer = layers[i];
                        let value = layer.getValueAt([x, y]);
                        if (value !== null) {
                            this.view.fillText(value, pX, pY + innerCellSize);
                        }
                    }
                }
            }
        }
    }
}
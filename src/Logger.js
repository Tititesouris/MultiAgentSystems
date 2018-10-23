class Logger {
    log(log) {
    }

    info(error) {
    }

    warn(error) {
    }

    error(error) {
    }
}

class ConsoleLogger extends Logger {

    log(log) {
        super.log(log);
        console.log(log);
    }

    info(info) {
        super.info(info);
        console.info(info);
    }

    warn(warning) {
        super.warn(warning);
        console.warn(warning);
    }

    error(error) {
        super.error(error);
        console.error(error);
    }
}

class CSVLogger extends Logger {
    constructor(filename, separator, nbLines) {
        super();
        this.filename = filename;
        this.separator = separator;
        this.nbLines = nbLines;
        this.lines = [];
        this.line = 0;
    }

    log(log) {
        super.log(log);
        this.lines.push(log.join(this.separator));
        if (++this.line >= this.nbLines) {
            download(this.filename, this.lines.join("\n"));
            this.lines = [];
            this.line = 0;
        }
    }

    info(info) {
        super.info(info);
        console.info(info);
    }

    warn(warning) {
        super.warn(warning);
        console.warn(warning);
    }

    error(error) {
        super.error(error);
        console.error(error);
    }
}
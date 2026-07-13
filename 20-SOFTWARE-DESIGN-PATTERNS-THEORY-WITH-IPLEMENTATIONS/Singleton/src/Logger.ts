class Logger {
    constructor() {
        console.log("Logger instance created");
    }

    log(message: string){
        console.log(`[LOG]: ${message}`);
    }
}

export default Logger;
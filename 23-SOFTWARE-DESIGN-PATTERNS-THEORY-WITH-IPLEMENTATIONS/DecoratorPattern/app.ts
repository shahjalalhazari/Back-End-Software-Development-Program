function Logger(constructor: Function) {
    console.log("Class created", constructor.name);
}

@Logger
class Person {
    public name: string;

    constructor(name: string) {
        this.name = name;
    }
}
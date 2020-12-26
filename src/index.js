export class Reactive {

    #value;
    #subscribers = new Set();

    constructor(value){
        this.#value = value
    }

    get value() {
        this.addEvaluatingDependantToSubscriber();
        return this.#value;
    }

    set value(v) {
        this.#value = v;
        for(let sub of this.#subscribers.values()) sub.notify();
    }

    addEvaluatingDependantToSubscriber(){
        let evaluatingDependant = evaluatingDependantStack[0];
        if(!evaluatingDependant) return;
        this.addSubscriber(evaluatingDependant);
    }

    addSubscriber(dependant){
        this.#subscribers.add(dependant);
    }
}

let evaluatingDependantStack = [];

export class Computed {

    static #initValue = Symbol("initValue");

    #fn;
    #lastValue = Computed.#initValue;

    constructor(fn){
        this.#fn = fn;
    }

    get value(){
        if(this.#lastValue == Computed.#initValue)
            this.evaluate();
        return this.#lastValue;
    }

    set value(v) {
        throw new SyntaxError("Can't set value of a Computed");
    }

    evaluate(){
        evaluatingDependantStack.unshift(this);
        try {
            this.#lastValue = this.#fn();
        } finally {
            evaluatingDependantStack.shift(this);
        }
    }

    notify(){
        this.evaluate();
    }
}
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
    #subscribers = new Set();

    constructor(fn){
        this.#fn = fn;
    }

    get value(){
        if(this.#lastValue == Computed.#initValue)
            this.evaluate();

        this.addEvaluatingDependantToSubscriber();

        return this.#lastValue;
    }

    set value(v) {
        throw new SyntaxError("Can't set value of a Computed");
    }

    addEvaluatingDependantToSubscriber(){
        let evaluatingDependant = evaluatingDependantStack[0];
        if(!evaluatingDependant) return;
        this.addSubscriber(evaluatingDependant);
    }

    addSubscriber(dependant){
        this.#subscribers.add(dependant);
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
        for(let sub of this.#subscribers.values()) sub.notify();
    }
}

export class Watcher {

    #fn;
    #cb;
    #lastValue;

    constructor(fn, cb){
        this.#fn = fn;
        this.#cb = cb;
        this.evaluate();
    }

    evaluate(){
        evaluatingDependantStack.unshift(this);
        try {
            this.#lastValue = this.#fn();
        } finally {
            evaluatingDependantStack.shift(this);
        }
    }

    /** 监听的响应式值被改变通知 */
    notify(){
        let value = this.#fn();
        if(Object.is(value, this.#lastValue)) return;
        this.#cb(value, this.#lastValue);
        this.#lastValue = value;
    }
}
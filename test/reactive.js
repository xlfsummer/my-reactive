import { Reactive, Computed, Watcher } from "../src/index.js";

let rWord = new Reactive("Hello");
let cMessage = new Computed(() => "saying:" + rWord.value);
let ccMessage = new Computed(() => "Bob is " + cMessage.value);
new Watcher(() => cMessage.value, () => console.log("cMessage is changing"));
new Watcher(() => ccMessage.value, () => console.log("ccMessage is changing"));

console.log(rWord.value)
console.log(cMessage.value)

rWord.value = "world"

console.log(rWord.value)
console.log(cMessage.value)


let rLastName = new Reactive("x")
let rFirstName = new Reactive("lf");
let cName = new Computed(() => rLastName.value + rFirstName.value);

console.log(cName.value);
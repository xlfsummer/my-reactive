import { Reactive, Computed } from "../src/index.js";

let rWord = new Reactive("Hello");
let cMessage = new Computed(() => "Saying:" + rWord.value);

console.log(rWord.value)
console.log(cMessage.value)

rWord.value = "world"

console.log(rWord.value)
console.log(cMessage.value)


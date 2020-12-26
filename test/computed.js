import { Reactive, Computed } from "../src/index.js";

let rName = new Reactive("bob");

let cMessage = new Computed(() => `name = ${rName.value}, eval at = ${Date.now()}`);

console.log(`name = ${rName.value}`);

console.log(`date = ${Date.now()}`);

console.log(`message = ${cMessage.value}`);
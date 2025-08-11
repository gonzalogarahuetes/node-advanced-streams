import { ArrayStreamClass } from "./arrayStreamClass.js";

const rivers = [
    "Amazon",
    "Niles",
    "Yangtze",
    "Mississippi",
    "Ganges",
    "Danube",
    "Mekong"
]

const riverStream = new ArrayStreamClass(rivers);

riverStream.on("data", (chunk) => console.log(chunk));
riverStream.on("end", () => console.log("Stream ended"));
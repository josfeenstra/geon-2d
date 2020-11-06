import { Geon } from "./Geon";

import { SelectorMetaProgram } from "./programs/Selector";

import { BounceBallsProgram } from "./programs/BounceBalls";
import { VoronoiProgram } from "./programs/voronoiProgram";

const programs: any[] = 
[
    BounceBallsProgram,
    VoronoiProgram
];
const meta = new SelectorMetaProgram(programs);

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const geon = new Geon(canvas);
geon.loadMeta(meta);             // program selector
geon.load(new VoronoiProgram()); // first program to load 


console.log("everything loaded.");
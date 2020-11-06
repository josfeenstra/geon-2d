import { Geon } from "./Geon";

import { SelectorMetaProgram } from "./programs/Selector";

import { BounceBallsProgram } from "./programs/BounceBallsProgram";
import { DelaunayProgram } from "./programs/DelaunayProgram";

const programs: any[] = 
[
    BounceBallsProgram,
    DelaunayProgram
];
const meta = new SelectorMetaProgram(programs);

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const geon = new Geon(canvas);
geon.loadMeta(meta);             // program selector
geon.load(new DelaunayProgram()); // first program to load 


console.log("everything loaded.");
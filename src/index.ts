import { Geon } from "./Geon";

import { SelectorMetaProgram } from "./programs/SelectorMetaProgram";

import { BounceBallsProgram } from "./programsmain/BounceBallsProgram";
import { DelaunayProgram } from "./programsmain/DelaunayProgram";
import { GridProgram } from "./programsmain/GridProgram";

const programs: any[] = 
[
    BounceBallsProgram,
    DelaunayProgram,
    GridProgram
];
const meta = new SelectorMetaProgram(programs);

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const geon = new Geon(canvas);
geon.loadMeta(meta);             // program selector
geon.load(new GridProgram()); // first program to load 


console.log("everything loaded.");
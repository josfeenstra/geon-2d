import { Geon } from "./Geon";
import { Test } from "./Test";

const canvas = document.getElementById("canvas")! as HTMLCanvasElement;
const geon = new Geon(canvas);
geon.load(new Test());

// author: Jos Feenstra

import { Geon } from "../Geon";

// only renderer talks to ctx & canvas. 
export class Renderer2D
{
    ctx: CanvasRenderingContext2D;
    geon: Geon;

    pointsize = 5;
    pointcolor = "#ffffff";

    

    constructor(canvas: HTMLCanvasElement, geon: Geon)
    {
        this.geon = geon;
        this.ctx = canvas.getContext("2d")!;
        this.ctx.fillStyle = this.pointcolor;
    }

    // this clears with a transparant layer, for easy delayed effect
    clear()
    {
        // adjust color settings
        const color = this.ctx.fillStyle;
        this.ctx.fillStyle = "#000000ff";
        this.ctx.globalAlpha = 0.1;  

        this.ctx.fillRect(0, 0, this.geon.width, this.geon.height);

        // reset color settings 
        this.ctx.globalAlpha = 1;  
        this.ctx.fillStyle = color;
    }

    clearNormal()
    {
        this.ctx.clearRect(0, 0, this.geon.width, this.geon.height);
    }

    point(x: number, y: number)
    {
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.pointsize, 0, Math.PI * 2, false);
        this.ctx.fill();
    }
}
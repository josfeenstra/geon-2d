// author: Jos Feenstra

import { Line2 } from "../geo2/line2";
import { Geon } from "../Geon";

// only renderer talks to ctx & canvas.
// do all the camera work in here
export class Renderer2
{
    ctx: CanvasRenderingContext2D;
    geon: Geon;

    pointsize = 5;
    pointcolor = "#ffffff";

    linecolor = "#ffffff";
    

    constructor(canvas: HTMLCanvasElement, geon: Geon)
    {
        this.geon = geon;
        this.ctx = canvas.getContext("2d")!;
        this.ctx.fillStyle = this.pointcolor;
        this.ctx.strokeStyle = this.linecolor;
    }

    // this clears with a transparant layer, for easy delayed effect
    clearFade(alpha: number)
    {
        // adjust color settings
        const color = this.ctx.fillStyle;
        this.ctx.fillStyle = "#000000ff";
        this.ctx.globalAlpha = alpha;  

        this.ctx.fillRect(0, 0, this.geon.width, this.geon.height);

        // reset color settings 
        this.ctx.globalAlpha = 1;  
        this.ctx.fillStyle = color;
    }

    clear()
    {
        this.ctx.clearRect(0, 0, this.geon.width, this.geon.height);
    }

    point(x: number, y: number)
    {
        // TODO dont draw if off screen

        this.ctx.beginPath();
        this.ctx.arc(x, y, this.pointsize, 0, Math.PI * 2, false);
        this.ctx.fill();
    }

    line(line: Line2)
    {
        // TODO dont draw if off screen

        this.ctx.beginPath();
        this.ctx.moveTo(line.from.x, line.from.y);
        this.ctx.lineTo(line.to.x, line.to.y);
        this.ctx.stroke();
    }
}
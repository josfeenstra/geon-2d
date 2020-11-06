// author: Jos Feenstra

import { Line2 } from "../geo2/line2";
import { Geon } from "../Geon";
import { Vector2 } from "../math/Vector2";

// only renderer talks to ctx & canvas.
// do all the camera work in here
export class Renderer2
{
    private ctx: CanvasRenderingContext2D;
    private geon: Geon;

    // visuals
    private pointsize = 5;
    private pointcolor = "#ffffff";

    private linecolor = "#ffffff";
    private fillcolor = "#666666";

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
        // todo camera
        // TODO dont draw if off screen

        this.ctx.beginPath();
        this.ctx.arc(x, y, this.pointsize, 0, Math.PI * 2, false);
        this.ctx.fill();
    }

    points(points: Vector2[])
    {
        // TODO dont draw if off screen
        for (let i = 0; i < points.length; i++)
        {
            this.ctx.beginPath();
            this.ctx.arc(points[i].x, points[i].y, this.pointsize, 0, Math.PI * 2, false);
            this.ctx.fill();
        }    
    }

    line(line: Line2)
    {
        // TODO dont draw if off screen

        this.ctx.beginPath();
        this.ctx.moveTo(line.from.x, line.from.y);
        this.ctx.lineTo(line.to.x, line.to.y);
        this.ctx.stroke();
    }

    lineSegments(vertices: Vector2[])
    {
        this.ctx.beginPath();
        for(let i = 0 ; i < vertices.length; i += 2)
        {
            let ii = i + 1;
            this.ctx.moveTo(vertices[i].x, vertices[i].y);
            this.ctx.lineTo(vertices[ii].x, vertices[ii].y);
        }
        this.ctx.stroke();
    }

    circle()
    {
        this.ctx.beginPath();
        this.ctx.fill();
        this.ctx.stroke();
    } 

    rectangle()
    {
        this.ctx.beginPath();
        this.ctx.fill();
        this.ctx.stroke();
    }

    polygon() 
    {
        this.ctx.beginPath();
        this.ctx.fill();
        this.ctx.stroke();
    }
}
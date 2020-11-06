// author: Jos Feenstra

import { Line2 } from "../geo2/line2";
import { Geon } from "../Geon";
import { Vector2 } from "../math/Vector2";

// only renderer talks to ctx & canvas.
// do all the camera work in here
export class Renderer2
{
    public offset: Vector2;
    public scale: number;

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
        this.offset = Vector2.zero();
        this.scale = 1;
        this.ctx.fillStyle = this.pointcolor;
        this.ctx.strokeStyle = this.linecolor;
    }

    public reset()
    {
        this.offset = Vector2.zero();
        this.scale = 1;
        this.ctx.fillStyle = this.pointcolor;
        this.ctx.strokeStyle = this.linecolor;
    }

    // TODO fix this once i build matrices

    private applyOffset(v: Vector2) : Vector2
    {
        return v.clone().add(this.offset).scale(this.scale);
    }

    public revertOffset(v: Vector2) : Vector2
    {
        return v.clone().scale(1 / this.scale).sub(this.offset);
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
            let v = this.applyOffset(points[i]);
            this.ctx.arc(v.x, v.y, this.pointsize, 0, Math.PI * 2, false);
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
            let v1 = this.applyOffset(vertices[i]);
            let v2 = this.applyOffset(vertices[ii]);
            this.ctx.moveTo(v1.x, v1.y);
            this.ctx.lineTo(v2.x, v2.y);
        }
        this.ctx.stroke();
    }

    circles(points: Vector2[], radii: number[])
    {
        // TODO dont draw if off screen
        for (let i = 0; i < points.length; i++)
        {
            this.ctx.beginPath();
            let v = this.applyOffset(points[i]);
            let r = radii[i] * this.scale;
            this.ctx.arc(v.x, v.y, r, 0, Math.PI * 2, false);
            this.ctx.stroke();
        } 
    } 

    text(message: string, pos: Vector2)
    {
        this.ctx.font = '14px "Lucida Console", Monaco, monospace';
        this.ctx.fillText(message, pos.x, pos.y);
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
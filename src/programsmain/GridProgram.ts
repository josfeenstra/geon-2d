import { Geon } from "../Geon";
import { Program } from "../programs/Program";

import { Vector2 } from "../math/Vector2";
import { Line2 } from "../geo2/line2";
import { Delaunay } from "../geo2/Delaunay";
import { ProgramHelpers } from "../programs/ProgramHelpers";

export class GridProgram extends Program
{
    title = "grid";
    description = "";

    // params
    public count = 20;


    private highlight = Vector2.zero();
    private points: Vector2[] = [];
    private colors: number[] = [];
    private xCount = 0;
    private yCount = 0;
    private d = 0;

    start(geon: Geon)
    { 
        this.create(geon, this.count);
    }

    update(geon: Geon)
    {
        this.updateCursor(geon);
    }

    draw(geon: Geon)
    {
        // points
        const color1 = "#ffffff";
        const color2 = "#222222";
        const color3 = "#aaaaaa";
        for (let i = 0; i < this.points.length; i++)
        {
            let v = this.points[i];
            let c = this.colors[i] ? color3 : color2;
            geon.r.pointColored(v.x, v.y, c);
        }

        // lines 
        geon.r.setColor("#ffffff");
        this.drawLines(geon);

        // cursor 
        geon.r.setColor(color1);
        geon.r.circle(this.highlight, 10);

        geon.r.reset();
    }

    exit(geon: Geon)
    {
        
    }

    // -

    create(geon: Geon, count: number)
    {
        // for good spacing
        this.xCount = count;
        this.d = geon.width / (this.xCount + 1);
        this.yCount = Math.round(geon.height / this.d) - 1;

        for(let y = 0; y < this.yCount; y++)
        {
            for(let x = 0; x < this.xCount; x++)
            {
                this.points.push(new Vector2(this.d + x * this.d, this.d + y * this.d));
                this.colors.push(Math.random() > 0.5 ? 1 : 0);
            }
        }
    }

    private oldLocal = Vector2.zero();
    private _thing = 0;
    updateCursor(geon: Geon)
    {
        let local = this.toLocalCoord(geon.mouse);
        this.highlight = this.toGrid(local);
        this.description = local.toString();
        this.description += this.yCount + ".." + this.xCount;

        let i = (local.y-1) * (this.xCount) + (local.x-1);
        this.description += " | " + i.toString();

        if (geon.mouseLeftPressed)
        {
            this.colors[i] = this.colors[i] > 0 ? 0 : 1;
            this._thing = this.colors[i]; 
        } 
        if (geon.mouseLeftDown && !this.oldLocal.equals(local))
        {
            this.colors[i] = this._thing;    
        }        
        this.oldLocal = local;
    }

    toLocalCoord(worldCoord: Vector2)
    {
        let x = Math.round(worldCoord.x / this.d);
        let y = Math.round(worldCoord.y / this.d);
        return new Vector2(x,y);
    }

    toGrid(localCoord: Vector2)
    {
        return new Vector2(localCoord.x * this.d, localCoord.y * this.d);
    }

    
    drawLines(geon: Geon)
    {
        
        for(let y = 0; y < this.yCount + 1; y++)
        {
            for(let x = 0; x < this.xCount + 1; x++)
            {
                let corner = this.toGrid(new Vector2(x, y));
                let state = this.getState(
                    this.getColor(x, y),
                    this.getColor(x+1, y),
                    this.getColor(x, y+1),
                    this.getColor(x+1, y+1)
                )
                this.drawCell(geon, corner, state)
                // geon.r.text(state.toString(), corner.addn(this.d/2, this.d/2));
            }
        }
        return null;
    }
    
    private _halfd = this.d / 2;
    drawCell(geon: Geon, corner: Vector2, casus: number)
    {
        this._halfd = this.d / 2;
        let top = new Vector2(this._halfd, 0).add(corner);
        let left = new Vector2(0, this._halfd).add(corner);
        let right = new Vector2(this._halfd * 2, this._halfd).add(corner);
        let bottom = new Vector2(this._halfd, this._halfd * 2).add(corner);
      
        switch(casus)
        {
            case 1:
                geon.r.line(new Line2(top, left));
                break;
            case 2:
                geon.r.line(new Line2(top, right));
                break;
            case 3:
                geon.r.line(new Line2(left, right));
                break;
            case 4:
                geon.r.line(new Line2(left, bottom));
                break;
            case 5:
                geon.r.line(new Line2(top, bottom));
                break;
            case 6:
                geon.r.line(new Line2(top, left));
                geon.r.line(new Line2(bottom, right));
                break;
            case 7:
                geon.r.line(new Line2(bottom, right));
                break;
            case 8:
                geon.r.line(new Line2(bottom, right));
                break;
            case 9:
                geon.r.line(new Line2(top, right));
                geon.r.line(new Line2(left, bottom));
                break;
            case 10:
                geon.r.line(new Line2(top, bottom));
                break;
            case 11:
                geon.r.line(new Line2(left, bottom));
                break;
            case 12:
                geon.r.line(new Line2(left, right));
                break;
            case 13:
                geon.r.line(new Line2(top, right));
                break;
            case 14:
                geon.r.line(new Line2(top, left));
                break;
            case 15:
                // fully filled
                break;
        }
    }

    getState(first: number, second: number, third: number, forth: number)
    {
        return first * 1 + second * 2 + third * 4 + forth * 8; 
    }

    getColor(x: number, y:number)
    {
        if (x > this.xCount || y > this.yCount) return 0;
        let i = (y-1) * (this.xCount) + (x-1);
        if (i < 0 || i > this.colors.length-1) return 0;
        return this.colors[i];
    }
}
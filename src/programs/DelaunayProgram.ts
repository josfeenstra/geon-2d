import { Geon } from "../Geon";
import { Program } from "./Program";

import { Vector2 } from "../math/Vector2";
import { Line2 } from "../geo2/line2";
import { Delaunay } from "../geo2/Delaunay";
import { ProgramHelpers } from "./ProgramHelpers";

export class DelaunayProgram extends Program
{
    SWITCH_KEY = 'v';
    switch = 0;
    dt: Delaunay = new Delaunay();
    p: Vector2[] = [];

    // overrides
    title = 'delaunay';
    description = `use ${this.SWITCH_KEY} to change visuals`;


    start(geon: Geon)
    { 
        let pt = new Vector2(geon.width / 2, geon.height / 2)
        this.add(pt);
    }

    update(geon: Geon)
    {
        if (geon.mouseLeftPressed)
        {
            let insertion = Vector2.fromCopy(geon.worldMouse);       
            this.add(insertion);
        }
        if (geon.mouseRightDown)
        {
            this.pull(geon.worldMouse);
        }


        if (geon.IsKeyPressed(this.SWITCH_KEY))
        {
            this.switch += 1;
            if (this.switch > 2) 
                this.switch = 0;   
        }

        // lerp dt back to original
        this.dt.getVertices().forEach((e, i) => {
            e.lerp(this.p[i], 0.05);
        });

        // update camera
        let vel = ProgramHelpers.getMovementVector(geon, 2 / geon.r.scale, 5 / geon.r.scale);
        geon.r.offset.add(vel);
        if (geon.IsKeyPressed('q'))
            geon.r.scale *= 1.5;
        if (geon.IsKeyPressed('e'))
            geon.r.scale *= 0.5;
    }

    draw(geon: Geon)
    {
        // draw cursor
        geon.r.point(geon.mouse.x, geon.mouse.y);

        // draw points
        geon.r.points(this.dt.getVertices());

        if (this.switch == 0)
        {
            // draw delaunay triangulation
            geon.r.lineSegments(this.dt.getEdges());
        }
        else if (this.switch == 1)
        {
            // draw voronoi diagram
            geon.r.lineSegments(this.dt.getVoronoiEdges(true));
        }
        else if (this.switch == 2)
        {
            //draw circumcircles
            this.dt.calculateCC();
            let data = this.dt.getCC();
            geon.r.circles(data.cc, data.r);
        }
    }

    // ...

    add(v: Vector2)
    {
        // simulate impact
        this.dt.Insert(v);
        
        // original points
        this.p = this.dt.getVertices().map(e => {
            return e.clone()
        });
  
        this.disturb(v, 20, 800);
    }

    pull(v: Vector2)
    {
        // displace dt 
        // this.dt.getVertices().forEach(e => {
        //     e.add(Vector2.fromRandomAngle().scale(Math.min(10, 500 / e.disTo(v))))
        // })

        // displace dt 
        let vertices = this.dt.getVertices();
        for(let i = 0; i < vertices.length; i++)
        {
            let e = vertices[i];
            let target = this.p[i];
            let difference = Vector2.from2Pt(v, target);
            let length = difference.length();
            if (length < 5) continue;
            e.add(difference.normalize().scale(Math.min(1, 500 / length)))
        } 
    }

    disturb(v: Vector2, strength: number, range: number)
    {
        // displace dt 
        this.dt.getVertices().forEach(e => {
            e.add(Vector2.fromRandomAngle().scale(Math.min(strength, range / e.disTo(v))))
        })
    }
}
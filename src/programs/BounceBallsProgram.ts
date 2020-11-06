import { Geon } from "../Geon";
import { Program } from "./Program";
import { Vector2 } from "../math/Vector2";

export class BounceBallsProgram extends Program
{
    points: Vector2[] = [];
    vectors: Vector2[] = [];

    count = 100;
    speed = 2;

    title = 'bounce_balls';

    start(geon: Geon)
    {
        this.points = new Array(this.count);
        this.vectors = new Array(this.count);
        for (let i = 0 ; i < this.count; i++)
        {
            this.points[i] = Vector2.fromRandom().mul(geon.bounds);
            this.vectors[i] = Vector2.fromRandom().sub(new Vector2(0.5, 0.5)).normalize();
        }

        console.log("created a bunch of points");
    }

    update(geon: Geon)
    {
        for (let i = 0 ; i < this.count; i++)
        {
            let p = this.points[i]; 
            let v = this.vectors[i]

            if (geon.mouseLeftDown)
            {
                // disrupt the vector, based on how closeby the mouse is
                let dir = Vector2.from2Pt(p, geon.mouse);
                let length = dir.length();
                dir.normalize().scale(Math.min(4, 100 / length));
                v.add(dir);
            }

            p.add(v);

            let length = v.length()
            if (length > this.speed)
            {
                v.setLength(length * 0.99);
            }

            // bounce at edge
            if (p.x < 0 || p.x > geon.bounds.x) v.x = -v.x;
            if (p.y < 0 || p.y > geon.bounds.y) v.y = -v.y;
        }

        // if mouse is nearby, move away from it
        if (geon.mouseRightPressed)
        {
            for(let i = 0; i < 100; i++)
            {
                this.count += 1;
                this.points.push(Vector2.fromRandom().mul(geon.bounds));
                this.vectors.push(Vector2.fromRandom().sub(new Vector2(0.5, 0.5)).normalize());
            }    
        }
    }

    draw(geon: Geon)
    { 
        this.points.forEach(p => geon.r.point(p.x, p.y));

        // draw at mouse position;
        if (geon.mouseLeftDown)
        {
            geon.r.point(geon.mouse.x, geon.mouse.y);
        }  
    }
}
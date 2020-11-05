import { Geon } from "../Geon";
import { Program } from "./Program";
import { Vector2 } from "../math/Vector2";
import { Line2 } from "../geo2/line2";

export class VoronoiProgram extends Program
{
    vectors: Vector2[] = [];
    lines: Line2[] = []

    start(geon: Geon)
    {
        this.vectors.push(new Vector2(geon.width / 2, geon.height / 2));
    }

    update(geon: Geon)
    {
        if (geon.mouseLeftPressed)
        {
            let prev = this.vectors[this.vectors.length-1];
            let add = Vector2.fromCopy(geon.mouse);
            this.vectors.push(add);
            this.lines.push(new Line2(prev, add));
        }

        // move all vectors
        let vel = this.getMovementVector(geon, 2, 5);
        this.vectors.forEach(v => v.add(vel));
    }

    draw(geon: Geon)
    {
        this.vectors.forEach(p => geon.r.point(p.x, p.y));
        this.lines.forEach(l => geon.r.line(l));
    }

    // ...

    private getMovementVector(geon: Geon, minspeed: number, maxspeed: number) : Vector2
    {
        let speed = minspeed;
        let velocity =  new Vector2(0,0);
        if (geon.IsKeyDown("shift"))
            speed = maxspeed;
        if (geon.IsKeyDown("arrowup") || geon.IsKeyDown("w"))
            velocity.add(new Vector2(0, 1));
        if (geon.IsKeyDown("arrowdown") || geon.IsKeyDown("s"))
            velocity.add(new Vector2(0, -1));
        if (geon.IsKeyDown("arrowleft") || geon.IsKeyDown("a"))
            velocity.add(new Vector2(1, 0));
        if (geon.IsKeyDown("arrowright") || geon.IsKeyDown("d"))
            velocity.add( new Vector2(-1, 0));
        return velocity.setLength(speed);
    }


}
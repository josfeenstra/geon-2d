import { Geon } from "../Geon";
import { Vector2 } from "../math/Vector2";

export class ProgramHelpers
{
    static getMovementVector(geon: Geon, minspeed: number, maxspeed: number) : Vector2
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
    
    

// author : Jos Feenstra

import { Vector2 } from "../math/Vector2";

export class Line2
{
    from: Vector2;
    to: Vector2;
    
    constructor(from: Vector2, to: Vector2)
    {
        this.from = from;
        this.to = to;
    }
}
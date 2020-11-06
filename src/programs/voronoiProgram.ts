import { Geon } from "../Geon";
import { Program } from "./Program";

import { Vector2 } from "../math/Vector2";
import { Line2 } from "../geo2/line2";
import { Delaunay } from "../2D/Delaunay";
import { ProgramHelpers } from "./ProgramHelpers";

export class VoronoiProgram extends Program
{
    dt = new Delaunay();
    switch = 0;

    start(geon: Geon)
    { 
        this.dt.Insert(new Vector2(geon.width / 2, geon.height / 2))
    }

    update(geon: Geon)
    {
        if (geon.mouseRightPressed)
        {
            let insertion = Vector2.fromCopy(geon.mouse);
            this.dt.Insert(insertion);
        }

        if (geon.IsKeyPressed('h'))
        {
            this.switch += 1;
            if (this.switch > 2) 
                this.switch = 0;   
        }

        // move all vectors
        let vel = ProgramHelpers.getMovementVector(geon, 2, 5);
    }

    draw(geon: Geon)
    {
        geon.r.points(this.dt.getVertices());
        
        if (this.switch == 1)
            geon.r.lineSegments(this.dt.getEdges());
        else if (this.switch == 2)
            geon.r.lineSegments(this.dt.getVoronoiEdges());
    }
}
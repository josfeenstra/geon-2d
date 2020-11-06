import { Geon } from "../Geon";
import { MetaProgram, Program } from "./Program";
import { Vector2 } from "../math/Vector2";
import { Line2 } from "../geo2/line2";

// metaprogram

export class SelectorMetaProgram extends MetaProgram
{
    programs: any[];
    current: number = 0;

    isAnimating: boolean = false;
    animationCounter = 1;
    comeback = false;

    constructor(programs: any[])
    {
        super();
        this.programs = programs;
        if (this.programs.length == 0) throw "Need at least 1 program!";
    }

    start(geon: Geon)
    {
        this.programs[this.current]
    }

    update(geon: Geon)
    {
        // listen for keypresses 
        // stupid i know. More specific listening would be better.
        for (let i = 1; i < 10; i++)
        {
            if (geon.IsKeyPressed(i.toString()))
            {
                this.prepareSwapProgram(i - 1);
                break;
            }
        }
    }

    draw(geon: Geon)
    {
        // draw instructions 
        if (geon.program != null) 
            geon.r.text(geon.program.title, new Vector2(10, 20));
        geon.r.text("tab using [1] - [2]", new Vector2(10, 50));
        geon.r.text("use left and right mouse button to interact", new Vector2(10, 80));
        if (geon.program != null) 
            geon.r.text(geon.program.description, new Vector2(10, 110));

        // draw transitions
        const speed = 0.015;
        if (this.isAnimating)
        {
            if (this.animationCounter > 1)
            {
                this.isAnimating = false;
            }
            geon.r.clearFade(1 - this.animationCounter);
            if (this.animationCounter > 0)
            {
                if (this.comeback)
                    this.animationCounter += speed;
                else 
                    this.animationCounter -= speed;
            }   
            else 
            {
                this.animationCounter += 0.01;
                this.comeback = true;
                this.swapProgram(geon);
            }
        }
    }

    prepareSwapProgram(num: number)
    {
        if (num < 0 || num >= this.programs.length) 
        {
            console.log("no program [" + num.toString() + "].")
            return;
        }       
        console.log("swapping to program " + num.toString());  

        // prepare for animation
        this.current = num;
        this.isAnimating = true;
        this.comeback = false;
        this.animationCounter = 1;

        // load
        

        // fade in
    }

    swapProgram(geon: Geon)
    {
        geon.load(new this.programs[this.current]());
    }
}
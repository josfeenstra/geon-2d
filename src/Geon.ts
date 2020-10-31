import { Renderer2D } from './2D/Renderer2D';
import { Program } from './geon/Program';
import { Vector2 } from './math/Vector2';
import { Vector3 } from './math/Vector3';

export class Geon
{
    tick: number;
    oldTime: number;
    newTime: number;
    program?: Program;

    width: number;
    height: number;
    bounds: Vector2;

    mouse: Vector2 = Vector2.zero();
    mouseLeftDown: boolean = false;
    mouseLeftPressed: boolean = false;
    private mouseLeftPrev: boolean = false;

    mouseRightDown: boolean = false;
    mouseRightPressed: boolean = false;
    private mouseRightPrev: boolean = false;

    mouseMiddleDown: boolean = false;
    mouseMiddlePressed: boolean = false;
    private mouseMiddlePrev: boolean = false;

    r: Renderer2D

    canvas: HTMLCanvasElement

    constructor(canvas: HTMLCanvasElement)
    {
        // window
        this.canvas = canvas;
        this.width = 0;
        this.height = 0;
        this.bounds = new Vector2(this.width, this.height)
        this.setWindow();
        // window.onresize = this.setWindow;

        // rendering
        this.r = new Renderer2D(canvas, this);  
        
        // time
        this.tick = 0;
        this.oldTime = Date.now();
        this.newTime = this.oldTime;

        // mouse
        canvas.onmousemove = this.setMousePos.bind(this);
        canvas.onmousedown = this.setMouseDown.bind(this);
        canvas.onmouseup = this.setMouseUp.bind(this);
        canvas.oncontextmenu = function(e) { 
            e.preventDefault(); e.stopPropagation(); // no menu
        }
    }

    public load(game: Program)
    {
        this.program = game;
        game.start(this);
        this.loop();
    }

    private loop()
    {
        function step(this: Geon) 
        {
            // update time
            this.newTime = Date.now();
            this.tick += (this.newTime - this.oldTime);
            this.oldTime = this.newTime;

            // update mouse
            this.mouseLeftPressed =  (this.mouseLeftPrev != this.mouseLeftDown) && this.mouseLeftDown;
            this.mouseRightPressed =  (this.mouseRightPrev != this.mouseRightDown) && this.mouseRightDown;
            this.mouseMiddlePressed =  (this.mouseMiddlePrev != this.mouseMiddleDown) && this.mouseMiddleDown;

            this.mouseLeftPrev = this.mouseLeftDown
            this.mouseRightPrev = this.mouseRightDown
            this.mouseMiddlePrev = this.mouseMiddleDown

            // TODO : dont update if nothing moved (?)
            this.program!.update(this);

            this.r.clear();
            this.program!.draw(this);

            // Call the game loop
            window.requestAnimationFrame(step.bind(this));
        }
        window.requestAnimationFrame(step.bind(this));
    }

    private setMousePos(e: MouseEvent)
    {
        this.mouse = new Vector2(e.clientX, e.clientY);
    }

    private setMouseUp(e: MouseEvent)
    {
        let code = e.buttons;
        if (code < 4) 
        {
            this.mouseMiddleDown = false;
        }
        if (code < 2) 
        {
            this.mouseRightDown = false;
        }
        if (code < 1) 
        {
            this.mouseLeftDown = false;
        } 
    }

    private setMouseDown(e: MouseEvent)
    {
        let code = e.buttons;
        if (code >= 4) 
        {
            code -= 4;
            this.mouseMiddleDown = true;
        }
        if (code >= 2) 
        {
            code -= 2;
            this.mouseRightDown = true;
        }
        if (code >= 1) 
        {
            code -= 1;
            this.mouseLeftDown = true;
        }       
    }

    private setWindow()
    {
        console.log("setting window...");

        this.canvas.width = document.body.clientWidth;
        this.canvas.height = document.body.clientHeight;
        this.canvas.style.width  = this.canvas.width + "px";
        this.canvas.style.height = this.canvas.height + "px";

        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.bounds = new Vector2(this.width, this.height);
    }
}





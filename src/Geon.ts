import { Renderer2 } from './2D/Renderer2';
import { Program } from './programs/Program';
import { Vector2 } from './math/Vector2';
import { Vector3 } from './math/Vector3';

export class Geon
{
    program?: Program;
    meta?: Program;
    looping: boolean = false;

    tick: number;
    oldTime: number;
    newTime: number;
    
    width: number;
    height: number;
    bounds: Vector2;

    private keysDown: IKeys = {};
    private keysPressed: string[] = [];

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

    r: Renderer2

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
        this.r = new Renderer2(canvas, this);  
        
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

        // keyboard
        canvas.setAttribute("tabindex", '0');
        canvas.onkeydown = this.onKeyDown.bind(this);
        canvas.onkeypress = this.onKeyPressed.bind(this);
        canvas.onkeyup = this.onKeyUp.bind(this);

        for(let i = 0; i < 223 ;i++)
        {
            this.keysDown[i] = false;
        }
    }

    // ...

    public load(game: Program)
    {
        this.program = game;
        game.start(this);

        if (!this.looping)
            this.loop();
    }

    public loadMeta(program: Program)
    {
        this.meta = program;
        program.start(this);
    }

    public IsKeyDown(key: string) : boolean
    {
        return this.keysDown[key];  
    }

    public IsKeyPressed(key: string) : boolean
    {
        return this.keysPressed.includes(key);
    }

    // ...

    private loop()
    {
        this.looping = true;
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

            // update metaprogram afterwards
            this.meta?.update(this);
            this.meta?.draw(this);

            // refresh keypresses
            this.keysPressed = [];
            
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

    private onKeyDown(e: KeyboardEvent)
    { 
        if (this.keysDown[e.key] == true) return;
        console.log(e.key);
        this.keysDown[e.key.toLowerCase()] = true;
        this.keysPressed.push(e.key);
    }

    private onKeyUp(e: KeyboardEvent)
    {
        this.keysDown[e.key.toLowerCase()] = false;
    }

    private onKeyPressed(e: KeyboardEvent)
    {

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

export interface IKeys 
{
    [key: string] : boolean
}

// export enum Key
// {
//     keyleft = 37,
//     keyup = 38,
//     keyright = 39,
//     keydown = 40,
//     key0 = 48,
//     key1 = 49,
//     key2 = 50,
//     key3 = 51,
//     key4 = 52,
//     key5 = 53,
//     key6 = 54,
//     key7 = 55,
//     key8 = 56,
//     key9 = 57,
// }

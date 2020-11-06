import { Geon } from "../Geon";

export class Program
{
    title = "";
    description = "";

    start(geon: Geon)
    {
        //  init geometry 
    }

    update(geon: Geon)
    {
        // update geometry
    }

    draw(geon: Geon)
    {
        // draw geometry
    }

    exit(geon: Geon)
    {
        // deallocate ? clean?
    }
}

// just a flag for now
export class MetaProgram extends Program
{

}
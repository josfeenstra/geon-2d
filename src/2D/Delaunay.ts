// author : Jos Feenstra
// TODO: extend from a generic triangulation? might be nice to have

import { Line2 } from "../geo2/line2";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";

export class Delaunay 
{
    private vts: Vector2[];
    private t: number[][]; // I WANT INTEGERS!

    constructor()
    {
        this.vts = [];
        this.t = [];

        // init big base triangle
        this.vts.push(new Vector2(-10000,-10000));
        this.vts.push(new Vector2(10000,-10000));
        this.vts.push(new Vector2(0, 10000));
        this.t.push([0, 1, 2, -1, -1 , -1]);
    }

    // ... Getters 

    public getVertices()
    {
        return this.vts;
    }

    public getEdges() : Vector2[]
    {
        let edges: Vector2[] = [];

        for(let tr of this.t)
        {
            let a = this.vts[tr[0]];
            let b = this.vts[tr[1]];
            let c = this.vts[tr[2]];

            edges.push(a);
            edges.push(b);
            edges.push(a);
            edges.push(c);
            edges.push(b);
            edges.push(c);
        }

        return edges;
    }

    public getVoronoiEdges() : Vector2[]
    {
        let edges: Vector2[] = [];
        let circumcenters = this.t.map(tr => 
            Vector2.fromCircumcenter(this.vts[tr[0]], this.vts[tr[1]], this.vts[tr[2]])
        );

        // per nb relation : if its not -1 : build an edge between nb cc's. 
        for(let i = 0 ; i < this.t.length ;i++)
        {
            let triangle = this.t[i];
            for(let ii = 3; ii < 6; ii++)
            {
                let nb = triangle[ii];
                if (nb == -1) continue;
                edges.push(circumcenters[i]);
                edges.push(circumcenters[nb]);
            }
        }

        return edges;
    }
    
    // ... Interface

    public Insert(insertion: Vector2)
    {
        // dont insert if too similar to existing 
        if (this.vts.some(v => insertion.roughlyEquals(v, 0.1)))
            { console.log("to close to existing point"); return; }

        // add it
        const inID = this.vts.length;
        this.vts.push(insertion);
        
        // get triangle and ID values
        const trID = this.selectTriangle(insertion);
        if (trID == -1)
            { console.log("triangle walk failed"); return; }
        const tr = this.t[trID];  

        const original_a_ID = tr[0];
        const original_b_ID = tr[1];
        const original_c_ID = tr[2];

        const original_bcID = tr[3];
        const original_caID = tr[4];
        const original_abID = tr[5];

        const abID = trID;
        const bcID = this.t.length;
        const caID = this.t.length + 1;

        // edit 1 triangle, add 2 new ones 
        this.t[trID] = [original_a_ID, original_b_ID, inID, bcID, caID, original_abID]; 
        this.t.push(   [original_b_ID, original_c_ID, inID, caID, abID, original_bcID]);
        this.t.push(   [original_c_ID, original_a_ID, inID, abID, bcID, original_caID]);

        // fix topology
        this.replaceNeighbor(original_bcID, trID, bcID);
        this.replaceNeighbor(original_caID, trID, caID);
        this.flipCorrection([abID, bcID, caID], inID)
    }

    // ... Util

    // store the last triangle
    private walkCursor = 0;
    private selectTriangle(target: Vector2) : number
    {
        // select a triangle based on a walking triangle algorithm
        const combinations = [[0,1,2], [1,2,0], [2,0,1]] 
        let trID = this.walkCursor;
        for (let _ = 0; _ < this.t.length; _++)
        {
            for (let c of combinations)
            {
                let sign = Vector2.getSign(
                    target, 
                    this.vts[this.t[trID][c[0]]], 
                    this.vts[this.t[trID][c[1]]]);
                if (sign < 0)
                {
                    trID = this.getNeighborTriangle(trID, this.t[trID][c[2]]);
                    break;
                }

                if (c[0] == 2)
                {
                    this.walkCursor = trID;
                    return trID;
                }
            }
        }

        // too many steps have been taken
        return -1;
    }

    private flipCorrection(tr_IDS: number[], inID:number)
    {
        // flip until graph is delaunay
        
    }

    // ... Helpers

    private replaceNeighbor(trID: number, nbOld: number, nbNew: number)
    {
        // there are prettier ways, but this is fast
        if (trID == -1) return;
        if(      this.t[trID][3] == nbOld)  this.t[trID][3] = nbNew;
        else if( this.t[trID][4] == nbOld)  this.t[trID][4] = nbNew;
        else if( this.t[trID][5] == nbOld)  this.t[trID][5] = nbNew;
        else
            console.log("replace neighbor failed!");
    }

    private getNeighborTriangle(triangleID: number, pointID: number) : number
    {
        let index = this.t[triangleID].indexOf(pointID) + 3
        return this.t[triangleID][index];
    }

    private getNeighborPoint(triangleID: number, neighborID: number) : number
    {
        let index = this.t[triangleID].indexOf(neighborID) - 3
        return this.t[triangleID][index];
    }
}
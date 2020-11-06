// author : Jos Feenstra
// TODO: extend from a generic triangulation? might be nice to have

import { Line2 } from "./line2";
import { Vector2 } from "../math/Vector2";
import { Vector3 } from "../math/Vector3";

export class Delaunay 
{
    private pts: Vector2[];
    private trs: number[][]; // I WANT INTEGERS!

    private cc: Vector2[];

    constructor()
    {
        this.pts = [];
        this.trs = [];
        this.cc = [];

        // init big base triangle
        this.pts.push(new Vector2(-10000,-10000));
        this.pts.push(new Vector2(10000,-10000));
        this.pts.push(new Vector2(0, 10000));
        this.trs.push([0, 1, 2, -1, -1 , -1]);
    }

    // ... Getters 

    public getVertices()
    {
        return this.pts;
    }

    public getEdges() : Vector2[]
    {
        let edges: Vector2[] = [];

        for(let tr of this.trs)
        {
            let a = this.pts[tr[0]];
            let b = this.pts[tr[1]];
            let c = this.pts[tr[2]];

            edges.push(a);
            edges.push(b);
            edges.push(a);
            edges.push(c);
            edges.push(b);
            edges.push(c);
        }

        return edges;
    }

    public getCC()
    {
        return {cc: this.cc, r: this.cc.map((c, i) => c.disTo(this.pts[this.trs[i][0]]))};
    }

    public calculateCC()
    {
        this.cc = this.trs.map(tr => 
            Vector2.fromCircumcenter(this.pts[tr[0]], this.pts[tr[1]], this.pts[tr[2]])
        );
    }

    public getVoronoiEdges(calculateCC = false) : Vector2[]
    {
        let edges: Vector2[] = [];

        if (calculateCC || this.cc.length != this.trs.length)
            this.calculateCC();
        
        // per nb relation : if its not -1 : build an edge between nb cc's. 
        for(let i = 0 ; i < this.trs.length ;i++)
        {
            let triangle = this.trs[i];
            for(let ii = 3; ii < 6; ii++)
            {
                let nb = triangle[ii];
                if (nb == -1) continue;
                edges.push(this.cc[i]);
                edges.push(this.cc[nb]);
            }
        }
        return edges;
    }
    
    // ... Interface

    public Insert(insertion: Vector2) : boolean
    {
        // dont insert if too similar to existing 
        if (this.pts.some(v => insertion.roughlyEquals(v, 0.1)))
            { console.log("to close to existing point"); return false; }

        // add it
        const inID = this.pts.length;
        this.pts.push(insertion);
        
        // get triangle and ID values
        const trID = this.selectTriangle(insertion);
        if (trID == -1)
            { console.log("triangle walk failed"); return false; }
        const tr = this.trs[trID];  

        const original_a_ID = tr[0];
        const original_b_ID = tr[1];
        const original_c_ID = tr[2];

        const original_bcID = tr[3];
        const original_caID = tr[4];
        const original_abID = tr[5];

        const abID = trID;
        const bcID = this.trs.length;
        const caID = this.trs.length + 1;

        // edit 1 triangle, add 2 new ones 
        this.trs[trID] = [original_a_ID, original_b_ID, inID, bcID, caID, original_abID]; 
        this.trs.push(   [original_b_ID, original_c_ID, inID, caID, abID, original_bcID]);
        this.trs.push(   [original_c_ID, original_a_ID, inID, abID, bcID, original_caID]);

        // fix topology
        this.replaceNeighbor(original_bcID, trID, bcID);
        this.replaceNeighbor(original_caID, trID, caID);
        this.makeDelaunay([abID, bcID, caID], inID)

        // succes!
        return true;
    }

    // ... Util

    // store the last triangle
    private walkCursor = 0;
    private selectTriangle(target: Vector2) : number
    {
        // select a triangle based on a walking triangle algorithm
        const combinations = [[0,1,2], [1,2,0], [2,0,1]] 
        let trID = this.walkCursor;
        for (let _ = 0; _ < this.trs.length; _++)
        {
            for (let c of combinations)
            {
                if (trID == -1) 
                    return -1;
                let sign = Vector2.getSign(
                    target, 
                    this.pts[this.trs[trID][c[0]]], 
                    this.pts[this.trs[trID][c[1]]]);
                if (sign < 0)
                {
                    trID = this.getNeighborTriangle(trID, this.trs[trID][c[2]]);
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
        this.walkCursor = 0;
        return -1;
    }

    private makeDelaunay(trIDS: number[], pID:number)
    {
        // flip until graph is delaunay
        while(trIDS.length > 0)
        {
            let trID = trIDS.pop()!;
            let tr = this.trs[trID];
            let nbID = this.getNeighborTriangle(trID, pID);
            if (nbID == -1) continue;

            let qID = this.getNeighborPoint(nbID, trID);
            let q = this.pts[qID];
            let c = Vector2.fromCircumcenter(this.pts[tr[0]], this.pts[tr[1]], this.pts[tr[2]]);
            if (c.equals(Vector2.NaN()))
            {
                continue;
            }
            
            let radius = c.disTo(this.pts[tr[0]])
            if (c.disTo(q) < radius)
            {
                // flip!

                // points p, q, r and s
                const rID = tr[0];
                const sID = tr[1];
                
                // foreign neighbors 
                const fnb_1 = this.getNeighborTriangle(trID, rID);
                const fnb_2 = this.getNeighborTriangle(trID, sID);
                const fnb_3 = this.getNeighborTriangle(nbID, rID);
                const fnb_4 = this.getNeighborTriangle(nbID, sID);

                this.replaceNeighbor(fnb_1, trID, nbID);
                this.replaceNeighbor(fnb_4, nbID, trID);

                this.trs[trID] = [rID, qID, pID, nbID, fnb_2, fnb_4];
                this.trs[nbID] = [qID, sID, pID, fnb_1, trID, fnb_3];

                trIDS.push(trID);
                trIDS.push(nbID);
            }
        }
    }

    // ... Helpers

    private replaceNeighbor(trID: number, nbOld: number, nbNew: number)
    {
        // there are prettier ways, but this is fast
        if (trID == -1) return;
        if(      this.trs[trID][3] == nbOld)  this.trs[trID][3] = nbNew;
        else if( this.trs[trID][4] == nbOld)  this.trs[trID][4] = nbNew;
        else if( this.trs[trID][5] == nbOld)  this.trs[trID][5] = nbNew;
        else
            console.log("replace neighbor failed!");
    }

    private getNeighborTriangle(triangleID: number, pointID: number) : number
    {
        let index = -1;
        if (this.trs[triangleID][0] == pointID) index = 3;
        if (this.trs[triangleID][1] == pointID) index = 4;
        if (this.trs[triangleID][2] == pointID) index = 5;
        return this.trs[triangleID][index];
    }

    private getNeighborPoint(triangleID: number, neighborID: number) : number
    {
        let index = -1;
        if (this.trs[triangleID][3] == neighborID) index = 0;
        if (this.trs[triangleID][4] == neighborID) index = 1;
        if (this.trs[triangleID][5] == neighborID) index = 2;
        return this.trs[triangleID][index];
    }
}
﻿import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';

import { Node } from './node'

@Injectable()
export class NodeService {
    private nodes: Node[];

    createNode(id: String, offset: any, summary: String, branch: number, branchDepth: number): Node {
        var node = new Node();
        node.id = id;
        node.offset = offset;
        node.summary = summary;
        node.height = 20;
        node.width = 30;
        node.branch = branch;
        node.branchDepth = branchDepth;
        return node;
    }

    getNodes(): Promise<Node[]> {

        if (this.nodes)
            return Promise.resolve(this.nodes);

        var rn = this.createNode('rn', { top: 200, left: 400 }, 'RN', 0, 0);
        var cn1 = this.createNode('cn1', { top: 250, left: 600 }, 'CN1', 1, 1);
        var gn1_1 = this.createNode('gn', { top: 300, left: 800 }, 'GN1.1', 1, 2);

        var cn2 = this.createNode('cn2', { top: 250, left: 600 }, 'CN2', 2, 1);
        var cn3 = this.createNode('cn3', { top: 250, left: 600 }, 'CN3', 3, 1);
        var cn4 = this.createNode('cn4', { top: 250, left: 600 }, 'CN4', 4, 1);

        rn.children = [cn1, cn2, cn3, cn4];
        cn1.parent = rn;
        cn1.children = [gn1_1];
        gn1_1.parent = cn1;

        cn2.parent = rn;
        cn3.parent = rn;
        cn4.parent = rn;

        this.nodes = [rn, cn1, cn2, cn3, cn4, gn1_1];
        return Promise.resolve(this.nodes);
    }

    getRootNode(): Promise<Node>{
        return this.getNodes().then(nodes => nodes.find(n => n.branch === 0) );
    }

    selectNode(node: Node): void {
        for(let n of this.nodes){
            n.selected = n.id === node.id;
        }
    }

}
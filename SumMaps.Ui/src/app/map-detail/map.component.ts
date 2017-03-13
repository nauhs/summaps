import { Component } from '@angular/core'
import { Node } from './node'

let createNode = (id: String, offset: any, summary: String) => {
    var node = new Node();
    node.id = id;
    node.offset = offset;
    node.summary = summary;
    node.height = 40;
    node.width = 60;
    return node;
}

var rn = createNode('rn', { top: 200, left: 400 }, 'RN');
var cn = createNode('cn', { top: 250, left: 600 }, 'CN');
var gn = createNode('gn', { top: 300, left: 800 }, 'GN');
rn.children = [cn];
cn.parent = rn;
cn.children = [gn];
gn.parent = cn;


@Component({
    selector: 'map',
    template: `<div style="border:solid 1px #AAAAAA">
                <node [node] = rootNode></node> 
                </div>`
})
export class MapComponent {
    rootNode: Node = rn;
}

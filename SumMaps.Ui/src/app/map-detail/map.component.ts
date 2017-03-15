import { Component, OnInit } from '@angular/core'
import { Node } from './node'

import { NodeService } from './node.service'


@Component({
    selector: 'map',
    template: `<div style="border:solid 1px #AAAAAA">
                <node *ngIf='rootNode' [node] = rootNode></node> 
                </div>`
})
export class MapComponent implements OnInit {
    rootNode: Node;

    constructor(private nodeService: NodeService) {
    }

    ngOnInit(): void {
        this.nodeService.getRootNode().then(r => { this.rootNode = r; });
    }
}

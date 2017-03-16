import { Component, ViewChild, ElementRef, Input, DoCheck } from '@angular/core';
declare var $: JQueryStatic;

import { Node } from './node'
import { NodeStyleConstants } from './map-detail-style-constants'
import { Point } from './point'
import { MapDetailUiService } from './map-detail-ui-service'

@Component({
    selector: 'node-path',
    template: `<svg #path_from_parent xmlns="http://www.w3.org/2000/svg" style="position:absolute; z-index:-10">
                        <path id="mypath" d="M0,0 q10,0 200,0" stroke="green" stroke-width="5" fill="none" />
                        <!--<path id="c1" d="M0,0 q10,0 200,0" stroke="black" stroke-width="5" fill="none" />
                        <path id="c2" d="M0,0 q10,0 200,0" stroke="black" stroke-width="5" fill="none" />-->
                    </svg>
                `,
                
})
export class PathComponent implements DoCheck {
    @ViewChild('path_from_parent') pathEl : ElementRef
    @Input() startNode: Node
    @Input() endNode: Node

    private lineWidth = 3;
    private prevStartNode: Node
    private prevEndNode: Node

    constructor(private mapDetailUiService: MapDetailUiService) {
    }

    ngDoCheck(): void {

        if (this.startNode && this.endNode && this.redrawRequired) {
            let pathCoords = this.mapDetailUiService.getPathCoords(this.startNode, this.endNode);

            $(this.pathEl.nativeElement).offset({ left: pathCoords.canvasOffset.x, top: pathCoords.canvasOffset.y });

            $(this.pathEl.nativeElement).css('width', pathCoords.canvasDimensions.x + 3);
            $(this.pathEl.nativeElement).css('height', pathCoords.canvasDimensions.y + 3);

            let dVal = 'M' + pathCoords.startCoord.x + ',' + pathCoords.startCoord.y + ' c' + pathCoords.cCoord1.x + ',' + pathCoords.cCoord1.y + ' ' + pathCoords.cCoord2.x + ',' + pathCoords.cCoord2.y + ' ' + pathCoords.diffCoord.x + ',' + pathCoords.diffCoord.y;
            $(this.pathEl.nativeElement).children('#mypath').attr('d', dVal);

            this.prevEndNode = this.endNode;
            this.prevStartNode = this.startNode;
        }
        
        

    }

    redrawRequired(): boolean {
        return !this.prevStartNode ||
            !this.prevStartNode.samePlaceSameShape(this.startNode) ||
            !this.prevEndNode.samePlaceSameShape(this.endNode);
    }

    
}

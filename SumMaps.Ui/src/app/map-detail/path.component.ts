import { Component, ViewChild, ElementRef, Input, DoCheck } from '@angular/core';
declare var $: JQueryStatic;

import { Node } from './node'

export class Point {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export class PathCoords {

    canvasOffset: Point;
    canvasDimensions: Point;
    startCoord: Point;
    diffCoord: Point;
    cCoord1: Point;
    cCoord2: Point;
}

@Component({
    selector: 'node-path',
    template: `<svg #path_from_parent xmlns="http://www.w3.org/2000/svg" style="position:absolute; z-index:-10">
                        <path id="mypath" d="M0,0 q10,0 200,0" stroke="green" stroke-width="5" fill="none" />
                        <!--<path id="c1" d="M0,0 q10,0 200,0" stroke="black" stroke-width="5" fill="none" />
                        <path id="c2" d="M0,0 q10,0 200,0" stroke="black" stroke-width="5" fill="none" />-->
                    </svg>
                `
                
})
export class PathComponent implements DoCheck {
    @ViewChild('path_from_parent') pathEl : ElementRef
    @Input() startNode: Node
    @Input() endNode: Node

    private lineWidth = 3;
    private padding = 20
    private prevStartNode: Node
    private prevEndNode: Node


    ngDoCheck(): void {

        if (this.redrawRequired) {
            let pathCoords = this.getPathCoords();

            $(this.pathEl.nativeElement).offset({ left: pathCoords.canvasOffset.x, top: pathCoords.canvasOffset.y });

            $(this.pathEl.nativeElement).css('width', pathCoords.canvasDimensions.x + 3);
            $(this.pathEl.nativeElement).css('height', pathCoords.canvasDimensions.y + 3);

            let dVal = 'M' + pathCoords.startCoord.x + ',' + pathCoords.startCoord.y + ' c' + pathCoords.cCoord1.x + ',' + pathCoords.cCoord1.y + ' ' + pathCoords.cCoord2.x + ',' + pathCoords.cCoord2.y + ' ' + pathCoords.diffCoord.x + ',' + pathCoords.diffCoord.y;
            $(this.pathEl.nativeElement).children('#mypath').attr('d', dVal);

            this.prevEndNode = this.endNode;
            this.prevStartNode = this.startNode;

            //dVal = 'M' + (startCoord.x + cCoord1.x) + ',' + (startCoord.y + cCoord1.y) + ' l1,1';
            //$(this.pathEl.nativeElement).children('#c1').attr('d', dVal);

            //dVal = 'M' + (startCoord.x + cCoord2.x) + ',' + (startCoord.y + cCoord2.y) + ' l1,1';
            //$(this.pathEl.nativeElement).children('#c2').attr('d', dVal);
        }
        
        

    }

    redrawRequired(): boolean {
        return !this.prevStartNode ||
            !this.prevStartNode.samePlaceSameShape(this.startNode) ||
            !this.prevEndNode.samePlaceSameShape(this.endNode);
    }

    getMidpoint(node: Node): Point {
        let x = node.offset.left + (node.width / 2) + this.padding;
        let y = node.offset.top + (node.height / 2) + this.padding;
        return { x: x, y: y };
    }

    getPathCoords(): PathCoords {
        let startPoint = this.getMidpoint(this.startNode);
        let endPoint = this.getMidpoint(this.endNode);

        let width = Math.abs(startPoint.x - endPoint.x)
        let height = Math.abs(startPoint.y - endPoint.y);

        let canvasOffset: Point;
        let startCoord: Point;
        let diffCoord: Point;
        let cCoord1: Point;
        let cCoord2: Point;


        let hypotenuse = Math.sqrt((width * width) + (height * height));
        let atan = Math.atan(height / width);
        let sin = Math.sin(atan * 4);
        let cos = Math.cos(atan * 4);
        let ampX = sin * .4 * width;
        let ampY = cos * .4 * height;

        // Q1 | Q2
        // ___|___
        //    |
        // Q4 | Q3

        // Quadrant 1
        if ((startPoint.x < endPoint.x) && (startPoint.y < endPoint.y)) {
            canvasOffset = new Point(startPoint.x, startPoint.y);
            startCoord = new Point(0, 0);
            diffCoord = new Point(width, height);
            cCoord1 = new Point(((.25 * width) + ampX), ((.25 * height) + ampY));
            cCoord2 = new Point(((.75 * width) - ampX), ((.75 * height) - ampY));
        }
        // Quadrant 2
        else if ((startPoint.x >= endPoint.x) && (startPoint.y < endPoint.y)) {
            canvasOffset = new Point(endPoint.x, startPoint.y);
            startCoord = new Point(width, 0);
            diffCoord = new Point(-width, height);
            cCoord1 = new Point(-((.25 * width) + ampX), ((.25 * height) + ampY));
            cCoord2 = new Point(-((.75 * width) - ampX), ((.75 * height) - ampY));
        }
        // Quadrant 3
        else if ((startPoint.x >= endPoint.x) && (startPoint.y >= endPoint.y)) {
            canvasOffset = new Point(endPoint.x, endPoint.y);
            startCoord = new Point(width, height);
            diffCoord = new Point(-width, -height);
            cCoord1 = new Point(-((.25 * width) + ampX), -((.25 * height) + ampY));
            cCoord2 = new Point(-((.75 * width) - ampX), -((.75 * height) - ampY));
        }
        // Quadrant 4
        else if ((startPoint.x < endPoint.x) && (startPoint.y >= endPoint.y)) {
            canvasOffset = new Point(startPoint.x, endPoint.y);
            startCoord = new Point(0, height);
            diffCoord = new Point(width, -height);
            cCoord1 = new Point(((.25 * width) + ampX), -((.25 * height) + ampY));
            cCoord2 = new Point(((.75 * width) - ampX), -((.75 * height) - ampY));
        }

        let pathCoords = new PathCoords;
        pathCoords.canvasOffset = canvasOffset;
        pathCoords.startCoord = startCoord;
        pathCoords.diffCoord = diffCoord;
        pathCoords.cCoord1 = cCoord1;
        pathCoords.cCoord2 = cCoord2;
        pathCoords.canvasDimensions = new Point(width, height);

        return pathCoords;
    }
    
}

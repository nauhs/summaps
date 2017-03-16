import {Injectable} from '@angular/core'

import { Node } from './node'
import { Point } from './point'
import { PathCoords } from './path-coords'
import { NodeStyleConstants } from './map-detail-style-constants'

Injectable()
export class MapDetailUiService {

    getNodeMidpoint(node: Node): Point {
        let x = node.offset.left + (node.width / 2) + NodeStyleConstants.padding;
        let y = node.offset.top + (node.height / 2) + NodeStyleConstants.padding;
        return { x: x, y: y };
    }

    getPathCoords(startNode: Node, endNode: Node): PathCoords {
        let startPoint = this.getNodeMidpoint(startNode);
        let endPoint = this.getNodeMidpoint(endNode);

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

    getNewNodeOffset(parentNode: Node): any {
        // if root and no children
        //    place horizontal child
        // else if child and no children
        //    create new child on same slope as parent
        // rotate 20 deg from "last child"

        let slopeFromParent: Point;

        if (!parentNode.parent) {
            if (!parentNode.children || parentNode.children.length === 0)
                return { x: parentNode.offset.left + 75, y: parentNode.offset.top };
            else {
                let vacantAngle = this.getVacantAngle(parentNode, { x: 1, y: 0 })
                console.log('vacant angle: ' + vacantAngle);
                let position = this.getNodePosition(parentNode, vacantAngle);
                console.log('position: ' + position); 
                return { left: position.x, top: position.y };
            }

        }
        else {
            if (!parentNode.children || parentNode.children.length === 0) {
                slopeFromParent = this.calculateSlope(parentNode);
                let amp = 120 / Math.sqrt((slopeFromParent.x * slopeFromParent.x) + (slopeFromParent.y) * (slopeFromParent.y));
                let x = parentNode.offset.left + (amp * slopeFromParent.x);
                let y = parentNode.offset.top + (amp * slopeFromParent.y);
                return { left: x, top: y };
            }
            else {
                let vacantAngle = this.getVacantAngle(parentNode, { x: 1, y: 0 })
                console.log('vacant angle: ' + vacantAngle);
                let position = this.getNodePosition(parentNode, vacantAngle);
                console.log(position);
                return { left: position.x, top: position.y };
            }
        }

        
    }

    calculateSlope(node: Node) : Point {
        let parentMid = this.getNodeMidpoint(node.parent);
        let childMid = this.getNodeMidpoint(node);
        return { x: childMid.x - parentMid.x, y: childMid.y - parentMid.y };
    }

    getNodePosition(parentNode: Node, angle: number): Point {
        
        let tan = Math.tan(angle);
        console.log('tan: ' + tan);
        let parentMid = this.getNodeMidpoint(parentNode);
        let amp = 150;

        let x = Math.sqrt((tan * tan * amp * amp) / ((tan * tan) + 1));
        let y = Math.sqrt((amp * amp) / ((tan * tan) + 1));

        console.log('x:');
        console.log(x);
        console.log(parentNode.offset.left + x);

        console.log('y:');
        console.log(y);
        console.log(parentNode.offset.top + y);

        return {
            x: parentNode.offset.left + x,
            y: parentNode.offset.top + y
        };
    }

    getVacantAngle(node: Node, slopeFromParent: Point): number {
        let angles: Array<number> = [];

        if (node.children.length == 1)
            return 0;

        for (let c of node.children) {
            let angle = this.calculateAngleDiff(slopeFromParent, this.calculateSlope(c));
            console.log(angle);
            angles.push(angle);
        }

        let sortedAngles = angles.sort((a1, a2) => (a1 > a2) ? 1 : ((a1 == a2) ? 0 : -1));

        let a1: number, a2: number, maxDiff: number = 0;
        
        for (let i = 1; i < sortedAngles.length; i++) {
            let diff = Math.abs(sortedAngles[i] - sortedAngles[i - 1]);
            if (diff > maxDiff) {
                a1 = sortedAngles[i - 1];
                a2 = sortedAngles[i];
                maxDiff = diff;
            }
        }

        return a1 + ((a2 - a1) / 2);


    }

    calculateAngleDiff(baseLine: Point, offset: Point): number {
        //console.log('baseline');
        //console.log(baseLine);
        //console.log('offset');
        //console.log(offset);
        //console.log(Math.atan(offset.y / offset.x));
        //console.log(Math.atan(baseLine.y / baseLine.x));
        let direction = 1;
        let baseLineSlope = baseLine.y / baseLine.x;
        let offsetSlope = offset.y / offset.x;

        //if (((baseLineSlope < 1 && offsetSlope > 1) || (baseLineSlope > 1 && offsetSlope < 1)))
        //    direction = -1;
        console.log('baseline: ' + Math.atan(baseLine.y / baseLine.x) + ' offset:' + Math.atan(offset.y / offset.x) + ' direction:' + direction);
        var angle = Math.atan((direction) * offset.y / offset.x) - Math.atan(baseLine.y / baseLine.x);
        return angle + (offset.x < 0 ? Math.PI : 0);
    }
} 
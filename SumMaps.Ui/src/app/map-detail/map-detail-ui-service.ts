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
        let slopeFromParent: Point;

        if (!parentNode.parent) {
            if (!parentNode.children || parentNode.children.length === 0)
                return { x: parentNode.offset.left + 75, y: parentNode.offset.top };
            else {
                let baseAngle = 0;
                let newAngle = this.getRelativeAngleForNewNode(parentNode, baseAngle)
                let position = this.getNodePosition(parentNode, newAngle, baseAngle);
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
                let slopeFromParent = this.calculateSlope(parentNode);
                let baseAngle = Math.atan2(slopeFromParent.y, slopeFromParent.x);
                let newAngle = this.getRelativeAngleForNewNode(parentNode, baseAngle);
                let position = this.getNodePosition(parentNode, newAngle, baseAngle);
                return { left: position.x, top: position.y };
            }
        }

        
    }

    calculateSlope(node: Node) : Point {
        let parentMid = this.getNodeMidpoint(node.parent);
        let childMid = this.getNodeMidpoint(node);
        return { x: childMid.x - parentMid.x, y: childMid.y - parentMid.y };
    }

    /// we need the relative angle, not the absolute angle
    getNodePosition(parentNode: Node, relativeAngle: number, baseAngle: number): Point {
        
        let tan = Math.tan(relativeAngle);
        console.log('angle: ' + relativeAngle + ' tan: ' + tan);
        let parentMid = this.getNodeMidpoint(parentNode);
        let amp = 150;
        
        let xMultiplier = 1;
        //if (((angle > .5 * Math.PI) && (angle < 1.5 * Math.PI)) || ((angle > -1.5 * Math.PI) && (angle < -.5 * Math.PI)))
        //    xMultiplier = -1;

        let yMultiplier = 1;
        //if ((angle < 0) || angle > Math.PI)
        //    yMultiplier = -1;
        
        let y = Math.sqrt((tan * tan * amp * amp) / ((tan * tan) + 1));
        let x = Math.sqrt((amp * amp) / ((tan * tan) + 1));

        if(
        
        return {
            x: parentNode.offset.left + (xMultiplier * x),
            y: parentNode.offset.top + (yMultiplier * y)
        };
    }

    getRelativeAngleForNewNode(node: Node, baseAngle: number): number {
        let angles: Array<number> = [];

        //if (node.children.length == 1)
        //    return this.calculateAbsoluteAngle(Math.atan2(slopeFromParent.y, slopeFromParent.x), .2 * Math.PI);

        for (let c of node.children) {
            // get angles relative to the base line which is the line from this node to its parent
            let angle = this.calculateAngleDiff(baseAngle, this.calculateSlope(c));
            console.log('angle: ' + angle);
            angles.push(angle);
        }

        let sortedAngles = angles.sort((a1, a2) => (a1 > a2) ? 1 : ((a1 == a2) ? 0 : -1));

        let a1: number, a2: number, maxDiff: number = 0;

        // if this is a root node, create child nodes at any angle
        // if this is a child node, don't create child nodes at angles greater than 90 degrees
        let boundaryAngle = (!node.parent ? Math.PI : Math.PI / 2);

        angles.push(boundaryAngle);
        angles.push(-boundaryAngle);
        
        for (let i = 1; i < sortedAngles.length; i++) {
            
            if (sortedAngles[i] > boundaryAngle || sortedAngles[i] < -boundaryAngle)
                continue;

            let diff = sortedAngles[i] - sortedAngles[i - 1];
            
            if (diff > maxDiff) {
                a1 = sortedAngles[i - 1];
                a2 = sortedAngles[i];
                maxDiff = diff;
            }
        }

        //console.log('a1:' + a1 + ' a2:' + a2 + ' diff:' + (a2 - a1) / 2) + ' vacant angle: ' + a1 + ((a2 - a1) / 2));
        console.log('a1:' + a1 + ' a2:' + a2);
        //return this.calculateAbsoluteAngle(Math.atan2(slopeFromParent.y, slopeFromParent.x), a1 + ((a2 - a1) / 2));
        return a1 + ((a2 - a1) / 2);
    }

    calculateAbsoluteAngle(baselineAngle: number, relativeAngle: number) {
        return baselineAngle + relativeAngle;
    }
    calculateAngleDiff(baseAngle: number, offset: Point): number {
        var angle = Math.atan2(offset.y, offset.x) - baseAngle;
        return angle;
    }
    

    

} 
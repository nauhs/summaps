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
                slopeFromParent = this.getSlopeFromParent(parentNode);
                let deltaCoords = this.getCoordsFromSlopeAndAmplitude(slopeFromParent, 120);
                return { left: parentNode.offset.left + deltaCoords.x, top: parentNode.offset.top + deltaCoords.y };
            }
            else {
                let slopeFromParent = this.getSlopeFromParent(parentNode);
                let baseAngle = Math.atan2(slopeFromParent.y, slopeFromParent.x);
                let newAngle = this.getRelativeAngleForNewNode(parentNode, baseAngle);
                let position = this.getNodePosition(parentNode, newAngle, baseAngle);
                return { left: position.x, top: position.y };
            }
        }

        
    }

    getCoordsFromSlopeAndAmplitude(slope: Point, amplitude: number): Point {
        let amp = amplitude / Math.sqrt((slope.x * slope.x) + (slope.y) * (slope.y));
        let x = (amp * slope.x);
        let y = (amp * slope.y);
        return { x: x, y: y };
    }

    getSlopeFromAngle(angle: number): Point {

        let tan = Math.abs(Math.tan(angle));
        let quadrant = this.getQuadrant(angle);
        

        // note: slope is adjusted for SVC coordinate system where (0,0) is upper left corner
        // NOT calculated off of cartesian coordinate system where (0,0) is middle
        // thus y value is multiplied by -1
        //if (quadrant == 1) 
        //    return { x: 1, y: -aTan };
        //else if (quadrant == 2) 
        //    return { x: -1, y: -aTan };
        //else if (quadrant == 3)
        //    return { x: -1, y: aTan };
        //else (quadrant == 4)
        //    return { x: 1, y: aTan };
        return { x: 1, y: tan };
    }

    getSlopeFromParent(node: Node) : Point {
        let parentMid = this.getNodeMidpoint(node.parent);
        let childMid = this.getNodeMidpoint(node);
        return { x: childMid.x - parentMid.x, y: childMid.y - parentMid.y };
    }

    getQuadrant(angle: Number): Number {
        if ((-2 * Math.PI) <= angle && angle < (-1.5 * Math.PI))
            return 4;
        else if ((-1.5 * Math.PI) <= angle && angle < (-1 * Math.PI))
            return 3;
        else if ((-1 * Math.PI) <= angle && angle < (-0.5 * Math.PI))
            return 2;
        else if ((-.5 * Math.PI) <= angle && angle <= 0)
            return 1;
        else if (0 < angle && angle <= (0.5 * Math.PI))
            return 4;
        else if (((0.5 * Math.PI) < angle) && angle <= Math.PI)
            return 3;
        else if ((Math.PI < angle) && angle <= (1.5 * Math.PI))
            return 2;
        else
            return 1;
    }

    /// we need the relative angle, not the absolute angle
    getNodePosition(parentNode: Node, relativeAngle: number, baseAngle: number): Point {
        
        // we need to the points on the new line defined by relative angle that will be 150px
        // away from the parent node.  this is essentially finding the intersections of a circle and a line
        

        // first coefficients for the equation of the line: 
        // y = mx + b
        let m = Math.tan(baseAngle + relativeAngle);  // todo, sometimes subtract

        // if m is essentially a straight line we can do simpler stuff
        if (m > 1000)
            return { x: parentNode.offset.left, y: parentNode.offset.top - 150 };

        if (Math.abs(m) < 1 / 1000)
            return { x: parentNode.offset.left - 150, y: parentNode.offset.top};

        let b = parentNode.offset.top - (m * parentNode.offset.left);
        console.log('total angle: ' + (baseAngle + relativeAngle) + ' m: ' + m + ' b: ' + b);

        // using trig concepts outlined here:
        // http://math.stackexchange.com/questions/311921/get-location-of-vector-circle-intersection
        //
        // the equation for our circle is (x-j)^2 + (y-k)^2 = 150^2 where (j,k) is the coordinate for the parent node
        // to solve for x, replace y with mx + b in the circle equation
        // we get a quadratic equation:
        // (m^2 + 1)x^2 + (2m(b-k) - 2j)x + (b-k)^2 + j^2 - 150^2 = 0
        //
        // this can be written as: dx^2 + ex + f = 0
        // and then we can apply a formula to solve for x
        //
        let j = parentNode.offset.left;
        let k = parentNode.offset.top;

        let d = (m * m) + 1;
        let e = (2 * m * (b - k)) - (2 * j);
        let f = (b - k) * (b - k) + (j * j) - (150 * 150);

        // solve for x
        // x = (-e +- Math.sqrt(e^2 - 4df)) / 2d
        let x = (-e + Math.sqrt((e * e) - (4 * d * f))) / (2 * d);

        // solve for y
        // y = mx + b
        let y = (m * x) + b;

        console.log(x + ',' + y);
        return { x: x, y: y };







        //console.log('base: ' + baseAngle + ' rel: ' + relativeAngle);
        //let amp = 150;

        //// get coordinates for base node
        //let slope = this.getSlopeFromAngle(baseAngle);
        //console.log('baseSlope, deltaCoords');
        //console.log(slope);
        //let deltaCoords = this.getCoordsFromSlopeAndAmplitude(slope, amp);
        //console.log(deltaCoords);
        //let baseNode = { x: parentNode.offset.left + deltaCoords.x, y: parentNode.offset.top + deltaCoords.y };

        //// get delta coords for relative angle
        //let relativeSlope = this.getSlopeFromAngle(relativeAngle);
        //let relativeCoords = this.getCoordsFromSlopeAndAmplitude(relativeSlope, amp);
        //console.log('relSlope, relativeCoords');
        //console.log(relativeSlope);
        //console.log(relativeCoords);

        //let quadrant = this.getQuadrant(relativeAngle);
        //let coords: Point;
        //if (quadrant == 1) 
        //    coords = { x: baseNode.x - relativeCoords.x, y: baseNode.y - relativeCoords.y };
        //else if (quadrant == 2)
        //    coords = { x: parentNode.offset.left - relativeCoords.x, y: baseNode.y - relativeCoords.y };
        //else if (quadrant == 3)
        //    coords = { x: parentNode.offset.left - relativeCoords.x, y: baseNode.y + relativeCoords.y };
        //else 
        //    coords = { x: baseNode.x - relativeCoords.x, y: baseNode.y + relativeCoords.y };

        //console.log('angle: ' + relativeAngle + 'quadrant: ' + quadrant + ' coords:' );
        //console.log(coords);

        //return coords;

    }

    getRelativeAngleForNewNode(node: Node, baseAngle: number): number {
        let angles: Array<number> = [];

        //if (node.children.length == 1)
        //    return this.calculateAbsoluteAngle(Math.atan2(slopeFromParent.y, slopeFromParent.x), .2 * Math.PI);

        for (let c of node.children) {
            // get angles relative to the base line which is the line from this node to its parent
            let angle = this.calculateAngleDiff(baseAngle, this.getSlopeFromParent(c));
            angles.push(angle);
        }


        // if this is a root node, create child nodes at any angle
        // if this is a child node, don't create child nodes at angles greater than 90 degrees
        let boundaryAngle = (!node.parent ? Math.PI : Math.PI / 2);
        angles.push(boundaryAngle);
        angles.push(-boundaryAngle);
        
        let sortedAngles = angles.sort((a1, a2) => (a1 > a2) ? 1 : ((a1 == a2) ? 0 : -1));

        let a1: number, a2: number, maxDiff: number = 0;
        
        for (let i = 1; i < sortedAngles.length; i++) {

            console.log('angle: ' + sortedAngles[i - 1]);

            if (sortedAngles[i] > boundaryAngle || sortedAngles[i] < -boundaryAngle)
                continue;

            let diff = sortedAngles[i] - sortedAngles[i - 1];
            
            if (diff > maxDiff) {
                a1 = sortedAngles[i - 1];
                a2 = sortedAngles[i];
                maxDiff = diff;
            }
        }
        
        console.log('a1:' + a1 + ' a2:' + a2 + 'new: ' + ((a1 + ((a2 - a1) / 2))));
        return (a1 + ((a2 - a1) / 2));
    }

    calculateAbsoluteAngle(baselineAngle: number, relativeAngle: number) {
        return baselineAngle + relativeAngle;
    }
    calculateAngleDiff(baseAngle: number, offset: Point): number {
        var angle = Math.atan2(offset.y, offset.x) - baseAngle;
        return angle;
    }
    

    

} 
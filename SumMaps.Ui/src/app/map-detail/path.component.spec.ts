import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import { PathComponent } from './path.component';
import { Node } from './node'


describe('PathComponent', () => {

    let comp: PathComponent;
    let fixture: ComponentFixture<PathComponent>;
    //let de: DebugElement;
    //let el: HTMLElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [PathComponent], // declare the test component
        });

        fixture = TestBed.createComponent(PathComponent);

        comp = fixture.componentInstance; // BannerComponent test instance

        // query for the title <h1> by CSS element selector
        //de = fixture.debugElement.query(By.css('h1'));
        //el = de.nativeElement;
    });
    
    it('compute coords', () => {

        let padding = 20;
        let nodeW = 5;
        let nodeH = 5;
        comp.startNode = createNode(0, 0, nodeW, nodeH); 
        comp.endNode = createNode(0, 5, nodeW, nodeH);
        
        let coords = comp.getPathCoords();        

        expect(coords.canvasDimensions.x).toBe(0);
        expect(coords.canvasDimensions.y).toBe(5);
        expect(coords.canvasOffset.x).toBe(padding + (nodeW / 2));
        expect(coords.canvasOffset.y).toBe(padding + (nodeH / 2));
        expect(coords.startCoord.x).toBe(0);
        expect(coords.startCoord.y).toBe(0);
        expect(coords.diffCoord.x).toBe(-0);
        expect(coords.diffCoord.y).toBe(5);
        expect(coords.cCoord1.x).toBe(-0);
        expect(coords.cCoord1.y).toBe(3.25);
        expect(coords.cCoord2.x).toBe(-0);
        expect(coords.cCoord2.y).toBe(1.75);
    });
    
    let createNode = function(left:number, top: number, width: number, height: number): Node{
        let node = new Node();
        node.offset = { top: top, left: left };
        node.width = width;
        node.height = height;
        return node;
    }
});

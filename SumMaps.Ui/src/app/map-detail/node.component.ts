import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import {Observable}  from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
declare var $: JQueryStatic;

import { Node } from './node'

export class DraggingInfo {
    pageX0: number;
    pageY0: number;
    elem: ElementRef;
    offset0: any;
}


@Component({
    selector: 'node',
    template: ` <node-path *ngIf='node.parent' [startNode] = node.parent [endNode] = node></node-path>
                <div (mousedown) = "onMouseDown($event)" #my_node style="background-color: orange; padding:20px; position:absolute; z-index:0">{{node.summary}}</div>
                <node *ngFor='let n of node.children'  [node] = n></node>`
                
})
export class NodeComponent implements OnInit {
    @ViewChild('my_node') el: ElementRef
    @Input() node: Node

    subscrMouseMove: any;
    subscrMouseUp: any;
    subscrMouseLeave: any;
    subscrMouseOut: any;
    ptrOnMouseUp: any;
    di: DraggingInfo;
    
    ngOnInit(): void {
        $(this.el.nativeElement).offset(this.node.offset);
        $(this.el.nativeElement).width(String(this.node.width) + 'px');
        $(this.el.nativeElement).height(String(this.node.height) + 'px');


        // get starting point of path
        let startX = this.node.offset.left + (this.node.width / 2);
        let startY = this.node.offset.top + (this.node.height / 2);
    }
    
    onMouseDown(e: MouseEvent): void {
        this.di = new DraggingInfo();
        this.di.pageX0 = e.pageX;
        this.di.pageY0 = e.pageY;
        this.di.elem = this.el.nativeElement;
        this.di.offset0 = $(this.el.nativeElement).offset();
        
        //this.ptrOnDragging = (e: MouseEvent) => { this.onDragging(e, this.di); };
        //this.ptrOnMouseUp = () => { this.onMouseUp(this.ptrOnDragging, this.ptrOnMouseUp); };
        //this.ptrOnMouseUp = () => { this.subscrMouseMove.unsubscribe(); };

        let unsubscribe = () => {
            this.subscrMouseMove.unsubscribe();
            this.subscrMouseUp.unsubscribe();
            this.subscrMouseOut.unsubscribe();
        };

        this.subscrMouseMove = Observable.fromEvent(window, 'mousemove')
            .throttleTime(10)
            .subscribe(e => { this.onDragging(e, this.di); });

        this.subscrMouseUp = Observable.fromEvent(window, 'mouseup')
            .subscribe(unsubscribe);
            
        this.subscrMouseOut = Observable.fromEvent(window, 'mouseout')
            .subscribe(unsubscribe);
    }

    onDragging(e: MouseEvent, di: DraggingInfo): void {
        var left = di.offset0.left + (e.pageX - di.pageX0);
        var top = di.offset0.top + (e.pageY - di.pageY0);
        var offset = { top: top, left: left };
        this.node.offset = offset;
        $(di.elem).offset(offset);

        //$(this.el.nativeElement).css({ top: 200, left: 200, position: 'absolute' });
    }

    onMouseUp(ptrOnDragging: any, ptrOnMouseUp: any): void {
        $('body')
            .off('mousemove', ptrOnDragging)
            .off('mouseup', ptrOnMouseUp);
    }

    
}

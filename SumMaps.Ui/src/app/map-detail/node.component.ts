import { Component, ViewChild, ElementRef, Input, OnChanges, Output } from '@angular/core';
import {Observable}  from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/observable/fromEvent';
declare var $: JQueryStatic;

import { Node } from './node'
import { NodeStyleConstants } from './map-detail-style-constants'
import { NodeService } from './node.service'

export class DraggingInfo {
    pageX0: number;
    pageY0: number;
    elem: ElementRef;
    offset0: any;
}

//style = "background-color: orange; padding:20px; position:absolute; z-index:0"

@Component({
    moduleId: 'app/map-detail/node.component',
    selector: 'node',
    template: ` <node-path *ngIf='node.parent' [startNode] = node.parent [endNode] = node></node-path>
                <div (mousedown) = "onMouseDown($event)" #my_node class="node" [class.node-selected]='node.selected' (contextmenu)='onRightClick($event)' >{{node.summary}}</div>
                <node *ngFor='let n of node.children'  [node] = n></node>
                `,
    styleUrls: ['./map-detail.css']
                
})
export class NodeComponent implements OnChanges {
    @ViewChild('my_node') el: ElementRef
    @Input() node: Node;
    
    subscrMouseMove: any;
    subscrMouseUp: any;
    subscrMouseLeave: any;
    subscrMouseOut: any;
    ptrOnMouseUp: any;
    di: DraggingInfo;

    constructor(private nodeService: NodeService) { }
    
    ngOnChanges(): void {
        $(this.el.nativeElement).offset(this.node.offset);
        $(this.el.nativeElement).width(String(this.node.width) + 'px');
        $(this.el.nativeElement).height(String(this.node.height) + 'px');
        
        let cssClass = this.getNodeCssClass(this.node);

        $(this.el.nativeElement).addClass(cssClass);
        
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

        let unsubscribe = (e: MouseEvent) => {
            this.subscrMouseMove.unsubscribe();
            this.subscrMouseUp.unsubscribe();
            this.subscrMouseOut.unsubscribe();
        };

        this.subscrMouseMove = Observable.fromEvent(window, 'mousemove')
            .subscribe((e: MouseEvent) => { this.onDragging(e, this.di); });

        this.subscrMouseUp = Observable.fromEvent(window, 'mouseup')
            .subscribe(unsubscribe);
            
        this.subscrMouseOut = Observable.fromEvent(window, 'mouseout')
            .subscribe(unsubscribe);

        this.nodeService.selectNode(this.node);
    }

    onDragging(e: MouseEvent, di: DraggingInfo): void {
        var left = di.offset0.left + (e.pageX - di.pageX0);
        var top = di.offset0.top + (e.pageY - di.pageY0);
        var offset = { top: top, left: left };
        this.node.offset = offset;
        $(di.elem).offset(offset);

        //$(this.el.nativeElement).css({ top: 200, left: 200, position: 'absolute' });
    }

    onRightClick(e: MouseEvent): boolean {
        this.nodeService.createChildNode(this.node);
        return false;
    }

    getNodeCssClass(node: Node): string {
        if (node.branch == 0)
            return 'root-node';

        let branchNum = (node.branch % NodeStyleConstants.numBranchOptions) == 0 ? NodeStyleConstants.numBranchOptions : (node.branch % NodeStyleConstants.numBranchOptions);
        let branchDepthNum = (node.branchDepth > NodeStyleConstants.numDepthOptions) ? NodeStyleConstants.numDepthOptions : node.branchDepth;

        return 'node-' + branchNum + '-l' + branchDepthNum;
    }

    
}

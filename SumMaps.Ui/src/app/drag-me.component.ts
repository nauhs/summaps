import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
declare var $: JQueryStatic;

export class DraggingInfo {
    pageX0: number;
    pageY0: number;
    elem: ElementRef;
    offset0: any;
}


@Component({
    selector: 'drag-me',
    template: `<div (mousedown) = "onMouseDown($event)" #drag_me style="background-color: red; padding:20px; width:100px; height:50px;"></div>`
})
export class DragMeComponent implements AfterViewInit{
    @ViewChild('drag_me') el : ElementRef

    //ngAfterViewInit() {
    //    $(this.el.nativeElement).css({ top: 200, left: 200, position: 'absolute' });
    //}

    onMouseDown(e: MouseEvent): void {
        this.di = new DraggingInfo();
        this.di.pageX0 = e.pageX;
        this.di.pageY0 = e.pageY;
        this.di.elem = this.el.nativeElement;
        this.di.offset0 = $(this.el.nativeElement).offset();

        console.log(this.di);

        this.ptrOnDragging = (e: MouseEvent) => { this.onDragging(e, this.di); };
        this.ptrOnMouseUp = () => { this.onMouseUp(this.ptrOnDragging, this.ptrOnMouseUp); };

        $('body')
            .on('mouseup', this.ptrOnMouseUp)
            .on('mousemove', this.ptrOnDragging);
    }

    onDragging(e: MouseEvent, di: DraggingInfo): void {
        var left = di.offset0.left + (e.pageX - di.pageX0);
        var top = di.offset0.top + (e.pageY - di.pageY0);
        $(di.elem).offset({ top: top, left: left });

        //$(this.el.nativeElement).css({ top: 200, left: 200, position: 'absolute' });
    }

    onMouseUp(ptrOnDragging: any, ptrOnMouseUp: any): void {
        $('body')
            .off('mousemove', ptrOnDragging)
            .off('mouseup', ptrOnMouseUp);
    }

    ptrOnDragging: any;

    ptrOnMouseUp: any;


    di: DraggingInfo;

    name = 'Angular';
}

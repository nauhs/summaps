import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NodeComponent } from './node.component'
import { PathComponent } from './path.component'
import { MapComponent } from './map.component'


@NgModule({
    imports: [BrowserModule],
    declarations: [NodeComponent, MapComponent, PathComponent],
    exports: [NodeComponent, MapComponent, PathComponent]
})
export class MapDetailModule { }

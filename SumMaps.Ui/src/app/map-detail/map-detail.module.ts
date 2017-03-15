import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NodeComponent } from './node.component'
import { PathComponent } from './path.component'
import { MapComponent } from './map.component'
import { NodeService } from './node.service'


@NgModule({
    imports: [BrowserModule],
    declarations: [NodeComponent, MapComponent, PathComponent],
    exports: [NodeComponent, MapComponent, PathComponent],
    providers: [ NodeService ]
})
export class MapDetailModule { }

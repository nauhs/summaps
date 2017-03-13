import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { TestModule } from './test/test.module';
import { MapDetailModule } from './map-detail/map-detail.module';

@NgModule({
    imports: [BrowserModule, HttpModule, TestModule, MapDetailModule ],
    declarations: [AppComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

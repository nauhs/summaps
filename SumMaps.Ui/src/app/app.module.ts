import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

import { AppComponent }  from './app.component';
import { DragMeComponent } from './drag-me.component';
import { TestModule } from './test/test.module'

@NgModule({
    imports: [BrowserModule, TestModule, HttpModule ],
    declarations: [AppComponent, DragMeComponent],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }

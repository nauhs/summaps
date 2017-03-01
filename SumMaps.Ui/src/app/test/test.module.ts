import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { TestComponent } from './test.component'
import { TestService } from './test.service'


@NgModule({
    imports: [BrowserModule],
    declarations: [TestComponent],
    providers: [TestService],
    exports: [TestComponent]
})
export class TestModule { }

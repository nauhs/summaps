import { Component } from '@angular/core';
import { DragMeComponent } from './drag-me.component';
declare var $: JQueryStatic;

@Component({
  selector: 'my-app',
  template: `<span>Hello {{name}}</span>
            <a href="http://signin.summaps.com/session/signout">Sign Out</a>
             <test></test>
            <drag-me></drag-me>`
})
export class AppComponent  { name = 'Angular'; }

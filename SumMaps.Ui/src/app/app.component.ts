import { Component } from '@angular/core';
declare var $: JQueryStatic;

@Component({
  selector: 'my-app',
  template: `<span>Hello {{name}}</span>
            <a href="http://signin.summaps.com/session/signout">Sign Out</a>
             <test></test>
            <map></map>`
})
export class AppComponent  { name = 'Angular'; }

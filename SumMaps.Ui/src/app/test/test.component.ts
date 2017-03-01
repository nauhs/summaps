import { Component, OnInit } from '@angular/core'
import { TestService } from './test.service'

@Component({
    selector: 'test',
    template: `
    <div>
        <div *ngFor="let teststr of testStrings">
            {{teststr}}
        </div>
    </div>
    `
})

export class TestComponent implements OnInit{
    constructor(private testService: TestService) {
    }
    ngOnInit(): void {
        
        this.testService.get().then(testStrs => this.testStrings = testStrs);
    }
    testStrings: String[]
};

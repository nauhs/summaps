import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http'
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';



@Injectable()
export class TestService {
    private testUrl = 'http://api.summaps.com/api/test';  // URL to web api
    private headers = new Headers({ 'Content-Type': 'application/json' });

    constructor(private http: Http) {
    }

    get(): Promise<any> {
        return this.http.get(this.testUrl, { withCredentials: true }).map(response => response.json().data).toPromise().catch(err => console.log(err));
    }
}

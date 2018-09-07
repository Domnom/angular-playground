import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  	providedIn: 'root'
})
export class FlickrService {

	rootUrl:string = "https://l70217a84b.execute-api.ap-southeast-2.amazonaws.com/staging/photos";

  	constructor(private http: HttpClient) { }

  	getFavourites(): Observable<any> {

  		return this.http.get(`${this.rootUrl}/favourite`);

  	}

}

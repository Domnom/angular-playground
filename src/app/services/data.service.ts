import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	requestObservables = {};

	constructor(private http: HttpClient) { }

	getData(): Observable<any[]>
	{
		var url = "https://jsonplaceholder.typicode.com/posts"
		
		// var obs = this.requestObservables[url];
		// if (!obs)
		// {
		// 	obs = this.http
	 //            .get<any[]>(url)
	 //            .pipe(
	 //            	share(),
	 //                map((data) => {

	 //                  return data.map(el => {

	 //                    return ({
	 //                      id : el.id,
	 //                      title : el.title
	 //                    });
	 //                  });
	 //            	})
	 //            );
	 //        this.requestObservables[url] = obs;
		// }
	 //    return obs;    

		// return {
		// 	subscribe(func) {
		// 		func('something');
		// 	}
		// }

	  	return this.http
	            .get<any[]>("https://jsonplaceholder.typicode.com/posts")
	            .pipe(
	                map((data) => {
	                  return data.map(el => {

	                    return ({
	                      id : el.id,
	                      title : el.title
	                    });
	                  });
	            	})
	            );
	}
}

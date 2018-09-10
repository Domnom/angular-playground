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

	getData(id): Observable<any[]>
	{
		var url = "https://jsonplaceholder.typicode.com/posts";

	  	return this.http
	            .get<any[]>(url)
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

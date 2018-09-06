import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(private http: HttpClient) { }

	getData(): Observable<any[]>
	{
	  return this.http
	            .get<any[]>("https://jsonplaceholder.typicode.com/posts")
	            .pipe(
	                map((data) => {
	                  return data.map(el => {
	                    
	                    /*
	                      Transform the data.
	                        - Data we are transforming to will need to have the same keys defined in the return object type (Although missing keys will not cause a runtime error)
	                     */
	                    
	                    // return ({
	                    //   id : el.id,
	                    //   title : el.title
	                    // });

	                    return ({
	                      id : el.id,
	                      title : el.title
	                    });
	                  });
	            	})
	            );
	}
}

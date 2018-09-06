import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap, share } from "rxjs/operators";

import { RequestCacheService } from "./../services/request-cache.service";

@Injectable()
export class RequestCacheInterceptor implements HttpInterceptor {

	constructor(private requestCacheService: RequestCacheService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
		
		// -- Get the cached response
		var cachedResponse: Observable<HttpEvent<any>> | HttpResponse<any> = this.requestCacheService.get(req.url);

		if (cachedResponse)
		{
			if (cachedResponse instanceof HttpResponse)
			{
				return Observable.create((obs) => {
					obs.next(cachedResponse);
					obs.complete();
				})
			}
			else if (cachedResponse instanceof Observable)
			{
				return cachedResponse;
			}
			else
			{
				return Observable.create((obs) => {
					obs.error({ message : "Client error : Unable to decide type of cachedResponse"});
				});
			}
		}
		else
		{
			// -- There is no cached data. Send observable on
			var obs = next.handle(req)
							.pipe(
								share(),
								tap((event) => {
									if (event instanceof HttpResponse)
									{
										// -- Save the data to the request cache service
										this.requestCacheService.set(req.url, event);
									}
								})
							);

			// -- Save the observable for multiple requests
			this.requestCacheService.set(req.url, obs);

			return obs;
		}
	}
}
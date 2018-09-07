import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable, throwError, of } from "rxjs";
import { catchError, tap, share, finalize } from "rxjs/operators";

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
				// -- Request has been resolved! Return the response for the service to handle
				return Observable.create((obs) => {
					obs.next(cachedResponse);
					obs.complete();
				});
			}
			else if (cachedResponse instanceof Observable)
			{
				// -- Request is in progress! Return the observable so our service can subscribe when it resolves
				return cachedResponse;
			}
			else
			{
				// -- If this happens... Something went wrong in the RequestCacheService
				return Observable.create((obs) => {
					obs.error({ message : "Client error : Unable to decide type of cachedResponse"});
				});
			}
		}
		else
		{
			// -- There is no cached data. Allow the request to continue through the interceptor chain
			var obs = next.handle(req)
							.pipe(
								share(), // -- Share to prevent the same observable from firing multiple HTTP requests
								tap((event) => {
									if (event instanceof HttpResponse)
									{
										// -- Save the data to the request cache service for future retrieval
										this.requestCacheService.set(req.url, event);
									}
								})
							);

			// -- Save the observable to the RequestCacheService so if any other services that calls this url will get this observer back
			this.requestCacheService.set(req.url, obs);

			return obs;
		}
	}
}
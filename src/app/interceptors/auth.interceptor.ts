import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		
		var token = "THIS_IS_A_TOKEN";

		// -- Clone the request object as it is immutable. Modify the clone instead
		var newRequest = req.clone({
			headers : req.headers.set("AuthInterceptorWasHere", token)
		});

		
		// -- Set return to continue the chain
		return next.handle(newRequest)
					.pipe(
						tap((res) => {
							console.log("Interceptor tap", res);
						}),
						catchError((err) => {
							console.error("Interceptor error:", err);
							return throwError(err);
						})
					);
	}

}
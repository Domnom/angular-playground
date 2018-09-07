import { Injectable } from "@angular/core";
import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	intercept(req: HttpRequest<any>, next: HttpHandler) {
		
		var authToken = localStorage.getItem("authToken");
		var accessToken = localStorage.getItem('accessToken');

		// -- Clone the request object as it is immutable. Modify the clone instead
		var myHeaders = req.headers;//.set("Access-Control-Allow-Origin", "*");
		if (authToken)
		{
			// -- Make sure when setting multiple headers that we create a new object and add without any null values. headers and null values == bad time with tests
			myHeaders = myHeaders.set("Authorization", authToken);

			if (accessToken)
			{
				myHeaders = myHeaders.set("AccessToken", accessToken);
			}
		}

		var newRequest = req.clone({
			headers : myHeaders
		});

		console.error('asdf', myHeaders)

		// -- Set return to continue the chain
		return next.handle(newRequest)
					.pipe(
						catchError((err) => {
							console.error("Interceptor error:", err);
							return throwError(err);
						})
					);
	}

}
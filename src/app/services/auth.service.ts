import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  	providedIn: 'root'
})
export class AuthService {

	rootUrl:string = "https://l70217a84b.execute-api.ap-southeast-2.amazonaws.com/staging/auth";

  	constructor(private http: HttpClient) { }

  	login(username, password): Observable<any> {

  		return this.http.post(`${this.rootUrl}/login`, {
  						username : username,
  						password : password
  					})
  					.pipe(
  						tap((resBody) => {

  							if (resBody.data && resBody.data.AuthenticationResult)
  							{
  								var authenticationResult = resBody.data.AuthenticationResult;

  								if (authenticationResult.AccessToken)
  								{
  									localStorage.setItem("accessToken", authenticationResult.AccessToken);
  								}
  								if (authenticationResult.RefreshToken)
  								{
  									localStorage.setItem("refreshToken", authenticationResult.RefreshToken);
  								}
  								if (authenticationResult.IdToken)
  								{
  									localStorage.setItem("authToken", authenticationResult.IdToken);
  								}
  							}
  						})
  					)

  	}
}

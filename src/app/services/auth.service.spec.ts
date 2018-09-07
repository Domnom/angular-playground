import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
	var authUrl: string = "https://l70217a84b.execute-api.ap-southeast-2.amazonaws.com/staging/auth";
	var authService: AuthService;
	var httpMock: HttpTestingController;

  	beforeEach(() => {
	    TestBed.configureTestingModule({
	    	imports : [HttpClientTestingModule],
	      	providers: [AuthService]
	    });

	    authService = TestBed.get(AuthService);
	    httpMock = TestBed.get(HttpTestingController);
  	});

  	afterEach(() => {

  		httpMock.verify();
  		localStorage.removeItem("accessToken");
  		localStorage.removeItem("refreshToken");
  		localStorage.removeItem("authToken");
  	})

	it('should be created', (() => {
		expect(authService).toBeTruthy();
	}));

	it ("Should login a user and save the token", () => {

		var username = "tester";
		var password = "tester";

		authService.login(username, password)
			.subscribe(
				(data) => {
					// -- We do not expect a value here but instead lets check to see if the tokens have been saved to the localstorage
					var accessToken = localStorage.getItem("accessToken");
					var refreshToken = localStorage.getItem("refreshToken");
					var authToken = localStorage.getItem("authToken");

					expect(accessToken).toBe("my-access-token");
					expect(refreshToken).toBe("my-refresh-token");
					expect(authToken).toBe("my-auth-token");
				}
			)
			
		var testRequest = httpMock.expectOne((req) => {

			return req.url === `${authUrl}/login` &&
				   req.method === "POST" &&
				   req.body.username === username &&
				   req.body.password === password;

		});

		var fakeData = {
			statusCode : 200,
			data : {
				ChallengeParameters : {},
				AuthenticationResult : {
					AccessToken : "my-access-token",
					ExpiresIn : 3600,
					TokenType : "Bearer",
					RefreshToken : "my-refresh-token",
					IdToken : "my-auth-token"
				}
			}
		}

		testRequest.flush(fakeData);

	});

	it ("Should fail to login a user that does not exist", () => {

		var username = "tester";
		var password = "tester";

		authService.login(username, password)
			.subscribe(
				(data) => {
					expect(false).toBeTruthy();
				},
				(error) => {
					expect(error.error.message).toBe("Invalid username or password");

					// -- We do not expect a value here but instead lets check to see if the tokens have been saved to the localstorage
					var accessToken = localStorage.getItem("accessToken");
					var refreshToken = localStorage.getItem("refreshToken");
					var authToken = localStorage.getItem("authToken");

					expect(accessToken).toBeNull();
					expect(refreshToken).toBeNull();
					expect(authToken).toBeNull();
				}
			)

		var testRequest = httpMock.expectOne(`${authUrl}/login`);

		var fakeData = {
			statusCode : 400,
			message : "Invalid username or password"
		}

		var fakeOpts = {
			status : 400,
			statusText : "NotAuthorized"
		}
		testRequest.flush(fakeData, fakeOpts);
	});

	it ("Should register a user", () => {

	});

});

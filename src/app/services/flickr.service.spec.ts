import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { FlickrService } from './flickr.service';
import { AuthInterceptor } from './../interceptors/auth.interceptor';

describe('FlickrService', () => {

	var url1: string = "https://l70217a84b.execute-api.ap-southeast-2.amazonaws.com/staging/photos/favourite";
	var authToken   = "my-auth-token";
	var accessToken = "my-access-token";

	var flickrService: FlickrService;
	var httpMock: HttpTestingController;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports : [HttpClientTestingModule],
			providers: [
				FlickrService,
				{
					provide : HTTP_INTERCEPTORS,
					useClass : AuthInterceptor,
					multi : true
				}
			]
		});

		flickrService = TestBed.get(FlickrService);
		httpMock 	  = TestBed.get(HttpTestingController);
	});

	it('should be created', (() => {
		expect(flickrService).toBeTruthy();
	}));

	it ("Should get user favourites", () => {

		localStorage.setItem('authToken', authToken);
		localStorage.setItem('accessToken', accessToken);

		flickrService.getFavourites()
					.subscribe(
						(resBody) => {
							expect(resBody.statusCode).toBeTruthy();
							expect(resBody.data).toBeTruthy();
							expect(resBody.data.Items).toBeTruthy();
						}
					);

		var testRequest = httpMock.expectOne((req) => {

			console.error(req.url);
			return req.url == url1 &&
				   req.method == "GET" &&
				   req.headers.get("Authorization") != null &&
				   req.headers.get("AccessToken") != null;

		})

		var fakeData = {
		    "statusCode": 200,
		    "data": {
		        "Items": [{
					uuid              : "123",
					user_id           : "user123",
					flickr_authour_id : "authour123",
					flickr_photo_id   : "photo123"
		        }],
		        "Count": 1,
		        "ScannedCount": 10
		    }
		}

		testRequest.flush(fakeData);

		localStorage.removeItem('authToken');
		localStorage.removeItem('accessToken');

	});

	it ("Should fail to get user favourites if we do not have a Authorization token", () => {

		flickrService.getFavourites()
					.subscribe(
						(resBody) => {
							expect(false).toBeTruthy();
						},
						(resError) => {
							expect(resError).toBeTruthy();
							expect(resError.error).toBeTruthy();
							expect(resError.error.statusCode).toBe(401);
							expect(resError.error.message).toBeTruthy();
						}
					)

		var testRequest = httpMock.expectOne((req) => {

			return req.url == url1 &&
				   req.method == "GET" &&
				   req.headers.get("Authorization") == null &&
				   req.headers.get("AccessToken") == null;

		});

		var fakeData = {
			"statusCode" : 401,
			"message" : "Not authorized"
		}

		var fakeOpts = {
			status : 401,
			statusText : "Unauthorized"
		}

		testRequest.flush(fakeData, fakeOpts);

	});

	it ("Should fail to get user favourites if we do not have an Access token", () => {

		localStorage.setItem('authToken', authToken);

		flickrService.getFavourites()
					.subscribe(
						(resBody) => {
							expect(false).toBeTruthy();
						},
						(resError) => {
							console.error('resError', resError);
							expect(resError).toBeTruthy();
							expect(resError.error).toBeTruthy();
							expect(resError.error.statusCode).toBe(400);
							expect(resError.error.message).toBeTruthy();
						}
					);

		var testRequest = httpMock.expectOne((req) => {

			return req.url == url1 &&
				   req.method == "GET" &&
				   req.headers.get("Authorization") == authToken &&
				   req.headers.get("AccessToken") == null;

		});

		var fakeData = {
			"statusCode" : 400,
			"message" : "Not authorized"
		}

		var fakeOpts = {
			status : 400,
			statusText : "Unauthorized"
		}

		testRequest.flush(fakeData, fakeOpts);

		localStorage.removeItem('authToken');
	});
});

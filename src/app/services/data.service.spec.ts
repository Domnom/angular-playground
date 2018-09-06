import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DataService } from './data.service';
import { AuthInterceptor } from './../interceptors/auth.interceptor';

describe('DataService', () => {
  
	var dataService: DataService;
	var httpMock: HttpTestingController;

  	beforeEach(() => {

	    TestBed.configureTestingModule({
	    	imports : [
	    		HttpClientTestingModule
	    	],
	      	providers: [
	      		DataService,
	      		{
	      			provide : HTTP_INTERCEPTORS,
	      			useClass : AuthInterceptor,
	      			multi : true
	      		}
	      	]
	    });

	    dataService = TestBed.get(DataService);
	    httpMock = TestBed.get(HttpTestingController);
  	});

  	afterEach(() => {
  		// -- Ensures there are no outstanding http requests made after the test is finished. (otherwise subsequent tests may fail)
  		httpMock.verify();
  	})

  	it('should be created', () => {
    	expect(dataService).toBeTruthy();
  	});

  	it ("Should fire a successful request", () => {
  		var fakeData = [{
  			id : 1,
  			title : "Title 1",
  			description : "Some description"
  		},
  		{
  			id : 2,
  			title : "Title 2",
  			description : "Some description 2"
  		}];

  		dataService.getData()
  			.subscribe(
  				(data) => {
  					expect(Array.isArray(data)).toBe(true);
  					expect(data.length).toBe(2);
  				}
  			);

  		// -- Check if a request was made
  		var testRequest = httpMock.expectOne("https://jsonplaceholder.typicode.com/posts");

  		// -- Complete the request with fake data
  		testRequest.flush(fakeData);
  	})

  	it ("Should contain a header set by the auth interceptor", () => {
  		dataService.getData()
  			.subscribe(
  				(data) => {
  					expect(Array.isArray(data)).toBe(true);
  					expect(data.length).toBe(0);
  				}
  			);

  		// -- Check if a request was made
  		var testRequest = httpMock.expectOne((req) => {

  			return req.headers.get("AuthInterceptorWasHere") == "THIS_IS_A_TOKEN"

  		});

  		// -- Complete the request with fake data
  		testRequest.flush([]);
  	})

  	it ("Should fail with status code 500", () => {
  		dataService.getData()
  			.subscribe(
  				(data) => {
  					expect(true).toBe(false);
  				},
  				(err) => {
  					expect(err.status).toBe(500);
  				}
  			)

  		var testRequest = httpMock.expectOne("https://jsonplaceholder.typicode.com/posts");

  		var errorObj = {
  			message : "Something went wrong on the server"
  		}

  		var opts = {
  			status : 500,
  			statusText : "Server error"
  		}

  		testRequest.flush(errorObj, opts);
  	})
});

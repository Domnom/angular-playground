import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DataService } from './data.service';
import { AuthInterceptor } from './../interceptors/auth.interceptor';
import { RequestCacheInterceptor } from './../interceptors/request-cache.interceptor';

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
      		},
          {
            provide : HTTP_INTERCEPTORS,
            useClass : RequestCacheInterceptor,
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

      // -- Preparing data that is to be sent through the faked request
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

  		// -- Check if a request was made to the HttpController
  		var testRequest = httpMock.expectOne("https://jsonplaceholder.typicode.com/posts");

  		// -- Resolve the request with fake data initialized earlier
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

        // -- Check to see if the AuthInterceptor has altered the header of this request
  			return req.headers.get("AuthInterceptorWasHere") == "THIS_IS_A_TOKEN"

  		});

  		// -- Cleanup the request by flushing
  		testRequest.flush([]);
  	})







  	it ("Should fail with status code 500", () => {

      // -- Request and setup an error handler in the subscription method to test the error object that should be thrown
  		dataService.getData()
  			.subscribe(
  				(data) => {
  					expect(true).toBe(false);
  				},
  				(err) => {
            // -- The error object should be here and made up of the errorObj and opts variables below
  					expect(err.status).toBe(500);
  				}
  			)

      // -- Check to see if there was a request that has been made
  		var testRequest = httpMock.expectOne("https://jsonplaceholder.typicode.com/posts");

      // -- Build the Request body to be returned
  		var errorObj = {
  			message : "Something went wrong on the server"
  		}

      // -- Create the request options (headers, statuc, statusText)
      /*
        status >= 200 && status < 300 => SUCCESS
        else                          => ERROR
      */
  		var opts = {
  			status : 500,
  			statusText : "Server error"
  		}

      // -- Resolve the request by passing in our fake data and options
  		testRequest.flush(errorObj, opts);
  	})








    it ("Should cache the request", () => {

      // -- Send 2 duplicate requests. First one should fire the HttpHandle. Second one should subscribe to a duplicate observer
      // -- First request here creates the Observer and http request 
      dataService.getData().subscribe((data) => { 
        expect(data.length).toBe(2);
      });
      // -- Second request here should return the Observer created from the first request (fetched via the RequestCacheService && RequestCacheInterceptor)
      dataService.getData().subscribe((data) => {
        expect(data.length).toBe(2);
      });

      // --  There should only be 1 http request (made by the first dataService.getData)
      var testRequest = httpMock.expectOne("https://jsonplaceholder.typicode.com/posts");

      // -- Resolving the data will allow both the dataService.getData() observers to recieve the data
      testRequest.flush([
        {id : "1", title: "test title"},
        {id : "1", title: "test title 2"}
      ]);

      // -- Now we should have data cached. Fetch again will return cached data NOT data from a server
      dataService.getData().subscribe((data) => {
        // -- Data should instantly be loaded here as we are fetching from cache (data from previous flush)
        expect(data.length).toBe(2);
      })

      // -- There should be NO requests made to the HttpController because the data is cached in the RequestCacheService
      httpMock.expectNone("https://jsonplaceholder.typicode.com/posts");

      // -- Flush is not needed here as there was no request made
    });

});

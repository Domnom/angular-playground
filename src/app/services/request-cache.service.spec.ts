import { TestBed, inject } from '@angular/core/testing';

import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { RequestCacheService } from './request-cache.service';

describe('RequestCacheService', () => {

	var url1 = "https://jsonplaceholder.typicode.com/posts";
	var requestCacheService: RequestCacheService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [RequestCacheService]
		});

		requestCacheService = TestBed.get(RequestCacheService);
	});

	it('should be created', inject([RequestCacheService], (service: RequestCacheService) => {
		expect(service).toBeTruthy();
	}));


	it ("Should set an Observable", () => {

		var observable = Observable.create((obs) => {});

		requestCacheService.set(url1, observable);
		expect(requestCacheService.get(url1)).toBeTruthy();
		expect(requestCacheService.get(url1) instanceof Observable).toBeTruthy();
	})

	it ("Should set an HttpResponse. It should also clear the observable", () => {

		var httpResponse = new HttpResponse();

		requestCacheService.set(url1, httpResponse);
		expect(requestCacheService.get(url1)).toBeTruthy();
		expect(requestCacheService.get(url1) instanceof HttpResponse).toBeTruthy();

	});

});

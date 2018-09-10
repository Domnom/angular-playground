import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Observable } from 'rxjs';

import { DataComponent } from './data.component';
import { DataService } from './../../services/data.service';

describe('DataComponent', () => {
    let component: DataComponent;
    let fixture: ComponentFixture<DataComponent>;
    let rootElement;
    let dataService: DataService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ DataComponent ],
            imports : [
                ReactiveFormsModule,
                HttpClientTestingModule
            ],
            providers : [
                DataService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataComponent);
        component = fixture.componentInstance;
        rootElement = fixture.debugElement.nativeElement;
        dataService = TestBed.get(DataService);
        fixture.detectChanges();
    });

    describe("Component variables", () => {

        it ("Should have class variables", () => {

            expect(component.getPostForm).toBeTruthy();

        });

    })

    describe("HTML", () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });
        
        describe ("Form", () => {

            it ("Should be a", () => {
                console.error("adsf", fixture.debugElement.nativeElement.querySelector('form').attributes);
                // var formElement = rootElement.querySelector('form[formGroup="getPostForm"]');
                // console.error('asdf', formElement);
            })

            it ("Should have an ID input box", () => {
                var idInputElement = rootElement.querySelector('form input[name="getPostId"]');
                expect(idInputElement).toBeTruthy();
                expect(idInputElement.type).toBe("number");
            });

            it ("Should have a submit button", () => {
                var idSubmitElement = rootElement.querySelector('form input[name="submitPostId"]');
                expect(idSubmitElement).toBeTruthy();
                expect(idSubmitElement.type).toBe('submit');
                expect(idSubmitElement.value).toBe("Get Post");
            });

        });

        it ("Should have a result output container", () => {
            var resultOutputElement = rootElement.querySelector('div.postResults');
            expect(resultOutputElement).toBeTruthy();
        });
    });



    describe("Component functions", () => {
        it ("Should fetch all posts if there is no ID", () => {

            spyOn(dataService, 'getData').and.callFake((id) => {
                return Observable.create((obs) => { 
                    // -- This should be called
                    expect(true).toBeTruthy();
                    expect(id).toBe(undefined);
                    obs.complete(); 
                });
            });

            component.fetchPost();
        });

        it ("Should fetch a single post if there is an ID", function() {

            spyOn(dataService, 'getData').and.callFake((id) => {

                return Observable.create((obs) => { 
                    // -- This should be called
                    expect(id).toBe(10);
                    obs.complete(); 
                });
            });

            component.fetchPost(10);

        });
    });



    describe("HTML with functionality", () => {

        it ("Should update the component.getPostForm id when the numberInput form element is updated", () => {
            var idInputElement = rootElement.querySelector('form input[name="getPostId"]');
            idInputElement.value = 10;
            idInputElement.dispatchEvent(new Event('input'));
            expect(component.getPostForm.value.id).toBe(10);
        });

        it ("Should load posts into the result output when the Get Post button is clicked");

    });
});

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DataService } from './services/data.service';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { RequestCacheInterceptor } from './interceptors/request-cache.interceptor';
import { AuthComponent } from './components/auth/auth.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component } from '@angular/core';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'http';

  constructor(private dataService: DataService) {}

  requestStuff()
  {
  	this.dataService.getData()
  		.subscribe(
  			(data) => {
  				console.error("THIS IS DATA : ", data);
  			},
  			(error) => {
  				console.error("THIS IS AN ERROR : ", error);
  			},
  			() => {
  				console.error("THIS IS COMPLETE");
  			}
  		);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { DataService } from './../../services/data.service';

@Component({
	selector: 'app-data',
	templateUrl: './data.component.html',
	styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
	getPostForm: FormGroup;

  	constructor(private formBuilder: FormBuilder,
  				private dataService: DataService) { }

	ngOnInit() {
		this.getPostForm = this.formBuilder.group({
			id : [""]
		});
	}


	fetchPost(id) {

		this.dataService.getData(id)
			.subscribe(
				(data) => {
					console.error("Data component data", data);
				}
			)
	}

}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthService } from './../../services/auth.service';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
	loginForm: FormGroup

	constructor(private formBuilder: FormBuilder, 
			    private authService: AuthService) { }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
	}

	login() {
		var username = this.loginForm.value.username;
		var password = this.loginForm.value.password;

		this.authService.login(username, password)
						.subscribe(
							(data) => {
								console.error("SUCCESS", data);
							},
							(error) => {
								console.error("ERROR", error);
							}
						)
	}
}

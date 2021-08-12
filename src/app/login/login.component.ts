import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorFlag = false;
  errorMessage = "";
  data: any;

  constructor(private apollo: Apollo, private router: Router) { }

  ngOnInit() { }

  login(form: NgForm) {
    var username = ""
    var password = ""
    username = form.value.username;
    password = form.value.password;

    if (username == "admin" && password == "admin") {
      this.errorMessage = "";
      var authTokenQuery = gql`
        mutation myFirstMutation($username:String!, $password:String!) {
            login(password: $password, username: $username) {
               accessToken
               refreshToken
            }
         }`;

      this.apollo.mutate({
        mutation: authTokenQuery,
        variables: {
          username: username,
          password: password
        }
      }).subscribe(({ data }) => {
        this.data = data;
        console.log(this.data.login.accessToken)
        this.router.navigate(['play'])
        localStorage.setItem("accessToken", this.data.login.accessToken)
      }, (error) => {
        this.errorMessage = 'There was an error during Login';
        console.log(error);
      });

      form.reset()

    }
    else {
      this.errorFlag = true;
      this.errorMessage = "Error occured. Username/Passowrd is invalid.";
    }
  }

}

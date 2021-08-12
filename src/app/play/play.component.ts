import { Component, ElementRef, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.css']
})
export class PlayComponent implements OnInit {

  toHTML = 'Waiting for the click....'
  accessToken = ""
  constructor(private apollo: Apollo) { }

  ngOnInit() { }

  doPostQuery(form: NgForm) {
    var name = ""
    var selectionId = ""
    var value = ""

    name = form.value.name;
    selectionId = form.value.selectionId;

    value = form.value.value;
    var POST1 = gql`
      mutation CreateData($name: String!, $selectionId: String!, $value: String!){
      createData(name: $name, options: [{selectionId: $selectionId, value: $value}]){
          ok 
          data {
              id 
              name
              options {
                  selectionId
                  value
                  }
              }
          }
      }`;

    this.apollo.mutate({
      mutation: POST1,
      variables: {
        name: name,
        selectionId: selectionId,
        value: value
      }
    }).subscribe(({ data }) => {
      form.reset()
      this.toHTML = JSON.stringify(data)
    }, (error) => {
      console.log('There was an error sending the query');
    });
  }

  doGetQuerySpecific(form: NgForm) {
    this.toHTML = 'Loading...'

    var name1 = false;
    var options1 = false;
    name1 = form.value.name;
    options1 = form.value.options;

    var GET_Specific = gql`
    query AllSelections($name:Boolean!, $options:Boolean!) {
        allSelections {
          id
        }
        allSelections @include(if: $name) {
          id
          name
        }
        allSelections @include(if: $options) {
          id
          name
          options {
            selectionId
            value
          }
        }
      }`;

    this.apollo
      .watchQuery({
        query: GET_Specific,
        variables: {
          name: name1,
          options: options1
        }
      })
      .valueChanges.subscribe((result: any) => {
        this.toHTML = JSON.stringify(result.data.allSelections)
      });
  }


  // getAuthToken(){
  //   var GET_Specific2 = gql`
  //       mutation {
  //         login(password: "admin", username: "admin") {
  //            accessToken
  //            refreshToken
  //         }
  //      }
  //   `;

  //   this.apollo
  //     .mutate({
  //       mutation: GET_Specific2
  //     })
  //     .subscribe((result: any) => {
  //       this.accessToken = result.data.login.accessToken
  //     });
  // }

  // getRefreshToken(){

  // }

}

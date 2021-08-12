import { APP_INITIALIZER, NgModule, OnInit } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { APOLLO_OPTIONS } from 'apollo-angular';
import * as Realm from 'realm-web';

// const graphqlUrl = 'https://realm.mongodb.com/api/client/v2.0/app/application-0realm-dscef/graphql';
const graphqlUrl = 'http://localhost:5000/graphql';
// const APP_ID = 'application-0realm-dscef';

// // Connect to your MongoDB Realm app
// const app = new Realm.App(APP_ID);

// function getToken() {
//   if (!app.currentUser){
//     // If no user is logged in, log in an anonymous user
//     // Create an api key credential
//     app.logIn(Realm.Credentials.apiKey('zJ6pIVVm8IejOp17oT6owcLOTWXFZTUbrbFtUpsNNPkZxvErCvNkEXfx8sbGfn4s'));
// }

// else {
//     // The logged in user's access token might be stale,
//     // Refreshing custom data also refreshes the access token
//     app.currentUser.refreshCustomData();
// }
// }

// getToken().then(()=>{console.log(app.currentUser?.id)})

function createApollo(httpLink: HttpLink) {

  const uri = graphqlUrl;

  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));

  const auth = setContext((operation, context) => {
    const token = localStorage.getItem('accessToken');

    if (token === null) {
      return {};
    } else {
      return {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      };
    }
  });

  const link = ApolloLink.from([basic, auth, httpLink.create({ uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache
  }
}

@NgModule({
  exports: [
    HttpClientModule
  ],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    }]
})

export class GraphQLModule { }

// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBnZgE51ZS7ieYmR9wzhHQ097ZpUhaOkY4',
    authDomain: 'allgive-6a536.firebaseapp.com',
    databaseURL: 'https://allgive-6a536.firebaseio.com',
    projectId: 'allgive-6a536',
    storageBucket: 'allgive-6a536.appspot.com',
    messagingSenderId: '263468447800'
  },
  stripeKey: 'pk_test_QdIak0PSr5Owkso8aHgH9JMc',
  actionCodeSettings : {
    url: 'http://localhost:4200/link-login',
    handleCodeInApp: true,
  },
  mailchimpKey: {
    endpoint: 'https://allgive.us7.list-manage.com/subscribe/post-json?u=94c3b7b1bdd619a78d3d14f71&amp;id=b3bce19994&',
    hiddenName: 'b_94c3b7b1bdd619a78d3d14f71_b3bce19994'
  },
  apiUrl: 'http://localhost:8080'
};

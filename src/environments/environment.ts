// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyBtjCJVVC4Rf0T1jVOJPbxxR0DUSAL_AWA', // "AIzaSyDoFmIQ91-j40s2skTZDhFCmsKEXoYv10M",
    authDomain: 'allgive-app-25240.firebaseapp.com', // "allgive-db679.firebaseapp.com",
    databaseURL: 'https://allgive-app-25240.firebaseio.com',
    projectId: 'allgive-app-25240', // "allgive-db679",
    storageBucket: 'allgive-db679.appspot.com',
    messagingSenderId: '856416375337'
  },
  stripeKey: 'pk_test_QdIak0PSr5Owkso8aHgH9JMc',
  actionCodeSettings : {
    url: 'http://localhost:4200/#/link-login',
    handleCodeInApp: true,
  },
  mailchimpKey: {
    endpoint: 'https://allgive.us7.list-manage.com/subscribe/post-json?u=94c3b7b1bdd619a78d3d14f71&amp;id=b3bce19994&',
    hiddenName: 'b_94c3b7b1bdd619a78d3d14f71_b3bce19994'
  },
  apiUrl: 'http://localhost:8080'
};

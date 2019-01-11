// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyBtjCJVVC4Rf0T1jVOJPbxxR0DUSAL_AWA",//"AIzaSyDoFmIQ91-j40s2skTZDhFCmsKEXoYv10M",
    authDomain: "allgive-app-25240.firebaseapp.com",//"allgive-db679.firebaseapp.com",
    databaseURL: "https://allgive-db679.firebaseio.com",
    projectId: "allgive-app-25240",//"allgive-db679",
    storageBucket: "allgive-db679.appspot.com",
    messagingSenderId: "856416375337"
  },
  stripeKey: 'pk_test_A1hL1cLlXqg5ObWRn1eaIgXU',
  actionCodeSettings : {
    url: 'http://localhost:4200/link-login', 
    handleCodeInApp: true,
  },
  mailchimpKey: 'c58f25891f8aa88f801a5a3faefaf2d6-us7'
};

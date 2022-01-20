import firebase from "firebase";
/*
const firebaseConfig = {
  apiKey: "AIzaSyBbZbzP407pWBHaaAEr48jJkrZm_8F2vfQ",
  authDomain: "prosportguru-a0569.firebaseapp.com",
  projectId: "prosportguru-a0569",
  storageBucket: "prosportguru-a0569.appspot.com",
  messagingSenderId: "46274020109",
  appId: "1:46274020109:web:77138d23dbfecebac1a644"
};*/
const firebaseConfig = {
  apiKey: "AIzaSyC20eE_3FGGhzVCL-Hnx2ye0fskZ-UElrs",
  authDomain: "prosport-guru-inc.firebaseapp.com",
  projectId: "prosport-guru-inc",
  storageBucket: "prosport-guru-inc.appspot.com",
  messagingSenderId: "384851572120",
  appId: "1:384851572120:web:6b31c6017fb9b4ac6367ed"
};

let app;
if(firebase.apps.length==0){
  app=firebase.initializeApp(firebaseConfig);
}else{
  app=firebase.app();
}

const db=app.firestore();
const auth=app.auth();
const storage=app.storage();

export {db,auth,storage};
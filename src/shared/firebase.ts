import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import { getFirestore} from 'firebase/firestore'


const firebaseConfig = {
    apiKey: "AIzaSyDt7O07dHww_EJiek7UXnE1lslPz9sPFyE",
    authDomain: "wztuga-app.firebaseapp.com",
    projectId: "wztuga-app",
    storageBucket: "wztuga-app.appspot.com",
    messagingSenderId: "878758704790",
    appId: "1:878758704790:web:d0d5b0fd434514a05d74b7",
    measurementId: "G-K3Z2E9QX80"
  };
  
  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);
  export const auth = getAuth(app)
  export const db =  getFirestore(app)
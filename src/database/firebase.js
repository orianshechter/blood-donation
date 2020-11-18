import firebase from 'firebase'


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyCLTLDhd-6MqhfOMemji6d8fneClCj0cbQ",
    authDomain: "damdonation.firebaseapp.com",
    databaseURL: "https://damdonation.firebaseio.com",
    projectId: "damdonation",
    storageBucket: "damdonation.appspot.com",
    messagingSenderId: "706843522627",
    appId: "1:706843522627:web:a1dd16e9c4e4ecb75ac6f6",
    measurementId: "G-1GCLTNEDF0"
});

const db = firebaseApp.firestore()
export {db}
export default firebaseApp;


const storage = firebaseApp.storage();
const storageRef = storage.ref();
export {storageRef}

// var json = { 
//     "name": "John",
//     "age": 30, 
//     "car": "BMW" 
// }
// // convert your object into a JSON-string
// var jsonString = JSON.stringify(json);
// // create a Blob from the JSON-string
// var blob = new Blob([jsonString], {type: "application/json"})

// var fileRef = storageRef.child("/files/my-file.json")
// fileRef.put(blob).then(function(snapshot) {
//     console.log('Uploaded a blob!');
// });
// async function fetchData() {
//     var fileRef = storageRef.child('/files/my-file.json')
//     const url  = await fileRef.getDownloadURL()
//     console.log(url)
//     const response = fetch(url)

// }
// fetchData()
// var url = 'https://firebasestorage.googleapis.com/v0/b/damdonation.appspot.com/o/files%2Fmy-file.json?alt=media&token=bdd20f03-b924-4f17-92a9-f9317fddbeaa'

// fetch(url)
// .then(response => response.json())
// .then(data => console.log(data))

var url = 'https://technionmail-my.sharepoint.com/:u:/g/personal/orian_she_campus_technion_ac_il/EeAHFRCLsttNvr0razH0JsIBSWhE_OQLQbF0ynXGba5ffw?e=DvYs1n'

fetch(url)
.then(response => response.json)
.then(data => console.log(data)) 
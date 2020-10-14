var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');
const readonly = (sessionStorage.getItem('readonly') == null ? true : sessionStorage.getItem('readonly') == 'true' ? true : false);
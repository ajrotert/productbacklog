var db = firebase.firestore();
const readonly = (sessionStorage.getItem('readonly') == null ? false : sessionStorage.getItem('readonly') == 'true' ? true : false);
const canAdd = (sessionStorage.getItem('add') == null ? false : sessionStorage.getItem('add') == 'true' ? true : false);
const canModify = (sessionStorage.getItem('all') == null ? false : sessionStorage.getItem('all') == 'true' ? true : false);

const defaultUser = 'swkq0qAdSwft9yf9ovhmjgw2GJR2';

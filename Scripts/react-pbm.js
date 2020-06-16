'use strict';
var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');

if (uid != null) {
    db.collection(uid).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                var local = doc.data();
                if(local!=null)
                    console.log(local.title + " " + local.description);
            });
    });
}

class NotAuthError extends React.Component {
    render() {
        return (
            <div>
                <h1 className="redError">Not Authorized.</h1>
                <a href="index.html" className="signInLink">Sign In.</a>
            </div>
        );
    }
}

class PBI extends React.Component {
    render() {
        return (
            <div>

            </div>
        );
    }
}

const domContainer = document.querySelector('#root');
if(uid==null)
    ReactDOM.render(<NotAuthError/>, domContainer);
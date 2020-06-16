'use strict';
var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');

    

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
                <ul>{this.props.id}
                    <li>{this.props.title}</li>
                    <li>{this.props.description}</li>
                </ul>
            </div>
        );
    }
}
class PB extends React.Component {
    renderPBI(id, title, description) {
        return (
            <PBI id={id} title={title} description={description} />
            );
    }

    render() {
        //NOT WORKING HERE. JUST SAVING

        const PBIContainer = temp.map((index, array) => {
            db.collection(uid).get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        var local = doc.data();
                        if (local != null) {
                            <div>{this.renderPBI(doc.id, local.title, local.description)}</div>
                        }
                    })
                });
        });

        return (
            <div>
                {PBIContainer}
            </div>
        );
    }
}

const domContainer = document.querySelector('#root');
if (uid == null)
    ReactDOM.render(<NotAuthError />, domContainer);
else {
    ReactDOM.render(<PB />, domContainer);
}
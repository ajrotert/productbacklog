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

        const PBIContainer = this.props.data.docs.map((object, index) => {
            return (
                <div key={index}>{this.renderPBI(object.id, object.data().title, object.data().description)}</div>
                );
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

    db.collection(uid).get()
        .then((snapshot) => {
            ReactDOM.render(<PB data={snapshot} />, domContainer);
        })
}
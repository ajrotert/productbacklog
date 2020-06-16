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
    state() {

    }

    render() {
        return (
            <div className="PBI box_shadow">
                <h1>{this.props.title}</h1>
                <hr />
                <p>Description: {this.props.description}</p>
                <input type="checkbox" id="done" name="done" value={this.props.completed}/>
                    <label htmlFor="done"> Item Completed</label><br />
                <p>ID: {this.props.id}</p>
                
            </div>
        );
    }
}
class PB extends React.Component {
    renderPBI(id, title, description, completed) {
        return (
            <PBI id={id} title={title} description={description} completed={completed} />
            );
    }

    render() {

        const PBIContainer = this.props.data.docs.map((object, index) => {
            return (
                <div className="grid_item_one grid_border_right" key={index}>{this.renderPBI(object.id, object.data().title, object.data().description, object.data().completed)}</div>
                );
        });

        return (
            <div className="grid-container">
                <h1 className="grid_item_one grid_border_bottom">Backlog</h1>
                <h1 className="grid_item_two grid_border_bottom">Completed</h1>
                <div className="grid_item_one grid_border_right">
                   <a className="button" onClick="">New Item</a>
                </div>

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
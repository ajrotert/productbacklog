'use strict';
var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');

function updatePBI(docId, completed) {
    db.collection(uid).doc(docId).update({completed: completed});
};   

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

class ModalView extends React.Component {
    handler() {
        var modal = document.getElementById("InputModal")
        modal.style.display = "none";
    }

    addToDatabase() {
        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;
        if (title != "" && description != "" && uid != null) {

            db.collection(uid).doc().set({
                title: title,
                description: description,
                completed: false
            });
            document.getElementById("InputModal").style.display = "none";
        }
    }

    render() {
        return (
            <div id="InputModal" className="modal">
                <div className="modal-content">
                    <span className="close" onClick={this.handler}>&times;</span>
                    <h1>Please enter the following information: </h1>
                    <label htmlFor="title">Title for Product Backlog Item: </label><br/>
                    <input id="title" type="textbox" name="title" placeholder="Enter title"/>
                    <br />
                    <br />
                    <label htmlFor="description">Product Backlog Item Description: </label><br/>
                    <textarea id="description" name="description" placeholder="Enter description"/>
                    <br />
                    <br />
                    <button onClick={this.addToDatabase}>Submit</button>
                    <br/>
                </div>
            </div>
            );
    }
}

class PBI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shadowColor: "PBI box_shadow_blue"
        }
    }

    render() {
        return (
            <div className={this.state.shadowColor} id={this.props.id}>
                <h1>{this.props.title}</h1>
                <hr />
                <p>Description: {this.props.description}</p>
                <input type="checkbox" id={"done" + this.props.id} name={"done" + this.props.id} checked={this.props.completed} disabled/>
                <label htmlFor={"done" + this.props.id} disabled> Item Completed</label><br />
                <p>ID: {this.props.id}</p>
                
            </div>
        );
    }
}
class PB extends React.Component {
    constructor(props) {
        super(props);
    }

    renderPBI(id, title, description, completed) {
        return (
            <PBI id={id} title={title} description={description} completed={completed} />
            );
    }

    handler(){
        var modal = document.getElementById("InputModal");
        // When the user clicks the button, open the modal 
        modal.style.display = "block";
    }

    pbiClicked = (e) => {
        e.currentTarget.className = e.currentTarget.className == "grid_item_one grid_border_right" ? "grid_item_two grid_border_left" : "grid_item_one grid_border_right";
        e.currentTarget.querySelector('input').checked = !e.currentTarget.querySelector('input').checked;
        updatePBI(e.currentTarget.querySelector('div').id, e.currentTarget.querySelector('input').checked);
    }

    render() {

        const PBIContainer = this.props.data.docs.map((object, index) => {
            var classname = object.data().completed ? "grid_item_two grid_border_left" : "grid_item_one grid_border_right";
            return (
                <div className={classname} onClick={((e) => this.pbiClicked(e))} key={index}>{this.renderPBI(object.id, object.data().title, object.data().description, object.data().completed)}</div>
                );
        });

        return (
            <div className="grid-container">
                <h1 className="grid_item_one grid_border_bottom">Backlog</h1>
                <h1 className="grid_item_two grid_border_bottom">Completed</h1>
                <div className="grid_item_one grid_border_right">
                    <a className="button" onClick={this.handler}>New Item</a>
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

    db.collection(uid)
        .onSnapshot((snapshot) => {
            ReactDOM.render(<PB data={snapshot} />, domContainer);
        })
    ReactDOM.render(<ModalView />, document.querySelector('#rootModal'));
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    var modal = document.getElementById("InputModal")
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
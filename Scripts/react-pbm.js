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

class ModalView extends React.Component {
    handler() {
        var modal = document.getElementById("InputModal")
        modal.style.display = "none";
    }

    addToDatabase() {
        var title = document.getElementById('title').value;
        var description = document.getElementById('description').value;
        console.log(title + " " + description + " " + uid);
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
    render() {
        return (
            <div className="PBI box_shadow">
                <h1>{this.props.title}</h1>
                <hr />
                <p>Description: {this.props.description}</p>
                <input type="checkbox" id={"done" + this.props.id} name={"done" + this.props.id} value={this.props.completed}/>
                <label htmlFor={"done" + this.props.id }> Item Completed</label><br />
                <p>ID: {this.props.id}</p>
                
            </div>
        );
    }
}
class PB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            obj: null
        }
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
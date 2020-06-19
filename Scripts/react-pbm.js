'use strict';
var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');

function updatePbiDatabase(docId, completed) {
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
            shadowColor: "PBI " + (props.completed ? "box_shadow_green" : "box_shadow_blue"),
            completed: props.completed,
            ID: props.id
        }
    }

    updateHandler = (e) => {
        updatePbiDatabase(this.state.ID, !this.state.completed);
        this.setState({ shadowColor: "PBI " + (!this.state.completed ? "box_shadow_green" : "box_shadow_blue"), completed: !this.state.completed, ID: this.state.ID });

        /*
        if (!this.state.completed) {
            var completedItems = document.getElementById('grid2');
            var obj = e.currentTarget.parentElement;
            obj.remove();
            completedItems.appendChild(obj);
        }
        else {
            var inProgressItems = document.getElementById('grid1');
            var obj = e.currentTarget.parentElement;
            obj.remove();
            inProgressItems.appendChild(obj);
        }
        */
    }

    render() {
        return (
            <div className={this.state.shadowColor} id={this.props.id} onClick={(e) => this.updateHandler(e)}>
                <h1>{this.props.title}</h1>
                <hr />
                <p>Description: {this.props.description}</p>
                <input type="checkbox" id={"done" + this.state.ID} name={"done" + this.state.ID} checked={this.state.completed} value="none" disabled/>
                <label htmlFor={"done" + this.state.ID} disabled> Item Completed</label><br />
                <p>ID: {this.state.ID}</p>
                
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

    render() {

        const PBIContainer = this.props.data.docs.map((object, index) => {
            return (
                <div key={index} className={"" + object.data().completed} >{this.renderPBI(object.id, object.data().title, object.data().description, object.data().completed)}</div>
                );
        });

        return (
            <div className="grid-container">
                <div id="grid1">
                    <h1 className="grid_border_bottom">Backlog</h1>
                    <div className="grid_border_right">
                        <a className="button" onClick={this.handler}>New Item</a>
                    </div>
                    {PBIContainer}
                </div>
                <div id="grid2">
                    <h1 className="grid_border_bottom">Completed</h1>
                </div>

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

            var inProgressItems = document.getElementById('grid1');
            var completedItems = document.getElementById('grid2');
            var completedNodeList = new Array(0);
            var inProgressNodeList = new Array(0);
            inProgressItems.childNodes.forEach((node) => {
                if (node.className === 'true') {
                    completedNodeList.push(node);
                }
            });
            completedItems.childNodes.forEach((node) => {
                if (node.className === 'false') {
                    inProgressNodeList.push(node);
                }
            });
            completedNodeList.forEach((node) => {
                completedItems.appendChild(node);
            });
            inProgressNodeList.forEach((node) => {
                inProgressItems.appendChild(node);
            });

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
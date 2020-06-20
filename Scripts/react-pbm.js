'use strict';
var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');

function getPbiDatabase(docId) {
    return db.collection(uid).doc(docId).get();
};
function updatePbiDatabase(docId, completed) {
    return db.collection(uid).doc(docId).update({ completed: completed });
};   
function deletePbiDatabase(docId) {
    return db.collection(uid).doc(docId).delete();
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

const debug = true;

class ModalView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shadowColor: "box_shadow_blue"
        };//this.props.completed ? "box_shadow_green" : "box_shadow_blue"
    }

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
                completed: false,
                timestamp: Date.now()
            });
            document.getElementById("InputModal").style.display = "none";
        }
    }

    render() {
        return (
            <div id="InputModal" className="modal">
                <div className="modal-content">
                    <div className={"samplePBI " + this.state.shadowColor}>
                        <span className="close" onClick={this.handler}>&times;</span>
                        <input className="heading" id="title" type="textbox" name="title" placeholder="Enter Story Title" />
                        <hr/>
                        <br />
                        <textarea id="description" name="description" placeholder="Enter Story Description"/>
                        <br />
                        <br />
                        <input type="checkbox" id="sample_checked" name="sample_checked" checked={false} value="none" disabled />
                        <label htmlFor="sample_checked" disabled> Item Completed</label><br />
                        <br />
                        <div>
                            <p className="small_info">Timestamp: Not yet generated.</p>
                            <p className="small_info">ID: Not yet generated.</p>
                        </div>
                    </div>
                    <br />
                    <br />
                    <center><a className="button" onClick={this.addToDatabase}>Submit</a></center>
                </div>
            </div>
            );
    }
}

class PBI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shadowColor: "PBI " + (this.props.completed ? "box_shadow_green" : "box_shadow_blue"),
            completed: this.props.completed,
            ID: this.props.id
        }
        debug ? console.log(`Constructor: ${this.state.shadowColor} Completed: ${this.state.completed} Title: ${this.props.title} ID: ${this.state.ID}`) : "";
    }

    deleteNode = () => {
        deletePbiDatabase(this.state.ID).then(() => {
        });
        debug ? console.log(`Deleted Node: ${this.state.ID}`) : "";
    }

    updateHandler = (e) => {
        getPbiDatabase(this.state.ID).then((doc) => {
            if (doc.exists) {
                updatePbiDatabase(this.state.ID, !this.state.completed)
                    .then(() => {
                        this.setState({ shadowColor: "PBI " + (!this.state.completed ? "box_shadow_green" : "box_shadow_blue"), completed: !this.state.completed, ID: this.state.ID });
                    })
                    .catch((error) => {
                        debug ? console.error("Error removing document: ", error) : "";
                    });
                debug ? console.log(`Updated Node: ${this.state.ID}`) : "";
            }
            
        });

    }

    render() {
        debug ? console.log(`Rendered PBI: Color: ${this.state.shadowColor} ID: ${this.state.ID} Title: ${this.props.title} Desc: ${this.props.description} Completed: ${this.state.completed}`) : "";
        return (
            <div className={this.state.shadowColor} id={this.state.id} onClick={(e) => this.updateHandler(e)}>
                <span className="close" onClick={() => this.deleteNode()}>&times;</span>
                <h1>{this.props.title}</h1>
                <hr />
                <p>Description: {this.props.description}</p>
                <input type="checkbox" id={"done" + this.state.ID} name={"done" + this.state.ID} checked={this.state.completed} value="none" disabled/>
                <label htmlFor={"done" + this.state.ID} disabled> Item Completed</label><br />
                <p className="small_info">Timestamp: {this.props.timestamp} </p>
                <p className="small_info">ID: {this.state.ID}</p>
            </div>
        );
    }
}
class PB extends React.Component {
    constructor(props) {
        super(props);
    }

    renderPBI(id, title, description, completed, timestamp) {
        debug ? console.log(`Rendered Function: ID: ${id} Title: ${title} Desc: ${description} Completed: ${completed}`) : "";
        return (
            <PBI id={id} title={title} description={description} completed={completed} timestamp={timestamp}/>
            );
    }

    handler(){
        var modal = document.getElementById("InputModal");
        // When the user clicks the button, open the modal 
        modal.style.display = "block";
    }

    render() {
        const orderedData = this.props.data.docs.sort((object1, object2) => object1.data().timestamp > object2.data().timestamp);
        const PBIContainer = orderedData.map((object, index) => {
            return (
                <div key={index} className={"" + object.data().completed} >{this.renderPBI(object.id, object.data().title, object.data().description, object.data().completed, object.data().timestamp)}</div>
                );
        });

        return (
            <div className="grid-container">
                <div id="grid1" className="grid_border_right">
                    <h1 className="grid_border_bottom">Backlog</h1>
                    <div>
                        <a className="button" onClick={this.handler}>New Item</a>
                    </div>
                    {PBIContainer}
                </div>
                <div id="grid2" className="grid_border_left">
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
            ReactDOM.render(<PB data={snapshot} />, domContainer, () => {
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
                if (inProgressItems.childNodes.length > completedItems.childNodes.length) {

                    inProgressItems.className = "grid_border_right";
                    completedItems.className = "";
                }
                else {
                    inProgressItems.className = "";
                    completedItems.className = "grid_border_left";
                }
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
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

const debug = false;

class ModalView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            shadowColor: "box_shadow_blue"
        };
    }

    handler() {
        var modal = document.getElementById("InputModal")
        modal.style.display = "none";
    }

    handlerStory = () => {
        var story = document.getElementById('story-selector').value == 'story';
        this.setState({ shadowColor: story ? "box_shadow_blue" : "box_shadow_red" });
    }

    addToDatabase() {
        var titleNode = document.getElementById('title');
        var descriptionNode = document.getElementById('description');
        var title = titleNode.value;
        var description = descriptionNode.value;
        var story = document.getElementById('story-selector').value == 'story';
        if (title != "" && description != "" && uid != null) {

            db.collection(uid).doc().set({
                title: title,
                description: description,
                completed: false,
                timestamp: Date.now(),
                isStory: story
            });
            titleNode.style.border = "1px solid black";
            descriptionNode.style.border = "1px solid black";
            document.getElementById("InputModal").style.display = "none";
        }
        else {
            if (title == "") {
                titleNode.style.border = "1px solid red";
            }
            else {
                titleNode.style.border = "1px solid black";
            }
            if (description == "") {
                descriptionNode.style.border = "1px solid red";
            }
            else {
                descriptionNode.style.border = "1px solid black";
            }
        }
    }

    render() {
        return (
            <div id="InputModal" className="modal">
                <div className="modal-content">
                    <div className={"samplePBI " + this.state.shadowColor}>
                        <span className="close" onClick={this.handler}>&times;</span>
                        <input className="heading" id="title" type="textbox" name="title" placeholder="Enter Story Title" required/>
                        <hr/>
                        <br />
                        <textarea id="description" name="description" placeholder="Enter Story Description" required/>
                        <br />
                        <br />
                        <select id="story-selector" onChange={() => this.handlerStory()}>
                            <option value="story">Story</option>
                            <option value="defect">Defect</option>
                        </select>
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
            shadowColor: "PBI " + (this.props.completed ? "box_shadow_green" : this.props.isStory ? "box_shadow_blue" : "box_shadow_red"),
            completed: this.props.completed,
            ID: this.props.id
        }
        debug ? console.log(`Constructor: ${this.state.shadowColor} Completed: ${this.state.completed} Title: ${this.props.title} ID: ${this.state.ID}`) : "";
    }

    updateHandler = (e) => {
        if (e.target.className.includes("close")) {
            deletePbiDatabase(this.state.ID).then(() => {
            });
        }
        else {
            getPbiDatabase(this.state.ID).then((doc) => {
                if (doc.exists) {
                    updatePbiDatabase(this.state.ID, !this.state.completed)
                        .then(() => {
                            this.setState({ shadowColor: "PBI " + (!this.state.completed ? "box_shadow_green" : this.props.isStory ? "box_shadow_blue" : "box_shadow_red"), completed: !this.state.completed, ID: this.state.ID });
                        })
                        .catch((error) => {
                            debug ? console.error("Error removing document: ", error) : "";
                        });
                    debug ? console.log(`Updated Node: ${this.state.ID}`) : "";
                }

            });
        }
    }

    render() {
        debug ? console.log(`Rendered PBI: Color: ${this.state.shadowColor} ID: ${this.state.ID} Title: ${this.props.title} Desc: ${this.props.description} Completed: ${this.state.completed}`) : "";
        return (
            <div className={this.state.shadowColor} id={this.state.id} onClick={(e) => this.updateHandler(e)}>
                <span className="close" >&times;</span> 
                <h1>{this.props.title}</h1>
                <hr />
                <p>Description: {this.props.description}</p>
                <h3>{this.props.isStory ? "Story" : "Defect"}</h3>
                <input type="checkbox" id={"done" + this.state.ID} name={"done" + this.state.ID} checked={this.state.completed} value="none" disabled />
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

    renderPBI(id, title, description, completed, timestamp, isStory) {
        debug ? console.log(`Rendered Function: ID: ${id} Title: ${title} Desc: ${description} Completed: ${completed}`) : "";
        return (
            <PBI id={id} title={title} description={description} completed={completed} timestamp={timestamp} isStory={isStory}/>
            );
    }

    handler(){
        var modal = document.getElementById("InputModal");
        modal.style.display = "block";
    }

    render() {
        const orderedData = this.props.data.docs.sort((object1, object2) => object1.data().timestamp > object2.data().timestamp);
        const PBIContainer = orderedData.map((object, index) => {
            debug ? console.log(object.data()) : "";
            return (
                <div key={index} className={"" + object.data().completed} >{this.renderPBI(object.id, object.data().title, object.data().description, object.data().completed, object.data().timestamp, object.data().isStory)}</div>
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
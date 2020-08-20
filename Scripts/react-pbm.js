'use strict';
var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');  //User ID
const pid = sessionStorage.getItem('pid');  //Project ID
const readonly = (sessionStorage.getItem('readonly') == null ? true : sessionStorage.getItem('readonly') == 'true' ? true : false);

function getPbiDatabase(docId) {
    if (!readonly) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).get();
    }
    else {
        //Readonly
    }
};
function updatePbiDatabase(docId, completed) {
    if (!readonly) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).update({ completed: completed });
    }
    else {
        //Readonly
    }
};   
function deleteProjectFromDatabase(docId) {
    if (!readonly) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).delete();
    }
    else {
        //Readonly
    }
};

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(el);
};

function generateShareCodeFromDatabase(longShareCode) {
    var foundInDatabase = false;
        db.collection('shares').where("share_code", "==", longShareCode).limit(1)
        .get()
            .then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) {      //At Max, will contain one record
                    copyToClipboard(doc.id);
                    ReactDOM.render(<ModalShareView share_code={doc.id} />, document.querySelector('#rootShareModal'));
                    document.getElementById("ShareModal").style.display = 'block';

                    foundInDatabase = true;
                    return;
                });
                if (!foundInDatabase) {
                        db.collection('shares').add({
                            share_code: longShareCode
                        })
                            .then((docRef) => {
                                copyToClipboard(docRef.id);
                                ReactDOM.render(<ModalShareView share_code={docRef.id} />, document.querySelector('#rootShareModal'));
                                document.getElementById("ShareModal").style.display = 'block';
                            });
                }
            
        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
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

class NoProjectError extends React.Component {
    render() {
        return (
            <div>
                <h1 className="redError">No Project.</h1>
                <a href="Projects.html" className="signInLink">Select Project.</a>
            </div>
        );
    }
}

const debug = false;

class ModalPbiView extends React.Component {
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

            db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc().set({
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

class ModalShareView extends React.Component {
    handler = () => {
        ReactDOM.unmountComponentAtNode(document.querySelector("#rootShareModal"));
    }

    render() {
        return (
            <div id="ShareModal" className="modal">
                <div className="modal-content">
                    <div className="samplePBI extraPadding">
                        <span className="close" onClick={() => this.handler()}>&times;</span>
                            <h1 className="heading">Allow other users to view your product backlog.</h1>
                            <hr />
                            <br />
                            <h3 className="heading">Code: {this.props.share_code}</h3>
                        </div>
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
    }

    updateHandler = (e) => {
        if (!readonly) {

            if (e.target.className.includes("close")) {
                var confirms = window.confirm(`Delete: ${this.props.title}`);
                if (confirms) {

                    ReactDOM.unmountComponentAtNode(domContainer);

                    deleteProjectFromDatabase(this.state.ID).then(() => {
                    });
                }
            }
            else {
                getPbiDatabase(this.state.ID).then((doc) => {
                    if (doc.exists) {
                        var confirms = window.confirm(`Move: ${this.props.title} \nTo: ${this.state.completed ? "Backlog" : "Completed"}`);
                        if (confirms) {
                            updatePbiDatabase(this.state.ID, !this.state.completed)
                                .then(() => {
                                    this.setState({ shadowColor: "PBI " + (!this.state.completed ? "box_shadow_green" : this.props.isStory ? "box_shadow_blue" : "box_shadow_red"), completed: !this.state.completed, ID: this.state.ID });
                                })
                                .catch((error) => {
                                });
                        }
                    }

                });
            }
        }
        else {
            //Readonly
        }

    }

    render() {
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
        return (
            <PBI id={id} title={title} description={description} completed={completed} timestamp={timestamp} isStory={isStory}/>
            );
    }

    handler() {
        if (!readonly) {
            var modal = document.getElementById("InputModal");
            modal.style.display = "block";
        }
        else {
            //Readonly
        }
        
    }
    shareLink() {
        var shareCode = uid + '»' + pid
        generateShareCodeFromDatabase(shareCode)
    }

    static getDerivedStateFromError(error) {
        console.log(`Error ${error}`);
        window.alert(`A ReactDOM Error Occured. Please reload the webpage.`);
        //location.href = 'ProductBacklog.html';
        return { hasError: true };
    }

    render() {
        function compare(object1, object2) {
            return object1 > object2 ? 1 : -1;
        };
        const orderedData = this.props.data.docs.sort((object1, object2) => compare(object1.data().timestamp, object2.data().timestamp));

        const PBIContainer = orderedData.map((object, index) => {
            return (
                <div key={object.id} className={"" + object.data().completed} >{this.renderPBI(object.id, object.data().title, object.data().description, object.data().completed, object.data().timestamp, object.data().isStory)}</div>
                );
        });

        return (
            <div className="grid-container">
                <div><a id="shareLink" href="#null" onClick={this.shareLink}>Get Shareable Readonly Code</a></div>
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

if (uid == null) {
    ReactDOM.render(<NotAuthError />, domContainer);
}
else if (pid == null) {
    ReactDOM.render(<NoProjectError />, domContainer);
}
else {

    db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog')
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
    ReactDOM.render(<ModalPbiView />, document.querySelector('#rootModal'));
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    var modal = document.getElementById("InputModal")
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

//Prevent user from changing values
window.addEventListener('storage', function (e) {
    if (e.storageArea === sessionStorage) {
        sessionStorage.setItem('uid', uid);
        sessionStorage.setItem('pid', pid);
        sessionStorage.setItem('readonly', readonly);
    }
});
'use strict';
var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');  //User ID
const pid = sessionStorage.getItem('pid');  //Project ID
const bid = sessionStorage.getItem('bid');  //Backlog ID
const readonly = (sessionStorage.getItem('readonly') == null ? true : sessionStorage.getItem('readonly') == 'true' ? true : false);
const backlog_title = sessionStorage.getItem('backlog_title');
const hiddenText = "View hidden items";
const showText = "Stop viewing hidden items";

function getPbiDatabase(docId) {
    if (!readonly) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc(docId).get();
    }
    else {
        //Readonly
    }
};
function updatePbiDatabase(docId, completed) {
    if (!readonly) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc(docId).update({ completed: completed });
    }
    else {
        //Readonly
    }
};
function hidePbiDatabase(docId, hidden) {
    if (!readonly) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc(docId).update({ hidden: hidden });
    }
    else {
        //Readonly
    }
};
function deleteProjectFromDatabase(docId) {
    if (!readonly) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc(docId).delete();
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

function generatePbiModalPopup(hide = false) {
    if (!readonly) {
        ReactDOM.render(<ModalPbiView hide={hide} />, document.querySelector('#rootModal'));

    }
    else {
        //Readonly
    }
}

function generateShareCodeFromDatabase(longShareCode) {
    var foundInDatabase = false;
    db.collection('shares').where("share_code", "==", longShareCode).limit(1)
        .get()
        .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {      //At Max, will contain one record
                copyToClipboard(doc.id);
                ReactDOM.render(<ModalShareView share_code={doc.id} />, document.querySelector('#rootModal'));

                foundInDatabase = true;
                return;
            });
            if (!foundInDatabase) {
                db.collection('shares').add({
                    share_code: longShareCode
                })
                    .then((docRef) => {
                        copyToClipboard(docRef.id);
                        ReactDOM.render(<ModalShareView share_code={docRef.id} />, document.querySelector('#rootModal'));
                    });
            }

        })
        .catch(function (error) {
            console.log("Error getting documents: ", error);
        });

}
function updateHiddenAttributes(show) {
    if (show) {
        var hideItems = document.getElementsByClassName('hide');
        for (var a = 0; a < hideItems.length; a++) {
            hideItems[a].style.display = 'block';
        };
    }
    else {
        var hideItems = document.getElementsByClassName('hide');
        for (var a = 0; a < hideItems.length; a++) {
            hideItems[a].style.display = 'none';
        };
    }
}

//Properties: 
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

//Properties: 
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

//Properties: 
class NoBacklogItemError extends React.Component {
    render() {
        return (
            <div>
                <h1 className="redError">No Backlog Item.</h1>
                <a href="ProductBacklog.html" className="signInLink">Select a Product Backlog Item.</a>
            </div>
        );
    }
}

const debug = false;

//Properties: hide
class ModalPbiView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    handler() {
        ReactDOM.unmountComponentAtNode(document.querySelector("#rootModal"));
    }

    addToDatabase() {
        var titleNode = document.getElementById('title');
        var descriptionNode = document.getElementById('description');
        var title = titleNode.value;
        var description = descriptionNode.value;
        if (title != "" && description != "" && uid != null) {
            var docId = document.getElementById('modalID').innerText;
            if (docId.includes('Not yet generated')) {
                db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc().set({
                    title: title,
                    description: description,
                    completed: false,
                    timestamp: Date.now(),
                });
            }
            else {
                db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc(docId).set({
                    title: title,
                    description: description,
                    completed: document.getElementById('sample_checked').checked,
                    timestamp: document.getElementById('modalTimestamp').innerText,
                });
            }

            titleNode.style.border = "1px solid black";
            descriptionNode.style.border = "1px solid black";
            ReactDOM.unmountComponentAtNode(document.querySelector("#rootModal"));
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
                    <div className={"samplePBI " + "box_shadow_blue"} id="parent-container">
                        <span className="button_icons" onClick={this.handler}>&times;</span>
                        <input className="heading" id="title" type="textbox" name="title" placeholder={"Enter Task Title"} required />
                        <hr />
                        <br />
                        <textarea id="description" name="description" placeholder={"Enter Task Description"} required />
                        <br />
                        <br />
                        <h1>Task</h1>
                        <br />
                        <br />
                        <input type="checkbox" id="sample_checked" name="sample_checked" checked={false} value="none" disabled />
                        <label htmlFor="sample_checked" disabled> Item Completed</label><br />
                        <br />
                        <div>
                            <p className={"small_info" + (!this.props.hide ? " hide" : "")} id="modalHidden">Hidden</p>
                            <p className="small_info" id="modalTimestamp">Timestamp: Not yet generated.</p>
                            <p className="small_info" id="modalID">ID: Not yet generated.</p>
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

//Properties: share_code
class ModalShareView extends React.Component {
    handler = () => {
        ReactDOM.unmountComponentAtNode(document.querySelector("#rootModal"));
    }

    render() {
        return (
            <div id="ShareModal" className="modal">
                <div className="modal-content">
                    <div className="samplePBI extraPadding">
                        <span className="button_icons" onClick={() => this.handler()}>&times;</span>
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

//Properties: stats
class Stats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carrot: '\u2571\u2572'
        };
    }
    toggleContent = (event) => {
        var intervalID;
        var ids = document.getElementById("stats-display");
        const pointsUp = '\u2571\u2572';
        const pointsDown = '\u2572\u2571';
        if (event.target.id != 'hideShowLink') {
            if (ids.classList.contains('hide-const')) {
                ids.classList.remove('hide-const');
                ids.style.opacity = 0;
                this.setState({ carrot: pointsUp });
                intervalID = setInterval(buildOpacity, 15, ids);
            }
            else {
                ids.style.opacity = 1;
                intervalID = setInterval(dropOpacity, 15, ids);
                this.setState({ carrot: pointsDown });
            }
        }

        function buildOpacity(node) {
            var opacity = parseFloat(node.style.opacity) + .05;
            node.style.opacity = opacity;
            if (node.style.opacity >= 1.0) {
                clearInterval(intervalID);
            }
        };

        function dropOpacity(node) {
            var opacity = parseFloat(node.style.opacity) - .05;
            node.style.opacity = opacity;
            if (node.style.opacity <= 0) {
                clearInterval(intervalID);
                node.classList.add('hide-const');

            }
        };
    }



    render() {
        return (
            <div className="status" onClick={(e) => this.toggleContent(event)}>
                <hr />
                <div id="stats-display">
                    <h3>Visible Backlog Items:</h3>
                    <p className="padding-right"><span className="bolder">In Progress: </span> Tasks: <span className="status-story">{this.props.stats.visible.inProgressTask}</span> </p>
                    <p className="padding-right"><span className="bolder">Completed: </span>Tasks: <span className="status-completed">{this.props.stats.visible.completedTask}</span> </p>
                    <h3>Hidden Backlog Items:</h3>
                    <p className="padding-right"><span className="bolder">In Progress: </span> Tasks: <span className="status-story">{this.props.stats.hidden.inProgressTask}</span> </p>
                    <p className="padding-right"><span className="bolder">Completed: </span>Tasks: <span className="status-completed">{this.props.stats.hidden.completedTask}</span> </p>
                    <h3>Total Backlog Items:</h3>
                    <p className="padding-right"><span className="bolder">In Progress: </span> Tasks: <span className="status-story">{this.props.stats.total.inProgressTask}</span> </p>
                    <p className="padding-right"><span className="bolder">Completed: </span>Tasks: <span className="status-completed">{this.props.stats.total.completedTask}</span> </p>
                </div>
                <a id="hideShowLink" href="#null" onClick={this.props.action} >{hiddenText}</a>
                <div id="carrot"> <center> <span>{this.state.carrot}</span> </center></div>
                <hr />
            </div>
        );
    }
}

//Properties: id, title, description, completed, timestamp, hidden, hiddenPB
class PBI extends React.Component {
    constructor(props) {
        super(props);
        var hiddenState = this.props.hidden == null ? false : this.props.hidden;

        this.state = {
            shadowColor: "PBI " + (this.props.completed ? "box_shadow_green" : "box_shadow_blue"),
            completed: this.props.completed,
            ID: this.props.id,
            hide: hiddenState
        }
    }

    updateHandler = (e) => {
        if (!readonly) {

            if (e.target.id == ("close")) {
                var confirms = window.confirm(`Delete: ${this.props.title}`);
                if (confirms) {

                    ReactDOM.unmountComponentAtNode(domContainer);

                    deleteProjectFromDatabase(this.state.ID).then(() => {
                    });
                }
            }
            else if (e.target.id == ("edit")) {

                generatePbiModalPopup(this.state.hide);
                document.getElementById('title').value = this.props.title;
                document.getElementById('description').value = this.props.description;
                document.getElementById('sample_checked').checked = this.state.completed;
                document.getElementById('modalID').innerText = this.state.ID;
                document.getElementById('modalTimestamp').innerText = this.props.timestamp;

            }
            else if (e.target.id == ("hide")) {
                if ((!this.props.hiddenPB && this.state.hide) || this.props.hiddenPB) {
                    var confirms = true;
                    if (!this.state.hide) {
                        confirms = window.confirm(`Hide: ${this.props.title}?`);
                    }
                    if (confirms) {
                        hidePbiDatabase(this.state.ID, !this.state.hide)
                            .then(() => {
                                this.setState({ hide: !this.state.hide });
                                updateHiddenAttributes(!this.props.hiddenPB);
                            })
                        //Update hidden labels.
                    }

                }
                else {
                    window.alert("Cannot hide product backlog items when: \"" + hiddenText + "\" is selected.");
                }

            }
            else if (e.target.id == ("done" + this.state.ID)) {
                getPbiDatabase(this.state.ID).then((doc) => {
                    if (doc.exists) {
                        var confirms = window.confirm(`Move: ${this.props.title} \nTo: ${this.state.completed ? "Backlog" : "Completed"}`);
                        if (confirms) {
                            updatePbiDatabase(this.state.ID, !this.state.completed)
                                .then(() => {
                                    this.setState({ shadowColor: "PBI " + (!this.state.completed ? "box_shadow_green" : "box_shadow_blue"), completed: !this.state.completed, ID: this.state.ID });
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
            <div className={this.state.shadowColor + (this.state.hide ? " hide" : "")} id={this.state.ID} onClick={(e) => this.updateHandler(e)}>
                <span className="button_icons" id="close">&times;</span>
                <span className="button_icons" id="edit" >✎</span>
                <span className="button_icons" id="hide" >☌</span>
                <br className="clears" />
                <h1>{this.props.title}</h1>
                <hr />
                <p>Description: {this.props.description}</p>
                <h3>Task</h3>
                <input type="checkbox" id={"done" + this.state.ID} name={"done" + this.state.ID} checked={this.state.completed} value="none" />
                <label htmlFor={"done" + this.state.ID} disabled> Item Completed</label><br />
                <p className="small_info"> {this.state.hide ? "Hidden" : ""} </p>
                <p className="small_info">Timestamp: {this.props.timestamp} </p>
                <p className="small_info">ID: {this.state.ID}</p>
            </div>
        );
    }
}

//Properties: data
class PB extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidePbiItems: true
        }
        this.handleHiddenItems = this.handleHiddenItems.bind(this);
    }

    renderPBI(id, title, description, completed, timestamp, hidden) {
        return (
            <PBI id={id} title={title} description={description} completed={completed} timestamp={timestamp} hidden={hidden} hiddenPB={this.state.hidePbiItems} />
        );
    };

    handler() {
        generatePbiModalPopup();

    };

    shareLink() {
        var shareCode = uid + '»' + pid
        generateShareCodeFromDatabase(shareCode)
    };

    handleHiddenItems = (event) => {
        var show = event.target.innerText == hiddenText;
        this.setState({ hidePbiItems: !this.state.hidePbiItems });
        updateHiddenAttributes(show);
        if (show) {
            event.target.innerText = showText;
        }
        else {
            event.target.innerText = hiddenText;
        }


    };

    static getDerivedStateFromError(error) {
        console.log(`Error ${error}`);
        window.alert(`A ReactDOM Error Occured. Please reload the webpage.`);
        //location.href = 'ProductBacklog.html';
        return { hasError: true };
    }

    render() {
        var statsGroup = {
            visible: new Object(),
            hidden: new Object(),
            total: new Object()
        };
        var objectInitializer = { //Not used, need to figure out how to dereference
            inProgressStory: 0,
            inProgressDefect: 0,
            completedStory: 0,
            completedDefect: 0
        };
        statsGroup.visible.inProgressTask = 0;
        statsGroup.visible.completedTask = 0;

        statsGroup.hidden.inProgressTask = 0;
        statsGroup.hidden.completedTask = 0;

        statsGroup.total.inProgressTask = 0;
        statsGroup.total.completedTask = 0;


        function compare(object1, object2) {
            return object1 > object2 ? 1 : -1;
        };
        const orderedData = this.props.data.docs.sort((object1, object2) => compare(object1.data().timestamp, object2.data().timestamp));

        const PBIContainer = orderedData.map((object, index) => {
            if (object.data().completed) {
                if (object.data().hidden != null && object.data().hidden) {
                    statsGroup.hidden.completedTask++;
                }
                else {
                    statsGroup.visible.completedTask++;
                }
                statsGroup.total.completedTask++;
            }
            else if (!object.data().completed) {
                if (object.data().hidden != null && object.data().hidden) {
                    statsGroup.hidden.inProgressTask++;
                }
                else {
                    statsGroup.visible.inProgressTask++;
                }
                statsGroup.total.inProgressTask++;
            }

            return (
                <div key={object.id} className={"" + object.data().completed} >{this.renderPBI(object.id, object.data().title, object.data().description, object.data().completed, object.data().timestamp, object.data().hidden)}</div>
            );
        });

        return (
            <div className="grid-container">
                <div>
                    <h1 className="pages">Product Backlog Item: {backlog_title}</h1>
                    <a id="shareLink" href="#null" onClick={this.shareLink}>Get Shareable Readonly Code</a>
                </div>

                <Stats stats={statsGroup} action={this.handleHiddenItems} />

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
    document.getElementById('loading-gif').style.display = 'none';
}
else if (pid == null) {
    ReactDOM.render(<NoProjectError />, domContainer);
    document.getElementById('loading-gif').style.display = 'none';
}
else if (bid == null) {
    ReactDOM.render(<NoBacklogItemError />, domContainer);
    document.getElementById('loading-gif').style.display = 'none';
}
else {
    db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog')
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

            document.getElementById('loading-gif').style.display = 'none';

        })
}

//Prevent user from changing values
window.addEventListener('storage', function (e) {
    if (e.storageArea === sessionStorage) {
        sessionStorage.setItem('uid', uid);
        sessionStorage.setItem('pid', pid);
        sessionStorage.setItem('bid', bid);
        sessionStorage.setItem('readonly', readonly);
    }
});
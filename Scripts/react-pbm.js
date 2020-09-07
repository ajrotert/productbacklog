'use strict';
var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');  //User ID
const pid = sessionStorage.getItem('pid');  //Project ID
const readonly = (sessionStorage.getItem('readonly') == null ? true : sessionStorage.getItem('readonly') == 'true' ? true : false);
const SHOW_HIDDEN_ITEMS = "Show hidden items";
const STOP_SHOWING_HIDDEN_ITEMS = "Stop showing hidden items";
const SHOW_IN_PROGRESS_ITEMS = "Show in progress items";
const SHOW_ALL_ITEMS = "Show all items";
const SHOW_ENTIRE_BACKLOG = "Show entire backlog";
const SHOW_FIXED_SIZE_BACKLOG = "Show fixed size backlog";

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
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).update({ completed: completed, inprogress: false});
    }
    else {
        //Readonly
    }
};
function updatePbiDatabaseWithInprogress(docId, inprogress) {
    if (!readonly) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).update({ inprogress: inprogress });
    }
    else {
        //Readonly
    }
};
function hidePbiDatabase(docId, hidden) {
    if (!readonly) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).update({ hidden: hidden, inprogress: false });
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
function getTasksDatabase(bid) {
      return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').get();
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

function generatePbiModalPopup(shadowColor = null, hide = false) {
    if (!readonly) {
        ReactDOM.render(<ModalPbiView shadow={shadowColor} placeholderValue={shadowColor == null ? null : "Defect"} hide={hide} />, document.querySelector('#rootModal'));

    }
    else {
        //Readonly
    }
}
function getProjectDocFromDatabase() {
    return db.collection('users').doc(uid).collection('Projects').doc(pid).get();
};

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
function updateInProgressAttributes(showOnly) {

    if (showOnly) {
        var hideItems = document.getElementsByClassName('inprogress-not-selector');
        for (var a = 0; a < hideItems.length; a++) {
            if (!hideItems[a].classList.contains('hide'))
                hideItems[a].style.display = 'none';
        };
    }
    else {
        var hideItems = document.getElementsByClassName('inprogress-not-selector');
        for (var a = 0; a < hideItems.length; a++) {
            if (!hideItems[a].classList.contains('hide'))
                hideItems[a].style.display = 'block';
        };
    }
}
function updateBacklogUI() {
    var left = document.getElementById('grid1');
    var right = document.getElementById('grid2');
    var button = document.getElementById('bottom-button');
    if (button.innerText == SHOW_FIXED_SIZE_BACKLOG) {
        left.style.height = 'auto';
        right.style.height = 'auto';
        if (left.offsetHeight > right.offsetHeight)
            right.style.height = left.offsetHeight + 'px';
        else
            left.style.height = right.offsetHeight + 'px';
    }
    else {
        left.style.height = '85vh';
        right.style.height = '85vh';
    }
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
            shadowColor: props.shadow == null ? "box_shadow_blue" : props.shadow,
            placeholderText: props.placeholderValue == null ? "Story" : props.placeholderValue
        };
    }

    handler() {
        ReactDOM.unmountComponentAtNode(document.querySelector("#rootModal"));
    }

    handlerStory = () => {
        var story = document.getElementById('story-selector').value == 'story';
        this.setState({ shadowColor: story ? "box_shadow_blue" : "box_shadow_red" });
        this.setState({ placeholderText: story ? "Story" : "Defect" });
    }

    addToDatabase() {
        var titleNode = document.getElementById('title');
        var descriptionNode = document.getElementById('description');
        var title = titleNode.value;
        var description = descriptionNode.value;
        var story = document.getElementById('story-selector').value == 'story';
        if (title != "" && description != "" && uid != null) {
            var docId = document.getElementById('modalID').innerText;
            if (docId.includes('Not yet generated')) {
                db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc().set({
                    title: title,
                    description: description,
                    completed: false,
                    timestamp: Date.now(),
                    isStory: story
                });
            }
            else {
                db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).set({
                    title: title,
                    description: description,
                    completed: document.getElementById('sample_checked').checked,
                    timestamp: document.getElementById('modalTimestamp').innerText,
                    isStory: story
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
                    <div className={"samplePBI " + this.state.shadowColor} id="parent-container">
                        <span className="button_icons" onClick={this.handler}>&times;</span>
                        <input className="heading" id="title" type="textbox" name="title" placeholder={"Enter " + this.state.placeholderText + " Title"} required/>
                        <hr/>
                        <br />
                        <textarea id="description" name="description" placeholder={"Enter " + this.state.placeholderText + " Description"} required/>
                        <br />
                        <br />
                        <select id="story-selector" onChange={() => this.handlerStory()}>
                            <option value="story">Story</option>
                            <option value="defect">Defect</option>
                        </select>
                        <br />
                        <br />
                        <input type="checkbox" id="sample_checked1" name="sample_checked1" checked={false} value="none" disabled />
                        <label htmlFor="sample_checked1" id="sample_label1" disabled> In Progress </label><br /><br />
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
//Props: state: name, description
class Projects extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="project_item" >
                <h1>{this.props.state.name}</h1>
                <hr />
                <h3>{this.props.state.description}</h3>
            </div>
        );
    }
}

class Heading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Loading name...",
            description: "Loading description..."
        };
    }

    componentDidMount() {
        getProjectDocFromDatabase()
            .then((doc) => {
                this.setState({
                    description: doc.data().description,
                    name: doc.data().name
                });
            });
    }

    shareLink() {
        var shareCode = uid + '»' + pid
        generateShareCodeFromDatabase(shareCode)
    };

    render() {
        return (
            <div>
                <h1 className="pages">Selected Project: </h1>
                <Projects state={this.state}/>
                <a id="shareLink" href="#null" onClick={this.shareLink}>Get Shareable Readonly Code</a>
            </div>
        );

    }
}

class Stats extends React.Component {
    constructor(props) {
        super(props);
        const hidden = localStorage.getItem('PBSTATSAREAHIDDEN');
        this.state = {
            carrot: '\u2571\u2572',
            hidden: hidden == null ? 'false' : hidden
        };
    }
    toggleContent = (event) => {
        var intervalID;
        var ids = document.getElementById("stats-display");
        const pointsUp = '\u2571\u2572';
        const pointsDown = '\u2572\u2571';
        if (!event.target.id.includes('hideShowLink')) {
            if (ids.classList.contains('hide-const')) {
                ids.classList.remove('hide-const');
                ids.style.opacity = 0;
                localStorage.setItem('PBSTATSAREAHIDDEN', 'false');
                this.setState({ carrot: pointsUp });
                intervalID = setInterval(buildOpacity, 15, ids);
            }
            else {
                ids.style.opacity = 1;
                localStorage.setItem('PBSTATSAREAHIDDEN', 'true');
                this.setState({ carrot: pointsDown });
                intervalID = setInterval(dropOpacity, 15, ids);
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
            <div> {readonly ? <h1 className="readonly-link">READ-ONLY</h1> : null} <br className="clears" /></div>
            <div id="stats-display" className={this.state.hidden == 'true' ? "hide-const" : ""}>
                <h3>Visible Backlog Items:</h3>
                <p className="padding-right"><span className="bolder">Available: </span> Defects: <span className="status-defect">{this.props.stats.visible.inProgressDefect}</span> Stories: <span className="status-story">{this.props.stats.visible.inProgressStory} </span></p>
                <p className="padding-right"><span className="bolder">Completed: </span>Defects: <span className="status-completed">{this.props.stats.visible.completedDefect}</span> Stories: <span className="status-completed">{this.props.stats.visible.completedStory}</span> </p>
                <h3>Hidden Backlog Items:</h3>
                <p className="padding-right"><span className="bolder">Available: </span> Defects: <span className="status-defect">{this.props.stats.hidden.inProgressDefect}</span> Stories: <span className="status-story">{this.props.stats.hidden.inProgressStory} </span></p>
                <p className="padding-right"><span className="bolder">Completed: </span>Defects: <span className="status-completed">{this.props.stats.hidden.completedDefect}</span> Stories: <span className="status-completed">{this.props.stats.hidden.completedStory}</span> </p>
                <h3>Total Backlog Items:</h3>
                <p className="padding-right"><span className="bolder">Available: </span> Defects: <span className="status-defect">{this.props.stats.total.inProgressDefect}</span> Stories: <span className="status-story">{this.props.stats.total.inProgressStory} </span></p>
                <p className="padding-right"><span className="bolder">Completed: </span>Defects: <span className="status-completed">{this.props.stats.total.completedDefect}</span> Stories: <span className="status-completed">{this.props.stats.total.completedStory}</span> </p>
            </div>
            <br className="clears" />
            <a id="hideShowLink" className="stats-links padding-left" href="#null" onClick={this.props.action} >{SHOW_HIDDEN_ITEMS}</a><br className="clears" />
            <a id="hideShowLink-inprogress" className="stats-links padding-left" href="#null" onClick={this.props.action2} >{SHOW_IN_PROGRESS_ITEMS}</a>
                <div id="carrot"> <center> <span>{this.state.carrot}</span> </center></div>
                <hr />
            </div>
            );
    }
}

class PBI extends React.Component {
    constructor(props) {
        super(props);
        var hiddenState = this.props.hidden == null ? false : this.props.hidden;

        this.state = {
            shadowColor: "PBI " + (this.props.completed ? "box_shadow_green" : this.props.isStory ? "box_shadow_blue" : "box_shadow_red"),
            completed: this.props.completed,
            ID: this.props.id,
            hide: hiddenState,
            inprogress: this.props.inprogress == null ? false : this.props.inprogress,
            tasks: "Loading..."
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

                generatePbiModalPopup(this.props.isStory ? null : "box_shadow_red", this.state.hide);
                document.getElementById('title').value = this.props.title;
                document.getElementById('description').value = this.props.description;
                document.getElementById('story-selector').selectedIndex = this.props.isStory ? 0 : 1;
                document.getElementById('sample_checked1').checked = this.state.inprogress;
                document.getElementById('sample_checked1').hidden = this.state.completed;
                document.getElementById('sample_label1').hidden = this.state.completed;
                document.getElementById('sample_checked').checked = this.state.completed;
                document.getElementById('modalID').innerText = this.state.ID;
                document.getElementById('modalTimestamp').innerText = this.props.timestamp;

            }
            else if (e.target.id == ("hide")) {
                document.body.style.cursor = 'wait';
                var confirms = true;
                if (!this.state.hide) {
                    document.body.style.cursor = 'default';
                    confirms = window.confirm(`Hide: ${this.props.title}?`);
                }
                if (confirms) {
                    document.body.style.cursor = 'wait';
                    hidePbiDatabase(this.state.ID, !this.state.hide)
                        .then(() => {
                            this.setState({ hide: !this.state.hide, inprogress: false });
                            updateHiddenAttributes(!this.props.hiddenPB);
                            document.body.style.cursor = 'default';
                        })
                        .catch((error) => {
                            document.body.style.cursor = 'default';
                        });
                }
                else {
                    document.body.style.cursor = 'default';
                }

            }
            else if (e.target.id == ("done" + this.state.ID)) {
                document.body.style.cursor = 'wait';
                getPbiDatabase(this.state.ID).then((doc) => {
                    if (doc.exists) {
                        document.body.style.cursor = 'default';
                        var confirms = window.confirm(`Move: ${this.props.title} \nTo: ${this.state.completed ? "Backlog" : "Completed"}`);
                        if (confirms) {
                            document.body.style.cursor = 'wait';
                            updatePbiDatabase(this.state.ID, !this.state.completed)
                                .then(() => {
                                    this.setState({ shadowColor: "PBI " + (!this.state.completed ? "box_shadow_green" : this.props.isStory ? "box_shadow_blue" : "box_shadow_red"), completed: !this.state.completed, ID: this.state.ID, inprogress: false });
                                    updateInProgressAttributes(this.props.showInprogress);
                                    document.body.style.cursor = 'default';
                                })
                                .catch((error) => {
                                    document.body.style.cursor = 'default';
                                });
                        }
                    }
                    else {
                        document.body.style.cursor = 'default';
                    }

                });
            }
            else if (e.target.id == ("inprogress" + this.state.ID)) {
                document.body.style.cursor = 'wait';
                if (!this.state.hide) {
                    getPbiDatabase(this.state.ID).then((doc) => {
                        if (doc.exists) {
                            updatePbiDatabaseWithInprogress(this.state.ID, !this.state.inprogress)
                                .then(() => {
                                    this.setState({ inprogress: !this.state.inprogress });
                                    updateInProgressAttributes(this.props.showInprogress);
                                    document.body.style.cursor = 'default';
                                })
                                .catch((error) => {
                                    document.body.style.cursor = 'default';
                                });
                        }
                        else {
                            document.body.style.cursor = 'default';
                        }

                    });
                }
                else {
                    document.body.style.cursor = 'default';
                    window.alert("Cannot set in progress when product backlog item is hidden.");
                }
            }
            else if (e.target.id != ("inprogressL" + this.state.ID) && e.target.id != ("doneL" + this.state.ID)) {
                //Present task view
                sessionStorage.setItem('uid', uid);
                sessionStorage.setItem('pid', pid);
                sessionStorage.setItem('bid', this.state.ID);
                window.location.href = 'Tasks.html';
            }
        }
        else {
            if (e.target.id != ("close") && e.target.id != ("edit") && e.target.id != ("hide") && e.target.id != ("done" + this.state.ID) && e.target.id != ("inprogress" + this.state.ID)) {
                //Present task view
                sessionStorage.setItem('uid', uid);
                sessionStorage.setItem('pid', pid);
                sessionStorage.setItem('bid', this.state.ID);
                window.location.href = 'Tasks.html';
            }
        }

    }

    componentDidMount() {
        //getTasksDatabase(this.state.ID)       //This method requires to many database calls. 
        //    .then((res) => {
        //        console.log(res);
        //        this.setState({ tasks: res.docs.length });
        //    });                <p className="small_info">Tasks: {this.state.tasks} </p>

    }

    render() {
        return (
            <div className={this.state.shadowColor + (this.state.hide ? " hide" : "") + (this.state.inprogress ? " inprogress-selector" : " inprogress-not-selector")} id={this.state.id} onClick={(e) => this.updateHandler(e)}>
                <span className="button_icons" id="close">&times;</span>
                <span className="button_icons" id="edit" >✎</span>
                <span className="button_icons" id="hide" >☌</span>
                <br className="clears" />
                <h1>{this.props.title}</h1>
                <hr />
                <p>Description: {this.props.description}</p>
                <h3>{this.props.isStory ? "Story" : "Defect"}</h3>
                <input type="checkbox" id={"inprogress" + this.state.ID} name={"inprogress" + this.state.ID} checked={this.state.inprogress} value="none" hidden={this.state.completed} disabled={this.state.hide}/>
                <label id={"inprogressL" + this.state.ID} htmlFor={"inprogress" + this.state.ID} disabled hidden={this.state.completed}> In Progress</label><br /><br />
                <input type="checkbox" id={"done" + this.state.ID} name={"done" + this.state.ID} checked={this.state.completed} value="none" />
                <label id={"doneL" + this.state.ID} htmlFor={"done" + this.state.ID} disabled> Item Completed</label><br />
                <p className="small_info"> {this.state.hide ? "Hidden" : ""} </p>
                <p className="small_info">Timestamp: {this.props.timestamp} </p>
                <p className="small_info">ID: {this.state.ID}</p>
            </div>
        );
    }
}
class PB extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            hidePbiItems: true,
            showInprogress: false
        }
        this.handleHiddenItems = this.handleHiddenItems.bind(this);
        this.toggleInprogress = this.toggleInprogress.bind(this);
    }

    renderPBI(id, title, description, completed, timestamp, isStory, hidden, inprogress) {
        return (
            <PBI id={id} title={title} description={description} completed={completed} timestamp={timestamp} isStory={isStory} hidden={hidden} hiddenPB={this.state.hidePbiItems} showInprogress={this.state.showInprogress} inprogress={inprogress}/>
            );
    };

    handler() {
        generatePbiModalPopup();
        
    };
    increaseHeight() {
        var button = document.getElementById('bottom-button');
        if (button.innerText == SHOW_ENTIRE_BACKLOG) {
            button.innerText = SHOW_FIXED_SIZE_BACKLOG;
        }
        else {
            button.innerText = SHOW_ENTIRE_BACKLOG;
        }
        updateBacklogUI()
    }

    handleHiddenItems = (event) => {
        var show = event.target.innerText == SHOW_HIDDEN_ITEMS;
        this.setState({ hidePbiItems: !this.state.hidePbiItems });
        updateHiddenAttributes(show);
        if (show) {
            event.target.innerText = STOP_SHOWING_HIDDEN_ITEMS;
        }
        else {
            event.target.innerText = SHOW_HIDDEN_ITEMS;
        }
        updateBacklogUI();
    };
    toggleInprogress = (event) => {
        var show = event.target.innerText == SHOW_IN_PROGRESS_ITEMS;
        updateInProgressAttributes(show);
        this.setState({ showInprogress: !this.state.showInprogress });
        if (show) {
            event.target.innerText = SHOW_ALL_ITEMS;
        }
        else {
            event.target.innerText = SHOW_IN_PROGRESS_ITEMS;
        }
        updateBacklogUI();
    }

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
        statsGroup.visible.inProgressStory = 0;
        statsGroup.visible.inProgressDefect = 0;
        statsGroup.visible.completedStory = 0;
        statsGroup.visible.completedDefect = 0;

        statsGroup.hidden.inProgressStory = 0;
        statsGroup.hidden.inProgressDefect = 0;
        statsGroup.hidden.completedStory = 0;
        statsGroup.hidden.completedDefect = 0;

        statsGroup.total.inProgressStory = 0;
        statsGroup.total.inProgressDefect = 0;
        statsGroup.total.completedStory = 0;
        statsGroup.total.completedDefect = 0;


        function compare(object1, object2) {
            return object1 > object2 ? 1 : -1;
        };
        const orderedData = this.props.data.docs.sort((object1, object2) => compare(object1.data().timestamp, object2.data().timestamp));

        const PBIContainer = orderedData.map((object, index) => {
            if (object.data().completed && object.data().isStory) {
                if (object.data().hidden != null && object.data().hidden) {
                    statsGroup.hidden.completedStory++;
                }
                else {
                    statsGroup.visible.completedStory++;
                }
                statsGroup.total.completedStory++;
            }
            else if (object.data().completed && !object.data().isStory) {
                if (object.data().hidden != null && object.data().hidden) {
                    statsGroup.hidden.completedDefect++;
                }
                else {
                    statsGroup.visible.completedDefect++;
                }
                statsGroup.total.completedDefect++;
            }
            else if (!object.data().completed && object.data().isStory) {
                if (object.data().hidden != null && object.data().hidden) {
                    statsGroup.hidden.inProgressStory++;
                }
                else {
                    statsGroup.visible.inProgressStory++;
                }
                statsGroup.total.inProgressStory++;
            }
            else if (!object.data().completed && !object.data().isStory) {
                if (object.data().hidden != null && object.data().hidden) {
                    statsGroup.hidden.inProgressDefect++;
                }
                else {
                    statsGroup.visible.inProgressDefect++;
                }
                statsGroup.total.inProgressDefect++;
            }
            return (
                <div key={object.id} className={"" + object.data().completed} >{this.renderPBI(object.id, object.data().title, object.data().description, object.data().completed, object.data().timestamp, object.data().isStory, object.data().hidden, object.data().inprogress)}</div>
                );
        });

        return (
            <div>
                <div className="grid-container">

                <Heading />

                <Stats stats={statsGroup} action={this.handleHiddenItems} action2={this.toggleInprogress} />

                <div id="pregrid1" className="grid_border_right">
                    <h1 className="grid_border_bottom">Backlog</h1>
                </div>
                <div id="pregrid2" className="grid_border_left">
                    <h1 className="grid_border_bottom">Backlog</h1>
                </div>

                <div id="grid1" className="grid_border_right">
                    <div>
                        <a className="button" onClick={this.handler}>New Item</a>
                    </div>
                    {PBIContainer}
                </div>
                <div id="grid2" className="grid_border_left"></div>

                </div>

                <div>
                    <hr />
                    <a id="bottom-button" className="standard-link" href="#null" onClick={this.increaseHeight} >{SHOW_ENTIRE_BACKLOG}</a><br />
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
                
            });

            document.getElementById('loading-gif').style.display = 'none';

        })
}
//Deselect any projects
window.onload = function () {
    this.sessionStorage.removeItem('bid');
}

//Prevent user from changing values
window.addEventListener('storage', function (e) {
    if (e.storageArea === sessionStorage) {
        sessionStorage.setItem('uid', uid);
        sessionStorage.setItem('pid', pid);
        sessionStorage.setItem('readonly', readonly);
    }
});

window.addEventListener("pageshow", function (event) {
    var historyTraversal = event.persisted ||
        (typeof window.performance != "undefined" &&
            window.performance.navigation.type === 2);
    if (historyTraversal) {
        // Handle page restore.
        window.location.reload();
    }
});
﻿'use strict';
var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');  //User ID
const pid = sessionStorage.getItem('pid');  //Project ID
const readonly = (sessionStorage.getItem('readonly') == null ? false : sessionStorage.getItem('readonly') == 'true' ? true : false);
const canAdd = (sessionStorage.getItem('add') == null ? false : sessionStorage.getItem('add') == 'true' ? true : false);
const canModify = (sessionStorage.getItem('all') == null ? false : sessionStorage.getItem('all') == 'true' ? true : false);
const SHOW_HIDDEN_ITEMS = "Show hidden items";
const STOP_SHOWING_HIDDEN_ITEMS = "Stop showing hidden items";
const SHOW_IN_PROGRESS_ITEMS = "Show in progress items";
const SHOW_ALL_ITEMS = "Show all items";
const SHOW_ENTIRE_BACKLOG = "Show entire backlog";
const SHOW_FIXED_SIZE_BACKLOG = "Show fixed size backlog";
const ADD_YOUR_FIRST_STORY = "Add your first story";
const PRESS_NEW_ITEM_TO_ADD_YOUR_FIRST_STORY = "Press 'New Item' to add your first story";
const USERS_WITH_THIS_CODE_CAN_ONLY_VIEW_THE_PRODUCT_BACKLOG_USERS_CANNOT_ADD_OR_MODIFY_ANY_STORIES_OR_DEFECTS = "Users with this code can only view the product backlog. Users cannot add or modify any stories or defects.";
const USERS_WITH_THIS_CODE_CAN_VIEW_AND_ADD_TO_THE_PRODUCT_BACKLOG_USERS_CANNOT_MODIFY_ANY_EXISTING_STORIES_OR_DEFECTS = "Users with this code can view and add to the product backlog. Users cannot modify any stories or defects.";
const USERS_WITH_THIS_CODE_CAN_VIEW_ADD_AND_MODIFY_THE_PRODUCT_BACKLOG_USERS_CAN_ADD_EDIT_AND_DELETE_ANY_STORY_OR_DEFECT = "Users with this code can view, add, and modify the product backlog. Users can add, edit, and delete any story or defect.";

function getPbiDatabase(docId) {
    if (!readonly || canModify) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).get();
    }
    else {
        //Readonly
    }
};
function updatePbiDatabase(docId, completed) {
    if (!readonly || canModify) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).update({ completed: completed, inprogress: false});
    }
    else {
        //Readonly
    }
};
function updatePbiDatabaseWithInprogress(docId, inprogress) {
    if (!readonly || canModify) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).update({ inprogress: inprogress });
    }
    else {
        //Readonly
    }
};
function hidePbiDatabase(docId, hidden) {
    if (!readonly || canModify) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).update({ hidden: hidden, inprogress: false });
    }
    else {
        //Readonly
    }
}; 
function deleteProjectFromDatabase(docId) {
    if (!readonly || canModify) {
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

function generatePbiModalPopup(shadowColor = null, hide = false) {
    if (!readonly || canAdd || canModify) {
        ReactDOM.render(<ModalPbiView shadow={shadowColor} placeholderValue={shadowColor == null ? null : "Defect"} hide={hide} />, document.querySelector('#rootModal'));

    }
    else {
        //Readonly
    }
}
function getProjectDocFromDatabase() {
    return db.collection('users').doc(uid).collection('Projects').doc(pid).get();
};

function generateShareCodeFromDatabase(sentUid, sentPid, read, add, all) {
    //Moved to event handler, need to sync returns
}

function generateShareCodePopup() {
    ReactDOM.render(<ModalShareView />, document.querySelector('#rootModal'));
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
                {this.props.children}
            </div>
        );
    }
}

//Properties:
class NotAuthErrorDemo extends React.Component {
    render() {
        return (
            <NotAuthError>
                <hr />
                <h1>Product Backlog: </h1>
                <h3>Easily manage projects through a product backlog. Each project has its own product backlog.</h3>
                <img src="./Images/Demos/ProductBacklogDemo.png" className="resize-img-margin" />
            </NotAuthError>
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
                    isStory: story,
                    task_counter: 0
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
    constructor(props) {
        super(props);
        this.state = {
            share_code: null,
            share_text: USERS_WITH_THIS_CODE_CAN_ONLY_VIEW_THE_PRODUCT_BACKLOG_USERS_CANNOT_ADD_OR_MODIFY_ANY_STORIES_OR_DEFECTS
        }
    }

    handler = () => {
        ReactDOM.unmountComponentAtNode(document.querySelector("#rootModal"));
    }

    updateAccess = (e) => {
        if (e.target.value == 'read') {
            this.setState({ share_text: USERS_WITH_THIS_CODE_CAN_ONLY_VIEW_THE_PRODUCT_BACKLOG_USERS_CANNOT_ADD_OR_MODIFY_ANY_STORIES_OR_DEFECTS });
        }
        else if (e.target.value == 'add') {
            this.setState({ share_text: USERS_WITH_THIS_CODE_CAN_VIEW_AND_ADD_TO_THE_PRODUCT_BACKLOG_USERS_CANNOT_MODIFY_ANY_EXISTING_STORIES_OR_DEFECTS });
        }
        else if (e.target.value == 'all') {
            this.setState({ share_text: USERS_WITH_THIS_CODE_CAN_VIEW_ADD_AND_MODIFY_THE_PRODUCT_BACKLOG_USERS_CAN_ADD_EDIT_AND_DELETE_ANY_STORY_OR_DEFECT });
        }
    }

    getShareCode = () => {
        var read = false, write = false, add = false;
        if (this.state.share_text == USERS_WITH_THIS_CODE_CAN_ONLY_VIEW_THE_PRODUCT_BACKLOG_USERS_CANNOT_ADD_OR_MODIFY_ANY_STORIES_OR_DEFECTS) {
            read = true;
        }
        else if (this.state.share_text == USERS_WITH_THIS_CODE_CAN_VIEW_AND_ADD_TO_THE_PRODUCT_BACKLOG_USERS_CANNOT_MODIFY_ANY_EXISTING_STORIES_OR_DEFECTS) {
            read = true;
            add = true;
        }
        else if (this.state.share_text == USERS_WITH_THIS_CODE_CAN_VIEW_ADD_AND_MODIFY_THE_PRODUCT_BACKLOG_USERS_CAN_ADD_EDIT_AND_DELETE_ANY_STORY_OR_DEFECT) {
            read = true;
            add = true;
            write = true;
        }

        var foundInDatabase = false;
        db.collection('shares')
            .where("shared_uid", "==", uid)
            .where("shared_pid", "==", pid)
            .where("read", "==", read)
            .where("add", "==", add)
            .where("write", "==", write)
            .where("inactive", "==", false)
            .limit(1)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {      //At Max, will contain one record
                    copyToClipboard(doc.id);
                    foundInDatabase = true;
                    this.setState({ share_code: doc.id });
                });
                if (!foundInDatabase) {
                    db.collection('shares').add({
                        shared_uid: uid,
                        shared_pid: pid,
                        read: read,
                        write: write,
                        add: add,
                        inactive: false
                    })
                        .then((docRef) => {
                            copyToClipboard(docRef.id);
                            this.setState({ share_code: docRef.id });
                        });
                }

            })
            .catch(function (error) {
                console.log("Error getting documents: ", error);
            });

    }

    render() {
        return (
            <div id="ShareModal" className="modal">
                <div className="modal-content">
                    <div className="samplePBI extraPadding">
                        <span className="button_icons" onClick={() => this.handler()}>&times;</span>
                        <h1 className="heading">Allow other users to view your product backlog.</h1>
                        <hr />
                        <select id="access-selector" onChange={(e) => this.updateAccess(e)}>
                            <option value="read">Only Read Access</option>
                            <option value="add" disabled={readonly && !canAdd}>Add Access</option>
                            <option value="all" disabled={readonly && !canModify}>Add/Edit/Modify Access</option>
                        </select>
                        <h4>{this.state.share_text}</h4>
                        <button onClick={this.getShareCode.bind(this)}>Generate</button>
                        <hr />
                        <br />
                        <h3 className="heading">Code: {this.state.share_code}</h3>
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
        generateShareCodePopup();
        //generateShareCodeFromDatabase(uid, pid)
    };

    render() {
        return (
            <div>
                <h1 className="pages">Selected Project: </h1>
                <Projects state={this.state}/>
                <a id="shareLink" href="#null" onClick={this.shareLink}>Get Your Shareable Code</a>
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
            hidden: hidden == null ? 'false' : hidden,
            searchCount: 0
        };
    }
    toggleContent = (event) => {
        var intervalID;
        var ids = document.getElementById("stats-display");
        var searchFeatures = document.getElementById('search-radios-container');
        const pointsUp = '\u2571\u2572';
        const pointsDown = '\u2572\u2571';
        if (!event.target.id.includes('hideShowLink')) {
            if (ids.classList.contains('hide-const') || searchFeatures.classList.contains('hide-const')) {
                //Show elements
                ids.classList.remove('hide-const');
                searchFeatures.classList.remove('hide-const');
                ids.style.opacity = 0;
                searchFeatures.style.opacity = 0;
                this.setState({ carrot: pointsUp });
                localStorage.setItem('TASKSTATSAREAHIDDEN', 'false');
                intervalID = setInterval(buildOpacity, 15, ids, searchFeatures);
            }
            else {
                //Hide elements
                ids.style.opacity = 1;
                searchFeatures.style.opacity = 1;
                localStorage.setItem('TASKSTATSAREAHIDDEN', 'true');
                this.setState({ carrot: pointsDown });
                intervalID = setInterval(dropOpacity, 15, ids, searchFeatures);
            }
        }

        function buildOpacity(node, node2 = null) {
            var opacity = parseFloat(node.style.opacity) + .05;
            node.style.opacity = opacity;
            if (node2 != null)
                node2.style.opacity = opacity;
            if (node.style.opacity >= 1.0) {
                clearInterval(intervalID);
            }
        };

        function dropOpacity(node, node2 = null) {
            var opacity = parseFloat(node.style.opacity) - .05;
            node.style.opacity = opacity;
            node2.style.opacity = opacity;
            if (node.style.opacity <= 0) {
                clearInterval(intervalID);
                node.classList.add('hide-const');
                node2.classList.add('hide-const');

            }
        };
    }

    searching = (event) => {
        var searchItems;
        var hideItems;

        if (event.target.value != "") {
            var keyword = event.target.value;
            var checkboxes = document.getElementsByName('search-criteria');
            var selectedValue = "inProgress";
            for (let radios of checkboxes) {
                if (radios.checked)
                    selectedValue = radios.value;
            }

            if (selectedValue == "inProgress") {
                searchItems = document.getElementById('grid1');
                hideItems = document.getElementById('grid2');
            }
            else if (selectedValue == "completed") {
                searchItems = document.getElementById('grid2');
                hideItems = document.getElementById('grid1');
            }
            else if (selectedValue == "all") {
                hideItems = null;
            }

            if (hideItems != null) {
                hideAllElements(hideItems.getElementsByClassName('PBI'));
                var results = searchAllElements(searchItems.getElementsByClassName('PBI'), keyword);
                this.setState({ searchCount: results });
            }
            else {
                var results = searchAllElements(document.getElementById('grid1').getElementsByClassName('PBI'), keyword);
                results += searchAllElements(document.getElementById('grid2').getElementsByClassName('PBI'), keyword);
                this.setState({ searchCount: results });
            }

        }
        else {
            resetAllElements(document.getElementsByClassName('PBI'));
            this.setState({ searchCount: 0 });
        }

        function hideAllElements(elements) {
            for (let element of elements) {
                element.classList.remove('search-show');
                element.classList.add('search-hide');
            }
        };

        function resetAllElements(elements) {
            for (let element of elements) {
                element.classList.remove('search-show');
                element.classList.remove('search-hide');
            }
        };

        function searchAllElements(elements, keyword) {
            var counter = 0;
            for (let element of elements) {
                if (element.innerText != null && element.innerText.toLowerCase().includes(keyword.toLowerCase())) {
                    element.classList.remove('search-hide');
                    element.classList.add('search-show');
                    counter++;
                }
                else {
                    element.classList.remove('search-show');
                    element.classList.add('search-hide');
                }
            }
            return counter;
        };
    }
    searching1 = () => {
        var searchVal = document.getElementById('searchInput-hideShowLink').value;
        var object = { target: null };
        object.target = { value: searchVal }
        this.searching(object);
    }

    componentDidMount() {
        document.getElementById('inProgressOnly-hideShowLink').checked = true;
    }

    render() {
    return (
        <div className="status" onClick={(e) => this.toggleContent(event)}>
            <hr />
            <div> {readonly ? (canAdd ? (canModify ? <h1 className="readonly-link">MODIFY-ACCESS</h1> : <h1 className="readonly-link">ADD-ONLY</h1>) : <h1 className="readonly-link">READ-ONLY</h1>) : null} <br className="clears" /></div>
            <div id="Left-Side">
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
            </div>
            <div id="Right-Side">
                <br className="clears" />
                <a id="hideShowLink" className="stats-links" href="#null" onClick={this.props.action} >{SHOW_HIDDEN_ITEMS}</a><br className="clears" />
                <a id="hideShowLink-inprogress" className="stats-links" href="#null" onClick={this.props.action2} >{SHOW_IN_PROGRESS_ITEMS}</a><br className="clears" />
                <div id="search-radios-container" className={this.state.hidden == 'true' ? "hide-const" : ""}>
                    <div className="search-radios" id="searchRadio-hideShowLink">
                        <input className="search-input" id="searchInput-hideShowLink" type="search" placeholder="Search for a story or defect: " onChange={(e) => this.searching(e)} /><br />
                        <input type="radio" id="inProgressOnly-hideShowLink" name="search-criteria" value="inProgress" onClick={() => this.searching1()}/>
                        <label for="inProgressOnly-hideShowLink" id="a-hideShowLink">In Progress</label>
                        <input type="radio" id="completedOnly-hideShowLink" name="search-criteria" value="completed" onClick={() => this.searching1()}/>
                        <label for="completedOnly-hideShowLink" id="b-hideShowLink">Completed</label>
                        <input type="radio" id="allItems-hideShowLink" name="search-criteria" value="all" onClick={() => this.searching1()}/>
                        <label for="allItems-hideShowLink" id="c-hideShowLink">All</label>
                        <p className="search-results" hidden={this.state.searchCount==0}>{"Found Results: " + this.state.searchCount}</p>
                    </div>
                </div>
            </div>
            <br className="clears" />
            <div id="carrot"> <center> <span>{this.state.carrot}</span> </center></div>
            <hr />
        </div>
            );
    }
}

class FirstPbi extends React.Component {
    render() {
        return (
            <div className="PBI normalizePBIheading box_shadow_blue" id="00000">
                <br className="clears" />
                <h1>{ADD_YOUR_FIRST_STORY}</h1>
                <hr />
                <p>Description: {PRESS_NEW_ITEM_TO_ADD_YOUR_FIRST_STORY}</p>
                <h3>Story</h3>

                <p className="small_info">Timestamp: 00000 </p>
                <p className="small_info">ID: 00000</p>
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
        if (!readonly || canModify) {

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
                            updateBacklogUI();
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
                                    updateBacklogUI();
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
                <p className="info" hidden={this.props.tasks == null}>Task Count: {this.props.tasks} </p>
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

    renderPBI(id, title, description, completed, timestamp, isStory, hidden, inprogress, tasks) {
        return (
            <PBI id={id} title={title} description={description} completed={completed} timestamp={timestamp} isStory={isStory} hidden={hidden} hiddenPB={this.state.hidePbiItems} showInprogress={this.state.showInprogress} inprogress={inprogress} tasks={tasks}/>
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
                <div key={object.id} className={"" + object.data().completed} >{this.renderPBI(object.id, object.data().title, object.data().description, object.data().completed, object.data().timestamp, object.data().isStory, object.data().hidden, object.data().inprogress, object.data().task_counter)}</div>
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
                    <h1 className="grid_border_bottom">Completed</h1>
                </div>

                <div id="grid1" className="grid_border_right">
                    <div>
                        <a className="button" onClick={this.handler}>New Item</a>
                    </div>
                        {PBIContainer}
                        {PBIContainer.length == 0 ? <FirstPbi /> : null}
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

firebase.auth().onAuthStateChanged(function (user) {

    if (user != null || readonly) {
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

                });
        }
    }
    else {
        ReactDOM.render(<NotAuthErrorDemo />, domContainer);
        document.getElementById('loading-gif').style.display = 'none';
    }
    
});

//Deselect any projects
window.addEventListener('load', function (e) {
    sessionStorage.removeItem('bid');
});

//Prevent user from changing values
window.addEventListener('storage', function (e) {
    if (e.storageArea === sessionStorage) {
        sessionStorage.setItem('uid', uid);
        sessionStorage.setItem('pid', pid);
        sessionStorage.setItem('add', canAdd);
        sessionStorage.setItem('all', canModify);
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

function handleReadonly() {
    ReactDOM.render(<NotAuthErrorDemo />, domContainer);
    document.getElementById('loading-gif').style.display = 'none';
}
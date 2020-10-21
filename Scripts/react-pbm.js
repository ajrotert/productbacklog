'use strict';

/**
 * Components are defined in the Pbm directory, and are added to the global scope
 **/

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
        ReactDOM.render(<ModalPbiViewPbm shadow={shadowColor} placeholderValue={shadowColor == null ? null : "Defect"} hide={hide} />, document.querySelector('#rootModal'));

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
    ReactDOM.render(<ModalShareViewPbm />, document.querySelector('#rootModal'));
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

class PBPbm extends React.Component {
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
            <PBIPbm id={id} title={title} description={description} completed={completed} timestamp={timestamp} isStory={isStory} hidden={hidden} hiddenPB={this.state.hidePbiItems} showInprogress={this.state.showInprogress} inprogress={inprogress} tasks={tasks}/>
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

                <HeadingPbm />

                <StatsPbm stats={statsGroup} action={this.handleHiddenItems} action2={this.toggleInprogress} />

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
            ReactDOM.render(<NotAuthErrorPbm />, domContainer);
            document.getElementById('loading-gif').style.display = 'none';
        }
        else if (pid == null) {
            ReactDOM.render(<NoProjectErrorPbm />, domContainer);
            document.getElementById('loading-gif').style.display = 'none';
        }
        else {
            db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog')
                .onSnapshot((snapshot) => {
                    ReactDOM.render(<PBPbm data={snapshot} />, domContainer, () => {
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
        ReactDOM.render(<NotAuthErrorDemoPbm />, domContainer);
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
    ReactDOM.render(<NotAuthErrorDemoPbm />, domContainer);
    document.getElementById('loading-gif').style.display = 'none';
}
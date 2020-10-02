'use strict';

/**
 * Components are defined in the Tasks directory, and are added to the global scope
 **/

function generatePbiModalPopup(hide = false) {
    if (!readonly || canAdd || canModify) {
        ReactDOM.render(<ModalPbiViewTask hide={hide} />, document.querySelector('#rootModal'));

    }
    else {
        //Readonly
    }
}

//Properties: data
//Global Methods: generatePbiModalPopup updateBacklogUI updateHiddenAttributes updateInProgressAttributes
//Global Constants: a few
class PBTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hidePbiItems: true,
            showInprogress: false,
        }
        this.handleHiddenItems = this.handleHiddenItems.bind(this);
        this.toggleInprogress = this.toggleInprogress.bind(this);
    }

    renderPBI(id, title, description, completed, timestamp, hidden, inprogress) {
        return (
            <TaskTask id={id} title={title} description={description} completed={completed} timestamp={timestamp} hidden={hidden} hiddenPB={this.state.hidePbiItems} showInprogress={this.state.showInprogress} inprogress={inprogress}/>
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
        updateBacklogUI()
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
                <div key={object.id} className={"" + object.data().completed} >{this.renderPBI(object.id, object.data().title, object.data().description, object.data().completed, object.data().timestamp, object.data().hidden, object.data().inprogress)}</div>
            );
        });

        global_task_counter = PBIContainer.length;

        return (
            <div>
                <div className="grid-container">

                <HeadingTask />

                <StatsTask stats={statsGroup} action={this.handleHiddenItems} action2={this.toggleInprogress} />

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
                        {PBIContainer.length == 0 ? <FirstPbiTask /> : null}
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
            ReactDOM.render(<NotAuthErrorTask />, domContainer);
            document.getElementById('loading-gif').style.display = 'none';
        }
        else if (pid == null) {
            ReactDOM.render(<NoProjectErrorTask />, domContainer);
            document.getElementById('loading-gif').style.display = 'none';
        }
        else if (bid == null) {
            ReactDOM.render(<NoBacklogItemErrorTask />, domContainer);
            document.getElementById('loading-gif').style.display = 'none';
        }
        else {
            db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog')
                .onSnapshot((snapshot) => {
                    ReactDOM.render(<PBTask data={snapshot} />, domContainer, () => {
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
            ReactDOM.render(<NotAuthErrorDemoTask />, domContainer);
            document.getElementById('loading-gif').style.display = 'none';
    }
});

//Prevent user from changing values
window.addEventListener('storage', function (e) {
    if (e.storageArea === sessionStorage) {
        sessionStorage.setItem('uid', uid);
        sessionStorage.setItem('pid', pid);
        sessionStorage.setItem('bid', bid);
        sessionStorage.setItem('add', canAdd);
        sessionStorage.setItem('all', canModify);
        sessionStorage.setItem('readonly', readonly);
    }
});

function handleReadonly() {
    ReactDOM.render(<NotAuthErrorDemoTask />, domContainer);
    document.getElementById('loading-gif').style.display = 'none';
}
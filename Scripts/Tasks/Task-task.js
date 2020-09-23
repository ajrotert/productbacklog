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
function getPbiDatabase(docId) {
    if (!readonly || canModify) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc(docId).get();
    }
    else {
        //Readonly
    }
};

function updatePbiDatabase(docId, completed) {
    if (!readonly || canModify) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc(docId).update({ completed: completed, inprogress: false });
    }
    else {
        //Readonly
    }
};

function updatePbiDatabaseWithInprogress(docId, inprogress) {
    if (!readonly || canModify) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc(docId).update({ inprogress: inprogress });
    }
    else {
        //Readonly
    }
};

function hidePbiDatabase(docId, hidden) {
    if (!readonly || canModify) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc(docId).update({ hidden: hidden, inprogress: false });
    }
    else {
        //Readonly
    }
};

function deleteProjectFromDatabase(docId) {
    if (!readonly || canModify) {
        global_task_counter--;
        var batch = db.batch();
        batch.update(db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid), { task_counter: global_task_counter });
        batch.delete(db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc(docId));
        return batch.commit();
    }
    else {
        //Readonly
    }

};
function getPbiDocFromDatabase() {
    return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).get();
};

//Properties: id, title, description, completed, timestamp, hidden, hiddenPB, showInprogress, inprogress
//Global Methods: deleteProjectFromDatabase, hidePbiDatabase, updateHiddenAttributes, updateBacklogUI, getPbiDatabase, updatePbiDatabase, updateInProgressAttributes, updatePbiDatabaseWithInprogress
//Global Constants:
class Task extends React.Component {
    constructor(props) {
        super(props);
        var hiddenState = this.props.hidden == null ? false : this.props.hidden;

        this.state = {
            shadowColor: "PBI normalizePBI " + (this.props.completed ? "box_shadow_green" : "box_shadow_blue"),
            completed: this.props.completed,
            ID: this.props.id,
            hide: hiddenState,
            inprogress: this.props.inprogress == null ? false : this.props.inprogress
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

                generatePbiModalPopup(this.state.hide);
                document.getElementById('title').value = this.props.title;
                document.getElementById('description').value = this.props.description;
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
                    //Update hidden labels.
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
                                    this.setState({ shadowColor: "PBI normalizePBI " + (!this.state.completed ? "box_shadow_green" : "box_shadow_blue"), completed: !this.state.completed, ID: this.state.ID, inprogress: false });
                                    updateInProgressAttributes(this.props.showInprogress);
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

        }
        else {
            //Readonly
        }

    }
    render() {
        return (
            <div className={this.state.shadowColor + (this.state.hide ? " hide" : "") + (this.state.inprogress ? " inprogress-selector" : " inprogress-not-selector")} id={this.state.ID} onClick={(e) => this.updateHandler(e)}>
                <span className="button_icons" id="close">&times;</span>
                <span className="button_icons" id="edit" >✎</span>
                <span className="button_icons" id="hide" >☌</span>
                <br className="clears" />
                <h1>{this.props.title}</h1>
                <hr />
                <p>Description: {this.props.description}</p>
                <h3>Task</h3>
                <input type="checkbox" id={"inprogress" + this.state.ID} name={"inprogress" + this.state.ID} checked={this.state.inprogress} value="none" hidden={this.state.completed} disabled={this.state.hide} />
                <label htmlFor={"inprogress" + this.state.ID} disabled hidden={this.state.completed}> In Progress</label><br /><br />
                <input type="checkbox" id={"done" + this.state.ID} name={"done" + this.state.ID} checked={this.state.completed} value="none" />
                <label htmlFor={"done" + this.state.ID} disabled> Item Completed</label><br />
                <p className="small_info"> {this.state.hide ? "Hidden" : ""} </p>
                <p className="small_info">Timestamp: {this.props.timestamp} </p>
                <p className="small_info">ID: {this.state.ID}</p>
            </div>
        );
    }
}
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
                <input type="checkbox" id={"inprogress" + this.state.ID} name={"inprogress" + this.state.ID} checked={this.state.inprogress} value="none" hidden={this.state.completed} disabled={this.state.hide} />
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
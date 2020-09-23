function updatePbiForTaskDatabase(docId, completed) {
    if (!readonly || canModify) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).update({ completed: completed, inprogress: false });
    }
    else {
        //Readonly
    }
};

function updatePbiForTaskDatabaseWithInprogress(docId, inprogress) {
    if (!readonly || canModify) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).update({ inprogress: inprogress });
    }
    else {
        //Readonly
    }
};

function getPbiForTaskDatabase(docId) {
    if (!readonly || canModify) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).get();
    }
    else {
        //Readonly
    }
};

function generateShareCodePopup() {
    ReactDOM.render(<ModalShareView />, document.querySelector('#rootModal'));
};

//Properties:
//Global Methods: updatePbiForTaskDatabaseWithInprogress, getPbiForTaskDatabase, updatePbiForTaskDatabase, generateShareCodePopup
//Global Constants:
class Heading extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "Loading title...",
            description: "Loading description...",
            isStory: true,
            completed: false,
            ID: "Loading id...",
            inprogress: false,
            timestamp: "Loading timestamp...",
            hidden: false,
            shadowColor: "PBI normalizePBIheading box_shadow_blue",
            hide: false
        };
        this.inProgressChecked = this.inProgressChecked.bind(this);
        this.completedChecked = this.completedChecked.bind(this);
    }

    componentDidMount() {
        getPbiDocFromDatabase()
            .then((doc) => {
                this.setState({
                    title: doc.data().title,
                    description: doc.data().description,
                    isStory: doc.data().isStory,
                    completed: doc.data().completed,
                    ID: doc.id,
                    inprogress: doc.data().inprogress == null ? false : doc.data().inprogress,
                    timestamp: doc.data().timestamp,
                    shadowColor: "PBI normalizePBIheading " + (doc.data().completed ? "box_shadow_green" : doc.data().isStory ? "box_shadow_blue" : "box_shadow_red"),
                    hide: doc.data().hidden == null ? false : doc.data().hidden,
                    tasks: doc.data().task_counter
                });
            });
    }

    inProgressChecked = () => {
        if (!readonly || canModify) {
            document.body.style.cursor = 'wait';
            if (!this.state.hide) {
                getPbiForTaskDatabase(this.state.ID).then((doc) => {
                    if (doc.exists) {
                        updatePbiForTaskDatabaseWithInprogress(this.state.ID, !this.state.inprogress)
                            .then(() => {
                                this.setState({ inprogress: !this.state.inprogress });
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
        else {
            //Readonly
        }

    }

    completedChecked = () => {
        if (!readonly || canModify) {
            document.body.style.cursor = 'wait';
            getPbiForTaskDatabase(this.state.ID).then((doc) => {
                if (doc.exists) {
                    document.body.style.cursor = 'default';
                    var confirms = window.confirm(`Move: ${this.state.title} \nTo: ${this.state.completed ? "Backlog" : "Completed"}`);
                    if (confirms) {
                        document.body.style.cursor = 'wait';
                        updatePbiForTaskDatabase(this.state.ID, !this.state.completed)
                            .then(() => {
                                this.setState({ shadowColor: "PBI normalizePBIheading " + (!this.state.completed ? "box_shadow_green" : this.state.isStory ? "box_shadow_blue" : "box_shadow_red"), completed: !this.state.completed, ID: this.state.ID, inprogress: false });
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
        else {
            //Readonly
        }

    }

    shareLink() {
        generateShareCodePopup();
        //generateShareCodeFromDatabase(uid, pid)
    };

    render() {
        return (
            <div>
                <h1 className="pages">Selected {this.state.isStory ? "Story" : "Defect"}: </h1>
                <PBI state={this.state} inProgressChecked={this.inProgressChecked} completedChecked={this.completedChecked} />
                <a id="shareLink" href="#null" onClick={this.shareLink}>Get Your Shareable Code</a>
            </div>
        );

    }
}
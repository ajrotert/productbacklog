//Properties:
//Global Methods:
//Global Constants:
class ModalShareViewPbm extends React.Component {
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
                        <br className="clears" />
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
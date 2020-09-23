function updateTasktoDatabase(title, description, completed, date, docId) {
    if (!readonly || canModify || canAdd) {
        return db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc(docId).update({
            title: title,
            description: description,
            completed: completed,
            timestamp: date
        });
    }
    else {
        //readonly
    }
}
function addTasktoDatabase(title, description, completed, date) {
    if (!readonly || canModify || canAdd) {
        global_task_counter++;
        var batch = db.batch();
        batch.update(db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid), { task_counter: global_task_counter });
        batch.set(db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(bid).collection('task_backlog').doc(), {
            title: title,
            description: description,
            completed: completed,
            timestamp: date
        })
        return batch.commit();
    }
    else {
        //readonly
    }
}
//Properties: hide
//Global Methods: addTasktoDatabase, updateTasktoDatabase
//Global Constants:
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
                addTasktoDatabase(title, description, false, Date.now())
                    .then(() => {
                    });
            }
            else {
                updateTasktoDatabase(title, description, document.getElementById('sample_checked').checked, document.getElementById('modalTimestamp').innerText, docId)
                    .then(() => {
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
                        <br className="clears" />
                        <input className="heading" id="title" type="textbox" name="title" placeholder={"Enter Task Title"} required />
                        <hr />
                        <br />
                        <textarea id="description" name="description" placeholder={"Enter Task Description"} required />
                        <br />
                        <br />
                        <h1>Task</h1>
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
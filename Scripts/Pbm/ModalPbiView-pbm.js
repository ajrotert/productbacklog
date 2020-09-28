//Properties: shadow, placeholderValue, hide
//Global Methods:
//Global Constants:
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
                db.collection('users').doc(uid).collection('Projects').doc(pid).collection('product_backlog').doc(docId).update({
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
                        <br className="clears" />
                        <input className="heading" id="title" type="textbox" name="title" placeholder={"Enter " + this.state.placeholderText + " Title"} required />
                        <hr />
                        <br />
                        <textarea id="description" name="description" placeholder={"Enter " + this.state.placeholderText + " Description"} required />
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
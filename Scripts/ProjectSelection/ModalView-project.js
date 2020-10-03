function addNewProjectDB(name, description, id, timestamp) {
    if (!readonly) {

        if (id == null) {
            db.collection('users').doc(uid).collection('Projects').doc().set({
                name: name,
                description: description,
                timestamp: Date.now()
            });
        }
        else {
            db.collection('users').doc(uid).collection('Projects').doc(id).set({
                name: name,
                description: description,
                timestamp: timestamp
            });
        }

    }
    else {
        //readonly
    }


}

//Properties: Optional id, timestamp
//Global Methods: addNewProjectDB
//Global Constants: 
class ModalViewProject extends React.Component {
    handler() {
        ReactDOM.unmountComponentAtNode(document.querySelector("#rootModal"));
    }

    addToDatabase = () => {
        var nameNode = document.getElementById('name');
        var descriptionNode = document.getElementById('description');
        var name = nameNode.value;
        var description = descriptionNode.value;
        if (title != "" && description != "" && uid != null) {

            addNewProjectDB(name, description, this.props.id, this.props.timestamp);
            nameNode.style.border = "1px solid black";
            descriptionNode.style.border = "1px solid black";
            ReactDOM.unmountComponentAtNode(document.querySelector("#rootModal"));
        }
        else {
            if (name == "") {
                nameNode.style.border = "1px solid red";
            }
            else {
                nameNode.style.border = "1px solid black";
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
                    <div className="samplePBI">
                        <span className="button_icons" onClick={this.handler}>&times;</span>
                        <br className="clears" />
                        <input className="heading" id="name" type="textbox" name="name" placeholder="Enter Project Name" required />
                        <hr />
                        <br />
                        <textarea id="description" name="description" placeholder="Enter Project Description" required />
                    </div>
                    <br />
                    <br />
                    <center><a className="button" onClick={this.addToDatabase}>Submit</a></center>
                </div>
            </div>
        );
    }
}
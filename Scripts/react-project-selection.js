'use strict';
var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');


function addNewProjectDB(name, description) {
    db.collection('users').doc(uid).collection('Projects').doc().set({
        name: name,
        description: description,
        timestamp: Date.now()
    });

}

class ModalView extends React.Component {
    handler() {
        var modal = document.getElementById("InputModal")
        modal.style.display = "none";
    }

    addToDatabase() {
        var nameNode = document.getElementById('name');
        var descriptionNode = document.getElementById('description');
        var name = nameNode.value;
        var description = descriptionNode.value;
        if (title != "" && description != "" && uid != null) {

            addNewProjectDB(name, description);
            nameNode.style.border = "1px solid black";
            descriptionNode.style.border = "1px solid black";
            document.getElementById("InputModal").style.display = "none";
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
                        <span className="close" onClick={this.handler}>&times;</span>
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

class NotAuthError extends React.Component {
    render() {
        return (
            <div>
                <h1 className="redError">Not Authorized.</h1>
                <a href="index.html" className="signInLink">Sign In.</a>
            </div>
        );
    }
}

const debug = false;

//id, name, description
class Projects extends React.Component {
    constructor(props) {
        super(props);
    }

    handler = () => {
        console.log(`clicked ${this.props.id} ${this.props.name} ${this.props.description}`);
        //Set sessionStorage params for UID, and ID
        //Window href to ProductBacklog
        //ProductBacklog will need refactoring 

    }

    render() {
        return (
            <div className="project_item" onClick={() => this.handler()}>
                <h1>{this.props.name}</h1>
                <h3>{this.props.description}</h3>
            </div>
        );
    }
}

//data   
class ProjectsList extends React.Component {

    handler() {
        var modal = document.getElementById("InputModal");
        modal.style.display = "block";
    }

    render() {
        function compare(object1, object2) {    //custom comparison function
            return object1 > object2 ? 1 : -1;
        };

        const orderedData = this.props.data.docs.sort((object1, object2) => compare(object1.data().timestamp, object2.data().timestamp));

        const projectsArray = orderedData.map((object, index) => {
            return (
                <div key={object.id} >
                    <Projects id={object.id} name={object.data().name} description={object.data().description} />
                </div>
            );
        });

        return (
            <div className="list">
                <a className="button" onClick={this.handler}>Add New Project</a>
                {projectsArray}
            </div>
        );
    }

}

const domContainer = document.querySelector('#root');
if (uid == null)
    ReactDOM.render(<NotAuthError />, domContainer);
else {
    db.collection('users').doc(uid).collection('Projects')
        .onSnapshot((snapshot) => {
            ReactDOM.render(<ProjectsList data={snapshot} />, domContainer, () => {} );

        });
    ReactDOM.render(<ModalView />, document.querySelector('#rootModal'));
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    var modal = document.getElementById("InputModal")
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
'use strict';
var db = firebase.firestore();
const uid = sessionStorage.getItem('uid');
const readonly = (sessionStorage.getItem('readonly') == null ? true : sessionStorage.getItem('readonly') == 'true' ? true : false);

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
function deleteProjectFromDatabase(docId) {
    if (!readonly) {
        return db.collection('users').doc(uid).collection('Projects').doc(docId).delete();
    }
    else {
        //readonly
    }
};

function generatePbiModalPopup(id = null, timestamp = null) {
    if (!readonly) {
        ReactDOM.render(<ModalView id={id} timestamp={timestamp}/>, document.querySelector('#rootModal'));

    }
    else {
        //Readonly
    }
}

//Optional id, timestamp
class ModalView extends React.Component {
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

class NotAuthError extends React.Component {
    render() {
        return (
            <div>
                <h1 className="redError">Not Authorized.</h1>
                <a href="index.html" className="signInLink">Sign In.</a>
                {this.props.children}
            </div>
        );
    }
}

//Properties:
class NotAuthErrorDemo extends React.Component {
    render() {
        return (
            <NotAuthError>
                <hr />
                <h1>Project Selection: </h1>
                <h3>Easily manage projects through a product backlog. Each project has its own product backlog.</h3>
                <img src="./Images/Demos/ProjectsDemo.png" className="resize-img-margin" />
            </NotAuthError>
        );
    }
}

//id, name, description, timestamp
class Projects extends React.Component {
    constructor(props) {
        super(props);
    }

    handler = (e) => {
        if (e.target.id == ("close")) {
            var confirms = window.confirm(`Delete: ${this.props.name}`);
            if (confirms) {

                ReactDOM.unmountComponentAtNode(domContainer);

                deleteProjectFromDatabase(this.props.id).then(() => {
                });
            }
        }
        else if (e.target.id == ("edit")) {
            generatePbiModalPopup(this.props.id, this.props.timestamp);
            document.getElementById('name').value = this.props.name;
            document.getElementById('description').value = this.props.description;
        }
        else {
            sessionStorage.setItem('uid', uid);
            sessionStorage.setItem('pid', this.props.id);
            window.location.href = 'ProductBacklog.html';
        }

    }

    render() {
        return (
            <div className="project_item" onClick={(e) => this.handler(e)}>
                <span className="button_icons" id="close">&times;</span>
                <span className="button_icons" id="edit" >✎</span>
                <br className="clears" />
                <h1>{this.props.name}</h1>
                <hr />
                <h3>{this.props.description}</h3>
            </div>
        );
    }
}

//data   
class ProjectsList extends React.Component {

    handler() {
        generatePbiModalPopup();
    }

    render() {
        function compare(object1, object2) {    //custom comparison function
            return object1 > object2 ? 1 : -1;
        };

        const orderedData = this.props.data.docs.sort((object1, object2) => compare(object1.data().timestamp, object2.data().timestamp));

        const projectsArray = orderedData.map((object, index) => {
            return (
                <div key={object.id} >
                    <Projects id={object.id} name={object.data().name} description={object.data().description} timestamp={object.data().timestamp}/>
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

firebase.auth().onAuthStateChanged(function (user) {
    if (user != null & uid != null) {
        db.collection('users').doc(uid).collection('Projects')
            .onSnapshot((snapshot) => {
                ReactDOM.render(<ProjectsList data={snapshot} />, domContainer, () => { });
                document.getElementById('loading-gif').style.display = 'none';
            });
    }
    else {
        ReactDOM.render(<NotAuthErrorDemo />, domContainer);
        document.getElementById('loading-gif').style.display = 'none';
    }
});

//Deselect any projects
window.addEventListener('load', function (e) {
    sessionStorage.removeItem('pid');
    sessionStorage.removeItem('bid');
});

//Prevent user from changing values
window.addEventListener('storage', function (e) {
    if (e.storageArea === sessionStorage) {
        sessionStorage.setItem('uid', uid);
        sessionStorage.setItem('add', false);
        sessionStorage.setItem('all', false);
        sessionStorage.setItem('readonly', readonly);
    }
});
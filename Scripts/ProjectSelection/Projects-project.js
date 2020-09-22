function deleteProjectFromDatabase(docId) {
    if (!readonly) {
        return db.collection('users').doc(uid).collection('Projects').doc(docId).delete();
    }
    else {
        //readonly
    }
};

function generatePbiModalPopup(id = null, timestamp = null) { //Duplicate in react-project-selection.js
    if (!readonly) {
        ReactDOM.render(<ModalView id={id} timestamp={timestamp} />, document.querySelector('#rootModal'));

    }
    else {
        //Readonly
    }
}

//Properties: id, name, description, timestamp
//Global Methods: deleteProjectFromDatabase, generatePbiModalPopup
//Global Constants: uid
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

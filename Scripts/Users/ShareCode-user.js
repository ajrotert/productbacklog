//Properties: id, addonly, modify, pid, uid
//Global Methods:
//Global Constants: defaultUser
class ShareCodeUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            project_title: "Loading...",
            inactive: false
        }
    }

    makeInactive = () => {
        if (this.props.uid != defaultUser) {
            db.collection('shares').doc(this.props.id).update({ inactive: true });
            this.setState({ inactive: true });
        }
        else {
            var errorNode = document.getElementById('code-validation-message');
            errorNode.style.display = 'inline-block';
            errorNode.style.color = 'red';
            errorNode.innerText = 'Failed: ' + "Cannot modify this user.\n"
        }
    }

    componentDidMount() {
        db.collection('users').doc(this.props.uid).collection('Projects').doc(this.props.pid).get().then((doc) => {
            this.setState({ project_title: doc.data().name });
        });

    }

    render() {
        return (
            <div hidden={this.state.inactive}>
                <span className="button_icons" onClick={(e) => this.makeInactive(e)}>&times;</span>
                <h3>Code: <span className="large-blue">{this.props.id}</span></h3>
                <h3>{this.state.project_title}</h3>
                <h4 className="large-darkblue">{this.props.modify ? 'Modify Access' : (this.props.addonly ? 'Add Only' : 'Read-Only')}</h4>
                <hr />
            </div>
        );
    }
}
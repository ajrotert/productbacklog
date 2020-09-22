//Properties: uid
//Global Methods:
//Global Constants:
class ShareCodesView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            objectArray: new Array(0)
        }
    }

    componentDidMount() {
        db.collection('shares')
            .where("shared_uid", "==", this.props.uid)
            .where("inactive", "==", false)
            .get()
            .then((querySnapshot) => {
                const array = querySnapshot.docs.map((object, index) => {

                    return (
                        <ShareCode id={object.id} addonly={object.data().add} modify={object.data().write} pid={object.data().shared_pid} uid={this.props.uid} />
                    );
                });
                this.setState({ objectArray: array });
            });
    }

    render() {
        return (
            <div>
                <h1 className="large center">Active share codes:</h1>
                <p id="code-validation-message"></p>
                <hr />
                {this.state.objectArray}
            </div>
        );
    }
}
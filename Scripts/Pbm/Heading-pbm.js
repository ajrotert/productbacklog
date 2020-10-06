//Properties:
//Global Methods: getProjectDocFromDatabase, generateShareCodePopup
//Global Constants:
class HeadingPbm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Loading name...",
            description: "Loading description..."
        };
    }

    componentDidMount() {
        getProjectDocFromDatabase()
            .then((doc) => {
                this.setState({
                    description: doc.data().description,
                    name: doc.data().name
                });
            });
    }

    shareLink() {
        generateShareCodePopup();
        //generateShareCodeFromDatabase(uid, pid)
    };

    render() {
        return (
            <div>
                <h1 className="pages">Selected Project: </h1>
                <ProjectsPbm state={this.state} />
                <a id="shareLink" href="#null" onClick={this.shareLink}>Get Your Shareable Code</a>
            </div>
        );

    }
}
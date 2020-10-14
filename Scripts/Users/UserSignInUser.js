//Properties: userData
//Global Methods:
//Global Constants:
class UserSignInUser extends React.Component {
    constructor(props) {
        super(props);
        const signinDate = new Date(this.props.userData.lastSignIn);
        const firstDate = new Date(this.props.userData.firstSignOn);
        this.state = {
            lastSignIn: signinDate.toString(),
            firstSignOn: firstDate.toString()
        }
    }

    render() {
        return (
            <div>
                <h1 className="large center">Sign In Information</h1>
                <h4 className=""><span className="large-darkblue">Last Sign In: </span> <span className="large-blue">{this.state.lastSignIn}</span></h4>
                <h4 className=""><span className="large-darkblue">First Sign on: </span> <span className="large-blue">{this.state.firstSignOn}</span></h4>
                <h4 className=""><span className="large-darkblue">Provider: </span> <span className="large-blue">{this.props.userData.providerId}</span></h4>
                <h4 className=""><span className="large-darkblue">UID: </span> <span className="large-blue">{this.props.userData.uid}</span></h4>
            </div>
        );
    }
}
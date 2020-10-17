//Properties:
//Global Methods:
//Global Constants:
class NotAuthErrorTask extends React.Component {
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
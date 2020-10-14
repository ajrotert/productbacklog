//Properties:
//Global Methods:
//Global Constants:
class ReadonlyErrorUser extends React.Component {
    render() {
        return (
            <div>
                <h1 className="redError">Read-Only User</h1>
                <p className="medium-red">Read-only users can only view the shared project backlog and its associated tasks. </p>
                <p className="medium-red">Read-only users cannot edit any information. </p>
                <a href="index.html" className="signInLink">Sign In.</a>
            </div>
        );
    }
}
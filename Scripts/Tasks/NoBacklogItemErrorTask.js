//Properties:
//Global Methods:
//Global Constants:
class NoBacklogItemErrorTask extends React.Component {
    render() {
        return (
            <div>
                <h1 className="redError">No Backlog Item.</h1>
                <a href="ProductBacklog.html" className="signInLink">Select a Product Backlog Item.</a>
            </div>
        );
    }
}
﻿//Properties:
//Global Methods:
//Global Constants:
class AddonlyErrorUser extends React.Component {
    render() {
        return (
            <div>
                <h1 className="redError">Add-Only User</h1>
                <p className="medium-red">Add-only users can view the shared project backlog and its associated tasks, as well add new items. </p>
                <p className="medium-red">Add-only users cannot edit any information. </p>
                <a href="index.html" className="signInLink">Sign In.</a>
            </div>
        );
    }
}
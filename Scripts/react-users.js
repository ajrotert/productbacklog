'use strict';
var db = firebase.firestore();
const readonly = (sessionStorage.getItem('readonly') == null ? false : sessionStorage.getItem('readonly') == 'true' ? true : false);
const defaultUser = 'swkq0qAdSwft9yf9ovhmjgw2GJR2';

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

class ReadonlyError extends React.Component {
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

//Properties: uid
class UpdatePassword extends React.Component {
    constructor(props) {
        super(props);
    }

    handle() {
        if (this.props.uid != defaultUser || readonly) {
            var currentPassword = document.getElementById('current-password');
            var newPassword = document.getElementById('new-password');
            var confirmPassword = document.getElementById('confirm-password');
            var validationMessage = document.getElementById('validation-message');
            validationMessage.innerText = "";
            var valid = true;
            if (currentPassword.value == "") {
                currentPassword.style.border = "1px solid red";
                validationMessage.innerText += "Current password is blank.\n"
                valid = false;
            }
            else {
                currentPassword.style.border = "1px solid #0066FF";
            }
            if (newPassword.value == "") {
                newPassword.style.border = "1px solid red";
                validationMessage.innerText += "New password is blank.\n"
                valid = false;
            }
            else {
                newPassword.style.border = "1px solid #0066FF";
            }
            if (confirmPassword.value == "") {
                confirmPassword.style.border = "1px solid red";
                validationMessage.innerText += "Confirm password is blank.\n"
                valid = false;
            }
            else {
                confirmPassword.style.border = "1px solid #0066FF";
            }
            if (!valid) {
                console.log(valid);
                validationMessage.style.color = "red";
            }
            else {
                if (confirmPassword.value != newPassword.value) {
                    confirmPassword.style.border = "1px solid red";
                    validationMessage.style.color = "red";
                    validationMessage.innerText += "Confirm password does not match new password.\n"
                    valid = false;
                }
                if (!valid) {
                    validationMessage.style.color = "red";
                }
                else {
                    var credential = firebase.auth.EmailAuthProvider.credential(
                        firebase.auth().currentUser.email,
                        currentPassword.value
                    );
                    firebase.auth().currentUser.reauthenticateWithCredential(credential).then(function () {
                        firebase.auth().currentUser.updatePassword(newPassword.value).then(function () {
                            currentPassword.style.border = "1px solid #36FF54";
                            newPassword.style.border = "1px solid #36FF54";
                            confirmPassword.style.border = "1px solid #36FF54";
                            validationMessage.style.color = "black";
                            validationMessage.innerText += "Password updated successfully.\n";
                            valid = false;
                        }).catch(function (error) {
                            validationMessage.style.color = "#36FF54";
                            validationMessage.innerText += "Password updated failed.\n";
                            validationMessage.innerText += error;
                        });
                    }).catch(function (error) {
                        currentPassword.style.border = "1px solid red";
                        validationMessage.style.color = "red";
                        validationMessage.innerText += "Current password is incorrect.\n"
                        valid = false;
                    });
                }
            }
        }
        else {
            var validationMessage = document.getElementById('validation-message');
            validationMessage.innerText = "";
            validationMessage.style.color = "red";
            validationMessage.innerText += "Cannot modify this user.\n"
        }
        
    }

    render() {
        return (
            <div>
                <h1 className="large center">Update your password</h1>
                <p className="label-style">Enter your current password: </p>
                <input className="input-style" id="current-password" type="password" placeholder="Current Password: " />
                <br />
                <p className="label-style">Enter your new password: </p>
                <input className="input-style" id="new-password" type="password" placeholder="New Password: " />
                <br />
                <p className="label-style">Confirm your new password: </p>
                <input className="input-style" id="confirm-password" type="password" placeholder="Confirm New Password: " />
                <br />
                <p id="validation-message"></p>
                <a className="button" onClick={this.handle.bind(this)}>Submit</a>
            </div>
            );
    }
}

//Properties: userData
class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: this.props.userData.displayName,
            email: this.props.userData.email,
            editDisplayName: false,
            editEmail: false
        }
    }

    editNames = (event) => {
        if (event.target.id == 'edit_display_name') {
            this.setState({ editDisplayName: true });
        }
        else if (event.target.id == 'edit_email') {
            this.setState({ editEmail: true });
        }
    }
    closeNames = (event) => {
        if (event.target.id == 'display_close') {
            this.setState({ editDisplayName: false });
        }
        else if (event.target.id == 'email_close') {
            this.setState({ editEmail: false });
        }
        document.getElementById('user-validation-message').style.display = 'none';
    }

    submit = (event) => {
        var errorNode = document.getElementById('user-validation-message');
        errorNode.style.display = 'inline-block';
        errorNode.style.color = 'red';
        if (this.props.userData.uid != defaultUser || readonly) {

            if (event.target.id == 'edit_display_submit') {
                var input = document.getElementById('editDisplayInput').value;
                document.body.style.cursor = 'wait';
                if (input != "") {
                    firebase.auth().currentUser.updateProfile({
                        displayName: input
                    }).then(() => {
                        this.setState({ displayName: input });
                        this.setState({ editDisplayName: false });
                        document.body.style.cursor = 'default';
                        errorNode.display = 'none';
                    }).catch((error) => {
                        console.log(error);
                        errorNode.innerText = 'Failed: ' + error.message;
                        document.body.style.cursor = 'default';
                    });

                }
            }
            else if (event.target.id == 'edit_email_submit') {
                var input = document.getElementById('editEmailInput').value;
                document.body.style.cursor = 'wait';
                if (input != "") {
                    firebase.auth().currentUser.updateEmail(input)
                        .then(() => {
                            this.setState({ email: input });
                            this.setState({ editEmail: false });
                            errorNode.display = 'none';
                            document.body.style.cursor = 'default';
                        }).catch((error) => {
                            console.log(error);
                            errorNode.innerText = 'Failed: ' + error.message;
                            document.body.style.cursor = 'default';
                        });

                }
            }
        }
        else {
            errorNode.innerText = 'Failed: ' + "Cannot modify this user.\n"
        }
    }

    render() {
        return (
            <div>
                <div className={this.state.editDisplayName ? "hide-const" : ""}>
                    <span className="button_icons" id="edit_display_name" onClick={(e) => this.editNames(e)}>✎</span>
                    <h1 className="large"><span className="large-darkblue">Display Name: </span> <span className="large-blue">{this.state.displayName}</span></h1>
                </div>
                <div className={this.state.editDisplayName ? "" : "hide-const"}>
                    <span className="button_icons" id="display_close" onClick={(e) => this.closeNames(e)}>&times;</span>
                    <h1 className="large"><span className="large-darkblue">Display Name: </span></h1>
                    <input className="edit-input-style" id="editDisplayInput" type="text" placeholder={this.state.displayName} />
                    <a className="button" id="edit_display_submit" onClick={(e) => this.submit(e)}>Submit</a>
                    <br/>
                </div>
                <div className={this.state.editEmail ? "hide-const" : ""}>
                    <span className="button_icons" id="edit_email" onClick={(e) => this.editNames(e)} >✎</span>
                    <h1 className="large"><span className="large-darkblue">Email: </span> <span className="large-blue">{this.state.email}</span></h1>
                </div>
                <div className={this.state.editEmail ? "" : "hide-const"}>
                    <span className="button_icons" id="email_close" onClick={(e) => this.closeNames(e)}>&times;</span>
                    <h1 className="large"><span className="large-darkblue">Email: </span></h1>
                    <input className="edit-input-style" id="editEmailInput" type="text" placeholder={this.state.email} />
                    <a className="button" id="edit_email_submit" onClick={(e) => this.submit(e)}>Submit</a>
                    <br />
                </div>
                <p id="user-validation-message"></p>
                <hr />
                <h1 className="small left"><span className="large-darkblue">Last Sign In: </span> <span className="large-blue">{this.props.userData.lastSignIn}</span></h1>
                <h1 className="small left"><span className="large-darkblue">First Sign on: </span> <span className="large-blue">{this.props.userData.firstSignOn}</span></h1>
                <h1 className="small left"><span className="large-darkblue">Provider: </span> <span className="large-blue">{this.props.userData.providerId}</span></h1>
                <h1 className="small left"><span className="large-darkblue">UID: </span> <span className="large-blue">{this.props.userData.uid}</span></h1>
            </div>
            );
    }
    
}

//Properties: userData: dispalyName, email, providerId, uid, lastSignIn, firstSignOn
class UserSection extends React.Component {
    render() {
        return (
            <div className="user-section">
                <UserInfo id="user-info" userData={this.props.userData} />
                <UpdatePassword id="user-password" uid={this.props.userData.uid} />
            </div>
            );
    }
}

const domContainer = document.querySelector('#root');

firebase.auth().onAuthStateChanged(function (user) {
    if (user && !readonly) {
        sessionStorage.setItem('uid', firebase.auth().currentUser.uid);
        sessionStorage.setItem('readonly', false);

        const userData = {
            displayName: user.displayName,
            email: user.email,
            providerId: user.providerId,
            uid: user.uid,
            lastSignIn: user.metadata.lastSignInTime,
            firstSignOn: user.metadata.creationTime
        };

        ReactDOM.render(<UserSection userData={userData} />, domContainer);
        document.getElementById('loading-gif').style.display = 'none';
    }
    else if (readonly) {
        ReactDOM.render(<ReadonlyError />, domContainer);
        document.getElementById('loading-gif').style.display = 'none';
    }
    else {
        ReactDOM.render(<NotAuthError />, domContainer);
        document.getElementById('loading-gif').style.display = 'none';
    }
});

//Prevent user from changing values
window.addEventListener('storage', function (e) {
    if (e.storageArea === sessionStorage) {
        sessionStorage.setItem('uid', uid);
        sessionStorage.setItem('pid', pid);
        sessionStorage.setItem('bid', bid);
        sessionStorage.setItem('readonly', readonly);
    }
});
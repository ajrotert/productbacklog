//Properties: uid
//Global Methods:
//Global Constants: defaultUser, readonly
class UpdatePasswordUser extends React.Component {
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
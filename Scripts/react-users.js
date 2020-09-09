'use strict';
var db = firebase.firestore();
const readonly = (sessionStorage.getItem('readonly') == null ? false : sessionStorage.getItem('readonly') == 'true' ? true : false);

/*
if (user != null) {
    user.providerData.forEach(function (profile) {
        console.log("Sign-in provider: " + profile.providerId);
        console.log("  Provider-specific UID: " + profile.uid);
        console.log("  Name: " + profile.displayName);
        console.log("  Email: " + profile.email);
        console.log("  Photo URL: " + profile.photoURL);
    });
}
*/

class NotAuthError extends React.Component {
    render() {
        return (
            <div>
                <h1 className="redError">Not Authorized.</h1>
                <a href="index.html" className="signInLink">Sign In.</a>
            </div>
        );
    }
}

class UpdatePassword extends React.Component {
    handle() {
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
            currentPassword.style.border = "1px solid black";
        }
        if (newPassword.value == "") {
            newPassword.style.border = "1px solid red";
            validationMessage.innerText += "New password is blank.\n"
            valid = false;
        }
        else {
            newPassword.style.border = "1px solid black";
        }
        if (confirmPassword.value == "") {
            confirmPassword.style.border = "1px solid red";
            validationMessage.innerText += "Confirm password is blank.\n"
            valid = false;
        }
        else {
            confirmPassword.style.border = "1px solid black";
        }
        if (!valid) {
            console.log(valid);
            validationMessage.style.color = "red";
        }
        else {
            if (confirmPassword.value != newPassword.value) {
                confirmPassword.style.border = "1px solid red";
                validationMessage.innerText += "Confirm password does not match new password.\n"
                valid = false;
            }
            if (!valid) {
                console.log(valid);
                validationMessage.style.color = "red";
            }
        }

    }

    render() {
        return (
            <div>
                <h1 className="large center">Update your password</h1>
                <p className="label-style">Enter your current password: </p>
                <input className="input-style" id="current-password" type="text" placeholder="Current Password: " />
                <br />
                <p className="label-style">Enter your new password: </p>
                <input className="input-style" id="new-password" type="text" placeholder="New Password: " />
                <br />
                <p className="label-style">Confirm your new password: </p>
                <input className="input-style" id="confirm-password" type="text" placeholder="Confirm New Password: " />
                <br />
                <p id="validation-message"></p>
                <a className="button" onClick={this.handle}>Submit</a>
            </div>
            );
    }
}

//Properties: userData
class UserInfo extends React.Component {
    render() {
        return (
            <div>
                <h1 className="large"><span className="large-darkblue">Display Name: </span> <span className="large-blue">{this.props.userData.displayName}</span></h1>
                <h1 className="large"><span className="large-darkblue">Email: </span> <span className="large-blue">{this.props.userData.email}</span></h1>
                <h1 className="small"><span className="large-darkblue">Last Sign In: </span> <span className="large-blue">{this.props.userData.lastSignIn}</span></h1>
                <h1 className="small"><span className="large-darkblue">First Sign on: </span> <span className="large-blue">{this.props.userData.firstSignOn}</span></h1>
                <h1 className="small"><span className="large-darkblue">Provider: </span> <span className="large-blue">{this.props.userData.providerId}</span></h1>
                <h1 className="small"><span className="large-darkblue">UID: </span> <span className="large-blue">{this.props.userData.uid}</span></h1>
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
                <UpdatePassword id="user-password"/>
            </div>
            );
    }
}

const domContainer = document.querySelector('#root');

firebase.auth().onAuthStateChanged(function (user) {
    if (user && !readonly) {
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
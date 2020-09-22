'use strict';

/**
 * Components are defined in the Users directory, and are added to the global scope
 **/

//Properties: userData: dispalyName, email, providerId, uid, lastSignIn, firstSignOn
class UserSection extends React.Component {
    render() {
        return (
            <div className="user-section">
                <div id="user-info">
                    <UserInfo  userData={this.props.userData} />
                </div>
                <div id="user-password">
                    <UpdatePassword  uid={this.props.userData.uid} />
                </div>
                <div id="user-share">
                    <ShareCodesView  uid={this.props.userData.uid} />
                </div>
                <div id="user-signin">
                    <UserSignIn userData={this.props.userData}/>
                </div>
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
    else if (canModify) {
        ReactDOM.render(<ModifyError />, domContainer);
        document.getElementById('loading-gif').style.display = 'none';
    }
    else if (canAdd) {
        ReactDOM.render(<AddonlyError />, domContainer);
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
        sessionStorage.setItem('uid', "");
        sessionStorage.setItem('pid', "");
        sessionStorage.setItem('bid', "");
        sessionStorage.setItem('add', false);
        sessionStorage.setItem('all', false);
        sessionStorage.setItem('readonly', readonly);
    }
});
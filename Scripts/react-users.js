'use strict';

/**
 * Components are defined in the Users directory, and are added to the global scope
 **/

//Properties: userData: dispalyName, email, providerId, uid, lastSignIn, firstSignOn
class UserSectionUser extends React.Component {
    render() {
        return (
            <div className="user-section">
                <div id="user-info">
                    <UserInfoUser  userData={this.props.userData} />
                </div>
                <div id="user-password">
                    <UpdatePasswordUser  uid={this.props.userData.uid} />
                </div>
                <div id="user-share">
                    <ShareCodesViewUser  uid={this.props.userData.uid} />
                </div>
                <div id="user-signin">
                    <UserSignInUser userData={this.props.userData}/>
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

        ReactDOM.render(<UserSectionUser userData={userData} />, domContainer);
        document.getElementById('loading-gif').style.display = 'none';
    }
    else if (canModify) {
        ReactDOM.render(<ModifyErrorUser />, domContainer);
        document.getElementById('loading-gif').style.display = 'none';
    }
    else if (canAdd) {
        ReactDOM.render(<AddonlyErrorUser />, domContainer);
        document.getElementById('loading-gif').style.display = 'none';
    }
    else if (readonly) {
        ReactDOM.render(<ReadonlyErrorUser />, domContainer);
        document.getElementById('loading-gif').style.display = 'none';
    }
    else {
        ReactDOM.render(<NotAuthErrorUser />, domContainer);
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
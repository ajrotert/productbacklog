// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var loaded = false;

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.

            document.getElementById('pb-button').style.display = 'block';

            return false;
        },
        uiShown: function () {
            try {
                document.getElementById('loader').style.display = 'none';
                document.getElementById('firebaseui-auth-container').blur();
                document.getElementById('Home-Page').focus();
            }
            catch{ }
        }
    },
    signInFlow: 'popup',
    
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true,
            customParameters: {
                prompt: 'none'
            }
        }
    ]
    // Terms of service url.
    //tosUrl: '<developednotdownloaded.com>',
    // Privacy policy url.
    //privacyPolicyUrl: '<developednotdownloaded.com>'
};



firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById('welcome-label').style.display = 'block';
        document.getElementById('welcome-user').innerText = `${user.displayName}`
        document.getElementById('Login_Button').textContent = 'Show Login';

    } else {
        document.getElementById('welcome-label').style.display = 'none';
    }
});
loadPB = function () {
    if (firebase.auth().currentUser.uid != null) {
        sessionStorage.setItem('uid', firebase.auth().currentUser.uid);
        window.location.href = 'ProductBacklog.html';
    }
};

showLogin = function () {
    ui.start('#firebaseui-auth-container', uiConfig);
    document.getElementById('pb-button-login').style.display = "none";
    loaded = true;
    document.getElementById('Login_Button').textContent = "Show Login";
};

window.onload = () => {
    loaded = false;
};

window.onclose = (() => {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
});
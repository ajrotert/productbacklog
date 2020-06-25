// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

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
                document.getElementById('firebaseui-auth-container').blur();
                document.getElementById('Home-Page').focus();
            }
            catch (error) {
                console.log('An error has occured');
            }
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
    ],
    // Terms of service url.
    tosUrl: '<https://developednotdownloaded.com>',
    // Privacy policy url.
    privacyPolicyUrl: '<https://developednotdownloaded.com>'
};

ui.start('#firebaseui-auth-container', uiConfig);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById('welcome-label').style.display = 'block';
        document.getElementById('welcome-user').innerText = `${user.displayName}`

    } else {
        document.getElementById('welcome-label').style.display = 'none';
    }
});
function loadPB() {
    if (firebase.auth().currentUser.uid != null) {
        sessionStorage.setItem('uid', firebase.auth().currentUser.uid);
        sessionStorage.setItem('readonly', false);
        window.location.href = 'ProductBacklog.html';
    }
};

function shareCodeEntered() {
    sessionStorage.setItem('uid', input.value);
    sessionStorage.setItem('readonly', true);
    window.location.href = 'ProductBacklog.html';
};

var input = document.getElementById("inputShareCode");

input.addEventListener("keyup", function (event) {
    document.getElementById('labelShareCode').style.display = 'inline-block';
    if (event.keyCode === 13) {
        event.preventDefault();
        shareCodeEntered();
    }
});

window.onclose = (() => {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
});
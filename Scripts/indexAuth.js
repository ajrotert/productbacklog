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

            }
            catch (error) {
                console.log('An error has occured');
                console.log(error);
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
        window.location.href = 'Projects.html';
    }
};
function getCodeFromDatabase(share_code) {
    return firebase.firestore().collection('shares').doc(share_code).get();
};

function shareCodeEntered() {
    if (input.value != '') {
        getCodeFromDatabase(input.value)
            .then((doc) => {
                if (doc.data() != null) {
                    uid = doc.data().share_code.split('»')[0]
                    pid = doc.data().share_code.split('»')[1]
                    sessionStorage.setItem('uid', uid);
                    sessionStorage.setItem('pid', pid);
                    sessionStorage.setItem('readonly', true);
                    window.location.href = 'ProductBacklog.html';
                }
                else {
                    document.getElementById('labelShareCode').innerText = "(Share code is invalid)";
                    document.getElementById('labelShareCode').style.color = 'red';
                }

            });
    }
    else {
        document.getElementById('labelShareCode').innerText = "(Share code is invalid)";
        document.getElementById('labelShareCode').style.color = 'red';
    }
    
};

function validateShareCode() {
    var shareCodeIsValid = false;
    if (input.value != '') {
        document.getElementById('labelShareCode').style.display = 'inline-block';
        if (input.value.length == 20) {
            getCodeFromDatabase(input.value)
                .then((doc) => {
                    if (doc.exists) {
                        document.getElementById('labelShareCode').innerText = "(Share code is valid)";
                        document.getElementById('labelShareCode').style.color = '#0066FF';
                        document.getElementById('buttonShareCode').style.display = 'inline-block';
                        document.getElementById('startup').style.display = 'none';
                    }
                });
        }
        
    }

    if (!shareCodeIsValid) {
        document.getElementById('labelShareCode').innerText = "(Share code is invalid)";
        document.getElementById('labelShareCode').style.color = 'red';
        document.getElementById('buttonShareCode').style.display = 'none';
        document.getElementById('startup').style.display = 'block';
    }

}

var input = document.getElementById("inputShareCode");

input.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        shareCodeEntered();
    }
});
input.oninput = function validator() {
    validateShareCode();
};

window.onclose = (() => {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
});

//Remove any existing data
window.onload = function () {
    this.sessionStorage.removeItem('uid');
    this.sessionStorage.removeItem('pid');
    this.sessionStorage.removeItem('readonly');

}
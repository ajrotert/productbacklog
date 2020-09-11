// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function (authResult, redirectUrl) {
            // User successfully signed in.
            // Return type determines whether we continue the redirect automatically
            // or whether we leave that to developer to handle.

            document.getElementById('welcome-label').style.display = 'block';
            document.getElementById('welcome-user').innerText = `${authResult.user.displayName}`
            document.getElementById('pb-button').style.display = 'block';

            return false;
        },
        uiShown: function () {
            try {
                document.getElementById('loading-gif').style.display = "none";
            }
            catch (error) {
                console.log('An error has occured');
                console.log(error);
            }
        }
    },
    //immediateFederatedRedirect: false,
    signInFlow: 'popup', // 'redirect',
    
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
    tosUrl: 'https://developednotdownloaded.com',
    // Privacy policy url.
    privacyPolicyUrl: 'https://developednotdownloaded.com'
};

//Check if user is signed in, if not display login
firebase.auth().onAuthStateChanged(function (user) {
    if (user != null) {
        sessionStorage.setItem('uid', firebase.auth().currentUser.uid);
        sessionStorage.setItem('readonly', false);
        document.getElementById('loading-gif').style.display = "none";

        document.getElementById('welcome-label').style.display = 'block';
        document.getElementById('welcome-user').innerText = `${firebase.auth().currentUser.displayName}`;
        document.getElementById('pb-button').style.display = 'block';
    }
    else {
        document.getElementById('welcome-label').style.display = 'none';
        document.getElementById('welcome-user').innerText = 'User';
        document.getElementById('pb-button').style.display = 'none';
        ui.start('#firebaseui-auth-container', uiConfig);
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
                    firebase.auth().signOut().then(function () {
                        sessionStorage.removeItem('uid');
                        sessionStorage.removeItem('pid');
                        sessionStorage.removeItem('bid');
                        sessionStorage.removeItem('readonly');
                        uid = doc.data().shared_uid
                        pid = doc.data().shared_pid
                        sessionStorage.setItem('uid', uid);
                        sessionStorage.setItem('pid', pid);
                        sessionStorage.setItem('readonly', true);
                        window.location.href = 'ProductBacklog.html';
                    }, function (error) {
                        uid = doc.data().shared_uid
                        pid = doc.data().shared_pid
                        sessionStorage.setItem('uid', uid);
                        sessionStorage.setItem('pid', pid);
                        sessionStorage.setItem('readonly', true);
                        window.location.href = 'ProductBacklog.html';
                    });
                    
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

window.addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        if (document.getElementById('pb-button').style.display == 'block' && document.getElementById('startup').style.display != 'none')
            loadPB();
        else 
            shareCodeEntered();
        event.preventDefault();
    }
});
input.oninput = function validator() {
    validateShareCode();
};

//Deselect any projects
window.addEventListener('load', function (e) {
    sessionStorage.removeItem('uid');
    sessionStorage.removeItem('pid');
    sessionStorage.removeItem('bid');
    sessionStorage.removeItem('readonly');
});
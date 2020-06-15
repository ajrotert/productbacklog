// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBQDork5RkxlDGgwKX9gBk9dfPHc-KITl4",
    authDomain: "productbacklogdev.firebaseapp.com",
    databaseURL: "https://productbacklogdev.firebaseio.com",
    projectId: "productbacklogdev",
    storageBucket: "productbacklogdev.appspot.com",
    messagingSenderId: "437083308088",
    appId: "1:437083308088:web:c92b46f49185e67f2de6cd",
    measurementId: "G-L27TB92C6X"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

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
            // The widget is rendered.
            // Hide the loader.
            try {
                document.getElementById('loader').style.display = 'none';
            }
            catch{ }
        }
    },
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true
        }
    ]
    // Terms of service url.
    //tosUrl: '<developednotdownloaded.com>',
    // Privacy policy url.
    //privacyPolicyUrl: '<developednotdownloaded.com>'
};

ui.start('#firebaseui-auth-container', uiConfig);

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        document.getElementById('welcome-label').style.display = 'block';

        document.getElementById('welcome-user').innerText = `${user.displayName}`
        global.firebaseUID = user.uid;
    } else {
        document.getElementById('welcome-label').style.display = 'none';
    }
});
var loadPB = function () {
   //     window.location.href = '/app?ID=' + firebase.auth().currentUser.uid;

    window.location.href = 'app';
}

window.onclose = (() => {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
});
window.onbeforeunload = (() => {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.
    }).catch(function (error) {
        // An error happened.
    });
});
var online = true;
updateOnlineMessage();

function updateOnlineMessage() {
    if (navigator.onLine) {
        document.getElementById('offline').style.display = 'none';
        if (!online) {
            online = true;
            firebase.firestore().enableNetwork()
                .then(function () {

                    setTimeout(function () {
                        var confirms = window.confirm('Internet Connection Restored. \nPress OK to refresh the page to restore all functionality.');
                        if (confirms) {
                            location.reload();
                        }
                    }, 2000);
                    
                });
        }
    }
    else {
        document.getElementById('offline').style.display = 'inline-block';
        document.getElementById('loading-gif').style.display = 'none';
        online = false;
    }
}
window.addEventListener('online', updateOnlineMessage);
window.addEventListener('offline', updateOnlineMessage);
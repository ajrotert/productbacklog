var online = true;
updateOnlineMessage();

function updateOnlineMessage() {
    if (navigator.onLine) {
        document.getElementById('offline').style.display = 'none';
        if (!online) {
            online = true;
            location.reload();
        }
    }
    else {
        document.getElementById('offline').style.display = 'inline-block';
        online = false;
    }
}
window.addEventListener('online', updateOnlineMessage);
window.addEventListener('offline', updateOnlineMessage);
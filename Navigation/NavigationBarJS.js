var loadFunction = function () {
    $("#nav-placeholder").load("Navigation/NavigationBar.html", function (response, status, xhr) {
        if (status == "error") {
            console.log("An error has occured. Attempting to reload navigation bar.");
            caches.delete("NavigationBar.html");
            caches.delete("Navigation/NavigationBar.html");
            loadFunction();
        }
    });

};
$(loadFunction);
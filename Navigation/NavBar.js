window.onscroll = function () { myFunction() };

var navbar = document.getElementById("nav-placeholder"); //topnavbar


var sticky = navbar.offsetTop;

function myFunction() {
    var title = document.title;

    if (title.includes("Online")) {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("sticky");
        } else {
            navbar.classList.remove("sticky");
        }
    }
    else {
    if (window.pageYOffset >= sticky) {
        navbar.classList.add("sticky-full");
    } else {
        navbar.classList.remove("sticky-full");
        }
    }

    
    
}

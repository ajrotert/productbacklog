
function getStylesAsString() {
    return { __html: 'ul.nav { list-style-type: none; margin: 0; padding: 0; overflow: hidden; background-color: #333; } li.navitem { float: left;  } li.navitem a, .dropbtn { display: inline-block; color: white; text-align: center; padding: 14px 16px; text-decoration: none; } li.navitem a:hover, dropdown:hover .dropbtn { background-color: #0066ff; } li.dropdown { display: inline-block; } .dropdown-content { display: none; position: absolute; background-color: #DCDCDC; min-width: 160px; box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2); z-index: 1; } div.dropdown-content a { color: black; padding: 12px 16px; text-decoration: none; text-align: left; display: block; } .dropdown-content a:hover { background-color: #f1f1f1; } .dropdown:hover .dropdown-content { display: block; } .active { background-color: #022E6D; } .hamburgerBar { display: none; } .sticky { position: fixed; top: 0; width: 90%; z-index: 100; } .sticky-full { position: fixed; top: 0; width: 100%; z-index: 100; } .PBIDEV { float: right !important; font-stretch: ultra-expanded; font-weight: 900; } .pad { padding-left: 60px; } img.logo-nav { z-index: 1; position: fixed; top: 0; left: 0; height: 60px;} @media screen and (max-width: 1000px) { li.navitem a, .dropbtn { font-size: 12px;} div.dropdown-content a { font-size: 12px; } .sticky { width: 100%; } } @media screen and (max-width: 600px) { .nav li:not(:first-child):not(:last-child) { display: none; } .nav.responsive li:not(:empty) { float: none; display: block; text-align: left; } .navitem.hamburgerBar { float: right; display: block; } .nav.responsive { position: relative; } .nav.responsive .hamburgerBar { position: absolute; right: 0; top: 0; } .dropdown-content a { background-color: #DCDCDC; } .dropdown:hover .dropdown-content { display: contents; color: white; } li.navitem a, .dropbtn { float: none; display: block; text-align: left;} }'};
}

class ArNav extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div>
            <style dangerouslySetInnerHTML={getStylesAsString()} />

            <nav id="nav-placeholder">
                <img src="Images/PBDLogo.png" className="logo-nav" id="logo-nav" />
                <ul className="nav" id="navStart">
                    <li className="navitem pad" id="Home-Page"><a href="index.html">Home</a></li>
                    <li id="nav-logo"> <img src="Images/PBDLogo.png" className="logo-nav" id="logo-nav" /> </li>
                    <li className="navitem PBIDEV" id="Parent"><a href="#null">ProductBacklog.Dev</a></li>
                    <li className="navitem" id="PR-Page"><a href="Projects.html">Projects</a></li>
                    <li className="navitem" id="PB-Page"><a href="ProductBacklog.html">Product Backlog</a></li>
                    <li className="navitem hamburgerBar" id="Drop-Down"><a href="#null" onClick={this.props.onClick}>&#9776;</a></li>

                </ul>
                </nav>
            </div>
        );
    }

}


ReactDOM.render(<ArNav onClick={toggleFunction} />, document.querySelector('#nav-placeholder'));


var title = document.title;

if (title.includes("Home"))
    document.getElementById("Home-Page").classList.add("active");
else if (title.includes("Online")) {
    document.getElementById("PB-Page").classList.add("active");
    document.getElementById("logo-nav").style.display = "none";
    document.getElementById("nav-logo").style.display = "none";
    document.getElementById("Home-Page").classList = "navitem";
}
else if (title.includes("Projects")) {
    document.getElementById("PR-Page").classList.add("active");
    document.getElementById("logo-nav").style.display = "none";
    document.getElementById("nav-logo").style.display = "none";
    document.getElementById("Home-Page").classList = "navitem";
}

function toggleFunction() {
    var x = document.getElementById("navStart");
    if (x.className === "nav") {
        x.className += " responsive";
    } else {
        x.className = "nav";
    }
    return false;
}

//*******************************************************************************

window.onscroll = function () { myFunction() };

var navbar = document.getElementById("nav-placeholder"); //topnavbar


var sticky = navbar.offsetTop;

function myFunction() {
    var title = document.title;

    if (title.includes("Online") || title.includes("Projects")) {
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
'use strict';

/**
 * Components are defined in the ProjectSelection directory, and are added to the global scope
 **/


function generatePbiModalPopup(id = null, timestamp = null) { //Duplicate in Projects-project.js
    if (!readonly) {
        ReactDOM.render(<ModalViewProject id={id} timestamp={timestamp} />, document.querySelector('#rootModal'));

    }
    else {
        //Readonly
    }
}

//Properties: data
//Global Methods: generatePbiModalPopup
//Global Constants: 
class ProjectsListProject extends React.Component {

    handler() {
        generatePbiModalPopup();
    }

    render() {
        function compare(object1, object2) {    //custom comparison function
            return object1 > object2 ? 1 : -1;
        };

        const orderedData = this.props.data.docs.sort((object1, object2) => compare(object1.data().timestamp, object2.data().timestamp));

        const projectsArray = orderedData.map((object, index) => {
            return (
                <div key={object.id} >
                    <ProjectsProject id={object.id} name={object.data().name} description={object.data().description} timestamp={object.data().timestamp}/>
                </div>
            );
        });

        return (
            <div className="list">
                <a className="button" onClick={this.handler}>Add New Project</a>
                {projectsArray}
            </div>
        );
    }

}

const domContainer = document.querySelector('#root');

firebase.auth().onAuthStateChanged(function (user) {
    if (user != null & uid != null) {
        db.collection('users').doc(uid).collection('Projects')
            .onSnapshot((snapshot) => {
                ReactDOM.render(<ProjectsListProject data={snapshot} />, domContainer, () => { });
                document.getElementById('loading-gif').style.display = 'none';
            });
    }
    else {
        ReactDOM.render(<NotAuthErrorDemoProject />, domContainer);
        document.getElementById('loading-gif').style.display = 'none';
    }
});

//Deselect any projects
window.addEventListener('load', function (e) {
    sessionStorage.removeItem('pid');
    sessionStorage.removeItem('bid');
});

//Prevent user from changing values
window.addEventListener('storage', function (e) {
    if (e.storageArea === sessionStorage) {
        sessionStorage.setItem('uid', uid);
        sessionStorage.setItem('add', false);
        sessionStorage.setItem('all', false);
        sessionStorage.setItem('readonly', readonly);
    }
});
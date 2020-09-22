//Properties: userData
//Global Methods:
//Global Constants: defaultUser, readonly
class UserInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayName: this.props.userData.displayName,
            email: this.props.userData.email,
            editDisplayName: false,
            editEmail: false
        }
    }

    editNames = (event) => {
        if (event.target.id == 'edit_display_name') {
            this.setState({ editDisplayName: true });
        }
        else if (event.target.id == 'edit_email') {
            this.setState({ editEmail: true });
        }
    }
    closeNames = (event) => {
        if (event.target.id == 'display_close') {
            this.setState({ editDisplayName: false });
        }
        else if (event.target.id == 'email_close') {
            this.setState({ editEmail: false });
        }
        document.getElementById('user-validation-message').style.display = 'none';
    }

    submit = (event) => {
        var errorNode = document.getElementById('user-validation-message');
        errorNode.style.display = 'inline-block';
        errorNode.style.color = 'red';
        if (this.props.userData.uid != defaultUser || readonly) {

            if (event.target.id == 'edit_display_submit') {
                var input = document.getElementById('editDisplayInput').value;
                document.body.style.cursor = 'wait';
                if (input != "") {
                    firebase.auth().currentUser.updateProfile({
                        displayName: input
                    }).then(() => {
                        this.setState({ displayName: input });
                        this.setState({ editDisplayName: false });
                        document.body.style.cursor = 'default';
                        errorNode.display = 'none';
                    }).catch((error) => {
                        console.log(error);
                        errorNode.innerText = 'Failed: ' + error.message;
                        document.body.style.cursor = 'default';
                    });

                }
            }
            else if (event.target.id == 'edit_email_submit') {
                var input = document.getElementById('editEmailInput').value;
                document.body.style.cursor = 'wait';
                if (input != "") {
                    firebase.auth().currentUser.updateEmail(input)
                        .then(() => {
                            this.setState({ email: input });
                            this.setState({ editEmail: false });
                            errorNode.display = 'none';
                            document.body.style.cursor = 'default';
                        }).catch((error) => {
                            console.log(error);
                            errorNode.innerText = 'Failed: ' + error.message;
                            document.body.style.cursor = 'default';
                        });

                }
            }
        }
        else {
            errorNode.innerText = 'Failed: ' + "Cannot modify this user.\n"
        }
    }

    render() {
        return (
            <div>
                <h1 className="large center">User Information</h1>
                <div className={this.state.editDisplayName ? "hide-const" : ""}>
                    <span className="button_icons" id="edit_display_name" onClick={(e) => this.editNames(e)}>✎</span>
                    <h1 className=""><span className="large-darkblue">Display Name: <br /> </span> <span className="large-blue">{this.state.displayName}</span></h1>
                </div>
                <div className={this.state.editDisplayName ? "" : "hide-const"}>
                    <span className="button_icons" id="display_close" onClick={(e) => this.closeNames(e)}>&times;</span>
                    <h1 className=""><span className="large-darkblue">Display Name: </span></h1>
                    <input className="edit-input-style" id="editDisplayInput" type="text" placeholder={this.state.displayName} />
                    <a className="button" id="edit_display_submit" onClick={(e) => this.submit(e)}>Submit</a>
                    <br />
                </div>
                <div className={this.state.editEmail ? "hide-const" : ""}>
                    <span className="button_icons" id="edit_email" onClick={(e) => this.editNames(e)} >✎</span>
                    <h1 className=""><span className="large-darkblue">Email: <br /> </span> <span className="large-blue">{this.state.email}</span></h1>
                </div>
                <div className={this.state.editEmail ? "" : "hide-const"}>
                    <span className="button_icons" id="email_close" onClick={(e) => this.closeNames(e)}>&times;</span>
                    <h1 className=""><span className="large-darkblue">Email: </span></h1>
                    <input className="edit-input-style" id="editEmailInput" type="text" placeholder={this.state.email} />
                    <a className="button" id="edit_email_submit" onClick={(e) => this.submit(e)}>Submit</a>
                    <br />
                </div>
                <p id="user-validation-message"></p>
            </div>
        );
    }

}
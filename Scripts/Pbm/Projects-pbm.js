//Props: state: name, description
//Global Methods:
//Global Constants:
class Projects extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="project_item" >
                <h1>{this.props.state.name}</h1>
                <hr />
                <h3>{this.props.state.description}</h3>
            </div>
        );
    }
}
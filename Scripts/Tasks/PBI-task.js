//Properties: state, inProgressChecked
//Global Methods:
//Global Constants:
class PBI extends React.Component {
    constructor(props) {
        super(props);
        var hiddenState = this.props.hidden == null ? false : this.props.hidden;
    }

    render() {
        return (
            <div className={this.props.state.shadowColor} id={this.props.state.id}>
                <br className="clears" />
                <h1>{this.props.state.title}</h1>
                <hr />
                <p>Description: {this.props.state.description}</p>
                <h3>{this.props.state.isStory ? "Story" : "Defect"}</h3>
                <input type="checkbox" id={"inprogress" + this.props.state.ID} name={"inprogress" + this.props.state.ID} checked={this.props.state.inprogress} value="none" hidden={this.props.state.completed} disabled={this.props.state.completed} onChange={this.props.inProgressChecked} />
                <label id={"inprogressL" + this.props.state.ID} htmlFor={"inprogress" + this.props.state.ID} hidden={this.props.state.completed}> In Progress</label><br /><br />
                <input type="checkbox" id={"done" + this.props.state.ID} name={"done" + this.props.state.ID} checked={this.props.state.completed} value="none" disabled={false} onChange={this.props.completedChecked} />
                <label id={"doneL" + this.props.state.ID} htmlFor={"done" + this.props.state.ID} disabled> Item Completed</label><br />
                <p className="info" hidden={this.props.state.tasks == null}>Task Count: {this.props.state.tasks} </p>
                <p className="small_info"> {this.props.state.hide ? "Hidden" : ""} </p>
                <p className="small_info">Timestamp: {this.props.state.timestamp} </p>
                <p className="small_info">ID: {this.props.state.ID}</p>
            </div>
        );
    }
}
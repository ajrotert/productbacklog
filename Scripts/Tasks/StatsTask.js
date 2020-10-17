//Properties: stats, action, action2
//Global Methods:
//Global Constants:
class StatsTask extends React.Component {
    constructor(props) {
        super(props);
        const hidden = localStorage.getItem('TASKSTATSAREAHIDDEN');
        this.state = {
            carrot: '\u2571\u2572',
            hidden: hidden == null ? 'false' : hidden,
            searchCount: 0
        };
    }
    toggleContent = (event) => {
        var intervalID;
        var ids = document.getElementById("stats-display");
        var searchFeatures = document.getElementById('search-radios-container');
        const pointsUp = '\u2571\u2572';
        const pointsDown = '\u2572\u2571';
        if (!event.target.id.includes('hideShowLink')) {
            if (ids.classList.contains('hide-const') || searchFeatures.classList.contains('hide-const')) {
                //Show elements
                ids.classList.remove('hide-const');
                searchFeatures.classList.remove('hide-const');
                ids.style.opacity = 0;
                searchFeatures.style.opacity = 0;
                this.setState({ carrot: pointsUp });
                localStorage.setItem('TASKSTATSAREAHIDDEN', 'false');
                intervalID = setInterval(buildOpacity, 15, ids, searchFeatures);
            }
            else {
                //Hide elements
                ids.style.opacity = 1;
                searchFeatures.style.opacity = 1;
                localStorage.setItem('TASKSTATSAREAHIDDEN', 'true');
                this.setState({ carrot: pointsDown });
                intervalID = setInterval(dropOpacity, 15, ids, searchFeatures);
            }
        }

        function buildOpacity(node, node2 = null) {
            var opacity = parseFloat(node.style.opacity) + .05;
            node.style.opacity = opacity;
            if (node2 != null)
                node2.style.opacity = opacity;
            if (node.style.opacity >= 1.0) {
                clearInterval(intervalID);
            }
        };

        function dropOpacity(node, node2 = null) {
            var opacity = parseFloat(node.style.opacity) - .05;
            node.style.opacity = opacity;
            node2.style.opacity = opacity;
            if (node.style.opacity <= 0) {
                clearInterval(intervalID);
                node.classList.add('hide-const');
                node2.classList.add('hide-const');

            }
        };
    };

    searching = (event) => {
        var searchItems;
        var hideItems;

        if (event.target.value != "") {
            var keyword = event.target.value;
            var checkboxes = document.getElementsByName('search-criteria');
            var selectedValue = "inProgress";
            for (let radios of checkboxes) {
                if (radios.checked)
                    selectedValue = radios.value;
            }

            if (selectedValue == "inProgress") {
                searchItems = document.getElementById('grid1');
                hideItems = document.getElementById('grid2');
            }
            else if (selectedValue == "completed") {
                searchItems = document.getElementById('grid2');
                hideItems = document.getElementById('grid1');
            }
            else if (selectedValue == "all") {
                hideItems = null;
            }

            if (hideItems != null) {
                hideAllElements(hideItems.getElementsByClassName('PBI'));
                var results = searchAllElements(searchItems.getElementsByClassName('PBI'), keyword);
                this.setState({ searchCount: results });
            }
            else {
                var results = searchAllElements(document.getElementById('grid1').getElementsByClassName('PBI'), keyword);
                results += searchAllElements(document.getElementById('grid2').getElementsByClassName('PBI'), keyword);
                this.setState({ searchCount: results });
            }

        }
        else {
            resetAllElements(document.getElementsByClassName('PBI'));
            this.setState({ searchCount: 0 });
        }

        function hideAllElements(elements) {
            for (let element of elements) {
                element.classList.remove('search-show');
                element.classList.add('search-hide');
            }
        };

        function resetAllElements(elements) {
            for (let element of elements) {
                element.classList.remove('search-show');
                element.classList.remove('search-hide');
            }
        };

        function searchAllElements(elements, keyword) {
            var counter = 0;
            for (let element of elements) {
                if (element.innerText != null && element.innerText.toLowerCase().includes(keyword.toLowerCase().trim())) {
                    element.classList.remove('search-hide');
                    element.classList.add('search-show');
                    counter++;
                }
                else {
                    element.classList.remove('search-show');
                    element.classList.add('search-hide');
                }
            }
            return counter;
        };
    }
    searching1 = () => {
        var searchVal = document.getElementById('searchInput-hideShowLink').value;
        var object = { target: null };
        object.target = { value: searchVal }
        this.searching(object);
    }

    searching2(value) {
        var searchVal = value;
        document.getElementById('searchInput-hideShowLink').value = value;
        var object = { target: null };
        object.target = { value: searchVal }
        this.searching(object);
    }

    hideClicked = (event) => {
        this.searching2('');
        this.props.action(event);
    }

    inprogressClicked = (event) => {
        this.searching2('');
        this.props.action2(event);
    }

    componentDidMount() {
        document.getElementById('inProgressOnly-hideShowLink').checked = true;
    }

    render() {
        return (
            <div className="status" onClick={(e) => this.toggleContent(event)}>
                <hr />
                <div> {readonly ? (canAdd ? (canModify ? <h1 className="readonly-link">MODIFY-ACCESS</h1> : <h1 className="readonly-link">ADD-ONLY</h1>) : <h1 className="readonly-link">READ-ONLY</h1>) : null} <br className="clears" /></div>
                <div id="Left-Side">
                    <div id="stats-display" className={this.state.hidden == 'true' ? "hide-const" : ""}>
                        <h3>Visible Backlog Items:</h3>
                        <p className="padding-right"><span className="bolder">Available: </span> Tasks: <span className="status-story">{this.props.stats.visible.inProgressTask}</span> </p>
                        <p className="padding-right"><span className="bolder">Completed: </span>Tasks: <span className="status-completed">{this.props.stats.visible.completedTask}</span> </p>
                        <h3>Hidden Backlog Items:</h3>
                        <p className="padding-right"><span className="bolder">Available: </span> Tasks: <span className="status-story">{this.props.stats.hidden.inProgressTask}</span> </p>
                        <p className="padding-right"><span className="bolder">Completed: </span>Tasks: <span className="status-completed">{this.props.stats.hidden.completedTask}</span> </p>
                        <h3>Total Backlog Items:</h3>
                        <p className="padding-right"><span className="bolder">Available: </span> Tasks: <span className="status-story">{this.props.stats.total.inProgressTask}</span> </p>
                        <p className="padding-right"><span className="bolder">Completed: </span>Tasks: <span className="status-completed">{this.props.stats.total.completedTask}</span> </p>
                    </div>
                </div>
                <div id="Right-Side">
                    <br className="clears" />
                    <a id="hideShowLink" className="stats-links" href="#null" onClick={(e) => this.hideClicked(e)} >{SHOW_HIDDEN_ITEMS}</a><br className="clears" />
                    <a id="hideShowLink-inprogress" className="stats-links" href="#null" onClick={(e) => this.inprogressClicked(e)} >{SHOW_IN_PROGRESS_ITEMS}</a><br className="clears" />
                    <div id="search-radios-container" className={this.state.hidden == 'true' ? "hide-const" : ""}>
                        <div className="search-radios" id="searchRadio-hideShowLink">
                            <input className="search-input" id="searchInput-hideShowLink" type="search" placeholder="Search for a task: " onChange={(e) => this.searching(e)} /><br />
                            <input type="radio" id="inProgressOnly-hideShowLink" name="search-criteria" value="inProgress" onClick={() => this.searching1()} />
                            <label for="inProgressOnly-hideShowLink" id="a-hideShowLink">In Progress</label>
                            <input type="radio" id="completedOnly-hideShowLink" name="search-criteria" value="completed" onClick={() => this.searching1()} />
                            <label for="completedOnly-hideShowLink" id="b-hideShowLink">Completed</label>
                            <input type="radio" id="allItems-hideShowLink" name="search-criteria" value="all" onClick={() => this.searching1()} />
                            <label for="allItems-hideShowLink" id="c-hideShowLink">All</label>
                            <p className="search-results" hidden={this.state.searchCount == 0}>{"Found Results: " + this.state.searchCount}</p>
                        </div>
                    </div>
                </div>
                <br className="clears" />
                <div id="carrot"> <center> <span>{this.state.carrot}</span> </center></div>
                <hr />
            </div>
        );
    }
}
﻿//Properties:
//Global Methods:
//Global Constants: ADD_YOUR_FIRST_TASK, PRESS_NEW_ITEM_TO_ADD_YOUR_FIRST_TASK
class FirstPbiTask extends React.Component {
    render() {
        return (
            <div className="PBI normalizePBIheading box_shadow_blue" id="00000">
                <br className="clears" />
                <h1>{ADD_YOUR_FIRST_TASK}</h1>
                <hr />
                <p>Description: {PRESS_NEW_ITEM_TO_ADD_YOUR_FIRST_TASK}</p>
                <h3>Task</h3>

                <p className="small_info">Timestamp: 00000 </p>
                <p className="small_info">ID: 00000</p>
            </div>
        );
    }
}
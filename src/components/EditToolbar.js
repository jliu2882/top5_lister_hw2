import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const { undoCallback, redoCallback, closeListCallback } = this.props;
        return (
            <div id="edit-toolbar">
                <div //TODO disable when nothing to undo
                    id='undo-button'
                    onClick={undoCallback}
                    className="top5-button">
                        &#x21B6;
                </div>
                <div //TODO disable when nothing to redo
                    id='redo-button'
                    onClick={redoCallback}
                    className="top5-button">
                        &#x21B7;
                </div>
                <div //TODO disable when no currentlist
                    id='close-button'
                    onClick={closeListCallback}
                    className="top5-button">
                        &#x24E7;
                </div>
            </div>
        )
    }
}
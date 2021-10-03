import React from "react";

export default class EditToolbar extends React.Component {
    render() {
        const { currentList, canUndo, canRedo, undoCallback, redoCallback, closeListCallback } = this.props;
        return (
            <div id="edit-toolbar">
                <div //TODO disable when nothing to undo
                    id='undo-button'
                    onClick={undoCallback}
                    className={canUndo?"top5-button":"top5-button-disabled"}>
                        &#x21B6;
                </div>
                <div //TODO disable when nothing to redo
                    id='redo-button'
                    onClick={redoCallback}
                    className={canRedo?"top5-button":"top5-button-disabled"}>
                        &#x21B7;
                </div>
                <div
                    id='close-button'
                    onClick={currentList!==null?closeListCallback:null}
                    className={currentList!==null?"top5-button":"top5-button-disabled"}>
                        &#x24E7;
                </div>
            </div>
        )
    }
}
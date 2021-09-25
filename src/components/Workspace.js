import React from "react";

export default class Workspace extends React.Component {
    render() {
        const { currentList } = this.props;
        if (currentList) {
            return (
                <div id="top5-workspace">
                    <div id="workspace-edit">
                        <div id="edit-numbering">
                            <div className="item-number">1.</div>
                            <div className="item-number">2.</div>
                            <div className="item-number">3.</div>
                            <div className="item-number">4.</div>
                            <div className="item-number">5.</div>
                        </div>
                        <div id ="edit-items">
                            {/* <input
                                autoFocus
                                className="top5-item"
                                onKeyPress={this.handleKeyPress}
                                onBlur={this.handleBlur}
                                onChange={this.handleUpdate}
                                defaultValue={currentList["items"][0]}
                            /> */} 
                            <div className="top5-item">{currentList["items"][0]}</div>
                            <div className="top5-item">{currentList["items"][1]}</div>
                            <div className="top5-item">{currentList["items"][2]}</div>
                            <div className="top5-item">{currentList["items"][3]}</div>
                            <div className="top5-item">{currentList["items"][4]}</div>
                        </div>
                    </div>
                </div>
            )
        } else{
            return (
                <div id="top5-workspace">
                    <div id="workspace-edit">
                        <div id="edit-numbering">
                            <div className="item-number">1.</div>
                            <div className="item-number">2.</div>
                            <div className="item-number">3.</div>
                            <div className="item-number">4.</div>
                            <div className="item-number">5.</div>
                        </div>
                        <div id ="edit-items">
                        </div>
                    </div>
                </div>
            )
        }
       
    }
}
import React from "react";
import ItemCard from "./ItemCard";

export default class Workspace extends React.Component {
    //we are passed highlightIndex of which to highlight so pass-> 
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
                            {
                                currentList.items.map((item, index) => (
                                    <ItemCard
                                        key={index}
                                        id={index}
                                        name={item}
                                        //highlight = {((""+index)===this.props.highlightIndex)}
                                        renameItemCallback={this.props.renameItemCallback}
                                        swapItemCallback={this.props.swapItemCallback}
                                        highlightItemCallback={this.props.highlightItemCallback}
                                    />
                                ))
                            }
                        </div>
                    </div>
                </div>
            )
        } else{ //Professor McKenna's code had a green background when he had no current list, and it can be hard-coded like this
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
import React from "react";

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.id,
            text: this.props.name,
            editActive: false,
        }
    }
    handleClick = (event) => {
        this.setState({
            id: this.props.id,
            text: this.props.name,
        });
        if (event.detail === 1) {
            //nothing should happen on oneclick
        }
        else if (event.detail === 2) {
            this.handleToggleEdit(event);
        }
    }
    handleToggleEdit = (event) => {
        this.setState({
            editActive: !this.state.editActive
        });
    }

    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleBlur();
        }
    }
    handleBlur = () => {
        let id = this.state.id;
        let textValue = this.state.text;
        this.props.renameItemCallback(id, textValue); //get renameItemCallBack
        this.handleToggleEdit();
    }
    handleUpdate = (event) => {
        this.setState({
            text: event.target.value
        });
    }

    onDragOver =(ev,id) =>{
        ev.preventDefault();
        ev.target.className = "top5-item-dragged-to";
        //this.props.highlightItemCallback(id);
    }
    onDragLeave =(ev,id) =>{
        ev.preventDefault();
        ev.target.className = "top5-item";
        //this.props.highlightItemCallback(id);
    }
    onDragStart =(ev, id) =>{
        ev.dataTransfer.setData("id",id);
    }
    onDrop =(ev,id)=>{
        id=""+id;
        let id2 = ""+ev.dataTransfer.getData("id");
        ev.target.className = "top5-item";
        //this.props.highlightItemCallback(null);
        if(id!==id2){
            this.props.swapItemCallback(id2,id);
        }
    }

    render() {
        //we are passed highligh t/f so if t then change css or smth
        const { id, name } = this.props;
        if (this.state.editActive) {
            return (
                <input
                    autoFocus
                    className="top5-item"
                   // className={highlight?"top5-item-dragged-to":"top5-item"}
                    id={id}
                    type='text'
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    onChange={this.handleUpdate}
                    defaultValue={name}
                />);
        }
        else {
            return (
                <div
                    draggable
                    onDragOver={(e)=>this.onDragOver(e,""+id)}
                    onDragLeave={(e)=>this.onDragLeave(e,""+id)}
                    onDragStart={(e)=>this.onDragStart(e,""+id)}
                    onDrop={(e)=>this.onDrop(e, id)}
                    onClick={this.handleClick}
                    className="top5-item"
                   // className={highlight?"top5-item-dragged-to":"top5-item"}
                    id={id}>
                    {name}
                </div>
            );
        }
    }
}
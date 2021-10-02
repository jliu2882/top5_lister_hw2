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

    render() {
        const { id, name } = this.props;
        if (this.state.editActive) {
            return (
                <input
                    autoFocus
                    className="top5-item"
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
                    onClick={this.handleClick}
                    className="top5-item"
                    id={id}>
                    {name}
                </div>
            );
        }
    }
}
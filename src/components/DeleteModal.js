import React, { Component } from 'react';

export default class DeleteModal extends Component {
    render() {
        const { keyNamePair, hideDeleteListModalCallback, confirmedDeleteCallback } = this.props;
        let name = "";
        if (keyNamePair) {
            name = keyNamePair.name;
        }
        return (
            <div
                className="modal"
                id="delete-modal"
                data-animation="slideInOutLeft">
                <div className="modal-dialog">
                    <header className="dialog-header">
                        Delete the {name} Top 5 List?
                    </header>
                    <div id="confirm-cancel-container">
                        <button
                            id="dialog-yes-button"
                            className="modal-button"
                            onClick={confirmedDeleteCallback}
                        >Confirm</button>
                        <button
                            id="dialog-no-button"
                            className="modal-button"
                            onClick={hideDeleteListModalCallback}
                        >Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}
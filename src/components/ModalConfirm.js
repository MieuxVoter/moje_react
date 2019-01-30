import React, {Component} from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

class ModalConfirm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal
        });
    };

    clickConfirm = () => {
        this.props.confirmCallback();
        this.toggle();
    };

    render() {
        return (
            <div>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className+" modal-dialog-centered"} >
                    <ModalHeader toggle={this.toggle}>{this.props.title}</ModalHeader>
                    <ModalBody>
                        {this.props.children}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.clickConfirm}>{this.props.confirmButtonText}</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>{this.props.cancelButtonText}</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default ModalConfirm;
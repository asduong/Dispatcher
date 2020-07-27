import React, { Component } from "react";
import moment from "moment";
import { Modal } from "@material-ui/core";

class CustomEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: 0,
      title: "",
    };
  }

  handleOpen = () => {
    this.setState({ isModalOpen: 1 });
  };

  handleClose = () => {
    this.setState({ isModalOpen: 0 });
  };

  handleChange = (e) => {
    console.log(e);
    this.setState({ title: e });
  };

  render() {
    const { start } = this.props;
    const { title } = this.state;

    const startm = moment(Date.parse(start)).format("h:mm a");
    return (
      <div>
        <div onClick={this.handleOpen}>{"title"}</div>
        <Modal open={this.isModalOpen} onClose={this.handleClose}>
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </Modal>
      </div>
    );
  }
}

export default CustomEvent;

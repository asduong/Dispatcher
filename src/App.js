import React, { Component } from "react";
import moment from "moment";
import { Modal, Button, Input } from "@material-ui/core";
import { Calendar, momentLocalizer } from "react-big-calendar";

import { remove, clone } from "lodash";

import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

function idGen(init) {
  return function () {
    return init++;
  };
}

const nextId = idGen(0);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isAddModalOpen: false,
      isEditModalOpen: false,
    };
  }

  toggleAddModal = (event) => {
    if (!this.state.isEditModalOpen) {
      this.setState({
        currentEvent: event,
        isAddModalOpen: !this.state.isAddModalOpen,
      });
    }
  };

  toggleEditModal = (event) => {
    if (!this.state.isAddModalOpen) {
      this.setState({
        currentEvent: event,
        isEditModalOpen: !this.state.isEditModalOpen,
      });
    }
  };

  handleChange = (e) => {
    this.setState({ title: e.target.value });
  };

  handleAdd = () => {
    this.setState({
      isAddModalOpen: !this.state.isAddModalOpen,
      events: [
        ...this.state.events,
        {
          id: nextId(),
          start: this.state.currentEvent.start,
          end: this.state.currentEvent.end,
          title: this.state.title,
        },
      ],
    });
  };

  handleEdit = () => {
    const events = clone(this.state.events);
    remove(events, {
      id: this.state.currentEvent.id,
    });

    console.log(events);
    console.log(this.state.events);

    this.setState({
      isEditModalOpen: !this.state.isEditModalOpen,
      events: [
        ...events,
        {
          start: this.state.currentEvent.start,
          end: this.state.currentEvent.end,
          title: this.state.title,
        },
      ],
    });
  };

  render() {
    const { isEditModalOpen, isAddModalOpen, currentEvent } = this.state;
    return (
      <div className="App">
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="week"
          events={this.state.events}
          selectable={true}
          onSelectSlot={this.toggleAddModal}
          onSelectEvent={this.toggleEditModal}
          views={["week"]}
          step={60}
          timeslots={1}
          style={{ height: "100vh" }}
        />
        <Modal open={isAddModalOpen}>
          <>
            <Input type="text" onChange={this.handleChange} />
            <Button color="primary" onClick={this.handleAdd}>
              Create
            </Button>
          </>
        </Modal>
        <Modal open={isEditModalOpen} toggle={this.toggleEditModal}>
          <>
            <Input
              type="text"
              value={this.state.currentEvent && this.state.currentEvent.title}
              onChange={this.handleChange}
            />
            <Button color="primary" onClick={this.handleEdit}>
              Create
            </Button>
          </>
        </Modal>
      </div>
    );
  }
}

export default App;

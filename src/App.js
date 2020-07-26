import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

import "./App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

import ModalCard from "./components/ModalCard";
import EventCard from "./components/EventCard";

const localizer = momentLocalizer(moment);

let components = {
  eventContainerWrapper: EventCard,
};

class App extends Component {
  state = {
    events: [],
    isOpen: false,
  };

  handleSelect = ({ start, end }) => {
    this.setState({
      events: [
        ...this.state.events,
        {
          start,
          end,
          title: "Board room",
        },
      ],
    });
  };

  // toggleCreate = () => {
  //   <SelectTaskCard onCreate={this.handleSelect} />;
  // };
  openModal = () => {
    this.setState({ isOpen: true });
  };

  closeModal = () => {
    this.setState({ isOpen: false });
  };

  render() {
    return (
      <div className="App">
        <button onClick={this.openModal}>Open Modal</button>
        <Calendar
          components={{
            event: EventCard,
          }}
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="week"
          events={this.state.events}
          selectable={true}
          onSelectEvent={(event) => alert(event.title)}
          onSelectSlot={this.handleSelect}
          views={["week"]}
          step={60}
          timeslots={1}
          style={{ height: "100vh" }}
        />
      </div>
    );
  }
}

export default App;

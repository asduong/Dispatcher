import React from "react";

const EventCard = () => {
  return (
    <div>
      <p>My event title: {this.props.title}</p>
      <button onClick={this.props.onPopoverButtonClick}>Test</button>
    </div>
  );
};

export default EventCard;

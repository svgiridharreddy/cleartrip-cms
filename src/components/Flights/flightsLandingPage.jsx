import React, { Component } from "react";
import axios from "axios";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import SimpleTable from "./simpleTable";
import { Redirect } from "react-router-dom";

var response = {
  flightBooking: [
    {
      id: 1,
      title: "bookgin title",
      description: "booking description",
      content: "schedule content"
    },
    {
      id: 2,
      title: "bookgin title",
      description: "booking description",
      content: "schedule content"
    },
    {
      id: 3,
      title: "bookgin title",
      description: "booking description",
      content: "schedule content"
    }
  ],
  flightSchedule: [
    {
      id: 1,
      title: "schedule title",
      description: "schedule description",
      content: "schedule content"
    },
    {
      id: 2,
      title: "schedule title",
      description: "schedule description",
      content: "schedule content"
    },
    {
      id: 3,
      title: "schedule title",
      description: "schedule description",
      content: "schedule content"
    }
  ],
  flightTickets: [
    {
      id: 1,
      title: "tickets title",
      description: "tickets description",
      content: "tickets content"
    }
  ],
  common: {
    flightBooking: [
      {
        title: "common title",
        description: "common description",
        content: "common content",
        pageType: "common page type"
      },
      {
        title: "common title",
        description: "common description",
        content: "common content",
        pageType: "common page type"
      }
    ],
    flightScheduling: [
      {
        title: "common title",
        description: "common description",
        content: "common content",
        pageType: "common page type"
      },
      {
        title: "common title",
        description: "common description",
        content: "common content",
        pageType: "common page type"
      }
    ]
  }
};

// const common = {
//   flightBooking: [
//     {
//       title: "common title",
//       description: "common description",
//       content: "common content",
//       pageType: "common page type"
//     },
//     {
//       title: "common title",
//       description: "common description",
//       content: "common content",
//       pageType: "common page type"
//     }
//   ],
//   flightScheduling: [
//     {
//       title: "common title",
//       description: "common description",
//       content: "common content",
//       pageType: "common page type"
//     },
//     {
//       title: "common title",
//       description: "common description",
//       content: "common content",
//       pageType: "common page type"
//     }
//   ]
// };

class FlightsLandingPage extends Component {
  state = {
    response: {
      flightBooking: [
        {
          id: 1,
          title: "bookgin title",
          description: "booking description",
          content: "schedule content"
        },
        {
          id: 2,
          title: "bookgin title",
          description: "booking description",
          content: "schedule content"
        },
        {
          id: 3,
          title: "bookgin title",
          description: "booking description",
          content: "schedule content"
        }
      ],
      flightSchedule: [
        {
          id: 1,
          title: "schedule title",
          description: "schedule description",
          content: "schedule content"
        },
        {
          id: 2,
          title: "schedule title",
          description: "schedule description",
          content: "schedule content"
        },
        {
          id: 3,
          title: "schedule title",
          description: "schedule description",
          content: "schedule content"
        }
      ],
      flightTickets: [
        {
          id: 1,
          title: "tickets title",
          description: "tickets description",
          content: "tickets content"
        }
      ],
      common: {
        flightBooking: [
          {
            title: "common title",
            description: "common description",
            content: "common content",
            pageType: "common page type"
          },
          {
            title: "common title",
            description: "common description",
            content: "common content",
            pageType: "common page type"
          }
        ],
        flightScheduling: [
          {
            title: "common title",
            description: "common description",
            content: "common content",
            pageType: "common page type"
          },
          {
            title: "common title",
            description: "common description",
            content: "common content",
            pageType: "common page type"
          }
        ]
      }
    }
  };

  // componentWillMount() {
  //   var self = this;
  //   axios({
  //     method: "get",
  //     url: "http://localhost:3000/fetch_details",
  //     config: { headers: { "Content-Type": "multipart/form-data" } }
  //   })
  //     .then(function(response) {
  //       //handle success
  //       console.log(response);
  //       self.setState({ isHomePage: true });
  //     })
  //     .catch(function(response) {
  //       self.setState({ isHomePage: false });
  //     });
  // }

  handleDelete = e => {
    debugger;
  };
  handleAdd = () => {
    window.location.href = "/flights";
  };

  render() {
    return (
      <div>
        <h1>LandingPage</h1>
        <Button variant={"contained"} onClick={this.handleAdd}>
          Add
        </Button>
        <SimpleTable response={response} handleDelete={this.handleDelete} />
      </div>
    );
  }
}

export default FlightsLandingPage;

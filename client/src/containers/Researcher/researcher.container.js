import auth from 'solid-auth-client';
import React, { Component } from "react";
import ResearcherPageContent from "./researcher.component";
import { withWebId } from "@inrupt/solid-react-components";
import data from "@solid/query-ldflex";

// const hasPhotoContext = "http://www.w3.org/2006/vcard/ns#hasPhoto";
// const imgContext = "http://xmlns.com/foaf/0.1/img"

const aggKey = 'https://solid-aggregator.xyz/static/public.pem';

/**
 * Container component for the Researcher Page, containing example of how to fetch data from a POD
 */
class ResearcherComponent extends Component<Props> {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      isLoading: false,
      webId: '',
      newStudy: {},
    };
  }
  componentDidMount() {
    if (this.props.webId) {
      this.getProfileData();
    }

    auth.trackSession(session => {
      if (!session) {
        console.log('The researcher is not logged in');
      } else { 
        console.log(`The researcher is ${session.webId}`);
        this.setState({webId: session.webId});
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.webId && this.props.webId !== prevProps.webId) {
      this.getProfileData();
    }
  }

  getProfileData = async () => {
    this.setState({ isLoading: true });
    const researcher = data[this.props.webId];
    const nameLd = await researcher.name;

    const name = nameLd ? nameLd.value : "";
    this.setState({ name, isLoading: false });
  };

  newStudyHandler = (event) => {
    const newStudy = event.target.value;
    this.setState({newStudy});
  };

  submitHandler = async (event) => {
    if (!this.state.webId) {
      return alert("must be logged in to submit this request");
    }

    const req = JSON.parse(this.state.newStudy);
    if (!req.organization || !req.summary || !req.query || !req.key) {
      return alert("malformed query");
    }

    req.aggKey = aggKey; // attach this aggregator's public key onto the request
    req.webId = this.state.webId;
    console.log(req);

    const submitPath = `https://${window.location.hostname}/api/study`;
    const submissionRes = await fetch(submitPath, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req)
    });

    if (submissionRes.status === 200) {
      alert("succesfully registered study!");
    }

    console.log(submissionRes);
  };

  render() {
    const { name, isLoading } = this.state;
    return (
      <ResearcherPageContent name={name} isLoading={isLoading}
        newStudyHandler={this.newStudyHandler} submitHandler={this.submitHandler}
      />
    );
  }
}

export default withWebId(ResearcherComponent);

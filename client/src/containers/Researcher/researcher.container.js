import auth from 'solid-auth-client';
import React, { Component } from "react";
import ResearcherPageContent from "./researcher.component";
import { withWebId } from "@inrupt/solid-react-components";
import data from "@solid/query-ldflex";

// const hasPhotoContext = "http://www.w3.org/2006/vcard/ns#hasPhoto";
// const imgContext = "http://xmlns.com/foaf/0.1/img"

const aggKey = 'http://localhost:5000/static/public.pem';
const resKey = 'http://localhost:5000/static/researcherpublic.key';

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
      access: {},
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

  queryHandler = (event) => {
    const query = event.target.value;
    this.setState({query});
  };

  submitHandler = async (event) => {
    if (!this.state.webId) {
      return alert("must be logged in to submit this request");
    }

    const host = this.state.webId.split("/").slice(0, 3).join('/');

    const access = this.state.query || "";
    const urls = access.split('\n');
    if (!urls.length) {
      return alert("no urls provided");
    }

    const body = {
      query: "http://xmlns.com/foaf/0.1/age",
      docs: urls,
      aggregatorKey: aggKey,
      researcherKey: resKey
    };
    
    // this request is kind of a hack -- auth client realizes this request needs
    // credentials and takes note of that. i think it remembers the host,
    // so /encrypted will properly authenticate as a side-effect
    const testReq = await auth.fetch(`${host}/private`);
    if (testReq.status !== 200) {
      return alert("Couldn't authenticate on this server");
    }

    const res = await auth.fetch(`${host}/encrypted`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    switch (res.status) {
      case 200:
        console.log("Success!");
        break; // everything good, continue
      case 400:
        return alert("Bad request: " + (await res.text()));
      case 401:
        return alert("Couldn't authenticate this request!");
      case 404:
        return alert("File not found: " + (await res.text()));
      case 500:
        return alert("The server crashed while processing this request");
      default:
        return alert("Error " + res.status);
    }

    const queryResult = await res.blob();
    if (queryResult.size === 0) {
      return alert("No data found for this query");
    }

    const data = new FormData();
    data.append('test', 'doggo');
    data.append('data', queryResult);
    console.log(data);

    const submitPath = `http://${window.location.hostname}:5000/api/submit`;
    const submissionRes = await fetch(submitPath, {
      method: "POST",
      body: data
    });

    console.log(submissionRes);
  };

  render() {
    const { name, isLoading } = this.state;
    return (
      <ResearcherPageContent name={name} isLoading={isLoading}
        queryHandler={this.queryHandler} submitHandler={this.submitHandler}
      />
    );
  }
}

export default withWebId(ResearcherComponent);

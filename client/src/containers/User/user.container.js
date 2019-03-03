import auth from 'solid-auth-client';
import React, { Component } from "react";
import UserPageContent from "./user.component";
import { withWebId } from "@inrupt/solid-react-components";
import data from "@solid/query-ldflex";

// const hasPhotoContext = "http://www.w3.org/2006/vcard/ns#hasPhoto";
// const imgContext = "http://xmlns.com/foaf/0.1/img"

const researchers = [
  {
    id: 0,
    name: 'decentralized information group',
    description: 'we are researching the average age of users',
    query: 'average foaf:age',
  },
  {
    id: 1,
    name: 'some other research group',
    description: 'we are researching the sum age of users',
    query: 'sum foaf:age'
  }
];

/**
 * Container component for the User Page, containing example of how to fetch data from a POD
 */
class UserComponent extends Component<Props> {
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
        console.log('The user is not logged in');
      } else { 
        console.log(`The user is ${session.webId}`);
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
    const user = data[this.props.webId];
    const nameLd = await user.name;

    const name = nameLd ? nameLd.value : "";
    this.setState({ name, isLoading: false });
  };

  accessHandler = (researchId) => {
    return (event) => {
      const newAccess = {...this.state.access};
      newAccess[researchId] = event.target.value;

      this.setState({access: newAccess});
      setTimeout(() => {
        console.log(this.state.access);
      }, 0);
    };
  };

  submitHandler = (researchId) => {
    return async (event) => {
      if (!this.state.webId) {
        return alert("must be logged in to submit this request");
      }

      const host = this.state.webId.split("/").slice(0, 3).join('/');

      const access = this.state.access[researchId] || "";
      const urls = access.split('\n');
      if (!urls.length) {
        return alert("no urls provided");
      }

      const data = {
        query: "http://xmlns.com/foaf/0.1/age",
        docs: urls
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
        body: JSON.stringify(data),
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

      const result = await res.blob();
      if (result.size === 0) {
        return alert("No data found for this query");
      }

      console.log(result);
    }
  };

  render() {
    const { name, isLoading } = this.state;
    return (
      <UserPageContent name={name} isLoading={isLoading} researchers={researchers}
        accessHandler={this.accessHandler} submitHandler={this.submitHandler}
      />
    );
  }
}

export default withWebId(UserComponent);

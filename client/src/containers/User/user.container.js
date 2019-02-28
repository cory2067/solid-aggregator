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
      access: {},
    };
  }
  componentDidMount() {
    if (this.props.webId) {
      this.getProfileData();
    }

    auth.trackSession(session => {
    if (!session)
      console.log('The user is not logged in')
    else
      console.log(`The user is ${session.webId}`)
    })
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
      const access = this.state.access[researchId]
      const urls = access.split('\n');
      if (!urls.length) {
        return alert("no urls provided");
      }

      const data = {
        query: "http://xmlns.com/foaf/0.1/age",
        urls: urls
      };
      
      const res = await auth.fetch("https://cor.localhost:8443/encrypted", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("It completed!");
      console.log(res);
      if (res.status === 401) {
        alert("Couldn't authenticate this request!");
        return;
      } 
      if (res.status !== 200) {
        alert("Could not complete request! Error " + res.status);
        return;
      }

      console.log(await res.blob());

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

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
    return (event) => {
      const access = this.state.access[researchId]
      const urls = access.split('\n');
      if (!urls.length) {
        return alert("no urls provided");
      }

      for (const url of urls) {
        auth.fetch(url).then(console.log);
      }

    };
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

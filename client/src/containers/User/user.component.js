import React from "react";
// import { Image, LogoutButton } from "@inrupt/solid-react-components";
import isLoading from "@hocs/isLoading";
import {
  UserWrapper,
  Card,
  FileInput,
  SubmitButton,
} from "./user.style";

/**
 * User Page UI component, containing the styled components for the User Page
 * Image component will get theimage context and resolve the value to render.
 * @param props
 */
const UserPageContent = props => {
  return (
    <UserWrapper>
      {props.studies.map((r, index) => {
          return (
            <Card className="card" key={index}> 
              <h3> <a href={r.webId}> {r.organization} </a> </h3>
              <p> {r.summary} </p>
              <code> { r.function } </code>
              <br />
              <code> { r.query } </code>
              <br />
              <FileInput 
                onChange={props.accessHandler(r._id)} 
                defaultValue='https://cor.localhost:8443/private/test.ttl'
              />
              <SubmitButton onClick={props.submitHandler(r._id)}>Submit</SubmitButton>
            </Card>
          );
       })}
    </UserWrapper>
  );
};

export default isLoading(UserPageContent);

import React from "react";
// import { Image, LogoutButton } from "@inrupt/solid-react-components";
import isLoading from "@hocs/isLoading";
import {
  ResearcherWrapper,
  Card,
  FileInput,
  SubmitButton,
} from "./researcher.style";

/**
 * Researcher Page UI component, containing the styled components for the Researcher Page
 * Image component will get theimage context and resolve the value to render.
 * @param props
 */
const ResearcherPageContent = props => {
  return (
    <ResearcherWrapper>
      {props.researchers.map((r, index) => {
          return (
            <Card className="card" key={index}> 
              <h3> {r.name} </h3>
              <p> {r.description} </p>
              <code> {r.query} </code>
              <br />
              <FileInput 
                onChange={props.accessHandler(r.id)} 
                defaultValue='https://cor.localhost:8443/private/test.ttl'
              />
              <SubmitButton onClick={props.submitHandler(r.id)}>Submit</SubmitButton>
            </Card>
          );
       })}
    </ResearcherWrapper>
  );
};

export default isLoading(ResearcherPageContent);

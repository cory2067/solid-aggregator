import React from "react";
// import { Image, LogoutButton } from "@inrupt/solid-react-components";
import isLoading from "@hocs/isLoading";
import {
  ResearcherWrapper,
  Card,
  QueryInput,
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
      <Card className="card">
        <h1>Start a New Study</h1>
        <p>Enter a query in json format</p>
        <QueryInput 
          onChange={props.queryHandler} 
        />
        <SubmitButton onClick={props.submitHandler}>Submit</SubmitButton>
      </Card>
    </ResearcherWrapper>
  );
};

export default isLoading(ResearcherPageContent);

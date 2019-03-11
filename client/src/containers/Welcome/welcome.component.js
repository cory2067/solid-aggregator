import React from "react";
import { Image, LogoutButton } from "@inrupt/solid-react-components";
import isLoading from "@hocs/isLoading";
import {
  WelcomeWrapper,
  WelcomeCard,
  WelcomeLogo,
  WelcomeProfile,
  WelcomeDetail
} from "./welcome.style";

/**
 * Welcome Page UI component, containing the styled components for the Welcome Page
 * Image component will get theimage context and resolve the value to render.
 * @param props
 */
const WelcomePageContent = props => {
  return (
    <WelcomeWrapper>
      <WelcomeCard className="card">
        <WelcomeLogo>
          <img src="/img/logo.svg" alt="Inrupt" />
        </WelcomeLogo>
        <WelcomeProfile>
          <h3>
            Welcome, <span>{props.name}</span>
          </h3>
          <div>
            {props.image && (
              <Image
                alt="User"
                src={props.image}
                defaultSrc="/img/icon/empty-profile.svg"
              />
            )}
          </div>
          <p>
            All Done ? <LogoutButton />
          </p>
        </WelcomeProfile>
      </WelcomeCard>
      <WelcomeCard className="card">
        <WelcomeDetail>
          <h3>
            Welcome to the Solid Aggregation Service
          </h3>
          <p>
            Anyone on the Solid network can opt in to participate in a study, by going to the
            "participate" tab.
          </p>
          <p>
            Research groups interested in starting a study can go to the "Researchers" tab.
          </p>
        </WelcomeDetail>
      </WelcomeCard>
    </WelcomeWrapper>
  );
};

export default isLoading(WelcomePageContent);

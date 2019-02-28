import React from "react";
// import { Image, LogoutButton } from "@inrupt/solid-react-components";
import isLoading from "@hocs/isLoading";
import {
  UserWrapper,
} from "./user.style";

/**
 * User Page UI component, containing the styled components for the User Page
 * Image component will get theimage context and resolve the value to render.
 * @param props
 */
const UserPageContent = props => {
  return (
    <UserWrapper>
    </UserWrapper>
  );
};

export default isLoading(UserPageContent);

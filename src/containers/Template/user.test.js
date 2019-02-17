import React from "react";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import User from "./user.component";
import {
  UserWrapper
} from "./user.style";
import "@testSetup";

describe.only("User", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <User providers={[]} />
      </Router>
    );
  });

  test("renders without crashing", () => {
    expect(wrapper).toBeTruthy();
  });

  test("renders with styled components", () => {
    expect(wrapper.find(UserWrapper)).toBeTruthy();
  });
});

import React from "react";
import { mount } from "enzyme";
import { BrowserRouter as Router } from "react-router-dom";
import Researcher from "./researcher.component";
import {
  ResearcherWrapper
} from "./researcher.style";
import "@testSetup";

describe.only("Researcher", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <Router>
        <Researcher providers={[]} />
      </Router>
    );
  });

  test("renders without crashing", () => {
    expect(wrapper).toBeTruthy();
  });

  test("renders with styled components", () => {
    expect(wrapper.find(ResearcherWrapper)).toBeTruthy();
  });
});

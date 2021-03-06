import styled from 'styled-components';
// import { media } from '../../utils';

export const UserWrapper = styled.section`
  width: 100%;
  background-image: url('/img/concentric-hex-pattern_2x.png');
  background-repeat: repeat;
  padding: 50px 0;

  h3 {
    color: #666666;
    span {
      font-weight: bold;
    }
    a {
      font-size: 1.9rem;
    }
  }
`;

export const Card = styled.div`
  background-color: #fff;
  margin: 30px auto;

  //Overriding the style guide card flexbox settings
  max-width: 80% !important;
  // flex-direction: row !important;
  padding: 50px 0 !important; //temporary fix to a style guide bug

  align-items: center;

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const FileInput = styled.textarea`
	max-width: 800px;
	height: 240px;
	border: 3px solid #cccccc;
	padding: 12px;
	resize: none;
`;

export const SubmitButton = styled.button`
	margin: 8px;
	font-size: 1em;
`;

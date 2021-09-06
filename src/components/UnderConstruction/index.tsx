import React from 'react';
import styled from 'styled-components';
import { ReactComponent as Construction } from '../../assets/images/under-construction.svg';

const UnderConstruction: React.FC = () => {
  return (
    <ContentBlock>
      <Construction style={{margin: 'auto auto 0px auto', width: 'auto'}}/>
      <Notes>Under Construction</Notes>
    </ContentBlock>
  );
}

export default UnderConstruction;

const ContentBlock = styled.div`
  background-color: #18232f;
  border-radius: 8px;
  border: solid 1px #23beb9;
  margin-top: 30px;
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  flex-direction:column;
  align-items: flex-start;
  height: 600px;
  width: 570px;
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
  @media (max-height: 600px) {
    height: auto;
  }
`;

const Notes = styled.div`
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
  letter-spacing: normal;
  text-align: center;
  color: white;
  margin: 30px auto auto auto;
`

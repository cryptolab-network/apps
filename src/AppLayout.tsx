import React from 'react';
import styled from 'styled-components';
import Button from './components/Button';
import { ReactComponent as CryptoLabLogo } from './assets/images/main-horizontal-color-logo.svg';

const Header = () => {
  return (
    <HeaderDiv>
      <CryptoLabLogo />
      <CryptoLabLogo />
      <Button
        title="test"
        onClick={() => {
          console.log('test');
        }}
      />
    </HeaderDiv>
  );
};

const AppLayout = () => {
  return (
    <>
      <Header />
      <div>body</div>
    </>
  );
};

export default AppLayout;

AppLayout.prototype = {};

const HeaderDiv = styled.div`
  height: 96px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 30px;
  padding-left: 30px;
`;

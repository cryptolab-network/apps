import { useState, useRef } from 'react';
import { useLayer, Arrow } from 'react-laag';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactComponent as KSMLogo } from '../../assets/images/ksm-logo.svg';
import { ReactComponent as DOTLogo } from '../../assets/images/dot-logo.svg';
import { ReactComponent as DropDownIcon } from '../../assets/images/dropdown.svg';
import { ApiPromise, WsProvider } from '@polkadot/api';

import styled from 'styled-components';
import { toast } from 'react-toastify';
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
  web3ListRpcProviders,
  web3UseRpcProvider,
} from '@polkadot/extension-dapp';
import './index.css';
import { useEffect } from 'react';

const WalletSelect = () => {
  const [isOpen, setOpen] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
  };

  const arrowPropsCustom = {
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  };
  const ulPropsCustom = {
    borderColor: 'blue',
    width: btnRef && btnRef.current && btnRef.current.offsetWidth ? btnRef.current.offsetWidth : 50,
  };

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen,
    onOutsideClick: close,
    onDisappear: close,
    overflowContainer: true,
    auto: true,
    placement: 'bottom-end',
    triggerOffset: 12,
    containerOffset: 16,
    arrowOffset: 16,
  });

  arrowProps.style = { ...arrowProps.style, ...arrowPropsCustom };
  layerProps.style = { ...layerProps.style, ...ulPropsCustom };

  const handleConnect = async () => {
    try {
      const allInjected = await web3Enable('crypto-lab');
      console.log('all injected: ', allInjected);
      const allAccounts = await web3Accounts();
    } catch (error) {
      console.log('error: ', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await web3Enable('crypto-lab');
        const allAccounts = await web3Accounts();
        console.log('allAccounts: ', allAccounts);
      } catch (error) {
        toast.error(`Oops! there is some error: ${error}`, {
          position: toast.POSITION.TOP_CENTER,
        });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const wsProvider = new WsProvider('wss://westend-rpc.polkadot.io');
      const api = await ApiPromise.create({ provider: wsProvider });
      console.log(api.genesisHash.toHex());
      let balance = await api.query.system.account('5CCbH1g9YBqYwTV8g4AK1mrYouQXwJn6ghsgcsg1UKU4fVdo');
      console.log('balance: ', balance.data.free);
    })();
  }, []);

  return (
    <>
      <ButtonLayout ref={btnRef}>
        <Button {...triggerProps} onClick={handleConnect}>
          <Hint>Connect Wallet</Hint>
          {/* <KSMLogo style={{ width: 36, height: 36 }} />

          <NetworkTitle>KSM</NetworkTitle>
          <div style={{ width: 40 }}>
            <DropDownIcon
              style={{
                stroke: 'black',
                transform: isOpen ? 'rotate(90deg)' : 'none',
                transitionDuration: '0.2s',
              }}
            />
          </div> */}
        </Button>
      </ButtonLayout>
      {renderLayer(
        <AnimatePresence>
          {isOpen && (
            <motion.ul {...layerProps}>
              <Arrow
                {...arrowProps}
                angle={55}
                size={6}
                roundness={0}
                borderWidth={0}
                borderColor="#23beb9"
                backgroundColor="#23beb9"
                layerSide="bottom"
              />
              <li className="li first">
                <KSMLogo style={{ width: 36, height: 36 }} />
                <NetworkTitleLight>KSM</NetworkTitleLight>
              </li>
              <li className="li last">
                <DOTLogo style={{ width: 36, height: 36 }} />
                <NetworkTitleLight>DOT</NetworkTitleLight>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default WalletSelect;

const ButtonLayout = styled.div`
  background-color: transparent;
  border: none;
  border-radius: 100px;
  max-height: 43px;
  padding-left: 5px;
  padding-right: 5px;
`;

const Button = styled.button`
  background-color: #dee0e1;
  border: none;
  border-radius: 100px;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 4px;
`;

const Hint = styled.div`
  margin-left: 8px;
  margin-right: 8px;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  color: black;
`;

const NetworkTitleLight = styled.div`
  margin-left: 8px;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  color: white;
  flex-grow: 1;
`;

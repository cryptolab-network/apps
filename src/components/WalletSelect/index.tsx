import { useState, useRef, useEffect } from 'react';
import { useLayer, Arrow } from 'react-laag';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import './index.css';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { connectWallet, selectAccount, WalletStatus, IAccount, accountTransform } from '../../redux';
import Identicon from '@polkadot/react-identicon';

const WalletSelect: React.FC = () => {
  const [isOpen, setOpen] = useState(false);

  const network = useAppSelector(state => state.network.name);
  const status: WalletStatus = useAppSelector(state => state.wallet.status);
  const allAccounts: IAccount[] = useAppSelector(state => state.wallet.allAccounts);

  // filter and transfer account based on network
  const accounts = accountTransform(allAccounts, network);
  let selectedAccount: IAccount | null = useAppSelector(state => state.wallet.selectedAccount);

  const dispatch = useAppDispatch();

  if (!selectedAccount && accounts.length > 1) {
    dispatch(selectAccount(accounts[0]));
  }

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

  useEffect(() => {
    close();
  }, [selectedAccount?.address]);

  useEffect(() => {
    if (status === WalletStatus.CONNECTED && accounts.length > 1) {
      dispatch(selectAccount(accounts[0]));
    }
  }, [network])

  const handleConnect = async () => {
    try {
      if (status === WalletStatus.IDLE) {
        dispatch(connectWallet());
      } else {
        setOpen(!isOpen);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };


  return (
    <>
      <ButtonLayout ref={btnRef}>
        <Button {...triggerProps} onClick={handleConnect}>
          {status === WalletStatus.IDLE && <Hint>Connect Wallet</Hint>}
          {status === WalletStatus.CONNECTED && selectedAccount &&
            <div>
              <Identicon value={selectedAccount.address} size={32} theme={'polkadot'} />
              <Hint>{selectedAccount.name}</Hint>
            </div>
          }
          {status === WalletStatus.CONNECTED && !selectedAccount && <Hint>Select Address</Hint>}
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
              {accounts.map((account, index) => {
                if (index === 0) {
                  return <div key={index} >
                    <li className="li first" onClick={() => dispatch(selectAccount(account))}>
                      <Identicon value={account.address} size={16} theme={'polkadot'} />
                      <NetworkTitleLight>{account.name}</NetworkTitleLight>
                    </li>
                  </div>
                } else if (index === accounts.length - 1) {
                  return <div key={index} >
                    <li className="li last" onClick={() => dispatch(selectAccount(account))}>
                      <Identicon value={account.address} size={16} theme={'polkadot'} />
                      <NetworkTitleLight>{account.name}</NetworkTitleLight>
                    </li>
                  </div>
                } else {
                  return <div key={index} >
                    <li className="li" onClick={() => dispatch(selectAccount(account))}>
                      <Identicon value={account.address} size={16} theme={'polkadot'} />
                      <NetworkTitleLight>{account.name}</NetworkTitleLight>
                    </li>
                  </div>
                }
              })}
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

import { useContext, useState, useRef, useCallback, useMemo } from 'react';
import { useLayer, Arrow } from 'react-laag';
import { motion, AnimatePresence } from 'framer-motion';
import { DataContext } from '../Data';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import Identicon from '@polkadot/react-identicon';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { isEmpty } from '../../../../utils/helper';
import { ReactComponent as DropDownIcon } from '../../../../assets/images/dropdown.svg';
import { useTranslation } from 'react-i18next';

const Wallet = () => {
  const { t } = useTranslation();
  const { hasWeb3Injected, isWeb3AccessDenied, accounts, selectedAccount, selectAccount, isLoading } =
    useContext(DataContext);
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

  const notifyWarn = useCallback((msg: string) => {
    toast.warn(`${msg}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
  }, []);

  const installWallet = () => {
    window.open('https://polkadot.js.org/extension/', '_blank', 'noopener noreferrer');
  };

  const pleaseAllow = () => {
    // TODO: teach user how to allow
  };

  const handleClick = useCallback(() => {
    if (!hasWeb3Injected) {
      installWallet();
    } else if (isWeb3AccessDenied) {
      pleaseAllow();
    } else if (isLoading) {
      // do nothing
    } else if (accounts.length > 0) {
      setOpen(!isOpen);
    } else {
    }
  }, [hasWeb3Injected, isWeb3AccessDenied, isLoading, isOpen, accounts]);

  const css = `
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    height: 100%;
  `;

  const accountListDOM = useMemo(() => {
    let dom: Array<any> = [];
    if (accounts.length === 0) {
      dom.push(
        <li className="li" key={'wallet-select-non'}>
          (No available account)
          {/* <Identicon value={account.address} size={16} theme={'polkadot'} />
            <NetworkTitleLight>{account.name}</NetworkTitleLight> */}
        </li>
      );
    } else {
      accounts.forEach((account, idx) => {
        dom.push(
          <li
            key={`wallet-select-${idx}`}
            className="li"
            onClick={() => {
              selectAccount(account);
              close();
            }}
          >
            <Identicon value={account.address} size={32} theme={'polkadot'} />
            <WalletLayout>
              <div>{account.name}</div>
              {/* <div>
                Balance : <BalanceNumber>{_formatBalance(account.balances.totalBalance)}</BalanceNumber>
              </div> */}
            </WalletLayout>
          </li>
        );
      });
    }
    return <div className="w-list">{dom}</div>;
  }, [accounts, selectAccount]);

  const walletDisplayDOM = useMemo(() => {
    if (!hasWeb3Injected) {
      return <Hint>Install Wallet</Hint>;
    } else if (isWeb3AccessDenied) {
      return <Hint>Please Allow</Hint>;
    } else if (isLoading) {
      return (
        <div
          style={{
            width: '100%',
            display: 'block',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
          }}
        >
          <ScaleLoader color="#23beb9" css={css} height={20} />
        </div>
      );
    } else if (selectedAccount && !isEmpty(selectedAccount)) {
      return (
        <>
          <Identicon value={selectedAccount.address} size={32} theme={'polkadot'} />
          <WalletLayout>
            <div>{selectedAccount.name}</div>
            {/* <div> */}
            {/* <span style={{ color: '#75818d' }}>Balance : </span> */}
            {/* <BalanceTitle>{_formatBalance(selectedAccount?.balances?.totalBalance)}</BalanceTitle> */}
            {/* <BalanceNumber>{selectedAccount.balance}</BalanceNumber> */}
            {/* <BalanceNumber>123</BalanceNumber> */}
            {/* </div> */}
          </WalletLayout>
          <div style={{ width: 40 }}>
            <DropDownIcon
              style={{
                stroke: 'black',
                transform: isOpen ? 'rotate(90deg)' : 'none',
                transitionDuration: '0.2s',
              }}
            />
          </div>
        </>
      );
    } else if (selectedAccount && isEmpty(selectedAccount)) {
      notifyWarn(t('benchmark.staking.warnings.noAccount'));
      return <Hint>No Account</Hint>;
    } else {
    }
  }, [hasWeb3Injected, isWeb3AccessDenied, isLoading, selectedAccount, css, isOpen, notifyWarn, t]);

  return (
    <>
      <ButtonLayout ref={btnRef}>
        <Button {...triggerProps} onClick={handleClick}>
          {walletDisplayDOM}
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
              {accountListDOM}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default Wallet;

const ButtonLayout = styled.div`
  background-color: transparent;
  border: none;
  border-radius: 100px;
  height: 44px;
  padding-left: 5px;
  padding-right: 5px;
`;

const Button = styled.button`
  min-width: 238px;
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
  width: 100%;
`;

const WalletLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  flex-grow: 1;
  margin-left: 5px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
`;

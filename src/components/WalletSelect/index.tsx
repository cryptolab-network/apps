import { useState, useRef, useMemo, useCallback, useContext } from 'react';
import { useLayer, Arrow } from 'react-laag';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import './index.css';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { ReactComponent as DropDownIcon } from '../../assets/images/dropdown.svg';
import { useAppSelector, useAppDispatch } from '../../hooks';
import { connectWallet, IAccount, selectAccount, WalletStatus } from '../../redux';
import Identicon from '@polkadot/react-identicon';
import { ApiPromise } from '@polkadot/api';
import { ApiContext } from '../Api';

const balance = async (api: ApiPromise, account: IAccount) => {
  const result = await api.derive.balances.account(account.address);
  return result.freeBalance.toHuman();
}

interface IWallet {
  accountName: string;
  address: string;
  balance: string;
}
interface IWalletSelect {
  onChange: Function;
  walletList: Array<IWallet>;
  status: number;
  selectedWallet?: IWallet;
}
const WalletSelect: React.FC<IWalletSelect> = ({ onChange, walletList, status, selectedWallet }) => {
  const [isOpen, setOpen] = useState(false);
  const [amount, setAmount] = useState('');

  const network = useAppSelector((state) => state.network.name);
  const { filteredAccounts, selectedAccount } = useAppSelector((state) => state.wallet);

  const api = useContext(ApiContext);
  if (selectedAccount && !!api) {
    balance(api, selectedAccount).then((value) => {
      setAmount(value);
    }).catch(console.log);
  }

  const dispatch = useAppDispatch();

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

  // useEffect(() => {
  //   close();
  // }, [selectedAccount?.address]);

  // useEffect(() => {
  //   console.log('useEffect');
  //   if (status === WalletStatus.CONNECTED) {
  //     dispatch(connectWallet(network));
  //   }
  // }, [dispatch, network, status]);

  // const handleClick = async () => {
  //   console.log('handleClick');
  //   try {
  //     if (status === WalletStatus.IDLE) {
  //       dispatch(connectWallet(network));
  //     } else {
  //       setOpen(!isOpen);
  //     }
  //   } catch (error) {
  //     console.log('error: ', error);
  //   }
  // };

  const handleClick = useCallback(() => {
    if (status === WalletStatus.CONNECTED) {
      setOpen(!isOpen);
    }
    onChange(selectedWallet);
  }, [isOpen, onChange, selectedWallet, status]);

  const css = `
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
    height: 100%;
  `;

  const walletListDOM = useMemo(() => {
    let dom: Array<any> = [];
    if (walletList.length === 0) {
      console.log('no length');
      dom.push(
        <li className="li">
          (No available wallet)
          {/* <Identicon value={account.address} size={16} theme={'polkadot'} />
            <NetworkTitleLight>{account.name}</NetworkTitleLight> */}
        </li>
      );
    } else {
      walletList.forEach((wallet, idx) => {
        dom.push(
          <li
            className="li"
            onClick={() => {
              console.log('wallet in li: ', wallet);
              onChange(wallet);
              close();
            }}
          >
            <Identicon value={wallet.address} size={32} theme={'polkadot'} />
            <WalletLayout>
              <div>{wallet.accountName}</div>
              <div>
                Balance : <BalanceNumber>{wallet.balance}</BalanceNumber>
              </div>
            </WalletLayout>
          </li>
        );
      });
    }
    return <div className="w-list">{dom}</div>;
  }, [onChange, walletList]);

  const walletDisplayDOM = useMemo(() => {
    switch (status) {
      case WalletStatus.IDLE:
        return <Hint>Connect Wallet</Hint>;
      case WalletStatus.LOADING:
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
      case WalletStatus.NO_EXTENSION:
        return <Hint>Install Wallet</Hint>;
      case WalletStatus.DENIED:
        return <Hint>Please Allow</Hint>;
      case WalletStatus.CONNECTED:
        console.log('current wallet info: ', selectedWallet);
        if (selectedWallet) {
          return (
            <>
              <Identicon value={selectedWallet.address} size={32} theme={'polkadot'} />
              <WalletLayout>
                <div>{selectedWallet.accountName}</div>
                <div>
                  <BalanceTitle>Balance : </BalanceTitle>
                  <BalanceNumber>{selectedWallet.balance}</BalanceNumber>
                </div>
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
        } else {
          return <Hint>Select Address</Hint>;
        }
      default:
        break;
    }
  }, [status, css, selectedWallet, isOpen]);

  return (
    <>
      <ButtonLayout ref={btnRef}>
        <Button {...triggerProps} onClick={handleClick}>
          {walletDisplayDOM}
          {/* {(status === WalletStatus.IDLE || status === WalletStatus.LOADING) && <Hint>Connect Wallet</Hint>}
          {status === WalletStatus.NO_EXTENSION && (
            <Hint>
              <a href="https://polkadot.js.org/extension/" target="_blank" rel="noreferrer">
                Install Wallet
              </a>
            </Hint>
          )}
          {status === WalletStatus.DENIED && <Hint>Please Allow</Hint>}
          {status === WalletStatus.CONNECTED && selectedAccount && (
            <div>
              <Identicon value={selectedAccount.address} size={32} theme={'polkadot'} />
              <div className='balance'>
                <Hint>{selectedAccount.name}</Hint>
                <Balance>{amount}</Balance>
              </div>
            </div>
          )}
          {status === WalletStatus.CONNECTED && !selectedAccount && <Hint>Select Address</Hint>} */}
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
              {walletListDOM}
              {/* {filteredAccounts.map((account, index) => {
                if (index === 0) {
                  return (
                    <div key={index}>
                      <li className="li first" onClick={() => dispatch(selectAccount(account))}>
                        <Identicon value={account.address} size={16} theme={'polkadot'} />
                        <NetworkTitleLight>{account.name}</NetworkTitleLight>
                      </li>
                    </div>
                  );
                } else if (index === filteredAccounts.length - 1) {
                  return (
                    <div key={index}>
                      <li className="li last" onClick={() => dispatch(selectAccount(account))}>
                        <Identicon value={account.address} size={16} theme={'polkadot'} />
                        <NetworkTitleLight>{account.name}</NetworkTitleLight>
                      </li>
                    </div>
                  );
                } else {
                  return (
                    <div key={index}>
                      <li className="li" onClick={() => dispatch(selectAccount(account))}>
                        <Identicon value={account.address} size={16} theme={'polkadot'} />
                        <NetworkTitleLight>{account.name}</NetworkTitleLight>
                      </li>
                    </div>
                  );
                }
              })} */}
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

const BalanceTitle = styled.span`
  color: #75818d;
`;

const BalanceNumber = styled.span`
  color: #23beb9;
`;

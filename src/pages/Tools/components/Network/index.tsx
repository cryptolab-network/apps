import { useState, useRef, useMemo, useEffect, useContext } from 'react';
import { useLayer, Arrow } from 'react-laag';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactComponent as KSMLogo } from '../../../../assets/images/ksm-logo.svg';
import { ReactComponent as DOTLogo } from '../../../../assets/images/dot-logo.svg';
import { ReactComponent as DropDownIcon } from '../../../../assets/images/dropdown.svg';
import './index.css';
import styled from 'styled-components';
import { DataContext } from '../Data';
import useWindowDimensions from '../../../../hooks/useWindowDimensions';
import { breakWidth } from '../../../../utils/constants/layout';

const Network: React.FC = () => {
  // context
  const { network, changeNetwork } = useContext(DataContext);
  // hooks
  const { width } = useWindowDimensions();
  // state
  const [isOpen, setOpen] = useState(false);
  //ref
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
    width: 178,
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
  }, [network]);

  const DisplayNetworkPanelDOM = useMemo(() => {
    let dom = {};
    switch (network) {
      case 'Kusama':
        dom =
          width > breakWidth.mobile && width <= breakWidth.pad ? (
            <>
              <KSMLogo style={{ width: 36, height: 36 }} />
            </>
          ) : (
            <>
              <KSMLogo style={{ width: 36, height: 36 }} />
              <NetworkTitle>Kusama</NetworkTitle>
            </>
          );
        break;
      case 'Polkadot':
        dom =
          width > breakWidth.mobile && width <= breakWidth.pad ? (
            <>
              <DOTLogo style={{ width: 36, height: 36 }} />
            </>
          ) : (
            <>
              <DOTLogo style={{ width: 36, height: 36 }} />
              <NetworkTitle>Polkadot</NetworkTitle>
            </>
          );
        break;
      default:
        break;
    }
    return dom;
  }, [network, width]);

  return (
    <>
      <ButtonLayout ref={btnRef}>
        <Button {...triggerProps} onClick={() => setOpen(!isOpen)}>
          {DisplayNetworkPanelDOM}
          {width > breakWidth.pad ? (
            <div style={{ width: 40 }}>
              <DropDownIcon
                style={{
                  stroke: 'black',
                  transform: isOpen ? 'rotate(90deg)' : 'none',
                  transitionDuration: '0.2s',
                }}
              />
            </div>
          ) : null}
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
              <li
                className="li first"
                onClick={() => {
                  changeNetwork('Kusama');
                }}
              >
                <KSMLogo style={{ width: 36, height: 36 }} />
                <NetworkTitleLight>Kusama</NetworkTitleLight>
              </li>
              <li
                className="li last"
                onClick={() => {
                  changeNetwork('Polkadot');
                }}
              >
                <DOTLogo style={{ width: 36, height: 36 }} />
                <NetworkTitleLight>Polkadot</NetworkTitleLight>
              </li>
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default Network;

const ButtonLayout = styled.div`
  background-color: transparent;
  border: none;
  border-radius: 100px;
  max-height: 44px;
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

const NetworkTitle = styled.div`
  margin-left: 8px;
  margin-right: 8px;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  color: black;
  flex-grow: 1;
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

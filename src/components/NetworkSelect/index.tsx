import { useState, useRef, useMemo, useEffect, useContext } from 'react';
import { useLayer, Arrow } from 'react-laag';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactComponent as KSMLogo } from '../../assets/images/ksm-logo.svg';
import { ReactComponent as DOTLogo } from '../../assets/images/dot-logo.svg';
import { ReactComponent as WNDLogo } from '../../assets/images/wnd-logo.svg';
import { ReactComponent as DropDownIcon } from '../../assets/images/dropdown.svg';
import './index.css';
import styled from 'styled-components';
import { ApiContext } from '../Api';
import { NetworkConfig } from '../../utils/constants/Network';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import { breakWidth } from '../../utils/constants/layout';

const getLogoDiv = (network) => {
  switch (network) {
    case 'Kusama':
      return <KSMLogo style={{ width: 36, height: 36 }} />;
    case 'Polkadot':
      return <DOTLogo style={{ width: 36, height: 36 }} />;
    case 'Westend':
      return <WNDLogo style={{ width: 36, height: 36 }} />;
  }
};

const NetworkSelect: React.FC = () => {
  // context
  const { network, changeNetwork } = useContext(ApiContext);
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
    if (width > breakWidth.pad) {
      return (
        <>
          {getLogoDiv(network)}
          <NetworkTitle>{network}</NetworkTitle>
        </>
      );
    } else if (width > breakWidth.mobile && width <= breakWidth.pad) {
      return <>{getLogoDiv(network)}</>;
    } else if (width <= breakWidth.mobile) {
      return null;
    }
  }, [network, width]);

  const DisplayDropDownItem = useMemo(() => {
    const list = Object.keys(NetworkConfig).map((key, index, array) => {
      let classname = 'li';
      if (index === 0) classname = 'li first';
      if (index === array.length - 1) classname = 'li last';

      return (
        <li
          key={key}
          className={classname}
          onClick={() => {
            changeNetwork(NetworkConfig[key].name);
          }}
        >
          {getLogoDiv(NetworkConfig[key].name)}
          <NetworkTitleLight>{NetworkConfig[key].name}</NetworkTitleLight>
        </li>
      );
    });
    return list;
  }, [changeNetwork]);

  return (
    <>
      <ButtonLayout ref={btnRef}>
        {width >= breakWidth.mobile ? (
          <Button {...triggerProps} onClick={() => setOpen(!isOpen)}>
            <>
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
            </>
          </Button>
        ) : null}
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
              {DisplayDropDownItem}
            </motion.ul>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default NetworkSelect;

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

import { useLayer, Arrow } from 'react-laag';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';
import styled from 'styled-components';

const Tooltip = ({ content, visible, tooltipToggle, children }) => {
  const close = () => {
    tooltipToggle(false);
  };

  const arrowPropsCustom = {
    borderWidth: 0,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  };
  const ulPropsCustom = {
    borderColor: 'blue',
  };

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen: visible,
    onOutsideClick: close,
    onDisappear: close,
    overflowContainer: true,
    auto: true,
    placement: 'bottom-center',
    triggerOffset: 12,
    containerOffset: 16,
    arrowOffset: 16,
  });

  arrowProps.style = { ...arrowProps.style, ...arrowPropsCustom };
  layerProps.style = { ...layerProps.style, ...ulPropsCustom };

  return (
    <>
      <div {...triggerProps} style={{ cursor: 'pointer' }} onClick={() => tooltipToggle(!visible)}>
        {children}
      </div>

      {renderLayer(
        <AnimatePresence>
          {visible && (
            <motion.div {...layerProps}>
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
              <ContentLayout>{content}</ContentLayout>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </>
  );
};

export default Tooltip;

const ContentLayout = styled.div`
  border: solid 1px #23beb9;
  background-color: #10151d;
  padding: 23.5px 18px 25px 10.6px;
  border-radius: 6px;
  min-width: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

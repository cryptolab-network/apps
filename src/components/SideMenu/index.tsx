import Modal from 'react-modal';
import styled from 'styled-components';

interface ISideMenu {
  isOpen: boolean;
  handleClose: Function;
}

const SideMenu: React.FC<ISideMenu> = ({ isOpen, handleClose, children }) => {
  const customStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.74)',
      zIndex: 1100,
    },
    content: {
      top: '0',
      left: '50%',
      right: '0',
      bottom: '0',
      // marginRight: '-50%',
      // transform: 'translate(-50%, -50%)',
      minWidth: '190',
      // minHeight: 'calc(100vh - 493)>0' ? '493px' : '70vh',
      maxWidth: '90vw',
      maxHeight: '100vh',
      OverflowY: 'scroll',
      border: 'solid 0px #23beb9',
      borderRadius: 0,
      backgroundColor: '#18232f',
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      style={customStyles}
      contentLabel=""
      ariaHideApp={false}
    >
      <SideMenuLayout>{children}</SideMenuLayout>
    </Modal>
  );
};

export default SideMenu;

const SideMenuLayout = styled.div``;

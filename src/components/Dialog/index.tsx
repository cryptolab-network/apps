import { useMemo } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';

interface IDialogWithImage {
  image?: any;
  title?: string;
  isOpen: boolean;
  handleDialogClose: Function;
  padding?: string;
}

const Dialog: React.FC<IDialogWithImage> = ({
  image,
  title,
  isOpen,
  handleDialogClose,
  padding,
  children,
}) => {
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
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      minWidth: 'calc(100vw - 652)>0' ? '652px' : '90vw',
      minHeight: 'calc(100vh - 493)>0' ? '493px' : '70vh',
      maxWidth: '90vw',
      maxHeight: '90vh',
      OverflowY: 'scroll',
      border: 'solid 1px #23beb9',
      borderRadius: 8,
      backgroundColor: '#18232f',
      opacity: 0.89,
    },
  };

  const imageDOM = useMemo(() => {
    return image ? <ImageContainer>{image}</ImageContainer> : null;
  }, [image]);

  const titleDOM = useMemo(() => {
    return title ? <TitleContainer>{title}</TitleContainer> : null;
  }, [title]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleDialogClose}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <DialogMainLayout padding={padding}>
        {imageDOM}
        {titleDOM}
        {children}
      </DialogMainLayout>
    </Modal>
  );
};

export default Dialog;

interface IDialogMainLayout {
  padding: string | undefined;
}

const DialogMainLayout = styled.div<IDialogMainLayout>`
  padding: ${(props) => (props.padding ? props.padding : '68px 16px 53px 16px')};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TitleContainer = styled.div`
  margin-top: 22.7px;
  margin-bottom: 45px;
  font-family: Montserrat;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  letter-spacing: normal;
  text-align: center;
  color: white;
`;

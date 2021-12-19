import { useMemo } from 'react';
import Modal from 'react-modal';
import styled from 'styled-components';
import keys from '../../config/keys';
import './index.css';

interface IDialogWithImage {
  image?: any;
  title?: string;
  titleLinkable?: boolean;
  isOpen: boolean;
  handleDialogClose: Function;
  padding?: string;
}

const Dialog: React.FC<IDialogWithImage> = ({
  image,
  title,
  titleLinkable = false,
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
      minWidth: 'calc(100vw - 652px) > 0px' ? '652px' : '90vw',
      minHeight: 'calc(100vh - 493)>0' ? '493px' : '70vh',
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflowY: 'scroll',
      overflowX: 'hidden',
      border: 'solid 1px #23beb9',
      borderRadius: 8,
      backgroundColor: '#18232f',
    },
  };

  const imageDOM = useMemo(() => {
    return image ? <ImageContainer>{image}</ImageContainer> : null;
  }, [image]);

  const titleDOM = useMemo(() => {
    if (title) {
      if (titleLinkable) {
        return (
          <TitleContainer>
            <a
              href={keys.tgBotUrl}
              style={{ textDecoration: 'none', color: 'white' }}
              target="_blank"
              rel="noreferrer noopener"
            >
              {title}
            </a>
          </TitleContainer>
        );
      }
      return <TitleContainer>{title}</TitleContainer>;
    }

    return null;
  }, [title, titleLinkable]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleDialogClose}
      // style={customStyles}
      className="Modal"
      overlayClassName="Overlay"
      contentLabel=""
      ariaHideApp={false}
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
  max-width: calc(100vw - 32px);
  box-sizing: border-box;
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

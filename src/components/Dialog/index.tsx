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
  max-width: calc(100% - 32px);
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

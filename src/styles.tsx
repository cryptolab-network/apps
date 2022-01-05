import styled from 'styled-components';

export const HeaderDiv = styled.div`
  height: 96px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 30px;
  padding-left: 30px;
  background-color: transparent;
`;

export const RouteContent = styled.div`
  display: flex;
  // height: 100%;
  min-height: calc(100vh - 344px - 64px - 96px);
  overflow-y: visible;
  @media (max-width: 768px) {
    min-height: calc(100vh - 256px - 64px - 96px);
  }
`;

export const HeaderLeftDiv = styled.div`
  flex: 2;
  display: flex;
  justify-content: flex-start;
`;

export const HeaderMidDiv = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
  ul li {
    display: inline;
  }
`;

export const HeaderRightDiv = styled.div`
  flex: 2;
  display: flex;
  justify-content: flex-end;
`;

export const StarAnimation = styled.div`
  position: absolute;
  z-index: -100;
  overflow-y: hidden;
`;

export const GradientLight = styled.div`
  width: 100%;
  position: absolute;
  z-index: 100;
  background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
`;

export const TableDiv = styled.div`
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  height: 224px;
  margin: auto;
  margin-top: 80px;
  padding: 20px 15% 20px 15%;
  width: auto;
  width: 70%;
  @media (max-width: 768px) {
    padding: 0px;
  }
  @media (max-width: 360px) {
    width: 90%;
  }
`;

export const ColumnDiv = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  align-items: left;
  // border: 1px solid green;
`;

export const ThDiv = styled.div`
  display: flex;
  height: 3em;
  text-align: center;
  color: white;
  font-family: Montserrat;
  font-size: 16px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  // border: 1px solid red;
`;

interface Td {
  justify_content?: string;
  align_items?: string;
}

export const TdDiv = styled.div<Td>`
  display: inline-flex;
  height: 3em;
  justify-content: ${(props) => (props.justify_content ? props.justify_content : 'left')};
  align-items: ${(props) => (props.align_items ? props.align_items : 'center')};
  color: white;
  font-family: Montserrat;
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.29;
  letter-spacing: normal;
  // border: 1px solid red;
`;

export const DotDiv = styled.div`
  width: 4px;
  height: 4px;
  margin: 7px;
  background-color: #23beb9;
`;

export const LinkA = styled.a`
  color: white;
  text-decoration: none;
  :hover {
    color: #23beb9;
  }
`;

export const DialogA = styled.span`
  color: white;
  text-decoration: none;
  cursor: pointer;
  :hover {
    color: #23beb9;
  }
`;

export const Input = styled.input`
  width: 100%;
  height: 70%;
  margin: 0;
  padding: 0 0 0 12px;
  opacity: 1;
  border-radius: 4px 0px 0px 4px;
  border: solid 1px #1faaa6;
  background-color: #141b26;
  color: white;
`;

export const SubmitButton = styled.button`
  min-width: fit-content;
  height: 75%;
  margin: 0;
  border: 0;
  padding: 7px 15px 7.6px 12.6px;
  opacity: 1;
  background-color: #1faaa6;
  border-radius: 0px 4px 4px 0px;
  color: white;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.23;
`;
export const CopyRightDiv = styled.div`
  width: 100%;
  margin: 0px;
  padding: 25px 0px 25px;
  background-color: #0d1119;
  // position: fixed;
  // bottom: 0px;
  // z-index: 99;
`;

export const CopyRightMobilleDiv = styled.div`
  width: 100%;
  margin: 0px;
  padding: 25px 0px 25px;
  background-color: #0d1119;
  // position: fixed;
  // bottom: 0px;
  // z-index: 99;
`;

export const CopyRightTitleDiv = styled.div`
  height: 16px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  color: white;
  text-align: center;
`;

export const SocialMediaWrapper = styled.div`
  margin-right: 15px;
`;

export const DialogMainContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  font-family: Montserrat;
  font-size: 20px;
  font-weight: bold;
  text-align: left;
  color: white;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

interface IDialogListContainer {
  gap?: boolean;
}

export const DialogListContainer = styled.span<IDialogListContainer>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 6px 50px 6px 50px;
  border-right: ${(props) => (props.gap ? '1px solid rgba(255, 255, 255, 0.2)' : 'none')};
  @media (max-width: 768px) {
    box-sizing: border-box;
    border-right: none;
    border-bottom: ${(props) => (props.gap ? '1px solid rgba(255, 255, 255, 0.2)' : 'none')};
    width: calc(100% - 16px);
    padding: 16px 8px 16px 8px;
  }
`;

export const Validator = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: 6px 0px 6px 0px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;

  text-align: left;
  color: #23beb9;
`;

export const LiStyle = styled.li`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: #23beb9;
  margin-top: 3px;
  margin-bottom: 3px;
`;

export const AboutUsFontStyle = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: white;
`;

export const AboutUsGoalFontStyle = styled.li`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  color: #1faaa6;
  margin-top: 6px;
  margin-bottom: 6px;
`;

export const PromoteDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const PromoteContainer = styled.div`
  width: 320px;
  @media (max-width: 360px) {
    width: 299px;
  }
`;

export const MobileHeaderTitle = styled.div`
  font-family: Montserrat;
  font-size: 16px;
  font-weight: bold;
  color: #1ea9a5;
`;

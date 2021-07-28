import ScaleLoader from 'react-spinners/ScaleLoader';

const css = `
display: flex;
justify-content: center;
align-items: center;
margin: auto;
height: 100%;
`;

const CustomScaleLoader = ({ height = 20 }) => {
  return <ScaleLoader color="#23beb9" css={css} height={height} />;
};

export default CustomScaleLoader;

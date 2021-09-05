import { Grid } from '@material-ui/core';
import styled from 'styled-components';
import GraphicalGuide from './components/GraphicalGuide';
import TextGuide from './components/TextGuide';

const Guide = () => {
  return (
    <GuideLayout>
      <Grid container spacing={6}>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <GraphicalGuide></GraphicalGuide>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={6}>
          <TextGuide />
        </Grid>
      </Grid>
    </GuideLayout>
  );
};

export default Guide;

const GuideLayout = styled.div`
  width: 80vw;
  height: 80%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 150px 10vw 0 10vw;
`;


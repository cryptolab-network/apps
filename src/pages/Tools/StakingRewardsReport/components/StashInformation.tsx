import { useEffect, useState } from "react";
import styled from "styled-components";
import Account from "../../../../components/Account";

const StashInformation = ({ stashId, stashData }) => {
  const [totalRewards, setTotalRewards] = useState(0);
  useEffect(() => {
    console.log(stashData);
    if (stashData.eraRewards !== undefined && stashData.eraRewards !== null) {
      const totalRewards = stashData.eraRewards.reduce((acc, r) => {
        acc += r.amount;
        return acc;
      }, 0.0);
      setTotalRewards(totalRewards);
    }
  }, [stashData, stashData.eraRewards]);
  return (
    <div>
      <Title>Stash Information</Title>
      <HorizontalBar />
      <InformationItem>
        <InformationTitle>
          Stash ID
        </InformationTitle>
        <Account
          address={stashId}
          display={stashId}
        />
      </InformationItem>
      <HorizontalBar />
      <InformationItem>
        <InformationTitle>
          Total Rewards
        </InformationTitle>
          {totalRewards} KSM
      </InformationItem>
    </div>
  );
};

export default StashInformation;

const Title = styled.div`
  width: 123px;
  height: 16px;
  margin: 0 49px 11.7px 16px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  text-align: left;
  color: white;
  opacity: 1;
`;

const HorizontalBar = styled.div`
  width: 96%;
  height: 0;
  margin: 0 18.7px 0 16px;
  border: solid 1px #404952;
`;

const InformationItem = styled.div`
  height: 16px;
  margin: 28.9px 0 28.9px 16px;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  text-align: left;
  color: white;
  opacity: 1;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  display: flex;
`;

const InformationTitle = styled.div`
  height: 16px;
  margin: 0 116px 0 0;
`;
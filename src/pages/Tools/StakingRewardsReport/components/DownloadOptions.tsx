import styled from "styled-components";
import { apiGetStashRewardsCSV, apiGetStashRewardsJSON } from "../../../../apis/StashRewards";

const DownloadOptions = ({ stashId }) => {
  const downloadCSV = async () => {
    const response = await apiGetStashRewardsCSV({
      params: `/${stashId}`,
    });
    const blob = new Blob([response], { type: 'application/csv' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = stashId + '.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  };

  const downloadJSON = async () => {
    const response = await apiGetStashRewardsJSON({
      params: `/${stashId}`,
    });
    const blob = new Blob([JSON.stringify(response)], { type: 'application/json' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = stashId + '.json'
    link.click()
    URL.revokeObjectURL(link.href)
  };

  return (
    <DownloadOptionLayout>
      <DownloadTitle>Download Era Rewards</DownloadTitle>
      <HorizontalBar />
      <DownloadOption onClick={downloadCSV}>Staking Rewards Collector CSV</DownloadOption>
      <DownloadOption onClick={downloadJSON}>Staking Rewards Collector JSON</DownloadOption>
    </DownloadOptionLayout>
  );
};

export default DownloadOptions;

const DownloadOptionLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const DownloadTitle = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  text-align: left;
  color: white;
`;

const HorizontalBar = styled.div`
  width: 100%;
  height: 0;
  margin: 8px 18.7px 18px 0;
  border: solid 1px #404952;
`;

const DownloadOption = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  letter-spacing: normal;
  text-align: left;
  color: white;
  cursor: pointer;
  :hover {
    color: #23beb9;
  }
  margin: 0 0 18px 0;
`;

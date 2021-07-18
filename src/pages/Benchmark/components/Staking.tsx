import { useEffect, useState, useMemo, useCallback } from 'react';
import CardHeader from '../../../components/Card/CardHeader';
import Input from '../../../components/Input';
import DropdownCommon from '../../../components/Dropdown/Common';
import Node from '../../../components/Node';
import Warning from '../../../components/Hint/Warn';
import TimeCircle from '../../../components/Time/Circle';
import TitleInput from '../../../components/Input/TitleInput';
import TitleSwitch from '../../../components/Switch/TitleSwitch';
import Table from '../../../components/Table';
import Account from '../../../components/Account';
import { ReactComponent as BeakerSmall } from '../../../assets/images/beaker-small.svg';
import { ReactComponent as KSMLogo } from '../../../assets/images/ksm-logo.svg';
import { ReactComponent as OptionIcon } from '../../../assets/images/option-icon.svg';
import { ReactComponent as GreenArrow } from '../../../assets/images/green-arrow.svg';
import { ReactComponent as HandTrue } from '../../../assets/images/hand-up-true.svg';
import { ReactComponent as HandFalse } from '../../../assets/images/hand-up-false.svg';
import { ReactComponent as CheckTrue } from '../../../assets/images/check-true.svg';
import { ReactComponent as CheckFalse } from '../../../assets/images/check-false.svg';
import styled from 'styled-components';
import _ from 'lodash';
import Button from '../../../components/Button';
import Tooltip from '../../../components/Tooltip';
import Switch from '../../../components/Switch';

const StakingHeader = ({ advancedOption, optionToggle, onChange }) => {
  const advancedDOM = useMemo(() => {
    return (
      <AdvancedOptionLayout>
        <AdvancedOption>
          <span style={{ color: advancedOption.advanced ? '#23beb9' : '#fff' }}>Advanced</span>
          <div style={{ marginLeft: 16 }}>
            <Switch checked={advancedOption.advanced} onChange={onChange('advanced')} />
          </div>
        </AdvancedOption>
        <AdvancedOption>
          <span style={{ color: advancedOption.decentralized ? '#23beb9' : '#fff' }}>Decentralized</span>
          <div style={{ marginLeft: 16 }}>
            <Switch checked={advancedOption.decentralized} onChange={onChange('decentralized')} />
          </div>
        </AdvancedOption>
        <AdvancedOption>
          <span style={{ color: advancedOption.supportus ? '#23beb9' : '#fff' }}>Support us</span>
          <div style={{ marginLeft: 16 }}>
            <Switch checked={advancedOption.supportus} onChange={onChange('supportus')} />
          </div>
        </AdvancedOption>
      </AdvancedOptionLayout>
    );
  }, [advancedOption.advanced, advancedOption.decentralized, advancedOption.supportus, onChange]);

  return (
    <HeaderLayout>
      <HeaderLeft>
        <BeakerSmall />
        <HeaderTitle>
          <Title>Staking</Title>
          <Subtitle>Select the preferred type for evaluation</Subtitle>
        </HeaderTitle>
      </HeaderLeft>
      <HeaderRight>
        <Tooltip content={advancedDOM} visible={advancedOption.toggle} tooltipToggle={optionToggle}>
          <OptionIcon />
        </Tooltip>
      </HeaderRight>
    </HeaderLayout>
  );
};

interface iOption {
  label: string;
  value: number;
}

const Staking = () => {
  const [inputData, setInputData] = useState({ stakeAmount: 0, strategy: {}, rewardDestination: null });
  const [strategyOptions, setStrategyOptions] = useState<iOption[]>([]);
  const [advancedOption, setAdvancedOption] = useState({
    toggle: false,
    advanced: false,
    decentralized: false,
    supportus: false,
  });
  const [advancedSetting, setAdvancedSetting] = useState({
    minSelfStake: undefined, // input amount
    maxCommission: undefined, // input amount
    identity: false, // switch
    maxUnclaimedEras: undefined, // input amount
    previousSlashes: false, // switch
    isSubIdentity: false, // switch
    historicalApy: undefined, // input %
    minInclusion: undefined, // input %
    telemetry: false, // switch
  });

  const columns = useMemo(() => {
    return [
      {
        Header: 'Select',
        accessor: 'select',
        maxWidth: 150,
        Cell: ({ value }) => <span>{value ? <HandTrue /> : <HandFalse />}</span>,
      },
      {
        Header: 'Account',
        accessor: 'account',
        Cell: ({ value }) => <Account address={value} display={value}/>,
      },
      { Header: 'Self Stake', accessor: 'selfStake', collapse: true },
      { Header: 'Era Inclusion', accessor: 'eraInclusion', collapse: true },
      {
        Header: 'Unclaimed Eras',
        accessor: 'unclaimedEras',
        collapse: true,
        Cell: ({ value, row, rows, toggleRowExpanded }) => (
          <span
            {...row.getToggleRowExpandedProps({
              style: {
                display: 'block',
                overFlow: 'hidden',
              },
              onClick: () => {
                const expandedRow = rows.find((row) => row.isExpanded);

                if (expandedRow) {
                  const isSubItemOfRow = Boolean(expandedRow && row.id.split('.')[0] === expandedRow.id);

                  if (isSubItemOfRow) {
                    const expandedSubItem = expandedRow.subRows.find((subRow) => subRow.isExpanded);

                    if (expandedSubItem) {
                      const isClickedOnExpandedSubItem = expandedSubItem.id === row.id;
                      if (!isClickedOnExpandedSubItem) {
                        toggleRowExpanded(expandedSubItem.id, false);
                      }
                    }
                  } else {
                    toggleRowExpanded(expandedRow.id, false);
                  }
                }
                row.toggleRowExpanded();
              },
            })}
          >
            {value}
          </span>
        ),
      },
      { Header: 'Avg APY', accessor: 'avgAPY', collapse: true },
      {
        Header: 'Active',
        accessor: 'active',
        collapse: true,
        Cell: ({ value }) => <span>{value ? <CheckTrue /> : <CheckFalse />}</span>,
      },
    ];
  }, []);

  const handleAdvancedOptionChange = useCallback(
    (optionName) => (checked) => {
      switch (optionName) {
        case 'advanced':
          setAdvancedOption((prev) => ({ ...prev, advanced: checked }));
          break;
        case 'decentralized':
          setAdvancedOption((prev) => ({ ...prev, decentralized: checked }));
          break;
        case 'supportus':
          setAdvancedOption((prev) => ({ ...prev, supportus: checked }));
          break;

        default:
          break;
      }
    },
    []
  );

  const handleOptionToggle = useCallback((visible) => {
    setAdvancedOption((prev) => ({ ...prev, toggle: visible }));
  }, []);

  useEffect(() => {
    // get strategy options
    const result = [
      { label: 'General', value: 1 },
      { label: 'Aggressive', value: 2 },
      { label: 'High frenquency ', value: 3 },
    ];

    setStrategyOptions(result);
    setInputData((prev) => {
      if (_.isEmpty(prev.strategy)) {
        return { ...prev, strategy: result[0] };
      } else {
        return { ...prev };
      }
    });
  }, []);

  const handleInputChange = (name) => (e) => {
    let tmpValue;
    switch (name) {
      case 'stakeAmount':
        if (!isNaN(e.target.value)) {
          tmpValue = e.target.value;
          // TODO: deal with input number format and range
        } else {
          // not a number
          return;
        }
        break;
      case 'strategy':
        tmpValue = e;
        break;
      case 'rewardDestination':
        tmpValue = e;
        break;
      default:
        // stakeAmount
        tmpValue = e.target.value;
        break;
    }
    setInputData((prev) => ({ ...prev, [name]: tmpValue }));
  };

  const handleAdvancedFilter = (name) => (e) => {
    // TODO: input validator, limit
    switch (name) {
      case 'minSelfStake':
        console.log('value: ', e.target.value);
        setAdvancedSetting((prev) => ({ ...prev, minSelfStake: e.target.value }));
        break;
      case 'maxCommission':
        break;
      case 'identity':
        setAdvancedSetting((prev) => ({ ...prev, identity: e }));
        break;
      case 'maxUnclaimedEras':
        break;
      case 'previousSlashes':
        setAdvancedSetting((prev) => ({ ...prev, previousSlashes: e }));
        break;
      case 'isSubIdentity':
        setAdvancedSetting((prev) => ({ ...prev, isSubIdentity: e }));
        break;
      case 'historicalApy':
        break;
      case 'minInclusion':
        break;
      case 'telemetry':
        setAdvancedSetting((prev) => ({ ...prev, telemetry: e }));
        break;
      default:
        break;
    }
  };

  const advancedSettingDOM = useMemo(() => {
    if (!advancedOption.advanced) {
      return null;
    }
    return (
      <>
        <div style={{ height: 17 }}></div>
        <AdvancedBlockWrap>
          <AdvancedBlock style={{ backgroundColor: '#2E3843', height: 'auto' }}>
            <ContentColumnLayout width="100%" justifyContent="flex-start">
              <ContentBlockTitle color="white">Advanced Setting</ContentBlockTitle>
              <AdvancedSettingWrap>
                <TitleInput
                  title="Min. Self Stake"
                  placeholder="input minimal amount"
                  inputLength={170}
                  value={advancedSetting.minSelfStake}
                  onChange={handleAdvancedFilter('minSelfStake')}
                />
                <TitleInput
                  title="Max. Commission"
                  placeholder="input maximum amount"
                  inputLength={170}
                  value={advancedSetting.maxCommission}
                  onChange={handleAdvancedFilter('maxCommission')}
                />
                <TitleInput
                  title="Max. Unclaimed Eras"
                  placeholder="input maximum amount"
                  inputLength={170}
                  value={advancedSetting.maxUnclaimedEras}
                  onChange={handleAdvancedFilter('maxUnclaimedEras')}
                />
                <TitleInput
                  title="Historical APY"
                  placeholder="0 - 100"
                  unit="%"
                  value={advancedSetting.historicalApy}
                  onChange={handleAdvancedFilter('historicalApy')}
                />
                <TitleInput
                  title="Min. Eras Inclusion Rate"
                  placeholder="0 - 100"
                  unit="%"
                  value={advancedSetting.minInclusion}
                  onChange={handleAdvancedFilter('minInclusion')}
                />
                <TitleSwitch
                  title="Identity"
                  checked={advancedSetting.identity}
                  onChange={handleAdvancedFilter('identity')}
                />
                <TitleSwitch
                  title="Prev. Slashes"
                  checked={advancedSetting.previousSlashes}
                  onChange={handleAdvancedFilter('previousSlashes')}
                />
                <TitleSwitch
                  title="Is Sub-Identity"
                  checked={advancedSetting.isSubIdentity}
                  onChange={handleAdvancedFilter('isSubIdentity')}
                />
                <TitleSwitch
                  title="Is Telemeterable"
                  checked={advancedSetting.telemetry}
                  onChange={handleAdvancedFilter('telemetry')}
                />
              </AdvancedSettingWrap>
            </ContentColumnLayout>
          </AdvancedBlock>
        </AdvancedBlockWrap>
      </>
    );
  }, [
    advancedOption.advanced,
    advancedSetting.minSelfStake,
    advancedSetting.maxCommission,
    advancedSetting.maxUnclaimedEras,
    advancedSetting.historicalApy,
    advancedSetting.minInclusion,
    advancedSetting.identity,
    advancedSetting.previousSlashes,
    advancedSetting.isSubIdentity,
    advancedSetting.telemetry,
  ]);

  const advancedFilterResult = useMemo(() => {
    if (!advancedOption.advanced) {
      return null;
    }
    return (
      <>
        <div style={{ height: 17 }}></div>
        <AdvancedBlockWrap>
          <AdvancedFilterBlock style={{ backgroundColor: '#2E3843', height: 'auto' }}>
            <ContentColumnLayout width="100%" justifyContent="flex-start">
              <ContentBlockTitle color="white">Filter results: </ContentBlockTitle>
              {/* <AdvancedFilterResultWrap> */}
              <Table
                columns={columns}
                data={[
                  {
                    select: true,
                    account: '14AzFH6Vq1Vefp6eQYPK8DWuvYuUm3xVAvcN9wS352QsCH8L',
                    selfStake: '5705',
                    eraInclusion: '25.00% [21/84]',
                    unclaimedEras: 5,
                    avgAPY: '18.5%',
                    active: true,
                    subRows: [{ unclaimedEras: 'test1' }],
                  },
                  {
                    select: true,
                    account: '14AzFH6Vq1Vefp6eQYPK8DWuvYuUm3xVAvcN9wS352QsCH8L',
                    selfStake: '5705',
                    eraInclusion: '25.00% [21/84]',
                    unclaimedEras: 5,
                    avgAPY: '18.5%',
                    active: false,
                    subRows: [{ unclaimedEras: 'test2' }],
                  },
                  {
                    select: false,
                    account: '14AzFH6Vq1Vefp6eQYPK8DWuvYuUm3xVAvcN9wS352QsCH8L',
                    selfStake: '5705',
                    eraInclusion: '25.00% [21/84]',
                    unclaimedEras: 5,
                    avgAPY: '18.5%',
                    active: false,
                    subRows: [{ unclaimedEras: 'test3' }],
                  },
                ]}
              />
              {/* </AdvancedFilterResultWrap> */}
            </ContentColumnLayout>
          </AdvancedFilterBlock>
        </AdvancedBlockWrap>
      </>
    );
  }, [advancedOption.advanced, columns]);

  return (
    <>
      <CardHeader
        Header={() => (
          <StakingHeader
            advancedOption={advancedOption}
            optionToggle={handleOptionToggle}
            onChange={handleAdvancedOptionChange}
          />
        )}
      >
        <ContentBlockWrap advanced={advancedOption.advanced}>
          <ContentBlock>
            <ContentBlockLeft>
              <KSMLogo />
              <LogoTitle>KSM</LogoTitle>
            </ContentBlockLeft>
            <ContentBlockRight>
              <Balance>Balance: 23778.50331</Balance>
              <Input
                style={{ width: '80%' }}
                onChange={handleInputChange('stakeAmount')}
                value={inputData.stakeAmount}
              />
            </ContentBlockRight>
          </ContentBlock>
          <ArrowContainer advanced={advancedOption.advanced}>
            <GreenArrow />
          </ArrowContainer>
          <ContentBlock>
            <ContentBlockLeft>
              <ContentColumnLayout>
                <ContentBlockTitle>Strategy</ContentBlockTitle>
                <DropdownCommon
                  style={{ flex: 1, width: '90%' }}
                  options={strategyOptions}
                  value={inputData.strategy}
                  onChange={handleInputChange('strategy')}
                />
                <ContentBlockFooter />
              </ContentColumnLayout>
            </ContentBlockLeft>
            <ContentBlockRight>
              <Balance>Calculated APY</Balance>
              <ValueStyle>16.5%</ValueStyle>
            </ContentBlockRight>
          </ContentBlock>
        </ContentBlockWrap>
        <div style={{ height: 17 }}></div>
        <RewardBlockWrap advanced={advancedOption.advanced}>
          <RewardBlock
            advanced={advancedOption.advanced}
            style={{ backgroundColor: '#2E3843', height: 'auto' }}
          >
            <ContentColumnLayout width="100%" justifyContent="flex-start">
              <ContentBlockTitle color="white">Reward Destination</ContentBlockTitle>
              <DestinationWrap advanced={advancedOption.advanced}>
                <RewardComponent advanced={advancedOption.advanced} marginTop={5}>
                  <DropdownCommon
                    style={{
                      flex: 1,
                      width: '100%',
                    }}
                    options={[
                      { label: 'Specified payment account', value: 0, isDisabled: true },
                      { label: 'wallet 001', value: 1 },
                      { label: 'wallet 002', value: 2 },
                    ]}
                    value={inputData.rewardDestination}
                    onChange={handleInputChange('rewardDestination')}
                    theme="dark"
                  />
                </RewardComponent>
                <RewardComponent advanced={advancedOption.advanced}>
                  <Node title="CONTROLLER-HSINCHU" address="GiCAS2RKmFajjJNvc39rMRc83hMhg0BgT…" />
                </RewardComponent>
              </DestinationWrap>
              <ContentBlockFooter style={{ minHeight: advancedOption.advanced ? 0 : 50 }} />
            </ContentColumnLayout>
          </RewardBlock>
        </RewardBlockWrap>
        {advancedSettingDOM}
        {advancedFilterResult}
        <FooterLayout>
          <div style={{ marginBottom: 12 }}>
            <Button
              title="Nominate"
              onClick={() => {
                console.log('Nominate');
              }}
              style={{ width: 220 }}
            />
          </div>
          <Warning msg="There is currently an ongoing election for new validator candidates. As such staking operations are not permitted." />
        </FooterLayout>
      </CardHeader>
      <DashboardLayout>
        <TimeCircle type="epoch" percentage={68} />
        <TimeCircle type="era" percentage={75} />
      </DashboardLayout>
    </>
  );
};

export default Staking;

const HeaderLayout = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const HeaderRight = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const HeaderTitle = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  margin-left: 18px;
`;

const Title = styled.div`
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
`;

const Subtitle = styled.div`
  font-family: Montserrat;
  font-size: 11px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.55;
`;

const ContentBlock = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  width: 570px;
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

interface ContentBlockWrapProps {
  advanced: Boolean;
}
const ContentBlockWrap = styled.div<ContentBlockWrapProps>`
  display: flex;
  flex-direction: ${(props) => (props.advanced ? 'row' : 'column')};
  justify-content: space-between;
  align-items: center;
  width: ${(props) => (props.advanced ? '1200px' : '620px')};
  @media (max-width: 1395px) {
    flex-wrap: ${(props) => (props.advanced ? 'wrap' : 'nowrap')};
    flex-direction: column;
    width: 620px;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 100px);
  }
`;

interface RewardBlockProps {
  advanced: Boolean;
}
const RewardBlock = styled.div<RewardBlockProps>`
  background-color: white;
  border-radius: 6px;
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  width: ${(props) => (props.advanced ? '100%' : '570px')};
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

interface RewardBlockWrapProps {
  advanced: Boolean;
}
const RewardBlockWrap = styled.div<RewardBlockWrapProps>`
  display: flex;
  flex-direction: ${(props) => (props.advanced ? 'row' : 'column')};
  justify-content: space-between;
  align-items: center;
  width: ${(props) => (props.advanced ? '1200px' : '620px')};
  @media (max-width: 1395px) {
    width: 620px;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 110px);
  }
`;

interface RewardComponentProps {
  advanced: Boolean;
  marginTop?: number;
}
const RewardComponent = styled.div<RewardComponentProps>`
  width: ${(props) => (props.advanced ? '535px' : '100%')};
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  @media (max-width: 720px) {
    width: 100%;
  }
`;

interface DestinationWrapProps {
  advanced: Boolean;
}
const DestinationWrap = styled.div<DestinationWrapProps>`
  display: flex;
  flex-direction: ${(props) => (props.advanced ? 'row' : 'column')};
  justify-content: space-between;
  align-items: center;
  width: ${(props) => (props.advanced ? '100%' : '570px')};
  @media (max-width: 1395px) {
    flex-wrap: ${(props) => (props.advanced ? 'wrap' : 'nowrap')};
    flex-direction: column;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

const ContentBlockLeft = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const LogoTitle = styled.div`
  padding-left: 18px;
  display: flex;
  flex-shrink: 1;
  font-family: Montserrat;
  font-size: 18px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.22;
`;

const Balance = styled.div`
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
`;

type ContentColumnLayoutProps = {
  justifyContent?: string;
  width?: string;
};
const ContentColumnLayout = styled.div<ContentColumnLayoutProps>`
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.justifyContent ? props.justifyContent : 'space-between')};
  align-items: flex-start;
  width: ${(props) => (props.width ? props.width : '90%')};
`;
const ContentBlockTitle = styled.div`
  flex: 1;
  color: ${(props) => (props.color ? props.color : '#17222d')};
  min-height: 24px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
  margin-left: -8px;
`;

type ContentBlockFooterProps = {
  minHeight?: string;
};
const ContentBlockFooter = styled.div<ContentBlockFooterProps>`
  flex-grow: 1;
  color: blue;
  width: 100%;
  min-height: ${(props) => (props.minHeight ? props.minHeight : '16px')};
`;

const ContentBlockRight = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-end;
`;

const ValueStyle = styled.div`
  font-family: Montserrat;
  font-size: 25px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.2;
  color: #23beb9;
`;

const FooterLayout = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  margin-top: 40.5px;
  padding: 14px 25px 14px 25px;
  width: 570px;
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

const DashboardLayout = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 32px;
`;

const AdvancedOptionLayout = styled.div`
  display: flex;
  flex-direction: column;
`;

const AdvancedOption = styled.div`
  margin-top: 4px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #23beb9;
  font-family: Montserrat;
  font-size: 13px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.23;
`;

interface ArrowContainerProps {
  advanced: Boolean;
}
const ArrowContainer = styled.div<ArrowContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 4px;
  margin-bottom: 4px;
  transform: ${(props) => (props.advanced ? 'rotate(-90deg)' : '')};
  transition-duration: 0.2s;
  @media (max-width: 1340px) {
    transform: rotate(0deg);
  }
`;

const AdvancedSettingWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
`;

const AdvancedBlock = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  max-width: 100%;
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

const AdvancedFilterBlock = styled.div`
  background-color: white;
  border-radius: 6px;
  padding: 14px 25px 14px 25px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 62px;
  width: 100%;
  @media (max-width: 1395px) {
    width: 570px;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 160px);
  }
`;

interface RewardBlockWrapProps {
  advanced: Boolean;
}
const AdvancedBlockWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 1200px;
  @media (max-width: 1395px) {
    width: 620px;
  }
  @media (max-width: 720px) {
    width: calc(100vw - 110px);
  }
`;

const AdvancedFilterResultWrap = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

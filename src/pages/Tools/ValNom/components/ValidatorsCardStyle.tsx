import { useCallback, useEffect, useMemo, useState, useContext } from 'react';
import styled from 'styled-components';
import { ReactComponent as PeopleIcon } from '../../../../assets/images/people.svg';
import { ReactComponent as Search } from '../../../../assets/images/search.svg';
import { ReactComponent as OptionIcon } from '../../../../assets/images/option-icon.svg';
import CardHeader from '../../../../components/Card/CardHeader';
import IconInput from '../../../../components/Input/IconInput';
import ValidNominator from '../../../../components/ValidNominator';
import { lsGetFavorites } from '../../../../utils/localStorage';
import { apiGetAllValidator, IValidator, apiGetRefKey, apiRefKeyVerify } from '../../../../apis/Validator';
import { useHistory } from 'react-router-dom';
import Tooltip from '../../../../components/Tooltip';
import DropdownCommon from '../../../../components/Dropdown/Common';
import {
  filterOptionDropdownList,
  filterOptions,
  IValidatorFilter,
  toValidatorFilter,
} from './filterOptions';
import { DataContext } from '../../components/Data';
import { ApiContext, ApiState } from '../../../../components/Api';
import { balanceUnit } from '../../../../utils/string';
import { networkCapitalCodeName } from '../../../../utils/parser';
import { NetworkConfig } from '../../../../utils/constants/Network';
import { toast } from 'react-toastify';
import CustomScaleLoader from '../../../../components/Spinner/ScaleLoader';
import Pagination from '../../../../components/Pagination';
import { useTranslation } from 'react-i18next';
import { web3FromSource } from '@polkadot/extension-dapp';
import type { Signer } from '@polkadot/api/types';
import { u8aWrapBytes, isFunction, u8aToHex } from '@polkadot/util';
import TinyButton from '../../../../components/Button/tiny';
import { notifySuccess, notifyWarn } from '../../../../utils/notify';
import keys from '../../../../config/keys';
import { queryStakingInfo, IAccountChainInfo, AccountRole } from '../../../../utils/account';

const ValNomHeader = () => {
  const { t } = useTranslation();
  return (
    <HeaderLayout>
      <HeaderLeft>
        <PeopleIcon width="38.8px" height="38px" />
        <HeaderTitle>
          <Title>{t('tools.valnom.title')}</Title>
          <Subtitle>{t('tools.valnom.subtitle')}</Subtitle>
        </HeaderTitle>
      </HeaderLeft>
    </HeaderLayout>
  );
};

interface iOption {
  label: string;
  value: number;
}

const ValidatorGrid = ({ filters, validators }) => {
  const history = useHistory();
  const { network: networkName } = useContext(DataContext);
  const chain = NetworkConfig[networkName].token;
  const _formatBalance = useCallback(
    (value: any) => {
      return balanceUnit(chain, value, true, true);
    },
    [chain]
  );

  const sortValidators = (validators: IValidator[], filters: IValidatorFilter): IValidator[] => {
    // if filters.stashId is not empty
    if (filters.stashId.length > 0) {
      return validators.reduce((acc: Array<IValidator>, v: IValidator, idx: number) => {
        if (
          v.id.toLowerCase().includes(filters.stashId.toLowerCase()) ||
          v.identity.display.toLowerCase().includes(filters.stashId.toLowerCase())
        ) {
          acc.push(v);
        }
        return acc;
      }, []);
    } else {
      // sort by apy or commission
      if (filters.apy === true) {
        validators = validators.sort((a: IValidator, b: IValidator) => {
          if (a.averageApy > b.averageApy) {
            return -1;
          } else if (a.averageApy < b.averageApy) {
            return 1;
          }
          return 0;
        });
      } else if (filters.commission === true) {
        validators = validators.sort((a: IValidator, b: IValidator) => {
          if (a.info.commission > b.info.commission) {
            return -1;
          } else if (a.info.commission < b.info.commission) {
            return 1;
          }
          return 0;
        });
      } else if (filters.alphabetical === true) {
        validators = validators.sort((a: IValidator, b: IValidator) => {
          if (a.identity.display > b.identity.display) {
            return 1;
          } else if (a.identity.display < b.identity.display) {
            return -1;
          }
          return 0;
        });
      }
      // put cryptoLab related to the top
      // put status changed nodes to the top
      if (filters.status === true) {
        const statusChangedValidators = validators.reduce(
          (acc: Array<IValidator>, v: IValidator, idx: number) => {
            if (v.statusChange.commission !== 0) {
              acc.push(v);
              validators.splice(idx, 1);
            }
            return acc;
          },
          []
        );
        validators.unshift(...statusChangedValidators);
      }
      // read favorite from localstorage
      const favoriteValidatorsStr = lsGetFavorites();
      // eslint-disable-next-line array-callback-return
      favoriteValidatorsStr.map((id) => {
        const favoriteValidators = validators.reduce((acc: Array<IValidator>, v: IValidator, idx: number) => {
          if (v.id === id) {
            acc.push(v);
            v.favorite = true;
            validators.splice(idx, 1);
          }
          return acc;
        }, []);
        validators.unshift(...favoriteValidators);
      });
    }
    // find favorites and put them to the top
    return validators;
  };
  const [displayValidators, setDisplayValidators] = useState<IValidator[]>([]);
  const [page, setPage] = useState<number>(0);
  const [pageCount, setPageCount] = useState<number>(0);
  useEffect(() => {
    try {
      setDisplayValidators(sortValidators(validators, filters).slice(page * 24, page * 24 + 24));
      setPageCount(Math.ceil(validators.length / 24));
    } catch (err) {
      console.error(err);
    }
  }, [filters, page, validators]);

  const pageOptions = useMemo(() => {
    let result: number[] = [];
    for (let idx = 0; idx < pageCount; idx++) {
      result.push(idx);
    }
    return result;
  }, [pageCount]);

  const validatorComponents = useMemo(() => {
    const openValidatorStatus = (id) => {
      history.push(`/validator/${id}/${chain}`);
    };
    return displayValidators.map((v, idx) => {
      return (
        <div style={{ padding: 4, boxSizing: 'border-box' }} key={idx}>
          <ValidNominator
            address={v.id}
            name={v.identity.display}
            activeAmount={_formatBalance(v.info.exposure.total)}
            totalAmount={_formatBalance(v.info.total)}
            apy={(v.averageApy * 100).toFixed(2)}
            commission={v.info.commission}
            count={v.info.nominatorCount}
            statusChange={v.statusChange}
            unclaimedPayouts={v.info.unclaimedEras.length}
            favorite={v.favorite}
            onClick={() => openValidatorStatus(v.id)}
          ></ValidNominator>
        </div>
      );
    });
  }, [_formatBalance, chain, history, displayValidators]);

  if (validatorComponents.length > 0) {
    return (
      <GridLayout>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>{validatorComponents}</div>
        <div style={{ margin: '20px 0 0 0' }}></div>
        <Pagination
          canNextPage={page < pageCount ? true : false}
          canPreviousPage={page > 0 ? true : false}
          pageOptions={pageOptions}
          pageCount={pageCount}
          gotoPage={(p) => {
            setPage(p);
          }}
          nextPage={() => {
            if (page < pageCount - 1) {
              setPage(page + 1);
            }
          }}
          previousPage={() => {
            if (page > 0) {
              setPage(page - 1);
            }
          }}
          currentPage={page}
        ></Pagination>
      </GridLayout>
    );
  } else {
    return <div></div>;
  }
};

const ValNomContent: React.FC = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState({
    stashId: '',
    strategy: { label: filterOptions[0], value: 1 },
  });
  const { network: networkName, selectedAccount } = useContext(DataContext);
  const chain = NetworkConfig[networkName].token;
  const [validators, setValidators] = useState<IValidator[]>([]);
  const [signer, setSigner] = useState<Signer | null>(null);
  const [refCodeInfo, setRefCodeInfo] = useState({
    refKey: '',
    signature: '',
    signPending: false,
    verified: false,
  });
  const [accountChainInfo, setAccountChainInfo] = useState<IAccountChainInfo>({
    isReady: false,
  } as unknown as IAccountChainInfo);

  let { api: polkadotApi, apiState: polkadotApiState } = useContext(ApiContext);
  const handleFilterChange = (name) => (e) => {
    switch (name) {
      case 'stashId':
        setFilters((prev) => ({ ...prev, stashId: e.target.value }));
        break;
      case 'sorting':
        setFilters((prev) => ({ ...prev, strategy: e }));
        break;
      default:
        break;
    }
  };
  const notifyError = useCallback((msg: string) => {
    toast.error(`${msg}`, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: false,
      progress: undefined,
    });
  }, []);
  const [options, setFilterOptions] = useState<iOption[]>([]);
  const [isLoading, toggleLoading] = useState<boolean>(false);
  useEffect(() => {
    setFilterOptions(filterOptionDropdownList);
    async function getValidators() {
      try {
        toggleLoading(true);
        let validators = await apiGetAllValidator({ params: chain });
        setValidators(validators);
        if (validators.length === 0) {
          notifyError('Empty response. We are collecting data, please retry later.');
        }
      } catch (err) {
        console.error(err);
        notifyError(String(err));
      } finally {
        toggleLoading(false);
      }
    }
    getValidators();
  }, [chain, notifyError]);

  useEffect(() => {
    setSigner(null);
    setRefCodeInfo({
      refKey: '',
      signature: '',
      signPending: false,
      verified: false,
    });
    web3FromSource(selectedAccount.source)
      .catch((): null => null)
      .then((injected) => setSigner(injected?.signer || null))
      .catch(console.error);
    polkadotApiState === ApiState.READY &&
      queryStakingInfo(selectedAccount.address, polkadotApi).then(setAccountChainInfo).catch(console.error);
  }, [polkadotApi, polkadotApiState, selectedAccount]);

  const onSign = useCallback(
    async (data: string): Promise<string> => {
      let signature = '';
      try {
        const wrapped = u8aWrapBytes(data);
        if (signer && isFunction(signer.signRaw)) {
          setRefCodeInfo((prev) => ({ ...prev, signPending: true }));
          const sigResult = await signer.signRaw({
            address: selectedAccount.address,
            data: u8aToHex(wrapped),
            type: 'bytes',
          });
          setRefCodeInfo((prev) => ({ ...prev, signPending: false }));
          if (sigResult && sigResult.signature) {
            return sigResult.signature;
          } else {
            throw new Error('onSign failed, signature undefined');
          }
        } else {
          throw new Error('onSign failed, signer undefined');
        }
      } catch (error) {
        console.error('onSign failed, error: ', error);
        setRefCodeInfo((prev) => ({ ...prev, signPending: false }));
        return signature;
      }
    },
    [selectedAccount.address, signer]
  );

  const onRefKeyGen = useCallback(async () => {
    try {
      if (
        accountChainInfo.role !== AccountRole.VALIDATOR &&
        accountChainInfo.role !== AccountRole.CONTROLLER_OF_VALIDATOR
      ) {
        notifyWarn(t('tools.valnom.refCode.walletSwitchRequired'));
        return;
      }
      // get refKey
      const refKey = await apiGetRefKey({
        params: `${selectedAccount.address}/${networkCapitalCodeName(networkName)}`,
      });
      // sign refKey
      const signedSignature = await onSign(refKey);
      // verify signature
      if (refKey && signedSignature) {
        const verifyResult = await apiRefKeyVerify({
          params: `${selectedAccount.address}/${networkCapitalCodeName(networkName)}/verify`,
          data: { refKey: refKey, encoded: signedSignature },
        });
        if (verifyResult) {
          setRefCodeInfo({
            refKey: refKey,
            signature: signedSignature,
            signPending: false,
            verified: true,
          });
          notifySuccess(t('tools.valnom.refCode.refGenComplete'));
        } else {
          throw new Error(t('tools.valnom.refCode.refVerifiedFailed'));
        }
      } else {
        throw new Error(t('tools.valnom.refCode.refGenFailed'));
      }
    } catch (err) {
      console.error(err);
      notifyError(t('tools.valnom.refCode.refGenFailed'));
    }
  }, [accountChainInfo.role, selectedAccount.address, networkName, onSign, t, notifyError]);

  const filtersDOM = useMemo(() => {
    return (
      <FilterOptionLayout>
        <AdvancedOption>
          <span style={{ color: '#fff' }}>{t('tools.valnom.filters.sorting')}</span>
          <div style={{ marginLeft: 16, width: '120px' }}>
            <DropdownCommon
              style={{ flex: 1, width: '90%' }}
              options={options}
              value={filters.strategy}
              onChange={handleFilterChange('sorting')}
              theme="dark"
            />
          </div>
        </AdvancedOption>
      </FilterOptionLayout>
    );
  }, [filters.strategy, options, t]);
  const [showFilters, toggleFilters] = useState(false);
  const onShowFilters = useCallback(() => {
    toggleFilters(true);
  }, []);
  const handleOptionToggle = useCallback((visible) => {
    toggleFilters(visible);
  }, []);
  if (isLoading) {
    return (
      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <CustomScaleLoader />
      </div>
    );
  }
  return (
    <ValNomContentLayout>
      <div style={{ width: 'calc(100% - 2px)', boxSizing: 'border-box', padding: 4 }}>
        <OptionBar>
          <HeaderLayout>
            <HeaderLeft>
              <IconInput
                Icon={Search}
                iconSize="16px"
                placeholder="Polkadot/Kusama Stash ID"
                inputLength={256}
                value={filters.stashId}
                onChange={handleFilterChange('stashId')}
              />
            </HeaderLeft>
            <HeaderRight>
              <span style={{ marginRight: 8 }}>
                {!selectedAccount.address ? null : !refCodeInfo.verified && !refCodeInfo.signPending ? (
                  <TinyButton
                    title={t('tools.valnom.refCode.refGen')}
                    fontSize="12"
                    onClick={() => {
                      onRefKeyGen();
                    }}
                    disabled={!accountChainInfo.isReady}
                  />
                ) : !refCodeInfo.verified && refCodeInfo.signPending ? (
                  <TinyButton
                    title={t('tools.valnom.refCode.signPending')}
                    fontSize="12"
                    onClick={() => {
                      onRefKeyGen();
                    }}
                    disabled={true}
                  />
                ) : (
                  <TinyButton
                    title={t('tools.valnom.refCode.refShare')}
                    fontSize="12"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${keys.appDomain}/benchmark?refKey=${refCodeInfo.refKey}&signature=${refCodeInfo.signature}&switchNetwork=${networkName}`
                      );
                      notifySuccess(t('tools.valnom.refCode.refToClipboard'));
                    }}
                  />
                )}
              </span>

              <Tooltip content={filtersDOM} visible={showFilters} tooltipToggle={handleOptionToggle}>
                <div onClick={onShowFilters}>
                  <OptionIcon />
                </div>
              </Tooltip>
            </HeaderRight>
          </HeaderLayout>
        </OptionBar>
      </div>
      <ValidatorGrid filters={toValidatorFilter(filters)} validators={validators} />
    </ValNomContentLayout>
  );
};

const ValNomStatus = () => {
  return (
    <CardHeader Header={() => <ValNomHeader />} mainPadding="0 0 0 0">
      <ValNomContent />
    </CardHeader>
  );
};

export default ValNomStatus;

const HeaderLayout = styled.div`
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
  margin: 0 15.4px 0 0;
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
  /* width: 1400px; */
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

const OptionBar = styled.div`
  box-sizing: border-box;
  max-width: 100%;
  padding: 12px;
  border-radius: 6px;
  background-color: #2f3842;
`;

const ValNomContentLayout = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 4px;
`;

const FilterOptionLayout = styled.div`
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

const GridLayout = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 1920px) {
    width: 1392px;
  }

  @media (max-width: 1440px) {
    width: 928px;
  }
`;

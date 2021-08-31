import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const lcdOptions = {
  // order and from where user language should be detected
  order: ['localStorage', 'navigator'],

  // keys or params to lookup language from
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupSessionStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  // cache user language on
  caches: ['localStorage', 'cookie'],
  excludeCacheFor: ['cimode'], // languages to not persist (cookie, localStorage)

  // optional expire and domain for set cookie
  cookieMinutes: 10,
  cookieDomain: 'myDomain',

  // optional htmlTag with lang attribute, the default is:
  htmlTag: document.documentElement,

  // optional set cookie options, reference:[MDN Set-Cookie docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
  cookieOptions: { path: '/', sameSite: 'strict' }
}

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    detection: lcdOptions,
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          app: {
            title: {
              stakingGuide: 'Staking Guide',
              portfolioBenchmark: 'Portfolio Benchmark',
              portfolioManagement: 'Portfolio Management',
              useBenchmark: 'Use Benchmark',
            },
            newsletter: {
              subscribe: {
                successful: 'Thank you for subscribing our newsletter',
                duplicated: 'You have already subsribed our newsletter',
                incorrectFormat: 'Invalid email format',
                failed: 'Failed to subscribe our newsletter',
              }
            },
            footer: {
              title: {
                about: 'About',
                contact: 'Contact',
                ourValidators: 'Our Validators',
                technology: 'Technology',
                stakingService: 'Staking Service',
                toolsForValidators: 'Tools For Validators',
                telegramBots: 'telegramBots',
                community: 'Community',
                blog: 'Blog',
                medium: 'Medium',
                subscribeDescription: 'Subscribe to receive CryptoLab updates!',
                subscribe: 'Subscribe',
                disclaimer: 'Terms and Conditions',
                privacyPolicy: 'Privacy Policy',
                enterEmail: 'Enter your email address',
                general: 'General',
                language: 'Language',
              }
            },
            portal: {
              slogan: 'Built to create stable staking yields',//'Built to maximize staking yield',
              sloganDetail: 'CryptoLab is making life way easier for crypto holders. We help you earn staking yield without taking custody of your assets. Stake once, CryptoLab will take care of the rest for you.',//'CryptoLab is a portfolio management platform for NPoS (nominated proof-of-stake) networks like Kusama and Polkadot. We aim to simplify portfolio management to make yield optimization easier and more accessible, for technical and non-technical users alike.',
              stakingGuide: {
                title: 'Staking Guide',
                detail: 'Learn how to use our services',
              },
              portfolioBenchmark: {
                title: 'Portfolio Benchmark',
                detail: 'We know validtors very well. You can use our prebuilt staking strategies or even invent yours.',//'Make assessment on validators, and select from them to stake.',
              },
              portfolioManagement: {
                title: 'Portfolio Management',
                detail: 'Stability is vital for the Long Haul. We will inform you to take action before things changed.',//'Manage after you stake. See rewards and validator status.',
              },
            },
            mobile: {
              warning: 'Mobile not supported yet!',
              warningDetail: 'We are working on it.',
              warningTools: 'Before that, please access our legacy website'
            }
          },
          tools: {
            title: {
              valnom: 'Validator / Nominator Status',
              oneKvMonitor: '1KV Monitor',
              stakingRewards: 'Staking Rewards',
            },
            valnom: {
              title: 'Validator / Nominator Status',
              detail: 'Useful criterias for both validators and nominators to monitor and evaluate your staking information.',
              subtitle: 'See filtered validator status or enter a nominator stash ID to see its nominated validators',
              unfavorite: 'Toggle to un-favorite this validator',
              favorite: 'Toggle to favorite this validator',
              filters: {
                sorting: 'Sorting'
              },
              tips: {
                tooManyUnclaimedPayouts: 'Too many unclaimed payouts',
                activeAmounts: 'Active amounts',
                totalAmounts: 'Total amounts',
                apy: 'Annual Percentage Yields',
                averageApy: 'Average APY',
                nominatorCount:'Nominator Count',
                commission: 'Commission',
              },
            },
            oneKv: {
              title: '1KV Monitor',
              detail: 'Information that allow 1kv node operators to predict when they will be nominated.',
              seeInvalid: 'See Invalid',
              seeValid: 'See Valid',
              subtitle: 'Nomination order and data of all One Thousand Validators',
              era: 'Era',
              validValidators: 'Valid Validators',
              activeValidators: 'Active Validators',
              electedValidators: '1KV Elected Validators',
              lastUpdateTime: 'Last Update Time',
              table: {
                header: {
                  era: 'Era',
                  dashboard: 'Dashboard',
                  name: 'Name',
                  commission: 'Commission',
                  active: 'Active',
                  oneKvNominated: 'OneKv Nominated',
                  nominationOrder: 'Nomination Order',
                  selfStake: 'Self Stake',
                  rank: 'Rank',
                  inclusion: 'Inclusion',
                  reasons: 'reasons',
                }
              },
              optionBar: {
                stashId: 'Polkadot/Kusama Stash ID or Name'
              }
            },
            validators: {
              apy: 'APY',
              nominatorCount: 'Nominator Count',
              commission: 'Commission',
              selfStake: 'Self Stake',
              unclaimedEras: 'Unclaimed Eras',
              slashes: 'Slashes',
              activeNominators: 'Active Nominators',
              inactiveNominators: 'Inactive Nominators',
              errors: {
                incorrectValidator1: `The validator data of Stash`,
                incorrectValidator2: `does not exist. Please make sure that you entered a correct validator ID`,
              }
            },
            stakingRewards: {
              title: 'Staking Rewards',
              detail: 'Exportable reports of your staking rewards.',
              subtitle: 'Query and export your staking rewards',
              noRewards: 'No rewards are found. Please make sure that this address is a stash.',
              description: 'Enter your stash ID to query your staking rewards',
              enter: 'Enter your stash ID',
              optionBar: {
                title: "Polkadot/Kusama Stash ID",
              },
              table: {
                header: {
                  payoutDate: 'Payout Date',
                  amount: 'Amount',
                  price: 'Price',
                  total: 'Total'
                }
              },
              stashInformation: 'Stash Information',
              stashId: 'Stash ID',
              totalRewards: 'Total Rewards',
              from: 'From',
              to: 'to',
            },
          },
          about: {
            description: 'We are CryptoLab, we operate Polkadot and Kusama validators. We believe that blockchain will change the way we live, work, and even thought. Our goal is to make everyone enjoys the benefit of blockchain technology.',
            mission: 'Therefore, we build the following services for all of us.',
            mission1: 'A simple, easy-to-use staking service for Polkadot and Kusama HODLers.',
            mission2: 'A bunch of tools for Polkadot and Kusama validator operators.',
          },
          benchmark: {
            charts: {
              table: {
                header: {
                  network: 'Network',
                  validators: 'Validators',
                  waiting: 'Waiting',
                  nominators: 'Nominators',
                  averageReturns: 'Avg. Returns'
                }
              },
              sd: {
                title: 'Nominator Stake Distribution',
                nominatorCount: 'Nominator Count'
              },
              cd: {
                title: 'Commission Distribution',
                validatorCount: 'Validator Count'
              }
            },
            staking: {
              title: 'Staking',
              strategy: {
                lowRisk: 'Low Risk',
                highApy: 'High Apy',
                decentralized: 'Decentralized',
                onekv: 'One Thousand Validator Program',
                custom: 'Custom'
              },
              selectWallet: '(please select a wallet)',
              warnings: {
                transactionInvalid: 'Transaction invalid',
                transactionReady: 'Transaction is ready',
                transactionBroadcasted: 'Transaction has been broadcasted',
                transactionIsIncluded: 'Transaction is included in block',
                transactionIsIncludedInBlock: 'Transaction has been included in blockHash',
                transactionSucceeded: 'Transaction Succeeded',
                transactionFailed: 'Transaction Failed',
                disconnectedFirst: 'Your have disconnected from the', 
                disconnectedSecond: 'network, please wait for a moment or refresh the page.',
                fetching: 'Fetching validator list. As such staking operations are not permitted.',
                noFilteredValidators: 'The filtered validator count is 0. As such staking operations are not permitted.',
                noSelectedValidators: 'You haven\'t selected any validators yet. As such staking operations are not permitted.',
                fetchingStashData: 'Fetching On-chain data. As such staking operations are not permitted.',
                stashInvalid: 'This account cannot operate staking related extrinsics. As such staking operations are not permitted.',
                isValidator: "This account's role is Validator. As such staking operations are not permitted.",
                isControllerOfValidator: "This account's role is Controller of Validator. As such staking operations are not permitted.",
                hasController: "This account's role is Nominator which has a Controller account. As such staking operations are not permitted.",
                maxNominations: 'maximum nomination has reached.',
              },
              table: {
                header: {
                  account: 'Account',
                  selfStake: 'Self Stake',
                  eraInclusion: 'Era Inclusion',
                  unclaimedEras: 'UnclaimedEras',
                  avgApy: 'Avg. APY',
                  active: 'Active',
                }
              },
              controller: {
                enterAddress: "enter an address",
                controllerAccount: 'Controller Account',
                account: 'Account',
                controller: 'Controller',
              },
              advancedSettings: 'Advanced Settings',
              filters: {
                minSelfStake: 'Min. Self Stake',
                maxUnclaimedEras: 'Max Unclaimed Eras',
                apy: 'Historical APY',
                minEraInclusionRate: 'Min. Era Inclusion Rate',
                hasIdentity: 'Has Identity',
                isSubIdent: 'Is Sub Identity',
                minApy: 'Min. APY',
                decentralized: 'Decentralized',
                onekv: '1KV Programme'
              },
              selected: 'Selected',
              filtered: 'Filtered',
              total: 'Total',
              filterResult: 'Filter result',
              balance: 'Balance',
              role: 'Role',
              nominees: 'Nominees',
              bonded: 'Bonded',
              reserved: 'Reserved',
              redeemable: 'Redeemable',
              strategyString: 'Strategy',
              calculatedApy: 'Estimated APY',
              rewardDest: 'Reward Destination',
              nominate: 'Nominate',
              advanced: 'Advanced',
              subtitle: 'Select the preferred type for evaluation',
              supportUs: 'Support Us'
            }
          },
        },
      },
      'zh-TW': {
        translation: {
          app: {
            title: {
              stakingGuide: '質押教學',
              portfolioBenchmark: '質押評估',
              portfolioManagement: '質押管理',
              useBenchmark: '連結錢包',
            },
            newsletter: {
              subscribe: {
                successful: '感謝您訂閱我們的電子報',
                duplicated: '您已經訂閱過我們的電子報了',
                incorrectFormat: '錯誤的email格式',
                failed: '訂閱失敗',
              }
            },
            footer: {
              title: {
                about: '關於我們',
                contact: '聯繫我們',
                ourValidators: '我們的驗證節點',
                technology: '技術',
                stakingService: '質押服務',
                toolsForValidators: '驗證人工具',
                telegramBots: 'Telegram 機器人',
                community: '社群',
                blog: '部落格',
                medium: 'Medium',
                subscribeDescription: '訂閱電子報來獲得CryptoLab的最新消息',
                subscribe: '訂閱',
                enterEmail: '輸入您的Email地址',
                disclaimer: '使用條款',
                privacyPolicy: '隱私權政策',
                general: '一般',
                language: '多國語系',
              }
            },
            portal: {
              slogan: '創造穩定的質押收益',//'最大化您的質押收益',
              sloganDetail: 'CryptoLab 讓持幣人的生活更加愜意。我們協助您獲得質押收益，且無須託管您的資產。質押一次， CryptoLab 將為您處理剩下的事情',//'CryptoLab致力於提供NPoS類型的區塊鏈上質押及管理服務，例如Polkadot以及Kusama。我們的目標是無論您是否懂得區塊鏈技術，都能使用我們的服務，簡單地進行質押及其後的管理。',
              stakingGuide: {
                title: '質押教學',
                detail: '手把手說明如何使用我們的服務',
              },
              portfolioBenchmark: {
                title: '質押評估',
                detail: '我們瞭解驗證節點。您可直接使用我們預先建立的質押策略，或是打造您自己的',
              },
              portfolioManagement: {
                title: '質押管理',
                detail: '穩定性是長期持有的關鍵。在情況發生變化之前，我們會即時通知您並採取行動',
              },
            },
            mobile: {
              warning: '目前不支援手持裝置',
              warningDetail: '我們正在建置中',
              warningTools: '在此之前，請使用我們的既有網站'
            }
          },
          tools: {
            title: {
              valnom: '驗證人/提名人狀態',
              oneKvMonitor: '1KV 提名人資訊',
              stakingRewards: '質押獎勵查詢',
            },
            valnom: {
              title: '驗證人/提名人狀態',
              detail: '提供驗證人以及提名人實用的工具以便評估您的質押狀態',
              subtitle: '可依條件過濾驗證人資訊 也可以搜尋提名人的ID來查詢您提名的節點運行的狀況',
              unfavorite: '點擊此圖示取消關注此驗證人',
              favorite: '點擊此圖示以關注此驗證人',
              filters: {
                sorting: '排序'
              },
              tips: {
                tooManyUnclaimedPayouts: '過多未分配的獎勵',
                activeAmounts: '此Era提名您的質押總數',
                totalAmounts: '所有提名您的質押總數',
                apy: '年化報酬率',
                averageApy: '平均年化報酬率',
                nominatorCount: '提名人總數',
                commission: '傭金',
              },
            },
            validators: {
              apy: '年化報酬率',
              nominatorCount: '提名人總數',
              commission: '傭金',
              selfStake: '本身的質押數',
              unclaimedEras: '未分配獎勵的Era數',
              slashes: '懲罰次數',
              activeNominators: '此Era將Stake分配給您的提名人',
              inactiveNominators: '此Era未將Stake分配給您的提名人',
              errors: {
                incorrectValidator1: `不存在的驗證人`,
                incorrectValidator2: `請確認您輸入正確的ID`,
              }
            },
            oneKv: {
              title: '1KV 提名人資訊',
              detail: '幫助運行1KV節點的人能夠評估何時將會被提名',
              seeInvalid: '查看不符合規則的節點',
              seeValid: '查看符合規則的節點',
              subtitle: '提名順序以及1KV節點的詳細資訊',
              era: 'Era',
              validValidators: '符合規則的驗證人',
              activeValidators: '驗證中的驗證人',
              electedValidators: '1KV提名的驗證人',
              lastUpdateTime: '最近的資料更新時間',
              table: {
                header: {
                  era: 'Era',
                  dashboard: '儀錶板',
                  name: '名稱',
                  commission: '傭金',
                  active: '驗證中',
                  oneKvNominated: '1KV提名中',
                  nominationOrder: '下次提名順序',
                  selfStake: '本身的質押數',
                  rank: '排名',
                  inclusion: '提名率',
                  reasons: '原因',
                }
              },
              optionBar: {
                stashId: 'Polkadot/Kusama 帳號ID或名稱'
              }
            },
            stakingRewards: {
              title: '質押獎勵查詢',
              detail: '幫助提名人查詢您的質押獎勵, 也能夠將您的質押紀律匯出',
              subtitle: '查詢與匯出您的質押獎勵',
              noRewards: '此帳戶沒有獎勵紀錄',
              description: '輸入您的帳戶 ID以查詢獎勵',
              enter: '輸入您的帳戶 ID',
              optionBar: {
                title: "Polkadot/Kusama 帳戶 ID",
              },
              table: {
                header: {
                  payoutDate: '獎勵分配日期',
                  amount: '總顆數',
                  price: '當日價格',
                  total: '總價'
                }
              },
              stashInformation: '帳戶資訊',
              stashId: '帳戶 ID',
              totalRewards: '總獎勵',
              from: '從',
              to: '至',
            },
          },
          about: {
            description: '我們是 CryptoLab. Polkadot 和 Kusama 驗證節點的運營者. 我們相信區塊鏈技術將改變生活、工作、甚至思考方式。我們的目標是讓每個人都享受到區塊鏈技術帶來的美好',
            mission: '因此，我們為各位建立以下服務',
            mission1: '為持幣者打造的一個直覺易用的質押服務',
            mission2: '為營運者打造的一系列驗證節點輔助工具',
          },
          benchmark: {
            charts: {
              table: {
                header: {
                  network: '網路',
                  validators: '驗證人',
                  waiting: '等待中',
                  nominators: '提名人',
                  averageReturns: '平均報酬'
                }
              },
              sd: {
                title: '提名人資金分布',
                nominatorCount: '提名人數量'
              },
              cd: {
                title: '佣金分布',
                validatorCount: '驗證人數量'
              }
            },
            staking: {
              title: '質押',
              strategy: {
                lowRisk: '低風險',
                highApy: '高收益',
                decentralized: '分散提名',
                onekv: 'One Thousand Validator 計畫',
                custom: '自訂'
              },
              selectWallet: '(請選擇一個錢包)',
              warnings: {
                transactionInvalid: '無效的交易',
                transactionReady: '交易已經準備好',
                transactionBroadcasted: '交易已經在鏈上廣播',
                transactionIsIncluded: '交易已經被包含在區塊中',
                transactionIsIncludedInBlock: '交易已經被包含在區塊',
                transactionSucceeded: '質押完成',
                transactionFailed: '質押失敗',
                disconnectedFirst: '您已經從區塊鏈', 
                disconnectedSecond: '網路斷開, 請稍待或刷新頁面',
                fetching: '正在抓取驗證人清單. 在此期間無法執行質押',
                noFilteredValidators: '您過濾驗證人條件後可選擇的驗證人數量為0. 請選擇新的條件',
                noSelectedValidators: '您沒有選擇任何驗證人. 請選擇至少一個',
                fetchingStashData: '正在抓取鏈上的資料. 在此期間無法執行質押',
                stashInvalid: '此帳戶沒有執行質押相關操作的權限',
                isValidator: "此帳戶的角色是驗證人 無法執行質押",
                isControllerOfValidator: "此帳戶的角色是驗證人的控制者 無法執行質押",
                hasController: "此帳戶已經設定控制者 無法執行質押",
                maxNominations: '已經到達最大的提名數量.',
              },
              table: {
                header: {
                  account: '帳戶',
                  selfStake: '驗證人自己質押的數量',
                  eraInclusion: 'Active比例',
                  unclaimedEras: '未分配收益的Era數',
                  avgApy: '平均年化報酬率',
                  active: 'Active',
                }
              },
              controller: {
                enterAddress: "輸入一個帳戶",
                controllerAccount: '控制人帳戶',
                account: '帳戶',
                controller: '控制人',
              },
              advancedSettings: '進階設定',
              filters: {
                minSelfStake: '最小驗證人質押數',
                maxUnclaimedEras: '最大未分配收益的Era數',
                apy: '平均年化報酬率',
                minEraInclusionRate: '最小Active比例',
                hasIdentity: '有身分認證',
                isSubIdent: '為子帳戶',
                minApy: '最小年化報酬率',
                decentralized: '只選擇一個同身分的驗證者',
                onekv: '參加1KV 計畫'
              },
              selected: '選擇',
              filtered: '過濾',
              total: '總數',
              filterResult: '過濾結果',
              balance: '總金額',
              role: '角色',
              nominees: '提名人數量',
              bonded: '綁定',
              reserved: '保留',
              redeemable: '可解除綁定',
              strategyString: '策略',
              calculatedApy: '預計的年化報酬率',
              rewardDest: '收益對象',
              nominate: '提名',
              advanced: '進階',
              subtitle: '選擇錢包',
              supportUs: '支持我們'
            }
          },
        },
      },
    }
  });
  console.log(i18n.language);
export default i18n;
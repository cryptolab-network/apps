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
  cookieOptions: { path: '/', sameSite: 'strict' },
};

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
    debug: false,
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
              },
            },
            footer: {
              title: {
                about: 'About',
                contact: 'Contact',
                ourValidators: 'Our Validators',
                technology: 'Technology',
                stakingService: 'Staking Service',
                toolsForValidators: 'Tools for Validators',
                telegramBots: 'Telegram Bots',
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
              },
            },
            portal: {
              slogan: 'Built to create stable staking yields', //'Built to maximize staking yield',
              sloganDetail:
                'CryptoLab is making life way easier for crypto holders. We help you earn staking yield without taking custody of your assets. Stake once, CryptoLab will take care of the rest for you.', //'CryptoLab is a portfolio management platform for NPoS (nominated proof-of-stake) networks like Kusama and Polkadot. We aim to simplify portfolio management to make yield optimization easier and more accessible, for technical and non-technical users alike.',
              stakingGuide: {
                title: 'Staking Guide',
                detail: 'Learn how to use our services',
              },
              portfolioBenchmark: {
                title: 'Portfolio Benchmark',
                detail:
                  'We know validtors very well. You can use our prebuilt staking strategies or even invent yours.', //'Make assessment on validators, and select from them to stake.',
              },
              portfolioManagement: {
                title: 'Portfolio Management',
                detail:
                  'Stability is vital for the Long Haul. We will inform you to take action before things changed.', //'Manage after you stake. See rewards and validator status.',
              },
            },
            mobile: {
              warning: 'Mobile not supported yet!',
              warningDetail: 'We are working on it.',
              warningTools: 'Before that, please access our legacy website',
            },
          },
          tools: {
            title: {
              valnom: 'Validator / Nominator Status',
              oneKvMonitor: '1KV Monitor',
              stakingRewards: 'Staking Rewards',
            },
            valnom: {
              title: 'Validator / Nominator Status',
              detail:
                'Useful criterias for both validators and nominators to monitor and evaluate your staking information.',
              subtitle:
                'See filtered validator status or enter a nominator stash ID to see its nominated validators',
              unfavorite: 'Toggle to un-favorite this validator',
              favorite: 'Toggle to favorite this validator',
              filters: {
                sorting: 'Sorting',
              },
              tips: {
                tooManyUnclaimedPayouts: 'Too many unclaimed payouts',
                activeAmounts: 'Active amounts',
                totalAmounts: 'Total amounts',
                apy: 'Annual Percentage Yields',
                averageApy: 'Average APY',
                nominatorCount: 'Nominator Count',
                commission: 'Commission',
              },
              refCode: {
                refGenComplete: 'Referral code generation completed',
                refVerifiedFailed: 'Referral code verification failed',
                refGenFailed: 'Referral code generation failed',
                refGen: 'Get referral code',
                refShare: 'Share referral code',
                signPending: 'Wait for signing',
                refToClipboard: 'Your referral code has been copied to clipboard',
                walletSwitchRequired:
                  'Please switch your wallet to "Validator" or "Controller of validators"',
                refValidator: 'Referral Validator',
                refValidatorNone: 'None',
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
                },
              },
              optionBar: {
                stashId: 'Polkadot/Kusama Stash ID or Name',
              },
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
              },
            },
            stakingRewards: {
              title: 'Staking Rewards',
              detail: 'Exportable reports of your staking rewards.',
              subtitle: 'Query and export your staking rewards',
              noRewards: 'No rewards are found. Please make sure that this address is a stash.',
              description: 'Enter your stash ID to query your staking rewards',
              enter: 'Enter your stash ID',
              optionBar: {
                title: 'Polkadot/Kusama Stash ID',
              },
              table: {
                header: {
                  payoutDate: 'Payout Date',
                  amount: 'Amount',
                  price: 'Price',
                  total: 'Total',
                },
              },
              stashInformation: 'Stash Information',
              stashId: 'Stash ID',
              totalRewards: 'Total Rewards',
              from: 'From',
              to: 'to',
            },
          },
          about: {
            description:
              'We are CryptoLab, we operate Polkadot and Kusama validators. We believe that blockchain will change the way we live, work, and even thought. Our goal is to make everyone enjoys the benefit of blockchain technology.',
            mission: 'Therefore, we build the following services for all of us.',
            mission1: 'A simple, easy-to-use staking service for Polkadot and Kusama HODLers.',
            mission2: 'A bunch of tools for Polkadot and Kusama validator operators.',
          },
          pm: {
            performance: {
              title: 'Performance',
              subtitle: 'Your current statement of profitibility',
            },
            table: {
              header: {
                stash: 'Stash',
                staked: 'Staked Amount',
                profit: 'Profit',
                totalInFiat: 'Profit in Fiat',
                apy: 'APY',
                unclaimedEras: 'Unclaimed Eras',
              },
            },
          },
          benchmark: {
            routes: {
              benchmark: 'Benchmark',
              charts: 'Charts',
            },
            charts: {
              table: {
                header: {
                  network: 'Network',
                  validators: 'Validators',
                  waiting: 'Waiting',
                  nominators: 'Nominators',
                  averageReturns: 'Avg. Returns',
                },
              },
              sd: {
                title: 'Nominator Stake Distribution',
                nominatorCount: 'Nominator Count',
              },
              cd: {
                title: 'Commission Distribution',
                validatorCount: 'Validator Count',
              },
            },
            staking: {
              title: 'Staking',
              strategy: {
                lowRisk: 'Low Risk',
                highApy: 'High Apy',
                decentralized: 'Decentralized',
                onekv: 'One Thousand Validator Program',
                custom: 'Custom',
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
                noFilteredValidators:
                  'The filtered validator count is 0. As such staking operations are not permitted.',
                noSelectedValidators:
                  "You haven't selected any validators yet. As such staking operations are not permitted.",
                fetchingStashData: 'Fetching On-chain data. As such staking operations are not permitted.',
                stashInvalid:
                  'This account cannot operate staking related extrinsics. As such staking operations are not permitted.',
                isValidator:
                  "This account's role is Validator. As such staking operations are not permitted.",
                isControllerOfValidator:
                  "This account's role is Controller of Validator. As such staking operations are not permitted.",
                hasController:
                  "This account's role is Nominator which has a Controller account. As such staking operations are not permitted.",
                maxNominations: 'maximum nomination has reached.',
                installWallet: 'Please install wallet.',
                noAccount:
                  "You currently don't have any accounts. Use the polkadot{.js} extension to create your first account.",
                nominating: 'Processing transaction. As such staking operations are not permitted.',
              },
              table: {
                header: {
                  account: 'Account',
                  selfStake: 'Self Stake',
                  eraInclusion: 'Era Inclusion',
                  unclaimedEras: 'UnclaimedEras',
                  commission: 'Commission',
                  avgApy: 'Avg. APY',
                  active: 'Active',
                },
              },
              controller: {
                enterAddress: 'enter an address',
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
                onekv: '1KV Programme',
              },
              selected: 'Selected',
              filtered: 'Filtered',
              total: 'Total',
              filterResult: 'Filter result',
              balance: 'Balance',
              role: 'Role',
              nominees: 'Nominees',
              bonded: 'Bonded',
              max: 'max',
              transferrable: 'transferrable',
              reserved: 'Reserved',
              redeemable: 'Redeemable',
              strategyString: 'Strategy',
              calculatedApy: 'Estimated APY',
              rewardDest: 'Reward Destination',
              nominate: 'Nominate',
              advanced: 'Advanced',
              subtitle: 'Select the preferred strategy for evaluation',
              supportUs: 'Support Us',
              displayRole: {
                validator: 'Validator',
                controller: 'Controller',
                nominator: 'Nominator',
                none: 'None',
              },
              rewardsDestination: {
                selectOne: '--- Select one ---',
                staked: 'Stash account (increase the amount at stake)',
                stash: 'Stash account (do not increase the amount at stake)',
                controller: 'Controller account',
              },
              timeCircle: {
                day: ' day',
                hrs: ' hrs',
                hr: ' hr',
                mins: ' mins',
                s: ' s',
              },
            },
          },
          Management: {
            routes: {
              performance: {
                title: 'Performance',
                subTitle: 'Your current statement of profitibility',
              },
              notification: {
                title: 'Notification',
                review: 'review',
                overview: {
                  title: 'Overview',
                  event: {
                    total: {
                      title: 'Total events',
                      subtitle: 'Past 7 days',
                    },
                    commission: {
                      title: 'Commission Change events',
                      subtitle: 'Past 7 days',
                    },
                    inactive: {
                      title: 'All inactive events',
                      subtitle: 'Past 7 days',
                    },
                    slash: {
                      title: 'Slash events',
                      subtitle: 'Past 7 days',
                    },
                    // payout: {
                    //   title: 'Payout events',
                    //   subtitle: 'Past 7 days',
                    // },
                    kicks: {
                      title: 'Kicks events',
                      subtitle: 'Past 7 days',
                    },
                    overSubscribes: {
                      title: 'Over subscribes events',
                      subtitle: 'Past 7 days',
                    },
                  },
                },
                alerts: {
                  title: 'Set up alerts',
                  telegram: {
                    title: 'Receive alerts by our Telegram Bot',
                    dialog: {
                      title: 'Join our telegram bot',
                      subtitle: 'https://t.me/cryptolab_nominator_bot',
                    },
                  },
                },
                notification: {
                  title: 'Nofitications',
                  filterTitle: 'Search events',
                  filter: {
                    all: 'all event',
                    commission: 'commission change',
                    slash: 'slash',
                    inactive: 'all inactive',
                    payout: 'payout',
                    kick: 'kick',
                    overSubscribes: 'over subscribe',
                    stalePayout: 'stale payout',
                    chill: 'chill',
                    account: 'search account',
                  },
                  table: {
                    column: {
                      type: 'Event type',
                      description: 'Description',
                      era: 'Era',
                      affectedAccount: 'Affected account',
                    },
                    data: {
                      commission: {
                        title: 'Commission change',
                        validator: 'Validator',
                        action: 'change commission from',
                        to: 'to',
                      },
                      inactive: {
                        title: 'All inactive',
                        description: 'All the validators are inactive in era',
                      },
                      slash: {
                        title: 'Slash',
                        validator: 'Validator',
                        action: 'is slashed by',
                      },
                      payout: {
                        title: 'Payout',
                        validator: 'Validator',
                        action: 'received a payout of',
                      },
                      kick: {
                        title: 'Kick',
                        validator: 'Validator',
                        action: 'kick',
                        nominator: 'nominator',
                      },
                      overSubscribes: {
                        title: 'Over subscribe',
                        validator: 'Validator',
                        action: 'has been over subscribed. There are about ',
                        description: ` of stake that won't receive the payout`,
                      },
                      stalePayout: {
                        title: 'Stale payout',
                        validator: 'Validator',
                        description: 'has',
                        action: 'era without payout',
                      },
                      chill: {
                        title: 'Chill',
                        validator: 'Validator',
                        action: 'has suspended',
                      },
                    },
                  },
                },
              },
            },
          },
          common: {
            error: 'Oops! Something went wrong.',
            empty: 'There is no data to display.',
          },
          banner: {
            nftHolder01: '🔥 Our new product "Alcheneko" is about to launch, join our DC',
            nftHolder02: 'to get the latest news 🚀',
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
              useBenchmark: '開始評估',
            },
            newsletter: {
              subscribe: {
                successful: '感謝您訂閱我們的電子報',
                duplicated: '您已經訂閱過我們的電子報了',
                incorrectFormat: '錯誤的email格式',
                failed: '訂閱失敗',
              },
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
              },
            },
            portal: {
              slogan: '創造穩定的質押收益', //'最大化您的質押收益',
              sloganDetail:
                'CryptoLab 讓持幣人的生活更加愜意。我們協助您獲得質押收益,且無須託管您的資產。質押一次, CryptoLab 將為您處理剩下的事情', //'CryptoLab致力於提供NPoS類型的區塊鏈上質押及管理服務,例如Polkadot以及Kusama。我們的目標是無論您是否懂得區塊鏈技術,都能使用我們的服務,簡單地進行質押及其後的管理。',
              stakingGuide: {
                title: '質押教學',
                detail: '手把手說明如何使用我們的服務',
              },
              portfolioBenchmark: {
                title: '質押評估',
                detail: '我們瞭解驗證節點。您可直接使用我們預先建立的質押策略,或是打造您自己的',
              },
              portfolioManagement: {
                title: '質押管理',
                detail: '穩定性是長期持有的關鍵。在情況發生變化之前,我們會即時通知您並採取行動',
              },
            },
            mobile: {
              warning: '目前不支援手持裝置',
              warningDetail: '我們正在建置中',
              warningTools: '在此之前,請使用我們的既有網站',
            },
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
                sorting: '排序',
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
              refCode: {
                refGenComplete: '推薦碼製作完成',
                refVerifiedFailed: '推薦碼驗證失敗',
                refGenFailed: '推薦碼製作失敗',
                refGen: '產生推薦碼',
                refShare: '分享推薦碼',
                signPending: '等待簽名',
                refToClipboard: '您的推薦碼已複製到剪貼簿',
                walletSwitchRequired: '請切換您的帳號至「驗證人」或「驗證人的控制者」',
                refValidator: '推薦驗證人',
                refValidatorNone: '無',
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
              },
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
                },
              },
              optionBar: {
                stashId: 'Polkadot/Kusama 帳號ID或名稱',
              },
            },
            stakingRewards: {
              title: '質押獎勵查詢',
              detail: '幫助提名人查詢您的質押獎勵, 也能夠將您的質押紀律匯出',
              subtitle: '查詢與匯出您的質押獎勵',
              noRewards: '此帳戶沒有獎勵紀錄',
              description: '輸入您的帳戶 ID以查詢獎勵',
              enter: '輸入您的帳戶 ID',
              optionBar: {
                title: 'Polkadot/Kusama 帳戶 ID',
              },
              table: {
                header: {
                  payoutDate: '獎勵分配日期',
                  amount: '總顆數',
                  price: '當日價格',
                  total: '總價',
                },
              },
              stashInformation: '帳戶資訊',
              stashId: '帳戶 ID',
              totalRewards: '總獎勵',
              from: '從',
              to: '至',
            },
          },
          about: {
            description:
              '我們是 CryptoLab. Polkadot 和 Kusama 驗證節點的運營者. 我們相信區塊鏈技術將改變生活、工作、甚至思考方式。我們的目標是讓每個人都享受到區塊鏈技術帶來的美好',
            mission: '因此,我們為各位建立以下服務',
            mission1: '為持幣者打造的一個直覺易用的質押服務',
            mission2: '為營運者打造的一系列驗證節點輔助工具',
          },
          pm: {
            performance: {
              title: '收益表現',
              subtitle: '您目前的質押收益',
            },
            table: {
              header: {
                stash: '帳戶',
                staked: '質押數量',
                profit: '收益',
                total: '收益(美金)',
                apy: '年化報酬率',
                unclaimedEras: '尚未分配收益的Era數',
              },
            },
          },
          benchmark: {
            routes: {
              benchmark: '評估',
              charts: '圖表',
            },
            charts: {
              table: {
                header: {
                  network: '網路',
                  validators: '驗證人',
                  waiting: '等待中',
                  nominators: '提名人',
                  averageReturns: '平均報酬',
                },
              },
              sd: {
                title: '提名人資金分布',
                nominatorCount: '提名人數量',
              },
              cd: {
                title: '佣金分布',
                validatorCount: '驗證人數量',
              },
            },
            staking: {
              title: '質押',
              strategy: {
                lowRisk: '低風險',
                highApy: '高收益',
                decentralized: '分散提名',
                onekv: 'One Thousand Validator 計畫',
                custom: '自訂',
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
                isValidator: '此帳戶的角色是驗證人 無法執行質押',
                isControllerOfValidator: '此帳戶的角色是驗證人的控制者 無法執行質押',
                hasController: '此帳戶已經設定控制者 無法執行質押',
                maxNominations: '已經到達最大的提名數量.',
                installWallet: '請先安裝錢包',
                noAccount: '您沒有任何帳戶,請先使用錢包 polkadot{.js} 來創建帳戶.',
                nominating: '正在執行質押交易. 在此期間無法操作',
              },
              table: {
                header: {
                  account: '帳戶',
                  selfStake: '驗證人自己質押的數量',
                  eraInclusion: 'Active比例',
                  unclaimedEras: '未分配收益的Era數',
                  commission: '佣金',
                  avgApy: '平均年化報酬率',
                  active: 'Active',
                },
              },
              controller: {
                enterAddress: '輸入一個帳戶',
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
                onekv: '參加1KV 計畫',
              },
              selected: '已選擇',
              filtered: '已篩選',
              total: '總數',
              filterResult: '篩選結果',
              balance: '總金額',
              role: '角色',
              nominees: '提名數量',
              bonded: '綁定',
              max: '最大',
              transferrable: '可轉帳',
              reserved: '保留',
              redeemable: '可解除綁定',
              strategyString: '策略',
              calculatedApy: '預估的年化報酬率',
              rewardDest: '收益對象',
              nominate: '提名',
              advanced: '進階',
              subtitle: '選擇喜歡的策略進行評估',
              supportUs: '支持我們',
              displayRole: {
                validator: '驗證人',
                controller: '控制人',
                nominator: '提名人',
                none: '無',
              },
              rewardsDestination: {
                selectOne: '--- 選擇一個 ---',
                staked: '儲存帳戶(增加質押數量)',
                stash: '儲存帳戶(不增加質押數量)',
                controller: '控制帳戶',
              },
              timeCircle: {
                day: ' 天',
                hrs: ' 小時',
                hr: ' 小時',
                mins: ' 分',
                s: ' 秒',
              },
            },
          },
          Management: {
            routes: {
              performance: {
                title: '表現',
                subTitle: '您當前的盈利能力報表',
              },
              notification: {
                title: '通知',
                review: '審視',
                overview: {
                  title: '總覽',
                  event: {
                    total: {
                      title: '通知總數',
                      subtitle: '過去 7 天',
                    },
                    commission: {
                      title: '佣金變更通知數',
                      subtitle: '過去 7 天',
                    },
                    inactive: {
                      title: '離線通知數',
                      subtitle: '過去 7 天',
                    },
                    slash: {
                      title: '罰款通知數',
                      subtitle: '過去 7 天',
                    },
                    // payout: {
                    //   title: '支付獎勵通知數',
                    //   subtitle: '過去 7 天',
                    // },
                    kicks: {
                      title: '移除提名人通知數',
                      subtitle: '過去 7 天',
                    },
                    overSubscribes: {
                      title: '超額訂閱通知數',
                      subtitle: '過去 7 天',
                    },
                  },
                },
                alerts: {
                  title: '訂閱通知',
                  telegram: {
                    title: '使用 Telegram Bot 接收通知',
                    dialog: {
                      title: '加入我們的 telegram bot',
                      subtitle: 'https://t.me/cryptolab_nominator_bot',
                    },
                  },
                },
                notification: {
                  title: '通知列表',
                  filterTitle: '搜尋通知',
                  filter: {
                    all: '所有通知',
                    commission: '佣金變更通知',
                    slash: '罰款通知',
                    inactive: '離線通知',
                    payout: '支付獎勵通知',
                    kick: '移除提名人通知',
                    overSubscribes: '超額訂閱通知',
                    stalePayout: '未支付獎勵通知',
                    chill: '暫停運作通知',
                    account: '搜尋帳號',
                  },
                  table: {
                    column: {
                      type: '通知類型',
                      description: '內容',
                      era: 'Era',
                      affectedAccount: '受影響帳號',
                    },
                    data: {
                      commission: {
                        title: '佣金變更',
                        validator: '驗證節點',
                        action: '更改佣金從',
                        to: '到',
                      },
                      inactive: {
                        title: '全節點離線',
                        description: '所有驗證節點皆離線在 Era',
                      },
                      slash: {
                        title: '罰款',
                        validator: '驗證節點',
                        action: '被罰款',
                      },
                      payout: {
                        title: '收到獎勵',
                        validator: '驗證節點',
                        action: '收到獎勵',
                      },
                      kick: {
                        title: '移除提名人',
                        validator: '驗證節點',
                        action: '移除',
                        nominator: '提名人',
                      },
                      overSubscribes: {
                        title: '超額訂閱',
                        validator: '驗證節點',
                        action: '已經被超額訂閱, 共有',
                        description: ' 的質押無法領取相對應的獎勵',
                      },
                      stalePayout: {
                        title: '未支付獎勵',
                        validator: '驗證節點',
                        description: '已經有',
                        action: 'era 沒有支付獎勵',
                      },
                      chill: {
                        title: '暫停運作',
                        validator: '驗證節點',
                        action: '暫停運作',
                      },
                    },
                  },
                },
              },
            },
          },
          common: {
            error: '糟糕! 發生了一些錯誤',
            empty: '沒有要顯示的數據',
          },
          banner: {
            nftHolder01: '🔥 我們的新產品「煉金喵」即將登場, 現在加入我們的 DC 群',
            nftHolder02: '掌握最新消息 🚀',
          },
        },
      },
      'zh-CN': {
        translation: {
          app: {
            title: {
              stakingGuide: '质押教学',
              portfolioBenchmark: '质押评估',
              portfolioManagement: '质押管理',
              useBenchmark: '开始评估',
            },
            newsletter: {
              subscribe: {
                successful: '感谢您订阅我们的电子报',
                duplicated: '您已经订阅过我们的电子报了',
                incorrectFormat: '错误的email格式',
                failed: '订阅失败',
              },
            },
            footer: {
              title: {
                about: '关于我们',
                contact: '联系我们',
                ourValidators: '我们的验证节点',
                technology: '技术',
                stakingService: '质押服务',
                toolsForValidators: '验证人工具',
                telegramBots: 'Telegram 机器人',
                community: '社群',
                blog: '部落格',
                medium: 'Medium',
                subscribeDescription: '订阅电子报来获得CryptoLab的最新消息',
                subscribe: '订阅',
                enterEmail: '输入您的Email地址',
                disclaimer: '使用条款',
                privacyPolicy: '隐私权政策',
                general: '一般',
                language: '多国语系',
              },
            },
            portal: {
              slogan: '创造稳定的质押收益',
              sloganDetail:
                'CryptoLab 让持币人的生活更加惬意。 我们协助您获得质押收益,且无须托管您的资产。 质押一次, CryptoLab 将为您处理剩下的事情',
              stakingGuide: {
                title: '质押教学',
                detail: '手把手说明如何使用我们的服务',
              },
              portfolioBenchmark: {
                title: '质押评估',
                detail: '我们了解验证节点。 您可直接使用我们预先建立的质押策略,或是打造您自己的',
              },
              portfolioManagement: {
                title: '质押管理',
                detail: '稳定性是长期持有的关键。 在情况发生变化之前,我们会即时通知您并采取行动',
              },
            },
            mobile: {
              warning: '目前不支持手持设备',
              warningDetail: '我们正在建置中',
              warningTools: '在此之前,请使用我们的既有网站',
            },
          },
          tools: {
            title: {
              valnom: '验证人/提名人状态',
              oneKvMonitor: '1KV 提名人信息',
              stakingRewards: '质押奖励查询',
            },
            valnom: {
              title: '验证人/提名人状态',
              detail: '提供验证人以及提名人实用的工具以便评估您的质押状态',
              subtitle: '可按条件过滤验证人信息 也可以搜索提名人的ID来查询您提名的节点运行的状况',
              unfavorite: '点击此图标取消关注此验证人',
              favorite: '点击此图标以关注此验证人',
              filters: {
                sorting: '排序',
              },
              tips: {
                tooManyUnclaimedPayouts: '过多未分配的奖励',
                activeAmounts: '此Era提名您的质押总数',
                totalAmounts: '所有提名您的质押总数',
                apy: '年化报酬率',
                averageApy: '平均年化报酬率',
                nominatorCount: '提名人总数',
                commission: '佣金',
              },
              refCode: {
                refGenComplete: '推荐码制作完成',
                refVerifiedFailed: '推荐码验证失败',
                refGenFailed: '推荐码制作失败',
                refGen: '产生推荐码',
                refShare: '分享推荐码',
                signPending: '等待签名',
                refToClipboard: '您的推荐码已复制到剪贴簿',
                walletSwitchRequired: '请切换您的帐号至「验证人」或「验证人的控制者」',
                refValidator: '推荐验证人',
                refValidatorNone: '无',
              },
            },
            validators: {
              apy: '年化报酬率',
              nominatorCount: '提名人总数',
              commission: '佣金',
              selfStake: '本身的质押数',
              unclaimedEras: '未分配奖励的Era数',
              slashes: '惩罚次数',
              activeNominators: '此Era将Stake分配给您的提名人',
              inactiveNominators: '此Era未将Stake分配给您的提名人',
              errors: {
                incorrectValidator1: '不存在的验证人',
                incorrectValidator2: '请确认您输入正确的ID',
              },
            },
            oneKv: {
              title: '1KV 提名人信息',
              detail: '帮助运行1KV节点的人能够评估何时将会被提名',
              seeInvalid: '查看不符合规则的节点',
              seeValid: '查看匹配规则的节点',
              subtitle: '提名顺序以及1KV节点的详细信息',
              era: 'Era',
              validValidators: '符合规则的验证人',
              activeValidators: '验证中的验证人',
              electedValidators: '1KV提名的验证人',
              lastUpdateTime: '最近的数据更新时间',
              table: {
                header: {
                  era: 'Era',
                  dashboard: '仪表板',
                  name: '名称',
                  commission: '佣金',
                  active: '验证中',
                  oneKvNominated: '1KV提名中',
                  nominationOrder: '下次提名顺序',
                  selfStake: '本身的质押数',
                  rank: '排名',
                  inclusion: '提名率',
                  reasons: '原因',
                },
              },
              optionBar: {
                stashId: 'Polkadot/Kusama 帐户ID或名称',
              },
            },
            stakingRewards: {
              title: '质押奖励查询',
              detail: '帮助提名人查询您的质押奖励, 也能够将您的质押纪律导出',
              subtitle: '查询与导出您的质押奖励',
              noRewards: '此账户没有奖励日志',
              description: '输入您的帐户 ID以查询奖励',
              enter: '输入您的帐户ID',
              optionBar: {
                title: 'Polkadot/Kusama 账户 ID',
              },
              table: {
                header: {
                  payoutDate: '奖励分配日期',
                  amount: '总颗数',
                  price: '当日价格',
                  total: '总价',
                },
              },
              stashInformation: '帐户信息',
              stashId: '账户 ID',
              totalRewards: '总奖励',
              from: '从',
              to: '至',
            },
          },
          about: {
            description:
              '我们是 CryptoLab. Polkadot 和 Kusama 验证节点的运营者. 我们相信区块链技术将改变生活、工作、甚至思考方式。 我们的目标是让每个人都享受到区块链技术带来的美好',
            mission: '因此,我们为各位建立以下服务',
            mission1: '为持币者打造的一个直觉易用的质押服务',
            mission2: '为运营者打造的一系列验证节点辅助工具',
          },
          benchmark: {
            routes: {
              benchmark: '评估',
              charts: '图表',
            },
            charts: {
              table: {
                header: {
                  network: '网络',
                  validators: '验证人',
                  waiting: '等待中',
                  nominators: '提名人',
                  averageReturns: '平均报酬',
                },
              },
              sd: {
                title: '提名人资金分布',
                nominatorCount: '提名人数量',
              },
              cd: {
                title: '佣金分布',
                validatorCount: '验证人数量',
              },
            },
            staking: {
              title: '质押',
              strategy: {
                lowRisk: '低风险',
                highApy: '高收益',
                decentralized: '分散提名',
                onekv: 'One Thousand Validator 计划',
                custom: '自订',
              },
              selectWallet: '（请选择一个钱包）',
              warnings: {
                transactionInvalid: '无效的交易',
                transactionReady: '交易已经准备好',
                transactionBroadcasted: '交易已经在链上广播',
                transactionIsIncluded: '交易已经被包含在区块中',
                transactionIsIncludedInBlock: '交易已经被包含在区块',
                transactionSucceeded: '质押完成',
                transactionFailed: '质押失败',
                disconnectedFirst: '您已经从区块链',
                disconnectedSecond: '网络断开, 请稍待或刷新页面',
                fetching: '正在抓取验证人清单. 在此期间无法执行质押',
                noFilteredValidators: '您过滤验证人条件后可选择的验证人数量为0. 请选择新的条件',
                noSelectedValidators: '您没有选择任何验证人. 请选择至少一个',
                fetchingStashData: '正在抓取链上的资料. 在此期间无法执行质押',
                stashInvalid: '此账户没有执行质押相关操作的权限',
                isValidator: '此账户的角色是验证人 无法执行质押',
                isControllerOfValidator: '此账户的角色是验证人的控制者 无法执行质押',
                hasController: '此账户已经设定控制者 无法执行质押',
                maxNominations: '已经到达最大的提名数量.',
                installWallet: '请先安装钱包',
                noAccount: '您没有任何帐户,请先使用钱包 polkadot{.js} 来创建帐户.',
                nominating: '正在执行质押交易. 在此期间无法操作',
              },
              table: {
                header: {
                  account: '帐户',
                  selfStake: '验证人自己质押的数量',
                  eraInclusion: 'Active比例',
                  unclaimedEras: '未分配收益的Era数',
                  commission: '佣金',
                  avgApy: '平均年化报酬率',
                  active: 'Active',
                },
              },
              controller: {
                enterAddress: '输入一个帐户',
                controllerAccount: '控制人帐户',
                account: '帐户',
                controller: '控制人',
              },
              advancedSettings: '高级设置',
              filters: {
                minSelfStake: '最小验证人质押数',
                maxUnclaimedEras: '最大未分配收益的Era数',
                apy: '平均年化报酬率',
                minEraInclusionRate: '最小Active比例',
                hasIdentity: '有身份认证',
                isSubIdent: '为子帐户',
                minApy: '最小年化报酬率',
                decentralized: '只选择一个同身份的验证者',
                onekv: '参加1KV 计划',
              },
              selected: '已选择',
              filtered: '已筛选',
              total: '总数',
              filterResult: '筛选结果',
              balance: '总金额',
              role: '角色',
              nominees: '提名数量',
              bonded: '绑定',
              max: '最大',
              transferrable: '可转账',
              reserved: '保留',
              redeemable: '可解除绑定',
              strategyString: '策略',
              calculatedApy: '预估的年化报酬率',
              rewardDest: '收益对象',
              nominate: '提名',
              advanced: '进阶',
              subtitle: '选择喜欢的策略进行评估',
              supportUs: '支持我们',
              displayRole: {
                validator: '验证人',
                controller: '控制人',
                nominator: '提名人',
                none: '无',
              },
              rewardsDestination: {
                selectOne: '--- 选择一个 ---',
                staked: '储存账户（增加质押数量）',
                stash: '储存账户（不增加质押数量）',
                controller: '控制帐户',
              },
              timeCircle: {
                day: ' 天',
                hrs: ' 小时',
                hr: ' 小时',
                mins: ' 分',
                s: ' 秒',
              },
            },
          },
          Management: {
            routes: {
              performance: {
                title: '表现',
                subTitle: '您当前的盈利能力报表',
              },
              notification: {
                title: '通知',
                review: '审视',
                overview: {
                  title: '总览',
                  event: {
                    total: {
                      title: '通知总数',
                      subtitle: '過去',
                    },
                    commission: {
                      title: '佣金变更通知数',
                      subtitle: '过去 7 天',
                    },
                    inactive: {
                      title: '离线通知数',
                      subtitle: '过去 7 天',
                    },
                    slash: {
                      title: '罚款通知数',
                      subtitle: '过去 7 天',
                    },
                    // payout: {
                    //   title: '支付奖励通知数',
                    //   subtitle: '过去 7 天',
                    // },
                    kicks: {
                      title: '移除提名人通知数',
                      subtitle: '过去 7 天',
                    },
                    overSubscribes: {
                      title: '超额订阅通知数',
                      subtitle: '过去 7 天',
                    },
                  },
                },
                alerts: {
                  title: '订阅通知',
                  telegram: {
                    title: '使用 Telegram Bot 接收通知',
                    dialog: {
                      title: '加入我们的 telegram bot',
                      subtitle: 'https://t.me/cryptolab_nominator_bot',
                    },
                  },
                },
                notification: {
                  title: '通知列表',
                  filterTitle: '搜寻通知',
                  filter: {
                    all: '所有通知',
                    commission: '佣金变更通知',
                    slash: '罚款通知',
                    inactive: '离线通知',
                    payout: '支付奖励通知',
                    kick: '移除提名人通知',
                    overSubscribes: '超额订阅通知',
                    stalePayout: '未支付奖励通知',
                    chill: '暂停运作通知',
                    account: '搜寻帐号',
                  },
                  table: {
                    column: {
                      type: '通知类型',
                      description: '内容',
                      era: 'Era',
                      affectedAccount: '受影响帐号',
                    },
                    data: {
                      commission: {
                        title: '佣金变更',
                        validator: '验证节点',
                        action: '更改佣金从',
                        to: '到',
                      },
                      inactive: {
                        title: '全节点离线',
                        description: '所有验证节点皆离线在 Era',
                      },
                      slash: {
                        title: '罚款',
                        validator: '验证节点',
                        action: '被罚款',
                      },
                      payout: {
                        title: '收到奖励',
                        validator: '验证节点',
                        action: '收到奖励',
                      },
                      kick: {
                        title: '移除提名人',
                        validator: '验证节点',
                        action: '移除',
                        nominator: '提名人',
                      },
                      overSubscribes: {
                        title: '超额订阅',
                        validator: '验证节点',
                        action: '已经被超额订阅, 共有 ',
                        description: ' 的质押无法领取相对应的奖励',
                      },
                      stalePayout: {
                        title: '未支付奖励',
                        validator: '验证节点',
                        description: '已经有',
                        action: 'era 没有支付奖励',
                      },
                      chill: {
                        title: '暂停运作',
                        validator: '验证节点',
                        action: '暂停运作',
                      },
                    },
                  },
                },
              },
            },
          },
          common: {
            error: '糟糕！发生了一些错误',
            empty: '没有要显示的数据',
          },
          banner: {
            nftHolder01: '🔥 我们的新产品「炼金喵」即将登场, 现在加入我们的 DC 群',
            nftHolder02: '掌握最新消息 🚀',
          },
        },
      },
    },
  });
export default i18n;

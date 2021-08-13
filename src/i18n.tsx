import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
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
                toolsForValidators: 'toolsForValidators',
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
              }
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
              detail: 'Information that allow 1kv node operators to predict when they will be nominated.'
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
            },
            stakingRewards: {
              title: 'Staking Rewards',
              detail: 'Exportable reports of your staking rewards.'
            },
          }
        }
      },
      'zh-Hant-TW': {
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
              }
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
            },
            oneKv: {
              title: '1KV 提名人資訊',
              detail: '幫助運行1KV節點的人能夠評估何時將會被提名'
            },
            stakingRewards: {
              title: '質押獎勵查詢',
              detail: '幫助提名人查詢您的質押獎勵, 也能夠將您的質押紀律匯出'
            },
          }
        }
      }
    }
  });
i18n.changeLanguage('zh-Hant-TW');
export default i18n;
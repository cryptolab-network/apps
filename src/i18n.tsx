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
                disclaimer: 'Disclaimer',
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
            },
            oneKv: {
              title: '1KV Monitor',
              detail: 'Information that allow 1kv node operators to predict when they will be nominated.'
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
                disclaimer: '免責聲明',
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
import { i18n } from '@lingui/core';
import moment from 'moment';
import {
  en,
  zh,
} from 'make-plural/plurals';
import * as materialLocales from '@material-ui/core/locale';

const catalogEn = require('../locales/en-US/messages');

const catalogZh = require('../locales/zh-TW/messages');
const catalogZhCN = require('../locales/zh-CN/messages');

export const defaultLocale = 'en-US';

// https://www.codetwo.com/admins-blog/list-of-office-365-language-id/
// https://www.venea.net/web/culture_code
export const locales = [
 
  {
    locale: 'en-US',
    label: 'English',
  },
 {
    locale: 'zh-TW',
    label: '繁體中文',
  },
  {
    locale: 'zh-CN',
    label: '简体中文',
  },
  
];


i18n.loadLocaleData('en-US', { plurals: en });
i18n.loadLocaleData('zh-TW', { plurals: zh });
i18n.loadLocaleData('zh-CN', { plurals: zh });

i18n.load('en-US', catalogEn.messages);
i18n.load('zh-TW', catalogZh.messages);
i18n.load('zh-CN', catalogZhCN.messages);

export function getMaterialLocale(locale: string) {
  const materialLocale = locale.replace('-', '');
  return materialLocales[materialLocale] ?? materialLocales.enUS;
}

export function activateLocale(locale: string) {
  i18n.activate(locale);
  moment.locale([locale, 'en']);

  // @ts-ignore
  if (typeof window !== 'undefined') {
    window.ipcRenderer?.send('set-locale', locale);
  }
}

export { i18n };

activateLocale(defaultLocale);

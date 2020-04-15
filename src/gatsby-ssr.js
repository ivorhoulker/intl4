import React from 'react';
import { Helmet } from 'react-helmet';
import { DEFAULT_OPTIONS } from './constants';

/**
 * Wrap all pages with a Translation provider and set the language on SSR time
 */
export const wrapPageElement = ({ element, props }, pluginOptions) => {
  const { excludedPages, supportedLanguages, siteUrl, defaultLanguage } = {
    ...DEFAULT_OPTIONS,
    ...pluginOptions,
  };

  // The fallbacks are for pages that are non-localized. The only pages that are non localized are
  // the original ones which are only there if `deleteOriginalPages` option is `false`
  const lang = props.pageContext.lang || defaultLanguage;
  const originalPath = props.pageContext.originalPath || props.location.pathname;

  if (excludedPages.includes(props.location.pathname)) {
    return element;
  }
  const langUrlDict = {
    'zh-Hant': 'hk',
    'zh-Hans': 'cn',
    'en-US': 'en',
    'en-GB': 'en',
    en: 'en',
    zh: 'zh',
  };
  return (
    <React.Fragment>
      <Helmet htmlAttributes={{ lang, dir: 'ltr' }}>
        <meta property="og:locale" content={lang} />
        <link rel="canonical" href={`${siteUrl}/${langUrlDict[lang]}${originalPath}`} />
        <link rel="alternate" href={`${siteUrl}${originalPath}`} hrefLang="x-default" />
        {supportedLanguages.map((supportedLang) => (
          <link
            rel="alternate"
            href={`${siteUrl}/${langUrlDict[supportedLang]}${originalPath}`}
            hrefLang={supportedLang}
            key={supportedLang}
          />
        ))}
      </Helmet>
      {element}
    </React.Fragment>
  );
};

// Country code to currency code mapping
// This maps ISO country codes to their corresponding currency codes
export const COUNTRY_CURRENCY_MAP: { [key: string]: string } = {
  // Americas
  'DO': 'DOP',  // Dominican Republic
  'CO': 'COP',  // Colombia
  'MX': 'MXN',  // Mexico
  'BR': 'BRL',  // Brazil
  'AR': 'ARS',  // Argentina
  'CL': 'CLP',  // Chile
  'PE': 'PEN',  // Peru
  'UY': 'UYU',  // Uruguay
  'PY': 'PYG',  // Paraguay
  'BO': 'BOB',  // Bolivia
  'HT': 'HTG',  // Haiti
  'JM': 'JMD',  // Jamaica
  'TT': 'TTD',  // Trinidad and Tobago
  'BB': 'BBD',  // Barbados
  'BS': 'BSD',  // Bahamas
  'CU': 'CUP',  // Cuba
  'CR': 'CRC',  // Costa Rica
  'NI': 'NIO',  // Nicaragua
  'HN': 'HNL',  // Honduras
  'GT': 'GTQ',  // Guatemala
  'BZ': 'BZD',  // Belize
  'US': 'USD',  // United States
  'CA': 'CAD',  // Canada
  'VE': 'VES',  // Venezuela
  'EC': 'USD',  // Ecuador
  'GY': 'GYD',  // Guyana
  'SR': 'SRD',  // Suriname
  'FK': 'FKP',  // Falkland Islands
  'GF': 'EUR',  // French Guiana
  'PR': 'USD',  // Puerto Rico
  'AW': 'AWG',  // Aruba
  'CW': 'ANG',  // Curaçao
  'SX': 'ANG',  // Sint Maarten
  'BQ': 'USD',  // Caribbean Netherlands
  'AI': 'XCD',  // Anguilla
  'VG': 'USD',  // British Virgin Islands
  'VI': 'USD',  // U.S. Virgin Islands
  'KY': 'KYD',  // Cayman Islands
  'TC': 'USD',  // Turks and Caicos
  'BM': 'BMD',  // Bermuda
  'GL': 'DKK',  // Greenland
  'IS': 'ISK',  // Iceland

  // Europe
  'ES': 'EUR',  // Spain
  'FR': 'EUR',  // France
  'DE': 'EUR',  // Germany
  'IT': 'EUR',  // Italy
  'GB': 'GBP',  // United Kingdom
  'CH': 'CHF',  // Switzerland
  'SE': 'SEK',  // Sweden
  'DK': 'DKK',  // Denmark
  'NO': 'NOK',  // Norway
  'NL': 'EUR',  // Netherlands
  'BE': 'EUR',  // Belgium
  'AT': 'EUR',  // Austria
  'PT': 'EUR',  // Portugal
  'IE': 'EUR',  // Ireland
  'FI': 'EUR',  // Finland
  'LU': 'EUR',  // Luxembourg
  'MT': 'EUR',  // Malta
  'CY': 'EUR',  // Cyprus
  'EE': 'EUR',  // Estonia
  'LV': 'EUR',  // Latvia
  'LT': 'EUR',  // Lithuania
  'SI': 'EUR',  // Slovenia
  'SK': 'EUR',  // Slovakia
  'HR': 'HRK',  // Croatia
  'BG': 'BGN',  // Bulgaria
  'RO': 'RON',  // Romania
  'HU': 'HUF',  // Hungary
  'CZ': 'CZK',  // Czech Republic
  'PL': 'PLN',  // Poland
  'GR': 'EUR',  // Greece
  'RS': 'RSD',  // Serbia
  'ME': 'EUR',  // Montenegro
  'AL': 'ALL',  // Albania
  'MK': 'MKD',  // North Macedonia
  'BA': 'BAM',  // Bosnia and Herzegovina
  'XK': 'EUR',  // Kosovo
  'MD': 'MDL',  // Moldova
  'UA': 'UAH',  // Ukraine
  'BY': 'BYN',  // Belarus
  'RU': 'RUB',  // Russia
  'TR': 'TRY',  // Turkey
  'GE': 'GEL',  // Georgia
  'AM': 'AMD',  // Armenia
  'AZ': 'AZN',  // Azerbaijan
  'KZ': 'KZT',  // Kazakhstan
  'KG': 'KGS',  // Kyrgyzstan
  'TJ': 'TJS',  // Tajikistan
  'TM': 'TMT',  // Turkmenistan
  'UZ': 'UZS',  // Uzbekistan
  'MN': 'MNT',  // Mongolia

  // Asia
  'JP': 'JPY',  // Japan
  'CN': 'CNY',  // China
  'IN': 'INR',  // India
  'SG': 'SGD',  // Singapore
  'KR': 'KRW',  // South Korea
  'TH': 'THB',  // Thailand
  'VN': 'VND',  // Vietnam
  'MY': 'MYR',  // Malaysia
  'ID': 'IDR',  // Indonesia
  'PH': 'PHP',  // Philippines
  'TW': 'TWD',  // Taiwan
  'HK': 'HKD',  // Hong Kong
  'BD': 'BDT',  // Bangladesh
  'PK': 'PKR',  // Pakistan
  'LK': 'LKR',  // Sri Lanka
  'NP': 'NPR',  // Nepal
  'BT': 'BTN',  // Bhutan
  'MV': 'MVR',  // Maldives
  'MM': 'MMK',  // Myanmar
  'LA': 'LAK',  // Laos
  'KH': 'KHR',  // Cambodia
  'BN': 'BND',  // Brunei
  'TL': 'USD',  // East Timor
  'PG': 'PGK',  // Papua New Guinea
  'FJ': 'FJD',  // Fiji
  'NC': 'XPF',  // New Caledonia
  'PF': 'XPF',  // French Polynesia
  'WS': 'WST',  // Samoa
  'TO': 'TOP',  // Tonga
  'KI': 'AUD',  // Kiribati
  'TV': 'AUD',  // Tuvalu
  'NR': 'AUD',  // Nauru
  'PW': 'USD',  // Palau
  'MH': 'USD',  // Marshall Islands
  'FM': 'USD',  // Micronesia
  'GU': 'USD',  // Guam
  'MP': 'USD',  // Northern Mariana Islands
  'AS': 'USD',  // American Samoa
  'CK': 'NZD',  // Cook Islands
  'NU': 'NZD',  // Niue
  'TK': 'NZD',  // Tokelau
  'WF': 'XPF',  // Wallis and Futuna
  'VU': 'VUV',  // Vanuatu
  'SB': 'SBD',  // Solomon Islands
  'AU': 'AUD',  // Australia
  'NZ': 'NZD',  // New Zealand

  // Africa
  'ZA': 'ZAR',  // South Africa
  'EG': 'EGP',  // Egypt
  'NG': 'NGN',  // Nigeria
  'KE': 'KES',  // Kenya
  'MA': 'MAD',  // Morocco
  'DZ': 'DZD',  // Algeria
  'TN': 'TND',  // Tunisia
  'GH': 'GHS',  // Ghana
  'ET': 'ETB',  // Ethiopia
  'UG': 'UGX',  // Uganda
  'TZ': 'TZS',  // Tanzania
  'SD': 'SDG',  // Sudan
  'LY': 'LYD',  // Libya
  'CM': 'XAF',  // Cameroon
  'CI': 'XOF',  // Côte d'Ivoire
  'SN': 'XOF',  // Senegal
  'ML': 'XOF',  // Mali
  'BF': 'XOF',  // Burkina Faso
  'NE': 'XOF',  // Niger
  'TD': 'XAF',  // Chad
  'CF': 'XAF',  // Central African Republic
  'GA': 'XAF',  // Gabon
  'CG': 'XAF',  // Republic of the Congo
  'CD': 'CDF',  // Democratic Republic of the Congo
  'AO': 'AOA',  // Angola
  'ZM': 'ZMW',  // Zambia
  'ZW': 'ZWL',  // Zimbabwe
  'BW': 'BWP',  // Botswana
  'NA': 'NAD',  // Namibia
  'LS': 'LSL',  // Lesotho
  'SZ': 'SZL',  // Eswatini
  'MG': 'MGA',  // Madagascar
  'MU': 'MUR',  // Mauritius
  'SC': 'SCR',  // Seychelles
  'KM': 'KMF',  // Comoros
  'DJ': 'DJF',  // Djibouti
  'ER': 'ERN',  // Eritrea
  'SO': 'SOS',  // Somalia
  'BI': 'BIF',  // Burundi
  'RW': 'RWF',  // Rwanda
  'MW': 'MWK',  // Malawi
  'MZ': 'MZN',  // Mozambique
  'ST': 'STN',  // São Tomé and Príncipe
  'CV': 'CVE',  // Cape Verde
  'GM': 'GMD',  // Gambia
  'GN': 'GNF',  // Guinea
  'GW': 'XOF',  // Guinea-Bissau
  'SL': 'SLE',  // Sierra Leone
  'LR': 'LRD',  // Liberia
  'TG': 'XOF',  // Togo
  'BJ': 'XOF',  // Benin
  'MR': 'MRU',  // Mauritania
  'EH': 'MAD',  // Western Sahara
  'SS': 'SSP',  // South Sudan
  'GQ': 'XAF',  // Equatorial Guinea

  // Middle East
  'SA': 'SAR',  // Saudi Arabia
  'AE': 'AED',  // United Arab Emirates
  'QA': 'QAR',  // Qatar
  'KW': 'KWD',  // Kuwait
  'BH': 'BHD',  // Bahrain
  'OM': 'OMR',  // Oman
  'JO': 'JOD',  // Jordan
  'LB': 'LBP',  // Lebanon
  'SY': 'SYP',  // Syria
  'IQ': 'IQD',  // Iraq
  'IR': 'IRR',  // Iran
  'AF': 'AFN',  // Afghanistan
  'PS': 'ILS',  // Palestine
  'IL': 'ILS',  // Israel
  'YE': 'YER'   // Yemen
};

// Currency code to symbol mapping
export const CURRENCY_SYMBOL_MAP: { [key: string]: string } = {
  'EUR': '€',
  'JPY': '¥',
  'GBP': '£',
  'CAD': 'C$',
  'AUD': 'A$',
  'CNY': '¥',
  'INR': '₹',
  'BRL': 'R$',
  'MXN': '$',
  'COP': '$',
  'DOP': 'RD$',
  'CHF': 'CHF',
  'SEK': 'kr',
  'DKK': 'kr',
  'NOK': 'kr',
  'SGD': 'S$',
  'KRW': '₩',
  'THB': '฿',
  'VND': '₫',
  'MYR': 'RM',
  'IDR': 'Rp',
  'PHP': '₱',
  'TWD': 'NT$',
  'HKD': 'HK$',
  'ARS': '$',
  'CLP': '$',
  'PEN': 'S/',
  'UYU': '$',
  'PYG': '₲',
  'BOB': 'Bs',
  'HTG': 'G',
  'JMD': 'J$',
  'TTD': 'TT$',
  'BBD': 'Bds$',
  'BSD': '$',
  'CUP': '$',
  'CRC': '₡',
  'NIO': 'C$',
  'HNL': 'L',
  'GTQ': 'Q',
  'BZD': 'BZ$',
  'ZAR': 'R',
  'EGP': 'E£',
  'NGN': '₦',
  'KES': 'KSh',
  'MAD': 'د.م.',
  'DZD': 'د.ج',
  'TND': 'د.ت',
  'GHS': 'GH₵',
  'ETB': 'Br',
  'UGX': 'USh',
  'TZS': 'TSh',
  'SDG': 'ج.س.',
  'LYD': 'ل.د',
  'XAF': 'FCFA',
  'XOF': 'CFA',
  'CDF': 'FC',
  'AOA': 'Kz',
  'ZMW': 'K',
  'ZWL': '$',
  'BWP': 'P',
  'NAD': 'N$',
  'LSL': 'L',
  'SZL': 'E',
  'MGA': 'Ar',
  'MUR': '₨',
  'SCR': '₨',
  'KMF': 'CF',
  'DJF': 'Fdj',
  'ERN': 'Nfk',
  'SOS': 'Sh',
  'BIF': 'FBu',
  'RWF': 'FRw',
  'MWK': 'MK',
  'MZN': 'MT',
  'FJD': 'FJ$',
  'PGK': 'K',
  'SBD': 'SI$',
  'VUV': 'VT',
  'XPF': 'CFP',
  'WST': 'T',
  'TOP': 'T$',
  'USD': '$',
  'VES': 'Bs',
  'GYD': 'G$',
  'SRD': '$',
  'FKP': '£',
  'AWG': 'ƒ',
  'ANG': 'ƒ',
  'XCD': '$',
  'KYD': '$',
  'BMD': '$',
  'ISK': 'kr',
  'HRK': 'kn',
  'BGN': 'лв',
  'RON': 'lei',
  'HUF': 'Ft',
  'CZK': 'Kč',
  'PLN': 'zł',
  'RSD': 'дин',
  'ALL': 'L',
  'MKD': 'ден',
  'BAM': 'KM',
  'MDL': 'L',
  'UAH': '₴',
  'BYN': 'Br',
  'RUB': '₽',
  'TRY': '₺',
  'GEL': '₾',
  'AMD': '֏',
  'AZN': '₼',
  'KZT': '₸',
  'KGS': 'с',
  'TJS': 'ЅМ',
  'TMT': 'T',
  'UZS': 'so\'m',
  'MNT': '₮',
  'BDT': '৳',
  'PKR': '₨',
  'LKR': 'රු',
  'NPR': 'रू',
  'BTN': 'Nu',
  'MVR': 'Rf',
  'MMK': 'K',
  'LAK': '₭',
  'KHR': '៛',
  'BND': '$',
  'SAR': 'ر.س',
  'AED': 'د.إ',
  'QAR': 'ر.ق',
  'KWD': 'د.ك',
  'BHD': 'د.ب',
  'OMR': 'ر.ع',
  'JOD': 'د.أ',
  'LBP': 'ل.ل',
  'SYP': 'ل.س',
  'IQD': 'ع.د',
  'IRR': '﷼',
  'AFN': '؋',
  'ILS': '₪',
  'YER': '﷼',
  'STN': 'Db',
  'CVE': '$',
  'GMD': 'D',
  'GNF': 'FG',
  'SLE': 'Le',
  'LRD': '$',
  'MRU': 'UM',
  'SSP': '£'
};

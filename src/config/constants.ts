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

  // Oceania
  'AU': 'AUD',  // Australia
  'FJ': 'FJD',  // Fiji
  'PG': 'PGK',  // Papua New Guinea
  'SB': 'SBD',  // Solomon Islands
  'VU': 'VUV',  // Vanuatu
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
  'MZ': 'MZN'   // Mozambique
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
  'USD': '$'
};

// CDC Country Slug Mappings
// Maps country names from OpenCage to official CDC slugs used in URLs

export const CDC_COUNTRY_SLUGS: { [key: string]: string } = {
  // Major countries
  'united states': 'united-states',
  'usa': 'united-states',
  'us': 'united-states',
  'united kingdom': 'great-britain',
  'uk': 'great-britain',
  'great britain': 'great-britain',
  'england': 'great-britain',
  'spain': 'spain',
  'france': 'france',
  'germany': 'germany',
  'italy': 'italy',
  'japan': 'japan',
  'china': 'china',
  'india': 'india',
  'brazil': 'brazil',
  'mexico': 'mexico',
  'canada': 'canada',
  'australia': 'australia',
  'new zealand': 'new-zealand',
  
  // Caribbean
  'dominican': 'dominican-republic',
  'dominican republic': 'dominican-republic',
  'jamaica': 'jamaica',
  'bahamas': 'bahamas',
  'barbados': 'barbados',
  'cuba': 'cuba',
  'haiti': 'haiti',
  'puerto rico': 'puerto-rico',
  'trinidad': 'trinidad-and-tobago',
  'trinidad and tobago': 'trinidad-and-tobago',
  
  // Central America
  'costa rica': 'costa-rica',
  'el salvador': 'el-salvador',
  'guatemala': 'guatemala',
  'honduras': 'honduras',
  'nicaragua': 'nicaragua',
  'panama': 'panama',
  
  // South America
  'argentina': 'argentina',
  'chile': 'chile',
  'colombia': 'colombia',
  'ecuador': 'ecuador',
  'peru': 'peru',
  'uruguay': 'uruguay',
  'venezuela': 'venezuela',
  
  // Europe
  'netherlands': 'netherlands',
  'belgium': 'belgium',
  'switzerland': 'switzerland',
  'austria': 'austria',
  'sweden': 'sweden',
  'norway': 'norway',
  'denmark': 'denmark',
  'finland': 'finland',
  'poland': 'poland',
  'czech republic': 'czech-republic',
  'czech': 'czech-republic',
  'hungary': 'hungary',
  'romania': 'romania',
  'bulgaria': 'bulgaria',
  'greece': 'greece',
  'portugal': 'portugal',
  'ireland': 'ireland',
  
  // Asia
  'south korea': 'south-korea',
  'korea': 'south-korea',
  'thailand': 'thailand',
  'vietnam': 'vietnam',
  'cambodia': 'cambodia',
  'laos': 'laos',
  'myanmar': 'myanmar',
  'burma': 'myanmar',
  'malaysia': 'malaysia',
  'singapore': 'singapore',
  'indonesia': 'indonesia',
  'philippines': 'philippines',
  'taiwan': 'taiwan',
  'hong kong': 'hong-kong',
  
  // Middle East
  'israel': 'israel',
  'turkey': 'turkey',
  'egypt': 'egypt',
  'morocco': 'morocco',
  'tunisia': 'tunisia',
  'jordan': 'jordan',
  'lebanon': 'lebanon',
  'syria': 'syria',
  'iraq': 'iraq',
  'iran': 'iran',
  'saudi arabia': 'saudi-arabia',
  'uae': 'united-arab-emirates',
  'united arab emirates': 'united-arab-emirates',
  
  // Africa
  'south africa': 'south-africa',
  'kenya': 'kenya',
  'tanzania': 'tanzania',
  'uganda': 'uganda',
  'ghana': 'ghana',
  'nigeria': 'nigeria',
  'ethiopia': 'ethiopia',
  'sudan': 'sudan',
  'algeria': 'algeria',
  'libya': 'libya',
  
  // Oceania
  'fiji': 'fiji',
  'papua new guinea': 'papua-new-guinea',
  'samoa': 'samoa',
  'tonga': 'tonga',
  
  // Special cases
  'russia': 'russia',
  'ukraine': 'ukraine',
  'belarus': 'belarus',
  'moldova': 'moldova',
  'georgia': 'georgia',
  'armenia': 'armenia',
  'azerbaijan': 'azerbaijan',
  'kazakhstan': 'kazakhstan',
  'uzbekistan': 'uzbekistan',
  'turkmenistan': 'turkmenistan',
  'kyrgyzstan': 'kyrgyzstan',
  'tajikistan': 'tajikistan'
};

// Helper function to get CDC slug from country name
export function getCDCSlug(country: string): string {
  const countryLower = country.toLowerCase().trim();
  
  // Direct match
  if (CDC_COUNTRY_SLUGS[countryLower]) {
    return CDC_COUNTRY_SLUGS[countryLower];
  }
  
  // Partial match - find the best match
  for (const [key, slug] of Object.entries(CDC_COUNTRY_SLUGS)) {
    if (countryLower.includes(key) || key.includes(countryLower)) {
  
      return slug;
    }
  }
  
  // If no match found, convert to kebab-case as fallback
  const fallbackSlug = countryLower.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  return fallbackSlug;
}

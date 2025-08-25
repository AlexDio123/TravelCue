import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    console.log(`🛡️ Server-side State Department scraping for slug: ${slug}`);
    
    // Strategy 1: Try specific country information page with multiple slug variations
    try {
      console.log(`🛡️ Strategy 1: Trying country info page with multiple slug variations for ${slug}...`);
      
      const slugVariations = generateSlugVariations(slug);
      console.log(`🔄 Generated slug variations: ${slugVariations.join(', ')}`);
      
      for (const slugVariation of slugVariations) {
        const countryInfoUrl = `https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/${slugVariation}.html`;
        console.log(`🛡️ Trying country info page with slug: ${slugVariation} -> ${countryInfoUrl}`);

        try {
          const response = await fetch(countryInfoUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; TurismoApp/1.0)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5'
            }
          });

          if (response.ok) {
            console.log(`✅ Country info page accessible with slug: ${slugVariation}`);
            const html = await response.text();
            console.log(`🛡️ Country info HTML fetched successfully (${html.length} characters)`);

            const $ = cheerio.load(html);
            const advisoryData = parseStateDeptCountryInfo($, slug);

            if (advisoryData) {
              console.log(`🛡️ Found specific travel advisory from country info page for ${slug} using slug: ${slugVariation}`);
              return NextResponse.json({
                source: 'country-info-page',
                url: countryInfoUrl,
                slugUsed: slugVariation,
                data: advisoryData
              });
            } else {
              console.log(`⚠️ No advisory data parsed from country info page for ${slug} using slug: ${slugVariation}`);
            }
          } else {
            console.log(`⚠️ Country info page with slug ${slugVariation} returned status: ${response.status} ${response.statusText}`);
          }
        } catch (slugError) {
          console.log(`⚠️ Country info page with slug ${slugVariation} failed:`, slugError);
        }
      }
      
      console.log(`❌ All country info page slug variations failed for ${slug}`);
    } catch (countryInfoError) {
      console.log('⚠️ Country info page strategy failed:', countryInfoError);
    }

    // Strategy 2: Try travel advisories specific country page with multiple slug variations
    try {
      console.log(`🛡️ Strategy 2: Trying travel advisory page with multiple slug variations for ${slug}...`);
      
      const slugVariations = generateSlugVariations(slug);
      console.log(`🔄 Generated slug variations for travel advisory: ${slugVariations.join(', ')}`);
      
      for (const slugVariation of slugVariations) {
        const travelAdvisoryUrl = `https://travel.state.gov/en/international-travel/travel-advisories/${slugVariation}.html`;
        console.log(`🛡️ Trying travel advisory page with slug: ${slugVariation} -> ${travelAdvisoryUrl}`);

        try {
          const response = await fetch(travelAdvisoryUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; TurismoApp/1.0)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5'
            }
          });

          if (response.ok) {
            console.log(`✅ Travel advisory page accessible with slug: ${slugVariation}`);
            const html = await response.text();
            console.log(`🛡️ Travel advisory HTML fetched successfully (${html.length} characters)`);

            const $ = cheerio.load(html);
            const advisoryData = parseStateDeptAdvisoryData($, slug);

            if (advisoryData) {
              console.log(`🛡️ Found specific travel advisory from travel advisory page for ${slug} using slug: ${slugVariation}`);
              return NextResponse.json({
                source: 'travel-advisory-page',
                url: travelAdvisoryUrl,
                slugUsed: slugVariation,
                data: advisoryData
              });
            }
          } else {
            console.log(`⚠️ Travel advisory page with slug ${slugVariation} returned status: ${response.status}`);
          }
        } catch (slugError) {
          console.log(`⚠️ Travel advisory page with slug ${slugVariation} failed:`, slugError);
        }
      }
      
      console.log(`❌ All travel advisory page slug variations failed for ${slug}`);
    } catch (travelAdvisoryError) {
      console.log('⚠️ Travel advisory page strategy failed:', travelAdvisoryError);
    }

    // Strategy 3: Try alternative URL patterns for restricted countries (uses original slug format)
    try {
      console.log(`🛡️ Strategy 3: Trying alternative URL patterns for ${slug}...`);
      
      const alternativeUrls = [
        `https://travel.state.gov/en/international-travel/travel-advisories/${slug}-travel-advisory.html`,
        `https://travel.state.gov/en/international-travel/travel-advisories/${slug}-advisory.html`,
        `https://travel.state.gov/en/international-travel/travel-advisories/${slug}-security.html`
      ];
      
      for (const altUrl of alternativeUrls) {
        try {
          console.log(`🛡️ Trying alternative URL: ${altUrl}`);
          
          const response = await fetch(altUrl, {
            method: 'GET',
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible; TurismoApp/1.0)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Accept-Language': 'en-US,en;q=0.5'
            }
          });
          
          if (response.ok) {
            console.log(`✅ Alternative URL accessible: ${altUrl}`);
            const html = await response.text();
            console.log(`🛡️ Alternative URL HTML fetched successfully (${html.length} characters)`);
            
            const $ = cheerio.load(html);
            const advisoryData = parseStateDeptAdvisoryData($, slug);
            
            if (advisoryData) {
              console.log(`🛡️ Found travel advisory from alternative URL for ${slug}:`, advisoryData);
              return NextResponse.json({
                source: 'alternative-url',
                url: altUrl,
                data: advisoryData
              });
            }
          } else {
            console.log(`⚠️ Alternative URL returned status: ${response.status}`);
          }
        } catch (_) {
          console.log(`⚠️ Alternative URL failed: ${altUrl}`);
        }
      }
    } catch (alternativeError) {
      console.log('⚠️ Alternative URL strategy failed:', alternativeError);
    }

    // Strategy 4: Try general travel advisories page
    try {
      const generalUrl = 'https://travel.state.gov/en/travel-advisories';
      console.log(`🛡️ Strategy 4: Trying general travel advisories page: ${generalUrl}`);
      
      const response = await fetch(generalUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TurismoApp/1.0)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        }
      });
      
      if (response.ok) {
        console.log('✅ General travel advisories page accessible, parsing...');
        const html = await response.text();
        console.log(`🛡️ General advisories HTML fetched successfully (${html.length} characters)`);
        
        const $ = cheerio.load(html);
        const advisoryData = parseStateDeptGeneralAdvisories($, slug);
        
        if (advisoryData) {
          console.log(`🛡️ Found travel advisory from general page for ${slug}:`, advisoryData);
          return NextResponse.json({
            source: 'general-advisories-page',
            url: generalUrl,
            data: advisoryData
          });
        }
      } else {
        console.log(`⚠️ General travel advisories page returned status: ${response.status}`);
      }
    } catch (generalError) {
      console.log('⚠️ General travel advisories page scraping failed:', generalError);
    }

    // Strategy 5: Fallback to known high-risk countries
    console.log(`🛡️ Strategy 5: Checking known high-risk country data for ${slug}...`);
    const fallbackData = getFallbackSecurityData(slug);
    if (fallbackData) {
      console.log(`🛡️ Using fallback data for ${slug}:`, fallbackData);
      return NextResponse.json({
        source: 'fallback-data',
        url: 'fallback',
        data: fallbackData
      });
    }

    console.log('❌ All State Department scraping strategies failed');
    return NextResponse.json(
      { error: 'No travel advisory data found', slug },
      { status: 404 }
    );
    
  } catch (error) {
    console.error('❌ State Department API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch State Department data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to get fallback security data for known high-risk countries
function getFallbackSecurityData(slug: string) {
  const fallbackData: { [key: string]: {
    status: 'safe' | 'caution' | 'warning' | 'alert';
    message: string;
    emoji: string;
    details: string;
  }} = {
    'afghanistan': {
      status: 'alert',
      message: 'Level 4: Do not travel',
      emoji: '🚫',
      details: 'Level 4: Do not travel - Civil unrest, crime, terrorism, risk of wrongful detention, kidnapping, limited health facilities'
    },
    'yemen': {
      status: 'alert',
      message: 'Level 4: Do not travel',
      emoji: '🚫',
      details: 'Level 4: Do not travel - Terrorism, civil unrest, health risks, kidnapping, armed conflict'
    },
    'syria': {
      status: 'alert',
      message: 'Level 4: Do not travel',
      emoji: '🚫',
      details: 'Level 4: Do not travel - Armed conflict, terrorism, civil unrest, kidnapping, health risks'
    },
    'north-korea': {
      status: 'alert',
      message: 'Level 4: Do not travel',
      emoji: '🚫',
      details: 'Level 4: Do not travel - Risk of arrest, detention, limited consular access'
    },
    'venezuela': {
      status: 'warning',
      message: 'Level 3: Reconsider travel',
      emoji: '🚨',
      details: 'Level 3: Reconsider travel - Crime, civil unrest, kidnapping, health infrastructure issues'
    },
    'ethiopia': {
      status: 'warning',
      message: 'Level 3: Reconsider travel',
      emoji: '🚨',
      details: 'Level 3: Reconsider travel - Armed conflict, civil unrest, crime, health risks'
    }
  };
  
  return fallbackData[slug] || null;
}

// Helper function to parse State Department country info pages
function parseStateDeptCountryInfo($: cheerio.Root, countrySlug: string) {
  try {
    const countryName = getCountryNameFromSlug(countrySlug);
    
    console.log(`🔍 Parsing State Department Country Info HTML for country: ${countryName}`);
    console.log(`🔗 URL being parsed: https://travel.state.gov/content/travel/en/international-travel/International-Travel-Country-Information-Pages/${getStateDeptUrlSlug(countrySlug)}.html`);
    
    // Look for travel advisory information in the page title/header
    const title = $('title').text().trim();
    const heading = $('h1').first().text().trim();
    
    console.log(`📋 Page Title: ${title}`);
    console.log(`📋 Main Heading: ${heading}`);
    
    // Look for the specific travel advisory section
    const travelAdvisorySection = $('h1:contains("Travel Advisory")').next().text().trim() || 
                                  $('h2:contains("Travel Advisory")').next().text().trim() ||
                                  $('h3:contains("Travel Advisory")').next().text().trim();
    
    if (travelAdvisorySection) {
      console.log(`📋 Travel Advisory Section: ${travelAdvisorySection.substring(0, 200)}...`);
    }
    
    // Look for specific Level patterns in the HTML content
    const html = $.html();
    
    // Enhanced level detection patterns with priority ordering
    // Level 2 and 1 should be checked BEFORE Level 4 to avoid false positives
    const levelPatterns = [
      // Higher priority: Specific Level 2 patterns (check first)
      { pattern: /level\s*2[:\s]*exercise\s*increased\s*caution/i, level: '2', description: 'Exercise increased caution', priority: 1 },
      { pattern: /level\s*2\s*-\s*exercise\s*increased\s*caution/i, level: '2', description: 'Exercise increased caution', priority: 1 },
      
      // Higher priority: Specific Level 1 patterns
      { pattern: /level\s*1[:\s]*exercise\s*normal\s*precautions/i, level: '1', description: 'Exercise normal precautions', priority: 1 },
      { pattern: /level\s*1\s*-\s*exercise\s*normal\s*precautions/i, level: '1', description: 'Exercise normal precautions', priority: 1 },
      
      // Higher priority: Specific Level 3 patterns
      { pattern: /level\s*3[:\s]*reconsider\s*travel/i, level: '3', description: 'Reconsider travel', priority: 2 },
      { pattern: /level\s*3\s*-\s*reconsider\s*travel/i, level: '3', description: 'Reconsider travel', priority: 2 },
      
      // Lower priority: Level 4 patterns (check last to avoid false positives)
      { pattern: /level\s*4[:\s]*do\s*not\s*travel/i, level: '4', description: 'Do not travel', priority: 3 },
      { pattern: /level\s*4\s*-\s*do\s*not\s*travel/i, level: '4', description: 'Do not travel', priority: 3 }
    ];
    
    let foundLevel = null;
    let highestPriority = 0;
    
    // Find the highest priority pattern that matches
    for (const pattern of levelPatterns) {
      if (pattern.pattern.test(html)) {
        // If this pattern has higher priority (lower number), use it
        if (foundLevel === null || pattern.priority < foundLevel.priority) {
          foundLevel = pattern;
          highestPriority = pattern.priority;
          console.log(`✅ Found Level ${pattern.level} match (priority ${pattern.priority}): ${pattern.description}`);
        } else {
          console.log(`⚠️ Found Level ${pattern.level} match but keeping higher priority Level ${foundLevel.level}`);
        }
      }
    }
    
    if (foundLevel) {
      const level = foundLevel.level;
      const status = getStatusFromLevel(level);
      const message = `Level ${level}: ${foundLevel.description}`;
      
      console.log(`🎯 Parsed advisory level: ${level} -> ${status} -> ${message}`);
      
      return {
        status,
        message,
        emoji: getEmojiFromStatus(status),
        details: `${message} - Source: State Department Country Info Page`
      };
    }
    
    // If no level found, try to infer from content context
    console.log(`⚠️ No explicit level found, checking content context...`);
    
    // More specific context checking to avoid false positives
    const lowerHtml = html.toLowerCase();
    
    // Check for Level 4 with more specific context
    if ((lowerHtml.includes('level 4') && lowerHtml.includes('do not travel')) || 
        (lowerHtml.includes('do not travel') && lowerHtml.includes('level 4'))) {
      console.log(`✅ Inferred Level 4 from specific context`);
      return {
        status: 'alert',
        message: 'Level 4: Do not travel',
        emoji: '🚫',
        details: 'Level 4: Do not travel - Source: State Department Country Info Page'
      };
    } else if ((lowerHtml.includes('level 3') && lowerHtml.includes('reconsider travel')) || 
               (lowerHtml.includes('reconsider travel') && lowerHtml.includes('level 3'))) {
      console.log(`✅ Inferred Level 3 from specific context`);
      return {
        status: 'warning',
        message: 'Level 3: Reconsider travel',
        emoji: '🚨',
        details: 'Level 3: Reconsider travel - Source: State Department Country Info Page'
      };
    } else if ((lowerHtml.includes('level 2') && lowerHtml.includes('increased caution')) || 
               (lowerHtml.includes('increased caution') && lowerHtml.includes('level 2'))) {
      console.log(`✅ Inferred Level 2 from specific context`);
      return {
        status: 'caution',
        message: 'Level 2: Exercise increased caution',
        emoji: '⚠️',
        details: 'Level 2: Exercise increased caution - Source: State Department Country Info Page'
      };
    } else if ((lowerHtml.includes('level 1') && lowerHtml.includes('normal precautions')) || 
               (lowerHtml.includes('normal precautions') && lowerHtml.includes('level 1'))) {
      console.log(`✅ Inferred Level 1 from specific context`);
      return {
        status: 'safe',
        message: 'Level 1: Exercise normal precautions',
        emoji: '🛡️',
        details: 'Level 1: Exercise normal precautions - Source: State Department Country Info Page'
      };
    }
    
    // If still no level found, log the content for debugging
    console.log(`⚠️ No level could be inferred from content context`);
    console.log(`🔍 HTML contains 'do not travel': ${lowerHtml.includes('do not travel')}`);
    console.log(`🔍 HTML contains 'level 4': ${lowerHtml.includes('level 4')}`);
    console.log(`🔍 HTML contains 'increased caution': ${lowerHtml.includes('increased caution')}`);
    console.log(`🔍 HTML contains 'level 2': ${lowerHtml.includes('level 2')}`);
    
    console.log(`⚠️ No level could be determined from content context`);
    return null;
    
  } catch (error) {
    console.warn('⚠️ State Department country info parsing failed:', error);
    return null;
  }
}

// Helper function to parse State Department travel advisory pages
function parseStateDeptAdvisoryData($: cheerio.Root, countrySlug: string) {
  try {
    const html = $.html();
    const countryName = getCountryNameFromSlug(countrySlug);
    
    console.log(`🔍 Parsing State Department HTML for country: ${countryName}`);
    console.log(`🔗 URL being parsed: https://travel.state.gov/en/international-travel/travel-advisories/${getStateDeptUrlSlug(countrySlug)}.html`);
    
    if (html.toLowerCase().includes(countryName.toLowerCase())) {
      console.log(`✅ Found country "${countryName}" in State Department HTML`);
      
      // Log the specific sections we're looking at
      const title = $('title').text().trim();
      const heading = $('h1').first().text().trim();
      const advisorySection = $('h2:contains("Travel advisory")').next().text().trim();
      const levelSection = $('h3:contains("Level")').text().trim();
      
      console.log(`📋 Page Title: ${title}`);
      console.log(`📋 Main Heading: ${heading}`);
      console.log(`📋 Advisory Section: ${advisorySection.substring(0, 200)}...`);
      console.log(`📋 Level Section: ${levelSection}`);
      
      // Look for the specific Level 2 text from the official page
      const level2Text = html.match(/Level\s*2\s*-\s*Exercise\s*increased\s*caution/i);
      const level1Text = html.match(/Level\s*1\s*-\s*Exercise\s*normal\s*precautions/i);
      
      console.log(`🔍 Level 2 text found: ${level2Text ? 'YES' : 'NO'}`);
      console.log(`🔍 Level 1 text found: ${level1Text ? 'YES' : 'NO'}`);
      
      if (level2Text) {
        console.log(`✅ Found exact Level 2 match: ${level2Text[0]}`);
      }
      if (level1Text) {
        console.log(`⚠️ Found exact Level 1 match: ${level1Text[0]}`);
      }
      
      let riskLevel = 'safe';
      let message = 'Exercise normal precautions';
      const riskIndicators: string[] = [];
      let updateDate = '';
      
      // Enhanced risk level detection with more specific patterns
      const levelPatterns = [
        // Specific Level patterns - prioritize these
        { pattern: /level\s*2\s*-\s*exercise\s*increased\s*caution/i, level: 'caution', message: 'Level 2: Exercise increased caution', priority: 1 },
        { pattern: /level\s*1\s*-\s*exercise\s*normal\s*precautions/i, level: 'safe', message: 'Level 1: Exercise normal precautions', priority: 1 },
        { pattern: /level\s*3\s*-\s*reconsider\s*travel/i, level: 'warning', message: 'Level 3: Reconsider travel', priority: 1 },
        { pattern: /level\s*4\s*-\s*do\s*not\s*travel/i, level: 'alert', message: 'Level 4: Do not travel', priority: 1 },
        // Alternative patterns
        { pattern: /level\s*1[:\s]*exercise\s*normal\s*precautions/i, level: 'safe', message: 'Level 1: Exercise normal precautions', priority: 2 },
        { pattern: /level\s*2[:\s]*exercise\s*increased\s*caution/i, level: 'caution', message: 'Level 2: Exercise increased caution', priority: 2 },
        { pattern: /level\s*3[:\s]*reconsider\s*travel/i, level: 'warning', message: 'Level 3: Reconsider travel', priority: 2 },
        { pattern: /level\s*4[:\s]*do\s*not\s*travel/i, level: 'alert', message: 'Level 4: Do not travel', priority: 2 },
        // Additional patterns for Level 2
        { pattern: /increased\s*caution/i, level: 'caution', message: 'Level 2: Exercise increased caution', priority: 3 },
        { pattern: /caution.*level\s*2/i, level: 'caution', message: 'Level 2: Exercise increased caution', priority: 3 },
        { pattern: /level\s*2.*caution/i, level: 'caution', message: 'Level 2: Exercise increased caution', priority: 3 }
      ];
      
      // Look for risk level patterns with priority
      let foundLevel = false;
      let highestPriority = 0;
      
      for (const pattern of levelPatterns) {
        if (pattern.pattern.test(html)) {
          // Only update if this pattern has higher priority
          if (pattern.priority <= highestPriority || !foundLevel) {
            riskLevel = pattern.level;
            message = pattern.message;
            highestPriority = pattern.priority;
            console.log(`✅ Found risk level: ${riskLevel} (${message}) - Priority: ${pattern.priority}`);
            foundLevel = true;
          }
        }
      }
      
      // If no level found, try to infer from content context
      if (!foundLevel) {
        console.log(`⚠️ No explicit level found, analyzing content context...`);
        
        // Look for specific phrases that indicate Level 2
        if (html.toLowerCase().includes('increased caution') || 
            html.toLowerCase().includes('exercise increased caution') ||
            html.toLowerCase().includes('caution level 2') ||
            html.toLowerCase().includes('level 2 caution')) {
          riskLevel = 'caution';
          message = 'Level 2: Exercise increased caution';
          console.log(`✅ Inferred Level 2 from content context`);
        }
        // Look for phrases that indicate Level 1
        else if (html.toLowerCase().includes('normal precautions') || 
                 html.toLowerCase().includes('exercise normal precautions')) {
          riskLevel = 'safe';
          message = 'Level 1: Exercise normal precautions';
          console.log(`✅ Inferred Level 1 from content context`);
        }
      }
      
      // Look for risk indicators
      const riskPatterns = [
        { pattern: /crime/i, indicator: 'CRIME' },
        { pattern: /terrorism/i, indicator: 'TERRORISM' },
        { pattern: /health/i, indicator: 'HEALTH' },
        { pattern: /kidnapping/i, indicator: 'KIDNAPPING' },
        { pattern: /armed\s*conflict/i, indicator: 'ARMED CONFLICT' },
        { pattern: /civil\s*unrest/i, indicator: 'CIVIL UNREST' },
        { pattern: /natural\s*disaster/i, indicator: 'NATURAL DISASTER' }
      ];
      
      for (const pattern of riskPatterns) {
        if (pattern.pattern.test(html)) {
          riskIndicators.push(pattern.indicator);
        }
      }
      
      // Look for update date
      const dateMatch = html.match(/(\d{1,2}\/\d{1,2}\/\d{4})|(\d{4}-\d{2}-\d{2})/);
      if (dateMatch) {
        updateDate = dateMatch[0];
        console.log(`📅 Found update date: ${updateDate}`);
      }
      
      console.log(`📊 Risk indicators found: ${riskIndicators.join(', ')}`);
      console.log(`🎯 Final risk level determined: ${riskLevel} - ${message}`);
      console.log(`🔍 HTML Content Length: ${html.length} characters`);
      
      const details = `${message} - Risks: ${riskIndicators.join(', ')}${updateDate ? ` - Updated: ${updateDate}` : ''}`;
      
      return {
        status: riskLevel as 'safe' | 'caution' | 'warning' | 'alert',
        message,
        emoji: getEmojiFromStatus(riskLevel),
        details
      };
    }
    
    return null;
  } catch (error) {
    console.warn('⚠️ State Department travel advisory parsing failed:', error);
    return null;
  }
}

// Helper function to parse general travel advisories page
function parseStateDeptGeneralAdvisories($: cheerio.Root, countrySlug: string) {
  try {
    const html = $.html();
    const countryName = getCountryNameFromSlug(countrySlug);
    
    console.log(`🔍 Parsing general travel advisories for country: ${countryName}`);
    
    if (html.toLowerCase().includes(countryName.toLowerCase())) {
      // Similar parsing logic as parseStateDeptAdvisoryData
      return parseStateDeptAdvisoryData($, countrySlug);
    }
    
    return null;
  } catch (error) {
    console.warn('⚠️ General travel advisories parsing failed:', error);
    return null;
  }
}

// Helper functions
function getCountryNameFromSlug(slug: string): string {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

// New function to get the correct capitalization for State Department URLs
function getStateDeptUrlSlug(slug: string): string {
  // Comprehensive mapping based on actual working State Department URLs
  const stateDeptUrlMapping: { [key: string]: string } = {
    // Country Info Pages (International-Travel-Country-Information-Pages)
    'afghanistan': 'Afghanistan',
    'albania': 'Albania',
    'algeria': 'Algeria',
    'andorra': 'Andorra',
    'angola': 'Angola',
    'argentina': 'Argentina',
    'armenia': 'Armenia',
    'australia': 'Australia',
    'austria': 'Austria',
    'azerbaijan': 'Azerbaijan',
    'bahrain': 'Bahrain',
    'bangladesh': 'Bangladesh',
    'barbados': 'Barbados',
    'belarus': 'Belarus',
    'belgium': 'Belgium',
    'belize': 'Belize',
    'benin': 'Benin',
    'bermuda': 'Bermuda',
    'bhutan': 'Bhutan',
    'bolivia': 'Bolivia',
    'bosnia-herzegovina': 'bosnia-herzegovina',  // Fixed: uses original slug format for travel advisories
    'botswana': 'Botswana',
    'brazil': 'Brazil',
    'brunei': 'Brunei',
    'bulgaria': 'Bulgaria',
    'burkina-faso': 'burkina-faso',  // Fixed: uses original slug format for travel advisories
    'burma': 'Burma',
    'myanmar': 'Myanmar',
    'burundi': 'Burundi',
    'cabo-verde': 'cabo-verde',  // Fixed: uses original slug format for travel advisories
    'cambodia': 'Cambodia',
    'cameroon': 'Cameroon',
    'canada': 'Canada',
    'cayman-islands': 'cayman-islands',  // Fixed: uses original slug format for travel advisories
    'central-african-republic': 'central-african-republic',  // Fixed: uses original slug format for travel advisories
    'chad': 'Chad',
    'chile': 'Chile',
    'china': 'China',
    'colombia': 'Colombia',
    'comoros': 'Comoros',
    'costa-rica': 'costa-rica',  // Fixed: uses original slug format for travel advisories
    'croatia': 'Croatia',
    'cuba': 'Cuba',
    'cyprus': 'Cyprus',
    'czech-republic': 'czech-republic',  // Fixed: uses original slug format for travel advisories
    'czechia': 'Czechia',
    'democratic-republic-of-the-congo': 'democratic-republic-of-the-congo',  // Fixed: uses original slug format for travel advisories
    'denmark': 'Denmark',
    'djibouti': 'Djibouti',
    'dominica': 'Dominica',
    'dominican-republic': 'dominican-republic',  // Fixed: uses original slug format for travel advisories
    'ecuador': 'Ecuador',
    'egypt': 'Egypt',
    'el-salvador': 'el-salvador',  // Fixed: uses original slug format for travel advisories
    'equatorial-guinea': 'equatorial-guinea',  // Fixed: uses original slug format for travel advisories
    'eritrea': 'Eritrea',
    'estonia': 'Estonia',
    'eswatini': 'Eswatini',
    'ethiopia': 'Ethiopia',
    'fiji': 'Fiji',
    'finland': 'Finland',
    'france': 'France',
    'french-guiana': 'french-guiana',  // Fixed: uses original slug format for travel advisories
    'french-polynesia': 'french-polynesia',  // Fixed: uses original slug format for travel advisories
    'french-west-indies': 'french-west-indies',  // Fixed: uses original slug format for travel advisories
    'gabon': 'Gabon',
    'gambia': 'Gambia',
    'georgia': 'Georgia',
    'germany': 'Germany',
    'ghana': 'Ghana',
    'greece': 'Greece',
    'greenland': 'Greenland',
    'grenada': 'Grenada',
    'guadeloupe': 'guadeloupe',  // Fixed: uses original slug format for travel advisories
    'guatemala': 'Guatemala',
    'guinea': 'Guinea',
    'guinea-bissau': 'guinea-bissau',  // Fixed: uses original slug format for travel advisories
    'guyana': 'Guyana',
    'haiti': 'Haiti',
    'honduras': 'Honduras',
    'hong-kong': 'hong-kong',  // Fixed: uses original slug format for travel advisories
    'hungary': 'Hungary',
    'iceland': 'Iceland',
    'india': 'India',
    'indonesia': 'Indonesia',
    'iran': 'Iran',
    'iraq': 'Iraq',
    'ireland': 'Ireland',
    'isle-of-man': 'isle-of-man',  // Fixed: uses original slug format for travel advisories
    'israel': 'Israel',
    'italy': 'Italy',
    'jamaica': 'Jamaica',
    'japan': 'Japan',
    'jordan': 'Jordan',
    'kazakhstan': 'Kazakhstan',
    'kenya': 'Kenya',
    'kiribati': 'Kiribati',
    'kosovo': 'Kosovo',
    'kuwait': 'Kuwait',
    'kyrgyzstan': 'Kyrgyzstan',
    'laos': 'Laos',
    'latvia': 'Latvia',
    'lebanon': 'Lebanon',
    'lesotho': 'Lesotho',
    'liberia': 'Liberia',
    'libya': 'Libya',
    'liechtenstein': 'Liechtenstein',
    'lithuania': 'Lithuania',
    'luxembourg': 'Luxembourg',
    'macau': 'Macau',
    'madagascar': 'Madagascar',
    'malawi': 'Malawi',
    'malaysia': 'Malaysia',
    'maldives': 'Maldives',
    'mali': 'Mali',
    'malta': 'Malta',
    'marshall-islands': 'marshall-islands',  // Fixed: uses original slug format for travel advisories
    'martinique': 'martinique',  // Fixed: uses original slug format for travel advisories
    'mauritania': 'Mauritania',
    'mauritius': 'Mauritius',
    'mexico': 'Mexico',
    'moldova': 'Moldova',
    'monaco': 'Monaco',
    'mongolia': 'Mongolia',
    'montenegro': 'Montenegro',
    'morocco': 'Morocco',
    'mozambique': 'Mozambique',
    'namibia': 'Namibia',
    'nauru': 'Nauru',
    'nepal': 'Nepal',
    'netherlands': 'Netherlands',
    'new-caledonia': 'new-caledonia',  // Fixed: uses original slug format for travel advisories
    'new-zealand': 'new-zealand',  // Fixed: uses original slug format for travel advisories
    'nicaragua': 'Nicaragua',
    'niger': 'Niger',
    'nigeria': 'Nigeria',
    'north-korea': 'NorthKorea',
    'norway': 'Norway',
    'oman': 'Oman',
    'pakistan': 'Pakistan',
    'palau': 'Palau',
    'panama': 'Panama',
    'papua-new-guinea': 'papua-new-guinea',  // Fixed: uses original slug format for travel advisories
    'paraguay': 'Paraguay',
    'peru': 'Peru',
    'philippines': 'Philippines',
    'poland': 'Poland',
    'portugal': 'Portugal',
    'qatar': 'Qatar',
    'republic-of-north-macedonia': 'republic-of-north-macedonia',  // Fixed: uses original slug format for travel advisories
    'romania': 'Romania',
    'russia': 'Russia',
    'rwanda': 'Rwanda',
    'saint-barthelemy': 'saint-barthelemy',  // Fixed: uses original slug format for travel advisories
    'saint-kitts-and-nevis': 'saint-kitts-and-nevis',  // Fixed: uses original slug format for travel advisories
    'saint-lucia': 'saint-lucia',  // Fixed: uses original slug format for travel advisories
    'saint-martin': 'saint-martin',  // Fixed: uses original slug format for travel advisories
    'saint-vincent-and-the-grenadines': 'saint-vincent-and-the-grenadines',  // Fixed: uses original slug format for travel advisories
    'samoa': 'Samoa',
    'san-marino': 'san-marino',  // Fixed: uses original slug format for travel advisories
    'sao-tome-and-principe': 'sao-tome-and-principe',  // Fixed: uses original slug format for travel advisories
    'saudi-arabia': 'saudi-arabia',  // Fixed: uses original slug format for travel advisories
    'senegal': 'Senegal',
    'serbia': 'Serbia',
    'seychelles': 'Seychelles',
    'sierra-leone': 'sierra-leone',  // Fixed: uses original slug format for travel advisories
    'singapore': 'Singapore',
    'sint-eustatius': 'sint-eustatius',  // Fixed: uses original slug format for travel advisories
    'sint-maarten': 'sint-maarten',  // Fixed: uses original slug format for travel advisories
    'slovakia': 'Slovakia',
    'slovenia': 'Slovenia',
    'solomon-islands': 'solomon-islands',  // Fixed: uses original slug format for travel advisories
    'somalia': 'Somalia',
    'south-africa': 'south-africa',  // Fixed: uses original slug format for travel advisories
    'south-korea': 'south-korea',  // Fixed: uses original slug format for travel advisories
    'south-sudan': 'south-sudan',  // Fixed: uses original slug format for travel advisories
    'spain': 'Spain',
    'sri-lanka': 'sri-lanka',  // Fixed: uses original slug format for travel advisories
    'sudan': 'Sudan',
    'suriname': 'Suriname',
    'sweden': 'Sweden',
    'switzerland': 'Switzerland',
    'syria': 'Syria',
    'taiwan': 'Taiwan',
    'tajikistan': 'Tajikistan',
    'tanzania': 'Tanzania',
    'thailand': 'Thailand',
    'the-bahamas': 'the-bahamas',  // Fixed: uses original slug format for travel advisories
    'timor-leste': 'timor-leste',  // Fixed: uses original slug format for travel advisories
    'togo': 'Togo',
    'tonga': 'Tonga',
    'trinidad-and-tobago': 'trinidad-and-tobago',  // Fixed: uses original slug format for travel advisories
    'tunisia': 'Tunisia',
    'turkey': 'Turkey',
    'turkmenistan': 'Turkmenistan',
    'turks-caicos-islands': 'turks-caicos-islands',  // Fixed: uses original slug format for travel advisories
    'tuvalu': 'Tuvalu',
    'uganda': 'Uganda',
    'ukraine': 'Ukraine',
    'united-arab-emirates': 'united-arab-emirates',  // Fixed: uses original slug format for travel advisories
    'united-kingdom': 'united-kingdom',  // Fixed: uses original slug format for travel advisories
    'united-states': 'united-states',  // Fixed: uses original slug format for travel advisories
    'uruguay': 'Uruguay',
    'uzbekistan': 'Uzbekistan',
    'vanuatu': 'Vanuatu',
    'vatican-city': 'vatican-city',  // Fixed: uses original slug format for travel advisories
    'venezuela': 'Venezuela',
    'vietnam': 'Vietnam',
    'west-bank': 'west-bank',  // Fixed: uses original slug format for travel advisories
    'yemen': 'Yemen',
    'zambia': 'Zambia',
    'zimbabwe': 'Zimbabwe'
  };
  
  // Check if we have a specific mapping
  if (stateDeptUrlMapping[slug]) {
    return stateDeptUrlMapping[slug];
  }
  
  // Fallback: try to guess based on common patterns
  console.log(`⚠️ No specific mapping found for ${slug}, using fallback pattern`);
  
  // Remove hyphens and capitalize first letter of each word
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function getStatusFromLevel(level: string): 'safe' | 'caution' | 'warning' | 'alert' {
  const levelNum = parseInt(level);
  if (levelNum === 1) return 'safe';
  if (levelNum === 2) return 'caution';
  if (levelNum === 3) return 'warning';
  if (levelNum === 4) return 'alert';
  return 'safe';
}



function getEmojiFromStatus(status: string): string {
  switch (status) {
    case 'safe': return '🛡️';
    case 'caution': return '⚠️';
    case 'warning': return '🚨';
    case 'alert': return '🚫';
    default: return '🛡️';
  }
}

// Helper function to generate slug variations for country info page
function generateSlugVariations(originalSlug: string): string[] {
  const variations: string[] = [];
  
  // Original slug (as provided)
  variations.push(originalSlug);
  
  // Lowercase version
  const lowerCaseSlug = originalSlug.toLowerCase();
  if (lowerCaseSlug !== originalSlug) {
    variations.push(lowerCaseSlug);
  }
  
  // Capitalized version (first letter uppercase, rest lowercase)
  const capitalizedSlug = originalSlug.charAt(0).toUpperCase() + originalSlug.slice(1).toLowerCase();
  if (capitalizedSlug !== originalSlug && capitalizedSlug !== lowerCaseSlug) {
    variations.push(capitalizedSlug);
  }
  
  // CamelCase version (remove hyphens, capitalize each word)
  const camelCaseSlug = originalSlug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join('');
  if (camelCaseSlug !== originalSlug && camelCaseSlug !== capitalizedSlug && camelCaseSlug !== lowerCaseSlug) {
    variations.push(camelCaseSlug);
  }
  
  // TitleCase version (capitalize first letter of each word, keep hyphens)
  const titleCaseSlug = originalSlug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join('-');
  if (titleCaseSlug !== originalSlug && titleCaseSlug !== capitalizedSlug && titleCaseSlug !== lowerCaseSlug) {
    variations.push(titleCaseSlug);
  }
  
  // Remove duplicates and return
  return [...new Set(variations)];
}

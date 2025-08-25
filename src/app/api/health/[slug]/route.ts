import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    console.log(`🏥 Server-side CDC scraping for slug: ${slug}`);
    
    // Construct CDC URL
    const cdcUrl = `https://wwwnc.cdc.gov/travel/destinations/traveler/none/${slug}`;
    console.log(`🌐 CDC URL: ${cdcUrl}`);
    
    // Fetch HTML from CDC (server-side, no CORS issues)
    const response = await fetch(cdcUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TurismoApp/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      }
    });
    
    if (!response.ok) {
      console.log(`⚠️ CDC returned status: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `CDC returned status ${response.status}` },
        { status: response.status }
      );
    }
    
    const html = await response.text();
    console.log(`✅ CDC HTML fetched successfully (${html.length} characters)`);
    
    // Parse HTML with cheerio
    const $ = cheerio.load(html);
    
    // Extract health information with better parsing
    const healthData = {
      slug,
      url: cdcUrl,
      title: $('title').text().trim(),
      heading: $('h1').first().text().trim() || $('.page-title').text().trim() || $('h2').first().text().trim(),
      content: $('body').text().trim().substring(0, 3000), // Increased to 3000 chars for better analysis
      hasVaccines: $('#VaccinesAndMedicines li').length > 0 || $('.vaccines li').length > 0,
      hasNotices: $('#TravelHealthNotices li').length > 0 || $('.notices li').length > 0,
      vaccineCount: $('#VaccinesAndMedicines li').length + $('.vaccines li').length,
      noticeCount: $('#TravelHealthNotices li').length + $('.notices li').length,
      // Additional health-specific content
      healthContent: $('.health-content').text().trim() || $('.travel-health').text().trim() || $('.health-alerts').text().trim(),
      // Look for specific health sections
      hasHealthAlerts: $('.health-alert, .alert, .warning').length > 0,
      hasTravelNotices: $('.travel-notice, .notice').length > 0,
      // Enhanced content extraction
      mainContent: $('main').text().trim() || $('.main-content').text().trim() || $('.content').text().trim(),
      sidebarContent: $('.sidebar').text().trim() || $('.side-content').text().trim(),
      // Look for CDC-specific content
      cdcContent: $('[class*="cdc"], [class*="health"], [class*="travel"]').text().trim(),
      // CDC Level Detection - Extract specific levels with context
      cdcLevels: extractCDCLevels($),
      // Raw HTML for debugging
      rawHtml: html.substring(0, 5000) // Increased to 5000 chars for debugging
    };
    
    console.log(`🏥 Health data extracted:`, {
      title: healthData.title,
      heading: healthData.heading,
      hasVaccines: healthData.hasVaccines,
      hasNotices: healthData.hasNotices,
      hasHealthAlerts: healthData.hasHealthAlerts,
      hasTravelNotices: healthData.hasTravelNotices,
      cdcLevels: healthData.cdcLevels
    });
    
    return NextResponse.json(healthData);
    
  } catch (error) {
    console.error('❌ CDC API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CDC data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// Helper function to extract CDC levels with context
function extractCDCLevels($: cheerio.Root) {
  const levels: Array<{level: string, description: string, context: string}> = [];
  const html = $.html();
  
  // Look for CDC level patterns in the HTML
  const levelPatterns = [
    { pattern: /watch\s*level\s*1[:\s]*([^<]+)/i, level: '1', description: 'Practice usual precautions' },
    { pattern: /alert\s*level\s*2[:\s]*([^<]+)/i, level: '2', description: 'Practice enhanced precautions' },
    { pattern: /warning\s*level\s*3[:\s]*([^<]+)/i, level: '3', description: 'Avoid nonessential travel' },
    { pattern: /level\s*1[:\s]*practice\s*usual\s*precautions/i, level: '1', description: 'Practice usual precautions' },
    { pattern: /level\s*2[:\s]*practice\s*enhanced\s*precautions/i, level: '2', description: 'Practice enhanced precautions' },
    { pattern: /level\s*3[:\s]*avoid\s*nonessential\s*travel/i, level: '3', description: 'Avoid nonessential travel' },
    { pattern: /cdc\s*level\s*1[:\s]*([^<]+)/i, level: '1', description: 'Practice usual precautions' },
    { pattern: /cdc\s*level\s*2[:\s]*([^<]+)/i, level: '2', description: 'Practice enhanced precautions' },
    { pattern: /cdc\s*level\s*3[:\s]*([^<]+)/i, level: '3', description: 'Avoid nonessential travel' }
  ];
  
  for (const pattern of levelPatterns) {
    const match = html.match(pattern.pattern);
    if (match) {
      const context = match[1] ? match[1].trim() : pattern.description;
      levels.push({
        level: pattern.level,
        description: pattern.description,
        context: context
      });
      console.log(`🏥 Backend extracted CDC Level ${pattern.level}: ${context}`);
    }
  }
  
  // Remove duplicates based on level
  const uniqueLevels = levels.filter((item, index, self) => 
    index === self.findIndex(t => t.level === item.level)
  );
  
  return uniqueLevels;
}

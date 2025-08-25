import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ destination: string }> }
) {
  const { destination } = await params;
  try {
    const decodedDestination = decodeURIComponent(destination);
    console.log('🏠 STR API called for destination:', decodedDestination);

    // Get coordinates using OpenCage (simplified version)
    let coordinates: { lat: number; lon: number } | null = null;
    
    try {
      const opencageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(decodedDestination)}&key=${process.env.NEXT_PUBLIC_OPENCAGE_API_KEY}&limit=1`;
      const response = await fetch(opencageUrl);
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          coordinates = {
            lat: data.results[0].geometry.lat,
            lon: data.results[0].geometry.lng
          };
          console.log('📍 STR API - Coordinates:', coordinates);
        }
      }
    } catch (error) {
      console.log('⚠️ OpenCage failed for STR API:', error);
    }

    if (!coordinates) {
      console.log('⚠️ No coordinates available for STR API');
      return NextResponse.json({
        percentage: 60,
        status: 'moderate',
        message: 'No location data available',
        emoji: '🏠',
        averagePrice: 'Check local sites',
        options: []
      });
    }

    // Try to get real data from OpenStreetMap
    try {
      console.log('🏠 STR API - Attempting OpenStreetMap Overpass API call...');
      
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["tourism"="hotel"](around:10000,${coordinates.lat},${coordinates.lon});
          node["tourism"="hostel"](around:10000,${coordinates.lat},${coordinates.lon});
          node["tourism"="guest_house"](around:10000,${coordinates.lat},${coordinates.lon});
          node["amenity"="hotel"](around:10000,${coordinates.lat},${coordinates.lon});
          way["tourism"="hotel"](around:10000,${coordinates.lat},${coordinates.lon});
          way["tourism"="hostel"](around:10000,${coordinates.lat},${coordinates.lon});
        );
        out body;
        >;
        out skel qt;
      `;
      
      const overpassResponse = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`
      });
      
      if (overpassResponse.ok) {
        const data = await overpassResponse.json();
        
        if (data.elements && Array.isArray(data.elements) && data.elements.length > 0) {
          const accommodationCount = data.elements.length;
          console.log(`🏠 STR API - Found ${accommodationCount} accommodation options`);
          
          // Extract specific accommodation options (max 8 for display)
          const accommodationOptions = data.elements
            .slice(0, 8)
            .map((element: { tags?: Record<string, string> }) => {
              const tags = element.tags || {};
              let type: 'hotel' | 'hostel' | 'guest_house' | 'apartment' | 'other' = 'other';
              let emoji = '🏠';
              
              if (tags.tourism === 'hotel' || tags.amenity === 'hotel') {
                type = 'hotel';
                emoji = '🏨';
              } else if (tags.tourism === 'hostel') {
                type = 'hostel';
                emoji = '🛏️';
              } else if (tags.tourism === 'guest_house') {
                type = 'guest_house';
                emoji = '🏡';
              } else if (tags.amenity === 'apartment') {
                type = 'apartment';
                emoji = '🏢';
              }
              
              // Calculate distance (simplified - assuming 10km radius)
              const distance = Math.floor(Math.random() * 10) + 1; // 1-10km for demo
              
              return {
                name: tags.name || tags['name:en'] || `${type.charAt(0).toUpperCase() + type.slice(1)} ${Math.floor(Math.random() * 100) + 1}`,
                type,
                distance: `${distance}km`,
                emoji,
                rating: Math.floor(Math.random() * 2) + 4 // 4-5 stars for demo
              };
            });
          
          // Calculate availability based on accommodation density
          let percentage: number;
          let status: 'high' | 'moderate' | 'low';
          let message: string;
          let emoji: string;
          
          if (accommodationCount >= 20) {
            percentage = 30; // Low booking rate due to many options
            status = 'low';
            message = `${accommodationCount} accommodation options available`;
            emoji = '🏠';
          } else if (accommodationCount >= 10) {
            percentage = 60; // Moderate booking rate
            status = 'moderate';
            message = `${accommodationCount} accommodation options available`;
            emoji = '🏠';
          } else {
            percentage = 80; // High booking rate due to few options
            status = 'high';
            message = `${accommodationCount} accommodation options available`;
            emoji = '🏠';
          }
          
          const result = {
            percentage,
            status,
            message,
            emoji,
            averagePrice: accommodationCount >= 15 ? 'Competitive rates' : 'Varies by location',
            options: accommodationOptions
          };
          
          console.log('🏠 STR API - Returning OpenStreetMap data with options:', result);
          return NextResponse.json(result);
        }
      }
    } catch (overpassError) {
      console.log('⚠️ STR API - OpenStreetMap Overpass API failed:', overpassError);
    }
    
    // Fallback: Generate intelligent availability based on destination type
    const destinationLower = decodedDestination.toLowerCase();
    
    let fallbackData: {
      percentage: number;
      status: string;
      message: string;
      emoji: string;
      averagePrice: string;
      options: Array<{
        name: string;
        type: string;
        distance: string;
        emoji: string;
        rating: number;
      }>;
    };
    
    if (destinationLower.includes('major city') || destinationLower.includes('capital') || destinationLower.includes('new york') || destinationLower.includes('london') || destinationLower.includes('tokyo')) {
      fallbackData = {
        percentage: 75,
        status: 'high',
        message: 'High demand in major city',
        emoji: '🏠',
        averagePrice: 'Premium rates',
        options: [
          {
            name: 'Sample Hotel',
            type: 'hotel',
            distance: '1km',
            emoji: '🏨',
            rating: 4
          },
          {
            name: 'Local Hostel',
            type: 'hostel',
            distance: '2km',
            emoji: '🛏️',
            rating: 4
          }
        ]
      };
    } else if (destinationLower.includes('beach') || destinationLower.includes('resort') || destinationLower.includes('bali') || destinationLower.includes('maldives')) {
      fallbackData = {
        percentage: 85,
        status: 'high',
        message: 'High demand in tourist destination',
        emoji: '🏖️',
        averagePrice: 'Resort rates',
        options: [
          {
            name: 'Beach Resort',
            type: 'hotel',
            distance: '1km',
            emoji: '🏖️',
            rating: 5
          },
          {
            name: 'Ocean View Hotel',
            type: 'hotel',
            distance: '2km',
            emoji: '🌊',
            rating: 4
          }
        ]
      };
    } else {
      fallbackData = {
        percentage: 60,
        status: 'moderate',
        message: 'Moderate availability',
        emoji: '🏠',
        averagePrice: 'Varies by location',
        options: [
          {
            name: 'Local Hotel',
            type: 'hotel',
            distance: '1km',
            emoji: '🏨',
            rating: 4
          },
          {
            name: 'Guest House',
            type: 'guest_house',
            distance: '2km',
            emoji: '🏡',
            rating: 4
          }
        ]
      };
    }
    
    console.log('🏠 STR API - Returning fallback data with options:', fallbackData);
    return NextResponse.json(fallbackData);
    
  } catch (error) {
    console.warn('⚠️ STR API - Generation failed:', error);
    return NextResponse.json({
      percentage: 60,
      status: 'moderate',
      message: 'Data unavailable',
      emoji: '🏠',
      averagePrice: 'Check local sites',
      options: []
    });
  }
}

# TravelCue - Travel Destination Overview

A comprehensive Next.js web application that provides travelers with a complete snapshot of any destination, including real-time weather, events, safety information, currency rates, and more.

## 🌟 Features

### Core Functionality
- **⏰ Timezone & Time**: Current time and time difference from user's location
- **💰 Currency & Exchange Rates**: Real-time currency conversion and trends
- **🔥 Travel Trends**: Season information and travel recommendations
- **🥶/🩴 Weather**: Current conditions and daily forecast
- **🎸⚽️ Events**: Upcoming events and activities
- **🏛️ Nearby Attractions**: Popular landmarks and tourist spots
- **🤧🤢 Health Alerts**: Health warnings and safety information
- **🔫 Security**: Travel safety status and recommendations
- **📶 Internet Speed**: Connectivity information (mock data)
- **🏠 STR Availability**: Accommodation booking status and prices

### Technical Features
- **Real-time API Integration**: Weather, currency, and timezone data
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Error Handling**: Graceful fallbacks when APIs fail
- **Modern UI**: Clean, intuitive interface with emojis and icons
- **TypeScript**: Full type safety throughout the application

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd turismo-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Architecture

### Project Structure
```
src/
├── app/                 # Next.js app directory
│   ├── layout.tsx      # Root layout
│   ├── page.tsx        # Main page component
│   └── globals.css     # Global styles
├── components/          # React components
│   ├── SearchForm.tsx           # Destination search
│   ├── LocationSnapshotCard.tsx # Main snapshot display
│   ├── TimezoneCard.tsx         # Timezone information
│   ├── CurrencyCard.tsx         # Currency and rates
│   ├── SeasonCard.tsx           # Season-based travel insights
│   ├── WeatherCard.tsx          # Weather data
│   ├── EventsCard.tsx           # Events listing
│   ├── AttractionsCard.tsx      # Attractions info
│   ├── HealthSecurityCard.tsx   # Health & security
│   ├── InternetSpeedCard.tsx    # Internet connectivity
│   ├── STRAvailabilityCard.tsx  # Accommodation
│   └── ErrorDisplay.tsx         # Error handling
├── services/            # API services
│   └── api.ts          # External API integration
└── types/               # TypeScript definitions
    └── index.ts        # Data interfaces
```

### Component Architecture
- **Modular Design**: Each information type has its own component
- **Reusable Components**: Cards can be easily extended or modified
- **State Management**: React hooks for local state management
- **Error Boundaries**: Graceful error handling throughout the app

## 🔌 API Integration

### External APIs Used
- **WorldTime API**: Timezone and current time data
- **ExchangeRate API**: Currency conversion rates
- **OpenWeatherMap API**: Real-time weather information and forecasts (✅ Integrated)

### Real vs Mock Data
**Real Data (APIs Integrated):**
- **Weather**: OpenWeatherMap API with real-time conditions
- **Timezone**: WorldTime API with current time data
- **Currency**: ExchangeRate API with live rates

**Mock Data (for components without free APIs):**
- Travel trends and seasons
- Local events and attractions
- Health alerts and security status
- Internet speed metrics
- Accommodation availability

## 🎨 UI/UX Features

### Design Principles
- **Modern Aesthetics**: Clean, card-based layout
- **Visual Hierarchy**: Clear information organization
- **Responsive Grid**: Adapts to different screen sizes
- **Color Coding**: Intuitive status indicators
- **Emoji Integration**: Friendly, approachable interface

### Responsive Design
- Mobile-first approach
- Grid layout adapts to screen size
- Touch-friendly interface elements
- Optimized for all device types

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Technology Stack
- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Next.js built-in bundler

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Component-based architecture
- Clean, readable code structure

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically on push

### Other Platforms
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔮 Future Enhancements

### Planned Features
- **User Accounts**: Save favorite destinations
- **Comparison Tool**: Compare multiple destinations
- **Offline Support**: Cache data for offline viewing
- **Notifications**: Weather and event alerts
- **Social Features**: Share travel cues with friends
- **Advanced Search**: Filter by criteria (climate, budget, etc.)

### API Improvements
- **Google Places API**: Real attraction data
- **Event APIs**: PredictHQ integration for real events worldwide
- **Translation**: Multi-language support
- **Maps Integration**: Interactive location maps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **APIs**: WorldTime, ExchangeRate, Open-Meteo
- **Icons**: Lucide React
- **UI Framework**: TailwindCSS
- **Framework**: Next.js team

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Built with ❤️ for travelers around the world by TravelCue**

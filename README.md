# RealEstateFlow

A modern real estate platform with AI-powered property search and recommendations. Experience an intuitive way to find your perfect property with intelligent features and a beautiful user interface.

[Live Demo](https://realestateflow.vercel.app/)

## Features

### AI-Powered Property Assistant
- **Smart Property Descriptions**: Automatically generates detailed, engaging property descriptions
- **Interactive Q&A**: Ask questions about any property and get instant, context-aware answers
- **Similar Property Recommendations**: AI-powered suggestions based on your preferences

### Advanced Property Search
- **Smart Filters**: Filter by price, location, property type, amenities, and more
- **Save Searches**: Save your search preferences for quick access
- **Real-time Updates**: Get notified when new properties match your criteria

### Modern User Interface
- **Responsive Design**: Seamless experience across all devices
- **Dark Mode**: Easy on the eyes with automatic theme switching
- **Image Gallery**: High-quality property images with intuitive navigation

## Tech Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Custom stores with TypeScript
- **AI Integration**: Google Gemini API for property descriptions and Q&A
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/realestateflow.git
cd realestateflow
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

| Variable | Description |
|----------|-------------|
| VITE_GEMINI_API_KEY | Google Gemini API key for AI features |

## Image Guidelines

Property images should follow the guidelines in [Image README](./public/images/README.md):
- Organized directory structure for different property types
- Standardized naming convention
- Image optimization requirements
- Placeholder images for unavailable properties

## AI Features

### Property Description Generation
The AI assistant analyzes property details to generate engaging, natural descriptions highlighting key features, location benefits, and unique selling points.

### Interactive Property Q&A
Users can ask specific questions about properties and receive accurate, context-aware answers. The AI understands:
- Property features and amenities
- Location details and neighborhood information
- Price comparisons and market value
- Rental terms and conditions

### Similar Property Recommendations
The AI analyzes property characteristics to suggest similar listings based on:
- Price range and property type
- Location and neighborhood features
- Amenities and special features
- User preferences and search history

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'Add some AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities
- [Tailwind CSS](https://tailwindcss.com/) for styling

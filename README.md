# Builder Bookings Real Estate Platform

A modern real estate platform built with Next.js, React, and Tailwind CSS, designed for showcasing premium properties and development projects in Dubai.

## Features

- **Modern UI/UX**: Clean, responsive design with smooth animations and transitions
- **Property Listings**: Browse featured projects, apartments, villas, and more
- **Advanced Filtering**: Filter properties by type, status, and other criteria
- **Sorting Options**: Sort properties by price, newest, or featured status
- **Interactive Maps**: View property locations on interactive maps
- **Property Details**: Comprehensive property information with image galleries
- **Favorites System**: Save properties to favorites for later viewing
- **Sharing Functionality**: Share properties via email or social media
- **Developer Profiles**: Learn about the developers behind the projects
- **About Us Page**: Company information, mission, values, and team
- **Responsive Design**: Optimized for all devices from mobile to desktop

## Pages

- **Home**: Landing page with hero carousel, featured projects, and call-to-action sections
- **Featured Projects**: Browse and filter all featured real estate projects
- **Property Detail**: Detailed information about individual properties
- **About Us**: Company information, mission, values, and team members
- **Developers**: Information about property developers
- **Contact**: Contact form and information

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Maps**: Google Maps API
- **Deployment**: Vercel/Cloudflare

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/builder-bookings.git
cd builder-bookings
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Run the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running in Production Mode

```bash
npm start
# or
yarn start
```

## Project Structure

```
├── public/             # Static assets
│   ├── images/         # Images used throughout the site
│   └── ...
├── src/
│   ├── app/            # Next.js app directory
│   │   ├── page.tsx    # Home page
│   │   ├── about/      # About page
│   │   ├── property/   # Property detail pages
│   │   └── properties/ # Property listing pages
│   ├── components/     # Reusable components
│   │   ├── home/       # Home page components
│   │   ├── layout/     # Layout components (header, footer)
│   │   └── ...
│   ├── data/           # Data files
│   │   └── properties.ts # Property data
│   └── types/          # TypeScript type definitions
└── ...
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Images from [Unsplash](https://unsplash.com)
- Icons from [Heroicons](https://heroicons.com)

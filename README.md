# Thai Script Learning PWA

A Progressive Web Application for learning Thai script characters with interactive writing practice, audio pronunciation, and comprehensive lesson management.

## Features

- **Interactive Character Learning**: Learn 44 Thai consonants, 32 vowels, and tone marks
- **Writing Practice**: Canvas-based stroke order practice with real-time feedback
- **Audio Pronunciation**: Native pronunciation for each character
- **Progress Tracking**: Local storage of learning progress and achievements
- **Quiz System**: Multiple question types for comprehensive assessment
- **Mobile-First Design**: Optimized for mobile devices with touch-friendly interface
- **Offline Support**: Full PWA functionality with service worker caching
- **Responsive Layout**: Works seamlessly across desktop, tablet, and mobile

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Headless UI + Heroicons
- **Animations**: Framer Motion
- **Audio**: Howler.js
- **Canvas**: Konva + React-Konva
- **State Management**: Zustand
- **PWA**: Vite PWA Plugin + Workbox
- **Mobile**: Capacitor (ready for mobile app conversion)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/thai-script-app.git
cd thai-script-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment.

### PWA Installation

1. Open the app in a supported browser (Chrome, Edge, Safari)
2. Look for the "Install" button in the address bar or browser menu
3. Click to install the PWA on your device
4. The app will work offline and behave like a native app

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── thai/           # Thai character components
│   ├── learning/       # Learning interface components
│   └── layout/         # Layout components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── stores/             # Zustand state stores
├── data/               # Static data files
└── main.tsx           # Application entry point
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Adding New Characters

1. Add character data to `src/data/thai-characters.json`
2. Include pronunciation audio files in `public/audio/`
3. Add character images/stroke data as needed

### Customizing Lessons

Edit `src/data/lessons.json` to modify lesson structure and character groupings.

## Deployment

### GitHub Pages (Automatic)

The app is configured for automatic deployment to GitHub Pages:

1. Push to `main` or `master` branch
2. GitHub Actions will automatically build and deploy
3. App will be available at `https://yourusername.github.io/thai-script-app`

### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist/` directory to any static hosting service
3. Ensure HTTPS is enabled for PWA features

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit with conventional commits: `git commit -m "feat: add new feature"`
5. Push to your fork: `git push origin feature-name`
6. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thai language learning resources and pronunciation guides
- Open source Thai font resources
- PWA best practices from Google's Web.dev
- React and Vite communities for excellent tooling

## Roadmap

- [ ] Mobile app conversion with Capacitor
- [ ] Advanced stroke recognition algorithms
- [ ] Social features and progress sharing
- [ ] Additional Thai language learning modules
- [ ] Offline-first architecture improvements
- [ ] Accessibility enhancements
- [ ] Multi-language support for the interface

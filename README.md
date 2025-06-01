# DogSocial 🐕

A social networking app for pet owners to find and organize pet-related events in their area.

## Features

- User and pet profiles
- Event discovery and creation
- Real-time chat for events
- Location-based event search
- Push notifications
- Social features for pet owners

## Tech Stack

- **Frontend**: React Native (Expo)
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Authentication**: Firebase Auth
- **Maps**: Google Maps
- **Push Notifications**: Expo Notifications

## Project Structure

```
DogSocial/
├── mobile/           # React Native (Expo) app
├── backend/          # Node.js + Express server
└── docs/            # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- PostgreSQL
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install mobile app dependencies
   cd ../mobile
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both backend and mobile directories
   - Fill in your configuration values

4. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm run dev

   # Start mobile app
   cd ../mobile
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
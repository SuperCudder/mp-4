# National Park Service Buddy

Buddy helps you find  

## Features

- Browse all national parks
- Stay informed on park alerts
- Compare parks for your next trip

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get your NPS API key:**
   - Visit: https://www.nps.gov/subjects/developer/get-started.htm
   - Click "Get an API Key"
   - Fill out the form and check your email
   - Test your key: `https://developer.nps.gov/api/v1/parks?limit=5&api_key=YOUR_KEY`

3. **Configure environment variables:**
   - Copy `.env.example` to `.env.local`
   - Add your API key:
     ```
     NPS_API_KEY=your_actual_api_key_here
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## API Info

National Park Service API:
- Base URL: `https://developer.nps.gov/api/v1`
- Documentation: https://www.nps.gov/subjects/developer/api-documentation.htm
- Endpoints used:
  - `/parks` - Get parks list
  - `/parks/{parkCode}` - Get specific park details
  - `/alerts` - Get alerts for parks
  - `/events` - Get events/programs
>>>>>>> master

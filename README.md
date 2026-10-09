# ⚡ Voltway

**Find EV charging stations near you, or host your own.**

Voltway is a web platform that helps EV owners locate nearby charging stations on an interactive map. It also lets the community list and host local charging points, expanding coverage where it's needed most.


---

## 📌 Problem Statement

EV owners often struggle to find reliable charging stations nearby, especially outside major cities. Voltway tackles this by combining mapping technology with community participation, so anyone can discover or contribute charging points.

## ✨ Features

- 🗺️ **Interactive map** to locate nearby charging stations, powered by OpenStreetMap
- 📍 **Location-based search** for accurate and efficient results
- 🤝 **Community hosting:** users can list and host their own local charging stations
- 🎨 **Modern, intuitive UI** focused on accessibility and ease of use
- [📱 Responsive design for mobile and desktop]
- [🔐 User authentication]

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | [React.js, HTML, CSS, JavaScript] |
| Maps | OpenStreetMap, [Leaflet.js] |
| Backend | [Node.js, Express.js] |
| Database | [MongoDB] |
| Auth | [JWT] |


## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or above)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone [YOUR_REPO_LINK].git
   cd voltway
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd server
   npm install

   # Frontend
   cd ../client
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the `server` folder:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Run the app**
   ```bash
   # Start backend
   cd server
   npm start

   # Start frontend (in a new terminal)
   cd client
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📂 Project Structure

```
voltway/
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
├── server/          # Node/Express backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── server.js
└── README.md
```

## 🔮 Future Improvements

- Real-time charger availability status
- Ratings and reviews for stations
- Filters by connector type and charging speed
- Route planning with charging stops

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m "Add AmazingFeature"`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 👤 Author

**Satyam Rai**
- GitHub: https://github.com/satyamrai0201
- LinkedIn: [Satyam Rai ](https://www.linkedin.com/in/satyamrai0201/)

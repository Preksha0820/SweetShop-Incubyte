
# 🍬 Sweet Shop Management System

## 📌 Project Overview
A full-stack web application for managing sweet shop inventory with secure authentication, product management, and purchase functionality.

---

## 🚀 Features
- **User Authentication** — Register & Login using JWT  
- **Sweet Management** — View, search & filter sweets  
- **Purchase System** — Users can purchase sweets (inventory decreases)  
- **Admin Panel** — Add, update, delete & restock sweets  
- **Responsive UI** — Works across devices  

---

## 🧰 Tech Stack

### **Backend**
- Node.js + Express  
- TypeScript  
- MongoDB + Mongoose  
- JWT authentication  
- Jest (Unit Testing)

### **Frontend**
- React 18  
- TypeScript  
- Vite  
- React Router  
- Axios  

---

## 📁 Repository Structure

```
SweetShop/
├── backend/
│   ├── src/
│   │   ├── __tests__/          
│   │   ├── config/             
│   │   ├── controllers/        
│   │   ├── middleware/         
│   │   ├── models/             
│   │   ├── routes/             
│   │   └── server.ts           
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         
│   │   ├── context/            
│   │   ├── pages/              
│   │   ├── App.jsx             
│   │   └── main.jsx            
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚙️ Backend Setup

1. Navigate into backend  
   ```bash
   cd backend
   npm install
   ```
2. Create `.env`
   ```
   PORT=5000
   MONGODB_URI=ongodb+srv://sweetuser:SweetPass123!@cluster0.7zetr.mongodb.net/sweetshop?appName=Cluster0
   JWT_SECRET=TheSweetShopSecret
   NODE_ENV=development
   ```
3. Run server  
   ```bash
   npm run dev
   ```
---

## 🎨 Frontend Setup

1. Navigate into frontend  
   ```bash
   cd frontend
   npm install
   ```
2. Start dev server  
   ```bash
   npm run dev
   ```
---

## 🛠 API Summary

### **Authentication**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |

### **Sweets (Protected)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/sweets` | List all sweets |
| GET | `/api/sweets/search` | Search sweets |
| POST | `/api/sweets` | Add sweet (admin) |
| PUT | `/api/sweets/:id` | Update sweet (admin) |
| DELETE | `/api/sweets/:id` | Delete sweet (admin) |

### **Inventory**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sweets/:id/purchase` | Purchase |
| POST | `/api/sweets/:id/restock` | Restock (admin) |

---

## 🧪 Testing

Run Jest tests:

```bash
cd backend
npm test
```

With coverage:

```bash
npm test -- --coverage
```

---

## 📸 Screenshots

![alt text](frontend/assets/ss1.png)

![alt text](frontend/assets/ss2.png)

---

# 📘 My AI Usage

This project includes the required "My AI Usage" documentation.

### **AI Tools Used**
- **ChatGPT (GPT‑5.1)** — Code guidance, debugging help, documentation  
- **GitHub Copilot** — Inline code suggestions  
- **Gemini** — Occasional help structuring API flows  

---

### **How AI Was Used**
- Helped generate boilerplate for Express routes, controllers, and Jest tests  
- Used to debug TypeScript model errors  
- Assisted in structuring the frontend pages and state management  
- Generated parts of this README documentation  
- Asking for best practices in JWT security & folder structuring  

---

### **Reflection on AI Usage**
AI tools significantly improved the speed of development.  
They helped me:
- Fix errors faster  
- Write boilerplate code quickly  
- Maintain consistent project structure  
- Learn better practices

However, **I manually reviewed, corrected, and validated all AI‑suggested code**, ensuring the final implementation was fully understood and written intentionally.

---


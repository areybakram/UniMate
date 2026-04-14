# UniMate Campus Hub 🏛️🚀

Welcome to the **UniMate Campus Hub** repository. UniMate is a comprehensive, production-grade campus management application designed to unify and streamline the academic and administrative experience for university stakeholders, including Students, Teachers, and Security Teams.

> 🛠️ **Status:** Active Development (Work in Progress)
> _Note: This application is currently undergoing active development and continuous integration of advanced features. The architecture is designed to scale and represent a complete, industry-standard solution._

---

## 🌟 Project Overview

**UniMate is not just a UI mockup. It is a fully decoupled, micro-service-inspired mobile ecosystem that leverages automated AI processing, WebSocket-driven real-time coordination, and strict database normalization to solve complex campus logistics at scale.**

The project showcases industry-standard practices in UI/UX design, state management, real-time communication, and data synchronization.

### 🎯 Key Objectives
- **Centralized Ecosystem:** Provide a single hub for academic tracking, campus navigation, and community interaction.
- **Role-Based Workflows:** Deliver customized, dynamic experiences tailored to specific user roles (Students, Teachers, Guards).
- **Intelligent Automation:** Leverage backend AI processing for automated tasks (e.g., intelligent context extraction from academic data).
- **Real-Time Connectivity:** Foster campus community through instant communication modules (Lost & Found, Lend & Borrow, Emergency).

---

## 🏗️ Technical Architecture & Advanced Concepts

The most significant architectural decision in UniMate is its **fully decoupled design**. Instead of tightly packing all logic into the React Native mobile app (which bloats app size and drains battery), we split the system into specialized tiers:

### 1. The Client (Frontend)
- **Framework:** [React Native](https://reactnative.dev/) powered by [Expo](https://expo.dev/)
- **Responsibility:** Exclusively renders the UI, manages local state, and provides a smooth 60fps user experience using our custom "Slate" design language.
- **Offline-First State Management:** Using `AsyncStorage`, the app caches heavy payloads (like the user's Timetable, Analytics, and Profile Data). When opened offline, it loads instantly using cached data. Once connection is restored, it quietly syncs with the database in the background.

### 2. The Brain (Backend) & Computational Offloading
- **Environment:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Advanced Concept (Computational Offloading):** Parsing complex Excel timetables or using AI to scan Student ID cards requires massive computational power. Instead of forcing the mobile processor to do this, the frontend securely offloads the raw data to the Express backend. The server crunches the data, runs intensive AI heuristics, structures it into optimized JSON, and sends only the lightweight result back to the phone.

### 3. The Real-Time Engine (WebSockets + REST)
- **Technology:** [Socket.io](https://socket.io/)
- **Advanced Concept (Hybrid Syncing):** For 1-on-1 chatting in the Lost & Found module, when a user sends a message, it is instantly relayed via WebSocket for zero-latency UI updates. Simultaneously, the Node.js backend intercepts that payload and silently executes a background worker thread to persist the message into the PostgreSQL database. This guarantees instant responsiveness while ensuring zero data loss if a client disconnects.

### 4. The Vault (Database & Auth)
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Strict Data Integrity:** We don't trust user input. During signup, the frontend enforces strict Regular Expressions (e.g., `FA22-BCS-110`). Furthermore, we use logic to intelligently extract hidden metadata—automatically deducing that the student's `batch` is `FA22` from the registration number without ever asking the user, ensuring the database remains completely normalized.

---

## ✨ Core Modules & Workflows

### 👥 Dynamic Role-Based Access Control (RBAC)
The application morphology adapts entirely based on the authenticated profile using a centralized Context:
- **Student Dashboard:** Timetable tracking, personalized task managers, attendance analytics, and quick tools.
- **Teacher Dashboard:** Streamlined access to faculty tools and simplified class/notification management.
- **Guard Dashboard:** Security-first interface highlighting relevant campus alerts and monitoring nodes.

*We serve three entirely different applications from a single, highly-maintainable codebase.*

### 🤝 Campus Community Utilities
We built major peer-to-peer economies within the app:
- **Lost & Found:** Users report incidents. If someone finds an item, they initiate a "Claim." This action dynamically spawns a highly secure, ephemeral 1-on-1 Chat Room (powered by WebSockets) so parties can coordinate without exposing personal phone numbers. Once returned, it is marked "Handed Over" and logged.
- **Lend & Borrow Marketplace:** A portal for sharing academic resources (calculators, books). It tracks the lifecycle of an item from "Open Request" -> "Active Offer" -> "Handed Over".

---

## 🎨 Premium UI/UX Polish

A production app must feel native. We achieved this through:
- **Keyboard-Aware Logic:** Mapped `Keyboard.dismiss` to `TouchableWithoutFeedback` backdrop wrappings. Tapping anywhere outside an active text input gracefully hides the keyboard, matching native iOS/Android expectations.
- **Auto-Formatting:** Input fields automatically capitalize academic IDs to explicitly ensure the user doesn't accidentally trigger validation errors.
- **Dynamic UI Context:** Home screen headers intelligently drop generic titles and perfectly display the student's exact Registration Number (e.g., `FA22-BCS-110`) mapped directly from the database context.

---

## 🚀 Getting Started (Local Development)

### Prerequisites
- Node.js (v18+)
- Expo CLI (`npm install -g expo-cli`)
- Supabase Project credentials

### 1. Backend Setup
```bash
cd backend
npm install
# Create a .env file containing your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
npm start
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npx expo start -c
```

---

## 📅 Roadmap & Ongoing Work
The UniMate platform is a living ecosystem. Active development is underway for:
- [ ] Transitioning all keystores to secure production environment variables.
- [ ] Deepening backend AI integration for advanced timetable/document parsing and automated advisement.
- [ ] Finalizing full end-to-end encryption for peer-to-peer chat modules.
- [ ] Polishing production builds for App Store and Play Store distribution.

---

*Designed and developed to set a new technical standard for campus management infrastructure.*

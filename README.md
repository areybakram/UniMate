# UniMate Campus Hub

> **Status:** Active Development

UniMate Campus Hub is a modern campus management application built to simplify academic and administrative activities for university stakeholders. The platform provides a unified mobile experience for students, teachers, and campus security personnel through role-based access, intelligent automation, real-time communication, and cloud-based infrastructure.

The project is being developed as a production-oriented application following modern software engineering principles, scalable architecture, and industry best practices.

---

# Table of Contents

- Project Overview
- Features
- System Architecture
- Technology Stack
- Core Modules
- Security & Authentication
- AI Integration
- Project Structure
- Getting Started
- Development Roadmap

---

# Project Overview

Universities typically rely on multiple disconnected systems for navigation, communication, academic resources, and student services. UniMate aims to centralize these services into a single mobile platform.

The application is designed with a decoupled architecture where the mobile application, backend services, AI processing, and database operate independently while communicating through secure APIs and real-time services.

The primary goals of the project are:

- Centralize campus services into a single application
- Provide role-specific experiences for different users
- Enable real-time communication
- Integrate AI to automate academic workflows
- Build a scalable and maintainable production-ready system

---

# Features

## Role-Based Access Control

Different dashboards and functionality are provided based on authenticated user roles.

### Student

- Smart timetable management
- Campus navigation
- Lost & Found
- Lend & Borrow marketplace
- AI-generated lecture notes
- Academic resources
- Emergency contacts

### Teacher

- Faculty dashboard
- Class management
- Notifications
- Academic resources

### Security Staff

- Security dashboard
- Campus monitoring
- Emergency management
- Incident reporting

---

# System Architecture

UniMate follows a multi-tier architecture that separates responsibilities across different services.

## Mobile Application

**Framework**

- React Native
- Expo

**Responsibilities**

- User Interface
- Local state management
- Authentication
- Offline caching
- API communication

The application follows an offline-first approach by caching frequently used data locally using AsyncStorage. Cached data is synchronized automatically whenever an internet connection becomes available.

---

## Backend Services

**Technology**

- Node.js
- Express.js

The backend is responsible for:

- Business logic
- Authentication
- API endpoints
- AI request processing
- Data validation
- File processing

Computationally expensive tasks such as document parsing and AI processing are executed on the server rather than on the mobile device.

---

## Database

**Platform**

- Supabase
- PostgreSQL

The database manages:

- User accounts
- Timetables
- Community posts
- Chat data
- Notifications
- Academic resources

Data validation is enforced at both the client and server levels to maintain data integrity.

---

## Real-Time Communication

**Technology**

- Socket.IO

Real-time communication is used for:

- Chat messaging
- Live notifications
- Community interactions
- Emergency updates

REST APIs handle persistent operations while Socket.IO delivers instant updates.

---

# AI Integration

UniMate integrates Google's Gemini 2.5 Flash model to automate several academic tasks.

Current AI features include:

- Registration card information extraction
- Course identification
- Lecture transcription
- Structured lecture note generation
- Academic content summarization

AI processing is performed on the backend, allowing the mobile application to remain lightweight and responsive.

---

# Technology Stack

## Mobile

- React Native
- Expo
- Expo Router
- TypeScript
- NativeWind
- React Native Paper

## Backend

- Node.js
- Express.js
- Socket.IO

## Database

- Supabase
- PostgreSQL

## AI

- Google Gemini 2.5 Flash

## Other Services

- Google Maps API
- AsyncStorage

---

# Core Modules

## Smart Timetable

- Digital timetable management
- Offline access
- Automatic synchronization

---

## Campus Navigation

- Interactive campus map
- Building information
- Navigation assistance

---

## Lost & Found

Students can report lost items and communicate with finders through private real-time chat without exposing personal contact information.

---

## Lend & Borrow

A community marketplace where students can lend or borrow academic resources such as books, calculators, and laboratory equipment.

---

## AI Lecture Notes

Students can upload or record lectures, which are processed using AI to generate structured study notes including:

- Overview
- Key concepts
- Detailed explanations
- Organized sections

---

## Emergency Services

Provides quick access to emergency contacts and campus security communication.

---

# Security & Authentication

The application implements multiple security measures including:

- Role-Based Access Control (RBAC)
- Secure authentication
- Input validation
- Server-side verification
- Protected API routes
- Database integrity constraints

---

# Project Structure

```
UniMate/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── services/
│   ├── assets/
│   └── utils/
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── services/
│   ├── sockets/
│   └── utils/
│
└── README.md
```

---

# Getting Started

## Prerequisites

- Node.js 18 or later
- npm
- Expo CLI
- Supabase project
- Google Maps API Key
- Gemini API Key

---

## Backend

```bash
cd backend

npm install

npm run dev
```

Create a `.env` file and configure the required environment variables.

Example:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
GEMINI_API_KEY=
```

---

## Frontend

```bash
cd frontend

npm install

npx expo start
```

Run the application using:

- Android Emulator
- iOS Simulator
- Physical Android Device
- Physical iOS Device

---

# Development Roadmap

Current development priorities include:

- Production deployment
- Enhanced AI capabilities
- End-to-end encrypted messaging
- Advanced timetable automation
- Push notifications
- Improved analytics
- Performance optimization
- Play Store and App Store release

---

# Development Status

UniMate is currently under active development. Features are continuously being implemented, improved, and tested. The architecture is designed to support future scalability and additional campus services.

---

# License

This project is currently intended for academic and portfolio purposes. Licensing information will be added upon public release.

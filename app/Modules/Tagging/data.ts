interface Building {
  id: string;
  short: string;
  title: string;
  subtitle: string;
  description: string;
  x: number;
  y: number;
  hours: string;
  contact: string;
  departments?: string;
  facilities?: string;
  features?: string[];
  images: any;
}

// Normalized coordinates (x, y) in range [0, 1] relative to image dimensions
// Adjust these values to fine-tune tag positions on your map
const buildings: Building[] = [
  {
    id: "n-block",
    short: "N",
    title: "N Block",
    subtitle: "Academic Building",
    description:
      "N Block is one of the main academic buildings housing multiple departments including Computer Science, Software Engineering, and IT. The building features modern classrooms, computer labs, and faculty offices.",
    x: 0.42,
    y: 0.6,
    hours: "8:00 AM - 6:00 PM",
    contact: "n-block@comsats.edu.pk",
    departments: "CS, SE, IT",
    facilities: "Classrooms, Labs, Faculty Offices",
    features: [
      "State-of-the-art computer laboratories",
      "Air-conditioned lecture halls",
      "High-speed internet connectivity",
      "Student common areas",
    ],
    images: [
      require("../../../assets/buildings/n-block-1.jpg"),
      require("../../../assets/buildings/n-block-2.jpg"),
      require("../../../assets/buildings/n-block-3.jpg"),
    ],
  },
  {
    id: "k-block",
    short: "K",
    title: "K Block",
    subtitle: "Academic Building",
    description:
      "K Block serves as a major academic facility with lecture halls and specialized laboratories. It accommodates various engineering and science departments with modern teaching facilities.",
    x: 0.79,
    y: 0.58,
    hours: "8:00 AM - 6:00 PM",
    contact: "k-block@comsats.edu.pk",
    departments: "Engineering, Sciences",
    facilities: "Lecture Halls, Labs, Seminar Rooms",
    features: [
      "Large capacity lecture theaters",
      "Research laboratories",
      "Project workspaces",
      "Faculty consultation rooms",
    ],
    images: [
      require("../../../assets/buildings/k-block-1.jpg"),
      require("../../../assets/buildings/k-block-2.jpg"),
    ],
  },
  {
    id: "physics-block",
    short: "Phy",
    title: "Physics Block",
    subtitle: "Department Building",
    description:
      "The Physics Block is dedicated to the Department of Physics, featuring specialized laboratories for experimental physics, optics, and quantum mechanics research.",
    x: 0.72,
    y: 0.66,
    hours: "8:00 AM - 6:00 PM",
    contact: "physics@comsats.edu.pk",
    departments: "Physics",
    facilities: "Research Labs, Classrooms",
    features: [
      "Advanced physics laboratories",
      "Research equipment and instruments",
      "Dedicated faculty research areas",
      "Undergraduate and graduate facilities",
    ],
    images: [
      require("../../../assets/buildings/physics-block-1.jpg"),
      require("../../../assets/buildings/physics-block-2.jpg"),
      require("../../../assets/buildings/physics-block-3.jpg"),
    ],
  },
  {
    id: "cafeteria",
    short: "Cafe",
    title: "COMSATS Cafeteria",
    subtitle: "Food & Dining",
    description:
      "The main campus cafeteria provides a variety of food options for students, faculty, and staff. It offers both indoor and outdoor seating areas with a diverse menu.",
    x: 0.46,
    y: 0.72,
    hours: "8:00 AM - 9:00 PM",
    contact: "cafeteria@comsats.edu.pk",
    facilities: "Dining Hall, Food Court",
    features: [
      "Multiple food vendors",
      "Indoor and outdoor seating",
      "Affordable meal options",
      "Student gathering space",
    ],
    images: [
      require("../../../assets/buildings/cafeteria-1.jpg"),
      require("../../../assets/buildings/cafeteria-2.jpg"),
    ],
  },
  {
    id: "cricket-ground",
    short: "Crkt",
    title: "Cricket Ground",
    subtitle: "Sports Facility",
    description:
      "The university cricket ground is used for sports activities, cricket matches, and physical education classes. It serves as a venue for inter-departmental tournaments.",
    x: 0.57,
    y: 0.77,
    hours: "6:00 AM - 10:00 PM",
    contact: "sports@comsats.edu.pk",
    facilities: "Cricket Field, Practice Nets",
    features: [
      "Full-size cricket pitch",
      "Practice nets",
      "Spectator seating",
      "Floodlights for evening matches",
    ],
    images: [
      require("../../../assets/buildings/cricket-ground-1.jpg"),
      require("../../../assets/buildings/cricket-ground-2.jpg"),
    ],
  },
  {
    id: "faculty-block",
    short: "F",
    title: "Faculty Block",
    subtitle: "Administrative Building",
    description:
      "The Faculty Block houses administrative offices, faculty rooms, and meeting spaces. It serves as the central hub for academic administration and faculty coordination.",
    x: 0.55,
    y: 0.36,
    hours: "9:00 AM - 5:00 PM",
    contact: "faculty@comsats.edu.pk",
    departments: "Administration, Faculty Offices",
    facilities: "Offices, Meeting Rooms",
    features: [
      "Faculty offices for all departments",
      "Administrative services",
      "Meeting and conference rooms",
      "Student advisory services",
    ],
    images: [
      require("../../../assets/buildings/faculty-block-1.jpg"),
      require("../../../assets/buildings/faculty-block-2.jpg"),
    ],
  },
];

export default buildings;

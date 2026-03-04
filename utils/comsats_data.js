const dataset = [
  // ===== General COMSATS Info =====
  {
    type: "general",
    category: "Campus",
    question: "When was COMSATS Lahore campus established?",
    answer: "COMSATS Lahore Campus was established in January 2002.",
  },
  {
    type: "general",
    category: "Campus",
    question: "Where is COMSATS Lahore located?",
    answer:
      "The campus is located 1.5 km on Defence Road, off Raiwind Road, Lahore.",
  },
  {
    type: "general",
    category: "Campus",
    question: "How big is the COMSATS Lahore campus?",
    answer:
      "The campus spans 185 acres and includes over 400,000 sq. ft. of infrastructure.",
  },
  {
    type: "general",
    category: "Campus",
    question: "How many students are enrolled at COMSATS Lahore?",
    answer: "Approximately 8,000 students are currently enrolled.",
  },
  {
    type: "general",
    category: "Campus",
    question: "How many departments are there?",
    answer: "There are 14 academic departments at COMSATS Lahore.",
  },
  {
    type: "general",
    category: "Student Services",
    question: "Are hostel facilities available?",
    answer:
      "Yes, separate hostel facilities are available for male and female students.",
  },
  {
    type: "general",
    category: "Campus",
    question: "What facilities are on campus?",
    answer:
      "Facilities include library, health center, sports complex, transport, and career services.",
  },
  {
    type: "general",
    category: "Academics",
    question: "What is the minimum CGPA?",
    answer:
      "Minimum CGPA for good standing is 2.00. Two probations lead to dismissal.",
  },
  {
    type: "general",
    category: "Campus",
    question: "Where is N Block?",
    answer:
      "N Block is in front of Student Service Center near cricket stadium.",
  },
  {
    type: "general",
    category: "Campus",
    question: "How many libraries are there?",
    answer: "Two libraries: A-Block Main Library and O-Block Masters Library.",
  },
  {
    type: "general",
    category: "Admissions",
    question: "Where do I pay fees?",
    answer:
      "For fee-related accounts, please visit the Student Services or H-Block accounts office.",
  },
  {
    type: "general",
    category: "Faculty",
    question: "I want to meet a professor",
    answer:
      "To visit a professor, first check your teacher's timetable, then visit the faculty block or H Block according to the department.",
  },
  {
    type: "general",
    category: "Academics",
    question: "How can I find my classroom or timetable?",
    answer:
      "Check your course timetable online on the COMSATS website and visit H Block for department-specific info.",
  },
  {
    type: "general",
    category: "Admissions",
    question: "What is the tuition fee at COMSATS Lahore?",
    answer: `The tuition fee at COMSATS Lahore varies by program:
- BS Computer Science / Engineering: PKR 135,000–160,000 per semester
- MS Programs: PKR 90,000–130,000 per semester
- PhD Programs: PKR 85,000–115,000 per semester

Other charges:
- Admission Fee: PKR 22,000 (one-time)
- Registration Fee: PKR 7,000 per semester
- Degree Award Fee: PKR 10,000 upon graduation
Hostel and transport charges are separate.

For detailed fee structure, see the official page: https://lahore.comsats.edu.pk/admissions/fee.aspx`,
  },

  // ===== Faculty Data (Computer Science) =====
  {
    type: "faculty",
    category: "Faculty",
    name: "Dr. Abid Sohail Bhutta",
    designation: "Associate Professor",
    department: "Computer Science",
    area: "Data Science, Business Analytics, Intelligent Process Design",
    hod: false,
  },
  {
    type: "faculty",
    category: "Faculty",
    name: "Dr. Adnan Ahmad",
    designation: "Associate Professor",
    department: "Computer Science",
    area: "Cyber Security, Penetration Testing, Digital Forensics, IoT",
    hod: false,
  },
  {
    type: "faculty",
    category: "Faculty",
    name: "Dr. Ahsan Raza Khan",
    designation: "Assistant Professor",
    department: "Computer Science",
    area: "Not specified",
    hod: false,
  },
  {
    type: "faculty",
    category: "Faculty",
    name: "Dr. Allah Bux Sargano",
    designation: "Assistant Professor (On Leave)",
    department: "Computer Science",
    area: "Image Processing, Computer Vision, Deep Learning",
    hod: false,
  },
  {
    type: "faculty",
    category: "Faculty",
    name: "Dr. Ashfaq Ahmad",
    designation: "Associate Professor",
    department: "Computer Science",
    area: "AI, Machine Learning, Deep Learning",
    hod: false,
  },
  {
    type: "faculty",
    category: "Faculty",
    name: "Dr. Atif Saeed",
    designation: "Assistant Professor",
    department: "Computer Science",
    area: "Cloud Computing, Cyber Security, Networks",
    hod: false,
  },
  {
    type: "faculty",
    category: "Faculty",
    name: "Dr. Atifa Athar",
    designation: "Assistant Professor",
    department: "Computer Science",
    area: "AI, Neural Networks, Fuzzy Logic",
    hod: false,
  },
  {
    type: "faculty",
    category: "Faculty",
    name: "Dr. Farooq Ahmad",
    designation: "HOD / Associate Professor",
    department: "Computer Science",
    area: "Formal Methods, Modeling & Simulation",
    hod: true,
  },

  // ===== Admissions FAQs =====
  {
    type: "general",
    category: "Admissions",
    question: "Do I need an entry test for COMSATS?",
    answer:
      "Yes, NTS entry test is required. NAT for undergraduate programs and GAT General for graduate/PhD programs.",
  },
  {
    type: "general",
    category: "Admissions",
    question: "Can result-awaiting students apply?",
    answer:
      "Yes, students awaiting results can apply provisionally but must submit final results within the required timeframe.",
  },
  {
    type: "general",
    category: "Admissions",
    question: "Is there an age limit for admission?",
    answer: "No, there is no age limit for applying to COMSATS Lahore.",
  },
  {
    type: "general",
    category: "Admissions",
    question: "How is merit calculated?",
    answer:
      "Merit is calculated based on academic scores and entry test results, varying by program.",
  },
  {
    type: "general",
    category: "Admissions",
    question: "What is the refund policy?",
    answer:
      "100% tuition fee (excluding admission fee) refunded if applied in the first week; 50% in the second week.",
  },
  {
    type: "general",
    category: "Student Services",
    question: "How are hostel rooms allotted?",
    answer: "Hostel rooms are allocated based on merit and availability.",
  },
  {
    type: "general",
    category: "Student Services",
    question: "What are transport charges?",
    answer:
      "Transport charges are approximately PKR 37,000 per semester (may vary).",
  },
  {
    type: "general",
    category: "Faculty Links",
    question: "Faculty list for management sciences",
    answer:
      "COMSATS Lahore Management Sciences Faculty: https://lahore.comsats.edu.pk/ms/faculty.aspx",
  },
  {
    type: "general",
    category: "Faculty Links",
    question: "Electrical Engineering faculty",
    answer:
      "COMSATS Lahore EE Faculty: https://lahore.comsats.edu.pk/ee/faculty.aspx",
  },
  {
    type: "general",
    category: "Faculty Links",
    question: "Computer Engineering faculty",
    answer:
      "COMSATS Lahore CE Faculty: https://lahore.comsats.edu.pk/ce/faculty.aspx",
  },
  {
    type: "general",
    category: "Faculty Links",
    question: "Pharmacy faculty",
    answer:
      "COMSATS Lahore Pharmacy Faculty: https://lahore.comsats.edu.pk/pharmacy/Faculty.aspx",
  },

  {
    type: "general",
    category: "Academics",
    question: "How can I find my classroom or timetable?",
    answer: "Check your course timetable online on the COMSATS website.",
  },
  {
    type: "general",
    category: "Contact",
    question: "What is the address of COMSATS Lahore?",
    answer: "1.5 KM Defence Road, Off Raiwind Road, Lahore, Pakistan",
  },
  {
    type: "general",
    category: "Contact",
    question: "How can I contact admissions?",
    answer: "Email: admissions@cuilahore.edu.pk\nPhone: +92 42 111-001-007",
  },
  {
    type: "general",
    category: "Contact",
    question: "Where can I find COMSATS official website?",
    answer: "Visit: https://lahore.comsats.edu.pk",
  },
  {
    type: "general",
    category: "Admissions",
    question: "Fee details or merit lists",
    answer: "For the latest info, visit: https://lahore.comsats.edu.pk",
  },
  {
    type: "general",
    category: "Admissions",
    question: "Scholarship information",
    answer: "Visit: https://lahore.comsats.edu.pk/default.aspx",
  },
  {
    type: "general",
    category: "Student Services",
    question: "Final term results",
    answer: "Log in: https://cuonline.cuilahore.edu.pk:8091/",
  },
  {
    type: "general",
    category: "Student Services",
    question: "Other confidential or frequently updated info",
    answer: "Always visit: https://lahore.comsats.edu.pk",
  },
];

export default dataset;

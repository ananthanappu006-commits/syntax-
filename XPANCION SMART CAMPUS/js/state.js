/* ==========================================================================
   SmartCampus Central State Management & Mock Database
   ========================================================================== */

const STORAGE_KEY = 'smartcampus_db_v1';

// Seed Initial Campus Data
const DEFAULT_CAMPUS_DATA = {
  currentUser: {
    id: 'usr_001',
    name: 'KASINADH.S',
    role: 'student', // student | faculty | admin | security | maintenance
    department: 'Computer Science & Engineering',
    email: 'kasinadh.s@campus.edu',
    studentId: 'CS2023-884',
    avatar: '👨‍🎓',
    semester: '6th Semester',
    unreadCount: 3
  },

  announcements: [
    {
      id: 'ann_1',
      title: '📢 Internal Assessment Exam Schedule Released',
      department: 'Academic Affairs',
      date: 'Today, 09:30 AM',
      priority: 'high',
      target: 'All Students',
      content: 'The 2nd Internal Assessment examinations for all 4th, 6th and 8th semester B.Tech students will commence from next Monday. Please review the detailed timetable in your portal.'
    },
    {
      id: 'ann_2',
      title: '🚀 Annual Hackathon 2026 Registrations Open',
      department: 'Innovation & Tech Cell',
      date: 'Yesterday',
      priority: 'medium',
      target: 'Students & Faculty',
      content: 'Join the 36-hour Smart Campus Hackathon with over ₹1,00,000 in cash prizes. Teams of 2-4 can register until Friday midnight.'
    },
    {
      id: 'ann_3',
      title: '⚠️ Scheduled Power Maintenance in Tech Tower',
      department: 'Electrical Maintenance',
      date: '24 Sep 2026',
      priority: 'urgent',
      target: 'Campus Wide',
      content: 'Power backup switch testing will occur between 04:00 PM and 05:00 PM today in Tech Tower Floors 2 and 3. Please save ongoing work.'
    }
  ],

  rooms: [
    {
      id: 'rm_204',
      name: 'Lecture Room 204',
      building: 'Main Block',
      floor: 2,
      type: 'Classroom',
      capacity: 60,
      status: 'occupied', // available | occupied | reserved
      features: ['4K Projector', 'Air Conditioned', 'Audio System'],
      currentBooking: {
        by: 'Prof. Rajesh K.',
        subject: 'Database Systems',
        until: '03:30 PM'
      },
      nextAvailable: '03:30 PM'
    },
    {
      id: 'rm_301',
      name: 'Smart Seminar Hall',
      building: 'Tech Tower',
      floor: 3,
      type: 'Auditorium',
      capacity: 120,
      status: 'available',
      features: ['Dual Displays', 'Mic Array', 'Recording Rig', 'Central AC'],
      currentBooking: null,
      nextAvailable: 'Now'
    },
    {
      id: 'lab_eee1',
      name: 'EEE Power Systems Lab 1',
      building: 'Main Block',
      floor: 1,
      type: 'Laboratory',
      capacity: 35,
      status: 'available',
      features: ['Digital Oscilloscopes', '3-Phase Benches', 'Safety Kits'],
      currentBooking: null,
      nextAvailable: 'Now'
    },
    {
      id: 'lab_cs_innov',
      name: 'AI & Robotics Innovation Lab',
      building: 'Tech Tower',
      floor: 4,
      type: 'Laboratory',
      capacity: 40,
      status: 'reserved',
      features: ['NVIDIA GPU Rigs', '3D Printers', 'High-Speed LAN'],
      currentBooking: {
        by: 'Robotics Club',
        subject: 'Autonomous Rover Testing',
        until: '05:00 PM'
      },
      nextAvailable: '05:00 PM'
    },
    {
      id: 'rm_conf_b',
      name: 'Faculty Conference Room B',
      building: 'Admin Block',
      floor: 1,
      type: 'Meeting Room',
      capacity: 20,
      status: 'available',
      features: ['Video Conferencing', 'Whiteboard Wall'],
      currentBooking: null,
      nextAvailable: 'Now'
    },
    {
      id: 'lab_chem_1',
      name: 'Advanced Chemistry Lab',
      building: 'Science Wing',
      floor: 2,
      type: 'Laboratory',
      capacity: 30,
      status: 'occupied',
      features: ['Fume Hoods', 'Centrifuges', 'Emergency Shower'],
      currentBooking: {
        by: 'Dr. Meenakshi S.',
        subject: 'Organic Synthesis Lab',
        until: '04:15 PM'
      },
      nextAvailable: '04:15 PM'
    }
  ],

  complaints: [
    {
      id: 'CMP-1024',
      title: 'Ceiling Projector HDMI Flickering',
      location: 'Room 204 (Main Block)',
      department: 'Electrical Maintenance',
      category: 'Equipment',
      priority: 'high',
      status: 'in_progress', // submitted | assigned | in_progress | resolved | closed
      reportedBy: 'KASINADH.S',
      date: '2026-09-24',
      assignedTo: 'Technician Suresh Kumar',
      description: 'The projector keeps disconnecting every 5 minutes during presentations. Cable or port seems damaged.',
      timeline: [
        { time: '09:15 AM', text: 'Submitted by student' },
        { time: '09:18 AM', text: 'AI Classified: Equipment / High Priority' },
        { time: '10:00 AM', text: 'Assigned to Electrical Dept' },
        { time: '01:30 PM', text: 'Technician began diagnostic' }
      ]
    },
    {
      id: 'CMP-1025',
      title: 'Water Leakage Near Lab Entrance',
      location: 'EEE Lab 1 Corridor',
      department: 'Plumbing & Sanitation',
      category: 'Plumbing',
      priority: 'medium',
      status: 'submitted',
      reportedBy: 'Kavya Nair',
      date: '2026-09-25',
      assignedTo: 'Unassigned',
      description: 'Water dripping from HVAC unit above the doorway creating a slip hazard.',
      timeline: [
        { time: '11:45 AM', text: 'Reported with photo' },
        { time: '11:46 AM', text: 'AI Identified: Slip Hazard / Medium Priority' }
      ]
    },
    {
      id: 'CMP-1021',
      title: 'High-Speed Wi-Fi Deadzone in 3rd Floor Library',
      location: 'Central Library, Reading Hall 2',
      department: 'Network Operations (IT)',
      category: 'Network',
      priority: 'medium',
      status: 'resolved',
      reportedBy: 'Devendra P.',
      date: '2026-09-23',
      assignedTo: 'SysAdmin Alex',
      description: 'AP-LIB-04 was rebooting repeatedly.',
      timeline: [
        { time: '08:00 AM', text: 'Complaint lodged' },
        { time: '02:00 PM', text: 'Access Point firmware reflashed and verified' },
        { time: '03:15 PM', text: 'Resolved by IT Team' }
      ]
    },
    {
      id: 'CMP-1022',
      title: 'Broken Desk Arm in Lecture Hall 102',
      location: 'Room 102 (Main Block)',
      department: 'Carpentry & Infrastructure',
      category: 'Furniture',
      priority: 'low',
      status: 'in_progress',
      reportedBy: 'Faculty Member',
      date: '2026-09-24',
      assignedTo: 'Technician Ramesh',
      description: 'Desk 14-B wooden writing flap is snapped off.',
      timeline: [
        { time: 'Yesterday', text: 'Submitted' },
        { time: 'Today', text: 'Replacement piece prepared' }
      ]
    }
  ],

  lostFound: [
    {
      id: 'LF-8801',
      type: 'lost',
      title: 'Black Leather Fossil Wallet',
      category: 'Personal Belongings',
      location: 'Central Library, 2nd Floor',
      date: '2026-09-24',
      time: '11:30 AM',
      reportedBy: 'Rohan Verma',
      status: 'open',
      description: 'Black bi-fold wallet containing college ID card and bus pass. Has a red stitch on the corner.',
      icon: '👛',
      matchedWithId: 'LF-8802',
      matchScore: 94
    },
    {
      id: 'LF-8802',
      type: 'found',
      title: 'Black Bi-fold Wallet with ID Card',
      category: 'Personal Belongings',
      location: 'Library Help Desk Dropoff',
      date: '2026-09-24',
      time: '12:15 PM',
      reportedBy: 'Librarian Desk',
      status: 'matched',
      description: 'Found on table 18 in reading section. Handed over to security desk.',
      icon: '👛',
      matchedWithId: 'LF-8801',
      matchScore: 94
    },
    {
      id: 'LF-8803',
      type: 'lost',
      title: 'Casio Scientific Calculator fx-991EX',
      category: 'Electronics',
      location: 'Tech Tower Room 301',
      date: '2026-09-25',
      time: '09:00 AM',
      reportedBy: 'Ananya S.',
      status: 'open',
      description: 'Has a small neon green barcode sticker on the protective cover.',
      icon: '🔢',
      matchedWithId: null,
      matchScore: null
    },
    {
      id: 'LF-8804',
      type: 'found',
      title: 'Metallic Blue Water Flask',
      category: 'Drinkware',
      location: 'Sports Ground Pavilion',
      date: '2026-09-25',
      time: '08:30 AM',
      reportedBy: 'Coach Sharma',
      status: 'open',
      description: 'Insulated 750ml blue flask left on bleachers after morning practice.',
      icon: '🍶',
      matchedWithId: null,
      matchScore: null
    }
  ],

  events: [
    {
      id: 'evt_101',
      title: 'IEEE AI & Robotics Workshop',
      organizer: 'IEEE Student Branch',
      date: '30 Sep 2026',
      time: '10:00 AM - 04:00 PM',
      location: 'Seminar Hall, Tech Tower',
      capacity: 120,
      registeredCount: 88,
      isRegistered: true,
      category: 'Technical Workshop',
      bannerIcon: '🤖',
      description: 'Hands-on session on Autonomous Vision Models and ROS 2 implementation. Certificates provided.'
    },
    {
      id: 'evt_102',
      title: 'Smart Campus 36-Hour Hackathon',
      organizer: 'DevClub & Institution Innovation Council',
      date: '05 Oct 2026',
      time: '09:00 AM',
      location: 'Central Auditorium',
      capacity: 250,
      registeredCount: 210,
      isRegistered: false,
      category: 'Hackathon',
      bannerIcon: '💻',
      description: 'Build solutions for sustainability, IoT, and AI-enabled student life. Mentorship from industry experts.'
    },
    {
      id: 'evt_103',
      title: 'Annual Inter-College Cultural Gala',
      organizer: 'Arts & Cultural Committee',
      date: '12 Oct 2026',
      time: '05:30 PM',
      location: 'Open Air Amphitheatre',
      capacity: 600,
      registeredCount: 420,
      isRegistered: false,
      category: 'Cultural',
      bannerIcon: '🎭',
      description: 'Musical bands, dance drama, stand-up comedy, and food stalls.'
    }
  ],

  attendance: {
    overall: 89.7,
    subjects: [
      { name: 'Mathematics for Computing', code: 'MA301', attended: 36, total: 39, percentage: 92.3, status: 'good' },
      { name: 'Operating Systems & Architecture', code: 'CS302', attended: 38, total: 40, percentage: 95.0, status: 'good' },
      { name: 'Data Communications & Networks', code: 'CS304', attended: 30, total: 34, percentage: 88.2, status: 'good' },
      { name: 'Electrical Drives & IoT Actuators', code: 'EE308', attended: 26, total: 31, percentage: 83.8, status: 'warning' },
      { name: 'Software Engineering Laboratory', code: 'CS309', attended: 22, total: 22, percentage: 100.0, status: 'good' }
    ]
  },

  emergencyAlerts: [],

  notifications: [
    {
      id: 'notif_1',
      title: 'Complaint Assigned',
      message: 'Your complaint CMP-1024 has been assigned to Suresh Kumar (Electrical).',
      time: '10:00 AM',
      unread: true,
      type: 'complaint'
    },
    {
      id: 'notif_2',
      title: '✨ AI Match Detected!',
      message: 'Possible match found for your lost Fossil Wallet at Library Help Desk (94% match).',
      time: '12:30 PM',
      unread: true,
      type: 'lost_found'
    },
    {
      id: 'notif_3',
      title: 'Event Reminder',
      message: 'IEEE AI & Robotics Workshop is scheduled in 5 days. Pass generated.',
      time: 'Yesterday',
      unread: false,
      type: 'event'
    }
  ],

  canteenMenu: [
    // --- North Indian Delicacies ---
    {
      id: 'food_n1',
      name: 'Amritsari Chole Bhature Combo',
      region: 'North Indian',
      category: 'North Indian Specials',
      price: 95,
      isVeg: true,
      prepTime: '6-8 mins',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&auto=format&fit=crop&q=80',
      icon: '🫓',
      description: 'Golden puffed bhature served with slow-cooked spiced chickpea curry, pickled onions, green chili, and tangy mint chutney.',
      counter: 'Counter 1 (North Indian Griddle)'
    },
    {
      id: 'food_n2',
      name: 'Paneer Butter Masala Naan Thali',
      region: 'North Indian',
      category: 'Meals & Thali',
      price: 130,
      isVeg: true,
      prepTime: '8-10 mins',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
      icon: '🍛',
      description: 'Rich cottage cheese in creamy tomato makhani gravy, served with 2 butter garlic naans, jeera pulao, dal tadka, and salad.',
      counter: 'Counter 2 (Express Parcel Window)'
    },
    {
      id: 'food_n3',
      name: 'Dal Makhani & Jeera Basmati Bowl',
      region: 'North Indian',
      category: 'Meals & Thali',
      price: 110,
      isVeg: true,
      prepTime: '5-7 mins',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop&q=80',
      icon: '🍲',
      description: 'Slow-simmered black lentils with butter and rich cream, paired with aromatic cumin long-grain basmati rice and roasted papad.',
      counter: 'Counter 2 (Express Parcel Window)'
    },
    {
      id: 'food_n4',
      name: 'Stuffed Aloo Paratha with White Butter',
      region: 'North Indian',
      category: 'Breakfast & Tiffin',
      price: 70,
      isVeg: true,
      prepTime: '5-7 mins',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      icon: '🥞',
      description: '2 crisp whole-wheat tandoori parathas stuffed with spiced potato mash, served with churned white butter, thick curd, and pickle.',
      counter: 'Counter 1 (North Indian Griddle)'
    },
    {
      id: 'food_n5',
      name: 'Old Delhi Butter Chicken Rice Bowl',
      region: 'North Indian',
      category: 'North Indian Specials',
      price: 150,
      isVeg: false,
      prepTime: '8-10 mins',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
      icon: '🍗',
      description: 'Tender tandoori chicken tikka simmered in silky tomato-cashew butter gravy, served with saffron basmati rice and roomali roti.',
      counter: 'Counter 3 (Tandoor & Non-Veg Special)'
    },
    {
      id: 'food_n6',
      name: 'Tandoori Paneer Tikka Kathi Wrap',
      region: 'North Indian',
      category: 'Snacks & Quick Bites',
      price: 85,
      isVeg: true,
      prepTime: '6-8 mins',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format&fit=crop&q=80',
      icon: '🌯',
      description: 'Smoky grilled paneer tikka cubes, crunchy bell peppers, pickled red onions, and fresh mint mayo wrapped in a flaky paratha.',
      counter: 'Counter 3 (Tandoor & Non-Veg Special)'
    },
    {
      id: 'food_n7',
      name: 'Punjabi Samosa Chaat with Sev & Dahi',
      region: 'North Indian',
      category: 'Snacks & Quick Bites',
      price: 50,
      isVeg: true,
      prepTime: '4 mins',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80',
      icon: '🥟',
      description: 'Crushed crisp potato samosas topped with spiced chole, sweet tamarind chutney, mint raita, sev, and fresh coriander.',
      counter: 'Counter 1 (North Indian Griddle)'
    },
    {
      id: 'food_n8',
      name: 'Shahi Gulab Jamun with Rabri (2 Pcs)',
      region: 'North Indian',
      category: 'Desserts',
      price: 60,
      isVeg: true,
      prepTime: '2 mins',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      icon: '🍯',
      description: 'Warm melt-in-mouth milk dumplings soaked in saffron-rose sugar syrup, layered over rich cardamom rabri with pistachio flakes.',
      counter: 'Counter 4 (Beverages & Desserts)'
    },

    // --- South Indian Delicacies ---
    {
      id: 'food_s1',
      name: 'Crispy Ghee Mysore Masala Dosa',
      region: 'South Indian',
      category: 'South Indian Specials',
      price: 75,
      isVeg: true,
      prepTime: '5-7 mins',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80',
      icon: '🥞',
      description: 'Golden fermented rice crepe smeared with fiery red chili garlic chutney, filled with spiced potato masala, paired with 3 chutneys & drumstick sambar.',
      counter: 'Counter 1 (South Tiffin Counter)'
    },
    {
      id: 'food_s2',
      name: 'Ghee Podi Idli & Medu Vada Combo',
      region: 'South Indian',
      category: 'South Indian Specials',
      price: 65,
      isVeg: true,
      prepTime: '3-5 mins',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80',
      icon: '🥯',
      description: '3 fluffy steamed button idlis tossed in gun-powder karam podi & pure desi ghee, served with 1 crunchy medu vada and coconut chutney.',
      counter: 'Counter 1 (South Tiffin Counter)'
    },
    {
      id: 'food_s3',
      name: 'Kerala Malabar Parotta with Veg Kurma',
      region: 'South Indian',
      category: 'South Indian Specials',
      price: 85,
      isVeg: true,
      prepTime: '6-8 mins',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format&fit=crop&q=80',
      icon: '🫓',
      description: '2 multi-layered flaky golden Malabar parottas served with rich coconut-milk spiced vegetable kurma and pickled shallots.',
      counter: 'Counter 2 (Express Parcel Window)'
    },
    {
      id: 'food_s4',
      name: 'Hyderabadi Dum Biryani with Salan',
      region: 'South Indian',
      category: 'Meals & Thali',
      price: 140,
      isVeg: true,
      prepTime: '5 mins',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      icon: '🍲',
      description: 'Slow-cooked aromatic basmati rice layered with saffron, mint, and marinated cottage cheese/farm vegetables, with mirchi ka salan and raita.',
      counter: 'Counter 2 (Express Parcel Window)'
    },
    {
      id: 'food_s5',
      name: 'Chettinad Pepper Chicken Parotta Plate',
      region: 'South Indian',
      category: 'South Indian Specials',
      price: 155,
      isVeg: false,
      prepTime: '8-10 mins',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&auto=format&fit=crop&q=80',
      icon: '🍗',
      description: 'Fiery Chettinad black pepper roasted chicken gravy with curry leaves and fennel, served with 2 flaky layered Kerala parottas.',
      counter: 'Counter 3 (Tandoor & Non-Veg Special)'
    },
    {
      id: 'food_s6',
      name: 'South Indian Curd Rice with Pomegranate',
      region: 'South Indian',
      category: 'South Indian Specials',
      price: 55,
      isVeg: true,
      prepTime: '3 mins',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format&fit=crop&q=80',
      icon: '🍚',
      description: 'Cooling creamy yogurt rice tempered with mustard seeds, curry leaves, ginger, pomegranate pearls, and crunchy salted mor milagai.',
      counter: 'Counter 1 (South Tiffin Counter)'
    },
    {
      id: 'food_s7',
      name: 'Kumbakonam Degree Filter Coffee',
      region: 'South Indian',
      category: 'Beverages',
      price: 30,
      isVeg: true,
      prepTime: '2 mins',
      rating: 5.0,
      image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80',
      icon: '☕',
      description: 'Authentic drip-brewed chicory blend with piping hot frothed whole milk, served in a traditional South Indian brass dabara tumbler.',
      counter: 'Counter 4 (Beverages & Desserts)'
    },

    // --- Beverages & Quick Coolers ---
    {
      id: 'food_b1',
      name: 'Cold Coffee with Vanilla Ice Cream Float',
      region: 'Beverage & Dessert',
      category: 'Beverages',
      price: 55,
      isVeg: true,
      prepTime: '3 mins',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
      icon: '🥤',
      description: 'Velvety blended espresso shake with chocolate drizzle, topped with a generous scoop of vanilla ice cream and cocoa powder.',
      counter: 'Counter 4 (Beverages & Desserts)'
    },
    {
      id: 'food_b2',
      name: 'Alphonso Mango Kesar Lassi',
      region: 'Beverage & Dessert',
      category: 'Beverages',
      price: 50,
      isVeg: true,
      prepTime: '3 mins',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=600&auto=format&fit=crop&q=80',
      icon: '🥭',
      description: 'Chilled thick sweet yogurt whipped with pure Alphonso mango pulp, saffron strands, and roasted crushed almond slivers.',
      counter: 'Counter 4 (Beverages & Desserts)'
    },
    {
      id: 'food_b3',
      name: 'Warm Belgian Chocolate Brownie',
      region: 'Beverage & Dessert',
      category: 'Desserts',
      price: 55,
      isVeg: true,
      prepTime: '2 mins',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=600&auto=format&fit=crop&q=80',
      icon: '🍫',
      description: 'Gooey dark chocolate fudge brownie with melted chocolate ganache center, served piping hot.',
      counter: 'Counter 4 (Beverages & Desserts)'
    }
  ],

  canteenCart: [],

  canteenOrders: [
    {
      id: 'ORD-7812',
      token: '#P-42',
      otp: '6149',
      items: [
        { name: 'Paneer Butter Masala Naan Thali', qty: 1, price: 130 },
        { name: 'Kumbakonam Degree Filter Coffee', qty: 1, price: 30 }
      ],
      totalAmount: 160,
      status: 'ready_for_pickup', // placed | preparing | ready_for_pickup | collected
      pickupCounter: 'Parcel Counter 2 (Express Window)',
      time: '12:45 PM',
      user: 'KASINADH.S',
      paymentMethod: 'Campus SmartCard UPI',
      estimatedReady: 'Ready for Collection Now'
    }
  ],

  // --- Campus Health Center & Medical Facilities ---
  healthData: {
    activeTokenServing: 11,
    doctors: [
      { id: 'doc_1', name: 'Dr. Ananya Sen, MD', specialization: 'General Physician & Chief Medical Officer', room: 'OPD Room 1', status: 'available', timing: '09:00 AM - 05:00 PM', queueLength: 3, avatar: '👩‍⚕️' },
      { id: 'doc_2', name: 'Dr. Vikramaditya Rao, MS', specialization: 'Sports Medicine & Orthopedics', room: 'OPD Room 2', status: 'available', timing: '10:00 AM - 03:00 PM', queueLength: 2, avatar: '👨‍⚕️' },
      { id: 'doc_3', name: 'Dr. Preeti Menon, MD', specialization: 'Student Wellness & Psychological Counselor', room: 'Counseling Suite B', status: 'busy', timing: '11:00 AM - 04:00 PM', queueLength: 1, avatar: '👩‍⚕️' }
    ],
    appointments: [
      { id: 'APT-108', tokenNumber: 11, studentName: 'Rohan Sharma', studentId: 'CS2023-112', doctorId: 'doc_1', doctorName: 'Dr. Ananya Sen', reason: 'High viral fever and chills', status: 'in_consultation', time: '10:15 AM' },
      { id: 'APT-109', tokenNumber: 12, studentName: 'KASINADH.S', studentId: 'CS2023-884', doctorId: 'doc_1', doctorName: 'Dr. Ananya Sen', reason: 'Acute allergic rhinitis & headache', status: 'waiting', time: '10:30 AM' },
      { id: 'APT-110', tokenNumber: 13, studentName: 'Meera Nair', studentId: 'EC2024-204', doctorId: 'doc_1', doctorName: 'Dr. Ananya Sen', reason: 'Ankle sprain in basketball court', status: 'waiting', time: '10:45 AM' },
      { id: 'APT-111', tokenNumber: 14, studentName: 'Arjun Das', studentId: 'ME2023-501', doctorId: 'doc_2', doctorName: 'Dr. Vikramaditya Rao', reason: 'Wrist strain from lab workshop', status: 'waiting', time: '11:00 AM' }
    ],
    medicalLeaves: [
      {
        id: 'MED-LV-401',
        studentId: 'CS2023-884',
        studentName: 'KASINADH.S',
        startDate: '2026-09-22',
        endDate: '2026-09-23',
        days: 2,
        reason: 'Acute Gastroenteritis & Dehydration',
        doctorName: 'Dr. Ananya Sen, MD',
        status: 'approved', // pending | approved | rejected
        attendanceSynced: true,
        affectedCourses: ['CS304', 'EE308'],
        approvedAt: '2026-09-22 11:30 AM',
        certificateQr: 'SMARTCAMPUS-MED-AUTH-98234-VALID'
      }
    ],
    ehrRecords: [
      {
        id: 'EHR-9901',
        studentId: 'CS2023-884',
        bloodGroup: 'B+ve',
        allergies: ['Penicillin', 'Dust / Pollen'],
        chronicConditions: ['Mild Allergic Rhinitis'],
        vitals: { bp: '118/76 mmHg', pulse: '72 bpm', spo2: '99%', temp: '98.4 F' },
        prescriptions: [
          {
            id: 'RX-7721',
            date: '2026-09-22',
            doctor: 'Dr. Ananya Sen, MD',
            diagnosis: 'Acute Gastroenteritis with moderate dehydration',
            medicines: [
              { name: 'Ofloxacin & Ornidazole (O2)', dosage: '1 tab twice daily', duration: '3 days', timing: 'After food', timingSlots: ['Morning', 'Night'] },
              { name: 'ORS Electrolyte Sachet', dosage: '1 sachet in 1L water', duration: '2 days', timing: 'Throughout day', timingSlots: ['All Day'] },
              { name: 'Pantoprazole 40mg', dosage: '1 tab once daily', duration: '5 days', timing: 'Empty stomach', timingSlots: ['Morning'] }
            ],
            notes: 'Advised 2 days complete bed rest with oral rehydration therapy. Sick leave pass issued and synced with academic records.'
          }
        ]
      }
    ],
    pharmacyInventory: [
      { id: 'MED-01', name: 'Paracetamol 650mg (Dolo)', category: 'Analgesic & Antipyretic', stockQty: 240, unit: 'Tablets', status: 'in_stock', minThreshold: 50 },
      { id: 'MED-02', name: 'Cetirizine 10mg', category: 'Antihistamine / Allergy', stockQty: 180, unit: 'Tablets', status: 'in_stock', minThreshold: 40 },
      { id: 'MED-03', name: 'Asthalin Inhaler (Salbutamol 100mcg)', category: 'Respiratory / Asthma', stockQty: 14, unit: 'Canisters', status: 'low_stock', minThreshold: 15 },
      { id: 'MED-04', name: 'ORS WHO Formula Sachet', category: 'Rehydration Salts', stockQty: 320, unit: 'Sachets', status: 'in_stock', minThreshold: 60 },
      { id: 'MED-05', name: 'Amoxicillin 500mg', category: 'Antibiotic (Rx Only)', stockQty: 95, unit: 'Capsules', status: 'in_stock', minThreshold: 30 },
      { id: 'MED-06', name: 'Betadine Antiseptic Ointment 20g', category: 'Topical First Aid', stockQty: 42, unit: 'Tubes', status: 'in_stock', minThreshold: 10 },
      { id: 'MED-07', name: 'Crepe Bandage 10cm', category: 'Orthopedic Support', stockQty: 28, unit: 'Rolls', status: 'in_stock', minThreshold: 10 }
    ],
    ambulanceDispatch: {
      status: 'standby', // standby | dispatched | on_scene
      driverName: 'Ramesh K. (Campus Unit 1)',
      ambulanceNumber: 'KL-07-SC-108',
      driverContact: '+91 94471 22108',
      baseLocation: 'Campus Health Center Bay 1'
    }
  },

  // --- Mobile IoT Smart Switch & Appliance Control ---
  iotData: {
    emergencyOverrideActive: false,
    geofenceStatus: {
      userInAssignedRoom: true,
      currentRoomId: 'rm_204',
      userCoordinates: { lat: 10.0284, lng: 76.3289 },
      roomCoordinates: { lat: 10.0285, lng: 76.3288 },
      distanceMeters: 14
    },
    campusEnergyMetrics: {
      currentPowerKw: 42.8,
      todayConsumptionKwh: 318.4,
      co2SavedKg: 84.6,
      gridStatus: 'Active Solar Hybrid'
    },
    rooms: [
      {
        id: 'rm_204',
        name: 'Lecture Room 204',
        building: 'Main Block',
        type: 'Classroom',
        floor: 2,
        geofenceRadiusMeters: 25,
        accessRoles: ['faculty', 'admin', 'maintenance'],
        devices: [
          { id: 'dev_204_l1', name: 'Front Tube & LED Arrays', type: 'light', state: true, brightness: 100, wattage: 120 },
          { id: 'dev_204_l2', name: 'Rear Ambient Ceiling Lights', type: 'light', state: false, brightness: 0, wattage: 80 },
          { id: 'dev_204_f1', name: 'High-Velocity BLDC Fans (x4)', type: 'fan', state: true, speed: 4, wattage: 140 },
          { id: 'dev_204_ac', name: 'Inverter Dual AC (Cassette 2.0T)', type: 'ac', state: true, temp: 24, mode: 'cool', wattage: 1850 },
          { id: 'dev_204_podium', name: 'Smart Podium & AV Rack', type: 'socket', state: true, wattage: 150 }
        ]
      },
      {
        id: 'rm_301',
        name: 'Smart Seminar Hall 301',
        building: 'Tech Tower',
        type: 'Auditorium',
        floor: 3,
        geofenceRadiusMeters: 40,
        accessRoles: ['faculty', 'admin'],
        devices: [
          { id: 'dev_301_l1', name: 'Stage Spotlights & Wash', type: 'light', state: false, brightness: 0, wattage: 300 },
          { id: 'dev_301_l2', name: 'Auditorium Hall Downlights', type: 'light', state: true, brightness: 80, wattage: 450 },
          { id: 'dev_301_ac', name: 'Central VRF Chiller Unit', type: 'ac', state: false, temp: 22, mode: 'eco', wattage: 3500 },
          { id: 'dev_301_disp', name: 'Laser Projection & Audio Rig', type: 'socket', state: false, wattage: 600 }
        ]
      },
      {
        id: 'lab_eee1',
        name: 'EEE Power Systems Lab 1',
        building: 'Main Block',
        type: 'Laboratory',
        floor: 1,
        geofenceRadiusMeters: 30,
        accessRoles: ['faculty', 'admin', 'maintenance'],
        devices: [
          { id: 'dev_eee_l1', name: 'High-Lux Workbench Lights', type: 'light', state: true, brightness: 100, wattage: 240 },
          { id: 'dev_eee_f1', name: 'Heavy Duty Exhaust & Ceiling Fans', type: 'fan', state: true, speed: 5, wattage: 300 },
          { id: 'dev_eee_pwr', name: '3-Phase Testbench Isolator', type: 'socket', state: false, wattage: 0 }
        ]
      },
      {
        id: 'dorm_d204',
        name: 'Hostel Block B - Dorm Room 204',
        building: 'Hostel Block B',
        type: 'Dormitory',
        floor: 2,
        geofenceRadiusMeters: 15,
        assignedStudentId: 'CS2023-884',
        accessRoles: ['student', 'admin'],
        devices: [
          { id: 'dev_dorm_l1', name: 'Study Desk & Ambient Lamp', type: 'light', state: true, brightness: 75, wattage: 40 },
          { id: 'dev_dorm_f1', name: 'Ceiling Fan Bed 1 & 2', type: 'fan', state: true, speed: 3, wattage: 55 },
          { id: 'dev_dorm_ac', name: 'Window AC Unit', type: 'ac', state: false, temp: 25, mode: 'cool', wattage: 1100 }
        ]
      },
      {
        id: 'infirmary_ward',
        name: 'Campus Infirmary - Recovery Ward A',
        building: 'Health Center',
        type: 'Infirmary',
        floor: 1,
        geofenceRadiusMeters: 20,
        accessRoles: ['student', 'faculty', 'admin', 'maintenance'],
        devices: [
          { id: 'dev_inf_l1', name: 'Hospital Soft Warm Lighting', type: 'light', state: true, brightness: 60, wattage: 60 },
          { id: 'dev_inf_ac', name: 'HEPA Climate Control AC (24°C)', type: 'ac', state: true, temp: 24, mode: 'cool', wattage: 1200 },
          { id: 'dev_inf_f1', name: 'Silent Recovery Fan', type: 'fan', state: true, speed: 2, wattage: 35 }
        ]
      }
    ]
  }
};

class StateManager {
  constructor() {
    this.subscribers = [];
    this.data = this.loadState();
  }

  loadState() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure menu has the full realistic dishes with images and regions
        if (!parsed.canteenMenu || parsed.canteenMenu.length < 10 || !parsed.canteenMenu[0].image) {
          parsed.canteenMenu = DEFAULT_CAMPUS_DATA.canteenMenu;
        }
        if (!parsed.canteenOrders) parsed.canteenOrders = DEFAULT_CAMPUS_DATA.canteenOrders;
        if (!parsed.canteenCart) parsed.canteenCart = [];

        // Ensure Health and IoT modules are populated
        if (!parsed.healthData || !parsed.healthData.doctors) {
          parsed.healthData = DEFAULT_CAMPUS_DATA.healthData;
        }
        if (!parsed.iotData || !parsed.iotData.rooms) {
          parsed.iotData = DEFAULT_CAMPUS_DATA.iotData;
        }

        // Auto-migrate role names to requested campus profiles
        if (parsed.currentUser) {
          if (parsed.currentUser.role === 'student' && (!parsed.currentUser.name || parsed.currentUser.name === 'Aarav Sharma')) {
            parsed.currentUser.name = 'KASINADH.S';
            parsed.currentUser.email = 'kasinadh.s@campus.edu';
          } else if (parsed.currentUser.role === 'faculty' && (!parsed.currentUser.name || parsed.currentUser.name === 'Dr. Rajesh Kumar')) {
            parsed.currentUser.name = 'KS ADHITHIYAN';
          } else if (parsed.currentUser.role === 'admin' && (!parsed.currentUser.name || parsed.currentUser.name.includes('Raman'))) {
            parsed.currentUser.name = 'ALEENA.S';
          } else if (parsed.currentUser.role === 'security' && (!parsed.currentUser.name || parsed.currentUser.name.includes('Deshmukh'))) {
            parsed.currentUser.name = 'SARANYA R.S';
          }
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Could not load stored state, using defaults', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_CAMPUS_DATA));
  }

  saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
    this.notify();
  }

  resetToDefault() {
    this.data = JSON.parse(JSON.stringify(DEFAULT_CAMPUS_DATA));
    this.saveState();
  }

  subscribe(listener) {
    this.subscribers.push(listener);
    return () => {
      this.subscribers = this.subscribers.filter(l => l !== listener);
    };
  }

  notify() {
    this.subscribers.forEach(listener => {
      try {
        listener(this.data);
      } catch (err) {
        console.error('Subscriber error:', err);
      }
    });
  }

  // Role Management
  switchRole(role) {
    this.data.currentUser.role = role;
    if (role === 'student') {
      this.data.currentUser.name = 'KASINADH.S';
      this.data.currentUser.avatar = '👨‍🎓';
      this.data.currentUser.department = 'Computer Science & Engineering';
    } else if (role === 'faculty') {
      this.data.currentUser.name = 'KS ADHITHIYAN';
      this.data.currentUser.avatar = '👨‍🏫';
      this.data.currentUser.department = 'Dept. of Electrical & Electronics';
    } else if (role === 'admin') {
      this.data.currentUser.name = 'ALEENA.S';
      this.data.currentUser.avatar = '🧑‍💼';
      this.data.currentUser.department = 'Office of the Principal';
    } else if (role === 'security') {
      this.data.currentUser.name = 'SARANYA R.S';
      this.data.currentUser.avatar = '🛡️';
      this.data.currentUser.department = 'Campus Central Security';
    } else if (role === 'maintenance') {
      this.data.currentUser.name = 'Lead Tech Suresh Kumar';
      this.data.currentUser.avatar = '🧑‍🔧';
      this.data.currentUser.department = 'Infrastructure & Facilities';
    }
    this.saveState();
  }

  // Complaints
  addComplaint(complaintData) {
    const id = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const newComplaint = {
      id,
      ...complaintData,
      status: 'submitted',
      reportedBy: this.data.currentUser.name,
      date: new Date().toISOString().split('T')[0],
      assignedTo: 'Auto-Routing to ' + (complaintData.department || 'Maintenance'),
      timeline: [
        { time: 'Just now', text: `Reported by ${this.data.currentUser.name}` },
        { time: 'Just now', text: `AI Auto-categorized as ${complaintData.category} (${complaintData.priority} Priority)` }
      ]
    };
    this.data.complaints.unshift(newComplaint);
    
    // Add notification
    this.addNotification({
      title: 'Complaint Registered',
      message: `Ticket #${id} for "${newComplaint.title}" received and assigned.`,
      type: 'complaint'
    });

    this.saveState();
    return newComplaint;
  }

  updateComplaintStatus(id, newStatus, technicianNotes = '') {
    const item = this.data.complaints.find(c => c.id === id);
    if (item) {
      item.status = newStatus;
      item.timeline.push({
        time: 'Just now',
        text: `Status updated to ${newStatus.replace('_', ' ').toUpperCase()}${technicianNotes ? ': ' + technicianNotes : ''}`
      });
      this.addNotification({
        title: `Ticket #${id} Update`,
        message: `Complaint is now marked as ${newStatus.replace('_', ' ').toUpperCase()}.`,
        type: 'complaint'
      });
      this.saveState();
    }
  }

  // Lost & Found
  addLostFoundItem(itemData) {
    const id = `LF-${Math.floor(8000 + Math.random() * 1999)}`;
    const newItem = {
      id,
      ...itemData,
      status: 'open',
      reportedBy: this.data.currentUser.name,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      matchedWithId: null,
      matchScore: null
    };

    // Check for AI Match among existing opposite type items
    const oppositeType = itemData.type === 'lost' ? 'found' : 'lost';
    const candidateMatches = this.data.lostFound.filter(i => i.type === oppositeType);
    
    for (const cand of candidateMatches) {
      // Basic semantic + category + location match simulation
      const sameCategory = cand.category.toLowerCase() === itemData.category.toLowerCase();
      const textOverlap = itemData.title.toLowerCase().split(' ').some(w => cand.title.toLowerCase().includes(w) && w.length > 3);
      if (sameCategory || textOverlap) {
        const score = Math.floor(85 + Math.random() * 12);
        newItem.matchedWithId = cand.id;
        newItem.matchScore = score;
        cand.matchedWithId = newItem.id;
        cand.matchScore = score;
        cand.status = 'matched';
        newItem.status = 'matched';

        this.addNotification({
          title: '✨ AI Match Detected!',
          message: `Match between ${newItem.title} and ${cand.title} (${score}% match confidence).`,
          type: 'lost_found'
        });
        break;
      }
    }

    this.data.lostFound.unshift(newItem);
    this.saveState();
    return newItem;
  }

  // Room Booking
  bookRoom(roomId, bookingDetails) {
    const room = this.data.rooms.find(r => r.id === roomId);
    if (!room) return { success: false, message: 'Room not found' };

    if (room.status === 'occupied') {
      return { success: false, message: 'Room is currently occupied' };
    }

    room.status = 'reserved';
    room.currentBooking = {
      by: this.data.currentUser.name,
      subject: bookingDetails.purpose,
      until: bookingDetails.timeTo
    };
    room.nextAvailable = bookingDetails.timeTo;

    this.addNotification({
      title: 'Room Reservation Confirmed',
      message: `${room.name} reserved for ${bookingDetails.purpose} until ${bookingDetails.timeTo}.`,
      type: 'room'
    });

    this.saveState();
    return { success: true, room };
  }

  // Event Registration
  toggleEventRegistration(eventId) {
    const event = this.data.events.find(e => e.id === eventId);
    if (event) {
      event.isRegistered = !event.isRegistered;
      event.registeredCount += event.isRegistered ? 1 : -1;
      this.addNotification({
        title: event.isRegistered ? 'Registered for Event' : 'Registration Cancelled',
        message: `${event.title} — ${event.isRegistered ? 'Your digital QR pass is ready.' : 'Seat released.'}`,
        type: 'event'
      });
      this.saveState();
    }
  }

  // Emergency SOS Trigger
  triggerSOS(sosData) {
    const alert = {
      id: `SOS-${Date.now().toString().slice(-4)}`,
      category: sosData.category,
      location: sosData.location,
      notes: sosData.notes,
      user: this.data.currentUser.name,
      time: new Date().toLocaleTimeString(),
      status: 'active'
    };
    this.data.emergencyAlerts.unshift(alert);
    this.addNotification({
      title: '🚨 EMERGENCY DISPATCHED',
      message: `Security & First Responders alerted at ${sosData.location}. Help is en route!`,
      type: 'sos'
    });
    this.saveState();
    return alert;
  }

  addNotification(notif) {
    this.data.notifications.unshift({
      id: `notif_${Date.now()}`,
      time: 'Just now',
      unread: true,
      ...notif
    });
    this.data.currentUser.unreadCount = (this.data.currentUser.unreadCount || 0) + 1;
  }

  markNotificationsRead() {
    this.data.notifications.forEach(n => n.unread = false);
    this.data.currentUser.unreadCount = 0;
    this.saveState();
  }

  // --- Cafeteria & Parcel Pickup System ---
  addToCart(foodId) {
    if (!this.data.canteenCart) this.data.canteenCart = [];
    const item = this.data.canteenMenu.find(f => f.id === foodId);
    if (!item) return;

    const existing = this.data.canteenCart.find(c => c.id === foodId);
    if (existing) {
      existing.qty += 1;
    } else {
      this.data.canteenCart.push({ ...item, qty: 1 });
    }
    this.saveState();
  }

  updateCartQty(foodId, delta) {
    if (!this.data.canteenCart) return;
    const item = this.data.canteenCart.find(c => c.id === foodId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      this.data.canteenCart = this.data.canteenCart.filter(c => c.id !== foodId);
    }
    this.saveState();
  }

  clearCart() {
    this.data.canteenCart = [];
    this.saveState();
  }

  placeCanteenOrder(orderDetails) {
    const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const token = `#P-${Math.floor(10 + Math.random() * 89)}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit collection OTP

    const newOrder = {
      id,
      token,
      otp,
      items: [...this.data.canteenCart],
      totalAmount: orderDetails.totalAmount,
      status: 'preparing', // placed | preparing | ready_for_pickup | collected
      pickupCounter: orderDetails.pickupCounter || 'Parcel Counter 2 (Express Window)',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      user: this.data.currentUser.name,
      paymentMethod: orderDetails.paymentMethod || 'Campus SmartCard / UPI',
      estimatedReady: '7-10 mins'
    };

    if (!this.data.canteenOrders) this.data.canteenOrders = [];
    this.data.canteenOrders.unshift(newOrder);
    this.data.canteenCart = [];

    this.addNotification({
      title: '🍱 Cafeteria Parcel Order Confirmed',
      message: `Token ${token} (₹${newOrder.totalAmount}) placed! Your Parcel Collection OTP is ${otp}. Pickup at ${newOrder.pickupCounter}.`,
      type: 'cafeteria'
    });

    this.saveState();
    return newOrder;
  }

  verifyCanteenOTP(orderId, enteredOTP) {
    const order = this.data.canteenOrders.find(o => o.id === orderId);
    if (!order) return { success: false, message: 'Order not found' };

    if (order.otp === enteredOTP.trim()) {
      order.status = 'collected';
      this.addNotification({
        title: '🍱 Parcel Handed Over',
        message: `Order ${order.token} verified via OTP. Enjoy your meal!`,
        type: 'cafeteria'
      });
      this.saveState();
      return { success: true, order };
    }
    return { success: false, message: 'Invalid OTP. Please check the 4-digit code on the customer order pass.' };
  }

  updateCanteenOrderStatus(orderId, newStatus) {
    const order = this.data.canteenOrders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      if (newStatus === 'ready_for_pickup') {
        order.estimatedReady = 'Ready for Pickup Now!';
        this.addNotification({
          title: '🔔 Parcel Ready for Collection!',
          message: `Order ${order.token} is ready at ${order.pickupCounter}. Share OTP ${order.otp} at the counter.`,
          type: 'cafeteria'
        });
      }
      this.saveState();
    }
  }

  // --- Health & Infirmary Methods ---
  bookHealthAppointment(bookingData) {
    if (!this.data.healthData) this.data.healthData = DEFAULT_CAMPUS_DATA.healthData;
    const token = (this.data.healthData.appointments.length > 0)
      ? Math.max(...this.data.healthData.appointments.map(a => a.tokenNumber)) + 1
      : 15;
    const id = `APT-${Math.floor(100 + Math.random() * 900)}`;
    const newApt = {
      id,
      tokenNumber: token,
      studentName: this.data.currentUser.name,
      studentId: this.data.currentUser.studentId || 'CS2023-884',
      doctorId: bookingData.doctorId,
      doctorName: bookingData.doctorName,
      reason: bookingData.reason,
      status: 'waiting',
      time: bookingData.time || '11:15 AM'
    };
    this.data.healthData.appointments.push(newApt);
    this.addNotification({
      title: '🩺 OPD Token Confirmed',
      message: `Token #${token} booked with ${bookingData.doctorName}. Current serving: #${this.data.healthData.activeTokenServing}.`,
      type: 'health'
    });
    this.saveState();
    return newApt;
  }

  advanceHealthQueue() {
    if (!this.data.healthData) return;
    this.data.healthData.activeTokenServing += 1;
    this.data.healthData.appointments.forEach(apt => {
      if (apt.tokenNumber < this.data.healthData.activeTokenServing) {
        apt.status = 'completed';
      } else if (apt.tokenNumber === this.data.healthData.activeTokenServing) {
        apt.status = 'in_consultation';
      }
    });
    this.addNotification({
      title: '📢 OPD Queue Called',
      message: `Now serving Token #${this.data.healthData.activeTokenServing} at Infirmary Consultation Room.`,
      type: 'health'
    });
    this.saveState();
  }

  submitMedicalLeave(leaveData) {
    if (!this.data.healthData) this.data.healthData = DEFAULT_CAMPUS_DATA.healthData;
    const id = `MED-LV-${Math.floor(400 + Math.random() * 599)}`;
    const newLeave = {
      id,
      studentId: this.data.currentUser.studentId || 'CS2023-884',
      studentName: this.data.currentUser.name,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      days: Number(leaveData.days) || 1,
      reason: leaveData.reason,
      doctorName: leaveData.doctorName || 'Dr. Ananya Sen, MD',
      status: 'pending',
      attendanceSynced: false,
      affectedCourses: leaveData.affectedCourses || ['CS302', 'CS304'],
      submittedAt: new Date().toLocaleString(),
      certificateQr: `SMARTCAMPUS-MED-AUTH-${Math.floor(10000 + Math.random() * 90000)}-VALID`
    };
    this.data.healthData.medicalLeaves.unshift(newLeave);
    this.addNotification({
      title: '🏥 Medical Leave Pass Submitted',
      message: `Pass #${id} submitted for infirmary verification and automatic academic attendance excusal.`,
      type: 'health'
    });
    this.saveState();
    return newLeave;
  }

  approveMedicalLeave(leaveId) {
    if (!this.data.healthData) return { success: false, message: 'Health data unavailable' };
    const leave = this.data.healthData.medicalLeaves.find(l => l.id === leaveId);
    if (!leave) return { success: false, message: 'Medical leave record not found' };

    leave.status = 'approved';
    leave.attendanceSynced = true;
    leave.approvedAt = new Date().toLocaleString();

    // Automatically sync and excuse student attendance
    if (this.data.attendance && this.data.attendance.subjects) {
      this.data.attendance.subjects.forEach(sub => {
        // Boost attended or excuse missed sessions
        if (sub.percentage < 96) {
          sub.attended = Math.min(sub.total, sub.attended + 2);
          sub.percentage = Number(((sub.attended / sub.total) * 100).toFixed(1));
          if (sub.percentage >= 85) sub.status = 'good';
          else if (sub.percentage >= 75) sub.status = 'warning';
        }
      });
      const totalAttended = this.data.attendance.subjects.reduce((sum, s) => sum + s.attended, 0);
      const totalLectures = this.data.attendance.subjects.reduce((sum, s) => sum + s.total, 0);
      this.data.attendance.overall = Number(((totalAttended / totalLectures) * 100).toFixed(1));
    }

    this.addNotification({
      title: '📋 Medical Sick Leave Approved & Attendance Excused',
      message: `Leave #${leave.id} signed by ${leave.doctorName}. Classes excused and cumulative attendance protected at ${this.data.attendance.overall}%.`,
      type: 'health'
    });

    this.saveState();
    return { success: true, leave };
  }

  triggerMedicalAmbulanceSOS(payload) {
    if (!this.data.healthData) this.data.healthData = DEFAULT_CAMPUS_DATA.healthData;
    this.data.healthData.ambulanceDispatch.status = 'dispatched';
    this.triggerSOS({
      category: 'Medical Emergency & Campus Ambulance Dispatch',
      location: payload.location || 'Central Academic Quadrangle (GPS: 10.0284 N, 76.3289 E)',
      notes: payload.notes || 'Emergency Code Red: Immediate paramedic assistance requested via Health Module.'
    });
    this.saveState();
  }

  // --- Mobile IoT Smart Switch & Appliance Control Methods ---
  toggleIoTSwitch(roomId, deviceId) {
    if (!this.data.iotData) this.data.iotData = DEFAULT_CAMPUS_DATA.iotData;
    const room = this.data.iotData.rooms.find(r => r.id === roomId);
    if (!room) return { success: false, message: 'Room not found' };
    const dev = room.devices.find(d => d.id === deviceId);
    if (!dev) return { success: false, message: 'Device not found' };

    // RBAC validation
    const userRole = this.data.currentUser.role;
    const canControl = userRole === 'admin' || 
                       room.accessRoles.includes(userRole) || 
                       (userRole === 'student' && (room.type === 'Dormitory' || room.type === 'Infirmary'));
    
    if (!canControl) {
      return { 
        success: false, 
        message: `RBAC Violation: Role '${userRole}' cannot control appliances in ${room.name}. Faculty/Admin access required.` 
      };
    }

    dev.state = !dev.state;
    if (dev.type === 'light') {
      dev.brightness = dev.state ? 100 : 0;
    }

    // Dynamic wattage calculation
    const deltaKw = (dev.wattage / 1000) * (dev.state ? 1 : -1);
    this.data.iotData.campusEnergyMetrics.currentPowerKw = Math.max(5, Number((this.data.iotData.campusEnergyMetrics.currentPowerKw + deltaKw).toFixed(2)));

    this.saveState();
    return { success: true, device: dev, room };
  }

  setIoTDimmer(roomId, deviceId, brightness) {
    if (!this.data.iotData) return;
    const room = this.data.iotData.rooms.find(r => r.id === roomId);
    if (!room) return;
    const dev = room.devices.find(d => d.id === deviceId);
    if (!dev) return;
    dev.brightness = Number(brightness);
    dev.state = dev.brightness > 0;
    this.saveState();
  }

  setIoTSpeed(roomId, deviceId, speed) {
    if (!this.data.iotData) return;
    const room = this.data.iotData.rooms.find(r => r.id === roomId);
    if (!room) return;
    const dev = room.devices.find(d => d.id === deviceId);
    if (!dev) return;
    dev.speed = Number(speed);
    dev.state = dev.speed > 0;
    this.saveState();
  }

  setIoTACTemp(roomId, deviceId, delta) {
    if (!this.data.iotData) return;
    const room = this.data.iotData.rooms.find(r => r.id === roomId);
    if (!room) return;
    const dev = room.devices.find(d => d.id === deviceId);
    if (!dev) return;
    dev.temp = Math.min(28, Math.max(18, (dev.temp || 24) + delta));
    this.saveState();
  }

  triggerEmergencyLightingOverride() {
    if (!this.data.iotData) this.data.iotData = DEFAULT_CAMPUS_DATA.iotData;
    this.data.iotData.emergencyOverrideActive = !this.data.iotData.emergencyOverrideActive;
    const override = this.data.iotData.emergencyOverrideActive;

    this.data.iotData.rooms.forEach(r => {
      r.devices.forEach(d => {
        if (d.type === 'light') {
          d.state = true;
          d.brightness = 100;
        } else if (override && d.type === 'fan' && r.type !== 'Infirmary') {
          // Fire containment protocol: disable non-critical ventilation
          d.state = false;
        }
      });
    });

    this.addNotification({
      title: override ? '🚨 EMERGENCY EVACUATION LIGHTING OVERRIDE' : '✅ Emergency Lighting Override Normal',
      message: override
        ? 'All campus corridor & room lighting forced to 100% illumination via MQTT topic campus/emergency/override.'
        : 'Smart lighting restored to scheduled sensor controls.',
      type: 'sos'
    });

    this.saveState();
    return override;
  }

  simulateGeofenceExit(roomId) {
    if (!this.data.iotData) return;
    const room = this.data.iotData.rooms.find(r => r.id === roomId);
    if (!room) return;

    let turnedOffCount = 0;
    let savedWatts = 0;

    room.devices.forEach(d => {
      if (d.state) {
        d.state = false;
        if (d.brightness) d.brightness = 0;
        turnedOffCount++;
        savedWatts += d.wattage;
      }
    });

    const savedKwh = Number((savedWatts / 1000).toFixed(2));
    this.data.iotData.campusEnergyMetrics.co2SavedKg = Number((this.data.iotData.campusEnergyMetrics.co2SavedKg + (savedKwh * 0.82)).toFixed(2));
    this.data.iotData.geofenceStatus.userInAssignedRoom = false;

    this.addNotification({
      title: '🌱 Timetable & Geofence Sync: Auto-Cutoff',
      message: `Vacated ${room.name}. Turned OFF ${turnedOffCount} idle appliances. Conserved ~${savedWatts}W of power!`,
      type: 'iot'
    });

    this.saveState();
    return { turnedOffCount, savedWatts };
  }
}

// Global Single Instance
window.campusState = new StateManager();

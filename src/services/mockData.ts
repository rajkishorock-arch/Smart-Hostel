import { DayMenu, RoomRecord, Ticket, UserProfile, WeeklyMessMenu } from '../types';

export const INITIAL_MESS_MENU: WeeklyMessMenu = {
  Monday: {
    day: 'Monday',
    breakfast: { items: 'Aloo Paratha, Curd, Pickles, Sprouts & Masala Chai', timing: '07:30 AM - 09:30 AM' },
    lunch: { items: 'Dal Makhani, Seasonal Bhindi, Steamed Rice, Phulka & Fresh Green Salad', timing: '12:30 PM - 02:30 PM' },
    snacks: { items: 'Veg Samosa with Mint Chutney & Tea/Coffee', timing: '05:00 PM - 06:00 PM' },
    dinner: { items: 'Shahi Paneer, Jeera Rice, Tawa Roti, Dal Tadka & Gulab Jamun', timing: '07:30 PM - 09:30 PM' },
    specialNote: 'Special Sweet: Hot Gulab Jamun served during dinner.'
  },
  Tuesday: {
    day: 'Tuesday',
    breakfast: { items: 'Idli, Medu Vada, Coconut Chutney, Sambhar & Filter Coffee', timing: '07:30 AM - 09:30 AM' },
    lunch: { items: 'Rajma Rasila, Boondi Raita, Basmati Rice, Chapati & Mixed Salad', timing: '12:30 PM - 02:30 PM' },
    snacks: { items: 'Poha with Roasted Peanuts, Sev & Ginger Tea', timing: '05:00 PM - 06:00 PM' },
    dinner: { items: 'Mix Veg Korma, Dal Fry, Plain Rice, Rotis & Fruit Custard', timing: '07:30 PM - 09:30 PM' },
    specialNote: 'South Indian morning special.'
  },
  Wednesday: {
    day: 'Wednesday',
    breakfast: { items: 'Masala Dosa, Tomato Chutney, Sambhar & Milk/Tea', timing: '07:30 AM - 09:30 AM' },
    lunch: { items: 'Kadhi Pakoda, Aloo Methi, Jeera Rice, Rotis & Kachumber Salad', timing: '12:30 PM - 02:30 PM' },
    snacks: { items: 'Bread Pakoda with Sweet & Sour Chutney & Coffee', timing: '05:00 PM - 06:00 PM' },
    dinner: { items: 'Paneer Butter Masala / Egg Curry, Matar Pulao, Tawa Butter Roti & Ice Cream', timing: '07:30 PM - 09:30 PM' },
    specialNote: 'Special feast night with choice of dessert.'
  },
  Thursday: {
    day: 'Thursday',
    breakfast: { items: 'Poori Bhaji, Suji Halwa, Boiled Eggs / Bananas & Masala Tea', timing: '07:30 AM - 09:30 AM' },
    lunch: { items: 'Chana Masala, Veg Pulao, Cucumber Raita, Rotis & Roasted Papad', timing: '12:30 PM - 02:30 PM' },
    snacks: { items: 'White Sauce Pasta, Garlic Toast & Tea', timing: '05:00 PM - 06:00 PM' },
    dinner: { items: 'Dum Aloo, Dal Palak, Steamed Rice, Phulkas & Kheer', timing: '07:30 PM - 09:30 PM' },
    specialNote: 'Continental evening snacks.'
  },
  Friday: {
    day: 'Friday',
    breakfast: { items: 'Methi Thepla, Chunda, Curd, Boiled Sprouts & Tea/Coffee', timing: '07:30 AM - 09:30 AM' },
    lunch: { items: 'Chole Bhature, Onion Ring Salad, Mint Chutney & Sweet Lassi', timing: '12:30 PM - 02:30 PM' },
    snacks: { items: 'Sweet Corn Chaat, Lemonade & Tea', timing: '05:00 PM - 06:00 PM' },
    dinner: { items: 'Kadhai Paneer, Dal Makhani, Fried Rice, Rotis & Moong Dal Halwa', timing: '07:30 PM - 09:30 PM' },
    specialNote: 'North Indian special lunch.'
  },
  Saturday: {
    day: 'Saturday',
    breakfast: { items: 'Uttapam, Onion Tomato Chutney, Sambhar & Masala Chai', timing: '07:30 AM - 09:30 AM' },
    lunch: { items: 'Veg Biryani, Mirchi Ka Salan, Raita, Boiled Eggs / Paneer 65', timing: '12:30 PM - 02:30 PM' },
    snacks: { items: 'Biscuits, Bun Maska & Irani Chai', timing: '05:00 PM - 06:00 PM' },
    dinner: { items: 'Malai Kofta, Kashmiri Pulao, Butter Naan, Yellow Dal & Rasgulla', timing: '07:30 PM - 09:30 PM' },
    specialNote: 'Weekend special dinner.'
  },
  Sunday: {
    day: 'Sunday',
    breakfast: { items: 'Pancakes with Honey / Poha, Cornflakes with Warm Milk & Juice', timing: '08:00 AM - 10:00 AM' },
    lunch: { items: 'Special Thali: Paneer Lababdar, Dal Tadka, Jeera Rice, Baby Butter Naan & Rasmalai', timing: '12:30 PM - 02:30 PM' },
    snacks: { items: 'French Fries, Veg Sandwiches & Cold Coffee', timing: '05:00 PM - 06:30 PM' },
    dinner: { items: 'Light Khichdi, Gujarati Kadhi, Aloo Chokha, Papad & Roasted Peanuts', timing: '07:30 PM - 09:30 PM' },
    specialNote: 'Light soothing Sunday night meal for healthy digestion.'
  }
};

export const INITIAL_ROOMS: RoomRecord[] = [
  {
    id: 'room-a-101',
    hostel: 'Aravali Boys Hostel',
    block: 'Block A',
    roomNumber: '101',
    floor: 1,
    capacity: 2,
    occupied: 2,
    beds: [
      { bedNumber: 'Bed 1', residentId: 'res-1', residentName: 'Aarav Sharma', studentId: '2023CS101' },
      { bedNumber: 'Bed 2', residentId: 'res-2', residentName: 'Rohan Verma', studentId: '2023CS102' }
    ]
  },
  {
    id: 'room-a-204',
    hostel: 'Aravali Boys Hostel',
    block: 'Block A',
    roomNumber: '204',
    floor: 2,
    capacity: 2,
    occupied: 2,
    beds: [
      { bedNumber: 'Bed 1', residentId: 'res-demo', residentName: 'Demo Resident', studentId: '2024CS204' },
      { bedNumber: 'Bed 2', residentId: 'res-3', residentName: 'Kabir Mehta', studentId: '2024EC205' }
    ]
  },
  {
    id: 'room-a-305',
    hostel: 'Aravali Boys Hostel',
    block: 'Block A',
    roomNumber: '305',
    floor: 3,
    capacity: 3,
    occupied: 2,
    beds: [
      { bedNumber: 'Bed 1', residentId: 'res-4', residentName: 'Dev Patel', studentId: '2023ME301' },
      { bedNumber: 'Bed 2', residentId: 'res-5', residentName: 'Vikram Singh', studentId: '2023CE302' },
      { bedNumber: 'Bed 3' }
    ]
  },
  {
    id: 'room-b-102',
    hostel: 'Aravali Boys Hostel',
    block: 'Block B',
    roomNumber: '102',
    floor: 1,
    capacity: 2,
    occupied: 1,
    beds: [
      { bedNumber: 'Bed 1', residentId: 'res-6', residentName: 'Nikhil Roy', studentId: '2024IT112' },
      { bedNumber: 'Bed 2' }
    ]
  },
  {
    id: 'room-b-201',
    hostel: 'Aravali Boys Hostel',
    block: 'Block B',
    roomNumber: '201',
    floor: 2,
    capacity: 2,
    occupied: 0,
    beds: [
      { bedNumber: 'Bed 1' },
      { bedNumber: 'Bed 2' }
    ]
  },
  {
    id: 'room-c-302',
    hostel: 'Aravali Boys Hostel',
    block: 'Block C',
    roomNumber: '302',
    floor: 3,
    capacity: 3,
    occupied: 3,
    beds: [
      { bedNumber: 'Bed 1', residentId: 'res-7', residentName: 'Aditya Nair', studentId: '2022EE201' },
      { bedNumber: 'Bed 2', residentId: 'res-8', residentName: 'Pranav Gupta', studentId: '2022EE202' },
      { bedNumber: 'Bed 3', residentId: 'res-9', residentName: 'Siddharth Rao', studentId: '2022EE203' }
    ]
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'tkt-101',
    residentId: 'res-demo',
    residentName: 'Demo Resident',
    room: '204',
    block: 'Block A',
    category: 'Electrical',
    description: 'Ceiling fan is making loud clicking sounds and speed regulator is overheating.',
    priority: 'High',
    status: 'In Progress',
    aiClassified: true,
    aiConfidence: 94,
    aiSuggestedCategory: 'Electrical',
    aiSuggestedPriority: 'High',
    wardenNotes: 'Electrician Mr. Vinod has been dispatched. Capacitor replacement scheduled for 3 PM.',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: 'tkt-102',
    residentId: 'res-1',
    residentName: 'Aarav Sharma',
    room: '101',
    block: 'Block A',
    category: 'Plumbing',
    description: 'Bathroom washbasin drain is clogged and water is draining very slowly.',
    priority: 'Medium',
    status: 'Open',
    aiClassified: true,
    aiConfidence: 91,
    aiSuggestedCategory: 'Plumbing',
    aiSuggestedPriority: 'Medium',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
  },
  {
    id: 'tkt-103',
    residentId: 'res-4',
    residentName: 'Dev Patel',
    room: '305',
    block: 'Block A',
    category: 'Carpentry',
    description: 'Main study table drawer lock is stuck and cannot be opened.',
    priority: 'Low',
    status: 'Resolved',
    aiClassified: true,
    aiConfidence: 89,
    aiSuggestedCategory: 'Carpentry',
    aiSuggestedPriority: 'Low',
    wardenNotes: 'Lock mechanism lubricated and repaired by campus carpenter.',
    resolvedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString()
  },
  {
    id: 'tkt-104',
    residentId: 'res-7',
    residentName: 'Aditya Nair',
    room: '302',
    block: 'Block C',
    category: 'Electrical',
    description: 'Power socket near bed 3 sparked with a slight burning smell when plugging laptop.',
    priority: 'Urgent',
    status: 'Open',
    aiClassified: true,
    aiConfidence: 98,
    aiSuggestedCategory: 'Electrical',
    aiSuggestedPriority: 'Urgent',
    createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1.5).toISOString()
  }
];

export const DEMO_USERS: Record<string, UserProfile> = {
  'res-demo': {
    uid: 'res-demo',
    email: 'resident@hostel.edu',
    name: 'Aayush Malhotra',
    role: 'resident',
    phone: '+91 98765 43210',
    hostel: 'Aravali Boys Hostel',
    block: 'Block A',
    roomNumber: '204',
    bedNumber: 'Bed 1',
    createdAt: new Date().toISOString()
  },
  'warden-demo': {
    uid: 'warden-demo',
    email: 'warden@hostel.edu',
    name: 'Dr. Rajeshwar K. Sundaram',
    role: 'warden',
    phone: '+91 98112 34567',
    hostel: 'Aravali Boys Hostel',
    block: 'Administration Office',
    roomNumber: 'Admin-01',
    bedNumber: 'N/A',
    createdAt: new Date().toISOString()
  }
};

/* ==========================================================================
   SmartCampus AI Campus Copilot (Gemini-Inspired Assistant)
   ========================================================================== */

class AICopilot {
  constructor() {
    this.messages = [
      {
        sender: 'ai',
        text: '👋 Hello! I am your **SmartCampus AI Copilot**. How can I help you today? You can ask me to find available labs, report maintenance issues, look for lost items, or navigate the campus.'
      }
    ];
  }

  processQuery(query) {
    const q = query.toLowerCase().trim();
    const data = window.campusState.data;

    // 1. Available Rooms or Labs Query
    if (q.includes('lab') || q.includes('room') || q.includes('available') || q.includes('free space')) {
      const availableRooms = data.rooms.filter(r => r.status === 'available');
      if (availableRooms.length > 0) {
        let response = `🟢 I found **${availableRooms.length} available facilities** right now:\n\n`;
        availableRooms.forEach(r => {
          response += `• **${r.name}** (${r.type}) — ${r.building}, Floor ${r.floor} (Capacity: ${r.capacity})\n`;
        });
        response += `\nWould you like me to book one for you?`;
        return {
          text: response,
          action: { label: '📅 View Rooms & Book', view: 'rooms' }
        };
      } else {
        return {
          text: 'Currently all designated laboratories and lecture halls are booked or occupied. The next open slot begins around 03:30 PM.',
          action: { label: 'Check Schedules', view: 'rooms' }
        };
      }
    }

    // 2. Lost & Found Query
    if (q.includes('lost') || q.includes('found') || q.includes('wallet') || q.includes('id card') || q.includes('keys')) {
      const match = data.lostFound.find(i => q.includes(i.title.toLowerCase()) || q.includes(i.category.toLowerCase()));
      if (match) {
        return {
          text: `🔍 I searched campus records and found a related report: **"${match.title}"** recorded at *${match.location}* (Status: ${match.status.toUpperCase()}).\n\nPlease check the Lost & Found Hub to submit a claim or verify item details.`,
          action: { label: '🔎 Open Lost & Found', view: 'lost-found' }
        };
      }
      return {
        text: `Don't worry! You can instantly log a lost item with a reference description or photo. The campus security and help desks will be notified, and our AI matcher will track found items across buildings.`,
        action: { label: '➕ Report Lost Item', view: 'lost-found' }
      };
    }

    // 3. Complaint or Maintenance Query
    if (q.includes('complaint') || q.includes('broken') || q.includes('projector') || q.includes('fan') || q.includes('leak') || q.includes('ac') || q.includes('wifi') || q.includes('repair')) {
      // Auto extraction preview
      let cat = 'Equipment';
      let dept = 'Maintenance';
      let prio = 'Medium';
      if (q.includes('wifi') || q.includes('internet')) { cat = 'Network'; dept = 'IT Operations'; }
      if (q.includes('water') || q.includes('leak') || q.includes('plumb')) { cat = 'Plumbing'; dept = 'Sanitation'; prio = 'High'; }
      if (q.includes('projector') || q.includes('screen')) { cat = 'Audiovisual'; prio = 'High'; }

      return {
        text: `⚙️ I can log a ticket for this issue.\n\n**AI Pre-Classification:**\n• **Category:** ${cat}\n• **Routing Department:** ${dept}\n• **Estimated Priority:** ${prio}\n\nClick below to confirm and submit this complaint to campus technicians.`,
        action: { label: '📝 Open Complaint Form', view: 'complaints' }
      };
    }

    // 4. Navigation or Location Query
    if (q.includes('where is') || q.includes('location') || q.includes('map') || q.includes('library') || q.includes('canteen') || q.includes('seminar hall') || q.includes('auditorium')) {
      let destination = 'Main Block';
      if (q.includes('library')) destination = 'Central Library (East Wing, 3 Floors)';
      else if (q.includes('canteen') || q.includes('food') || q.includes('cafeteria')) destination = 'Student Cafeteria (Behind Tech Tower)';
      else if (q.includes('eee')) destination = 'Main Block, 1st Floor (EEE Power Systems Lab 1)';
      else if (q.includes('seminar') || q.includes('auditorium')) destination = 'Tech Tower, 3rd Floor (Smart Seminar Hall)';

      return {
        text: `🗺️ **Location Found:** ${destination}.\n\nYou can view the interactive campus floor map and real-time walking pathways.`,
        action: { label: '🗺️ Open Campus Map', view: 'map' }
      };
    }

    // 5. Events Query
    if (q.includes('event') || q.includes('hackathon') || q.includes('workshop') || q.includes('fest')) {
      const nextEvt = data.events[0];
      return {
        text: `📅 The next big campus event is **${nextEvt.title}** organized by *${nextEvt.organizer}* on **${nextEvt.date}** at ${nextEvt.location}.\n\nCapacity: ${nextEvt.registeredCount}/${nextEvt.capacity} seats taken.`,
        action: { label: '🎟️ View Events & Register', view: 'events' }
      };
    }

    // 6. Attendance Query
    if (q.includes('attendance') || q.includes('bunk') || q.includes('classes') || q.includes('marks')) {
      const att = data.attendance;
      return {
        text: `📊 Your current aggregate attendance is **${att.overall}%**.\n\n• Highest: **Software Eng Lab (100%)**\n• Needs Attention: **Electrical Drives (83.8%)**\n\nEnsure all subjects remain above the 75% institutional threshold!`,
        action: { label: '📊 View Full Attendance', view: 'attendance' }
      };
    }

    // 7. Emergency Query
    if (q.includes('emergency') || q.includes('sos') || q.includes('fire') || q.includes('ambulance') || q.includes('police')) {
      return {
        text: `🚨 **EMERGENCY ASSISTANCE:** If you or someone else is in immediate danger, please hit the red SOS button immediately. Security guards and medical responders will be dispatched with your location coordinates.`,
        action: { label: '🚨 TRIGGER SOS NOW', isSOS: true }
      };
    }

    // 8. Cafeteria, Food, Parcel & OTP Query
    if (q.includes('food') || q.includes('canteen') || q.includes('cafeteria') || q.includes('lunch') || q.includes('dinner') || q.includes('breakfast') || q.includes('coffee') || q.includes('snack') || q.includes('parcel') || q.includes('otp')) {
      const activeOrder = (data.canteenOrders || []).find(o => o.status !== 'collected');
      if (activeOrder) {
        return {
          text: `🍱 **Active Parcel Order Found!**\n\n• **Token:** ${activeOrder.token}\n• **Pickup Counter:** ${activeOrder.pickupCounter}\n• **Collection OTP:** **${activeOrder.otp}**\n• **Status:** ${activeOrder.status.replace(/_/g, ' ').toUpperCase()}\n\nPlease head to the counter and share your 4-digit OTP to collect your parcel.`,
          action: { label: '📱 View Parcel Pass & OTP', view: 'cafeteria' }
        };
      }
      return {
        text: `🍽️ **Smart Cafeteria Express Service:**\nYou can order fresh meals, wraps, thalis, and cold coffee directly online! Pay via Campus Card or UPI, and collect at **Counter 2** using your secure 4-digit OTP.`,
        action: { label: '🍱 Open Cafeteria Menu', view: 'cafeteria' }
      };
    }

    // 9. Campus Health, Doctor Appointment & Sick Leave Query
    if (q.includes('doctor') || q.includes('health') || q.includes('fever') || q.includes('sick') || q.includes('infirmary') || q.includes('opd') || q.includes('prescription') || q.includes('medicine')) {
      const activeServing = data.healthData?.activeTokenServing || 11;
      return {
        text: `🏥 **Campus Health Center & Infirmary:**\n\n• **OPD Status:** Live (Now Serving **#MED-${activeServing}**)\n• **Chief Medical Officer:** Dr. Ananya Sen, MD (Room 1)\n• **Sick Leave Integration:** Doctor-approved leaves automatically excuse class absences and protect your 75% attendance cutoff!\n\nWould you like to book an appointment or view dispensary medicine stock?`,
        action: { label: '🩺 Open Health Center', view: 'health' }
      };
    }

    // 10. IoT Smart Switch & Appliance Control Query
    if (q.includes('iot') || q.includes('switch') || q.includes('light') || q.includes('energy') || q.includes('fan') || q.includes('turn off') || q.includes('turn on') || q.includes('dimmer')) {
      const metrics = data.iotData?.campusEnergyMetrics || { currentPowerKw: 42.8, co2SavedKg: 84.6 };
      return {
        text: `⚡ **Mobile IoT Smart Switch & Appliance Control:**\n\n• **Connected Rooms:** Classrooms, Labs, Dorms, and Infirmary\n• **Current Power Load:** **${metrics.currentPowerKw} kW**\n• **CO₂ Mitigated:** **🌱 ${metrics.co2SavedKg} kg**\n• **Geofencing & Timetable Sync:** Idle appliances turn OFF automatically when rooms are vacated!\n\nControl room lighting, fan speeds, and HVAC temperatures with role-based permissions:`,
        action: { label: '⚡ Open IoT Switch Control', view: 'iot-control' }
      };
    }

    // Default Fallback
    return {
      text: `🤖 I understand you're asking about: *"_ ${query} _"*. \n\nAs the SmartCampus Copilot, I can assist with:\n• Finding & booking classrooms or labs\n• Campus Health Center, OPD tokens & sick leave attendance excusal\n• Mobile IoT Smart Switch & energy control\n• Ordering food & OTP parcel collection\n• Tracking complaints and repairs\n• Matching Lost & Found belongings\n• Campus event passes & attendance\n• Interactive navigation & Emergency SOS`,
      action: { label: 'Explore Services', view: 'dashboard' }
    };
  }

  // AI Helper: Auto-Categorize user complaint text
  autoClassifyComplaint(text) {
    const t = text.toLowerCase();
    let category = 'General Infrastructure';
    let department = 'Maintenance';
    let priority = 'medium';

    if (t.includes('projector') || t.includes('speaker') || t.includes('mic') || t.includes('screen') || t.includes('audio')) {
      category = 'Audiovisual Equipment';
      department = 'Technical Infrastructure';
      priority = 'high';
    } else if (t.includes('fan') || t.includes('light') || t.includes('switch') || t.includes('power') || t.includes('spark') || t.includes('plug')) {
      category = 'Electrical';
      department = 'Electrical Maintenance';
      priority = t.includes('spark') ? 'urgent' : 'high';
    } else if (t.includes('water') || t.includes('leak') || t.includes('tap') || t.includes('washroom') || t.includes('pipe') || t.includes('drain')) {
      category = 'Plumbing & Sanitation';
      department = 'Plumbing & Facilities';
      priority = 'high';
    } else if (t.includes('wifi') || t.includes('internet') || t.includes('router') || t.includes('lan') || t.includes('cable') || t.includes('network')) {
      category = 'IT & Networking';
      department = 'Network Operations Center';
      priority = 'medium';
    } else if (t.includes('bench') || t.includes('desk') || t.includes('chair') || t.includes('door') || t.includes('window') || t.includes('lock')) {
      category = 'Furniture & Carpentry';
      department = 'Estate Office';
      priority = 'low';
    }

    return { category, department, priority };
  }
}

window.campusAI = new AICopilot();

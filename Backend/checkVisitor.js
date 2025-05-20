import { Visitor, Booking, HotelRoom } from './models/index.js';
import { Sequelize } from 'sequelize';

async function testVisitorFlow() {
  try {
    // 1. Check visitor registration
    console.log('\n1. Testing Visitor Registration...');
    const visitorData = {
      name: "MOHAMMAD RAFEE RAFEE",
      email: "mrafee1910sdd@gmail.com",
      password: "test123",
      phone: "8095210078"
    };

    // Check if visitor exists
    let visitor = await Visitor.findOne({
      where: { email: visitorData.email }
    });

    if (!visitor) {
      console.log('Creating new visitor...');
      visitor = await Visitor.create({
        visitor_id: `VIS-${Math.random().toString(36).substring(2, 10)}`,
        ...visitorData,
        status: 'active',
        last_login: new Date()
      });
      console.log('Visitor created:', {
        visitor_id: visitor.visitor_id,
        name: visitor.name,
        email: visitor.email
      });
    } else {
      console.log('Visitor already exists:', {
        visitor_id: visitor.visitor_id,
        name: visitor.name,
        email: visitor.email
      });
    }

    // 2. Check available rooms
    console.log('\n2. Checking Available Rooms...');
    const rooms = await HotelRoom.findAll({
      where: { status: 'available' }
    });
    console.log(`Found ${rooms.length} available rooms`);
    rooms.forEach(room => {
      console.log({
        room_id: room.room_id,
        room_type: room.room_type,
        price: room.price_per_night
      });
    });

    // 3. Check visitor's existing bookings
    console.log('\n3. Checking Visitor\'s Bookings...');
    const bookings = await Booking.findAll({
      where: { visitor_id: visitor.visitor_id },
      include: [{
        model: HotelRoom,
        as: 'room'
      }]
    });
    console.log(`Found ${bookings.length} bookings for visitor ${visitor.visitor_id}`);
    bookings.forEach(booking => {
      console.log({
        booking_id: booking.booking_id,
        room_id: booking.room_id,
        check_in: booking.check_in_date,
        check_out: booking.check_out_date,
        status: booking.status,
        payment_status: booking.payment_status
      });
    });

    // 4. Test booking creation
    if (rooms.length > 0) {
      console.log('\n4. Testing Booking Creation...');
      const room = rooms[0];
      const checkIn = new Date();
      const checkOut = new Date();
      checkOut.setDate(checkOut.getDate() + 1);

      const bookingData = {
        visitor_id: visitor.visitor_id,
        room_id: room.room_id,
        check_in_date: checkIn,
        check_out_date: checkOut,
        number_of_guests: 2,
        guest_info: {
          full_name: visitor.name,
          email: visitor.email,
          phone: visitor.phone
        },
        payment_method: 'checkin',
        payment_status: 'pending_checkin',
        total_amount: room.price_per_night
      };

      console.log('Attempting to create booking with data:', bookingData);
      
      const booking = await Booking.create(bookingData);
      console.log('Booking created successfully:', {
        booking_id: booking.booking_id,
        visitor_id: booking.visitor_id,
        room_id: booking.room_id,
        status: booking.status
      });
    }

  } catch (error) {
    console.error('Error in test flow:', error);
  } finally {
    process.exit();
  }
}

testVisitorFlow(); 
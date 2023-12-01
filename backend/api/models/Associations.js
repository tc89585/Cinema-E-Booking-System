const User = require('./UserModel'); // Update paths as necessary
const Booking = require('./BookingModel');
const Movie = require('./MovieModel');
const Showroom = require('./ShowroomModel');
const Seat = require('./SeatModel');
const Showtime = require('./ShowtimeModel');
const Ticket = require('./TicketModel');
const Promotion = require('./PromotionModel');

// One User to Many Bookings
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

// One User to Many PaymentInformation (Assuming PaymentInformation model exists)
 User.hasMany(PaymentInformation, { foreignKey: 'user_id' });
 PaymentInformation.belongsTo(User, { foreignKey: 'user_id' });

// One Showroom to Many Seats
Showroom.hasMany(Seat, { foreignKey: 'showroom_id' });
Seat.belongsTo(Showroom, { foreignKey: 'showroom_id' });

// One Movie to Many Showtimes
Movie.hasMany(Showtime, { foreignKey: 'movie_id' });
Showtime.belongsTo(Movie, { foreignKey: 'movie_id' });

// One Showroom to Many Showtimes
Showroom.hasMany(Showtime, { foreignKey: 'showroom_id' });
Showtime.belongsTo(Showroom, { foreignKey: 'showroom_id' });

// One Showtime to Many Bookings
Showtime.hasMany(Booking, { foreignKey: 'showtime_id' });
Booking.belongsTo(Showtime, { foreignKey: 'showtime_id' });

// One Booking to Many Tickets
Booking.hasMany(Ticket, { foreignKey: 'booking_id' });
Ticket.belongsTo(Booking, { foreignKey: 'booking_id' });

// Many-to-Many: Users and Promotions (through UserPromotions)
// Assuming UserPromotions is a join table for the many-to-many relationship
User.belongsToMany(Promotion, { through: UserPromotions });
Promotion.belongsToMany(User, { through: UserPromotions });

// Many-to-Many: Promotions and Movies (if you have a join table for this)
Movie.belongsToMany(Promotion, { through: MoviePromotions });
Promotion.belongsToMany(Movie, { through: MoviePromotions });

module.exports = {
  User,
  Booking,
  Movie,
  Showroom,
  Seat,
  Showtime,
  Ticket,
  Promotion,
  // Include other models here if needed
};

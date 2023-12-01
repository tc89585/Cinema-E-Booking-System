const Seat = require('../models/SeatModel');
const Showing = require('../models/ShowingModel'); // Assuming you have a Showing model

class ShowingController {
  
  // Function to get available seats for a specific showing
  static async getAvailableSeats(req, res) {
    const { showingId } = req.params;
    try {
      const availableSeats = await Seat.findAll({
        where: { showing_id: showingId, is_booked: false },
        attributes: ['seat_number']
      });
      res.status(200).json(availableSeats.map(seat => seat.seat_number));
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }
}

module.exports = ShowingController;

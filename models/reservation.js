/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");


/** A reservation for a party */

class Reservation {
  constructor({id, customerId, numGuests, startAt, notes}) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  /** formatter for startAt */

  getFormattedStartAt() {
    // Check if this.startAt is a valid date
    if (!moment(this.startAt).isValid()) {
    // Handle invalid date (e.g., return a default value or throw an error)
      throw new Error("Invalid date");
    }
    return moment(this.startAt).format(("YYYY-MM-DD HH:mm:ss"));
  }

  async save() {
    const result = await db.query(
      `INSERT INTO reservations (customer_id, num_guests, start_at, notes)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [this.customerId, this.numGuests, this.getFormattedStartAt(), this.notes]
    );
    this.id = result.rows[0].id;
  }


  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
      `SELECT id, 
           customer_id AS "customerId", 
           num_guests AS "numGuests", 
           start_at AS "startAt", 
           notes AS "notes"
         FROM reservations 
         WHERE customer_id = $1`,
        [customerId]
    );

    return results.rows.map(row => new Reservation(row));
  }
}


module.exports = Reservation;

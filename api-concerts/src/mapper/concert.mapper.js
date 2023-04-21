const concertMapper = (concert) => ({
  id: concert._id,
  name: concert.name,
  date: concert.date,
  address: concert.address,
  seats: concert.seats,
  updated_at: concert.updatedAt,
  created_at: concert.createdAt,
});

export default concertMapper;
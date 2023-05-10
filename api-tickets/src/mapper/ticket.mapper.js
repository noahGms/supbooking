const ticketMapper = (ticket) => {
  return {
    id: ticket._id,
    concert: ticket.concert,
    user: ticket.user,
    status: ticket.status,
    updatedAt: ticket.updatedAt,
    createdAt: ticket.createdAt,
  };
}

export default ticketMapper;
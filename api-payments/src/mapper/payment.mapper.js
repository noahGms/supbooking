const paymentMapper = (payment) => {
  return {
    id: payment._id,
    ticket: payment.ticket,
    user: payment.user,
    confirmedAt: payment.confirmedAt,
    cancelledAt: payment.cancelledAt,
    updatedAt: payment.updatedAt,
    createdAt: payment.createdAt,
  };
}

export default paymentMapper;
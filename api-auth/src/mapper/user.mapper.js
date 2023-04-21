const userMapper = (user) => ({
  id: user._id,
  firstname: user.firstname,
  lastname: user.lastname,
  email: user.email,
  phone_number: user.phone_number,
  address: user.address,
  is_admin: user.is_admin,
  created_at: user.createdAt,
  updated_at: user.updatedAt,
});

export default userMapper;
import User from "../models/user.model.js";

export async function getAllUsers(request, reply) {
  try {
    const users = await User.find();
    return reply.code(200).send(users);
  } catch (error) {
    return reply.code(500).send(error);
  }
}
export async function getUserById(request, reply) {
  try {
    const user = await User.findById(request.params.id);
    console.log(user)
    return reply.code(200).send({user: user});
  } catch (error) {
    return reply.code(500).send(error);
  }
}
export async function createUser(request, reply) {
  try {
    const user = new User(request.body);
    const result = await user.save();
    return reply.code(200).send(result);
  } catch (error) {
    return reply.code(500).send(error);
  }
}
export async function updateUser(request, reply) {
  try {
    const user = await User.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
    });
    return reply.send(user);
  } catch (error) {
    return reply.code(500).send(error);
  }
}
export async function deleteUser(request, reply) {
  try {
    await User.findByIdAndDelete(request.params.id);
    return reply.code(204).send("");
  } catch (error) {
    return reply.code(500).send(error);
  }
}
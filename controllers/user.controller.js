import User from "../models/user.model.js";

export async function getAllUsers(request, reply) {
  try {
    const users = await User.find();
    reply.code(200).send(users);
  } catch (error) {
    reply.code(500).send(error);
  }
}
export async function getUserById(request, reply) {
  try {
    const user = await User.findById(request.params.id);
    console.log(user)
    reply.code(200).send({user: user});
  } catch (error) {
    reply.code(500).send(error);
  }
}
export async function createUser(request, reply) {
  try {
    const user = new User(request.body);
    const result = await user.save();
    reply.code(200).send(result);
  } catch (error) {
    reply.code(500).send(error);
  }
}
export async function updateUser(request, reply) {
  try {
    const user = await User.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
    });
    reply.send(user);
  } catch (error) {
    reply.code(500).send(error);
  }
}
export async function deleteUser(request, reply) {
  try {
    await User.findByIdAndDelete(request.params.id);
    reply.code(204).send("");
  } catch (error) {
    reply.code(500).send(error);
  }
}
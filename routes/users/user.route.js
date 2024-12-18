import * as userController from "../../controllers/user.controller.js";
import User from "../../models/user.model.js";

export default async function (fastify, opts) {
    fastify.get("/", { onRequest: [fastify.jwtAuth] }, userController.getAllUsers);
    fastify.get("/:id", userController.getUserById);
    fastify.post("/", userController.createUser);
    fastify.put("/:id", userController.updateUser);
    fastify.delete("/:id", userController.deleteUser);
    fastify.post("/login", async (request, reply) => {
        const { email, password } = request.body;
        try {
          const user = await User.findOne({ email }).select(["password", "role", "firstName", "lastName"])
    
          if (!user) {
            return reply.status(401).send({ error: "User not found." });
          }
    
          const isMatch = await user.comparePassword(password);
    
          if (!isMatch) {
            return reply.status(401).send({ error: "Incorrect password." });
          }
    
          const token = fastify.jwt.sign({
            payload: {
              email, firstName: user.firstName, lastName: user.lastName, role: user.role
            }
          })
          return reply.status(200).send({ token: token })
        } catch (error) {
          console.log(error)
          return reply.status(500).send({ error: "An error occurred during authorization." })
        }
    
      })
}
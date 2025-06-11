import express from "express";
import { createUser, getUserByUsernameAndPassword } from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireBody from "#middleware/requireBody";

const router = express.Router();
export default router;

router.post(
  "/register",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await createUser(username, password);
      const token = createToken({ id: user.id });
      res.status(201).send(token);
    } catch (err) {
      next(err);
    }
  }
);

router.post(
  "/login",
  requireBody(["username", "password"]),
  async (req, res, next) => {
    try {
      const { username, password } = req.body;
      const user = await getUserByUsernameAndPassword(username, password);
      if (!user) return res.status(401).send("Invalid username or password.");
      const token = createToken({ id: user.id });
      res.send(token);
    } catch (err) {
      next(err);
    }
  }
);

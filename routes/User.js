import { Router } from "express";
import {
  Signin,
  Signup,
  changePassword,
  editUser,
  genereteOTP,
  getAllUsers,
  getUser,
  resetPassword,
  update,
  verifyOTP,
} from "../controllers/User.js";
import { mail } from "../controllers/Mail.js";
import { auth, localVariable } from "../middleware/auth.js";

const router = Router();

router.post("/signup", Signup);
router.post("/signin", Signin);
router.post("/mail", mail);
router.post("/generate", localVariable, genereteOTP);
router.post("/verify", verifyOTP);

router.put("/update", auth, update);
router.put("/change", changePassword);
router.put("/reset", resetPassword);
router.put("/edit", auth, editUser);

router.get("/get/:email", getUser);

router.get("/allusers", getAllUsers);

export default router;

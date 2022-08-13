import { Router } from "express";
import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
  likePost,
  getPostsBySearch,
  getPost
} from "../controllers/getPost.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/search", getPostsBySearch);

router.get("/", getPosts);

router.get("/:id", getPost);

router.post("/", auth, createPost);

router.patch("/:id", auth, updatePost);

router.delete("/:id", auth, deletePost);

router.patch("/:id/likepost", auth, likePost);

export default router;

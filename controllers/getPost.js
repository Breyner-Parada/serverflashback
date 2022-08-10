import mongoose from "mongoose";
import { Collection } from "../models/model.js";

export const getPost = async (req, res) => {
  try {
    const getCollections = await Collection.find();
    res.status(200).json(getCollections);
  } catch (error) {
    res.send(error);
  }
};

export const createPost = async (req, res) => {
  try {
    const body = req.body;
    const newCollection = new Collection({...body, creator: req.userId, createdAt: new Date().toISOString() });
    await newCollection.save();
    res.status(201).json(newCollection);
  } catch (error) {
    res.json({ MessageError: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { id: _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
      return res.status(404).send("No post with that ID");
    }
    const post = req.body;
    const updatedPost = await Collection.findByIdAndUpdate(
      _id,
      { ...post, _id },
      { new: true }
    );
    res.json(updatedPost);
  } catch (error) {
    res.json({
      messageError: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("No post with that ID");
    }
    await Collection.findByIdAndDelete(id);
    res.json({ Message: "Post deleted successfully" });
  } catch (error) {
    res.send({
      MessageError: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!req.userId) {
      return res.json({ Message: "Unauthenticated" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).send("No post with that ID");
    }
    const post = await Collection.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
      post.likes.push(req.userId);
    } else {
      post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatePost = await Collection.findByIdAndUpdate(
      id,
      post,
      { new: true }
    );
    res.json(updatePost);
  } catch (error) {}
};

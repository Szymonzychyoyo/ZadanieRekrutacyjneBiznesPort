import { Router } from "express";
import { body, param, validationResult } from "express-validator";
import Message from "../models/message.js";

const router = Router();

/**
 * Prosty middleware do obsługi walidacji
 */
const validate = (checks) => [
  ...checks,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: "Validation failed",
        data: errors.array(),
      });
    }
    next();
  },
];

/**
 * GET /messages
 */
router.get("/", async (_req, res, next) => {
  try {
    const messages = await Message.findAll({ order: [["id", "ASC"]] });
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /messages/:id
 */
router.get(
  "/:id",
  validate([param("id").isInt().withMessage("id must be an integer")]),
  async (req, res, next) => {
    try {
      const message = await Message.findByPk(req.params.id);
      if (!message) {
        return res
          .status(404)
          .json({ success: false, message: "Message not found" });
      }
      res.json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /messages
 */
router.post(
  "/",
  validate([
    body("content").isString().notEmpty().withMessage("content is required"),
  ]),
  async (req, res, next) => {
    try {
      const message = await Message.create({ content: req.body.content });
      res.status(201).json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /messages/:id
 */
router.put(
  "/:id",
  validate([
    param("id").isInt().withMessage("id must be an integer"),
    body("content").isString().notEmpty().withMessage("content is required"),
  ]),
  async (req, res, next) => {
    try {
      const message = await Message.findByPk(req.params.id);
      if (!message) {
        return res
          .status(404)
          .json({ success: false, message: "Message not found" });
      }
      await message.update({ content: req.body.content });
      res.json({ success: true, data: message });
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /messages/:id
 */
router.delete(
  "/:id",
  validate([param("id").isInt().withMessage("id must be an integer")]),
  async (req, res, next) => {
    try {
      const message = await Message.findByPk(req.params.id);
      if (!message) {
        return res
          .status(404)
          .json({ success: false, message: "Message not found" });
      }
      await message.destroy();
      res.json({ success: true, message: "Message deleted" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;

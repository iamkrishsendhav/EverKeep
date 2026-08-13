import express from "express";

import {
    createEvent,
    getEvents,
    getEvent,
    updateEvent,
    deleteEvent,
    completeEvent,
} from "../controllers/calendar.controller.js";


const router = express.Router();


// ============================================================
// CALENDAR EVENTS
// ============================================================

// GET    /api/calendar
// POST   /api/calendar

router
    .route("/")
    .get(getEvents)
    .post(createEvent);


// ============================================================
// SINGLE CALENDAR EVENT
// ============================================================

// GET    /api/calendar/:id
// PUT    /api/calendar/:id
// DELETE /api/calendar/:id

router
    .route("/:id")
    .get(getEvent)
    .put(updateEvent)
    .delete(deleteEvent);


// ============================================================
// COMPLETE EVENT
// ============================================================

// PATCH /api/calendar/:id/complete

router.patch(
    "/:id/complete",
    completeEvent
);


export default router;
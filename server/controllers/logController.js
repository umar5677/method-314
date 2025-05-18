const express = require('express');
const router = express.Router();
const logEntity = require('../entities/logEntity'); // Ensure this path is correct

class LogController {
  // Method to get raw logs - can be kept if needed for other purposes
  // static async getRawLogs(req, res) {
  //   try {
  //     const logs = await logEntity.getLogs(); // Calls the generic getLogs from LogEntity
  //     res.status(200).json(logs);
  //   } catch (error) {
  //     res.status(500).json({ error: 'Failed to retrieve raw logs', details: error.message });
  //   }
  // }

  static async getDailyLogs(req, res) {
    try {
      const { startDate, endDate } = req.query;
      // logEntity.getDailyLogs is designed to handle undefined startDate/endDate
      // but for consistency with weekly/monthly, we might expect them or have defaults.
      // For daily, letting entity handle undefined is fine.
      const dailyLogs = await logEntity.getDailyLogs(startDate, endDate);
      res.status(200).json(dailyLogs);
    } catch (error) {
      console.error('Error in getDailyLogs controller:', error);
      res.status(500).json({ error: 'Failed to retrieve daily logs', details: error.message });
    }
  }

  static async getWeeklyLogs(req, res) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate and endDate query parameters are required for weekly logs.' });
      }
      // Add date validation if necessary
      if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
        return res.status(400).json({ error: 'Invalid date format for startDate or endDate.' });
      }
      const weeklyLogs = await logEntity.getWeeklyLogs(startDate, endDate);
      res.status(200).json(weeklyLogs);
    } catch (error) {
      console.error('Error in getWeeklyLogs controller:', error);
      res.status(500).json({ error: 'Failed to retrieve weekly logs', details: error.message });
    }
  }

  static async getMonthlyLogs(req, res) {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ error: 'startDate and endDate query parameters are required for monthly logs.' });
      }
      // Add date validation if necessary
      if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
        return res.status(400).json({ error: 'Invalid date format for startDate or endDate.' });
      }
      const monthlyLogs = await logEntity.getMonthlyLogs(startDate, endDate);
      res.status(200).json(monthlyLogs);
    } catch (error) {
      console.error('Error in getMonthlyLogs controller:', error);
      res.status(500).json({ error: 'Failed to retrieve monthly logs', details: error.message });
    }
  }
}

// New routes for specific aggregations
router.get('/logs/daily', LogController.getDailyLogs);
router.get('/logs/weekly', LogController.getWeeklyLogs);
router.get('/logs/monthly', LogController.getMonthlyLogs);

// If you still need the old endpoint that fetches all logs:
// router.get('/logs/all', LogController.getRawLogs); // Or keep it as '/logs' if no conflict

module.exports = router;
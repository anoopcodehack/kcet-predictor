import { Request, Response } from 'express';
import { predictionEngine } from '../services/predictionEngine.js';

export const predictorController = {
  predictAdmissions: async (req: Request, res: Response): Promise<void> => {
    try {
      const { rank, category, branchCode, collegeCode, year, round, gender } = req.body;

      if (rank === undefined || rank === null || isNaN(Number(rank))) {
        res.status(400).json({ success: false, message: 'Rank is required and must be a valid number.' });
        return;
      }

      const parsedRank = Number(rank);
      if (parsedRank <= 0) {
        res.status(400).json({ success: false, message: 'KCET Rank must be greater than 0.' });
        return;
      }

      const predictions = await predictionEngine.predict({
        rank: parsedRank,
        category: category || 'GM',
        branchCode,
        collegeCode,
        year,
        round,
        gender
      });

      res.json({
        success: true,
        count: predictions.length,
        data: predictions
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

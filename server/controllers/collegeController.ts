import { Request, Response } from 'express';
import { dbService } from '../config/db.js';

export const collegeController = {
  getColleges: async (req: Request, res: Response): Promise<void> => {
    try {
      const colleges = await dbService.getColleges();
      res.json({ success: true, count: colleges.length, data: colleges });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getCollegeByCode: async (req: Request, res: Response): Promise<void> => {
    try {
      const { code } = req.params;
      const colleges = await dbService.getColleges();
      const college = colleges.find(c => c.code.toUpperCase() === code.toUpperCase());
      
      if (!college) {
        res.status(404).json({ success: false, message: `College with code ${code} not found.` });
        return;
      }

      res.json({ success: true, data: college });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getBranches: async (req: Request, res: Response): Promise<void> => {
    try {
      const branches = await dbService.getBranches();
      res.json({ success: true, count: branches.length, data: branches });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getCategories: (req: Request, res: Response): void => {
    try {
      const categories = dbService.getCategories();
      res.json({ success: true, count: categories.length, data: categories });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  addCollege: async (req: Request, res: Response): Promise<void> => {
    try {
      const { code, name, location, type, fee, ranking, website, intake } = req.body;
      
      if (!code || !name || !location || !type || !fee || !ranking || !website || !intake) {
        res.status(400).json({ success: false, message: 'All college fields are required.' });
        return;
      }

      const colleges = await dbService.getColleges();
      const exists = colleges.some(c => c.code.toLowerCase() === code.toLowerCase());
      if (exists) {
        res.status(400).json({ success: false, message: `College code ${code} already exists.` });
        return;
      }

      const college = await dbService.addCollege({
        code,
        name,
        location,
        type,
        fee: Number(fee),
        ranking: Number(ranking),
        website,
        intake: Number(intake)
      });

      res.status(201).json({ success: true, data: college, message: 'College added successfully!' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

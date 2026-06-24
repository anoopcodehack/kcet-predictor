import { Request, Response } from 'express';
import { trendEngine } from '../services/trendEngine.js';
import { dbService } from '../config/db.js';
import { Cutoff } from '../data/mockDatabase.js';

export const analyticsController = {
  getCutoffTrends: async (req: Request, res: Response): Promise<void> => {
    try {
      const collegeCode = req.query.collegeCode as string;
      const branchCode = req.query.branchCode as string;
      const category = (req.query.category as string) || 'GM';
      const round = req.query.round ? Number(req.query.round) : 1;

      if (!collegeCode || !branchCode) {
        res.status(400).json({
          success: false,
          message: 'Both collegeCode and branchCode query parameters are required for trend analysis.'
        });
        return;
      }

      const trendData = await trendEngine.getTrends({
        collegeCode,
        branchCode,
        category,
        round
      });

      res.json({ success: true, data: trendData });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  getDashboardStats: async (req: Request, res: Response): Promise<void> => {
    try {
      const colleges = await dbService.getColleges();
      const branches = await dbService.getBranches();
      const categories = dbService.getCategories();
      
      const totalColleges = colleges.length;
      const totalBranches = branches.length;
      const totalCategories = categories.length;

      // Calculate aggregated statistics
      let totalIntake = 0;
      let totalFees = 0;
      colleges.forEach(col => {
        totalIntake += col.intake || 0;
        totalFees += col.fee || 0;
      });

      const averageFee = totalColleges > 0 ? Math.floor(totalFees / totalColleges) : 0;

      // College counts by management type
      const typeCounts = {
        Government: colleges.filter(c => c.type === 'Government').length,
        Aided: colleges.filter(c => c.type === 'Aided').length,
        Private: colleges.filter(c => c.type === 'Private').length
      };

      // Location distribution
      const locationCounts: { [key: string]: number } = {};
      colleges.forEach(col => {
        locationCounts[col.location] = (locationCounts[col.location] || 0) + 1;
      });

      res.json({
        success: true,
        data: {
          totalColleges,
          totalBranches,
          totalCategories,
          totalIntake,
          averageFee,
          typeCounts,
          locationCounts
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  importCSV: async (req: Request, res: Response): Promise<void> => {
    try {
      const { csvData, customJson } = req.body;

      let cutoffsToImport: Cutoff[] = [];

      // 1. Check if the client uploaded parsed JSON directly (highly reliable)
      if (customJson && Array.isArray(customJson)) {
        cutoffsToImport = customJson.map((row: any) => ({
          collegeCode: String(row.collegeCode),
          branchCode: String(row.branchCode),
          year: Number(row.year),
          round: Number(row.round),
          category: String(row.category),
          cutoffRank: Number(row.cutoffRank)
        }));
      } 
      // 2. Otherwise parse raw CSV text
      else if (csvData && typeof csvData === 'string') {
        const lines = csvData.split('\n');
        
        // CSV Structure: CollegeCode,BranchCode,Year,Round,Category,CutoffRank
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const parts = line.split(',');
          if (parts.length >= 6) {
            const collegeCode = parts[0].trim();
            const branchCode = parts[1].trim();
            const year = parseInt(parts[2].trim());
            const round = parseInt(parts[3].trim());
            const category = parts[4].trim();
            const cutoffRank = parseInt(parts[5].trim());

            if (collegeCode && branchCode && !isNaN(year) && !isNaN(round) && category && !isNaN(cutoffRank)) {
              cutoffsToImport.push({
                collegeCode,
                branchCode,
                year,
                round,
                category,
                cutoffRank
              });
            }
          }
        }
      } else {
        res.status(400).json({
          success: false,
          message: 'Please provide either a CSV string (csvData) or parsed array (customJson).'
        });
        return;
      }

      if (cutoffsToImport.length === 0) {
        res.status(400).json({ success: false, message: 'No valid records found to import.' });
        return;
      }

      const result = await dbService.importCSVs(cutoffsToImport);
      res.status(201).json({
        success: true,
        message: `Successfully imported ${result.count} cutoff records!`,
        count: result.count
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

import React from 'react';
import { HelpCircle, ShieldAlert, FileText, CheckSquare, Layers, Award, Info, Landmark } from 'lucide-react';

export default function About() {
  const reservationCategories = [
    { code: 'GM', description: 'General Merit', benefit: 'Default open quota for all students.' },
    { code: 'GMR', description: 'General Merit Rural', benefit: 'For candidates studied 10 full years in rural Karnataka schools.' },
    { code: 'GMK', description: 'General Merit Kannada', benefit: 'For candidates studied 10 full years in Kannada medium institutions.' },
    { code: 'SCG / SCR / SCK', description: 'Scheduled Caste', benefit: 'Generous quota with up to 4.2x relaxed cutoff ranks.' },
    { code: 'STG / STR / STK', description: 'Scheduled Tribe', benefit: 'Quota with up to 3.8x relaxed cutoff ranks.' },
    { code: '2AG / 2AR / 2AK', description: 'Category 2A (OBC)', benefit: 'Relatively large quota with up to 1.85x relaxed cutoffs.' },
    { code: '2BG / 2BR / 2BK', description: 'Category 2B (OBC Muslim)', benefit: 'Specific community quota with up to 2.1x relaxed cutoffs.' },
    { code: '3AG / 3BG', description: 'Category 3A / 3B', benefit: 'Dominant state categories with up to 1.65x relaxed cutoffs.' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Page Header */}
      <div className="page-header border-b-4 border-black pb-4 mb-6">
        <h1 className="page-title text-2xl md:text-3xl font-black uppercase text-black flex items-center gap-2">
          <HelpCircle className="w-7 h-7 text-red" />
          KEA Counseling & Reservation Guide
        </h1>
        <p className="page-sub text-gray text-xs font-black uppercase tracking-wider mt-1">
          A definitive handbook covering option entry strategies, seat categories, and mandatory document files.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns: counseling process */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Option entry flowchart explanation */}
          <div className="card">
            <div className="card-header bg-black text-white px-4 py-3 flex items-center justify-between">
              <span className="font-black text-xs uppercase tracking-widest text-white">KEA COUNSELING PHASES EXPLAINED</span>
              <Layers className="w-4 h-4 text-lime" />
            </div>
            <div className="card-body bg-white p-6 space-y-6">
              
              <div className="relative border-l-4 border-black pl-6 space-y-6">
                
                {/* Step 1 */}
                <div className="relative">
                  <div className="absolute left-[-35px] top-0 w-6 h-6 rounded-full bg-lime border-2 border-black flex items-center justify-center text-xs font-black">
                    1
                  </div>
                  <h3 className="font-black text-sm uppercase text-black">
                    Verification Slip & Secret Key
                  </h3>
                  <p className="text-xs text-dark-gray font-bold mt-1">
                    Following document verification at KEA nodal hubs, you are issued an official Verification Slip containing your **Secret Key** and verification **RD Numbers**. Do not share this key!
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="absolute left-[-35px] top-0 w-6 h-6 rounded-full bg-lime border-2 border-black flex items-center justify-center text-xs font-black">
                    2
                  </div>
                  <h3 className="font-black text-sm uppercase text-black">
                    Option Entry Portal Logins
                  </h3>
                  <p className="text-xs text-dark-gray font-bold mt-1">
                    Log into the KEA dashboard. Enter your choices of colleges and branches. You can enter an **unlimited** number of options. Ensure your most desired courses are sorted at the top!
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="absolute left-[-35px] top-0 w-6 h-6 rounded-full bg-lime border-2 border-black flex items-center justify-center text-xs font-black">
                    3
                  </div>
                  <h3 className="font-black text-sm uppercase text-black">
                    Mock Seat Allotment
                  </h3>
                  <p className="text-xs text-dark-gray font-bold mt-1">
                    KEA runs a simulation of seat allotments using current options. Check your mock allocation. You then receive a 2-3 day window to **add, delete, or re-order** your options before Round 1 locks.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative">
                  <div className="absolute left-[-35px] top-0 w-6 h-6 rounded-full bg-red text-white border-2 border-black flex items-center justify-center text-xs font-black">
                    4
                  </div>
                  <h3 className="font-black text-sm uppercase text-black">
                    Round 1 Allotment & Decision Choices
                  </h3>
                  <p className="text-xs text-dark-gray font-bold mt-1 mb-2">
                    Once allocated, you MUST select one of four choices:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    <div className="p-2 border-2 border-black bg-emerald-50 text-[11px] font-bold">
                      <span className="font-black uppercase block text-success">Choice 1: Freeze</span>
                      100% satisfied. Accept seat, pay fee, download admission order, and report to college.
                    </div>
                    <div className="p-2 border-2 border-black bg-amber-50 text-[11px] font-bold">
                      <span className="font-black uppercase block text-amber-800">Choice 2: Slide & Hold</span>
                      Hold current seat, but participate in Round 2 to check if a higher preferred option matches.
                    </div>
                    <div className="p-2 border-2 border-black bg-rose-50 text-[11px] font-bold">
                      <span className="font-black uppercase block text-red">Choice 3: Reject & Float</span>
                      Reject allocated seat completely, but participate in Round 2 for higher preferred choices.
                    </div>
                    <div className="p-2 border-2 border-black bg-gray/10 text-[11px] font-bold text-gray">
                      <span className="font-black uppercase block">Choice 4: Withdraw</span>
                      Reject seat and exit counseling completely.
                    </div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Reservation Categories matrix */}
          <div className="card">
            <div className="card-header bg-black text-white px-4 py-3 flex items-center justify-between">
              <span className="font-black text-xs uppercase tracking-widest text-white">RESERVATION CATEGORY THRESHOLDS</span>
              <Award className="w-4 h-4 text-lime" />
            </div>
            <div className="overflow-x-auto bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-light-gray border-b-3 border-black text-[10px] font-black uppercase text-black">
                    <th className="p-3 border-r-2 border-black">Category</th>
                    <th className="p-3 border-r-2 border-black">Quota Name</th>
                    <th className="p-3 text-xs">Category Advantage & Threshold Benefits</th>
                  </tr>
                </thead>
                <tbody className="divide-y-2 divide-black text-xs font-bold text-black">
                  {reservationCategories.map((cat) => (
                    <tr key={cat.code} className="hover:bg-off-white/80">
                      <td className="p-3 border-r-2 border-black font-extrabold uppercase text-red bg-red/5">
                        {cat.code}
                      </td>
                      <td className="p-3 border-r-2 border-black font-extrabold">
                        {cat.description}
                      </td>
                      <td className="p-3 text-dark-gray font-semibold">
                        {cat.benefit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right column: Document Checklist */}
        <div className="space-y-6">
          <div className="card h-full">
            <div className="card-header bg-black text-white px-4 py-3 flex items-center justify-between">
              <span className="font-black text-xs uppercase tracking-widest text-white">MANDATORY DOCUMENT CHECKLIST</span>
              <FileText className="w-4 h-4 text-lime" />
            </div>
            <div className="card-body bg-white p-5 space-y-4">
              <p className="text-xs font-bold text-gray uppercase tracking-wider">
                Assemble these original documents and three sets of photocopies before KEA verification counters:
              </p>

              <div className="space-y-3">
                {[
                  'KCET 2026 Registration Application Printout',
                  'KCET 2026 Hall Ticket (Admission Ticket)',
                  'SSLC / Class 10 Marks Card (For Birth Date)',
                  '2nd PUC / Class 12 Marks Card',
                  '7-Year Study Certificate (Signed by BEO)',
                  'Rural Study Certificate (10 years, if applicable)',
                  'Kannada Medium Certificate (10 years, if applicable)',
                  'Caste / Income Certificate (Form-F, if claiming reservation)',
                  'Two Passport Size Photographs'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-2.5 border-2 border-black bg-off-white hover:bg-light-gray transition-colors">
                    <CheckSquare className="w-5 h-5 text-red shrink-0" />
                    <span className="font-bold text-xs uppercase text-black leading-tight">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-2 border-dashed border-black p-4 bg-amber-50">
                <div className="flex gap-2 items-start">
                  <ShieldAlert className="w-5 h-5 text-red shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-xs text-black uppercase">
                      BEO Counter-Signature Rule
                    </h5>
                    <p className="text-[10px] text-dark-gray font-bold mt-1 leading-normal">
                      All Study Certificates, Rural study certificates, and Kannada Medium certificates MUST be counter-signed by the Block Education Officer (BEO) of the respective zone to be verified.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

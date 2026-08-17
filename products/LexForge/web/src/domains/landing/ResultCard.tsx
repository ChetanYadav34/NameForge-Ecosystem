"use client";
import React from 'react';
import { Card, Stack, Badge, Button } from '@lexforge/ui';
import { GenerationResult } from '../../store/useGenerationStore';
import { motion } from 'framer-motion';

export const ResultCard = ({ result }: { result: GenerationResult }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col"
    >
      <Card className="group flex-1 p-6 border border-slate-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-xl transition-all duration-300 bg-white flex flex-col justify-between">
        <Stack gap={6}>
          <div className="flex justify-between items-start gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="text-3xl font-serif font-bold text-slate-900 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="break-all md:break-words">{result.name}</span>
                <span className="text-sm font-mono text-slate-400 font-normal shrink-0">{result.strategySource}</span>
              </h3>
              <p className="text-sm text-slate-500 italic mt-1 truncate">
                Brandability: <span className="font-medium">{(result.scores?.brandability * 10).toFixed(1)}/10</span>
              </p>
            </div>
            
            <div className="flex gap-2">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center bg-primary/5">
                  <span className="text-primary-800 font-bold text-xs">{result.scores?.humanShortlistScore.toFixed(0)}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-mono">HSS</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border-2 border-green-100 flex items-center justify-center bg-green-50">
                  <span className="text-green-700 font-bold text-xs">{(result.scores?.generationComposite * 100).toFixed(0)}</span>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-mono">Comp</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Availability Checks</span>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Company Conflict:</span>
                  <span className={result.availability?.companyConflict?.status === 'CLEAR_NOT_FOUND' ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>{result.availability?.companyConflict?.status || 'UNKNOWN'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Trademark (.us):</span>
                  <span className={result.availability?.trademark?.status === 'CLEAR_NOT_FOUND' ? 'text-green-600 font-medium' : 'text-orange-600 font-medium'}>{result.availability?.trademark?.status || 'UNKNOWN'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 pt-2">
              {result.availability?.domains?.com?.status === 'AVAILABLE' ? (
                <Badge variant="default" className="text-xs bg-green-50 text-green-700 border border-green-200">.com Available</Badge>
              ) : (
                <Badge variant="default" className="text-xs bg-red-50 text-red-700 border border-red-200">.com Taken</Badge>
              )}
              <Badge variant="default" className="text-xs bg-slate-100 text-slate-600 border-none">Risk: {(result.scores?.availabilityRisk * 100).toFixed(0)}%</Badge>
            </div>
          </div>
        </Stack>
        
        {/* Reserve space for actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-2 opacity-0 group-hover:opacity-100 hover:opacity-100 transition-opacity">
          <Button variant="secondary" className="text-xs py-1 px-3">Compare</Button>
          <Button 
            variant="primary" 
            className="text-xs py-1 px-3"
            onClick={() => {
              import('../../core/services/GenerationService').then(({ GenerationService }) => {
                import('../../store/useGenerationStore').then(({ useGenerationStore }) => {
                  const input = useGenerationStore.getState().currentInput;
                  if (GenerationService.sendFeedback) {
                    GenerationService.sendFeedback(result.name, input);
                  }
                });
              });
            }}
          >
            Save
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

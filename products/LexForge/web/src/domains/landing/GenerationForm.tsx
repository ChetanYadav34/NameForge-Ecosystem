"use client";
import React, { useEffect, useState } from 'react';
import { Input, Button } from '@lexforge/ui';
import { useGenerationStore } from '../../store/useGenerationStore';
import { GenerationService } from '../../core/services/GenerationService';
import { GenerationFSM, GenerationState } from '../../core/fsm/GenerationFSM';
import { InteractionEventBus } from '../../core/events/EventBus';
import { motion } from 'framer-motion';

const engineFSM = new GenerationFSM();

export const GenerationForm = () => {
  const { currentInput, setInput, clearResults, addResult, fsmState, setFsmState } = useGenerationStore();
  const [industry, setIndustry] = useState('');
  const [tone, setTone] = useState('');
  const [strategy, setStrategy] = useState('hybrid');
  const [pipelineMessage, setPipelineMessage] = useState('Forging...');
  
  // Listen to EventBus to sync FSM state
  useEffect(() => {
    const handleValidationStarted = () => setFsmState(engineFSM.transition('SUBMIT'));
    const handleValidationFailed = () => setFsmState(engineFSM.transition('VALIDATION_FAIL'));
    const handleGenerationStarted = () => {
      setFsmState(engineFSM.transition('VALIDATION_SUCCESS'));
      // Initial scroll to show loading state
      setTimeout(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById('showcase');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }, 300);
    };
    const handleStreamStarted = () => setFsmState(engineFSM.transition('STREAM_START'));
    const handleStreamEnd = () => {
      setFsmState(engineFSM.transition('STREAM_END'));
      // Ensure we scroll down to results after streaming completes
      setTimeout(() => {
        requestAnimationFrame(() => {
          const el = document.getElementById('showcase');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }, 500);
    };
    const handleReset = () => setFsmState(engineFSM.transition('RESET'));
    
    const handleChunk = ({ chunk }: { chunk: string }) => {
      try {
        const result = JSON.parse(chunk);
        addResult(result);
      } catch (e) {
        // ignore malformed chunks
      }
    };

    const handlePipelineState = ({ state }: { state: string }) => {
      switch(state) {
        case 'INPUT_PARSING': setPipelineMessage('Understanding request...'); break;
        case 'GENERATING': setPipelineMessage('Generating candidates...'); break;
        case 'FILTERING': setPipelineMessage('Filtering names...'); break;
        case 'EVALUATING': setPipelineMessage('Analyzing phonetics & semantics...'); break;
        case 'RANKING': setPipelineMessage('Ranking candidates...'); break;
        case 'FINALIZING': setPipelineMessage('Preparing explanations...'); break;
        default: setPipelineMessage('Forging...');
      }
    };

    InteractionEventBus.on('VALIDATION_STARTED', handleValidationStarted);
    InteractionEventBus.on('VALIDATION_FAILED', handleValidationFailed);
    InteractionEventBus.on('GENERATION_STARTED', handleGenerationStarted);
    InteractionEventBus.on('STREAM_STARTED', handleStreamStarted);
    InteractionEventBus.on('STREAM_CHUNK', handleChunk);
    InteractionEventBus.on('STREAM_FINISHED', handleStreamEnd);
    InteractionEventBus.on('FSM_STATE_CHANGE', handlePipelineState);

    return () => {
      InteractionEventBus.off('VALIDATION_STARTED', handleValidationStarted);
      InteractionEventBus.off('VALIDATION_FAILED', handleValidationFailed);
      InteractionEventBus.off('GENERATION_STARTED', handleGenerationStarted);
      InteractionEventBus.off('STREAM_STARTED', handleStreamStarted);
      InteractionEventBus.off('STREAM_CHUNK', handleChunk);
      InteractionEventBus.off('STREAM_FINISHED', handleStreamEnd);
      InteractionEventBus.off('FSM_STATE_CHANGE', handlePipelineState);
    };
  }, [addResult, setFsmState]);

  const handleGenerate = async () => {
    if (fsmState === 'GENERATING' || fsmState === 'STREAMING' || fsmState === 'VALIDATING') return;
    clearResults();
    // Start process via service
    await GenerationService.generate(currentInput, [{ type: 'industry', value: industry }, { type: 'tone', value: tone }], strategy);
  };

  const isLoading = fsmState === 'VALIDATING' || fsmState === 'GENERATING' || fsmState === 'STREAMING';

  return (
    <div className="bg-white/40 backdrop-blur-2xl rounded-3xl shadow-xl shadow-black/5 border border-white/50 p-6 md:p-8 flex flex-col gap-4">
      <div>
        <label className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest mb-2 block">Brand Vision</label>
        <Input 
          placeholder="e.g. A fast, sleek cyberpunk motorcycle" 
          value={currentInput}
          onChange={(e) => {
            setInput(e.target.value);
            if (fsmState !== 'TYPING') {
              setFsmState(engineFSM.transition('INPUT_CHANGE'));
            }
          }}
          className="w-full text-base py-3 bg-white/50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:ring-primary focus:border-primary"
          disabled={isLoading}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest mb-2 block">Industry</label>
          <select 
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            disabled={isLoading}
            className="w-full text-base py-3 px-4 bg-white/50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none disabled:opacity-50 appearance-none"
          >
            <option value="">Any Industry</option>
            <option value="tech">Technology</option>
            <option value="automation">Automation</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="automotive">Automotive</option>
            <option value="real_estate">Real Estate</option>
            <option value="ecommerce">E-commerce</option>
            <option value="fashion">Fashion</option>
            <option value="education">Education</option>
            <option value="entertainment">Entertainment</option>
            <option value="food">Food & Beverage</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest mb-2 block">Tone</label>
          <select 
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={isLoading}
            className="w-full text-base py-3 px-4 bg-white/50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none disabled:opacity-50 appearance-none"
          >
            <option value="">Any Tone</option>
            <option value="modern">Modern & Clean</option>
            <option value="aggressive">Aggressive & Fast</option>
            <option value="luxurious">Luxurious & Premium</option>
            <option value="trustworthy">Trustworthy & Solid</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-mono font-medium text-slate-500 uppercase tracking-widest mb-2 block">Approach</label>
          <select
            value={strategy}
            onChange={(e) => setStrategy(e.target.value)}
            className="w-full text-base py-3 px-4 bg-white/50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none disabled:opacity-50 appearance-none"
          >
            <option value="intent">Intent Focus</option>
            <option value="industry">Industry Focus</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>
      
      <Button 
        variant="primary" 
        className="w-full mt-2 py-4 text-base shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5"
        onClick={handleGenerate}
        disabled={isLoading || currentInput.trim().length === 0}
      >
        {isLoading ? pipelineMessage : 'Generate Brand Identity'}
      </Button>
    </div>
  );
};

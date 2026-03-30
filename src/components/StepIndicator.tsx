import React from 'react';
import { Check } from 'lucide-react';
import { motion } from 'motion/react';

interface Step {
  id: string;
  title: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStepIndex: number;
}

export default function StepIndicator({ steps, currentStepIndex }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between w-full max-w-3xl mx-auto mb-12 px-4">
      {steps.map((step, index) => {
        const isCompleted = index < currentStepIndex;
        const isActive = index === currentStepIndex;

        return (
          <React.Fragment key={step.id}>
            {/* Step Circle */}
            <div className="flex flex-col items-center relative z-10">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted || isActive ? '#4f46e5' : '#f1f5f9',
                  borderColor: isCompleted || isActive ? '#4f46e5' : '#e2e8f0',
                  color: isCompleted || isActive ? '#ffffff' : '#94a3b8',
                }}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors duration-300`}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </motion.div>
              <span className={`absolute -bottom-7 text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${
                isActive ? 'text-indigo-600' : 'text-slate-400'
              }`}>
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] bg-slate-200 mx-4 relative">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: isCompleted ? '100%' : '0%' }}
                  className="absolute inset-0 bg-indigo-600 transition-all duration-500"
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';

const STEPS = [
  { id: 'landing', name: 'Landing', path: '/' },
  { id: 'choice', name: 'Choose Path', path: '/onboarding' },
  { id: 'diagnostic', name: 'Diagnostic', path: '/onboarding/diagnostic' },
  { id: 'complete', name: 'Results', path: '/onboarding/complete?elo=850&level=intermediate' },
  { id: 'learn-guest', name: 'Chess Path', path: '/learn?guest=true&level=intermediate' },
  { id: 'lesson', name: 'First Lesson', path: '/lesson/2.1?guest=true' },
  { id: 'signup', name: 'Sign Up', path: '/auth/signup?from=lesson' },
  { id: 'welcome', name: 'Welcome', path: '/auth/welcome' },
];

export default function MVPFunnel() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="bg-[#111] border-b border-gray-800 p-3 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <span className="text-white font-medium text-sm">MVP Funnel Preview</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-[#58CC02]/20 text-[#58CC02]">FLOW</span>
          </div>
          <Link
            href={STEPS[currentStep].path}
            target="_blank"
            className="text-xs text-cyan-400 hover:text-cyan-300"
          >
            Open in new tab →
          </Link>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="bg-[#111]/50 border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between gap-2">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`flex-1 flex items-center gap-2 px-4 py-3 rounded-xl transition-all ${
                  currentStep === index
                    ? 'bg-[#58CC02] text-black'
                    : currentStep > index
                    ? 'bg-[#58CC02]/20 text-[#58CC02]'
                    : 'bg-[#1A2C35] text-gray-400 hover:bg-[#2A3C45]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === index
                      ? 'bg-black/20 text-black'
                      : currentStep > index
                      ? 'bg-[#58CC02] text-black'
                      : 'bg-gray-700 text-gray-400'
                  }`}
                >
                  {currentStep > index ? '✓' : index + 1}
                </div>
                <span className="font-medium text-sm hidden sm:block">{step.name}</span>
              </button>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1 bg-[#1A2C35] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#58CC02] transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            currentStep === 0
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-[#1A2C35] text-white hover:bg-[#2A3C45]'
          }`}
        >
          ← Previous
        </button>
        <div className="px-4 py-2 bg-[#111] rounded-lg border border-gray-700">
          <span className="text-gray-400 text-sm">
            {currentStep + 1} / {STEPS.length}
          </span>
        </div>
        <button
          onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
          disabled={currentStep === STEPS.length - 1}
          className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${
            currentStep === STEPS.length - 1
              ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
              : 'bg-[#58CC02] text-black hover:scale-105'
          }`}
        >
          Next →
        </button>
      </div>

      {/* Phone Frame with iframe */}
      <div className="flex justify-center py-8 pb-32">
        <div className="relative">
          {/* Phone frame */}
          <div
            className="relative rounded-[3rem] p-3 bg-gradient-to-b from-gray-700 to-gray-900"
            style={{
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />

            {/* Screen */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-black" style={{ width: 375, height: 700 }}>
              {/* Status bar */}
              <div className="absolute top-0 left-0 right-0 h-12 bg-black/50 z-10 flex items-end justify-between px-8 pb-1">
                <span className="text-white text-xs font-medium">9:41</span>
                <div className="flex items-center gap-1">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 3a9 9 0 00-9 9v7a2 2 0 002 2h14a2 2 0 002-2v-7a9 9 0 00-9-9z"/>
                  </svg>
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3a4.237 4.237 0 00-6 0zm-4-4l2 2a7.074 7.074 0 0110 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
                  </svg>
                  <div className="w-6 h-3 border border-white rounded-sm ml-1">
                    <div className="h-full w-3/4 bg-white rounded-sm" />
                  </div>
                </div>
              </div>

              {/* iframe content */}
              <iframe
                key={STEPS[currentStep].path}
                src={STEPS[currentStep].path}
                className="w-full h-full border-0"
                title={STEPS[currentStep].name}
              />
            </div>
          </div>

          {/* Step label */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 text-center">
            <div className="text-lg font-bold text-white">{STEPS[currentStep].name}</div>
            <div className="text-sm text-gray-500">{STEPS[currentStep].path}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

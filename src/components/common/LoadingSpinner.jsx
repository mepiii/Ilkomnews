import React from 'react'

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-12 min-h-[200px]">
      <div className="relative flex flex-col items-center justify-center gap-4">
        {/* Main Loading Container */}
        <div className="relative">
          {/* Outer Ring - Rotating */}
          <div className="w-12 h-12 rounded-full border-2 border-purple-500/30 animate-spin-slow">
            <div className="absolute inset-0 rounded-full border-t-2 border-purple-400 animate-spin"></div>
          </div>

          {/* Middle Ring - Reverse Rotating */}
          <div className="absolute inset-0 w-9 h-9 m-auto rounded-full border-2 border-indigo-500/30 animate-spin-reverse">
            <div className="absolute inset-0 rounded-full border-b-2 border-indigo-400"></div>
          </div>

          {/* Inner Core - Pulsing Dot */}
          <div className="absolute inset-0 w-4 h-4 m-auto">
            <div className="w-full h-full bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full animate-pulse-core"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex items-center gap-1">
          <span className="text-purple-600 font-mono text-xs tracking-wider animate-pulse-text">LOADING</span>
          <div className="flex gap-0.5">
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0s' }}></div>
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1 h-1 bg-purple-500 rounded-full animate-bounce-dot" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>

        {/* Status Message */}
        <p className="text-gray-400 text-xs animate-pulse-slow">Memuat data...</p>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        @keyframes pulse-core {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(0.8);
          }
        }

        @keyframes pulse-text {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @keyframes bounce-dot {
          0%, 100% {
            transform: translateY(0);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-3px);
            opacity: 1;
          }
        }

        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }

        .animate-spin-reverse {
          animation: spin-reverse 1.5s linear infinite;
        }

        .animate-pulse-core {
          animation: pulse-core 1s ease-in-out infinite;
        }

        .animate-pulse-text {
          animation: pulse-text 1.5s ease-in-out infinite;
        }

        .animate-bounce-dot {
          animation: bounce-dot 0.6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-text 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

export default LoadingSpinner
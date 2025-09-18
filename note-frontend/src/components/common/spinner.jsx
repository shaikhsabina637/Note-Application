"use client"

export default function Spinner() {
  return (
    <div className="flex justify-center items-center">
      <div className="w-10 h-10 rounded-full relative">
        <div className="spinner-dots"></div>
        <span className="sr-only">Loading...</span>
      </div>

      <style jsx>{`
        .spinner-dots {
          font-size: 10px;
          width: 1em;
          height: 1em;
          border-radius: 50%;
          position: relative;
          text-indent: -9999em;
          animation: mulShdSpin 1.1s infinite ease;
          transform: translateZ(0);
        }

        @keyframes mulShdSpin {
          0%, 100% {
            box-shadow: 0em -2.6em 0em 0em #a78bfa, 
                        1.8em -1.8em 0 0em rgba(167,139,250,0.2), 
                        2.5em 0em 0 0em rgba(167,139,250,0.2), 
                        1.75em 1.75em 0 0em rgba(167,139,250,0.2), 
                        0em 2.5em 0 0em rgba(167,139,250,0.2), 
                        -1.8em 1.8em 0 0em rgba(167,139,250,0.2), 
                        -2.6em 0em 0 0em rgba(167,139,250,0.5), 
                        -1.8em -1.8em 0 0em rgba(167,139,250,0.7);
          }
          12.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(167,139,250,0.7),
                        1.8em -1.8em 0 0em #a78bfa,
                        2.5em 0em 0 0em rgba(167,139,250,0.2),
                        1.75em 1.75em 0 0em rgba(167,139,250,0.2),
                        0em 2.5em 0 0em rgba(167,139,250,0.2),
                        -1.8em 1.8em 0 0em rgba(167,139,250,0.2),
                        -2.6em 0em 0 0em rgba(167,139,250,0.2),
                        -1.8em -1.8em 0 0em rgba(167,139,250,0.5);
          }
          25% {
            box-shadow: 0em -2.6em 0em 0em rgba(167,139,250,0.5),
                        1.8em -1.8em 0 0em rgba(167,139,250,0.7),
                        2.5em 0em 0 0em #a78bfa,
                        1.75em 1.75em 0 0em rgba(167,139,250,0.2),
                        0em 2.5em 0 0em rgba(167,139,250,0.2),
                        -1.8em 1.8em 0 0em rgba(167,139,250,0.2),
                        -2.6em 0em 0 0em rgba(167,139,250,0.2),
                        -1.8em -1.8em 0 0em rgba(167,139,250,0.2);
          }
          37.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(167,139,250,0.2),
                        1.8em -1.8em 0 0em rgba(167,139,250,0.5),
                        2.5em 0em 0 0em rgba(167,139,250,0.7),
                        1.75em 1.75em 0 0em #a78bfa,
                        0em 2.5em 0 0em rgba(167,139,250,0.2),
                        -1.8em 1.8em 0 0em rgba(167,139,250,0.2),
                        -2.6em 0em 0 0em rgba(167,139,250,0.2),
                        -1.8em -1.8em 0 0em rgba(167,139,250,0.2);
          }
          37.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(167,139,250,0.2),
                        1.8em -1.8em 0 0em rgba(167,139,250,0.5),
                        2.5em 0em 0 0em rgba(167,139,250,0.7),
                        1.75em 1.75em 0 0em #a78bfa,
                        0em 2.5em 0 0em rgba(167,139,250,0.2),
                        -1.8em 1.8em 0 0em rgba(167,139,250,0.2),
                        -2.6em 0em 0 0em rgba(167,139,250,0.2),
                        -1.8em -1.8em 0 0em rgba(167,139,250,0.2);
          }
          50% {
            box-shadow: 0em -2.6em 0em 0em rgba(167,139,250,0.2),
                        1.8em -1.8em 0 0em rgba(167,139,250,0.2),
                        2.5em 0em 0 0em rgba(167,139,250,0.5),
                        1.75em 1.75em 0 0em rgba(167,139,250,0.7),
                        0em 2.5em 0 0em #a78bfa,
                        -1.8em 1.8em 0 0em rgba(167,139,250,0.2),
                        -2.6em 0em 0 0em rgba(167,139,250,0.2),
                        -1.8em -1.8em 0 0em rgba(167,139,250,0.2);
          }
          62.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(167,139,250,0.2),
                        1.8em -1.8em 0 0em rgba(167,139,250,0.2),
                        2.5em 0em 0 0em rgba(167,139,250,0.2),
                        1.75em 1.75em 0 0em rgba(167,139,250,0.5),
                        0em 2.5em 0 0em rgba(167,139,250,0.7),
                        -1.8em 1.8em 0 0em #a78bfa,
                        -2.6em 0em 0 0em rgba(167,139,250,0.2),
                        -1.8em -1.8em 0 0em rgba(167,139,250,0.2);
          }
          75% {
            box-shadow: 0em -2.6em 0em 0em rgba(167,139,250,0.2),
                        1.8em -1.8em 0 0em rgba(167,139,250,0.2),
                        2.5em 0em 0 0em rgba(167,139,250,0.2),
                        1.75em 1.75em 0 0em rgba(167,139,250,0.2),
                        0em 2.5em 0 0em rgba(167,139,250,0.5),
                        -1.8em 1.8em 0 0em rgba(167,139,250,0.7),
                        -2.6em 0em 0 0em #a78bfa,
                        -1.8em -1.8em 0 0em rgba(167,139,250,0.2);
          }
          87.5% {
            box-shadow: 0em -2.6em 0em 0em rgba(167,139,250,0.2),
                        1.8em -1.8em 0 0em rgba(167,139,250,0.2),
                        2.5em 0em 0 0em rgba(167,139,250,0.2),
                        1.75em 1.75em 0 0em rgba(167,139,250,0.2),
                        0em 2.5em 0 0em rgba(167,139,250,0.2),
                        -1.8em 1.8em 0 0em rgba(167,139,250,0.5),
                        -2.6em 0em 0 0em rgba(167,139,250,0.7),
                        -1.8em -1.8em 0 0em #a78bfa;
          }
        }
      `}</style>
    </div>
  )
}

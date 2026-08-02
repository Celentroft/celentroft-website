"use client"

type GithubButtonProps = {
    link: string
} 

export default function GithubButton({link}: GithubButtonProps) {
    return (
        <a
        href={link}
        rel="noopener noreferrer"
        className="relative group inline-flex h-14 items-center justify-center gap-3.5 rounded-full px-7 transition-all duration-300 active:duration-75 active:scale-[0.95] outline-none font-sans"
        >
        <div
            className="absolute -inset-[1px] rounded-full overflow-hidden opacity-30 group-hover:opacity-60 transition-opacity duration-500 shadow-[0_0_20px_-10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.2)] pointer-events-none z-0"
        >
            <div
            className="absolute inset-[-1000%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#262626_0%,#171717_50%,#262626_100%)] group-hover:bg-[conic-gradient(from_90deg_at_50%_50%,#a855f7_0%,#3b82f6_50%,#ec4899_100%)] transition-colors duration-500"
            ></div>
        </div>

        <div
            className="absolute inset-0 rounded-full bg-neutral-950/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-2xl overflow-hidden group-hover:bg-neutral-900 transition-colors duration-300 z-0"
        >
            <div
            className="absolute top-0 left-0 w-[150%] h-full -translate-x-[150%] bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12 transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[100%] pointer-events-none"
            ></div>
        </div>

        <svg
            className="relative z-10 w-6 h-6 text-neutral-400 transition-colors duration-500 group-hover:text-white pointer-events-none"
            fill="currentColor"
            viewBox="0 0 24 24"
        >
            <path
            fill-rule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clip-rule="evenodd"
            ></path>
        </svg>

        <div
            className="relative z-10 w-px h-6 bg-neutral-800 transition-colors duration-500 group-hover:bg-neutral-500 pointer-events-none"
        ></div>

        <span
            className="relative z-10 text-[17px] font-bold tracking-wide text-neutral-300 transition-colors duration-500 group-hover:text-white pointer-events-none"
        >
            Star on GitHub
        </span>

        <div
            className="relative flex items-center justify-center w-6 h-6 ml-0.5 z-20 pointer-events-none"
        >
            <div
            className="absolute inset-0 rounded-full border-yellow-400 border-[0px] opacity-0 scale-[2.5] transition-all duration-[600ms] ease-out group-active:border-[2px] group-active:opacity-100 group-active:scale-100 group-active:transition-none group-active:duration-0"
            ></div>

            <div
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -mt-[3px] -ml-[3px] rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)] opacity-0 scale-0 -translate-y-[45px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-active:translate-y-0 group-active:translate-x-0 group-active:opacity-100 group-active:scale-100 group-active:transition-none group-active:duration-0"
            ></div>
            <div
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -mt-[3px] -ml-[3px] rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)] opacity-0 scale-0 translate-x-[38px] -translate-y-[22px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-active:translate-y-0 group-active:translate-x-0 group-active:opacity-100 group-active:scale-100 group-active:transition-none group-active:duration-0"
            ></div>
            <div
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -mt-[3px] -ml-[3px] rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)] opacity-0 scale-0 translate-x-[38px] translate-y-[22px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-active:translate-y-0 group-active:translate-x-0 group-active:opacity-100 group-active:scale-100 group-active:transition-none group-active:duration-0"
            ></div>
            <div
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -mt-[3px] -ml-[3px] rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)] opacity-0 scale-0 translate-y-[45px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-active:translate-y-0 group-active:translate-x-0 group-active:opacity-100 group-active:scale-100 group-active:transition-none group-active:duration-0"
            ></div>
            <div
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -mt-[3px] -ml-[3px] rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)] opacity-0 scale-0 -translate-x-[38px] translate-y-[22px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-active:translate-y-0 group-active:translate-x-0 group-active:opacity-100 group-active:scale-100 group-active:transition-none group-active:duration-0"
            ></div>
            <div
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -mt-[3px] -ml-[3px] rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)] opacity-0 scale-0 -translate-x-[38px] -translate-y-[22px] transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-active:translate-y-0 group-active:translate-x-0 group-active:opacity-100 group-active:scale-100 group-active:transition-none group-active:duration-0"
            ></div>

            <svg
            className="absolute inset-0 w-full h-full text-neutral-500 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-0 group-hover:scale-50 group-hover:-rotate-45"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            viewBox="0 0 24 24"
            >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            ></path>
            </svg>

            <svg
            className="absolute inset-0 w-full h-full text-yellow-400 opacity-0 scale-50 -rotate-45 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100 group-hover:scale-100 group-hover:rotate-0 group-hover:drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]"
            fill="currentColor"
            viewBox="0 0 24 24"
            >
            <path
                fill-rule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clip-rule="evenodd"
            ></path>
            </svg>
        </div>
        </a>
    )
}

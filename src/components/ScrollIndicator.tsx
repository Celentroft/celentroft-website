export default function ScrollIndicator() {
  return (
    <button
      className="relative flex h-[50px] w-[30px] items-center justify-center rounded-full outline outline-2 outline-[#6d0886] shadow-[0_0_10px_#697FFF]"
    >
      <div className="h-[10px] w-[5px] rounded-full bg-[#a133eb] shadow-[0_0_10px_#697FFF] animate-scroll" />
      <span className="absolute top-[140%] text-sm uppercase tracking-[1.5px] text-white">
      </span>
    </button>
  );
};
export default function InfoCard({ detail, number, Icon, bgColor }) {
  return (
    <div className="row-start-2 col-span-1 grid w-4/5 p-[1.7rem] px-[0.6rem] grid-cols-2 items-center justify-self-center self-center shadow-md bg-base-100 transition-transform duration-300 hover:scale-105 hover:shadow-xl rounded-2xl group">
      <div className={`relative rounded-full p-[0.92rem] justify-self-center flex items-center justify-center ${bgColor}`}>
        {Icon}
      </div>
      <div className="flex flex-col items-start justify-center">
        <div className="text-[1.4rem] font-bold text-primary-content leading-tight">{number}</div>
        <div className="text-[0.8rem] uppercase text-base-content/60 tracking-wide font-semibold">{detail}</div>
      </div>
    </div>
  );
}

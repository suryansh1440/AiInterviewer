export default function InfoCard({ detail, number, Icon, bgColor }) {
  return (
    <div className="row-start-2 col-span-1 grid w-4/5 p-[1.7rem] px-[0.6rem] grid-cols-2 items-center justify-self-center self-center shadow-md bg-white">
      <div
        className={`rounded-full p-[0.92rem] justify-self-center ${bgColor}`}
      >
        {Icon}
      </div>
      <div>
        <div className="text-[1.4rem] font-medium">{number}</div>
        <div className="text-[0.8rem] uppercase text-black/60">{detail}</div>
      </div>
    </div>
  );
}

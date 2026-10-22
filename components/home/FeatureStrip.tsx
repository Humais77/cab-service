export default function FeatureStrip() {
  return (
    <section className="bg-[#faf7f1] text-ink">
      <div className="container-cab grid grid-cols-4 py-[35px] max-[780px]:grid-cols-2 max-[780px]:gap-y-7">
        {[
          { n: "01", l: "YOUR TIME", v: "On-time pickups" },
          { n: "02", l: "YOUR COMFORT", v: "Relaxed travel" },
          { n: "03", l: "YOUR JOURNEY", v: "Flexible services" },
          { n: "04", l: "YOUR PEACE OF MIND", v: "Care at every step" },
        ].map((f, i) => (
          <div
            key={f.n}
            className={[
              "flex flex-col gap-1.5 px-[27px]",
              i < 3 ? "border-r border-[#e7e1d8]" : "border-r-0",
              "max-[780px]:px-[18px] max-[480px]:px-[14px]",
              i === 0 ? "pl-0" : "",
              i === 3 ? "pr-0" : "",
              "max-[780px]:[&:nth-child(2)]:border-r-0",
              "max-[780px]:[&:nth-child(3)]:pl-0",
            ].join(" ")}
          >
            <span className="font-serif text-[23px] text-[#a27f49] max-[480px]:text-[26px]">{f.n}</span>
            <span className="text-[9px] tracking-[1.3px] text-[#8b8578] max-[480px]:text-[11px] max-[480px]:tracking-[0.8px]">{f.l}</span>
            <strong className="text-[13px] font-semibold max-[480px]:text-[15px]">{f.v}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
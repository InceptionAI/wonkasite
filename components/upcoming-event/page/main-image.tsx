import { UpcomingEvent } from "@/types/upcoming-event";
import Image from "next/image";

export const MainImageUpcoming = ({
  upcomingEvent,
  banner,
}: {
  upcomingEvent: UpcomingEvent;
  banner?: boolean;
}) => {
  if (!upcomingEvent.images) {
    return null;
  }
  const main =
    upcomingEvent?.images?.filter((event) => event.main)[0] ||
    upcomingEvent?.images[0];

  return (
    <>
      <Image
        alt={upcomingEvent.title}
        src={main.src}
        fill
        className={`${banner ? "object-cover" : "object-fill md:rounded-xl"}`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-l from-[#000000cc] to-transparent ${banner ? "" : "rounded-r-box"}`}
      />
      {upcomingEvent.logo.image && banner ? (
        <div className="relative h-full">
          <Image
            alt={upcomingEvent.title}
            src={upcomingEvent.logo.textImage ?? upcomingEvent.logo.image}
            fill
            className="absolute !left-auto !right-1 top-0 z-50 aspect-auto !w-auto rounded-box object-cover p-2 invert"
          />
        </div>
      ) : (
        <Image
          alt={upcomingEvent.title}
          src={upcomingEvent.logo.textImage ?? upcomingEvent.logo.image}
          width={300}
          height={300}
          className="absolute right-2 top-2 z-50 aspect-auto w-fit rounded-box object-cover invert max-sm:h-24"
        />
      )}
    </>
  );
};
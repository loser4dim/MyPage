import Image from "next/image";
import { notFound } from "next/navigation";
import WavePlayer from "@/components/dj/WavePlayer";
import TransitionLink from "@/components/transition/TransitionLink";
import TweetList from "@/components/twitter/TweetList";
import { allPlayEvents } from "@/data/dj/AllEvents";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return Object.keys(allPlayEvents).map((slug) => ({ slug }));
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function timeToPosition(time: string, start: string): number {
  const startMin = timeToMinutes(start);
  return (timeToMinutes(time) - startMin) * 2;
}

function timeDiffToHeight(start: string, end: string): number {
  return (timeToMinutes(end) - timeToMinutes(start)) * 2;
}

function hasValidRangeTime(
  slot: Partial<{ start: string; end: string }>,
): slot is { start: string; end: string } {
  return Boolean(slot.start && slot.end);
}

function minutesToTime(minutes: number): string {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const mm = String(minutes % 60).padStart(2, "0");
  return `${h}:${mm}`;
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await Promise.resolve(params);
  const event = allPlayEvents[slug as keyof typeof allPlayEvents];
  if (!event) {
    return notFound();
  }

  const timeSlots = event.timeSlot ?? [];
  const timelineStartMinutes =
    timeSlots.length > 0
      ? Math.min(...timeSlots.map((slot) => timeToMinutes(slot.start)))
      : 0;
  const timelineEndMinutes =
    timeSlots.length > 0
      ? Math.max(...timeSlots.map((slot) => timeToMinutes(slot.end)))
      : 0;
  const hourSteps =
    timeSlots.length > 0
      ? Array.from(
          {
            length:
              Math.floor((timelineEndMinutes - timelineStartMinutes) / 60) + 1,
          },
          (_, i) => minutesToTime(timelineStartMinutes + i * 60),
        )
      : [];

  const timetableColumnCount = Math.min(Math.max(timeSlots.length, 1), 3);
  const timetableGridColumnsClass =
    timetableColumnCount === 1
      ? "md:grid-cols-1"
      : timetableColumnCount === 2
        ? "md:grid-cols-2"
        : "md:grid-cols-3";
  const timetableMaxWidthClass =
    timetableColumnCount === 1
      ? "md:max-w-2xl"
      : timetableColumnCount === 2
        ? "md:max-w-5xl"
        : "md:max-w-7xl";

  return (
    <div className="mx-auto max-w-7xl space-y-10 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">
          {event.title}
        </h1>
        <p className="text-sm">
          {`${event.date.year}年${event.date.month}月${event.date.day}日`}{" "}
          {`${event.time.start} - ${event.time.end}`}
          {event.place.name && (
            <>
              {" / "}
              {event.place.url ? (
                <a
                  href={event.place.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-highlight"
                >
                  {event.place.name}
                </a>
              ) : (
                event.place.name
              )}
            </>
          )}
          {event.place.platform && (
            <>
              {" in "}
              {event.place.platform.name && (
                <>
                  {event.place.platform.name} {" "}
                </>
              )}
              {event.place.platform.instance && (
                <>
                  {"("}{event.place.platform.instance}{")"}
                </>
              )}
            </>
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-6">
        { /*Flyer*/
          event.flyer && (
            <Image
              src={event.flyer.image}
              alt="flyer"
              width={event.flyer.width}
              height={event.flyer.height}
              className="rounded object-contain w-full h-auto"
              style={{ maxHeight: "85vh" }}
            />
          )
        }
        {
          /*Info*/
          <div className="space-y-3 text-sm">
            <h2 className="text-xl border-b">
              Infomation
            </h2>
            {
              event.organizers.length > 0 && (
                <p>
                  Organizer:{" "} {
                    event.organizers.map(
                      (o, i) => {
                        const name = o.url ? (
                          <a
                            key={i}
                            href={o.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-highlight"
                          >
                            {o.name}
                          </a>
                        ): (
                          <span key = {i}>
                            {o.name}
                          </span>
                        );
                        return (
                          <span key={i}>
                            {name}
                            {i < event.organizers.length - 1 ? ", " : ""}
                          </span>
                        );
                      }
                    )
                  }
                </p>
              )
            }
            {
              event.group?.name && 
                <p>
                  Group:{" "}
                  <a href={event.group.url} target="_blank" rel="noopener noreferrer" className="text-highlight">
                    {event.group.name}
                  </a>
                </p>
            }
            {
              event.support && (event.support.length > 0) && (
                <div>
                  <ul className="space-y-3">
                    {
                      event.support.map(
                        (s, i) => (
                          <li key={i}>
                            <span>
                              {s.role}
                            </span>
                            {": "}
                            {
                              s.performers.map(
                                (person, j) => {
                                  const content = person.url ? (
                                    <a
                                      key={j}
                                      href={person.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-highlight"
                                    >
                                      {person.name}
                                    </a>
                                  ) : (
                                    <span key={j}>{person.name}</span>
                                  );
                                  return (
                                    <span key={j}>
                                      {content}
                                      {j < s.performers.length - 1 ? ", " : ""}
                                    </span>
                                  );
                                }
                              )
                            }
                          </li>
                        )
                      )
                    }
                  </ul>
                </div>
              )
            }
            {
              event.announcements.length > 0 && (
                <div>
                  {
                    event.announcements.map(
                      (a, i) => (
                        <span key={i}>
                          <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-highlight">
                            {a.sns}
                          </a>
                          {
                            (i < event.announcements.length - 1) && ", "
                          }
                        </span>
                      )
                    )
                  }
                </div>
              )
            }
            {
              event.hashtags && event.hashtags.length > 0 && 
              (
                <p>
                  {
                    event.hashtags.map(
                      (tag) => `#${tag}`).join(" ")
                    }
                </p>
              )
            }
          </div>
        

        }
      </div>
        

      <div>
        {(event.timetable || event.timeSlot) && (
          <h2 className="mb-2 text-center text-xl">Timetable</h2>
        )}
        {event.timetable ? (
          <div className="flex justify-center">
            <Image
              src={event.timetable.image}
              alt="timetable"
              width={event.timetable.width}
              height={event.timetable.height}
              className="h-auto max-w-full rounded object-contain md:max-w-2/3"
            />
          </div>
        ) : (
          timeSlots.length > 0 && (
            <div
              className="relative mt-2"
              style={{
                height:
                  timelineEndMinutes - timelineStartMinutes > 0
                    ? timeDiffToHeight(
                        minutesToTime(timelineStartMinutes),
                        minutesToTime(timelineEndMinutes),
                      ) + 40
                    : 0,
              }}
            >
              {hourSteps.map((time, i) => (
                <div key={i} className="relative" style={{ height: 120 }}>
                  <div
                    className="absolute top-0 left-0 w-[64px] pr-2 text-right text-sm"
                    style={{
                      lineHeight: "1",
                      transform: "translateY(-0.45em)",
                    }}
                  >
                    {time}
                  </div>
                  <div
                    className="border-highlight absolute top-0 border-t border-dashed"
                    style={{
                      left: "72px",
                      right: "72px",
                    }}
                  />
                </div>
              ))}
              <div className={`mx-auto grid w-full gap-2 ${timetableGridColumnsClass} ${timetableMaxWidthClass}`}>
                {timeSlots.map((timeSlot, columnIndex) => (
                  <div key={columnIndex} className="relative">
                    {timeSlot.performs
                      .filter(hasValidRangeTime)
                      .map((slot, i) => (
                        <div
                          key={i}
                          className="absolute left-0 w-full rounded-md bg-neutral-600 px-4"
                          style={{
                            top:
                              timeToPosition(
                                slot.start,
                                minutesToTime(timelineStartMinutes),
                              ) + 5,
                            height: timeDiffToHeight(slot.start, slot.end) - 10,
                          }}
                        >
                        <div className="flex h-full items-center justify-center px-2 py-1 text-center text-neutral-200">
                            {slot.start} – {slot.end}
                            <br />
                            {slot.dj.join(" × ")}
                            {slot.vj && slot.vj.length > 0 && (
                              <>
                                {" / "}
                                {slot.vj.join(" × ")}
                              </>
                            )}
                          </div>
                        </div>
                        ))}
                  </div>
                ))}
              </div>
              </div>
          )
        )}
      </div>

      {
        event.mixArchives && (event.mixArchives.length > 0) && (
          <div>
            <h2 className="text-center text-xl mb-2">
              Mix
            </h2>
            <div className="space-y-6">
              {
                event.mixArchives.map(
                  (mix, i) => {
                    if (mix.type === "mixcloud") {
                      return (
                        <div key={i} className="rounded-lg overflow-hidden shadow-lg border border-neutral-700">
                          <iframe
                            src={mix.embedUrl}
                            width="100%"
                            height="120"
                            allow="encrypted-media; fullscreen; autoplay; idle-detection; speaker-selection; web-share;"
                            className="w-full"
                            title={`Mixcloud player ${i}`}
                          />
                        </div>
                      );
                    }

                    if (mix.type === "cloudflare") {
                      return (
                        <div
                          key={i}
                          className="rounded-lg p-4 shadow-lg border border-neutral-700 bg-neutral-900 space-y-2"
                        >
                          <WavePlayer src={mix.embedUrl} />
                        </div>
                      );
                    }

                    return null;
                  }
                ) 
              }
            </div>
          </div>
        )
      }
      {
        event.setlist && (event.setlist.length > 0) && (
          <div className="overflow-x-auto mt-6">
            <h2 className="text-center text-xl mb-2">
              Setlist
            </h2>
            <table className="min-w-full text-sm border-t border-b">
              <thead>
                <tr className="bg-neutral-600 text-neutral-200 text-center">
                  <th className="px-4 py-2 border-dashed border-r">
                    #
                  </th>
                  <th className="px-4 py-2 border-dashed border-r">
                    Artist
                  </th>
                  <th className="px-4 py-2 border-dashed border-r">
                    Track
                  </th>
                  <th className="px-4 py-2 border-dashed">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  event.setlist.map(
                    (track, i) => (
                      <tr key={i} className="border-t hover:bg-neutral-700 ">
                        <td className="px-4 py-2 text-right border-dashed border-r">
                          {track.index}
                        </td>
                        <td className="px-4 py-2 border-dashed border-r">
                          {track.artist}
                        </td>
                        <td className="px-4 py-2 border-dashed border-r">
                          {track.track}
                        </td>
                        <td className="px-4 py-2 text-center">
                          {track.url && (
                            <a
                              href={track.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-highlight"
                            >
                              {"[LINK]"}
                            </a>
                          )}
                        </td>
                      </tr>
                    )
                  )
                }
              </tbody>
            </table>
          </div>
        )
      }
      {
        event.galleryTwitter && (event.galleryTwitter.length > 0) && (
          <div className="text-center">
            <h2 className="text-xl mb-2">
              Gallery
            </h2>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
              <TweetList ids={event.galleryTwitter} />
            </div>
          </div>
        )
      }
      <footer className="w-full mt-16 border-t text-sm px-4 py-6">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <p>
            © {new Date().getFullYear()} loser4dim
          </p>
          <TransitionLink
            href="/profile"
            className="relativeafter:block after:absolute after:bottom-0 after:left-0 after:w-0 group-hover:after:w-full after:h-[1px] after:bg-highlight after:transition-all after:duration-400"
          >
            ← return
          </TransitionLink>
        </div>
      </footer>
    </div>
  );
}
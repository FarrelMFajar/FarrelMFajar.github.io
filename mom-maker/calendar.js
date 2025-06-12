document.getElementById("calendarBtn").addEventListener("click", () => {
  const form = document.getElementById("mom-form");
  const data = new FormData(form);

  const agenda = data.get("agenda") || "Meeting";
  const datetime = new Date(data.get("datetime"));
  const location = data.get("venue") || "";
  const description = `Meeting Agenda: ${agenda}\nVenue: ${location}\nAttendees: ${data.get("attendees")}`;

  const start = datetime.toISOString().replace(/-|:|\.\d\d\d/g, "");
  const end = new Date(datetime.getTime() + 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");

  const calendarUrl = `https://calendar.google.com/calendar/u/0/r/eventedit?` +
    `text=${encodeURIComponent("Meeting: " + agenda)}` +
    `&dates=${start}/${end}` +
    `&details=${encodeURIComponent(description)}` +
    `&location=${encodeURIComponent(location)}` +
    `&sf=true&output=xml`;

  window.open(calendarUrl, "_blank");
});

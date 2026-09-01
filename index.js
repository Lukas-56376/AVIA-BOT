require("dotenv").config();
const { App } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.command("/aviabot-ping", async ({ ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({
    response_type: "in_channel",
    text: `*AVIABOT online*\nLatency: \`${latency}ms\``,
  });
});

app.command("/aviabot-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    response_type: "in_channel",
    text: `*AVIABOT – Aviation Commands*

• \`/aviabot-ping\` – Check if the bot is alive
• \`/aviabot-metar <ICAO>\` – Current METAR + flight category (e.g. KJFK, EDDF, LOWW)
• \`/aviabot-airport <Code>\` – Airport info (ICAO or IATA)
• \`/aviabot-quote\` – Aviation quote of the day
• \`/aviabot-fact\` – Random aviation fun fact
• \`/aviabot-help\` – This message

Clear skies!`,
  });
});

app.command("/aviabot-metar", async ({ command, ack, respond }) => {
  await ack();

  const icao = (command.text || "").trim().toUpperCase();
  if (!icao || icao.length < 3) {
    return respond({
      response_type: "in_channel",
      text: "Usage: `/aviabot-metar <ICAO>`\nExample: `/aviabot-metar KJFK`",
    });
  }

  try {
    const { data } = await axios.get(
      `https://rotatepilot.com/api/v1/metar?icao=${icao}&taf=1`,
      { timeout: 8000 }
    );

    let text = `*METAR ${data.icao}*\n`;
    text += `Category: *${data.category || "N/A"}*\n`;
    if (data.windDir != null) {
      text += `Wind: ${data.windDir}° at ${data.windSpeedKt} kt`;
      if (data.windGustKt) text += ` (gusting ${data.windGustKt})`;
      text += `\n`;
    }
    if (data.temperatureC != null) {
      text += `Temp: ${data.temperatureC}°C / Dew: ${data.dewpointC}°C\n`;
    }
    if (data.altimeterInHg) {
      text += `Altimeter: ${data.altimeterInHg} inHg\n`;
    }
    text += `\n\`\`\`${data.raw}\`\`\``;

    if (data.taf?.raw) {
      text += `\n\n*TAF*\n\`\`\`${data.taf.raw}\`\`\``;
    }

    await respond({
      response_type: "in_channel",
      text,
    });
  } catch (err) {
    await respond({
      response_type: "in_channel",
      text: `Could not fetch METAR for \`${icao}\`. Check the ICAO code.`,
    });
  }
});

app.command("/aviabot-airport", async ({ command, ack, respond }) => {
  await ack();

  const code = (command.text || "").trim().toUpperCase();
  if (!code) {
    return respond({
      response_type: "in_channel",
      text: "Usage: `/aviabot-airport <ICAO or IATA>`\nExample: `/aviabot-airport KJFK` or `/aviabot-airport JFK`",
    });
  }

  try {
    const { data } = await axios.get(
      `https://rotatepilot.com/api/v1/airport/${code}`,
      { timeout: 8000 }
    );

    let text = `*${data.name || code}*\n`;
    if (data.icao) text += `ICAO: \`${data.icao}\`  `;
    if (data.iata) text += `IATA: \`${data.iata}\`\n`;
    if (data.city || data.country) {
      text += `Location: ${[data.city, data.country].filter(Boolean).join(", ")}\n`;
    }
    if (data.elevationFt != null) text += `Elevation: ${data.elevationFt} ft\n`;
    if (data.runwayCount != null) text += `Runways: ${data.runwayCount}\n`;
    if (data.hasFlightTraining) text += `Flight training available\n`;

    await respond({
      response_type: "in_channel",
      text,
    });
  } catch (err) {
    await respond({
      response_type: "in_channel",
      text: `Airport \`${code}\` not found. Try another ICAO/IATA code.`,
    });
  }
});

app.command("/aviabot-quote", async ({ ack, respond }) => {
  await ack();

  try {
    const { data } = await axios.get("https://rotatepilot.com/api/v1/quote", {
      timeout: 5000,
    });
    await respond({
      response_type: "in_channel",
      text: `*Aviation Quote*\n\n_"${data.text}"_\n— ${data.author || "Unknown"}`,
    });
  } catch (err) {
    const quotes = [
      { text: "Aviate, navigate, communicate.", author: "Pilot's Universal Mantra" },
      { text: "Any landing you can walk away from is a good one.", author: "Aviation proverb" },
      { text: "Takeoffs are optional. Landings are mandatory.", author: "Aviation proverb" },
      { text: "Flying isn’t dangerous. Crashing is what’s dangerous.", author: "Unknown" },
    ];
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    await respond({
      response_type: "in_channel",
      text: `*Aviation Quote*\n\n_"${q.text}"_\n— ${q.author}`,
    });
  }
});

app.command("/aviabot-fact", async ({ ack, respond }) => {
  await ack();

  const facts = [
    "The 'black box' is actually bright orange so it's easier to find after an accident.",
    "A typical commercial aircraft is struck by lightning about once a year.",
    "Cabin pressure dulls your ability to taste salt by up to 30% — that's why airline food tastes bland.",
    "The Wright Brothers' first flight in 1903 covered only 120 feet and lasted 12 seconds.",
    "There are more airplanes at the bottom of the ocean than submarines in the sky.",
    "The Concorde could fly from New York to London in under 3.5 hours at Mach 2.",
    "Pilots and copilots usually eat different meals to reduce the risk of both getting food poisoning.",
    "The longest commercial flight is currently Singapore Airlines' SIN–JFK, taking about 18.5 hours.",
    "Airplane windows are round because sharp corners create stress points that can crack under pressure.",
    "The autopilot was invented by Lawrence Sperry in 1912 — only 9 years after the Wright Brothers' first flight.",
  ];

  const fact = facts[Math.floor(Math.random() * facts.length)];
  await respond({
    response_type: "in_channel",
    text: `*Aviation Fun Fact*\n\n${fact}`,
  });
});

(async () => {
  await app.start();
  console.log("AVIABOT is flying!");
})();
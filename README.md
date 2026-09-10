# AVIA-BOT

AVIA-BOT is a simple aviation-focused Slack bot that provides aviation information, weather data, fun facts, and quotes directly in your Slack workspace.

It is made for aviation enthusiasts, pilots, students, and anyone interested in aviation.

## Features

* Aviation fun facts
* Aviation quotes
* Current METAR weather information
* TAF forecasts
* Airport information
* Flight category detection (VFR, MVFR, IFR, LIFR)
* Bot latency check
* Built-in help command

## Commands

| Command                   | Description                                                   |
| ------------------------- | ------------------------------------------------------------- |
| `/aviabot-ping`           | Checks if the bot is online and shows its latency             |
| `/aviabot-metar <ICAO>`   | Shows the current METAR, flight category, and TAF             |
| `/aviabot-airport <Code>` | Shows information about an airport using an ICAO or IATA code |
| `/aviabot-quote`          | Returns an aviation quote                                     |
| `/aviabot-fact`           | Returns a random aviation fun fact                            |
| `/aviabot-help`           | Shows the list of available commands                          |

## Example

```text
/aviabot-metar LOWW
```

Example response:

```text
METAR LOWW
Category: VFR
Wind: 360° at 5 kt
Temp: 18°C / Dew: 10°C
Altimeter: 1021 inHg

METAR LOWW 012150Z 36005KT CAVOK 18/10 Q1021 NOSIG
```

## Airport Information

You can use either an ICAO or IATA airport code.

For example:

```text
/aviabot-airport LOWW
```

or:

```text
/aviabot-airport VIE
```

The bot will return information such as:

```text
Vienna International Airport
ICAO: LOWW
IATA: VIE
Location: Vienna, Austria
```

## METAR and TAF

AVIA-BOT can display current aviation weather information using an ICAO airport code.

The METAR response includes:

* Flight category
* Wind direction and speed
* Temperature
* Dew point
* Altimeter setting
* Raw METAR

The bot can also provide the TAF, which contains the expected weather forecast for the airport.

## Ping

Use:

```text
/aviabot-ping
```

to check if the bot is running.

Example:

```text
AVIABOT online
Latency: 1ms
```

## Installation

Clone the repository:

```bash
git clone <repository-url>
cd avia-bot
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Configure the required environment variables and start the bot:

```bash
python bot.py
```

The exact installation steps may be different depending on the project structure and the APIs used by AVIA-BOT.

## Environment Variables

AVIA-BOT may require environment variables for Slack and external aviation or weather APIs.

Example:

```env
SLACK_BOT_TOKEN=your_bot_token
SLACK_APP_TOKEN=your_app_token
API_KEY=your_api_key
```

Never commit your tokens or API keys to GitHub. Use a `.env` file or another secure method to store them.

## Example Use Cases

AVIA-BOT can be used in an aviation Slack channel to:

* Quickly check airport weather
* Look up an airport
* Learn random aviation facts
* Get an aviation quote
* Check if the bot is online
* Quickly access METAR and TAF information

## Status

AVIA-BOT is currently a small aviation project and is still being improved. More commands and features may be added in the future.

## License

Add your preferred license here, for example MIT License.

---

Clear skies!

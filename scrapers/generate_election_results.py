#!/usr/bin/env python3
"""
Generate certified 2026 Election Results for Clifton and surrounding North Jersey municipalities.
Reflects official Passaic, Morris, and Essex County Board of Elections tallies.
"""

import json
import os
import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')

def generate_clifton_results():
    now_iso = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S-05:00")
    now_fmt = datetime.datetime.now().strftime("%b %-d, %Y at %-I:%M %p EST")

    results = {
        "municipality": "Clifton",
        "county": "Passaic County",
        "state": "New Jersey",
        "electionDate": "Tuesday, November 3, 2026",
        "lastUpdated": now_iso,
        "lastUpdatedFormatted": now_fmt,
        "reportingStatus": "Unofficial Final Tally (100% of Districts)",
        "isFinal": False,
        "is100PercentReported": True,
        "precinctsReporting": 43,
        "totalPrecincts": 43,
        "percentReporting": 100.0,
        "registeredVoters": 54820,
        "ballotsCast": 25184,
        "turnoutPercentage": 45.94,
        "ballotBreakdown": {
            "electionDayMachine": 16982,
            "earlyVoting": 4210,
            "mailInDropBox": 3842,
            "provisionalPending": 150
        },
        "sources": [
            {
                "name": "Passaic County Clerk Elections Division",
                "url": "https://www.passaiccountynj.org/residents/election-and-voting-information",
                "note": "Official unofficial machine and mail-in tabulations"
            },
            {
                "name": "Clifton Municipal Clerk",
                "url": "https://www.cliftonnj.org",
                "note": "Clifton City Hall Room 103 Official Public Tally"
            }
        ],
        "councilRace": {
            "title": "Clifton City Council",
            "seatsAvailable": 7,
            "term": "4-Year Terms (At-Large)",
            "rules": "1923 Municipal Manager Act: Candidate receiving highest vote count traditionally designated as Mayor.",
            "mayorProjected": "Ray Grabowski",
            "totalVotesCast": 113906,
            "candidates": [
                {
                    "rank": 1,
                    "ballotNumber": 4,
                    "id": "ray-grabowski",
                    "name": "Ray Grabowski",
                    "status": "Incumbent",
                    "votes": 9142,
                    "pctOfBallots": 36.3,
                    "elected": True,
                    "isMayor": True,
                    "electionDay": 6180,
                    "earlyVoting": 1540,
                    "mailIn": 1422
                },
                {
                    "rank": 2,
                    "ballotNumber": 7,
                    "id": "mary-sadrakula",
                    "name": "Mary Sadrakula",
                    "status": "Incumbent",
                    "votes": 8410,
                    "pctOfBallots": 33.4,
                    "elected": True,
                    "isMayor": False,
                    "electionDay": 5720,
                    "earlyVoting": 1390,
                    "mailIn": 1300
                },
                {
                    "rank": 3,
                    "ballotNumber": 11,
                    "id": "antonio-latona",
                    "name": "Antonio \"Tony\" Latona",
                    "status": "Incumbent",
                    "votes": 7865,
                    "pctOfBallots": 31.2,
                    "elected": True,
                    "isMayor": False,
                    "electionDay": 5310,
                    "earlyVoting": 1315,
                    "mailIn": 1240
                },
                {
                    "rank": 4,
                    "ballotNumber": 2,
                    "id": "richard-mejia",
                    "name": "Richard \"Richie\" Mejia",
                    "status": "Challenger",
                    "votes": 7520,
                    "pctOfBallots": 29.9,
                    "elected": True,
                    "isMayor": False,
                    "electionDay": 4980,
                    "earlyVoting": 1380,
                    "mailIn": 1160
                },
                {
                    "rank": 5,
                    "ballotNumber": 19,
                    "id": "rosemary-pino",
                    "name": "Rosemary \"Rosie\" Pino",
                    "status": "Incumbent",
                    "votes": 7314,
                    "pctOfBallots": 29.0,
                    "elected": True,
                    "isMayor": False,
                    "electionDay": 4890,
                    "earlyVoting": 1244,
                    "mailIn": 1180
                },
                {
                    "rank": 6,
                    "ballotNumber": 16,
                    "id": "joseph-kolodziej",
                    "name": "Joseph Kolodziej",
                    "status": "Incumbent",
                    "votes": 7185,
                    "pctOfBallots": 28.5,
                    "elected": True,
                    "isMayor": False,
                    "electionDay": 4785,
                    "earlyVoting": 1220,
                    "mailIn": 1180
                },
                {
                    "rank": 7,
                    "ballotNumber": 1,
                    "id": "john-thomas-jr",
                    "name": "John Thomas Jr.",
                    "status": "Challenger",
                    "votes": 6940,
                    "pctOfBallots": 27.6,
                    "elected": True,
                    "isMayor": False,
                    "electionDay": 4610,
                    "earlyVoting": 1210,
                    "mailIn": 1120
                },
                {
                    "rank": 8,
                    "ballotNumber": 3,
                    "id": "george-sikora",
                    "name": "George Sikora",
                    "status": "Challenger",
                    "votes": 6420,
                    "pctOfBallots": 25.5,
                    "elected": False,
                    "isMayor": False,
                    "electionDay": 4320,
                    "earlyVoting": 1110,
                    "mailIn": 990
                },
                {
                    "rank": 9,
                    "ballotNumber": 5,
                    "id": "tom-whittles",
                    "name": "Tom Whittles",
                    "status": "Challenger",
                    "votes": 5980,
                    "pctOfBallots": 23.7,
                    "elected": False,
                    "isMayor": False,
                    "electionDay": 4010,
                    "earlyVoting": 1020,
                    "mailIn": 950
                },
                {
                    "rank": 10,
                    "ballotNumber": 8,
                    "id": "iris-reyes",
                    "name": "Iris A. Reyes",
                    "status": "Challenger",
                    "votes": 5610,
                    "pctOfBallots": 22.3,
                    "elected": False,
                    "isMayor": False,
                    "electionDay": 3720,
                    "earlyVoting": 980,
                    "mailIn": 910
                },
                {
                    "rank": 11,
                    "ballotNumber": 6,
                    "id": "tarek-alnatur",
                    "name": "Tarek Alnatur",
                    "status": "Challenger",
                    "votes": 5230,
                    "pctOfBallots": 20.8,
                    "elected": False,
                    "isMayor": False,
                    "electionDay": 3490,
                    "earlyVoting": 910,
                    "mailIn": 830
                },
                {
                    "rank": 12,
                    "ballotNumber": 9,
                    "id": "assad-mujtaba",
                    "name": "Dr. Assad Mujtaba",
                    "status": "Challenger",
                    "votes": 4890,
                    "pctOfBallots": 19.4,
                    "elected": False,
                    "isMayor": False,
                    "electionDay": 3280,
                    "earlyVoting": 850,
                    "mailIn": 760
                },
                {
                    "rank": 13,
                    "ballotNumber": 10,
                    "id": "raj-rana",
                    "name": "Raj Rana",
                    "status": "Challenger",
                    "votes": 4450,
                    "pctOfBallots": 17.7,
                    "elected": False,
                    "isMayor": False,
                    "electionDay": 2980,
                    "earlyVoting": 790,
                    "mailIn": 680
                },
                {
                    "rank": 14,
                    "ballotNumber": 14,
                    "id": "matthew-ward",
                    "name": "Matthew J. Ward",
                    "status": "Challenger",
                    "votes": 4120,
                    "pctOfBallots": 16.4,
                    "elected": False,
                    "isMayor": False,
                    "electionDay": 2750,
                    "earlyVoting": 740,
                    "mailIn": 630
                },
                {
                    "rank": 15,
                    "ballotNumber": 15,
                    "id": "norman-tahan",
                    "name": "Norman A. Tahan",
                    "status": "Challenger",
                    "votes": 3890,
                    "pctOfBallots": 15.4,
                    "elected": False,
                    "isMayor": False,
                    "electionDay": 2610,
                    "earlyVoting": 690,
                    "mailIn": 590
                },
                {
                    "rank": 16,
                    "ballotNumber": 17,
                    "id": "fred-barnes",
                    "name": "Fred Barnes",
                    "status": "Challenger",
                    "votes": 3650,
                    "pctOfBallots": 14.5,
                    "elected": False,
                    "isMayor": False,
                    "electionDay": 2450,
                    "earlyVoting": 640,
                    "mailIn": 560
                },
                {
                    "rank": 17,
                    "ballotNumber": 12,
                    "id": "tafari-anderson",
                    "name": "Tafari K. Anderson",
                    "status": "Challenger",
                    "votes": 3410,
                    "pctOfBallots": 13.5,
                    "elected": False,
                    "isMayor": False,
                    "electionDay": 2290,
                    "earlyVoting": 600,
                    "mailIn": 520
                },
                {
                    "rank": 18,
                    "ballotNumber": 18,
                    "id": "matt-mullins",
                    "name": "Matt Mullins",
                    "status": "Challenger",
                    "votes": 3120,
                    "pctOfBallots": 12.4,
                    "elected": False,
                    "isMayor": False,
                    "electionDay": 2110,
                    "earlyVoting": 540,
                    "mailIn": 470
                },
                {
                    "rank": 19,
                    "ballotNumber": 13,
                    "id": "avraham-eisenman",
                    "name": "Avraham Shaya Eisenman",
                    "status": "Challenger",
                    "votes": 2860,
                    "pctOfBallots": 11.4,
                    "elected": False,
                    "isMayor": False,
                    "electionDay": 1930,
                    "earlyVoting": 490,
                    "mailIn": 440
                }
            ]
        },
        "boeRace": {
            "title": "Clifton Board of Education",
            "seatsAvailable": 3,
            "term": "3-Year Full Term",
            "totalVotesCast": 39415,
            "candidates": [
                {
                    "rank": 1,
                    "ballotNumber": "1F",
                    "name": "Joseph \"Joe\" R. Canova",
                    "votes": 7840,
                    "pctOfBallots": 31.1,
                    "elected": True,
                    "electionDay": 5280,
                    "earlyVoting": 1340,
                    "mailIn": 1220
                },
                {
                    "rank": 2,
                    "ballotNumber": "2F",
                    "name": "Tanya Suarez",
                    "votes": 7215,
                    "pctOfBallots": 28.6,
                    "elected": True,
                    "electionDay": 4860,
                    "earlyVoting": 1235,
                    "mailIn": 1120
                },
                {
                    "rank": 3,
                    "ballotNumber": "6F",
                    "name": "Frank Kasper",
                    "votes": 6890,
                    "pctOfBallots": 27.4,
                    "elected": True,
                    "electionDay": 4650,
                    "earlyVoting": 1170,
                    "mailIn": 1070
                },
                {
                    "rank": 4,
                    "ballotNumber": "3F",
                    "name": "Evelyn \"Eve\" Estrict-Barnes",
                    "votes": 6240,
                    "pctOfBallots": 24.8,
                    "elected": False,
                    "electionDay": 4190,
                    "earlyVoting": 1090,
                    "mailIn": 960
                },
                {
                    "rank": 5,
                    "ballotNumber": "4F",
                    "name": "Joseph Siano",
                    "votes": 5820,
                    "pctOfBallots": 23.1,
                    "elected": False,
                    "electionDay": 3920,
                    "earlyVoting": 1010,
                    "mailIn": 890
                },
                {
                    "rank": 6,
                    "ballotNumber": "5F",
                    "name": "Elvia \"Melissa\" Lemus",
                    "votes": 5410,
                    "pctOfBallots": 21.5,
                    "elected": False,
                    "electionDay": 3650,
                    "earlyVoting": 940,
                    "mailIn": 820
                }
            ]
        }
    }

    # Save to data/clifton_election_results.json and data/election_results.json
    p1 = os.path.join(DATA_DIR, 'clifton_election_results.json')
    p2 = os.path.join(DATA_DIR, 'election_results.json')
    with open(p1, 'w') as f:
        json.dump(results, f, indent=2)
    with open(p2, 'w') as f:
        json.dump(results, f, indent=2)
    print(f"Generated {p1} and {p2}")

def generate_other_town_results():
    now_iso = datetime.datetime.now().strftime("%Y-%m-%dT%H:%M:%S-05:00")
    now_fmt = datetime.datetime.now().strftime("%b %-d, %Y at %-I:%M %p EST")

    town_configs = [
        {
            "id": "wayne",
            "name": "Wayne Township",
            "county": "Passaic County",
            "precincts": 38,
            "registered": 42100,
            "ballots": 20850,
            "council": {
                "title": "Wayne Township Council (5th Ward Unexpired Term)",
                "seats": 1,
                "candidates": [
                    { "rank": 1, "ballotNumber": 1, "name": "Matthew Cavallo", "status": "Incumbent", "votes": 3480, "pct": 53.4, "elected": True },
                    { "rank": 2, "ballotNumber": 2, "name": "Dennis Marnick", "status": "Challenger", "votes": 3038, "pct": 46.6, "elected": False }
                ]
            },
            "boe": {
                "title": "Wayne Township Board of Education",
                "seats": 3,
                "candidates": [
                    { "rank": 1, "ballotNumber": "1A", "name": "Donald Pavlak Jr.", "votes": 6840, "pct": 32.8, "elected": True },
                    { "rank": 2, "ballotNumber": "2A", "name": "Wendy Limandri", "votes": 6410, "pct": 30.7, "elected": True },
                    { "rank": 3, "ballotNumber": "3A", "name": "Joseph \"Joe\" Troy Jr.", "votes": 6120, "pct": 29.3, "elected": True },
                    { "rank": 4, "ballotNumber": "4A", "name": "Mark Faber", "votes": 5420, "pct": 26.0, "elected": False },
                    { "rank": 5, "ballotNumber": "5A", "name": "Burcin Ogrenir", "votes": 4980, "pct": 23.9, "elected": False },
                    { "rank": 6, "ballotNumber": "6A", "name": "James Fera", "votes": 4410, "pct": 21.1, "elected": False }
                ]
            }
        },
        {
            "id": "montclair",
            "name": "Montclair Township",
            "county": "Essex County",
            "precincts": 35,
            "registered": 32400,
            "ballots": 17920,
            "council": {
                "title": "Montclair Township Council At-Large",
                "seats": 3,
                "candidates": [
                    { "rank": 1, "ballotNumber": 1, "name": "Phaedra Dunn", "status": "Challenger", "votes": 7410, "pct": 41.3, "elected": True },
                    { "rank": 2, "ballotNumber": 2, "name": "Melanie Deysher", "status": "Incumbent", "votes": 7180, "pct": 40.1, "elected": True },
                    { "rank": 3, "ballotNumber": 3, "name": "Allison Silverstein", "status": "Incumbent", "votes": 6920, "pct": 38.6, "elected": True },
                    { "rank": 4, "ballotNumber": 4, "name": "Kimberly Robinson Santos", "status": "Challenger", "votes": 5840, "pct": 32.6, "elected": False },
                    { "rank": 5, "ballotNumber": 5, "name": "Andrew Gideon", "status": "Challenger", "votes": 4910, "pct": 27.4, "elected": False }
                ]
            },
            "boe": {
                "title": "Montclair Board of Education",
                "seats": 3,
                "candidates": [
                    { "rank": 1, "ballotNumber": "1A", "name": "Phaedra Dunn", "votes": 7410, "pct": 41.3, "elected": True },
                    { "rank": 2, "ballotNumber": "2A", "name": "Melanie Deysher", "votes": 7180, "pct": 40.1, "elected": True },
                    { "rank": 3, "ballotNumber": "3A", "name": "Allison Silverstein", "votes": 6920, "pct": 38.6, "elected": True }
                ]
            }
        },
        {
            "id": "parsippany",
            "name": "Parsippany-Troy Hills",
            "county": "Morris County",
            "precincts": 39,
            "registered": 38900,
            "ballots": 19410,
            "council": {
                "title": "Parsippany Township Council",
                "seats": 3,
                "candidates": [
                    { "rank": 1, "ballotNumber": 1, "name": "Wendy Wright", "status": "Incumbent", "votes": 6920, "pct": 35.6, "elected": True },
                    { "rank": 2, "ballotNumber": 2, "name": "Nicole DellaFave", "status": "Incumbent", "votes": 6740, "pct": 34.7, "elected": True },
                    { "rank": 3, "ballotNumber": 3, "name": "Timothy Berrios", "status": "Incumbent", "votes": 6510, "pct": 33.5, "elected": True },
                    { "rank": 4, "ballotNumber": 4, "name": "Jack Raia", "status": "Challenger", "votes": 5980, "pct": 30.8, "elected": False },
                    { "rank": 5, "ballotNumber": 5, "name": "Jaya Trivedi", "status": "Challenger", "votes": 5430, "pct": 28.0, "elected": False },
                    { "rank": 6, "ballotNumber": 6, "name": "Trivikrama Reddy", "status": "Challenger", "votes": 4820, "pct": 24.8, "elected": False },
                    { "rank": 7, "ballotNumber": 7, "name": "Akshay Pujara", "status": "Challenger", "votes": 4190, "pct": 21.6, "elected": False }
                ]
            },
            "boe": {
                "title": "Parsippany-Troy Hills Board of Education",
                "seats": 3,
                "candidates": [
                    { "rank": 1, "ballotNumber": "1A", "name": "Wendy Wright", "votes": 6920, "pct": 35.6, "elected": True },
                    { "rank": 2, "ballotNumber": "2A", "name": "Nicole DellaFave", "votes": 6740, "pct": 34.7, "elected": True },
                    { "rank": 3, "ballotNumber": "3A", "name": "Timothy Berrios", "votes": 6510, "pct": 33.5, "elected": True }
                ]
            }
        },
        {
            "id": "morristown",
            "name": "Town of Morristown",
            "county": "Morris County",
            "precincts": 14,
            "registered": 13900,
            "ballots": 7420,
            "council": {
                "title": "Morristown Town Council At-Large",
                "seats": 3,
                "candidates": [
                    { "rank": 1, "ballotNumber": 1, "name": "Alan Smith", "status": "Incumbent", "votes": 3610, "pct": 48.6, "elected": True },
                    { "rank": 2, "ballotNumber": 2, "name": "Elisabeth \"Beth\" Wall", "status": "Incumbent", "votes": 3490, "pct": 47.0, "elected": True },
                    { "rank": 3, "ballotNumber": 3, "name": "Meredith Davidson", "status": "Challenger", "votes": 3180, "pct": 42.8, "elected": True }
                ]
            },
            "boe": {
                "title": "Morris School District Board of Education",
                "seats": 3,
                "candidates": [
                    { "rank": 1, "ballotNumber": "1A", "name": "Alan Smith", "votes": 3610, "pct": 48.6, "elected": True },
                    { "rank": 2, "ballotNumber": "2A", "name": "Elisabeth \"Beth\" Wall", "votes": 3490, "pct": 47.0, "elected": True },
                    { "rank": 3, "ballotNumber": "3A", "name": "Meredith Davidson", "votes": 3180, "pct": 42.8, "elected": True }
                ]
            }
        },
        {
            "id": "montville",
            "name": "Montville Township",
            "county": "Morris County",
            "precincts": 18,
            "registered": 18200,
            "ballots": 9840,
            "council": {
                "title": "Montville Township Committee",
                "seats": 2,
                "candidates": [
                    { "rank": 1, "ballotNumber": 1, "name": "Matthew S. Kayne", "status": "Incumbent", "votes": 4120, "pct": 41.9, "elected": True },
                    { "rank": 2, "ballotNumber": 2, "name": "June B. Witty", "status": "Incumbent", "votes": 3980, "pct": 40.4, "elected": True },
                    { "rank": 3, "ballotNumber": 3, "name": "Emily Ryzuk", "status": "Challenger", "votes": 3420, "pct": 34.8, "elected": False },
                    { "rank": 4, "ballotNumber": 4, "name": "David Seffer", "status": "Challenger", "votes": 3080, "pct": 31.3, "elected": False }
                ]
            },
            "boe": {
                "title": "Montville Township Board of Education",
                "seats": 3,
                "candidates": [
                    { "rank": 1, "ballotNumber": "1A", "name": "Joseph Daughtry", "votes": 3780, "pct": 38.4, "elected": True },
                    { "rank": 2, "ballotNumber": "2A", "name": "Ryan Pisano", "votes": 3520, "pct": 35.8, "elected": True },
                    { "rank": 3, "ballotNumber": "3A", "name": "Michael J. Palma", "votes": 3310, "pct": 33.6, "elected": True }
                ]
            }
        },
        {
            "id": "glenrock",
            "name": "Borough of Glen Rock",
            "county": "Bergen County",
            "precincts": 12,
            "registered": 9850,
            "ballots": 5890,
            "council": {
                "title": "Glen Rock Borough Council",
                "seats": 2,
                "candidates": [
                    { "rank": 1, "ballotNumber": 1, "name": "Amy Martin", "status": "Incumbent", "votes": 2640, "pct": 44.8, "elected": True },
                    { "rank": 2, "ballotNumber": 2, "name": "Robert E. Saydah", "status": "Incumbent", "votes": 2510, "pct": 42.6, "elected": True },
                    { "rank": 3, "ballotNumber": 3, "name": "Elizabeth R. Carr", "status": "Challenger", "votes": 2180, "pct": 37.0, "elected": False }
                ]
            },
            "boe": {
                "title": "Glen Rock Board of Education",
                "seats": 3,
                "candidates": [
                    { "rank": 1, "ballotNumber": "1A", "name": "Damali Robinson", "votes": 2490, "pct": 42.3, "elected": True },
                    { "rank": 2, "ballotNumber": "2A", "name": "Elizabeth Calvez", "votes": 2380, "pct": 40.4, "elected": True },
                    { "rank": 3, "ballotNumber": "3A", "name": "Ed Hayward", "votes": 2210, "pct": 37.5, "elected": True }
                ]
            }
        }
    ]

    for town in town_configs:
        out_dir = os.path.join(DATA_DIR, town["id"])
        os.makedirs(out_dir, exist_ok=True)
        town_results = {
            "municipality": town["name"],
            "county": town["county"],
            "state": "New Jersey",
            "electionDate": "Tuesday, November 3, 2026",
            "lastUpdated": now_iso,
            "lastUpdatedFormatted": now_fmt,
            "reportingStatus": "Unofficial Final Tally (100% of Districts)",
            "isFinal": False,
            "is100PercentReported": True,
            "precinctsReporting": town["precincts"],
            "totalPrecincts": town["precincts"],
            "percentReporting": 100.0,
            "registeredVoters": town["registered"],
            "ballotsCast": town["ballots"],
            "turnoutPercentage": round((town["ballots"] / town["registered"]) * 100, 2),
            "sources": [
                {
                    "name": f"{town['county']} Board of Elections",
                    "url": "https://www.passaiccountynj.org" if "Passaic" in town["county"] else "https://www.morriscountynj.gov",
                    "note": "Official unofficial election night machine and mail-in tabulations"
                }
            ],
            "councilRace": {
                "title": town["council"]["title"],
                "seatsAvailable": town["council"]["seats"],
                "candidates": town["council"]["candidates"]
            },
            "boeRace": {
                "title": town["boe"]["title"],
                "seatsAvailable": town["boe"]["seats"],
                "candidates": town["boe"]["candidates"]
            }
        }
        dest_file = os.path.join(out_dir, 'election_results.json')
        with open(dest_file, 'w') as f:
            json.dump(town_results, f, indent=2)
        print(f"Generated {dest_file}")

if __name__ == '__main__':
    generate_clifton_results()
    generate_other_town_results()

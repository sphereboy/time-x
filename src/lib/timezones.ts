interface City {
  name: string;
  country: string;
}

interface Timezone {
  name: string;
  abbreviations: string[];
  offset: number;
  cities: City[];
}

const timezones: Timezone[] = [
  {
    name: "Pacific Standard Time",
    abbreviations: ["PST", "PDT"],
    offset: -8,
    cities: [
      { name: "Los Angeles", country: "USA" },
      { name: "San Francisco", country: "USA" },
      { name: "Seattle", country: "USA" },
      { name: "Vancouver", country: "Canada" },
      { name: "Portland", country: "USA" },
    ],
  },
  {
    name: "Mountain Standard Time",
    abbreviations: ["MST", "MDT"],
    offset: -7,
    cities: [
      { name: "Denver", country: "USA" },
      { name: "Phoenix", country: "USA" },
      { name: "Salt Lake City", country: "USA" },
      { name: "Calgary", country: "Canada" },
      { name: "Edmonton", country: "Canada" },
    ],
  },
  {
    name: "Central Standard Time",
    abbreviations: ["CST", "CDT"],
    offset: -6,
    cities: [
      { name: "Chicago", country: "USA" },
      { name: "Dallas", country: "USA" },
      { name: "Mexico City", country: "Mexico" },
      { name: "Winnipeg", country: "Canada" },
      { name: "Guatemala City", country: "Guatemala" },
    ],
  },
  {
    name: "Eastern Standard Time",
    abbreviations: ["EST", "EDT"],
    offset: -5,
    cities: [
      { name: "New York", country: "USA" },
      { name: "Toronto", country: "Canada" },
      { name: "Miami", country: "USA" },
      { name: "Atlanta", country: "USA" },
      { name: "Havana", country: "Cuba" },
    ],
  },
  {
    name: "Greenwich Mean Time",
    abbreviations: ["GMT"],
    offset: 0,
    cities: [
      { name: "London", country: "UK" },
      { name: "Dublin", country: "Ireland" },
      { name: "Lisbon", country: "Portugal" },
      { name: "Reykjavik", country: "Iceland" },
      { name: "Accra", country: "Ghana" },
    ],
  },
  {
    name: "Central European Time",
    abbreviations: ["CET", "CEST"],
    offset: 1,
    cities: [
      { name: "Paris", country: "France" },
      { name: "Berlin", country: "Germany" },
      { name: "Rome", country: "Italy" },
      { name: "Madrid", country: "Spain" },
      { name: "Amsterdam", country: "Netherlands" },
    ],
  },
  {
    name: "Eastern European Time",
    abbreviations: ["EET", "EEST"],
    offset: 2,
    cities: [
      { name: "Athens", country: "Greece" },
      { name: "Helsinki", country: "Finland" },
      { name: "Cairo", country: "Egypt" },
      { name: "Bucharest", country: "Romania" },
      { name: "Kiev", country: "Ukraine" },
    ],
  },
  {
    name: "Japan Standard Time",
    abbreviations: ["JST"],
    offset: 9,
    cities: [
      { name: "Tokyo", country: "Japan" },
      { name: "Osaka", country: "Japan" },
      { name: "Sapporo", country: "Japan" },
      { name: "Seoul", country: "South Korea" },
      { name: "Pyongyang", country: "North Korea" },
    ],
  },
  {
    name: "Australian Eastern Standard Time",
    abbreviations: ["AEST", "AEDT"],
    offset: 10,
    cities: [
      { name: "Sydney", country: "Australia" },
      { name: "Melbourne", country: "Australia" },
      { name: "Brisbane", country: "Australia" },
      { name: "Canberra", country: "Australia" },
      { name: "Hobart", country: "Australia" },
    ],
  },
];

export default timezones;

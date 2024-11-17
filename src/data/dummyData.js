export const DUMMY_ISSUES = [
  {
    id: 1,
    title: "Broken Ramp",
    description: "The ramp at the corner of Main St and 5th Ave is unusable.",
    location: {
      address: "Main St & 5th Ave",
      coordinates: { lat: 40.7128, lng: -74.006 },
    },
    timestamp: "2024-11-16T08:42:00",
    category: "accessibility",
    severity: "high",
  },
  {
    id: 2,
    title: "Dangerous Intersection",
    description: "No stop signs at a busy crossing causing near misses.",
    location: {
      address: "Downtown District",
      coordinates: { lat: 40.7148, lng: -74.004 },
    },
    timestamp: "2024-11-12T09:15:00",
    category: "traffic",
    severity: "high",
  },
  {
    id: 3,
    title: "Road Construction",
    description: "Ongoing construction is narrowing lanes, causing delays.",
    location: {
      address: "Broadway & 3rd St",
      coordinates: { lat: 40.7138, lng: -74.002 },
    },
    timestamp: "2024-11-12T07:45:00",
    category: "sidewalk",
    severity: "medium",
  },
  {
    id: 4,
    title: "Overgrown Vegetation",
    description: "Bushes and trees are obstructing the sidewalk.",
    location: {
      address: "12th Ave & Lincoln St",
      coordinates: { lat: 40.7112, lng: -74.01 },
    },
    timestamp: "2024-11-12T06:50:00",
    category: "sidewalk",
    severity: "medium",
  },
  {
    id: 5,
    title: "Traffic Light Malfunction",
    description: "Signal stuck on red at Park Ave and 42nd St.",
    location: {
      address: "Park Ave & 42nd St",
      coordinates: { lat: 40.7508, lng: -73.987 },
    },
    timestamp: "2024-11-12T10:30:00",
    category: "traffic",
    severity: "low",
  },
  {
    id: 6,
    title: "Tree Blocking Road",
    description: "A large fallen tree is obstructing traffic.",
    location: {
      address: "Elm St & Oak Blvd",
      coordinates: { lat: 40.7056, lng: -74.011 },
    },
    timestamp: "2024-11-12T07:00:00",
    category: "traffic",
    severity: "high",
  },
];

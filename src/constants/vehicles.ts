interface IMakesAndModels {
  [key: string]: string[];
}

export const MAKES_AND_MODELS: IMakesAndModels = {
  "": [],
  BMW: ["X6"],
  Honda: ["Civic"],
  Hyundai: ["Elantra"],
  Mercedes: ["A Class"],
  Toyota: ["Corolla"],
};

const currentYear = new Date().getFullYear();
export const VEHICLE_YEARS = Array.from(
  { length: 100 },
  (_x, i) => currentYear - i
).map((year) => ({ label: year.toString(), value: year }));

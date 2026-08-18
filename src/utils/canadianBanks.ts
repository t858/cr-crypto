export interface CanadianBank {
  name: string;
  code: string;
  category: string;
}

export const CANADIAN_BANKS: CanadianBank[] = [
  // Big Six Banks
  { name: "Royal Bank of Canada (RBC)", code: "003", category: "Major Banks" },
  { name: "TD Canada Trust (TD)", code: "004", category: "Major Banks" },
  { name: "Scotiabank (Bank of Nova Scotia)", code: "002", category: "Major Banks" },
  { name: "Bank of Montreal (BMO)", code: "001", category: "Major Banks" },
  { name: "CIBC (Canadian Imperial Bank of Commerce)", code: "010", category: "Major Banks" },
  { name: "National Bank of Canada (NBC)", code: "006", category: "Major Banks" },

  // Mid-tier & Regional Banks
  { name: "Desjardins Group (Fédération des caisses Desjardins)", code: "815", category: "Regional Banks & Caisses" },
  { name: "Laurentian Bank of Canada", code: "039", category: "Regional Banks" },
  { name: "Canadian Western Bank (CWB)", code: "030", category: "Regional Banks" },
  { name: "ATB Financial", code: "219", category: "Regional Banks" },
  { name: "Manulife Bank of Canada", code: "540", category: "Digital & Direct Banks" },
  { name: "Canadian Tire Bank", code: "338", category: "Digital & Direct Banks" },
  { name: "Equitable Bank", code: "623", category: "Digital & Direct Banks" },
  { name: "EQ Bank", code: "623", category: "Digital & Direct Banks" },

  // Direct & Online Banks
  { name: "Tangerine Bank", code: "614", category: "Digital & Direct Banks" },
  { name: "Simplii Financial", code: "010", category: "Digital & Direct Banks" },
  { name: "Neo Financial", code: "888", category: "Digital & Direct Banks" },
  { name: "Wealthsimple Cash", code: "900", category: "Digital & Direct Banks" },
  { name: "Motusbank", code: "625", category: "Digital & Direct Banks" },

  // Major Credit Unions
  { name: "Vancity (Vancouver City Savings Credit Union)", code: "809", category: "Credit Unions" },
  { name: "Coast Capital Savings", code: "809", category: "Credit Unions" },
  { name: "Meridian Credit Union", code: "837", category: "Credit Unions" },
  { name: "Servus Credit Union", code: "899", category: "Credit Unions" },
  { name: "FirstOntario Credit Union", code: "837", category: "Credit Unions" },
  { name: "Conexus Credit Union", code: "889", category: "Credit Unions" },
  { name: "Steinbach Credit Union", code: "869", category: "Credit Unions" },
  { name: "Alterna Savings / Alterna Bank", code: "608", category: "Credit Unions" },

  // Specialized & International Subsidiaries
  { name: "First Nations Bank of Canada", code: "360", category: "Specialized Banks" },
  { name: "VersaBank", code: "340", category: "Specialized Banks" },
  { name: "Haventree Bank", code: "621", category: "Specialized Banks" },
  { name: "HSBC Bank Canada", code: "016", category: "International Banks" },
  { name: "ICICI Bank Canada", code: "308", category: "International Banks" },
  { name: "SBI Canada Bank (State Bank of India)", code: "240", category: "International Banks" },
  { name: "Bank of China (Canada)", code: "303", category: "International Banks" },
  { name: "Habib Canadian Bank", code: "330", category: "International Banks" },
  { name: "CTBC Bank Corp. (Canada)", code: "320", category: "International Banks" },
  { name: "KEB Hana Bank Canada", code: "270", category: "International Banks" },
  { name: "Shinhan Bank Canada", code: "343", category: "International Banks" },
  { name: "Other Canadian Bank / Credit Union", code: "999", category: "Other Institutions" },
];

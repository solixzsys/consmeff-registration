export interface AddressComponents {
  houseNumber?: string;
  streetName?: string;
  landmark?: string;
  city?: string;
}

export function parseAddress_old(address: string): AddressComponents {
  // Initialize components object
  const components: AddressComponents = {};

  // Split address into parts based on commas (common address format)
  const parts = address.split(',').map(part => part.trim());

  // Use regex to detect and extract fields
  for (const part of parts) {
    if (/^\d+/.test(part)) {
      // House number: starts with digits
      components.houseNumber = part;
    } else if (/city|town/i.test(part)) {
      // City: contains 'city' or 'town' (case insensitive)
      components.city = part;
    } else if (/landmark|near|opposite/i.test(part)) {
      // Landmark: contains keywords like 'landmark', 'near', or 'opposite'
      components.landmark = part;
    } else {
      // Street name: default for anything else
      components.streetName = part;
    }
  }

  return components;
}

export function parseAddress(address: string): AddressComponents {
  // Initialize components object
  const components: AddressComponents = {};

  // Split address into parts based on commas (common address format)
  const parts = address.split(',').map(part => part.trim());
  components.houseNumber = parts[0];
  components.streetName = parts[1];
  components.landmark = parts[2];
  components.city = parts[3];


  return components;
}

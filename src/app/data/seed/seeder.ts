const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

export interface TraceabilityEvent {
  eventtag: string;
  createdon: string;
  itemcount: number;
  readpoint: string;
  eventnote: string;
  codetype: 'sscc' | 'sgtin';
  eventstamp: string;
  parentid: boolean;
  haschildren: boolean;
  iscommissioned: boolean;
  epcelementstring: string;
}

class TraceabilitySeeder {
  private businessCases: string[] = [
    "Initial packaging of organic coffee beans for retail distribution",
    "Pharmaceutical batch encoding for temperature-sensitive vaccines",
    "Automotive parts serialization for recall traceability",
    "Electronics component tracking for supply chain visibility",
    "Fresh produce encoding for farm-to-table traceability",
    "Textile manufacturing batch identification for quality control",
    "Chemical product serialization for regulatory compliance",
    "Medical device encoding for patient safety tracking",
    "Luxury goods authentication for anti-counterfeiting",
    "Food packaging line encoding for expiration date management",
    "Industrial equipment part tracking for maintenance scheduling",
    "Cosmetic product batch encoding for ingredient transparency",
    "Agricultural seed lot identification for crop yield analysis",
    "Construction material tracking for building code compliance",
    "Battery pack serialization for recycling program tracking",
    "Petroleum product tank encoding for environmental monitoring",
    "Wine bottle encoding for vintage authenticity verification",
    "Toy manufacturing safety compliance tracking",
    "Sporting goods equipment serialization for warranty tracking",
    "Appliance component encoding for service history management",
    "Jewelry item authentication for insurance documentation",
    "Packaging material roll encoding for production line efficiency",
    "High-value artwork piece encoding for gallery insurance",
    "Laboratory sample container tracking for research integrity",
    "Optical lens manufacturing quality assurance encoding",
    "Frozen food product encoding for cold chain monitoring",
    "Solar panel module serialization for warranty and performance tracking",
    "Ceramic tile batch encoding for building material certification",
    "Musical instrument serialization for authenticity and resale value",
    "Paint can batch encoding for color consistency quality control",
    "Pharmaceutical vial encoding for dosage accuracy verification",
    "Furniture component tracking for assembly line optimization",
    "Book printing batch identification for copyright protection",
    "Steel beam encoding for structural integrity certification",
    "Glass container manufacturing defect prevention tracking",
    "Rubber gasket batch encoding for automotive seal quality",
    "Circuit board component traceability for electronic device repair",
    "Plastic resin pellet batch tracking for recycling compliance",
    "Adhesive tape roll encoding for manufacturing process control",
    "Metal fastener lot identification for aerospace quality standards",
    "Ceramic capacitor encoding for electronic component reliability",
    "Fabric bolt encoding for textile quality assurance tracking",
    "Semiconductor wafer tracking for chip manufacturing quality",
    "Food additive batch encoding for allergen management",
    "Tire manufacturing serialization for safety recall capability",
    "Optical fiber cable encoding for telecommunications infrastructure",
    "Concrete batch tracking for construction quality assurance",
    "Leather goods authentication for luxury brand protection",
    "Seed packet encoding for agricultural traceability programs",
    "Medical implant serialization for patient safety monitoring"
  ];

  private generateRandomUUID(): string {
    return crypto.randomUUID();
  }

  private generateRandomDateTime(): string {
    const now = new Date();
    const randomHours = Math.floor(Math.random() * 48); // Random within last 48 hours
    const randomMinutes = Math.floor(Math.random() * 60);
    const randomSeconds = Math.floor(Math.random() * 60);
    const randomMs = Math.floor(Math.random() * 1000);
    
    const randomDate = new Date(now.getTime() - (randomHours * 60 * 60 * 1000) - (randomMinutes * 60 * 1000) - (randomSeconds * 1000) - randomMs);
    return randomDate.toISOString();
  }

  private generateRandomItemCount(): number {
    const ranges = [
      { min: 1, max: 10, weight: 0.2 },
      { min: 11, max: 50, weight: 0.3 },
      { min: 51, max: 150, weight: 0.3 },
      { min: 151, max: 300, weight: 0.2 }
    ];
    
    const random = Math.random();
    let cumulativeWeight = 0;
    
    for (const range of ranges) {
      cumulativeWeight += range.weight;
      if (random <= cumulativeWeight) {
        return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
      }
    }
    
    return Math.floor(Math.random() * 100) + 1;
  }

  private generateRandomGLN(): string {
    // Generate 13-digit GLN (Global Location Number)
    const digits = [];
    for (let i = 0; i < 13; i++) {
      digits.push(Math.floor(Math.random() * 10));
    }
    return digits.join('');
  }

  private generateRandomEventNote(): string {
    return this.businessCases[Math.floor(Math.random() * this.businessCases.length)];
  }

  private generateRandomCodeType(): 'sscc' | 'sgtin' {
    return Math.random() < 0.5 ? 'sscc' : 'sgtin';
  }

  private generateRandomCommissionedStatus(): boolean {
    // 70% chance of being commissioned (true), 30% chance of not commissioned (false)
    return Math.random() < 0.7;
  }

  private generateRandomHashCode(): string {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 32; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  private generateRandomEPCElementString(codeType: 'sscc' | 'sgtin'): string {
    if (codeType === 'sscc') {
      // SSCC format: urn:epc:id:sscc:CompanyPrefix.SerialReference
      const companyPrefix = Math.floor(Math.random() * 9000000) + 1000000; // 7 digits
      const serialReference = Math.floor(Math.random() * 900000000000) + 100000000000; // 12 digits
      return `urn:epc:id:sscc:${companyPrefix}.${serialReference}`;
    } else {
      // SGTIN format: urn:epc:id:sgtin:CompanyPrefix.ItemReference.SerialNumber
      const companyPrefix = Math.floor(Math.random() * 9000000) + 1000000; // 7 digits
      const itemReference = Math.floor(Math.random() * 900000) + 100000; // 6 digits
      const serialNumber = Math.floor(Math.random() * 9000000000) + 1000000000; // 10 digits
      return `urn:epc:id:sgtin:${companyPrefix}.${itemReference}.${serialNumber}`;
    }
  }

  private generateTraceabilityEvent(): TraceabilityEvent {
    const codeType = this.generateRandomCodeType();
    
    return {
      eventtag: this.generateRandomUUID(),
      createdon: this.generateRandomDateTime(),
      itemcount: this.generateRandomItemCount(),
      readpoint: this.generateRandomGLN(),
      eventnote: this.generateRandomEventNote(),
      codetype: codeType,
      eventstamp: this.generateRandomHashCode(),
      parentid: false,
      haschildren: false,
      iscommissioned: this.generateRandomCommissionedStatus(),
      epcelementstring: this.generateRandomEPCElementString(codeType)
    };
  }

  public generateEvents(count: number = 50): TraceabilityEvent[] {
    const events: TraceabilityEvent[] = [];
    
    for (let i = 0; i < count; i++) {
      events.push(this.generateTraceabilityEvent());
    }
    
    return events;
  }

  private generateRandomFileName(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const randomString = Math.random().toString(36).substring(2, 8);
    return `traceability-events-${timestamp}-${randomString}.json`;
  }

  public async saveToFile(events: TraceabilityEvent[], outputDir: string = './output'): Promise<string> {
    try {
      // Create output directory if it doesn't exist
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      const fileName = this.generateRandomFileName();
      const filePath = path.join(outputDir, fileName);
      
      // Write JSON file with pretty formatting
      fs.writeFileSync(filePath, JSON.stringify(events, null, 2), 'utf8');
      
      console.log(`✅ Successfully generated ${events.length} traceability events`);
      console.log(`📁 File saved as: ${filePath}`);
      console.log(`📊 File size: ${(fs.statSync(filePath).size / 1024).toFixed(2)} KB`);
      
      return filePath;
    } catch (error) {
      console.error('❌ Error saving file:', error);
      throw error;
    }
  }

  public async run(count: number = 50, outputDir: string = './output'): Promise<void> {
    console.log(`🚀 Starting traceability events generation...`);
    console.log(`📝 Generating ${count} events`);
    
    const startTime = Date.now();
    
    try {
      const events = this.generateEvents(count);
      await this.saveToFile(events, outputDir);
      
      const endTime = Date.now();
      console.log(`⏱️  Generation completed in ${endTime - startTime}ms`);
      
      // Display sample statistics
      const ssgtnCount = events.filter(e => e.codetype === 'sgtin').length;
      const ssccCount = events.filter(e => e.codetype === 'sscc').length;
      const commissionedCount = events.filter(e => e.iscommissioned === true).length;
      const totalItems = events.reduce((sum, e) => sum + e.itemcount, 0);
      
      console.log(`\n📈 Statistics:`);
      console.log(`   - SGTIN events: ${ssgtnCount}`);
      console.log(`   - SSCC events: ${ssccCount}`);
      console.log(`   - Commissioned events: ${commissionedCount}`);
      console.log(`   - Non-commissioned events: ${count - commissionedCount}`);
      console.log(`   - Total item count: ${totalItems}`);
      console.log(`   - Average items per event: ${(totalItems / count).toFixed(2)}`);
      
    } catch (error) {
      console.error('❌ Generation failed:', error);
      throw error;
    }
  }
}

// Main execution
async function main() {
  const seeder = new TraceabilitySeeder();
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const countArg = args.find(arg => arg.startsWith('--count='));
  const outputArg = args.find(arg => arg.startsWith('--output='));
  
  const count = countArg ? parseInt(countArg.split('=')[1]) : 50;
  const outputDir = outputArg ? outputArg.split('=')[1] : './output';
  
  if (isNaN(count) || count <= 0) {
    console.error('❌ Invalid count parameter. Must be a positive number.');
    process.exit(1);
  }
  
  try {
    await seeder.run(count, outputDir);
  } catch (error) {
    console.error('❌ Seeder execution failed:', error);
    process.exit(1);
  }
}

// Export for use as module
module.exports = { TraceabilitySeeder };

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}
import mongoose, { mongo } from "mongoose";

const cveSchema = new mongoose.Schema({
  cve: {
    id: { type: String, required: true },
    sourceIdentifier: { type: String, required: true },
    published: { type: String, required: true }, 
    lastModified: { type: String, required: true }, 
    vulnStatus: { type: String, required: true },
    cveTags: { type: [String], default: [] },

    descriptions: [
      {
        lang: { type: String, required: true },
        value: { type: String, required: true },
      },
    ],

    metrics: {
      cvssMetricV2: [
        {
          source: { type: String, required: true },
          type: { type: String, required: true },
          cvssData: {
            version: { type: String, required: true },
            vectorString: { type: String, required: true },
            baseScore: { type: Number, required: true },
            accessVector: { type: String, required: true },
            accessComplexity: { type: String, required: true },
            authentication: { type: String, required: true },
            confidentialityImpact: { type: String, required: true },
            integrityImpact: { type: String, required: true },
            availabilityImpact: { type: String, required: true },
          },
          baseSeverity: { type: String, required: true },
          exploitabilityScore: { type: Number, required: true },
          impactScore: { type: Number, required: true },
          acInsufInfo: { type: Boolean, required: true },
          obtainAllPrivilege: { type: Boolean, required: true },
          obtainUserPrivilege: { type: Boolean, required: true },
          obtainOtherPrivilege: { type: Boolean, required: true },
          userInteractionRequired: { type: Boolean, required: true },
        },
      ],
    },

    weaknesses: [
      {
        source: { type: String, required: true },
        type: { type: String, required: true },
        description: [
          {
            lang: { type: String, required: true },
            value: { type: String, required: true },
          },
        ],
      },
    ],

    configurations: [
      {
        nodes: [
          {
            operator: { type: String, required: true },
            negate: { type: Boolean, required: true },
            cpeMatch: [
              {
                vulnerable: { type: Boolean, required: true },
                criteria: { type: String, required: true },
                matchCriteriaId: { type: String, required: true },
              },
            ],
          },
        ],
      },
    ],

    references: [
      {
        url: { type: String, required: true },
        source: { type: String, required: true },
      },
    ],
  },
});

const CVE = mongoose.model('CVE', cveSchema);
export default CVE;

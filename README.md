[![npm](https://img.shields.io/npm/v/swagger-schema-extractor)](https://www.npmjs.com/package/swagger-schema-extractor)

# Swagger Schema Extractor
Extract OpenAPI schemas into TypeScript types.

## Usage
### OpenAPI v3
```bash
npx swagger-schema-extractor http://localhost:3000/openapi.json > types.ts
```

### OpenAPI v2
npx swagger-schema-extractor http://localhost:3000/v2/swagger.json > types.ts

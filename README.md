# MS2WM Migration Command Center

An interactive web application for managing and monitoring Mule to webMethods migration projects.

## Features

### Complete Migration Journey
- **Stage 0: Repository Analysis** - Git repository scanning and Mule flow discovery
- **Stage 1: Inventory Dashboard** - Comprehensive analysis of all Mule assets (flows, connectors, endpoints)
- **Stage 2: Target Architecture** - webMethods service design with consolidation strategy
- **Stage 3: Asset Manifest** - Generated webMethods implementation artifacts
- **Stage 4: Runtime Configuration** - Environment-specific deployment settings
- **Stage 5: Cut-Over & Validation** - Testing results, runbook, and go-live procedures
- **Environments View** - Monitor deployments across dev, staging, and production

### JSON-Driven Data Architecture
All migration data is stored in structured JSON files that can be easily replaced with live API data.

### Demo Project
Includes a fully populated "Hotel System API" demo project with:
- 26 Mule flows consolidated into 15 webMethods services
- 3 Git repositories analyzed
- 8 database connectors
- 42 total webMethods assets
- Complete test results and migration runbook

## Getting Started

```bash
npm install
npm run dev
```

Build was successful! Navigate through the migration journey by clicking on stages and exploring all the JSON-driven data.

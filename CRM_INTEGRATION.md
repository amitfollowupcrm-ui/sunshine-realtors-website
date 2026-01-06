# 🔗 CRM Integration Strategy

## Overview

Sunshine Realtors Group integrates with external CRM systems for seamless lead management, sales pipeline tracking, and marketing attribution.

---

## Integration Architecture

### 1. **Event-Driven Sync Pattern**

```
┌─────────────────────────────────────────────────────────────┐
│              Sunshine Platform Events                       │
│                                                             │
│  • Property Created                                         │
│  • Property Updated                                         │
│  • Lead Created                                             │
│  • Lead Status Changed                                      │
│  • Inquiry Submitted                                        │
│  • Dealer Assigned                                          │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │      Event Bus (Redis)        │
        │                               │
        │  • Event Queue                │
        │  • Retry Logic                │
        │  • Dead Letter Queue          │
        └───────────────┬───────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │     CRM Sync Service          │
        │                               │
        │  • Transform Data             │
        │  • API Call                   │
        │  • Handle Response            │
        │  • Update Sync Status         │
        └───────────────┬───────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │      External CRM System      │
        │                               │
        │  REST API / Webhook           │
        └───────────────────────────────┘
```

---

## 2. **Data Mapping**

### Lead Mapping

| Sunshine Field | CRM Field | Notes |
|---------------|-----------|-------|
| `id` | `internalId` / `externalReference` | Bidirectional reference |
| `name` | `name` / `contactName` | |
| `email` | `email` | |
| `phone` | `phone` / `mobile` | |
| `source` | `leadSource` | Mapped to CRM source options |
| `status` | `stage` / `status` | Status mapping table required |
| `propertyId` | `relatedProperty` | Reference to property object |
| `assignedToId` | `assignedAgent` | CRM user/agent ID |
| `budgetMin/Max` | `budgetRange` | |
| `preferredLocation` | `preferredAreas` | Array/CSV |
| `utmSource` | `utmSource` | Marketing attribution |
| `createdAt` | `createdDate` | |
| `notes` | `notes` / `description` | |

### Property Mapping

| Sunshine Field | CRM Field | Notes |
|---------------|-----------|-------|
| `id` | `internalId` | |
| `title` | `name` / `title` | |
| `price` | `price` / `askingPrice` | |
| `city` | `location.city` | |
| `locality` | `location.locality` | |
| `status` | `status` | Active/Inactive/Sold |
| `ownerId` | `owner` | CRM contact/user reference |
| `dealerId` | `assignedAgent` | |

---

## 3. **Sync Flow**

### Outbound Sync (Sunshine → CRM)

1. **Event Triggered**
   - Property created/updated
   - Lead created/status changed
   - Inquiry submitted

2. **Enqueue Sync Job**
   - Add to Redis queue
   - Set priority (high/medium/low)
   - Include entity data

3. **Process Sync**
   - Transform data to CRM format
   - Make REST API call
   - Handle response

4. **Update Status**
   - Success: Mark as synced, store external ID
   - Failure: Increment retry count, schedule retry
   - Max retries: Move to dead letter queue

### Inbound Sync (CRM → Sunshine)

1. **Webhook Received**
   - Verify webhook secret
   - Validate payload
   - Parse event type

2. **Find Internal Entity**
   - Lookup by external ID
   - Create new if not found

3. **Update Internal Data**
   - Map CRM fields to Sunshine fields
   - Update entity
   - Log sync activity

---

## 4. **API Integration**

### REST API Client

```typescript
// Example CRM API calls

// Create Lead
POST /api/v1/leads
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "source": "website_inquiry",
  "status": "new",
  "budgetRange": { "min": 5000000, "max": 10000000 },
  "preferredAreas": ["Dwarka", "Gurgaon"],
  "externalReference": "sunshine_lead_uuid"
}

// Update Lead
PUT /api/v1/leads/{externalId}
{
  "status": "contacted",
  "assignedAgent": "crm_agent_id",
  "notes": "Customer interested in viewing"
}

// Webhook Registration
POST /api/v1/webhooks
{
  "url": "https://sunshinerealtors.com/api/crm/webhook",
  "events": ["lead.updated", "lead.status_changed"],
  "secret": "webhook_secret"
}
```

### Webhook Endpoint

```typescript
// Sunshine webhook handler
POST /api/crm/webhook
Headers:
  X-CRM-Secret: <secret>
  X-CRM-Event: lead.updated

Body:
{
  "event": "lead.updated",
  "entityId": "crm_lead_id",
  "data": {
    "status": "converted",
    "notes": "Property booked",
    "assignedAgent": "agent_123"
  }
}
```

---

## 5. **Status Mapping**

### Lead Status Mapping

| Sunshine Status | CRM Status | Action |
|----------------|-----------|---------|
| `NEW` | `new` / `inquiry` | Create new lead |
| `CONTACTED` | `contacted` / `in_progress` | Update lead |
| `QUALIFIED` | `qualified` / `hot` | Update lead |
| `VIEWING_SCHEDULED` | `viewing_scheduled` | Update lead + activity |
| `VIEWED` | `viewed` | Update lead + activity |
| `NEGOTIATING` | `negotiating` | Update lead |
| `CONVERTED` | `won` / `closed_won` | Update lead + create deal |
| `LOST` | `lost` / `closed_lost` | Update lead with reason |

---

## 6. **Retry & Error Handling**

### Retry Strategy

- **Initial Retry:** 1 second delay
- **Exponential Backoff:** 2s, 4s, 8s, 16s
- **Max Retries:** 5 attempts
- **Dead Letter Queue:** After max retries

### Error Handling

```typescript
// Error types
- Network Error → Retry
- 401 Unauthorized → Alert admin, disable sync
- 404 Not Found → Update external ID, retry create
- 422 Validation Error → Log, don't retry
- 429 Rate Limited → Backoff, retry
- 500 Server Error → Retry with backoff
```

### Monitoring

- **Sync Success Rate:** Track percentage of successful syncs
- **Average Sync Time:** Monitor latency
- **Failed Syncs:** Alert on high failure rate
- **Queue Depth:** Monitor queue size

---

## 7. **Performance Optimization**

### Batching

- Batch multiple updates together (if CRM supports)
- Reduce API calls
- Improve throughput

### Caching

- Cache CRM user/agent mappings
- Cache status mappings
- Cache configuration

### Async Processing

- All syncs happen asynchronously
- Don't block user requests
- Queue-based processing

---

## 8. **Testing Strategy**

### Unit Tests

- Data transformation functions
- Status mapping logic
- Error handling

### Integration Tests

- Mock CRM API
- Test webhook handling
- Test retry logic

### E2E Tests

- Full sync flow
- Bidirectional sync
- Error scenarios

---

## 9. **Configuration**

### Environment Variables

```env
CRM_ENABLED=true
CRM_API_URL=https://crm.example.com/api/v1
CRM_API_KEY=api_key_here
CRM_API_SECRET=api_secret_here
CRM_WEBHOOK_URL=https://sunshinerealtors.com/api/crm/webhook
CRM_WEBHOOK_SECRET=webhook_secret_here
CRM_TIMEOUT=30000
CRM_RETRY_ATTEMPTS=5
CRM_RETRY_DELAY=1000
```

### Status Mapping Config

Store in database or config file:

```json
{
  "leadStatusMapping": {
    "NEW": "new",
    "CONTACTED": "contacted",
    "CONVERTED": "won"
  }
}
```

---

## 10. **Security**

### Authentication

- API Key + Secret for REST API
- Webhook secret verification
- HTTPS only

### Data Protection

- Encrypt sensitive data in transit
- Don't log full payloads
- Sanitize user input

---

**Last Updated:** January 2025
**Status:** Implementation Ready


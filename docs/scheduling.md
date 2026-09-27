# Scheduling Rules

FROZEN scheduling logic for the Photography Studio Booking Platform.

## Core Rules

### Variable Duration
- Each package has its own `duration_minutes`
- Booking duration is determined by the selected package
- Duration can vary from 30 minutes to several hours

### Booking Grid
- All booking start times must align to a **15-minute grid**
- Valid start times: :00, :15, :30, :45
- Example: 10:00, 10:15, 10:30, 10:45, 11:00, etc.

### Post-Appointment Buffer
- Every confirmed appointment requires a **5-minute buffer AFTER** its end time
- This prevents back-to-back bookings with no transition time
- Buffer is included in overlap detection

### Cancellation Policy
- Customers can cancel up to **2 hours before** the appointment start time
- Cancellations within 2 hours are not allowed (business rule)

### Timezone Handling
- All datetimes stored in database as **UTC**
- Studio operates in **Asia/Kolkata** timezone (IST, UTC+5:30)
- Frontend must convert to/from IST for display
- Backend performs all calculations in UTC

## Availability Calculation

When checking if a photographer is available for a booking:

1. **Working Hours**: Check if the time falls within configured working hours for that day
2. **Blocked Periods**: Ensure no blocked periods overlap the requested time
3. **Existing Bookings**: Ensure no confirmed bookings overlap (including buffer)
4. **Package Duration**: Ensure full package duration + buffer fits in the slot

### Example

Package duration: 60 minutes  
Requested start: 2:00 PM  
Calculated end: 3:00 PM  
Buffer end: 3:05 PM  

The photographer must be:
- Available from 2:00 PM - 3:05 PM
- Not have working hours that end before 3:00 PM
- Not have any blocked periods overlapping 2:00 PM - 3:05 PM
- Not have any confirmed bookings overlapping 2:00 PM - 3:05 PM

## Double-Booking Prevention

### PostgreSQL is the Authority

The application uses PostgreSQL's **exclusion constraints** with **tstzrange** to guarantee no double-booking:

```sql
EXCLUDE USING gist (
    photographer_id WITH =,
    time_range WITH &&
) WHERE (status = 'confirmed')
```

### Range Format
- **Half-open range**: `[start, end + 5 minutes)`
- Includes the start time
- Excludes the end time
- Automatically includes the 5-minute buffer

### Conflict Handling
- If two simultaneous requests attempt overlapping bookings:
  - One transaction succeeds
  - The other receives a database constraint violation
  - Backend returns **HTTP 409 Conflict**
  - Frontend refreshes availability and shows updated slots

### Application-Level Checks
- Useful for UX (showing available slots)
- NOT the final authority on booking validity
- Database constraint is the single source of truth

## Implementation Notes

### Backend Responsibilities
1. Calculate `end_datetime` from `start_datetime` + package duration
2. Create PostgreSQL range: `[start_datetime, end_datetime + 5 minutes)`
3. Never accept `end_datetime` from client
4. Validate booking against working hours, blocks, and existing bookings
5. Let PostgreSQL enforce final overlap constraint

### Frontend Responsibilities
1. Display times in Asia/Kolkata timezone
2. Send UTC timestamps to backend
3. Show only 15-minute grid slots
4. Handle 409 Conflict by refreshing availability
5. Enforce 2-hour cancellation cutoff in UI

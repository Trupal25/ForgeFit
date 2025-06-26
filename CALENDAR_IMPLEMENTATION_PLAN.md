# 🗓️ Calendar Implementation Plan - ForgeFit

## 📋 Overview
Building a comprehensive calendar system with workout scheduling, streak tracking, and conflict detection.

## ✅ Current Status

### Database Schema (COMPLETED ✅)
- ✅ Enhanced `ScheduledEvent` model with recurring events, reminders
- ✅ Added `WorkoutStreak` model for proper streak tracking
- ✅ Database synced and operational

### Strategic Decision (COMPLETED ✅)
- ✅ **In-app calendar first** approach chosen
- ✅ Built for fitness-specific features
- ✅ Designed for eventual Google Calendar integration

## 🚀 Implementation Phases

### Phase 1: Core API Infrastructure (NEXT)

#### A. Calendar API Routes
```
/api/calendar/
├── GET    - Fetch events (with filters)
├── POST   - Create new event
├── PUT    - Update/Complete event  
└── DELETE - Remove event
```

#### B. Workout Scheduling API
```
/api/calendar/workout/
├── POST - Schedule existing workout
├── GET  - Get available time slots
└── PUT  - Reschedule workout
```

#### C. Streak Management API
```
/api/calendar/streak/
├── GET - Get current streak data
└── POST - Update streak (triggered by completions)
```

### Phase 2: Frontend Calendar Component (WEEK 2)

#### A. Calendar Views
- **Month View**: Overview with event dots
- **Week View**: Detailed scheduling interface  
- **Day View**: Hourly breakdown
- **Agenda View**: List of upcoming events

#### B. Event Management
- **Create Event Modal**: Schedule workouts/custom events
- **Event Details Modal**: View/Edit/Complete/Delete
- **Conflict Resolution**: Smart suggestions when conflicts arise
- **Drag & Drop**: Reschedule by dragging (v2 feature)

#### C. Streak Visualization
- **Streak Counter**: Current/longest streak display
- **Calendar Heatmap**: Color-coded completion status
- **Progress Rings**: Weekly goal completion

### Phase 3: Advanced Features (WEEK 3-4)

#### A. Smart Scheduling
- **Conflict Detection**: Real-time conflict checking
- **Time Slot Suggestions**: AI-powered optimal times
- **Recurring Events**: Daily/weekly/monthly patterns
- **Template Scheduling**: Save common workout schedules

#### B. Integration Features
- **Workout Library Integration**: Schedule from workout browser
- **Quick Create**: Create custom workouts during scheduling
- **Notification System**: Reminder alerts
- **Export Options**: ICS file generation

## 🛠️ Technical Implementation Details

### User Flows

#### Flow 1: Schedule Existing Workout
```
1. Browse Workouts → Select Workout → Click "Schedule"
2. Calendar Modal Opens → Pick Date/Time
3. System Checks Conflicts → Shows Available Slots
4. User Confirms → Event Created → Calendar Updates
```

#### Flow 2: Quick Schedule from Calendar
```
1. Calendar View → Click "+" on Date
2. Quick Create Modal → Select Workout Type
3. Choose from Recent/Favorites OR Create Custom
4. Set Time/Duration → Schedule Immediately
```

#### Flow 3: Complete Workout
```
1. Calendar View → Click on Scheduled Event
2. Event Details → Click "Mark Complete"
3. Optional: Rate workout, add notes
4. Streak Updates → History Records → UI Updates
```

### API Endpoints Design

#### GET /api/calendar
```typescript
// Query Parameters
{
  startDate?: string;    // YYYY-MM-DD
  endDate?: string;      // YYYY-MM-DD  
  month?: number;        // 1-12
  year?: number;         // YYYY
  eventType?: string;    // Workout | Meditation | Yoga
}

// Response
{
  success: boolean;
  data: ScheduledEvent[];
  stats: {
    totalEvents: number;
    completedEvents: number;
    completionRate: number;
  }
}
```

#### POST /api/calendar
```typescript
// Request Body
{
  title: string;
  description?: string;
  date: string;          // YYYY-MM-DD
  time: string;          // HH:MM
  duration: number;      // minutes
  eventType: 'Workout' | 'Meditation' | 'Yoga';
  workoutId?: number;
  meditationId?: number;
  yogaId?: number;
  reminderMinutes?: number;
  notes?: string;
  isRecurring?: boolean;
  recurringType?: 'daily' | 'weekly' | 'monthly';
  recurringUntil?: string;
}
```

### Database Queries Optimization

```sql
-- Monthly events with stats
SELECT 
  se.*,
  w.title as workout_title,
  w.duration as workout_duration,
  w.calories as workout_calories
FROM scheduled_events se
LEFT JOIN workouts w ON se.workout_id = w.id
WHERE se.user_id = ? 
  AND se.date >= ? 
  AND se.date <= ?
ORDER BY se.date ASC, se.time ASC;

-- Streak calculation
WITH daily_completions AS (
  SELECT 
    DATE(date) as workout_date,
    COUNT(*) as workouts_completed
  FROM scheduled_events 
  WHERE user_id = ? 
    AND event_type = 'Workout' 
    AND completed = true
  GROUP BY DATE(date)
  ORDER BY workout_date DESC
)
SELECT * FROM daily_completions;
```

### Frontend Component Structure

```
components/calendar/
├── CalendarView.tsx           # Main calendar container
├── MonthView.tsx             # Month grid display
├── WeekView.tsx              # Week timeline view
├── DayView.tsx               # Daily schedule view
├── EventModal.tsx            # Create/Edit event modal
├── EventCard.tsx             # Individual event display
├── ScheduleWorkoutModal.tsx  # Workout scheduling modal
├── ConflictResolver.tsx      # Handle scheduling conflicts
├── StreakDisplay.tsx         # Streak counter & visualization
└── CalendarStats.tsx         # Monthly/weekly statistics
```

## 🎯 Key Features Implementation

### 1. Conflict Detection Algorithm
```typescript
function checkConflict(newEvent: Event, existingEvents: Event[]): boolean {
  const newStart = new Date(`${newEvent.date}T${newEvent.time}`);
  const newEnd = new Date(newStart.getTime() + newEvent.duration * 60000);
  
  return existingEvents.some(existing => {
    const existingStart = new Date(`${existing.date}T${existing.time}`);
    const existingEnd = new Date(existingStart.getTime() + existing.duration * 60000);
    
    return newStart < existingEnd && newEnd > existingStart;
  });
}
```

### 2. Streak Calculation Logic
```typescript
function calculateStreak(completedWorkouts: Date[]): number {
  if (completedWorkouts.length === 0) return 0;
  
  let streak = 1;
  const sortedDates = completedWorkouts.sort((a, b) => b.getTime() - a.getTime());
  
  for (let i = 1; i < sortedDates.length; i++) {
    const daysDiff = Math.floor(
      (sortedDates[i-1].getTime() - sortedDates[i].getTime()) / (1000 * 60 * 60 * 24)
    );
    
    if (daysDiff === 1) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}
```

### 3. Smart Time Suggestions
```typescript
function suggestOptimalTimes(
  date: string, 
  duration: number, 
  userPreferences: UserPreferences,
  existingEvents: Event[]
): string[] {
  const suggestions = [];
  const preferredTimes = userPreferences.preferredWorkoutTimes; // e.g., ['07:00', '18:00']
  
  for (const time of preferredTimes) {
    if (!checkConflict({ date, time, duration }, existingEvents)) {
      suggestions.push(time);
    }
  }
  
  // Fallback to available slots
  if (suggestions.length === 0) {
    suggestions.push(...findAvailableSlots(date, duration, existingEvents));
  }
  
  return suggestions;
}
```

## 📱 UI/UX Considerations

### Design Principles
- **Fitness-First**: Design specifically for workout scheduling
- **Quick Actions**: Minimal clicks to schedule/complete
- **Visual Feedback**: Clear indication of completed vs scheduled
- **Conflict Prevention**: Proactive conflict detection with suggestions

### Mobile Responsiveness
- **Touch-Friendly**: Large tap targets for calendar dates
- **Swipe Navigation**: Month/week navigation via swipes
- **Modal Optimization**: Full-screen modals on mobile
- **Offline Support**: Cache events for offline viewing

### Accessibility
- **Keyboard Navigation**: Full keyboard support for calendar
- **Screen Reader**: Proper ARIA labels for calendar structure
- **Color Contrast**: High contrast for event indicators
- **Focus Management**: Logical tab order through calendar

## 🔗 Integration Points

### Existing Systems
- **Workout Library**: Schedule directly from workout cards
- **Dashboard**: Show upcoming events in dashboard
- **Progress Tracking**: Calendar completion feeds into progress
- **Notifications**: Integration with reminder system

### Future Integrations
- **Google Calendar**: Two-way sync capability
- **Apple HealthKit**: Sync completed workouts
- **Wearables**: Push workout schedules to devices
- **Social Features**: Share workout schedules with friends

## 📊 Analytics & Metrics

### Tracking Points
- **Scheduling Behavior**: Most popular workout times/days
- **Completion Rates**: Track adherence patterns
- **Streak Performance**: Monitor user engagement
- **Conflict Resolution**: How users handle scheduling conflicts

### Success Metrics
- **Calendar Adoption**: % of users who schedule workouts
- **Completion Rate**: % of scheduled workouts completed
- **Streak Length**: Average workout streak duration
- **User Retention**: Calendar usage impact on retention

## 🚦 Implementation Priority

### Week 1: Foundation
1. ✅ Database schema (COMPLETED)
2. 🔄 Core calendar API
3. 🔄 Basic calendar component

### Week 2: Core Features
1. Event CRUD operations
2. Conflict detection
3. Workout scheduling integration

### Week 3: Advanced Features
1. Streak tracking system
2. Recurring events
3. Smart time suggestions

### Week 4: Polish & Testing
1. Mobile optimization
2. Performance optimization
3. Comprehensive testing

## 🎮 Gamification Elements

### Streak Rewards
- **Fire Streaks**: Visual fire emoji for active streaks
- **Milestone Badges**: 7, 14, 30, 100 day achievements
- **Streak Recovery**: Grace period for missed days
- **Social Sharing**: Share streak achievements

### Visual Elements
- **Completion Heatmap**: GitHub-style contribution graph
- **Progress Rings**: Weekly goal completion visualization
- **Achievement Unlocks**: Calendar-based achievements
- **Level System**: User levels based on consistency

---

## 🎯 Next Steps

1. **Create Calendar API** (`/api/calendar/route.ts`)
2. **Build Calendar Component** (`CalendarView.tsx`)
3. **Implement Workout Scheduling** (Integration with existing workout system)
4. **Add Streak Tracking** (Visual streak counter)
5. **Mobile Optimization** (Responsive design)

Ready to start with Phase 1? 🚀 
// "use client";

// import { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import Button  from '@/components/ui/button';
// import { Calendar } from '@/components/ui/calendar';
// import { format } from 'date-fns';
// import { WorkoutItem } from '@/components/workouts/WorkoutCard';
// import { scheduleWorkout } from '@/lib/schedulingService';
// import { toast } from '@/components/ui/use-toast';

// interface ScheduleWorkoutModalProps {
//   workout: WorkoutItem;
//   isOpen: boolean;
//   onClose: () => void;
//   onScheduled: () => void;
// }

// export function ScheduleWorkoutModal({ 
//   workout, 
//   isOpen, 
//   onClose, 
//   onScheduled 
// }: ScheduleWorkoutModalProps) {
//   const [date, setDate] = useState<Date | undefined>(new Date());
//   const [time, setTime] = useState('08:00');
  
//   const handleSubmit = () => {
//     if (!date) {
//       toast({
//         title: 'Error',
//         description: 'Please select a date',
//         variant: 'destructive',
//       });
//       return;
//     }
    
//     // Format date for storage
//     const formattedDate = format(date, 'yyyy-MM-dd');
    
//     // Schedule the workout
//     scheduleWorkout(workout, formattedDate, time);
    
//     // Show success toast
//     toast({
//       title: 'Workout Scheduled',
//       description: `${workout.title} has been scheduled for ${format(date, 'EEEE, MMMM do')} at ${time}.`,
//     });
    
//     // Close modal and trigger callback
//     onClose();
//     onScheduled();
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Schedule Workout</DialogTitle>
//         </DialogHeader>
        
//         <div className="space-y-4 py-4">
//           <div>
//             <h3 className="text-lg font-medium">{workout.title}</h3>
//             <p className="text-sm text-muted-foreground">Duration: {workout.duration} minutes</p>
//           </div>
          
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Select Date</label>
//             <Calendar
//               mode="single"
//               selected={date}
//               onSelect={setDate}
//               initialFocus
//               className="rounded-md border"
//             />
//           </div>
          
//           <div className="space-y-2">
//             <label className="text-sm font-medium">Select Time</label>
//             <input
//               type="time"
//               value={time}
//               onChange={(e) => setTime(e.target.value)}
//               className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
//             />
//           </div>
//         </div>
        
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>Cancel</Button>
//           <Button onClick={handleSubmit}>Schedule</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// } 
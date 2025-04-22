import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a default user
  const defaultUser = await createUser();
  
  // Create exercises
  const exercises = await createExercises();
  
  // Create workouts and link them to exercises
  const workouts = await createWorkouts(exercises);
  
  // Create meditation sessions
  await createMeditationSessions();
  
  // Create yoga sessions
  await createYogaSessions();
  
  // Create recipes
  await createRecipes();
  
  // Create blogs
  await createBlogs();
  
  // Create achievements
  await createAchievements();
  
  // Schedule some workouts for the default user
  await scheduleWorkoutsForUser(defaultUser.id, workouts);
  
  console.log('✅ Seeding completed');
}

async function createUser() {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: 'trupal@example.com' }
  });
  
  if (existingUser) {
    console.log('👤 Default user already exists');
    return existingUser;
  }
  
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      name: 'Trupal Patel',
      firstName: 'Trupal',
      lastName: 'Patel',
      username: 'trupal25',
      email: 'trupal@example.com',
      password: hashedPassword,
      height: 175, // cm
      weight: 79, // kg
      goalWeight: 75, // kg
      dateOfBirth: new Date('1995-05-25'),
      gender: 'Male',
      fitnessLevel: 'Intermediate',
      settings: {
        create: {
          notificationsEnabled: true,
          emailNotifications: true,
          darkMode: false,
          language: 'en',
          measurementUnit: 'metric',
        }
      },
      weightHistory: {
        create: [
          { weight: 82, date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          { weight: 80.5, date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
          { weight: 79, date: new Date() }
        ]
      }
    }
  });
  
  console.log(`👤 Created default user: ${user.name}`);
  return user;
}

async function createExercises() {
  // Check if exercises already exist
  const exerciseCount = await prisma.exercise.count();
  
  if (exerciseCount > 0) {
    console.log('💪 Exercises already exist');
    return prisma.exercise.findMany();
  }
  
  const exerciseData = [
    {
      name: 'Push-Ups',
      description: 'A classic upper body exercise that targets the chest, shoulders, and triceps.',
      instructions: 'Start in a plank position with hands shoulder-width apart. Lower your body until your chest nearly touches the floor, then push back up.',
      muscleGroups: 'Chest,Shoulders,Triceps',
      equipment: 'None',
      difficultyLevel: 'Beginner',
      imageUrl: '/assets/exercises/push-up.jpg',
      videoUrl: '/assets/videos/push-up.mp4'
    },
    {
      name: 'Squats',
      description: 'A compound lower body exercise that targets the quadriceps, hamstrings, and glutes.',
      instructions: 'Stand with feet shoulder-width apart. Lower your body by bending your knees and hips, as if sitting in a chair. Keep your chest up and back straight.',
      muscleGroups: 'Quadriceps,Hamstrings,Glutes',
      equipment: 'None',
      difficultyLevel: 'Beginner',
      imageUrl: '/assets/exercises/squat.jpg',
      videoUrl: '/assets/videos/squat.mp4'
    },
    {
      name: 'Lunges',
      description: 'A unilateral lower body exercise that targets the quadriceps, hamstrings, and glutes.',
      instructions: 'Step forward with one leg and lower your body until both knees are bent at about 90 degrees. Push back up and repeat with the other leg.',
      muscleGroups: 'Quadriceps,Hamstrings,Glutes',
      equipment: 'None',
      difficultyLevel: 'Beginner',
      imageUrl: '/assets/exercises/lunge.jpg',
      videoUrl: '/assets/videos/lunge.mp4'
    },
    {
      name: 'Plank',
      description: 'A core exercise that also engages the shoulders, chest, and back.',
      instructions: 'Start in a push-up position, then drop to your forearms. Keep your body in a straight line from head to heels.',
      muscleGroups: 'Core,Shoulders',
      equipment: 'None',
      difficultyLevel: 'Beginner',
      imageUrl: '/assets/exercises/plank.jpg',
      videoUrl: '/assets/videos/plank.mp4'
    },
    {
      name: 'Dumbbell Rows',
      description: 'An upper body pulling exercise that targets the back and biceps.',
      instructions: 'With a dumbbell in one hand, bend at the hips with back flat. Pull the dumbbell up to your side, keeping your elbow close to your body.',
      muscleGroups: 'Back,Biceps',
      equipment: 'Dumbbells',
      difficultyLevel: 'Beginner',
      imageUrl: '/assets/exercises/dumbbell-row.jpg',
      videoUrl: '/assets/videos/dumbbell-row.mp4'
    }
  ];
  
  const exercises = await Promise.all(
    exerciseData.map(exercise => prisma.exercise.create({ data: exercise }))
  );
  
  console.log(`💪 Created ${exercises.length} exercises`);
  return exercises;
}

async function createWorkouts(exercises: any[]) {
  // Check if workouts already exist
  const workoutCount = await prisma.workout.count();
  
  if (workoutCount > 0) {
    console.log('🏋️ Workouts already exist');
    return prisma.workout.findMany();
  }
  
  const workoutData = [
    {
      title: 'Full Body HIIT',
      description: 'A high-intensity workout that targets your entire body.',
      category: 'HIIT',
      difficulty: 'Intermediate',
      duration: 30, // minutes
      calories: 350,
      muscleGroups: 'Full Body',
      imageUrl: '/assets/workouts/full-body-hiit.jpg',
      rating: 4.8,
      ratingCount: 24,
      exercises: {
        create: [
          { exerciseId: exercises[0].id, sets: 3, reps: '12-15', restTime: 30, order: 1 },
          { exerciseId: exercises[1].id, sets: 3, reps: '15', restTime: 30, order: 2 },
          { exerciseId: exercises[2].id, sets: 3, reps: '10 per leg', restTime: 30, order: 3 },
          { exerciseId: exercises[3].id, sets: 3, reps: '45 sec', restTime: 30, order: 4 }
        ]
      }
    },
    {
      title: 'Core Crusher',
      description: 'Strengthen your core and improve stability with this targeted ab workout.',
      category: 'Core',
      difficulty: 'Intermediate',
      duration: 25,
      calories: 220,
      muscleGroups: 'Abs,Obliques,Lower Back',
      imageUrl: '/assets/workouts/core-crusher.jpg',
      rating: 4.7,
      ratingCount: 15,
      exercises: {
        create: [
          { exerciseId: exercises[3].id, sets: 3, reps: '45 sec hold', restTime: 30, order: 1 },
          { exerciseId: exercises[3].id, sets: 3, reps: '30 sec (side)', restTime: 30, order: 2 }
        ]
      }
    },
    {
      title: 'Upper Body Strength',
      description: 'Build upper body strength with this targeted workout.',
      category: 'Strength',
      difficulty: 'Beginner',
      duration: 35,
      calories: 280,
      muscleGroups: 'Chest,Back,Shoulders,Arms',
      imageUrl: '/assets/workouts/upper-body.jpg',
      rating: 4.5,
      ratingCount: 18,
      exercises: {
        create: [
          { exerciseId: exercises[0].id, sets: 3, reps: '10-12', restTime: 60, order: 1 },
          { exerciseId: exercises[4].id, sets: 3, reps: '10-12', restTime: 60, order: 2 }
        ]
      }
    }
  ];
  
  const workouts = await Promise.all(
    workoutData.map(workout => prisma.workout.create({ data: workout }))
  );
  
  console.log(`🏋️ Created ${workouts.length} workouts`);
  return workouts;
}

async function createMeditationSessions() {
  // Check if meditation sessions already exist
  const meditationCount = await prisma.meditationSession.count();
  
  if (meditationCount > 0) {
    console.log('🧘 Meditation sessions already exist');
    return;
  }
  
  const meditationData = [
    {
      title: 'Morning Mindfulness',
      category: 'Mindfulness',
      duration: 10,
      level: 'Beginner',
      instructor: 'Sarah Johnson',
      description: 'Start your day with clarity and intention through this guided mindfulness practice.',
      rating: 4.8,
      ratingCount: 32,
      imageUrl: '/assets/meditations/morning-mindfulness.jpg',
      audioUrl: '/assets/audio/morning-mindfulness.mp3'
    },
    {
      title: 'Stress Relief Meditation',
      category: 'Stress Reduction',
      duration: 15,
      level: 'All Levels',
      instructor: 'Michael Chen',
      description: 'Release tension and calm your nervous system with this stress-reducing guided meditation.',
      rating: 4.7,
      ratingCount: 27,
      imageUrl: '/assets/meditations/stress-relief.jpg',
      audioUrl: '/assets/audio/stress-relief.mp3'
    },
    {
      title: 'Deep Sleep Relaxation',
      category: 'Sleep',
      duration: 20,
      level: 'All Levels',
      instructor: 'Emma Wilson',
      description: 'Prepare your mind and body for restful sleep with this calming bedtime meditation.',
      rating: 4.9,
      ratingCount: 41,
      imageUrl: '/assets/meditations/deep-sleep.jpg',
      audioUrl: '/assets/audio/deep-sleep.mp3'
    }
  ];
  
  const meditations = await Promise.all(
    meditationData.map(meditation => prisma.meditationSession.create({ data: meditation }))
  );
  
  console.log(`🧘 Created ${meditations.length} meditation sessions`);
}

async function createYogaSessions() {
  // Check if yoga sessions already exist
  const yogaCount = await prisma.yogaSession.count();
  
  if (yogaCount > 0) {
    console.log('🧘‍♀️ Yoga sessions already exist');
    return;
  }
  
  const yogaData = [
    {
      title: 'Morning Flow',
      style: 'Vinyasa',
      duration: 20,
      level: 'Beginner',
      instructor: 'Lily Patel',
      description: 'Start your day with this energizing morning flow to awaken your body and mind.',
      benefits: 'Increases energy and alertness,Improves circulation,Reduces morning stiffness',
      rating: 4.8,
      ratingCount: 29,
      imageUrl: '/assets/yoga/morning-flow.jpg',
      videoUrl: '/assets/videos/morning-flow.mp4'
    },
    {
      title: 'Gentle Hatha',
      style: 'Hatha',
      duration: 30,
      level: 'All Levels',
      instructor: 'Robert Chen',
      description: 'A gentle practice focusing on basic postures and alignment, perfect for beginners or those seeking a slower pace.',
      benefits: 'Improves flexibility,Builds strength gradually,Reduces stress',
      rating: 4.6,
      ratingCount: 24,
      imageUrl: '/assets/yoga/gentle-hatha.jpg',
      videoUrl: '/assets/videos/gentle-hatha.mp4'
    },
    {
      title: 'Power Yoga',
      style: 'Power',
      duration: 45,
      level: 'Intermediate',
      instructor: 'Marcus Johnson',
      description: 'A dynamic, fitness-based approach to vinyasa-style yoga, emphasizing strength and flexibility.',
      benefits: 'Builds core strength,Increases cardiovascular endurance,Improves balance and flexibility',
      rating: 4.9,
      ratingCount: 35,
      imageUrl: '/assets/yoga/power-yoga.jpg',
      videoUrl: '/assets/videos/power-yoga.mp4'
    }
  ];
  
  const yogaSessions = await Promise.all(
    yogaData.map(yoga => prisma.yogaSession.create({ data: yoga }))
  );
  
  console.log(`🧘‍♀️ Created ${yogaSessions.length} yoga sessions`);
}

async function createRecipes() {
  // Check if recipes already exist
  const recipeCount = await prisma.recipe.count();
  
  if (recipeCount > 0) {
    console.log('🍲 Recipes already exist');
    return;
  }
  
  // Create some ingredients first
  const ingredients = await Promise.all([
    prisma.ingredient.create({
      data: { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6 }
    }),
    prisma.ingredient.create({
      data: { name: 'Quinoa', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9 }
    }),
    prisma.ingredient.create({
      data: { name: 'Avocado', calories: 160, protein: 2, carbs: 8.5, fat: 14.7 }
    }),
    prisma.ingredient.create({
      data: { name: 'Black Beans', calories: 132, protein: 8.9, carbs: 23.7, fat: 0.5 }
    }),
    prisma.ingredient.create({
      data: { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 }
    })
  ]);
  
  const recipeData = [
    {
      title: 'Protein-Packed Quinoa Bowl',
      description: 'A nutritious and filling bowl that\'s perfect for a post-workout meal.',
      category: 'Lunch',
      difficulty: 'Easy',
      prepTime: 10,
      cookTime: 20,
      servings: 2,
      calories: 450,
      protein: 35,
      carbs: 48,
      fat: 14,
      tags: 'High Protein,Gluten-Free,Meal Prep Friendly',
      author: 'Nutrition Team',
      rating: 4.7,
      ratingCount: 28,
      imageUrl: '/assets/recipes/quinoa-bowl.jpg',
      ingredients: {
        create: [
          { ingredientId: ingredients[0].id, quantity: '200', unit: 'g' },
          { ingredientId: ingredients[1].id, quantity: '150', unit: 'g' },
          { ingredientId: ingredients[2].id, quantity: '1', unit: 'medium' }
        ]
      },
      instructions: {
        create: [
          { stepNumber: 1, instruction: 'Cook quinoa according to package instructions.' },
          { stepNumber: 2, instruction: 'Season chicken breast with salt and pepper, then grill until cooked through.' },
          { stepNumber: 3, instruction: 'Slice avocado and dice chicken.' },
          { stepNumber: 4, instruction: 'Combine all ingredients in a bowl and serve.' }
        ]
      }
    },
    {
      title: 'Greek Yogurt Parfait',
      description: 'A protein-rich breakfast that\'s quick to prepare and delicious.',
      category: 'Breakfast',
      difficulty: 'Easy',
      prepTime: 5,
      cookTime: 0,
      servings: 1,
      calories: 280,
      protein: 21,
      carbs: 32,
      fat: 7,
      tags: 'High Protein,Vegetarian,Quick',
      author: 'Nutrition Team',
      rating: 4.8,
      ratingCount: 32,
      imageUrl: '/assets/recipes/yogurt-parfait.jpg',
      ingredients: {
        create: [
          { ingredientId: ingredients[4].id, quantity: '200', unit: 'g' }
        ]
      },
      instructions: {
        create: [
          { stepNumber: 1, instruction: 'Layer Greek yogurt with berries and granola in a glass.' },
          { stepNumber: 2, instruction: 'Drizzle with honey if desired.' },
          { stepNumber: 3, instruction: 'Serve immediately or refrigerate for later.' }
        ]
      }
    }
  ];
  
  const recipes = await Promise.all(
    recipeData.map(recipe => prisma.recipe.create({ data: recipe }))
  );
  
  console.log(`🍲 Created ${recipes.length} recipes`);
}

async function createBlogs() {
  // Check if blogs already exist
  const blogCount = await prisma.blogPost.count();
  
  if (blogCount > 0) {
    console.log('📝 Blog posts already exist');
    return;
  }
  
  const blogData = [
    {
      title: 'The Benefits of High-Intensity Interval Training',
      content: `High-Intensity Interval Training (HIIT) has gained popularity in recent years for good reason. This form of exercise alternates between intense bursts of activity and fixed periods of less-intense activity or rest.

Here are some key benefits of incorporating HIIT into your fitness routine:

## 1. Efficient Workouts
HIIT workouts are typically shorter than traditional cardio sessions but can provide equal or greater benefits. Most HIIT sessions range from 10-30 minutes, making them perfect for busy schedules.

## 2. Burns More Calories
Due to the intense nature of the workouts, HIIT continues to burn calories long after you've finished exercising, thanks to the "afterburn effect" or excess post-exercise oxygen consumption (EPOC).

## 3. Improves Cardiovascular Health
Research shows that HIIT can improve heart health, increase VO2 max, and lower blood pressure as effectively as moderate-intensity continuous training.

## 4. Preserves Muscle Mass
Unlike traditional steady-state cardio, which can sometimes lead to muscle loss, HIIT helps preserve muscle while still promoting fat loss.

## 5. Versatile and Adaptable
HIIT can be applied to various exercises, from running and cycling to bodyweight movements, making it suitable for different fitness levels and preferences.

## Getting Started with HIIT
If you're new to HIIT, start with shorter intervals and longer rest periods. As your fitness improves, you can increase work intervals and decrease rest time.

A simple beginner HIIT workout might look like:
- 30 seconds of jumping jacks
- 30 seconds of rest
- 30 seconds of squats
- 30 seconds of rest
- 30 seconds of push-ups
- 30 seconds of rest
- 30 seconds of high knees
- 30 seconds of rest

Repeat this circuit 3-4 times for a quick, effective workout!

Remember, always warm up before starting HIIT and cool down afterward. And as with any exercise program, consult with a healthcare professional if you have any underlying health conditions.`,
      excerpt: 'Discover why High-Intensity Interval Training (HIIT) has become so popular and how it can transform your fitness routine in less time.',
      category: 'Fitness',
      tags: 'HIIT,Cardio,Workout Tips',
      author: 'Dr. Emma Reynolds',
      published: true,
      publishedAt: new Date(),
      imageUrl: '/assets/blogs/hiit-training.jpg'
    },
    {
      title: 'Nutrition Basics: Macronutrients Explained',
      content: `Understanding macronutrients is essential for anyone looking to improve their diet and achieve their fitness goals. Macronutrients—proteins, carbohydrates, and fats—are the nutrients your body needs in large amounts to function properly.

## Proteins
Proteins are the building blocks of muscle and are essential for recovery and growth. They're made up of amino acids, some of which your body can produce (non-essential) and others that must come from food (essential).

**Good sources of protein include:**
- Lean meats (chicken, turkey, lean beef)
- Fish and seafood
- Eggs
- Dairy products
- Legumes (beans, lentils)
- Tofu and tempeh

Aim for 1.6-2.2g of protein per kg of bodyweight if you're active and looking to build or maintain muscle.

## Carbohydrates
Carbs are your body's primary energy source, especially for high-intensity activities. They're stored in your muscles and liver as glycogen.

**Healthy carbohydrate sources include:**
- Whole grains (oats, brown rice, quinoa)
- Fruits
- Vegetables
- Legumes
- Sweet potatoes

The amount of carbs you need depends on your activity level, with more active individuals requiring more carbohydrates to fuel performance.

## Fats
Dietary fats play crucial roles in hormone production, brain function, and the absorption of fat-soluble vitamins. Contrary to old beliefs, healthy fats don't make you fat.

**Healthy fat sources include:**
- Avocados
- Nuts and seeds
- Olive oil
- Fatty fish (salmon, mackerel)
- Eggs

Fats are calorie-dense (9 calories per gram compared to 4 calories per gram for proteins and carbs), so portion control is important.

## Finding Your Macro Balance
The ideal macronutrient ratio varies based on your goals:
- **Fat loss:** Higher protein (30-35%), moderate fat (20-25%), moderate carbs (40-45%)
- **Muscle gain:** High protein (25-30%), moderate fat (20-25%), higher carbs (45-55%)
- **Athletic performance:** Moderate protein (20-25%), lower fat (15-20%), higher carbs (55-65%)

Remember, these are starting points. The best approach is to adjust based on how your body responds and how you feel.

## Beyond Macros: Don't Forget Micronutrients
While macros get a lot of attention, don't neglect micronutrients (vitamins and minerals) found in fruits, vegetables, and whole foods. These are essential for overall health and optimal functioning.

By understanding and properly balancing your macronutrients, you can fuel your body effectively for your specific goals and lifestyle.`,
      excerpt: 'Learn about proteins, carbohydrates, and fats - the essential macronutrients your body needs for optimal health and performance.',
      category: 'Nutrition',
      tags: 'Nutrition,Diet,Macros',
      author: 'Lisa Chen, RD',
      published: true,
      publishedAt: new Date(),
      imageUrl: '/assets/blogs/macronutrients.jpg'
    }
  ];
  
  const blogs = await Promise.all(
    blogData.map(blog => prisma.blogPost.create({ data: blog }))
  );
  
  console.log(`📝 Created ${blogs.length} blog posts`);
}

async function createAchievements() {
  // Check if achievements already exist
  const achievementCount = await prisma.achievement.count();
  
  if (achievementCount > 0) {
    console.log('🏆 Achievements already exist');
    return;
  }
  
  const achievementData = [
    {
      name: 'Early Bird',
      description: 'Complete 5 workouts before 8 AM',
      category: 'Consistency',
      imageUrl: '/assets/achievements/early-bird.png',
      criteria: JSON.stringify({
        type: 'workout_time',
        count: 5,
        beforeHour: 8
      })
    },
    {
      name: 'Strength Seeker',
      description: 'Complete 10 strength workouts',
      category: 'Workout',
      imageUrl: '/assets/achievements/strength.png',
      criteria: JSON.stringify({
        type: 'workout_category',
        category: 'Strength',
        count: 10
      })
    },
    {
      name: 'Mindfulness Master',
      description: 'Complete 15 meditation sessions',
      category: 'Meditation',
      imageUrl: '/assets/achievements/meditation.png',
      criteria: JSON.stringify({
        type: 'meditation_count',
        count: 15
      })
    },
    {
      name: 'Weight Goal',
      description: 'Reach your weight goal',
      category: 'Weight',
      imageUrl: '/assets/achievements/weight-goal.png',
      criteria: JSON.stringify({
        type: 'weight_goal'
      })
    },
    {
      name: 'Consistency King',
      description: 'Work out for 7 days in a row',
      category: 'Consistency',
      imageUrl: '/assets/achievements/consistency.png',
      criteria: JSON.stringify({
        type: 'streak',
        days: 7
      })
    }
  ];
  
  const achievements = await Promise.all(
    achievementData.map(achievement => prisma.achievement.create({ data: achievement }))
  );
  
  console.log(`🏆 Created ${achievements.length} achievements`);
}

async function scheduleWorkoutsForUser(userId: string, workouts: any[]) {
  // Check if user already has scheduled workouts
  const scheduledCount = await prisma.scheduledEvent.count({
    where: { userId }
  });
  
  if (scheduledCount > 0) {
    console.log('📅 User already has scheduled workouts');
    return;
  }
  
  // Schedule workouts for the next few days
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
  
  const scheduledWorkouts = await Promise.all([
    prisma.scheduledEvent.create({
      data: {
        userId,
        title: workouts[0].title,
        date: tomorrow,
        time: '07:30 AM',
        duration: workouts[0].duration,
        eventType: 'Workout',
        workoutId: workouts[0].id,
        completed: false
      }
    }),
    prisma.scheduledEvent.create({
      data: {
        userId,
        title: workouts[1].title,
        date: dayAfterTomorrow,
        time: '06:00 PM',
        duration: workouts[1].duration,
        eventType: 'Workout',
        workoutId: workouts[1].id,
        completed: false
      }
    })
  ]);
  
  console.log(`📅 Scheduled ${scheduledWorkouts.length} workouts for user`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 

Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  name: 'name',
  firstName: 'firstName',
  lastName: 'lastName',
  username: 'username',
  email: 'email',
  emailVerified: 'emailVerified',
  password: 'password',
  image: 'image',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  height: 'height',
  weight: 'weight',
  goalWeight: 'goalWeight',
  dateOfBirth: 'dateOfBirth',
  gender: 'gender',
  fitnessLevel: 'fitnessLevel',
  memberSince: 'memberSince'
};

exports.Prisma.UserSettingsScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  notificationsEnabled: 'notificationsEnabled',
  emailNotifications: 'emailNotifications',
  darkMode: 'darkMode',
  language: 'language',
  measurementUnit: 'measurementUnit',
  privacySettings: 'privacySettings'
};

exports.Prisma.WorkoutScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  category: 'category',
  difficulty: 'difficulty',
  duration: 'duration',
  calories: 'calories',
  muscleGroups: 'muscleGroups',
  imageUrl: 'imageUrl',
  videoUrl: 'videoUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  rating: 'rating',
  ratingCount: 'ratingCount'
};

exports.Prisma.ExerciseScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  instructions: 'instructions',
  muscleGroups: 'muscleGroups',
  equipment: 'equipment',
  difficultyLevel: 'difficultyLevel',
  imageUrl: 'imageUrl',
  videoUrl: 'videoUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WorkoutExerciseScalarFieldEnum = {
  id: 'id',
  workoutId: 'workoutId',
  exerciseId: 'exerciseId',
  sets: 'sets',
  reps: 'reps',
  weight: 'weight',
  restTime: 'restTime',
  notes: 'notes',
  order: 'order'
};

exports.Prisma.MeditationSessionScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  category: 'category',
  duration: 'duration',
  level: 'level',
  instructor: 'instructor',
  audioUrl: 'audioUrl',
  imageUrl: 'imageUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  rating: 'rating',
  ratingCount: 'ratingCount'
};

exports.Prisma.YogaSessionScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  style: 'style',
  duration: 'duration',
  level: 'level',
  instructor: 'instructor',
  benefits: 'benefits',
  videoUrl: 'videoUrl',
  imageUrl: 'imageUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  rating: 'rating',
  ratingCount: 'ratingCount'
};

exports.Prisma.RecipeScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  category: 'category',
  difficulty: 'difficulty',
  prepTime: 'prepTime',
  cookTime: 'cookTime',
  servings: 'servings',
  calories: 'calories',
  protein: 'protein',
  carbs: 'carbs',
  fat: 'fat',
  tags: 'tags',
  imageUrl: 'imageUrl',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  rating: 'rating',
  ratingCount: 'ratingCount',
  author: 'author'
};

exports.Prisma.IngredientScalarFieldEnum = {
  id: 'id',
  name: 'name',
  calories: 'calories',
  protein: 'protein',
  carbs: 'carbs',
  fat: 'fat'
};

exports.Prisma.RecipeIngredientScalarFieldEnum = {
  id: 'id',
  recipeId: 'recipeId',
  ingredientId: 'ingredientId',
  quantity: 'quantity',
  unit: 'unit'
};

exports.Prisma.RecipeInstructionScalarFieldEnum = {
  id: 'id',
  recipeId: 'recipeId',
  stepNumber: 'stepNumber',
  instruction: 'instruction'
};

exports.Prisma.BlogPostScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  excerpt: 'excerpt',
  category: 'category',
  tags: 'tags',
  imageUrl: 'imageUrl',
  author: 'author',
  published: 'published',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  publishedAt: 'publishedAt'
};

exports.Prisma.ScheduledEventScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  title: 'title',
  date: 'date',
  time: 'time',
  duration: 'duration',
  eventType: 'eventType',
  completed: 'completed',
  notes: 'notes',
  workoutId: 'workoutId',
  meditationId: 'meditationId',
  yogaId: 'yogaId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.WorkoutHistoryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  workoutId: 'workoutId',
  completedAt: 'completedAt',
  duration: 'duration',
  notes: 'notes',
  rating: 'rating',
  exerciseResults: 'exerciseResults'
};

exports.Prisma.FavoriteWorkoutScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  workoutId: 'workoutId',
  addedAt: 'addedAt'
};

exports.Prisma.FavoriteMeditationScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  meditationId: 'meditationId',
  addedAt: 'addedAt'
};

exports.Prisma.FavoriteYogaSessionScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  yogaId: 'yogaId',
  addedAt: 'addedAt'
};

exports.Prisma.FavoriteRecipeScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  recipeId: 'recipeId',
  addedAt: 'addedAt'
};

exports.Prisma.WeightHistoryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  weight: 'weight',
  date: 'date',
  notes: 'notes'
};

exports.Prisma.AchievementScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  category: 'category',
  imageUrl: 'imageUrl',
  criteria: 'criteria'
};

exports.Prisma.UserAchievementScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  achievementId: 'achievementId',
  achievedAt: 'achievedAt'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.JsonNullValueInput = {
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};


exports.Prisma.ModelName = {
  User: 'User',
  UserSettings: 'UserSettings',
  Workout: 'Workout',
  Exercise: 'Exercise',
  WorkoutExercise: 'WorkoutExercise',
  MeditationSession: 'MeditationSession',
  YogaSession: 'YogaSession',
  Recipe: 'Recipe',
  Ingredient: 'Ingredient',
  RecipeIngredient: 'RecipeIngredient',
  RecipeInstruction: 'RecipeInstruction',
  BlogPost: 'BlogPost',
  ScheduledEvent: 'ScheduledEvent',
  WorkoutHistory: 'WorkoutHistory',
  FavoriteWorkout: 'FavoriteWorkout',
  FavoriteMeditation: 'FavoriteMeditation',
  FavoriteYogaSession: 'FavoriteYogaSession',
  FavoriteRecipe: 'FavoriteRecipe',
  WeightHistory: 'WeightHistory',
  Achievement: 'Achievement',
  UserAchievement: 'UserAchievement'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
